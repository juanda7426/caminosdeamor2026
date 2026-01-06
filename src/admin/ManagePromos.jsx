import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ManagePromos = () => {
	const [promos, setPromos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [newPromo, setNewPromo] = useState({
		title: "",
		description: "",
		image: "",
		isActive: true,
	});
	const [imageFile, setImageFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");

	const promosCollectionRef = collection(db, "promotions");

	// Fetch Promos
	const getPromos = async () => {
		setLoading(true);
		try {
			const data = await getDocs(promosCollectionRef);
			setPromos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		} catch (error) {
			console.error("Error al obtener promociones:", error);
		} finally {
			setLoading(false);
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
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newPromo.title || !newPromo.description) return alert("Llena todos los campos");

		setUploading(true);
		try {
			let imageUrl = newPromo.image;

			// Upload image if a new one is selected
			if (imageFile) {
				const storageRef = ref(storage, `promotions/${Date.now()}_${imageFile.name}`);
				await uploadBytes(storageRef, imageFile);
				imageUrl = await getDownloadURL(storageRef);
			}

			const promoData = {
				...newPromo,
				image: imageUrl,
				updatedAt: new Date(),
			};

			if (editingId) {
				const promoDoc = doc(db, "promotions", editingId);
				await updateDoc(promoDoc, promoData);
				alert("Promoción actualizada con éxito!");
			} else {
				await addDoc(promosCollectionRef, { ...promoData, createdAt: new Date() });
				alert("Promoción agregada!");
			}

			resetForm();
			getPromos();
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
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Toggle Status
	const toggleStatus = async (id, currentStatus) => {
		try {
			const promoDoc = doc(db, "promotions", id);
			await updateDoc(promoDoc, { isActive: !currentStatus });
			getPromos();
		} catch (error) {
			console.error("Error toggling status:", error);
		}
	};

	// Delete Promo
	const deletePromo = async (id) => {
		if (window.confirm("¿Seguro que quieres eliminar esta promo?")) {
			try {
				await deleteDoc(doc(db, "promotions", id));
				getPromos();
			} catch (error) {
				console.error("Error al eliminar:", error);
			}
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1 className='fw-bold main-color mb-4'>Panel de Promociones</h1>

			<div className='row g-4'>
				{/* Formulario Section */}
				<div className='col-lg-5'>
					<div className='card shadow-sm border-0 p-4 sticky-top' style={{ top: "20px" }}>
						<h3 className='mb-4'>{editingId ? "Editar Promoción" : "Nueva Promoción"}</h3>
						<form onSubmit={handleSubmit}>
							<div className='mb-3'>
								<label className='form-label fw-bold'>Título</label>
								<input
									className='form-control'
									type='text'
									placeholder='Ej: Promo San Valentín'
									value={newPromo.title}
									onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
									required
								/>
							</div>
							<div className='mb-3'>
								<label className='form-label fw-bold'>Descripción</label>
								<textarea
									className='form-control'
									rows='3'
									placeholder='Detalles de la promoción...'
									value={newPromo.description}
									onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
									required></textarea>
							</div>
							<div className='mb-3'>
								<label className='form-label fw-bold'>Imagen de la Promo</label>
								<input className='form-control' type='file' accept='image/*' onChange={handleImageChange} />
								{previewUrl && (
									<div className='mt-3 text-center border rounded p-2 bg-light'>
										<p className='small text-muted mb-2'>Previsualización:</p>
										<img src={previewUrl} alt='Preview' style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
									</div>
								)}
							</div>
							<div className='d-flex gap-2 mt-4'>
								<button
									type='submit'
									className='btn btn-primary flex-grow-1'
									disabled={uploading}
									style={{ backgroundColor: "#0087b7", border: "none" }}>
									{uploading ? "Guardando..." : editingId ? "Actualizar" : "Publicar"}
								</button>
								{editingId && (
									<button type='button' className='btn btn-outline-secondary' onClick={resetForm}>
										Cancelar
									</button>
								)}
							</div>
						</form>
					</div>
				</div>

				{/* List Section */}
				<div className='col-lg-7'>
					<h3 className='mb-4'>Promociones Existentes ({promos.length})</h3>
					{loading ? (
						<div className='text-center py-5'>
							<div className='spinner-border text-primary' role='status'></div>
						</div>
					) : (
						<div className='row g-3'>
							{promos.map((promo) => (
								<div key={promo.id} className='col-12'>
									<div className='card shadow-sm border-0 overflow-hidden h-100 position-relative'>
										<div className='row g-0'>
											<div className='col-md-4' style={{ height: "150px" }}>
												<img src={promo.image} alt={promo.title} className='w-100 h-100' style={{ objectFit: "cover" }} />
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
		</div>
	);
};

export default ManagePromos;
