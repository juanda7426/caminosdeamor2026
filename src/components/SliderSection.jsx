import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import logo from "../img/logoLov.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../css/sliderSection.css";

export const SliderSection = ({ title, items, id }) => {
	return (
		<section className='py-5 container' id={id}>
			<h2
				className='text-center mb-5 corporate-title'
				style={{ position: "relative", display: "inline-block", left: "50%", transform: "translateX(-50%)" }}>
				{title}
				<span
					style={{
						display: "block",
						width: "60px",
						height: "4px",
						backgroundColor: "#0087B7",
						margin: "10px auto 0",
						borderRadius: "2px",
					}}></span>
			</h2>
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={30}
				slidesPerView={1}
				navigation
				pagination={{ clickable: true }}
				autoplay={{ delay: 4000, disableOnInteraction: false }}
				breakpoints={{
					640: {
						slidesPerView: 2,
					},
					1024: {
						slidesPerView: 3,
					},
				}}
				className='modern-swiper px-2 py-5'>
				{items.map((item, index) => (
					<SwiperSlide key={index}>
						<div className='modern-slider-card'>
							<div className='card-image-wrapper'>
								<img src={item.image ? item.image : logo} className='card-img-modern' alt={item.title} />
								<div className='card-overlay-gradient'>
									<div className='overlay-content'>
										<h4 className='overlay-title'>{item.title}</h4>
										{item.description && <p className='overlay-description'>{item.description}</p>}
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};
