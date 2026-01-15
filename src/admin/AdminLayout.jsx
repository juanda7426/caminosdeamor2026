import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa";
import logo from "../img/logoLov.jpg";
import "../css/adminLayout.css";

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-aside d-flex flex-column">
        <h4 className="text-center mb-0">Panel </h4>
        <div className="row justify-content-center">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "4.8rem",
              height: "4.8rem",
              borderRadius: "80px",
            }}
          />
        </div>
        <h4 className="text-center mt-0"> Admin</h4>
        <hr className="my-0" />
        <nav className="mt-4">
          <ul>
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? "link link-active" : "link"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/convenios"
                className={({ isActive }) =>
                  isActive ? "link link-active" : "link"
                }
              >
                Beneficios
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/info"
                className={({ isActive }) =>
                  isActive ? "link link-active" : "link"
                }
              >
                Info Empresa
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/novedades"
                className={({ isActive }) =>
                  isActive ? "link link-active" : "link"
                }
              >
                Novedades
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/planes"
                className={({ isActive }) =>
                  isActive ? "link link-active" : "link"
                }
              >
                Planes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/promos"
                className={({ isActive }) =>
                  isActive ? "link link-active" : "link"
                }
              >
                Promociones
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="row mt-auto mb-3">
          <button
            onClick={logout}
            title="Cerrar Sesión"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "6rem",
              background: "#02C4FF",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                marginRight: "5px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              LogOut
            </span>
            <FaPowerOff size={12} />
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "20px", background: "#f4f4f9" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
