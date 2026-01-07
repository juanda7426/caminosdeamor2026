import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// Public Pages
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Planes } from "./pages/Planes";
import { Pagos } from "./pages/Pagos";
import { Beneficios } from "./pages/Beneficios";
import { PublicLayout } from "./components/PublicLayout";

// Admin Pages
import LoginPage from "./admin/LoginPage";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageInfo from "./admin/ManageInfo";
import ManagePromos from "./admin/ManagePromos";
import ManageNovedades from "./admin/ManageNovedades";
import ManagePartners from "./admin/ManagePartners"; // New
import ManagePlans from "./admin/ManagePlans"; // New

export const App = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Rutas Públicas */}
					<Route element={<PublicLayout />}>
						<Route path='/' element={<Home />} />
						<Route path='/home' element={<Home />} />
						<Route path='/nosotros' element={<About />} />
						<Route path='/contacto' element={<Contact />} />
						<Route path='/planes' element={<Planes />} />
						<Route path='/pagos' element={<Pagos />} />
						<Route path='/beneficios' element={<Beneficios />} />
					</Route>

					{/* Rutas Administrativas */}
					<Route path='/admin/login' element={<LoginPage />} />

					<Route path='/admin' element={<AdminLayout />}>
						<Route index element={<Dashboard />} />
						<Route path='dashboard' element={<Dashboard />} />
						<Route path='promos' element={<ManagePromos />} />
						<Route path='novedades' element={<ManageNovedades />} />
						<Route path='info' element={<ManageInfo />} />
						<Route path='convenios' element={<ManagePartners />} />
						<Route path='planes' element={<ManagePlans />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
};
