import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const ManagePlans = () => {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newPlan, setNewPlan] = useState({
		name: "",
		price: "",
		description: "",
		features: "",
	});

	const plansCollectionRef = collection(db, "plans");

	// Fetch Plans
	const getPlans = async () => {
		setLoading(true);
		try {
			const data = await getDocs(plansCollectionRef);
			setPlans(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		} catch (error) {
			console.error("Error al obtener planes:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getPlans();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Create Plan
	const createPlan = async (e) => {
		e.preventDefault();
		if (!newPlan.name || !newPlan.price) return alert("Llena al menos Nombre y Precio");

		try {
			await addDoc(plansCollectionRef, {
				...newPlan,
				// Convert features string to array if separated by punctuation or newlines
				featuresList: newPlan.features.split("\n").filter((item) => item.trim() !== ""),
			});
			alert("Plan agregado!");
			setNewPlan({ name: "", price: "", description: "", features: "" });
			getPlans();
		} catch (error) {
			console.error("Error al crear:", error);
		}
	};

	// Delete Plan
	const deletePlan = async (id) => {
		const confirm = window.confirm("¿Seguro que quieres eliminar este plan?");
		if (confirm) {
			try {
				const planDoc = doc(db, "plans", id);
				await deleteDoc(planDoc);
				getPlans();
			} catch (error) {
				console.error("Error al eliminar:", error);
			}
		}
	};

	return (
		<div>
			<h1>Gestión de Planes Exequiales</h1>
			<div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
				{/* Formulario */}
				<div
					style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, minWidth: "300px" }}>
					<h3>Nuevo Plan</h3>
					<form onSubmit={createPlan}>
						<div className='form-group'>
							<label>Nombre del Plan</label>
							<input
								type='text'
								placeholder='Ej: Plan Ocaso'
								value={newPlan.name}
								onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
							/>
						</div>
						<div className='form-group'>
							<label>Precio (Texto)</label>
							<input
								type='text'
								placeholder='Ej: $1,200,000'
								value={newPlan.price}
								onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
							/>
						</div>
						<div className='form-group'>
							<label>Descripción Corta</label>
							<input
								type='text'
								placeholder='Ej: Cobertura completa para...'
								value={newPlan.description}
								onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
							/>
						</div>
						<div className='form-group'>
							<label>Características (Una por línea)</label>
							<textarea
								placeholder='Ataúd de madera&#10;Sala de velación&#10;Arreglo floral'
								value={newPlan.features}
								onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
								rows='5'
								style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
							/>
						</div>
						<button type='submit' className='btn-login'>
							Agregar Plan
						</button>
					</form>
				</div>

				{/* Lista */}
				<div style={{ flex: 1, minWidth: "300px" }}>
					<h3>Planes Activos ({plans.length})</h3>
					{loading ? (
						<p>Cargando...</p>
					) : (
						<div style={{ display: "grid", gap: "15px" }}>
							{plans.map((plan) => (
								<div
									key={plan.id}
									style={{
										background: "white",
										padding: "15px",
										borderRadius: "8px",
										borderLeft: "5px solid #d1b06b",
									}}>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
										<h4 style={{ margin: 0 }}>{plan.name}</h4>
										<span style={{ fontWeight: "bold", color: "#d1b06b", fontSize: "1.1rem" }}>{plan.price}</span>
									</div>
									<p style={{ margin: "0 0 10px 0", fontStyle: "italic", color: "#555" }}>{plan.description}</p>
									<div style={{ marginBottom: "10px" }}>
										<strong style={{ fontSize: "0.9rem" }}>Incluye:</strong>
										<ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "0.85rem", color: "#444" }}>
											{(plan.featuresList || []).map((feature, idx) => (
												<li key={idx}>{feature}</li>
											))}
										</ul>
									</div>
									<button
										onClick={() => deletePlan(plan.id)}
										style={{
											background: "#fee2e2",
											color: "#b91c1c",
											border: "none",
											padding: "5px 10px",
											borderRadius: "4px",
											cursor: "pointer",
											float: "right",
										}}>
										Eliminar
									</button>
									<div style={{ clear: "both" }}></div>
								</div>
							))}
							{plans.length === 0 && <p>No hay planes registrados.</p>}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagePlans;
