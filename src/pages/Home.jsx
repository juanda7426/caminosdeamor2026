import { useEffect, useState } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { HeroLove } from "../components/HeroLove";
import { SliderSection } from "../components/SliderSection";
import { Number } from "../config/arreglos";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export const Home = () => {
  const logo = "../../img/logoS.png";
  const [promociones, setPromociones] = useState([]);
  const [novedades, setNovedades] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [loadingNovedades, setLoadingNovedades] = useState(true);

  //********************** */
  // Fetch Promos from Firebase
  useEffect(() => {
    const fetchPromos = async () => {
      setLoadingPromos(true);
      try {
        const promosCol = collection(db, "promotions");
        const promoSnapshot = await getDocs(promosCol);
        const promoList = promoSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((p) => p.isActive !== false); // Default to active if field missing
        setPromociones(promoList);
      } catch (error) {
        console.error("Error fetching promos:", error);
      } finally {
        setLoadingPromos(false);
      }
    };

    fetchPromos();
  }, []);

  // Fetch Novedades from Firebase
  useEffect(() => {
    const fetchNovedades = async () => {
      setLoadingNovedades(true);
      try {
        const novedadesCol = collection(db, "novedades");
        const novedadesSnapshot = await getDocs(novedadesCol);
        const novedadesList = novedadesSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((n) => n.isActive !== false); // Default to active if field missing
        setNovedades(novedadesList);
      } catch (error) {
        console.error("Error fetching novedades:", error);
      } finally {
        setLoadingNovedades(false);
      }
    };

    fetchNovedades();
  }, []);

  //********************** */
  return (
    <div style={{ overflowX: "hidden" }}>
      <FloatingWhatsApp
        phoneNumber={Number}
        accountName="Caminos de Amor"
        allowEsc
        allowClickAway
        notification
        notificationSound
        chatMessage={`Hola, ¿En qué podemos ayudarte hoy?`}
        buttonClassName="me-2 mb-0"
        buttonStyle={{ marginBottom: "80px" }}
        chatboxStyle={{ marginBottom: "70px" }}
        avatar={logo}
      />

      <HeroLove />

      <div style={{ backgroundColor: "#f8f9fa" }}>
        {/* Only render if we have promos, otherwise maybe show loading or nothing */}
        {loadingPromos ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando promociones...</p>
          </div>
        ) : promociones.length > 0 ? (
          <SliderSection
            title="Nuestras Promociones"
            items={promociones}
            id="promociones"
          />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted fs-5">No hay promociones disponibles</p>
          </div>
        )}
      </div>

      <div className="bg-white">
        {loadingNovedades ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando novedades...</p>
          </div>
        ) : novedades.length > 0 ? (
          <SliderSection title="Novedades" items={novedades} id="novedades" />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted fs-5">No hay novedades disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};
