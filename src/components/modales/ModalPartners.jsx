import { useState, useEffect } from "react";

const ModalPartners = ({ isOpen, onClose, partnerData, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    benefit: "",
    logo: "",
    category: "Mascota",
    isActive: true,
    website: "",
    phone: "",
    address: "",
    terms: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (partnerData) {
      setFormData({
        name: partnerData.name || "",
        description: partnerData.description || "",
        benefit: partnerData.benefit || "",
        logo: partnerData.logo || "",
        category: partnerData.category || "Mascota",
        isActive: partnerData.isActive ?? true,
        website: partnerData.website || "",
        phone: partnerData.phone || "",
        address: partnerData.address || "",
        terms: partnerData.terms || "",
      });
      setPreviewUrl(partnerData.logo || "");
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        benefit: "",
        logo: "",
        category: "Mascota",
        isActive: true,
        website: "",
        phone: "",
        address: "",
        terms: "",
      });
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [partnerData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, imageFile);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      tabIndex="-1"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {partnerData ? "Editar Convenio" : "Nuevo Convenio"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej: Pet Love Shop"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Categoría</label>
                  <select
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Mascota">Mascota</option>
                    <option value="Familia">Familia</option>
                  </select>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Beneficio/Descuento
                  </label>
                  <input
                    type="text"
                    name="benefit"
                    value={formData.benefit}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej: 10% de descuento en todo"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Sitio Web</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://..."
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Teléfono/WhatsApp
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+57 300..."
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Calle 123..."
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                    placeholder="Detalles adicionales del convenio..."
                  ></textarea>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Términos y Condiciones
                  </label>
                  <textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                    placeholder="Condiciones específicas del descuento..."
                  ></textarea>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Logo de la Empresa
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewUrl && (
                    <div className="mt-3 text-center border rounded p-2 bg-light">
                      <p className="small text-muted mb-2">Previsualización:</p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "150px",
                          borderRadius: "8px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                  <label className="form-check-label">Convenio Activo</label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: "#0087b7", border: "none" }}
              >
                {partnerData ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalPartners;
