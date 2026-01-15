import { useState, useEffect } from "react";

const ModalPlans = ({ isOpen, onClose, planData, onSave, tipo }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: "",
    image: "",
    color: "#0087B7",
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  //******************* */
  useEffect(() => {
    if (planData) {
      setFormData({
        name: planData.name || "",
        description: planData.description || "",
        features: planData.features || "",
        image: planData.image || "",
        color: planData.color || "#0087B7",
        order: planData.order || 0,
        isActive: planData.isActive ?? true,
      });
      setPreviewUrl(planData.image || "");
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        features: "",
        image: "",
        color: "#0087B7",
        order: 0,
        isActive: true,
      });
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [planData, isOpen]);

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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {planData ? "Editar " + tipo : "Nuevo " + tipo}
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
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Nombre del Plan
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Ej: Plan Ocaso"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Descripción Corta
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control"
                      rows="2"
                      placeholder="Breve resumen del plan..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Características (Una por línea)
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      className="form-control"
                      rows="5"
                      placeholder="Caracteristica 1&#10;Caracteristica 2&#10;Caracteristica 3&#10;...."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Orden de visualización
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Ej: 1"
                    />
                    <small className="text-muted">
                      Números menores aparecen primero.
                    </small>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <label htmlFor="exampleColorInput" className="form-label">
                        Color de Fondo
                      </label>
                      <input
                        type="color"
                        name="color"
                        className="form-control form-control-color w-100"
                        id="exampleColorInput"
                        value={formData.color || "#0087B7"}
                        title="Seleccione el color para su plan"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Imagen del Plan
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="form-control"
                      required={!planData}
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="img-fluid"
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
                      <label className="form-check-label">Plan Activo</label>
                    </div>
                  </div>
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
                {planData ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalPlans;
