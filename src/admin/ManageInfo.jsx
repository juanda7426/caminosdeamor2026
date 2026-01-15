import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

const ManageInfo = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [info, setInfo] = useState({
    phone: "",
    phone2: "",
    whatsapp: "",
    address: "",
    email: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    website: "",
    hours: "",
  });

  //****************** */
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const docRef = doc(db, "site_config", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      // Save to Firestore 'site_config' collection, document 'global'
      await setDoc(doc(db, "site_config", "global"), info);
      Swal.fire({
        title: "¡Éxito!",
        text: "Información actualizada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error saving info:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar la información",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Cargando información...</div>;

  //****************** */
  return (
    <>
      {processing && <Loader message="Guardando información..." />}

      <div
        style={{
          maxWidth: "800px",
          backgroundColor: "#f8f8f8ff",
          padding: "10px",
          borderRadius: "8px",
          margin: "10px auto",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h3>Información de la Empresa</h3>
        <p>Estos datos se reflejarán en el footer y header.</p>
      </div>

      {/* Formulario de Información */}
      <div
        style={{
          maxWidth: "1400px",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          margin: "30px auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-sm-6 form-group mb-2">
              <label className="fw-bold">Teléfono (Principal)</label>
              <input
                className="form-control"
                name="phone"
                value={info.phone || ""}
                onChange={handleChange}
                type="phone"
                placeholder="+57 300 ..."
              />
            </div>
            <div className="col-sm-6 form-group mb-2">
              <label className="fw-bold">Teléfono (Secundario)</label>
              <input
                className="form-control"
                name="phone2"
                value={info.phone2 || ""}
                onChange={handleChange}
                type="phone"
                placeholder="+57 310 ..."
              />
            </div>
            <div className="col-sm-6 form-group mb-2">
              <label className="fw-bold">Sitio Web (URL)</label>
              <input
                className="form-control"
                name="website"
                value={info.website || ""}
                onChange={handleChange}
                type="text"
                placeholder="www.caminosdeamor.com"
              />
            </div>

            <div className="col-sm-6 form-group mb-2">
              <label className="fw-bold">Whatsapp (Link)</label>
              <input
                className="form-control"
                name="whatsapp"
                value={info.whatsapp || ""}
                onChange={handleChange}
                type="text"
                placeholder="https://wa.me/..."
              />
            </div>
            <div className="col-sm-6 form-group mb-2">
              <label className="fw-bold">Dirección</label>
              <input
                className="form-control"
                name="address"
                value={info.address || ""}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div className="col-sm-6 form-group mb-2">
              <label className="fw-bold">Correo Electrónico</label>
              <input
                className="form-control"
                name="email"
                value={info.email || ""}
                onChange={handleChange}
                type="email"
              />
            </div>
            <div className="col-sm-12 form-group mb-2">
              <label className="fw-bold">Horarios de Atención</label>
              <textarea
                className="form-control"
                name="hours"
                value={info.hours || ""}
                onChange={handleChange}
                placeholder="Ej: Lunes a Viernes: 8am - 6pm"
                rows="1"
              />
            </div>
            <div className="col-sm-12 form-group mb-2">
              <label className="fw-bold">Facebook URL</label>
              <input
                className="form-control"
                name="facebook"
                value={info.facebook || ""}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div className="col-sm-12 form-group mb-2">
              <label className="fw-bold">Instagram URL</label>
              <input
                className="form-control"
                name="instagram"
                value={info.instagram || ""}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div className="col-sm-12 form-group mb-2">
              <label className="fw-bold">TikTok URL</label>
              <input
                className="form-control"
                name="tiktok"
                value={info.tiktok || ""}
                onChange={handleChange}
                type="text"
              />
            </div>
          </div>

          <div className="row mt-3">
            <button
              type="submit"
              disabled={processing}
              className="btn-login"
              style={{ marginTop: "20px", maxWidth: "200px", margin: "auto" }}
            >
              {processing ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ManageInfo;
