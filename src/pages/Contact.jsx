import { FloatingWhatsApp } from "react-floating-whatsapp";
import { dataCompany, Number } from "../config/arreglos";
import { useCompany } from "../context/CompanyContext";
import "../css/contact.css";

export const Contact = () => {
  const logo = "../../img/logoS.png";
  const { companyInfo } = useCompany();

  const {
    phone = "323 403 59 61",
    phone2 = "310 539 06 93",
    whatsapp = Number, // Fallback to config file if not in DB
    email = "caminosdeamorsas@gmail.com",
    address = "Calle 49a #50-11, Andes, Antioquia",
    facebook = "https://www.facebook.com/people/Funeraria-caminos-de-amor/100066903139742/",
    instagram = "https://www.instagram.com/caminosde.amor?utm_source=qr&igsh=OGx0Zm91dTF3enA1",
    tiktok = "https://vm.tiktok.com/ZMrrg4Vhu/",
  } = companyInfo || {};

  //****************** */
  return (
    <>
      <FloatingWhatsApp
        phoneNumber={
          whatsapp.replace(/[^0-9]/g, "") || Number.replace(/[^0-9]/g, "")
        }
        accountName="Caminos de Amor"
        allowEsc
        allowClickAway
        notification
        notificationSound
        chatMessage={`¿Tienes alguna pregunta sobre nuestros servicios?`}
        buttonClassName="me-2 mb-0"
        buttonStyle={{ marginBottom: "80px" }}
        chatboxStyle={{ marginBottom: "70px" }}
        avatar={logo}
      />

      <div className="contact-container container-fluid px-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="contact-card">
              <div className="contact-header">
                <h2>
                  <i className="fas fa-headset me-2"></i>Contáctanos
                </h2>
                <p className="mb-0 mt-2 opacity-75">
                  Estamos aquí para escucharte y acompañarte
                </p>
              </div>

              <div className="contact-body">
                <div className="row justify-content-center">
                  {/* Phone 1 */}
                  <div className="contact-item col-5 me-2">
                    <div className="contact-icon-box">
                      <i className="fas fa-phone-alt fs-5"></i>
                    </div>
                    <div className="contact-text">
                      <h5>Línea de Atención 1</h5>
                      <p>{phone || dataCompany.phone}</p>
                    </div>
                  </div>

                  {/* Phone 2 */}
                  <div className="contact-item col-5 ms-2">
                    <div className="contact-icon-box">
                      <i className="fas fa-mobile-alt fs-5"></i>
                    </div>
                    <div className="contact-text">
                      <h5>Línea de Atención 2</h5>
                      <p>{phone2 || dataCompany.phone2}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="contact-item col-5 me-2">
                    <div className="contact-icon-box">
                      <i className="fas fa-envelope fs-5"></i>
                    </div>
                    <div className="contact-text">
                      <h5>Correo Electrónico</h5>
                      <p>{email || dataCompany.email}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="contact-item col-5 ms-2">
                    <div className="contact-icon-box">
                      <i className="fas fa-map-marker-alt fs-5"></i>
                    </div>
                    <div className="contact-text">
                      <h5>Ubicación Principal</h5>
                      <p>{address || dataCompany.address}</p>
                    </div>
                  </div>
                </div>

                <div className="social-section">
                  <h5>Síguenos en Redes Sociales</h5>
                  <div className="social-icons">
                    {facebook ||
                      (dataCompany.facebook && (
                        <a
                          href={facebook || dataCompany.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="social-btn btn-facebook"
                          title="Facebook"
                        >
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      ))}
                    {instagram ||
                      (dataCompany.instagram && (
                        <a
                          href={instagram || dataCompany.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="social-btn btn-instagram"
                          title="Instagram"
                        >
                          <i className="fab fa-instagram"></i>
                        </a>
                      ))}
                    {tiktok ||
                      (dataCompany.tiktok && (
                        <a
                          href={tiktok || dataCompany.tiktok}
                          target="_blank"
                          rel="noreferrer"
                          className="social-btn btn-tiktok"
                          title="TikTok"
                        >
                          <i className="fab fa-tiktok"></i>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
