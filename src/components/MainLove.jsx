import React from "react";
import "../css/main.css";
import { whatsappLink } from './../config/arreglos';

export const MainLove = ({ children }) => {

  return (
    <div className=" d-flex justify-content-center align-items-start">
      {children}
      {/* Botón de WhatsApp flotante */}
      <a
        href={whatsappLink}
        title="Chat WhatsApp"
        target="_blank"
        className="btn btn-success whatsapp-float fab fa-whatsapp"
      />
    </div>
  );
};
