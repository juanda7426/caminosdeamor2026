import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation"; // Assuming it's in the same folder
import { FooterLove } from "./FooterLove";

export const PublicLayout = () => {
	return (
		<div className='app-container' style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<Navigation />
			<div className='main-wrapper' style={{ flex: "1 0 auto" }}>
				<Outlet />
			</div>
			<FooterLove />
		</div>
	);
};
