import { NavLink } from "react-router-dom";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { Number, whatsappLink } from "./../config/arreglos";
import "../css/qr.css";

export const OptionsQr = () => {
  const logo = "../../img/logoS.png";

  //*************************** */
  return (
    <>
      <FloatingWhatsApp
        phoneNumber={Number}
        accountName="Caminos de Amor"
        allowEsc
        allowClickAway
        notification
        notificationSound
        chatMessage={`Tienes alguna pregunta sobre nuestros servicios o formas de pago? `}
        buttonClassName="me-2 mb-0"
        buttonStyle={{ marginBottom: "80px" }}
        chatboxStyle={{ marginBottom: "70px" }}
        avatar={logo}
      />
      <div className="container-fluid mt-1 ">
        <div className="row text-center mt-5 ">
          <div className="col-sm-12 mb-5">
            <NavLink to={"/home"} className="btn qrBtn">
              Inicio
            </NavLink>
          </div>
          <div className="col-sm-12 mb-5">
            <NavLink to={"/pagos"} className="btn qrBtn">
              Pagos
            </NavLink>
          </div>
          <div className="col-sm-12 mb-5">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn qrBtn"
            >
              Servicio Funebre
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
