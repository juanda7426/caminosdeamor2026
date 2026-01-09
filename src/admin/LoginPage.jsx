import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../css/Login.css"; // We will create this CSS

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(email, password);
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Error al iniciar sesión: Verifique sus credenciales");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="../img/logoLov.jpg" alt="Logo" className="login-logo" />
          <h2>Administración Web</h2>
          <h4>Caminos de Amor</h4>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
