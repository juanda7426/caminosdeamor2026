import { useState, useEffect } from "react";
import { db, storage } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import ModalPlans from "../components/modales/ModalPlans";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    features: "",
    image: "",
    color: "#0087B7",
    order: 0,
    isActive: true,
  });

  const plansCollectionRef = collection(db, "plans");
  const CACHE_KEY = "plans_cache";

  //************************ */
  // Cache Helper Functions
  const savePlansToCache = (plansData) => {
    try {
      const cacheData = {
        data: plansData,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const getPlansFromCache = () => {
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

  // Fetch Plans
  const getPlans = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // Try to load from cache first if not forcing refresh
      // console.log(forceRefresh);
      if (!forceRefresh) {
        const cachedPlans = getPlansFromCache();
        if (cachedPlans) {
          setPlans(cachedPlans);
          setLoading(false);
          fetchAndUpdateCache();
          return;
        }
      }

      const data = await getDocs(plansCollectionRef);
      const plansData = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      console.log("Planes obtenidos:", plansData);
      setPlans(plansData);
      savePlansToCache(plansData);
    } catch (error) {
      console.error("Error al obtener planes:", error);
      const cachedPlans = getPlansFromCache();
      if (cachedPlans) {
        setPlans(cachedPlans);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAndUpdateCache = async () => {
    try {
      const data = await getDocs(plansCollectionRef);
      const plansData = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      savePlansToCache(plansData);
      setPlans(plansData);
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  };

  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      const decodedUrl = decodeURIComponent(imageUrl);
      const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch && pathMatch[1]) {
        const imagePath = pathMatch[1];
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    } catch (error) {
      console.error("Error deleting image from storage:", error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  // Create or Update Plan
  const handleSubmit = async (formData, imageFileFromModal) => {
    if (!formData.name || !formData.description)
      return Swal.fire({
        title: "Atención",
        text: "Llena al menos Nombre y Descripción",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });

    setProcessing(true);
    try {
      let imageUrl = formData.image;
      let oldImageUrl = null;

      if (editingId && imageFileFromModal && formData.image) {
        oldImageUrl = formData.image;
      }

      if (imageFileFromModal) {
        const storageRef = ref(
          storage,
          `plans/${Date.now()}_${imageFileFromModal.name}`
        );
        await uploadBytes(storageRef, imageFileFromModal);
        imageUrl = await getDownloadURL(storageRef);
      }

      const planData = {
        name: formData.name,
        description: formData.description,
        features: formData.features,
        featuresList: formData.features
          .split("\n")
          .filter((item) => item.trim() !== ""),
        image: imageUrl,
        color: formData.color || "#0087B7",
        order: Number(formData.order) || 0,
        isActive: formData.isActive,
        updatedAt: new Date(),
      };

      if (editingId) {
        const planDoc = doc(db, "plans", editingId);
        await updateDoc(planDoc, planData);
        if (oldImageUrl && imageFileFromModal) {
          await deleteImageFromStorage(oldImageUrl);
        }
        Swal.fire({
          title: "¡Actualizado!",
          text: "Plan actualizado con éxito",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      } else {
        await addDoc(plansCollectionRef, {
          ...planData,
          createdAt: new Date(),
        });
        Swal.fire({
          title: "¡Agregado!",
          text: "Plan agregado con éxito",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      }

      resetForm();
      setIsModalOpen(false);
      getPlans(true);
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        title: "Error",
        text: "Error al guardar el plan",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setNewPlan({
      name: "",
      description: "",
      features: "",
      image: "",
      color: "#0087B7",
      order: 0,
      isActive: true,
    });
    setEditingId(null);
  };

  const startEdit = (plan) => {
    setEditingId(plan.id);
    setNewPlan({
      name: plan.name,
      description: plan.description,
      features: plan.features || "",
      image: plan.image,
      color: plan.color || "#0087B7",
      order: plan.order || 0,
      isActive: plan.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    setProcessing(true);
    try {
      const planDoc = doc(db, "plans", id);
      await updateDoc(planDoc, { isActive: !currentStatus });
      getPlans(true);
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setProcessing(false);
    }
  };

  const deletePlan = async (id) => {
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
        const planToDelete = plans.find((p) => p.id === id);
        await deleteDoc(doc(db, "plans", id));
        if (planToDelete && planToDelete.image) {
          await deleteImageFromStorage(planToDelete.image);
        }
        getPlans(true);
        Swal.fire("Eliminado!", "El plan ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire("Error!", "Hubo un problema al eliminar.", "error");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {processing && <Loader message="Procesando cambios..." />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold main-color mb-0">Panel de Planes Exequiales</h1>
        <button
          className="btn btn-sm"
          title="Agregar nuevo plan"
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
        <div className="col-12">
          <h3 className="mb-4">Planes Existentes ({plans.length})</h3>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-3">
              {plans.map((plan) => (
                <div key={plan.id} className="col-md-6">
                  <div className="card shadow-sm border-0 overflow-hidden h-100 position-relative">
                    <div className="row g-0">
                      <div
                        className="col-md-4"
                        style={{
                          height: "180px",
                          borderLeft: `5px solid ${plan.color || "#0087B7"}`,
                        }}
                      >
                        <img
                          src={plan.image ? plan.image : "../img/logoLov.jpg"}
                          alt={plan.name}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-8 px-3 py-2 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 className="fw-bold mb-1">{plan.name}</h5>
                            <span
                              className={`badge ${
                                plan.isActive ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {plan.isActive ? "Activa" : "Inactiva"}
                            </span>
                          </div>
                          {/* <p className='fw-bold text-primary mb-1' style={{ color: "#0087b7" }}>
														{plan.price}
													</p> */}
                          <p
                            className="small text-muted mb-2"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {plan.description}
                          </p>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-light text-secondary border-0"
                            onClick={() => startEdit(plan)}
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
                              plan.isActive ? "text-warning" : "text-success"
                            }`}
                            onClick={() => toggleStatus(plan.id, plan.isActive)}
                            title={plan.isActive ? "Desactivar" : "Activar"}
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
                                plan.isActive ? "fa-eye-slash" : "fa-eye"
                              }`}
                              style={{ fontSize: "0.85rem" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger border-0"
                            onClick={() => deletePlan(plan.id)}
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
              {plans.length === 0 && (
                <div className="text-center py-5 bg-light rounded border">
                  <p className="mb-0">Aún no hay planes configurados.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ModalPlans
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        planData={editingId ? newPlan : null}
        onSave={handleSubmit}
        tipo="Plan"
      />
    </div>
  );
};

export default ManagePlans;
