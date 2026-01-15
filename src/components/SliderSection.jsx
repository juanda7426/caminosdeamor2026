import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import logo from "../img/logoLov.jpg";
import PromoDetailModal from "./modales/PromoDetailModal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../css/sliderSection.css";

export const SliderSection = ({ title, items, id }) => {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const swiperRef = useRef(null);

  //******************** */
  const handleCardClick = (item) => {
    setSelectedPromo(item);
    setIsModalOpen(true);
    // Pause the slider
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromo(null);
    // Resume the slider
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  //******************** */
  return (
    <section className="py-5 container" id={id}>
      <h2
        className="text-center mb-5 corporate-title"
        style={{
          position: "relative",
          display: "inline-block",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {title}
        <span
          style={{
            display: "block",
            width: "60px",
            height: "4px",
            backgroundColor: "#0087B7",
            margin: "10px auto 0",
            borderRadius: "2px",
          }}
        ></span>
      </h2>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 40000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="modern-swiper px-2 py-1"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="modern-slider-card"
              onClick={() => handleCardClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-image-wrapper">
                <img
                  src={item.image ? item.image : logo}
                  className="card-img-modern"
                  alt={item.title}
                />
                <div className="card-overlay-gradient">
                  <div className="overlay-content">
                    <h4 className="overlay-title">{item.title}</h4>
                    {item.description && (
                      <p className="overlay-description">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal de detalle */}
      <PromoDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promo={selectedPromo}
      />
    </section>
  );
};
