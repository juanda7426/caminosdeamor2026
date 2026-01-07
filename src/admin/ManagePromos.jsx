import { useState, useEffect } from "react";
import { db, storage } from "../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ModalPromos from "../components/modales/ModalPromos";
import logo from "../img/logoLov.jpg";

const ManagePromos = () => {
	const [promos, setPromos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newPromo, setNewPromo] = useState({
		title: "",
		description: "",
		image: "",
		isActive: true,
	});
	const [imageFile, setImageFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");

	const promosCollectionRef = collection(db, "promotions");
	const CACHE_KEY = "promos_cache";

	//************************ */
	// Cache Helper Functions
	const savePromosToCache = (promosData) => {
		try {
			const cacheData = {
				data: promosData,
				timestamp: new Date().getTime(),
			};
			localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
		} catch (error) {
			console.error("Error saving to cache:", error);
		}
	};

	const getPromosFromCache = () => {
		try {
			const cached = localStorage.getItem(CACHE_KEY);
			if (cached) {
				const { data } = JSON.parse(cached);
				return data;
			}
		} catch (error) {
			console.error("Error reading from cache:", error);
		}
		return null;
	};

	// Fetch Promos
	const getPromos = async (forceRefresh = false) => {
		setLoading(true);
		try {
			// Try to load from cache first if not forcing refresh
			if (!forceRefresh) {
				const cachedPromos = getPromosFromCache();
				if (cachedPromos) {
					setPromos(cachedPromos);
					setLoading(false);
					// Optionally fetch in background to update cache
					fetchAndUpdateCache();
					return;
				}
			}

			// Fetch from Firebase
			const data = await getDocs(promosCollectionRef);
			const promosData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			setPromos(promosData);
			savePromosToCache(promosData);
		} catch (error) {
			console.error("Error al obtener promociones:", error);
			// Try to use cache as fallback
			const cachedPromos = getPromosFromCache();
			if (cachedPromos) {
				setPromos(cachedPromos);
			}
		} finally {
			setLoading(false);
		}
	};

	// Background fetch to update cache
	const fetchAndUpdateCache = async () => {
		try {
			const data = await getDocs(promosCollectionRef);
			const promosData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			savePromosToCache(promosData);
			// Update state only if data changed
			setPromos(promosData);
		} catch (error) {
			console.error("Error updating cache:", error);
		}
	};

	// Helper function to delete image from Firebase Storage
	const deleteImageFromStorage = async (imageUrl) => {
		if (!imageUrl) return;
		try {
			// Extract the path from the Firebase Storage URL
			// URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
			const decodedUrl = decodeURIComponent(imageUrl);
			const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
			if (pathMatch && pathMatch[1]) {
				const imagePath = pathMatch[1];
				const imageRef = ref(storage, imagePath);
				await deleteObject(imageRef);
				console.log("Image deleted from storage:", imagePath);
			}
		} catch (error) {
			console.error("Error deleting image from storage:", error);
			// Don't throw error, just log it - we don't want to block the operation
		}
	};

	useEffect(() => {
		getPromos();
	}, []);

	// Handle Image Selection
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	// Create or Update Promo
	const handleSubmit = async (formData, imageFileFromModal) => {
		if (!formData.title || !formData.description) return alert("Llena todos los campos");

		setUploading(true);
		try {
			let imageUrl = formData.image;
			let oldImageUrl = null;

			// If editing and uploading a new image, save the old URL for deletion
			if (editingId && imageFileFromModal && formData.image) {
				oldImageUrl = formData.image;
			}

			// Upload image if a new one is selected
			if (imageFileFromModal) {
				const storageRef = ref(storage, `promotions/${Date.now()}_${imageFileFromModal.name}`);
				await uploadBytes(storageRef, imageFileFromModal);
				imageUrl = await getDownloadURL(storageRef);
			}

			const promoData = {
				title: formData.title,
				description: formData.description,
				image: imageUrl,
				isActive: formData.isActive,
				updatedAt: new Date(),
			};

			if (editingId) {
				const promoDoc = doc(db, "promotions", editingId);
				await updateDoc(promoDoc, promoData);

				// Delete old image from storage if a new one was uploaded
				if (oldImageUrl && imageFileFromModal) {
					await deleteImageFromStorage(oldImageUrl);
				}

				alert("Promoción actualizada con éxito!");
			} else {
				await addDoc(promosCollectionRef, { ...promoData, createdAt: new Date() });
				alert("Promoción agregada!");
			}

			resetForm();
			setIsModalOpen(false);
			getPromos(true); // Force refresh from Firebase after changes
		} catch (error) {
			console.error("Error al guardar:", error);
			alert("Error al guardar la promoción");
		} finally {
			setUploading(false);
		}
	};

	const resetForm = () => {
		setNewPromo({ title: "", description: "", image: "", isActive: true });
		setImageFile(null);
		setPreviewUrl("");
		setEditingId(null);
	};

	// Start Editing
	const startEdit = (promo) => {
		setEditingId(promo.id);
		setNewPromo({
			title: promo.title,
			description: promo.description,
			image: promo.image,
			isActive: promo.isActive ?? true,
		});
		setPreviewUrl(promo.image);
		setIsModalOpen(true);
	};

	// Toggle Status
	const toggleStatus = async (id, currentStatus) => {
		try {
			const promoDoc = doc(db, "promotions", id);
			await updateDoc(promoDoc, { isActive: !currentStatus });
			getPromos(true); // Force refresh from Firebase after changes
		} catch (error) {
			console.error("Error toggling status:", error);
		}
	};

	// Delete Promo
	const deletePromo = async (id) => {
		if (window.confirm("¿Seguro que quieres eliminar esta promo?")) {
			try {
				// Find the promo to get its image URL
				const promoToDelete = promos.find((p) => p.id === id);

				// Delete the document from Firestore
				await deleteDoc(doc(db, "promotions", id));

				// Delete the image from storage if it exists
				if (promoToDelete && promoToDelete.image) {
					await deleteImageFromStorage(promoToDelete.image);
				}

				getPromos(true); // Force refresh from Firebase after changes
			} catch (error) {
				console.error("Error al eliminar:", error);
			}
		}
	};

	//************************ */
	return (
		<div style={{ padding: "20px" }}>
			<div className='d-flex justify-content-between align-items-center mb-4'>
				<h1 className='fw-bold main-color mb-0'>Panel de Promociones</h1>
				<button
					className='btn btn-primary'
					style={{ backgroundColor: "#0087b7", border: "none" }}
					onClick={() => {
						resetForm();
						setIsModalOpen(true);
					}}>
					<i className='fas fa-plus me-2'></i>
					Nueva Promoción
				</button>
			</div>

			<div className='row g-4'>
				{/* List Section */}
				<div className='col-12'>
					<h3 className='mb-4'>Promociones Existentes ({promos.length})</h3>
					{loading ? (
						<div className='text-center py-5'>
							<div className='spinner-border text-primary' role='status'></div>
						</div>
					) : (
						<div className='row g-3'>
							{promos.map((promo) => (
								<div key={promo.id} className='col-md-6'>
									<div className='card shadow-sm border-0 overflow-hidden h-100 position-relative'>
										<div className='row g-0'>
											<div className='col-md-4' style={{ height: "150px" }}>
												<img
													src={promo.image ? promo.image : "../img/logoLov.jpg"}
													alt={promo.title}
													className='w-100 h-100'
													style={{ objectFit: "cover" }}
												/>
											</div>
											<div className='col-md-8 px-3 py-2 d-flex flex-column justify-content-between'>
												<div>
													<div className='d-flex justify-content-between align-items-start'>
														<h5 className='fw-bold mb-1'>{promo.title}</h5>
														<span className={`badge ${promo.isActive ? "bg-success" : "bg-secondary"}`}>
															{promo.isActive ? "Activa" : "Inactiva"}
														</span>
													</div>
													<p
														className='small text-muted mb-2'
														style={{
															display: "-webkit-box",
															WebkitLineClamp: "2",
															WebkitBoxOrient: "vertical",
															overflow: "hidden",
														}}>
														{promo.description}
													</p>
												</div>
												<div className='d-flex gap-1'>
													<button
														className='btn btn-sm btn-light text-primary border-0'
														onClick={() => startEdit(promo)}
														title='Editar'
														style={{
															width: "32px",
															height: "32px",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															borderRadius: "8px",
														}}>
														<i className='fas fa-pencil-alt' style={{ fontSize: "0.85rem" }}></i>
													</button>
													<button
														className={`btn btn-sm btn-light border-0 ${promo.isActive ? "text-warning" : "text-success"}`}
														onClick={() => toggleStatus(promo.id, promo.isActive)}
														title={promo.isActive ? "Desactivar" : "Activar"}
														style={{
															width: "32px",
															height: "32px",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															borderRadius: "8px",
														}}>
														<i className={`fas ${promo.isActive ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "0.85rem" }}></i>
													</button>
													<button
														className='btn btn-sm btn-light text-danger border-0'
														onClick={() => deletePromo(promo.id)}
														title='Eliminar'
														style={{
															width: "32px",
															height: "32px",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															borderRadius: "8px",
														}}>
														<i className='fas fa-trash-alt' style={{ fontSize: "0.85rem" }}></i>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
							{promos.length === 0 && (
								<div className='text-center py-5 bg-light rounded border'>
									<p className='mb-0'>Aún no hay promociones configuradas.</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Modal */}
			<ModalPromos
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					resetForm();
				}}
				promoData={editingId ? newPromo : null}
				onSave={handleSubmit}
			/>
		</div>
	);
};

export default ManagePromos;
