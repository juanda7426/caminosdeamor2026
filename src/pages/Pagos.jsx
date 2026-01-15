import { FloatingWhatsApp } from "react-floating-whatsapp";
import { Number } from "../config/arreglos";
import "../css/benefits_payments.css";

export const Pagos = () => {
  const logo = "../../img/logoS.png";

  return (
    <>
      <FloatingWhatsApp
        phoneNumber={Number}
        accountName="Caminos de Amor"
        allowEsc
        allowClickAway
        notification
        notificationSound
        chatMessage={`Tienes alguna pregunta sobre nuestras formas de pago? `}
        buttonClassName="me-2 mb-0"
        buttonStyle={{ marginBottom: "80px" }}
        chatboxStyle={{ marginBottom: "70px" }}
        avatar={logo}
      />

      <div className="modern-section container">
        <h2 className="modern-title">Medios de Pago</h2>

        <div className="payment-info-box">
          <i className="fas fa-info-circle me-2"></i>
          No olvides enviar el comprobante de pago para registrar la mensualidad
          de tu mascota.
        </div>

        <div className="row g-4 justify-content-center">
          {/* Physical Point */}
          <div className="col-lg-4 col-md-6">
            <div className="payment-card">
              <i className="fas fa-map-marked-alt payment-icon"></i>
              <h4 className="payment-title">Punto Físico</h4>
              <p className="text-muted mb-4">
                Puedes acercarte a nuestra sede principal para realizar tus
                pagos en efectivo.
              </p>
              <div className="bg-light p-3 rounded">
                <strong>Calle 49a #50-11, Andes, Antioquia</strong>
                <br />
                <small>Edificio Cóndor de los Andes, Local 202</small>
              </div>
            </div>
          </div>

          {/* Nequi */}
          <div className="col-lg-4 col-md-6">
            <div className="payment-card">
              <h4 className="payment-title">Nequi</h4>
              <img
                src="../../img/nequi.jpeg"
                alt="QR Nequi"
                className="payment-img"
              />
            </div>
          </div>

          {/* Bancolombia */}
          <div className="col-lg-4 col-md-6">
            <div className="payment-card">
              <h4 className="payment-title">Bancolombia</h4>
              <img
                src="../../img/bancolombia.jpeg"
                alt="QR Bancolombia"
                className="payment-img"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
