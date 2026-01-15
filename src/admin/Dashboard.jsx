import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaHandshake,
  FaLayerGroup,
  FaTags,
  FaNewspaper,
  FaArrowRight,
} from "react-icons/fa";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    partners: { total: 0, active: 0, inactive: 0 },
    plans: { total: 0, active: 0, inactive: 0 },
    promos: { total: 0, active: 0, inactive: 0 },
    novedades: { total: 0, active: 0, inactive: 0 },
    infoConfigured: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Partners
        const partnersColl = collection(db, "partners");
        const partnersSnapshot = await getDocs(partnersColl);
        const partnersTotal = partnersSnapshot.size;
        const partnersActive = partnersSnapshot.docs.filter(
          (doc) => doc.data().isActive !== false
        ).length;

        // Fetch Plans
        const plansColl = collection(db, "plans");
        const plansSnapshot = await getDocs(plansColl);
        const plansTotal = plansSnapshot.size;
        const plansActive = plansSnapshot.docs.filter(
          (doc) => doc.data().isActive !== false
        ).length;

        // Fetch Promos
        const promosColl = collection(db, "promotions");
        const promosSnapshot = await getDocs(promosColl);
        const promosTotal = promosSnapshot.size;
        const promosActive = promosSnapshot.docs.filter(
          (doc) => doc.data().isActive !== false
        ).length;

        // Fetch Config
        const configRef = doc(db, "site_config", "global");
        const configSnap = await getDoc(configRef);

        let isConfigValid = false;
        if (configSnap.exists()) {
          const data = configSnap.data();
          const hasPhone = data.phone && data.phone.trim() !== "";
          const hasEmail = data.email && data.email.trim() !== "";
          isConfigValid = hasPhone && hasEmail;
        }

        // Fetch Novedades
        const novedadesColl = collection(db, "novedades");
        const novedadesSnapshot = await getDocs(novedadesColl);
        const novedadesTotal = novedadesSnapshot.size;
        const novedadesActive = novedadesSnapshot.docs.filter(
          (doc) => doc.data().isActive !== false
        ).length;

        setStats({
          partners: {
            total: partnersTotal,
            active: partnersActive,
            inactive: partnersTotal - partnersActive,
          },
          plans: {
            total: plansTotal,
            active: plansActive,
            inactive: plansTotal - plansActive,
          },
          promos: {
            total: promosTotal,
            active: promosActive,
            inactive: promosTotal - promosActive,
          },
          novedades: {
            total: novedadesTotal,
            active: novedadesActive,
            inactive: novedadesTotal - novedadesActive,
          },
          infoConfigured: isConfigValid,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardsData = [
    {
      title: "Información del Sitio",
      type: "config",
      count: stats.infoConfigured ? "Configurada" : "Pendiente",
      icon: <FaGlobe size={28} />,
      link: "/admin/info",
      linkText: "Editar Información",
      color: "#0087b7", // Brand Blue
      isStatus: true,
      statusBool: stats.infoConfigured,
    },
    {
      title: "Beneficios (Aliados)",
      type: "stats",
      data: stats.partners,
      icon: <FaHandshake size={32} />,
      link: "/admin/convenios",
      linkText: "Gestionar Beneficios",
      color: "#d1b06b", // Brand Gold
    },
    {
      title: "Planes Exequiales",
      type: "stats",
      data: stats.plans,
      icon: <FaLayerGroup size={28} />,
      link: "/admin/planes",
      linkText: "Gestionar Planes",
      color: "#28a745", // Green
    },
    {
      title: "Promociones",
      type: "stats",
      data: stats.promos,
      icon: <FaTags size={28} />,
      link: "/admin/promos",
      linkText: "Gestionar Promos",
      color: "#dc3545", // Red
    },
    {
      title: "Novedades",
      type: "stats",
      data: stats.novedades,
      icon: <FaNewspaper size={28} />,
      link: "/admin/novedades",
      linkText: "Gestionar Novedades",
      color: "#6f42c1", // Purple
    },
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom"
        style={{ borderColor: "#ececec" }}
      >
        <div>
          <h2 className="fw-bold text-dark mb-1">Dashboard General</h2>
          <p className="text-secondary mb-0">
            Bienvenido de nuevo, <strong>{currentUser?.email}</strong>
          </p>
        </div>
        <div className="bg-light px-4 py-2 rounded-pill border">
          <span className="text-muted small fw-bold text-uppercase">
            Fecha: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Grid Layout using Bootstrap for centering and max 3 per row */}
      <div className="row g-4 justify-content-center">
        {cardsData.map((card, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "16px",
                transition: "transform 0.2s, box-shadow 0.2s",
                overflow: "hidden",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 .5rem 1rem rgba(0,0,0,.15)";
              }}
            >
              {/* Top Color Bar */}
              <div
                style={{
                  height: "6px",
                  backgroundColor: card.color,
                  width: "100%",
                }}
              ></div>

              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: `${card.color}15`, // 10% opacity
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </div>
                  {card.isStatus && (
                    <span
                      className={`badge rounded-pill ${
                        card.statusBool ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {card.statusBool ? "OK" : "Pendiente"}
                    </span>
                  )}
                </div>

                <h5 className="card-title text-secondary fw-bold text-uppercase small mb-2">
                  {card.title}
                </h5>

                {loading ? (
                  <div className="py-2">
                    <div
                      className="spinner-border spinner-border-sm text-secondary"
                      role="status"
                    ></div>
                  </div>
                ) : card.type === "config" ? (
                  <h2 className="display-6 fw-bold text-dark mb-1">
                    {card.count}
                  </h2>
                ) : (
                  <div>
                    <h2 className="display-4 fw-bold text-dark mb-0">
                      {card.data.total}
                    </h2>
                    <div className="d-flex gap-3 text-muted small mt-2">
                      <span className="text-success fw-bold">
                        <i className="fas fa-check-circle me-1"></i>
                        {card.data.active} Activos
                      </span>
                      <span className="text-secondary">|</span>
                      <span className="text-danger fw-bold">
                        <i className="fas fa-times-circle me-1"></i>
                        {card.data.inactive} Inactivos
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-3 border-top mt-3">
                  <Link
                    to={card.link}
                    className="text-decoration-none fw-bold d-flex align-items-center"
                    style={{ color: card.color, transition: "color 0.2s" }}
                  >
                    {card.linkText} <FaArrowRight className="ms-2 small" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
