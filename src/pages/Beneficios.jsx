import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { Number } from "../config/arreglos";
import "../css/benefits_payments.css";

export const Beneficios = () => {
	const logo = "../../img/logoS.png";

	const beneficiosMascota = [
		{ title: "10% DE DESCUENTO EN CONSULTA VETERINARIA", img: "../../img/Veterinario.jpg" },
		{ title: "DESPARACITACIÓN INTERNA PARA TU MASCOTA CADA 4 MESES", img: "../../img/desparacitacion.jpg" },
		{ title: "5% DE DESCUENTO EN CIRUGÍA (TOPE $500.000)", img: "../../img/cirujia.jpg" },
	];

	const beneficiosFamilia = [
		{ title: "ODONTOLOGÍA Y ORTODONCIA", img: "../../img/odontologia.jpg" },
		{ title: "MÉDICO GENERAL", img: "../../img/doctor.jpg" },
		{ title: "LABORATORIO CLÍNICO", img: "../../img/lboratorio.jpg" },
		{ title: "OPTOMETRÍA", img: "../../img/optica1.jpg" },
		{ title: "MATRÍCULA GRATIS CENSA (APLICAN CONDICIONES)", img: "../../img/censa.jpg" },
	];

	const RenderBenefits = ({ title, items, headerClass }) => (
		<div className='mb-5'>
			<div className='text-center'>
				<h3 className={`category-header ${headerClass}`}>{title}</h3>
			</div>
			<div className='container-fluid px-5'>
				<div className='row g-4 justify-content-center'>
					{items.map((item, index) => (
						<div className='col-lg-4 col-md-6' key={index}>
							<div className='benefit-card'>
								<div className='card-img-wrapper'>
									<img src={item.img} className='card-img-benefit' alt={item.title} />
								</div>
								<div className='card-body-benefit'>
									<h5 className='benefit-title'>{item.title}</h5>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<>
			<FloatingWhatsApp
				phoneNumber={Number}
				accountName='Caminos de Amor'
				allowEsc
				allowClickAway
				notification
				notificationSound
				chatMessage={"Tienes alguna pregunta sobre nuestros beneficios?"}
				buttonClassName='me-2 mb-0'
				buttonStyle={{ marginBottom: "80px" }}
				chatboxStyle={{ marginBottom: "70px" }}
				avatar={logo}
			/>

			<div className='modern-section container-fluid bg-light'>
				<h2 className='modern-title'>Nuestros Beneficios</h2>

				<RenderBenefits title='Beneficios para tu Mascota' items={beneficiosMascota} headerClass='' />

				<RenderBenefits title='Beneficios para la Familia' items={beneficiosFamilia} headerClass='category-header-family' />
			</div>
		</>
	);
};
