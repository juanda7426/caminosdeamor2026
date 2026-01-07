import React from "react";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/adminLayout.css";

const AdminLayout = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to='/admin/login' />;
	}

	return (
		<div className='admin-layout'>
			<aside className='admin-aside'>
				<h4 className='admin-title'>Panel Admin</h4>
				<hr />
				<nav className='mt-4'>
					<ul>
						<li>
							<NavLink to='/admin/dashboard' className={({ isActive }) => (isActive ? "link link-active" : "link")}>
								Dashboard
							</NavLink>
						</li>
						<li>
							<NavLink to='/admin/convenios' className={({ isActive }) => (isActive ? "link link-active" : "link")}>
								Beneficios
							</NavLink>
						</li>
						<li>
							<NavLink to='/admin/info' className={({ isActive }) => (isActive ? "link link-active" : "link")}>
								Info Empresa
							</NavLink>
						</li>
						<li>
							<NavLink to='/admin/novedades' className={({ isActive }) => (isActive ? "link link-active" : "link")}>
								Novedades
							</NavLink>
						</li>
						<li>
							<NavLink to='/admin/planes' className={({ isActive }) => (isActive ? "link link-active" : "link")}>
								Planes
							</NavLink>
						</li>
						<li>
							<NavLink to='/admin/promos' className={({ isActive }) => (isActive ? "link link-active" : "link")}>
								Promociones
							</NavLink>
						</li>
					</ul>
				</nav>
			</aside>
			<main style={{ flex: 1, padding: "20px", background: "#f4f4f9" }}>
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
