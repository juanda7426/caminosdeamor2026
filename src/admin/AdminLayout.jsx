import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa";
import "../css/adminLayout.css";

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-aside d-flex flex-column">
        <h4 className="admin-title">Panel Admin</h4>
        <hr />
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
        <div className="container-fluid mt-auto  mb-2">
          <button
            onClick={logout}
            title="Cerrar Sesión"
            style={{
              background: "#02C4FF",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "5px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Cerrar Sesión
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
