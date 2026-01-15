import { useState, useEffect } from "react";
import { db, storage } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import ModalPartners from "../components/modales/ModalPartners";

const ManagePartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
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

  const partnersCollectionRef = collection(db, "partners");

  // Fetch Partners
  const getPartners = async () => {
    setLoading(true);
    try {
      const data = await getDocs(partnersCollectionRef);
      setPartners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error al obtener convenios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPartners();
  }, []);

  // Delete Image from Storage
  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      // Check if it's a Firebase Storage URL
      if (imageUrl.includes("firebasestorage.googleapis.com")) {
        const decodedUrl = decodeURIComponent(imageUrl);
        const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch && pathMatch[1]) {
          const imagePath = pathMatch[1];
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        }
      }
    } catch (error) {
      console.error("Error deleting image from storage:", error);
    }
  };

  // Create or Update Partner
  const handleSubmit = async (formData, imageFileFromModal) => {
    if (!formData.name || !formData.benefit)
      return alert("Llena al menos Nombre y Beneficio");

    try {
      let imageUrl = formData.logo;
      let oldImageUrl = null;

      // If editing and uploading a new image, save the old URL for deletion
      if (editingId && imageFileFromModal && formData.logo) {
        oldImageUrl = formData.logo;
      }

      // Upload image if a new one is selected
      if (imageFileFromModal) {
        const storageRef = ref(
          storage,
          `partners/${Date.now()}_${imageFileFromModal.name}`
        );
        await uploadBytes(storageRef, imageFileFromModal);
        imageUrl = await getDownloadURL(storageRef);
      }

      const partnerData = {
        name: formData.name,
        description: formData.description,
        benefit: formData.benefit,
        category: formData.category,
        isActive: formData.isActive,
        logo: imageUrl,
        website: formData.website || "",
        phone: formData.phone || "",
        address: formData.address || "",
        terms: formData.terms || "",
      };

      if (editingId) {
        const partnerDoc = doc(db, "partners", editingId);
        await updateDoc(partnerDoc, partnerData);

        // Delete old image from storage if a new one was uploaded
        if (oldImageUrl && imageFileFromModal) {
          await deleteImageFromStorage(oldImageUrl);
        }

        alert("Convenio actualizado con éxito!");
      } else {
        await addDoc(partnersCollectionRef, partnerData);
        alert("Convenio agregado!");
      }

      resetForm();
      setIsModalOpen(false);
      getPartners();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el convenio");
    }
  };

  // Toggle Status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const partnerDoc = doc(db, "partners", id);
      await updateDoc(partnerDoc, { isActive: !currentStatus });
      getPartners();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Delete Partner
  const deletePartner = async (id) => {
    const confirm = window.confirm(
      "¿Seguro que quieres eliminar este convenio?"
    );
    if (confirm) {
      try {
        const partnerToDelete = partners.find((p) => p.id === id);
        await deleteDoc(doc(db, "partners", id));

        if (partnerToDelete && partnerToDelete.logo) {
          await deleteImageFromStorage(partnerToDelete.logo);
        }

        getPartners();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const resetForm = () => {
    setNewPartner({
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
    setEditingId(null);
  };

  // Start Editing
  const startEdit = (partner) => {
    setEditingId(partner.id);
    setNewPartner({
      name: partner.name,
      description: partner.description,
      benefit: partner.benefit,
      logo: partner.logo,
      category: partner.category || "Mascota",
      isActive: partner.isActive ?? true,
      website: partner.website || "",
      phone: partner.phone || "",
      address: partner.address || "",
      terms: partner.terms || "",
    });
    setIsModalOpen(true);
  };

  //*************** */
  return (
    <div style={{ padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold main-color mb-0">Gestión de Convenios</h1>
        <button
          className="btn btn-sm"
          title="Agregar nuevo convenio"
          style={{
            backgroundColor: "#5C636A",
            color: "#ffffffff",
            border: "none",
          }}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <i className="fas fa-plus me-2"></i>
          Nuevo
        </button>
      </div>

      <div className="row g-4">
        {/* List Section */}
        <div className="col-12">
          <h3 className="mb-4">Convenios Activos ({partners.length})</h3>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-3">
              {partners.map((partner) => (
                <div key={partner.id} className="col-md-6">
                  <div className="card shadow-sm border-0 overflow-hidden h-100 position-relative">
                    <div className="row g-0">
                      <div className="col-md-4" style={{ height: "150px" }}>
                        <img
                          src={partner.logo || "../../img/logoS.png"}
                          alt={partner.name}
                          className="w-100 h-100"
                          style={{ objectFit: "contain", padding: "10px" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../../img/logoS.png";
                          }}
                        />
                      </div>
                      <div className="col-md-8 px-3 py-2 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 className="fw-bold mb-1">{partner.name}</h5>
                            <span className="badge bg-secondary">
                              {partner.category || "Mascota"}
                            </span>
                          </div>

                          <div className="mb-1">
                            <span
                              className={`badge ${
                                partner.isActive !== false
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {partner.isActive !== false
                                ? "Activa"
                                : "Inactiva"}
                            </span>
                          </div>

                          <p
                            className="fw-bold mb-1"
                            style={{ color: "#d1b06b" }}
                          >
                            {partner.benefit}
                          </p>
                          <p
                            className="small text-muted mb-2"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {partner.description}
                          </p>
                        </div>
                        <div className="d-flex gap-1 justify-content-end">
                          <button
                            className="btn btn-sm btn-light text-secondary border-0"
                            onClick={() => startEdit(partner)}
                            title="Editar"
                            style={{
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                            }}
                          >
                            <i
                              className="fas fa-pencil-alt"
                              style={{ fontSize: "0.85rem" }}
                            ></i>
                          </button>
                          <button
                            className={`btn btn-sm btn-light border-0 ${
                              partner.isActive !== false
                                ? "text-warning"
                                : "text-success"
                            }`}
                            onClick={() =>
                              toggleStatus(partner.id, partner.isActive ?? true)
                            }
                            title={
                              partner.isActive !== false
                                ? "Desactivar"
                                : "Activar"
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                            }}
                          >
                            <i
                              className={`fas ${
                                partner.isActive !== false
                                  ? "fa-eye-slash"
                                  : "fa-eye"
                              }`}
                              style={{ fontSize: "0.85rem" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger border-0"
                            onClick={() => deletePartner(partner.id)}
                            title="Eliminar"
                            style={{
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                            }}
                          >
                            <i
                              className="fas fa-trash-alt"
                              style={{ fontSize: "0.85rem" }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {partners.length === 0 && (
                <div className="text-center py-5 bg-light rounded border col-12">
                  <p className="mb-0">Aún no hay convenios registrados.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ModalPartners
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        partnerData={editingId ? newPartner : null}
        onSave={handleSubmit}
      />
    </div>
  );
};

export default ManagePartners;
