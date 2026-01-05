import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const ManagePartners = () => {
	const [partners, setPartners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newPartner, setNewPartner] = useState({
		name: "",
		description: "",
		benefit: "",
		logo: "",
	});

	const partnersCollectionRef = collection(db, "partners");

	// Fetch Partners
	const getPartners = async () => {
		setLoading(true);
		try {
			const data = await getDocs(partnersCollectionRef);
			setPartners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		} catch (error) {
			console.error("Error al obtener convenios:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getPartners();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Create Partner
	const createPartner = async (e) => {
		e.preventDefault();
		if (!newPartner.name || !newPartner.benefit) return alert("Llena al menos Nombre y Beneficio");

		try {
			await addDoc(partnersCollectionRef, newPartner);
			alert("Convenio agregado!");
			setNewPartner({ name: "", description: "", benefit: "", logo: "" });
			getPartners();
		} catch (error) {
			console.error("Error al crear:", error);
		}
	};

	// Delete Partner
	const deletePartner = async (id) => {
		const confirm = window.confirm("¿Seguro que quieres eliminar este convenio?");
		if (confirm) {
			try {
				const partnerDoc = doc(db, "partners", id);
				await deleteDoc(partnerDoc);
				getPartners();
			} catch (error) {
				console.error("Error al eliminar:", error);
			}
		}
	};

	return (
		<div>
			<h1>Gestión de Convenios</h1>
			<div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
				{/* Formulario */}
				<div
					style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, minWidth: "300px" }}>
					<h3>Nuevo Convenio</h3>
					<form onSubmit={createPartner}>
						<div className='form-group'>
							<label>Nombre de la Empresa</label>
							<input
								type='text'
								placeholder='Ej: Floristería XYZ'
								value={newPartner.name}
								onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
							/>
						</div>
						<div className='form-group'>
							<label>Descripción</label>
							<input
								type='text'
								placeholder='Ej: Aliado comercial en arreglos florales'
								value={newPartner.description}
								onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
							/>
						</div>
						<div className='form-group'>
							<label>Beneficio/Descuento</label>
							<input
								type='text'
								placeholder='Ej: 10% de descuento en todos los servicios'
								value={newPartner.benefit}
								onChange={(e) => setNewPartner({ ...newPartner, benefit: e.target.value })}
								style={{ fontWeight: "bold" }}
							/>
						</div>
						<div className='form-group'>
							<label>URL del Logo</label>
							<input
								type='text'
								placeholder='https://...'
								value={newPartner.logo}
								onChange={(e) => setNewPartner({ ...newPartner, logo: e.target.value })}
							/>
						</div>
						<button type='submit' className='btn-login'>
							Agregar Convenio
						</button>
					</form>
				</div>

				{/* Lista */}
				<div style={{ flex: 1, minWidth: "300px" }}>
					<h3>Convenios Activos ({partners.length})</h3>
					{loading ? (
						<p>Cargando...</p>
					) : (
						<div style={{ display: "grid", gap: "15px" }}>
							{partners.map((partner) => (
								<div
									key={partner.id}
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
										<h4 style={{ margin: "0 0 5px 0" }}>{partner.name}</h4>
										<p style={{ margin: 0, fontWeight: "bold", color: "#d1b06b" }}>{partner.benefit}</p>
										<p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{partner.description}</p>
									</div>
									<button
										onClick={() => deletePartner(partner.id)}
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
							))}
							{partners.length === 0 && <p>No hay convenios registrados.</p>}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagePartners;
