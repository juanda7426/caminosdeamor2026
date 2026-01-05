import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const ManagePromos = () => {
	const [promos, setPromos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newPromo, setNewPromo] = useState({
		title: "",
		description: "",
		image: "",
	});

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Create Promo
	const createPromo = async (e) => {
		e.preventDefault();
		if (!newPromo.title || !newPromo.description) return alert("Llena todos los campos");

		try {
			await addDoc(promosCollectionRef, newPromo);
			alert("Promoción agregada!");
			setNewPromo({ title: "", description: "", image: "" });
			getPromos();
		} catch (error) {
			console.error("Error al crear:", error);
		}
	};

	// Delete Promo
	const deletePromo = async (id) => {
		const confirm = window.confirm("¿Seguro que quieres eliminar esta promo?");
		if (confirm) {
			try {
				const promoDoc = doc(db, "promotions", id);
				await deleteDoc(promoDoc);
				getPromos();
			} catch (error) {
				console.error("Error al eliminar:", error);
			}
		}
	};

	return (
		<div>
			<h1>Gestión de Promociones</h1>
			<div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
				{/* Formulario */}
				<div
					style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, minWidth: "300px" }}>
					<h3>Nueva Promoción</h3>
					<form onSubmit={createPromo}>
						<div className='form-group'>
							<label>Título</label>
							<input
								type='text'
								placeholder='Ej: Descuento Especial'
								value={newPromo.title}
								onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
							/>
						</div>
						<div className='form-group'>
							<label>Descripción</label>
							<textarea
								placeholder='Ej: 10% de descuento en tu primer año...'
								value={newPromo.description}
								onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
								style={{
									width: "100%",
									padding: "0.75rem",
									border: "1px solid #ddd",
									borderRadius: "4px",
									minHeight: "80px",
								}}
							/>
						</div>
						<div className='form-group'>
							<label>URL de Imagen</label>
							<input
								type='text'
								placeholder='https://ejemplo.com/imagen.jpg'
								value={newPromo.image}
								onChange={(e) => setNewPromo({ ...newPromo, image: e.target.value })}
							/>
							<small style={{ color: "#666" }}>* Por ahora usa una URL de imagen externa (ej. Imgur).</small>
						</div>
						<button type='submit' className='btn-login'>
							Agregar Promoción
						</button>
					</form>
				</div>

				{/* Lista */}
				<div style={{ flex: 1, minWidth: "300px" }}>
					<h3>Promociones Activas ({promos.length})</h3>
					{loading ? (
						<p>Cargando...</p>
					) : (
						<div style={{ display: "grid", gap: "15px" }}>
							{promos.map((promo) => (
								<div className='container'>
									<div
										key={promo.id}
										style={{
											background: "white",
											padding: "15px",
											borderRadius: "8px",
											borderLeft: "5px solid #d1b06b",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}>
										<div>
											<h4 style={{ margin: "0 0 5px 0" }}>{promo.title}</h4>
											<p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{promo.description}</p>
											{promo.image && (
												<a href={promo.image} target='_blank' rel='noreferrer' style={{ color: "#d1b06b", fontSize: "0.8rem" }}>
													Ver Imagen
												</a>
											)}
										</div>
									</div>
									<div className='row '>
										<div className='col-auto'>
											<button
												onClick={() => deletePromo(promo.id)}
												style={{
													background: "#fee2e2",
													color: "#b91c1c",
													border: "none",
													padding: "5px 10px",
													borderRadius: "4px",
													cursor: "pointer",
												}}>
												Eliminar
											</button>
										</div>
										<div className='col-auto'>
											<button
												onClick={() => deletePromo(promo.id)}
												style={{
													background: "#fee2e2",
													color: "#b91c1c",
													border: "none",
													padding: "5px 10px",
													borderRadius: "4px",
													cursor: "pointer",
												}}>
												Editar
											</button>
										</div>
										<div className='col-auto'>
											<button
												onClick={() => deletePromo(promo.id)}
												style={{
													background: "#fee2e2",
													color: "#b91c1c",
													border: "none",
													padding: "5px 10px",
													borderRadius: "4px",
													cursor: "pointer",
												}}>
												Activar/Desactivar
											</button>
										</div>
									</div>
								</div>
							))}
							{promos.length === 0 && <p>No hay promociones. ¡Agrega una!</p>}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagePromos;
