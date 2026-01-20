import { useState, useEffect } from "react";
import { Number as WA_Number, whatsappLink } from "../config/arreglos";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import logoFallback from "../img/logoLov.jpg";
import { planes } from "../config/arreglos";
import "../css/planes.css";

export const Planes = () => {
  const logo = "../../img/logoS.png";
  const [activePlan, setActivePlan] = useState(null);
  const [plans, setPlans] = useState(planes);
  const [loading, setLoading] = useState(true);

  //****************** */
  // Fetch Plans from Firebase
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansCol = collection(db, "plans");
        const snapshot = await getDocs(plansCol);
        const plansList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((p) => p.isActive !== false)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        if (plansList.length > 0) {
          setPlans(plansList);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 2. Open/Close Handlers
  const openModal = (plan) => {
    setActivePlan(plan);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const closeModal = () => {
    setActivePlan(null);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  //****************** */
  return (
    <>
      <FloatingWhatsApp
        phoneNumber={WA_Number}
        accountName="Caminos de Amor"
        allowEsc
        allowClickAway
        notification
        notificationSound
        chatMessage="Tienes alguna pregunta sobre nuestros servicios y planes?"
        buttonClassName="me-2 mb-0"
        buttonStyle={{ marginBottom: "80px" }}
        chatboxStyle={{ marginBottom: "70px" }}
        avatar={logo}
      />

      <div className="planes-section">
        <div className="container">
          {/* Intro Section */}
          <div className="text-center intro-text mb-5">
            <h2 className="mb-3 fw-bold" style={{ color: "#333" }}>
              Nuestros Planes de Previsión
            </h2>
            <p>
              En Caminos de Amor entendemos que cada familia es única. Por eso,
              hemos diseñado planes que se ajustan a tus necesidades. Haz clic
              en <strong>"Ver Plan"</strong> para conocer todos los detalles de
              cada servicio.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <p className="mt-3">Cargando planes...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5">No hay planes disponibles</p>
              </div>
            ) : (
              plans.map((plan) => {
                return (
                  <div className="col-lg-4 col-md-6" key={plan.id}>
                    <div
                      className="plan-trigger-card"
                      onClick={() => openModal(plan)}
                    >
                      <div
                        className={`plan-header-simple`}
                        style={{ backgroundColor: plan.color || "#0087B7" }}
                      >
                        <h3 className="plan-title-trigger text-white">
                          {plan.name}
                        </h3>
                        <span className="btn-trigger">Ver Plan</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {/* MODAL - Only renders if activePlan is set */}
      {activePlan && (
        <div className="modal-backdrop-custom" onClick={closeModal}>
          {/* Stop propagation so clicking inside content doesn't close */}
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Title (Preserving Context) */}
            <div
              className={`modal-header-custom`}
              style={{ backgroundColor: activePlan.color || "#0087B7" }}
            >
              <button className="modal-close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
              <h3 className="fw-bold m-0 text-white">{activePlan.name}</h3>
            </div>

            {/* Body with Image and List */}
            <div className="modal-body-custom">
              <img
                src={activePlan.image || logoFallback}
                className="modal-img"
                alt={activePlan.name}
              />

              {activePlan.description && (
                <p className="text-muted small mt-3 mb-3">
                  {activePlan.description}
                </p>
              )}

              <div className="plan-list">
                {(activePlan.featuresList || []).map((servicio, index) => (
                  <div key={index} className="plan-list-item">
                    <span>{servicio}</span>
                    <i
                      className="fas fa-check-circle"
                      style={{ color: activePlan.color || "#0087B7" }}
                    ></i>
                  </div>
                ))}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-solicitar"
                style={{ backgroundColor: activePlan.color || "#0087B7" }}
              >
                Solicitar Plan
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
