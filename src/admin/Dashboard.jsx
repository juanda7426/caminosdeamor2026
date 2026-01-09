import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase-config";
import {
  collection,
  getCountFromServer,
  doc,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const [stats, setStats] = useState({
    partnersCount: 0,
    plansCount: 0,
    promosCount: 0,
    infoConfigured: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count Partners (Convenios)
        const partnersColl = collection(db, "partners");
        const partnersSnapshot = await getCountFromServer(partnersColl);

        // Count Plans
        const plansColl = collection(db, "plans");
        const plansSnapshot = await getCountFromServer(plansColl);

        // Count Promos
        const promosColl = collection(db, "promotions");
        const promosSnapshot = await getCountFromServer(promosColl);

        // Check Config
        const configRef = doc(db, "site_config", "global");
        const configSnap = await getDoc(configRef);

        setStats({
          partnersCount: partnersSnapshot.data().count,
          plansCount: plansSnapshot.data().count,
          promosCount: promosSnapshot.data().count,
          infoConfigured: configSnap.exists(),
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flex: 1,
    minWidth: "200px",
    textAlign: "center",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Dashboard</h1>
      </div>

      <p style={{ marginBottom: "20px" }}>
        Bienvenido, <strong>{currentUser?.email}</strong>
      </p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Card Info */}
        <div style={cardStyle}>
          <h3>Información del Sitio</h3>
          <p style={{ fontSize: "2rem", margin: "10px 0" }}>
            {loading ? "..." : stats.infoConfigured ? "✅" : "❌"}
          </p>
          <p style={{ color: "#666" }}>
            {stats.infoConfigured ? "Configurada" : "Sin configurar"}
          </p>
          <Link
            to="/admin/info"
            style={{
              color: "#d1b06b",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Editar Info &rarr;
          </Link>
        </div>

        {/* Card Convenios */}
        <div style={cardStyle}>
          <h3>Convenios</h3>
          <p style={{ fontSize: "2rem", margin: "10px 0" }}>
            {loading ? "..." : stats.partnersCount}
          </p>
          <p style={{ color: "#666" }}>Activos</p>
          <Link
            to="/admin/convenios"
            style={{
              color: "#d1b06b",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Gestionar Convenios &rarr;
          </Link>
        </div>

        {/* Card Planes */}
        <div style={cardStyle}>
          <h3>Planes Exequiales</h3>
          <p style={{ fontSize: "2rem", margin: "10px 0" }}>
            {loading ? "..." : stats.plansCount}
          </p>
          <p style={{ color: "#666" }}>Disponibles</p>
          <Link
            to="/admin/planes"
            style={{
              color: "#d1b06b",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Gestionar Planes &rarr;
          </Link>
        </div>

        {/* Card Promos */}
        <div style={cardStyle}>
          <h3>Promociones</h3>
          <p style={{ fontSize: "2rem", margin: "10px 0" }}>
            {loading ? "..." : stats.promosCount}
          </p>
          <p style={{ color: "#666" }}>Activas</p>
          <Link
            to="/admin/promos"
            style={{
              color: "#d1b06b",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Gestionar Promos &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
