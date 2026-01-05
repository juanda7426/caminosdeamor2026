import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
		<div className='login-container'>
			<div className='login-card'>
				<h2>Administración</h2>
				{error && <div className='alert-error'>{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label>Correo Electrónico</label>
						<input type='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div className='form-group'>
						<label>Contraseña</label>
						<input type='password' required value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
					<button type='submit' className='btn-login'>
						Ingresar
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
