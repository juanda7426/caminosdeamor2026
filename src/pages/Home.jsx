import React, { useEffect, useState } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { HeroLove } from "../components/HeroLove";
import { SliderSection } from "../components/SliderSection";
import { Number } from "../config/arreglos";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export const Home = () => {
	const logo = "../../img/logoS.png";
	const [promociones, setPromociones] = useState([]);

	// Fetch Promos from Firebase
	useEffect(() => {
		const fetchPromos = async () => {
			try {
				const promosCol = collection(db, "promotions");
				const promoSnapshot = await getDocs(promosCol);
				const promoList = promoSnapshot.docs
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
					.filter((p) => p.isActive !== false); // Default to active if field missing
				setPromociones(promoList);
			} catch (error) {
				console.error("Error fetching promos:", error);
			}
		};

		fetchPromos();
	}, []);

	// Datos simulados para los sliders (puedes reemplazarlos con datos reales o de Firebase)
	/* const promociones = [ ... ] (Removed hardcoded data) */

	const convenios = [
		{ title: "Clínica Veterinaria", description: "Cuida a tu mascota con los mejores especialistas.", image: "../../img/Veterinario.jpg" },
		{ title: "Odontología", description: "Sonrisas brillantes para toda la familia.", image: "../../img/odontologia.jpg" },
		{ title: "Medicina General", description: "Atención médica de calidad cuando la necesitas.", image: "../../img/doctor.jpg" },
		{ title: "Laboratorio Clínico", description: "Exámenes rápidos y confiables.", image: "../../img/lboratorio.jpg" },
		{ title: "Óptica Visión", description: "Salud visual al alcance de todos.", image: "../../img/optica1.jpg" },
		{ title: "Estudios CENSA", description: "Beneficios educativos para afiliados.", image: "../../img/censa.jpg" },
	];

	return (
		<div style={{ overflowX: "hidden" }}>
			<FloatingWhatsApp
				phoneNumber={Number}
				accountName='Caminos de Amor'
				allowEsc
				allowClickAway
				notification
				notificationSound
				chatMessage={`Hola, ¿En qué podemos ayudarte hoy?`}
				buttonClassName='me-2 mb-0'
				buttonStyle={{ marginBottom: "80px" }}
				chatboxStyle={{ marginBottom: "70px" }}
				avatar={logo}
			/>

			<HeroLove />

			<div style={{ backgroundColor: "#f8f9fa" }}>
				{/* Only render if we have promos, otherwise maybe show loading or nothing */}
				{promociones.length > 0 ? (
					<SliderSection title='Nuestras Promociones' items={promociones} id='promociones' />
				) : (
					<div className='text-center p-5'>
						<p>Cargando promociones...</p>
					</div>
				)}
			</div>

			<div className='bg-white'>
				<SliderSection title='Convenios y Beneficios' items={convenios} id='convenios' />
			</div>
		</div>
	);
};
