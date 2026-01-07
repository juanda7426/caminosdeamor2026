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
	const [novedades, setNovedades] = useState([]);

	//********************** */
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

	// Fetch Novedades from Firebase
	useEffect(() => {
		const fetchNovedades = async () => {
			try {
				const novedadesCol = collection(db, "novedades");
				const novedadesSnapshot = await getDocs(novedadesCol);
				const novedadesList = novedadesSnapshot.docs
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
					.filter((n) => n.isActive !== false); // Default to active if field missing
				setNovedades(novedadesList);
			} catch (error) {
				console.error("Error fetching novedades:", error);
			}
		};

		fetchNovedades();
	}, []);

	// Datos simulados para los sliders (puedes reemplazarlos con datos reales o de Firebase)
	/* const promociones = [ ... ] (Removed hardcoded data) */

	//********************** */
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
				{novedades.length > 0 ? (
					<SliderSection title='Novedades' items={novedades} id='novedades' />
				) : (
					<div className='text-center p-5'>
						<p>Cargando novedades...</p>
					</div>
				)}
			</div>
		</div>
	);
};
