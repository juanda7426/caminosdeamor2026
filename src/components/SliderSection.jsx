import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
				autoplay={{ delay: 3500, disableOnInteraction: false }}
				breakpoints={{
					640: {
						slidesPerView: 2,
					},
					992: {
						slidesPerView: 3,
					},
				}}
				className='mySwiper px-3 py-4'>
				{items.map((item, index) => (
					<SwiperSlide key={index} className='pb-5'>
						<div className='card h-100 shadow-sm border-0 slider-card bg-white'>
							<div style={{ height: "220px", overflow: "hidden" }}>
								<img src={item.image} className='card-img-top w-100 h-100' alt={item.title} style={{ objectFit: "cover" }} />
							</div>
							<div className='card-body text-center'>
								<h5 className='card-title main-color fw-bold'>{item.title}</h5>
								{item.description && <p className='card-text text-muted small'>{item.description}</p>}
								{/* <button className='btn btn-outline-primary btn-sm rounded-pill mt-2'>Ver más</button> */}
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};
