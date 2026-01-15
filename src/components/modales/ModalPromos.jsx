import { useState, useEffect } from "react";

const ModalPromos = ({ isOpen, onClose, promoData, onSave, tipo }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  //******************* */
  useEffect(() => {
    if (promoData) {
      setFormData({
        title: promoData.title || "",
        description: promoData.description || "",
        image: promoData.image || "",
        isActive: promoData.isActive ?? true,
      });
      setPreviewUrl(promoData.image || "");
      setImageFile(null);
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        isActive: true,
      });
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [promoData, isOpen]);

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

  //******************* */
  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      tabIndex="-1"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {promoData ? "Editar " + tipo : "Nueva " + tipo}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: Promo San Valentín"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Detalles de la promoción..."
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Imagen de la Promo</label>
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
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
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
                  <label className="form-check-label">Promoción Activa</label>
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
                {promoData ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalPromos;
