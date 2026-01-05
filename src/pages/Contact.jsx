import { FloatingWhatsApp } from "react-floating-whatsapp";
import { Number } from "../config/arreglos";
import "../css/contact.css";

export const Contact = () => {
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
				chatMessage={`¿Tienes alguna pregunta sobre nuestros servicios?`}
				buttonClassName='me-2 mb-0'
				buttonStyle={{ marginBottom: "80px" }}
				chatboxStyle={{ marginBottom: "70px" }}
				avatar={logo}
			/>

			<div className='contact-container container-fluid px-5'>
				<div className='row justify-content-center'>
					<div className='col-lg-8 col-md-10'>
						<div className='contact-card'>
							<div className='contact-header'>
								<h2>
									<i className='fas fa-headset me-2'></i>Contáctanos
								</h2>
								<p className='mb-0 mt-2 opacity-75'>Estamos aquí para escucharte y acompañarte</p>
							</div>

							<div className='contact-body'>
								<div className='row justify-content-center'>
									{/* Phone 1 */}
									<div className='contact-item col-5 me-2'>
										<div className='contact-icon-box'>
											<i className='fas fa-phone-alt fs-5'></i>
										</div>
										<div className='contact-text'>
											<h5>Línea de Atención 1</h5>
											<p>+57 323 403 5961</p>
										</div>
									</div>

									{/* Phone 2 */}
									<div className='contact-item col-5 ms-2'>
										<div className='contact-icon-box'>
											<i className='fas fa-mobile-alt fs-5'></i>
										</div>
										<div className='contact-text'>
											<h5>Línea de Atención 2</h5>
											<p>+57 310 539 0693</p>
										</div>
									</div>

									{/* Email */}
									<div className='contact-item col-5 me-2'>
										<div className='contact-icon-box'>
											<i className='fas fa-envelope fs-5'></i>
										</div>
										<div className='contact-text'>
											<h5>Correo Electrónico</h5>
											<p>caminosdeamorsas@gmail.com</p>
										</div>
									</div>

									{/* Address */}
									<div className='contact-item col-5 ms-2'>
										<div className='contact-icon-box'>
											<i className='fas fa-map-marker-alt fs-5'></i>
										</div>
										<div className='contact-text'>
											<h5>Ubicación Principal</h5>
											<p>Calle 49a #50-11, Andes, Antioquia</p>
											<small className='text-muted'>Edificio Cóndor de los Andes, Local 202</small>
										</div>
									</div>
								</div>

								<div className='social-section'>
									<h5>Síguenos en Redes Sociales</h5>
									<div className='social-icons'>
										<a
											href='https://www.facebook.com/people/Funeraria-caminos-de-amor/100066903139742/'
											target='_blank'
											rel='noreferrer'
											className='social-btn btn-facebook'
											title='Facebook'>
											<i className='fab fa-facebook-f'></i>
										</a>
										<a
											href='https://www.instagram.com/caminosde.amor?utm_source=qr&igsh=OGx0Zm91dTF3enA1'
											target='_blank'
											rel='noreferrer'
											className='social-btn btn-instagram'
											title='Instagram'>
											<i className='fab fa-instagram'></i>
										</a>
										<a href='https://vm.tiktok.com/ZMrrg4Vhu/' target='_blank' rel='noreferrer' className='social-btn btn-tiktok' title='TikTok'>
											<i className='fab fa-tiktok'></i>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
