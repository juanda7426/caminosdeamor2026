import React, { useState } from "react";
import { Number, plan1, plan2, plan3, whatsappLink } from "../config/arreglos";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import "../css/planes.css";

export const Planes = () => {
	const logo = "../../img/logoS.png";
	const [activePlan, setActivePlan] = useState(null);

	// 1. Data Structure used for rendering both Trigger Cards and Modal Content
	const plansData = [
		{
			id: 1,
			title: "Sin Devolución de Cenizas", // Plain text for modal header logic
			titleJSX: (
				<>
					Sin Devolución <br /> de Cenizas
				</>
			),
			services: plan1,
			image: "../img/sinDevOk.jpg",
			headerClass: "bg-plan-1", // Background gradient class
			textColorClass: "color-text-1", // Text color for highlights
			btnColor: "#0087B7",
			subtext: null,
		},
		{
			id: 2,
			title: "Con Devolución de Cenizas",
			titleJSX: (
				<>
					Con Devolución <br /> de Cenizas
				</>
			),
			services: plan2,
			image: "../img/conDevOk.jpg",
			headerClass: "bg-plan-2",
			textColorClass: "color-text-2",
			btnColor: "#7a7a7a",
			subtext: null,
		},
		{
			id: 3,
			title: "Planes Prepago",
			titleJSX: (
				<>
					Planes <br /> Prepago
				</>
			),
			services: plan3,
			image: "../img/funeral.jpeg",
			headerClass: "bg-plan-3",
			textColorClass: "color-text-3",
			btnColor: "#000000",
			subtext: "Con o Sin Devolución de Cenizas",
		},
	];

	// 2. Open/Close Handlers
	const openModal = (plan) => {
		setActivePlan(plan);
		document.body.style.overflow = "hidden"; // Prevent scrolling
	};

	const closeModal = () => {
		setActivePlan(null);
		document.body.style.overflow = "auto"; // Restore scrolling
	};

	return (
		<>
			<FloatingWhatsApp
				phoneNumber={Number}
				accountName='Caminos de Amor'
				allowEsc
				allowClickAway
				notification
				notificationSound
				chatMessage='Tienes alguna pregunta sobre nuestros servicios y planes?'
				buttonClassName='me-2 mb-0'
				buttonStyle={{ marginBottom: "80px" }}
				chatboxStyle={{ marginBottom: "70px" }}
				avatar={logo}
			/>

			<div className='planes-section'>
				<div className='container'>
					{/* Intro Section */}
					<div className='text-center intro-text mb-5'>
						<h2 className='mb-3 fw-bold' style={{ color: "#333" }}>
							Nuestros Planes de Previsión
						</h2>
						<p>
							En Caminos de Amor entendemos que cada familia es única. Por eso, hemos diseñado planes que se ajustan a tus necesidades. Haz clic en{" "}
							<strong>"Ver Plan"</strong> para conocer todos los detalles de cada servicio.
						</p>
					</div>

					<div className='row g-4 justify-content-center'>
						{plansData.map((plan) => (
							<div className='col-lg-4 col-md-6' key={plan.id}>
								<div className='plan-trigger-card' onClick={() => openModal(plan)}>
									<div className={`plan-header-simple ${plan.headerClass}`}>
										<h3 className='plan-title-trigger text-white'>{plan.titleJSX}</h3>
										<span className='btn-trigger'>Ver Plan</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* MODAL - Only renders if activePlan is set */}
			{activePlan && (
				<div className='modal-backdrop-custom' onClick={closeModal}>
					{/* Stop propagation so clicking inside content doesn't close */}
					<div className='modal-content-custom' onClick={(e) => e.stopPropagation()}>
						{/* Header with Title (Preserving Context) */}
						<div className={`modal-header-custom ${activePlan.headerClass}`}>
							<button className='modal-close-btn' onClick={closeModal}>
								<i className='fas fa-times'></i>
							</button>
							<h3 className='fw-bold m-0'>{activePlan.titleJSX}</h3>
						</div>

						{/* Body with Image and List */}
						<div className='modal-body-custom'>
							<img src={activePlan.image} className='modal-img' alt={activePlan.title} />

							{activePlan.subtext && <p className='text-muted small fw-bold mb-3'>{activePlan.subtext}</p>}

							<div className='plan-list'>
								{activePlan.services.map((servicio, index) => (
									<div key={index} className='plan-list-item'>
										<span>{servicio}</span>
										<i className='fas fa-check-circle' style={{ color: activePlan.btnColor }}></i>
									</div>
								))}
							</div>

							<a href={whatsappLink} target='_blank' rel='noreferrer' className='btn-solicitar' style={{ backgroundColor: activePlan.btnColor }}>
								Solicitar Plan
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
