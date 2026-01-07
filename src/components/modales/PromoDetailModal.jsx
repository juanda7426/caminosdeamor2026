import React from "react";
import logo from "../../img/logoLov.jpg";

const PromoDetailModal = ({ isOpen, onClose, promo }) => {
	if (!isOpen || !promo) return null;

	return (
		<div
			className='modal fade show d-block'
			style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
			tabIndex='-1'
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className='modal-dialog modal-dialog-centered modal-lg'>
				<div className='modal-content'>
					<div className='modal-header border-0' style={{ backgroundColor: "rgba(0, 135, 183, 0.95)" }}>
						<h5 className='modal-title fw-bold' style={{ color: "#f8f8f8ff" }}>
							{promo.title}
						</h5>
						<button type='button' className='btn-close' onClick={onClose}></button>
					</div>

					<div
						className='modal-body p-1'
						style={{
							backgroundColor: "rgba(239, 239, 239, 0.95)",
							justifyContent: "center",
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
						}}>
						{/* Imagen grande */}
						<div
							className='p-2'
							style={{
								maxHeight: "420px",
								maxWidth: "600px",
								overflow: "hidden",
								boxShadow: "10px 10px 16px rgba(0, 0, 0, 0.41)",
								borderRadius: "10px",
							}}>
							<img
								src={promo.image || logo}
								alt={promo.title}
								className='w-100'
								style={{
									borderRadius: "10px",
									objectFit: "cover",
									height: "400px",
								}}
							/>
						</div>

						{/* Descripción */}
						<div className='p-4 text-center'>
							<p className='mb-0' style={{ fontSize: "1.3rem", lineHeight: "1.8", color: "#838383ff" }}>
								{promo.description}
							</p>
						</div>
						{/* </div> */}

						{/* <div className='modal-footer border-0'> */}
						{/* <button className='btn btn-primary' style={{ backgroundColor: "#0087b7", border: "none" }} onClick={onClose}>
							Cerrar
						</button> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PromoDetailModal;
