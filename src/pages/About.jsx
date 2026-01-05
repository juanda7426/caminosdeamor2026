import React from "react";
import { Number } from "../config/arreglos";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import "../css/about.css";

export const About = () => {
	const logo = "../../img/logoS.png";

	return (
		<>
			<FloatingWhatsApp
				phoneNumber={Number}
				accountName='Caminos de Amor'
				allowEsc
				allowClickAway
				notification
				notificationSound
				chatMessage='Tienes alguna pregunta sobre nosotros?'
				buttonClassName='me-2 mb-0'
				buttonStyle={{ marginBottom: "80px" }}
				chatboxStyle={{ marginBottom: "70px" }}
				avatar={logo}
			/>

			<div className='container-fluid py-5 bg-light'>
				<div className='container'>
					{/* Section: Quiénes Somos */}
					<div className='about-card p-4'>
						<h2 className='text-center section-title w-100'>Quiénes Somos</h2>
						<div className='row mt-3'>
							<div className='col-lg-6 mb-4 mb-lg-0'>
								<img src='../../img/loveRct.jpg' alt='About Us' className='img-fluid img-about' />
							</div>
							<div className='col-lg-6'>
								<div className='content-card bg-corporate'>
									<h3 className='text-title'>Sobre Nosotros</h3>
									<p className='text-content'>
										Nuestra funeraria se especializa en el cuidado y cremación de mascotas. Estamos orgullosos de ser parte de este proceso tan
										importante y emotivo para ti y tu compañero peludo. Nuestro compromiso es brindar un servicio de alta calidad y respeto a las
										necesidades de nuestros amigos de cuatro patas que han partido.
									</p>
									<p className='text-content mt-2'>
										Nuestro equipo de profesionales está dedicado a ofrecer un servicio personalizado y responsable, donde cada detalle se tiene en
										cuenta para garantizar que el cremación de tu mascota sea un recuerdo digno.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Section: Misión */}
					<div className='about-card p-4 mt-5'>
						<h2 className='text-center section-title w-100'>Nuestra Misión</h2>
						<div className='row mt-3 flex-lg-row-reverse'>
							<div className='col-lg-6 mb-4 mb-lg-0'>
								<img src='../img/msn.webp' alt='Misión' className='img-fluid img-about' />
							</div>
							<div className='col-lg-6'>
								<div className='content-card bg-mission'>
									<h3 className='text-title'>Misión</h3>
									<p className='text-content'>
										Somos más que una empresa; somos un apoyo compasivo en los momentos más difíciles. Nos dedicamos a brindar el mejor acompañamiento
										y asesoría durante la pérdida de tu mascota.
									</p>
									<p className='text-content mt-2'>
										Pero no nos detenemos ahí. Nuestra prioridad es la conservación del medio ambiente, porque creemos que honrar a nuestros seres
										queridos peludos también implica cuidar el planeta que compartimos.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Section: Visión */}
					<div className='about-card p-4 mt-5'>
						<h2 className='text-center section-title w-100'>Nuestra Visión</h2>
						<div className='row mt-3'>
							<div className='col-lg-6 mb-4 mb-lg-0'>
								<img src='../img/vision.jpeg' alt='Visión' className='img-fluid img-about' />
							</div>
							<div className='col-lg-6'>
								<div className='content-card bg-vision'>
									<h3 className='text-title'>Visión</h3>
									<p className='text-content'>
										Destacarnos como la empresa líder a nivel nacional en el acompañamiento, asesoría, traslado y cremación de mascotas.
									</p>
									<p className='text-content mt-2'>
										Nuestro compromiso es brindar un servicio excepcional, honrando la memoria de esos seres queridos que forman parte de nuestras
										familias. Trabajamos con pasión y dedicación para aliviar el dolor de quienes atraviesan este difícil momento.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
