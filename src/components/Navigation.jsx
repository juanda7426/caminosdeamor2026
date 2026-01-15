import { NavLink } from "react-router-dom";
import "../css/navegation.css";

export const Navigation = () => {
  return (
    <nav className="contenedor navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <img
          className="logo navbar-brand"
          src="../../img/logo.png"
          alt="Logo"
        />
        <h3 className="text-light titulo">Caminos de Amor</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-theme="light"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon " />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="nav-item">
              <NavLink
                className="navItem nav-link"
                onClick={() =>
                  document
                    .getElementById("navbarTogglerDemo02")
                    .classList.remove("show")
                }
                activeClassName="active"
                to={"/home"}
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item ">
              <NavLink
                className="navItem nav-link"
                onClick={() =>
                  document
                    .getElementById("navbarTogglerDemo02")
                    .classList.remove("show")
                }
                activeClassName="active"
                to={"/planes"}
              >
                Planes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="navItem nav-link"
                onClick={() =>
                  document
                    .getElementById("navbarTogglerDemo02")
                    .classList.remove("show")
                }
                activeClassName="active"
                to={"/nosotros"}
              >
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="navItem nav-link"
                onClick={() =>
                  document
                    .getElementById("navbarTogglerDemo02")
                    .classList.remove("show")
                }
                activeClassName="active"
                to={"/contacto"}
              >
                Contacto
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="navItem nav-link"
                onClick={() =>
                  document
                    .getElementById("navbarTogglerDemo02")
                    .classList.remove("show")
                }
                activeClassName="active"
                to={"/beneficios"}
              >
                Beneficios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="navItem nav-link"
                onClick={() =>
                  document
                    .getElementById("navbarTogglerDemo02")
                    .classList.remove("show")
                }
                activeClassName="active"
                to={"/pagos"}
              >
                Pagos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
