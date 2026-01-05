import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ManageInfo = () => {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [info, setInfo] = useState({
		phone: "",
		whatsapp: "",
		address: "",
		email: "",
		facebook: "",
		instagram: "",
		hours: "",
	});

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const docRef = doc(db, "site_config", "global");
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setInfo(docSnap.data());
				}
			} catch (error) {
				console.error("Error fetching info:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInfo();
	}, []);

	const handleChange = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			// Save to Firestore 'site_config' collection, document 'global'
			await setDoc(doc(db, "site_config", "global"), info);
			alert("Información actualizada correctamente");
		} catch (error) {
			console.error("Error saving info:", error);
			alert("Error al guardar");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div>Cargando información...</div>;

	return (
		<div style={{ maxWidth: "600px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
			<h2>Información de la Empresa</h2>
			<p>Estos datos se reflejarán en el pie de página y header.</p>

			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>Teléfono (Mostrar)</label>
					<input name='phone' value={info.phone || ""} onChange={handleChange} type='text' placeholder='+57 300 123 4567' />
				</div>
				<div className='form-group'>
					<label>Horarios de Atención</label>
					<textarea
						name='hours'
						value={info.hours || ""}
						onChange={handleChange}
						placeholder='Ej: Lunes a Viernes: 8am - 6pm'
						rows='3'
						style={{ width: "100%", padding: "8px" }}
					/>
				</div>
				<div className='form-group'>
					<label>Whatsapp (Link)</label>
					<input name='whatsapp' value={info.whatsapp || ""} onChange={handleChange} type='text' placeholder='https://wa.me/...' />
				</div>
				<div className='form-group'>
					<label>Dirección</label>
					<input name='address' value={info.address || ""} onChange={handleChange} type='text' />
				</div>
				<div className='form-group'>
					<label>Correo Electrónico</label>
					<input name='email' value={info.email || ""} onChange={handleChange} type='email' />
				</div>

				<h3>Redes Sociales</h3>
				<div className='form-group'>
					<label>Facebook URL</label>
					<input name='facebook' value={info.facebook || ""} onChange={handleChange} type='text' />
				</div>
				<div className='form-group'>
					<label>Instagram URL</label>
					<input name='instagram' value={info.instagram || ""} onChange={handleChange} type='text' />
				</div>

				<button type='submit' disabled={saving} className='btn-login' style={{ marginTop: "20px" }}>
					{saving ? "Guardando..." : "Guardar Cambios"}
				</button>
			</form>
		</div>
	);
};

export default ManageInfo;
