import React from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import '../css/Admin.css'; // We will create this later

const AdminLayout = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to='/admin/login' />;
	}

	return (
		<div className='admin-layout' style={{ display: "flex", minHeight: "100vh" }}>
			<aside style={{ width: "170px", background: "#333", color: "#fff", padding: "20px" }}>
				<h3>Panel Admin</h3>
				<nav>
					<ul style={{ listStyle: "none", padding: 0 }}>
						<li>
							<Link to='/admin/dashboard' style={{ color: "white", display: "block", padding: "10px 0" }}>
								Dashboard
							</Link>
						</li>
						<li>
							<Link to='/admin/promos' style={{ color: "white", display: "block", padding: "10px 0" }}>
								Promociones
							</Link>
						</li>
						<li>
							<Link to='/admin/convenios' style={{ color: "white", display: "block", padding: "10px 0" }}>
								Convenios
							</Link>
						</li>
						<li>
							<Link to='/admin/planes' style={{ color: "white", display: "block", padding: "10px 0" }}>
								Planes
							</Link>
						</li>
						<li>
							<Link to='/admin/info' style={{ color: "white", display: "block", padding: "10px 0" }}>
								Info Contacto
							</Link>
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
