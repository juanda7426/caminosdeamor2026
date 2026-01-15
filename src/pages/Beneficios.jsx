import { useState, useEffect } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { Number } from "../config/arreglos";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import ModalBenefitDetail from "../components/modales/ModalBenefitDetail";
import "../css/benefits_payments.css";

export const Beneficios = () => {
  const logo = "../../img/logoS.png";

  const [beneficiosMascota, setBeneficiosMascota] = useState([]);
  const [beneficiosFamilia, setBeneficiosFamilia] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //********************* */
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "partners"));
        const allBenefits = querySnapshot.docs.map((doc) => doc.data());

        const mapBenefit = (b) => ({
          title: b.benefit,
          img: b.logo || "../../img/logoS.png",
          partnerName: b.name,
          description: b.description,
          category: b.category,
          website: b.website,
          phone: b.phone,
          address: b.address,
          terms: b.terms,
          isActive: b.isActive,
        });

        const mascotas = allBenefits
          .filter(
            (b) =>
              (!b.category || b.category === "Mascota") && b.isActive !== false
          )
          .map(mapBenefit);

        const familia = allBenefits
          .filter((b) => b.category === "Familia" && b.isActive !== false)
          .map(mapBenefit);

        setBeneficiosMascota(mascotas);
        setBeneficiosFamilia(familia);
      } catch (error) {
        console.error("Error fetching benefits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  const openModal = (benefit) => {
    setSelectedBenefit(benefit);
    setIsModalOpen(true);
  };

  const RenderBenefits = ({ title, items, headerClass }) => (
    <div className="mb-5">
      <div className="text-center">
        <h3 className={`category-header ${headerClass}`}>{title}</h3>
      </div>
      <div className="container-fluid px-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando beneficios...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No hay beneficios disponibles</p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {items.map((item, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div
                  className="benefit-card h-100"
                  onClick={() => openModal(item)}
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                >
                  <div className="card-img-wrapper">
                    <img
                      src={item.img}
                      className="card-img-benefit"
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "../../img/logoS.png";
                      }}
                    />
                  </div>
                  <div className="card-body-benefit">
                    <h5 className="benefit-title">{item.title}</h5>
                    <div className="mt-3 text-center">
                      <button className="btn btn-sm btn-info text-light rounded-pill px-3">
                        <span className="text-light fw-bold">Ver Más</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  //********************* */
  return (
    <>
      <FloatingWhatsApp
        phoneNumber={Number}
        accountName="Caminos de Amor"
        allowEsc
        allowClickAway
        notification
        notificationSound
        chatMessage={"Tienes alguna pregunta sobre nuestros beneficios?"}
        buttonClassName="me-2 mb-0"
        buttonStyle={{ marginBottom: "80px" }}
        chatboxStyle={{ marginBottom: "70px" }}
        avatar={logo}
      />

      <div className="modern-section container-fluid bg-light">
        <h3 className="modern-title">Nuestros Beneficios</h3>

        <RenderBenefits
          title="Beneficios para tu Mascota"
          items={beneficiosMascota}
          headerClass=""
        />

        <RenderBenefits
          title="Beneficios para la Familia"
          items={beneficiosFamilia}
          headerClass="category-header-family"
        />
      </div>

      <ModalBenefitDetail
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        benefitData={selectedBenefit}
      />
    </>
  );
};
