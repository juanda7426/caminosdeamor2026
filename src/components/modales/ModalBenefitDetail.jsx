import { whatsappLink } from "../../config/arreglos";

const ModalBenefitDetail = ({ isOpen, onClose, benefitData }) => {
  if (!isOpen || !benefitData) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(5px)",
      }}
      tabIndex="-1"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow-lg overflow-hidden"
          style={{ borderRadius: "20px" }}
        >
          {/* Header with Background Pattern */}
          <div
            className="position-relative"
            style={{
              background: "linear-gradient(135deg, #0087b7 0%, #005a7a 100%)",
              height: "100px",
            }}
          >
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={onClose}
              style={{ zIndex: 10, opacity: 1 }}
            ></button>
            <div
              className="position-absolute w-100 h-100"
              style={{
                opacity: 0.1,
                backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="modal-body px-4 pb-5" style={{ marginTop: "-80px" }}>
            <div className="d-flex flex-column align-items-center mb-4">
              <div
                className="bg-white rounded-circle shadow p-2 mb-3 d-flex align-items-center justify-content-center"
                style={{ width: "160px", height: "160px" }}
              >
                <img
                  src={benefitData.img}
                  alt={benefitData.partnerName}
                  className="img-fluid rounded-circle"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "../../img/logoS.png";
                  }}
                />
              </div>
              <h3 className="fw-bold text-dark text-center mb-1">
                {benefitData.partnerName}
              </h3>
              <span className="badge bg-primary text-dark bg-opacity-10 border border-info px-3 py-2 rounded-pill">
                Aliado {benefitData.category || "Oficial"}
              </span>
            </div>

            {/* Benefit Highlight */}
            <div className="card border-0 bg-primary bg-opacity-10 mb-4 text-center">
              <div className="card-body py-4">
                <h6
                  className="text-uppercase text-primary fw-bold mb-2"
                  style={{ letterSpacing: "2px", fontSize: "0.8rem" }}
                >
                  Tu Beneficio Exclusivo
                </h6>
                <h4
                  className="fw-bold text-dark mb-0"
                  style={{ color: "#005a7a" }}
                >
                  {benefitData.title}
                </h4>
              </div>
            </div>

            <div className="row g-4">
              {/* Description Section */}
              <div className="col-md-7">
                {benefitData.description && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2">
                      Sobre el Beneficio
                    </h6>
                    <p className="text-muted" style={{ lineHeight: "1.5" }}>
                      {benefitData.description}
                    </p>
                  </div>
                )}

                {benefitData.terms && (
                  <div className="p-3 bg-light rounded border border-light">
                    <h6
                      className="fw-bold text-secondary mb-2"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <i className="fas fa-file-contract me-2"></i>Términos y
                      Condiciones
                    </h6>
                    <p className="text-muted small mb-0 fst-italic">
                      {benefitData.terms}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Info Sidebar */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm bg-light">
                  <div className="card-body">
                    <h6 className="fw-bold text-secondary mb-3">
                      Información de Contacto
                    </h6>
                    <ul className="list-unstyled mb-0">
                      {benefitData.website && (
                        <li className="mb-3">
                          <a
                            href={benefitData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none d-flex align-items-center text-dark"
                          >
                            <div
                              className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "35px",
                                height: "35px",
                                color: "#0087b7",
                              }}
                            >
                              <i className="fas fa-globe"></i>
                            </div>
                            <span className="text-truncate">
                              Visitar Sitio Web
                            </span>
                          </a>
                        </li>
                      )}
                      {benefitData.phone && (
                        <li className="mb-3">
                          <a
                            href={`https://wa.me/${benefitData.phone.replace(
                              /[^0-9]/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none d-flex align-items-center text-dark"
                          >
                            <div
                              className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "35px",
                                height: "35px",
                                color: "#25D366",
                              }}
                            >
                              <i className="fab fa-whatsapp"></i>
                            </div>
                            <span>{benefitData.phone}</span>
                          </a>
                        </li>
                      )}

                      {benefitData.address && (
                        <li className="mb-2">
                          <div className="d-flex align-items-start text-dark">
                            <div
                              className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                              style={{
                                width: "35px",
                                height: "35px",
                                color: "#dc3545",
                              }}
                            >
                              <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <span
                              style={{ fontSize: "0.95rem", marginTop: "5px" }}
                            >
                              {benefitData.address}
                            </span>
                          </div>
                        </li>
                      )}
                    </ul>

                    {/* Default Contact Note if no specific info */}
                    {!benefitData.website &&
                      !benefitData.phone &&
                      !benefitData.address && (
                        <div className="text-center py-3">
                          <span className="text-muted small">
                            Para más información, contáctanos directamente a
                            nuestro WhatsApp 👇
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-success btn-sm w-100 rounded-pill"
                  >
                    <i className="fab fa-whatsapp me-2"></i>Contactar a Caminos
                    de Amor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBenefitDetail;
