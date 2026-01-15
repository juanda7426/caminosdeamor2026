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
import ModalPromos from "../components/modales/ModalPromos";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

const ManageNovedades = () => {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNovedad, setNewNovedad] = useState({
    title: "",
    description: "",
    image: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const novedadesCollectionRef = collection(db, "novedades");
  const CACHE_KEY = "novedades_cache";

  //************************ */
  // Cache Helper Functions
  const saveNovedadesToCache = (novedadesData) => {
    try {
      const cacheData = {
        data: novedadesData,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const getNovedadesFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
    } catch (error) {
      console.error("Error reading from cache:", error);
    }
    return null;
  };

  // Fetch Novedades
  const getNovedades = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // Try to load from cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedNovedades = getNovedadesFromCache();
        if (cachedNovedades) {
          setNovedades(cachedNovedades);
          setLoading(false);
          // Optionally fetch in background to update cache
          fetchAndUpdateCache();
          return;
        }
      }

      // Fetch from Firebase
      const data = await getDocs(novedadesCollectionRef);
      const novedadesData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNovedades(novedadesData);
      saveNovedadesToCache(novedadesData);
    } catch (error) {
      console.error("Error al obtener novedades:", error);
      // Try to use cache as fallback
      const cachedNovedades = getNovedadesFromCache();
      if (cachedNovedades) {
        setNovedades(cachedNovedades);
      }
    } finally {
      setLoading(false);
    }
  };

  // Background fetch to update cache
  const fetchAndUpdateCache = async () => {
    try {
      const data = await getDocs(novedadesCollectionRef);
      const novedadesData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      saveNovedadesToCache(novedadesData);
      // Update state only if data changed
      setNovedades(novedadesData);
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  };

  // Helper function to delete image from Firebase Storage
  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      // Extract the path from the Firebase Storage URL
      // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
      const decodedUrl = decodeURIComponent(imageUrl);
      const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch && pathMatch[1]) {
        const imagePath = pathMatch[1];
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
        console.log("Image deleted from storage:", imagePath);
      }
    } catch (error) {
      console.error("Error deleting image from storage:", error);
      // Don't throw error, just log it - we don't want to block the operation
    }
  };

  useEffect(() => {
    getNovedades();
  }, []);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Create or Update Novedad
  const handleSubmit = async (formData, imageFileFromModal) => {
    if (!formData.title || !formData.description)
      return Swal.fire({
        title: "Atención",
        text: "Llena todos los campos",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });

    setProcessing(true);
    try {
      let imageUrl = formData.image;
      let oldImageUrl = null;

      // If editing and uploading a new image, save the old URL for deletion
      if (editingId && imageFileFromModal && formData.image) {
        oldImageUrl = formData.image;
      }

      // Upload image if a new one is selected
      if (imageFileFromModal) {
        const storageRef = ref(
          storage,
          `novedades/${Date.now()}_${imageFileFromModal.name}`
        );
        await uploadBytes(storageRef, imageFileFromModal);
        imageUrl = await getDownloadURL(storageRef);
      }

      const novedadData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        isActive: formData.isActive,
        updatedAt: new Date(),
      };

      if (editingId) {
        const novedadDoc = doc(db, "novedades", editingId);
        await updateDoc(novedadDoc, novedadData);

        // Delete old image from storage if a new one was uploaded
        if (oldImageUrl && imageFileFromModal) {
          await deleteImageFromStorage(oldImageUrl);
        }

        Swal.fire({
          title: "¡Actualizado!",
          text: "Novedad actualizada con éxito",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      } else {
        await addDoc(novedadesCollectionRef, {
          ...novedadData,
          createdAt: new Date(),
        });
        Swal.fire({
          title: "¡Agregado!",
          text: "Novedad agregada con éxito",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      }

      resetForm();
      setIsModalOpen(false);
      getNovedades(true); // Force refresh from Firebase after changes
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        title: "Error",
        text: "Error al guardar la novedad",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setNewNovedad({ title: "", description: "", image: "", isActive: true });
    setImageFile(null);
    setPreviewUrl("");
    setEditingId(null);
  };

  // Start Editing
  const startEdit = (novedad) => {
    setEditingId(novedad.id);
    setNewNovedad({
      title: novedad.title,
      description: novedad.description,
      image: novedad.image,
      isActive: novedad.isActive ?? true,
    });
    setPreviewUrl(novedad.image);
    setIsModalOpen(true);
  };

  // Toggle Status
  const toggleStatus = async (id, currentStatus) => {
    setProcessing(true);
    try {
      const novedadDoc = doc(db, "novedades", id);
      await updateDoc(novedadDoc, { isActive: !currentStatus });
      getNovedades(true); // Force refresh from Firebase after changes
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Delete Novedad
  const deleteNovedad = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setProcessing(true);
      try {
        // Find the novedad to get its image URL
        const novedadToDelete = novedades.find((n) => n.id === id);

        // Delete the document from Firestore
        await deleteDoc(doc(db, "novedades", id));

        // Delete the image from storage if it exists
        if (novedadToDelete && novedadToDelete.image) {
          await deleteImageFromStorage(novedadToDelete.image);
        }

        getNovedades(true); // Force refresh from Firebase after changes
        Swal.fire("Eliminado!", "La novedad ha sido eliminada.", "success");
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire("Error!", "Hubo un problema al eliminar.", "error");
      } finally {
        setProcessing(false);
      }
    }
  };

  //************************ */
  return (
    <div style={{ padding: "20px" }}>
      {processing && <Loader message="Procesando cambios..." />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold main-color mb-0">Panel de Novedades</h1>
        <button
          className="btn btn-sm"
          title="Agregar nueva novedad"
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
          Nueva
        </button>
      </div>

      <div className="row g-4">
        {/* List Section */}
        <div className="col-12">
          <h3 className="mb-4">Novedades Existentes ({novedades.length})</h3>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-3">
              {novedades.map((novedad) => (
                <div key={novedad.id} className="col-md-6">
                  <div className="card shadow-sm border-0 overflow-hidden h-100 position-relative">
                    <div className="row g-0">
                      <div className="col-md-4" style={{ height: "150px" }}>
                        <img
                          src={
                            novedad.image ? novedad.image : "../img/logoLov.jpg"
                          }
                          alt={novedad.title}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-8 px-3 py-2 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 className="fw-bold mb-1">{novedad.title}</h5>
                            <span
                              className={`badge ${
                                novedad.isActive ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {novedad.isActive ? "Activa" : "Inactiva"}
                            </span>
                          </div>
                          <p
                            className="small text-muted mb-2"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {novedad.description}
                          </p>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-light text-secondary border-0"
                            onClick={() => startEdit(novedad)}
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
                              novedad.isActive ? "text-warning" : "text-success"
                            }`}
                            onClick={() =>
                              toggleStatus(novedad.id, novedad.isActive)
                            }
                            title={novedad.isActive ? "Desactivar" : "Activar"}
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
                                novedad.isActive ? "fa-eye-slash" : "fa-eye"
                              }`}
                              style={{ fontSize: "0.85rem" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger border-0"
                            onClick={() => deleteNovedad(novedad.id)}
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
              {novedades.length === 0 && (
                <div className="text-center py-5 bg-light rounded border">
                  <p className="mb-0">Aún no hay novedades configuradas.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ModalPromos
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        promoData={editingId ? newNovedad : null}
        onSave={handleSubmit}
        tipo="Novedad"
      />
    </div>
  );
};

export default ManageNovedades;
