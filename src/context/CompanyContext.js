import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase-config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const CompanyContext = createContext();

export const useCompany = () => {
  return useContext(CompanyContext);
};

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState({
    phone: "",
    phone2: "",
    whatsapp: "",
    address: "",
    email: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    website: "",
    hours: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(
      doc(db, "site_config", "global"),
      (doc) => {
        if (doc.exists()) {
          setCompanyInfo(doc.data());
        } else {
          console.log("No config found, using defaults if any");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching company info:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    companyInfo,
    loading,
  };

  return (
    <CompanyContext.Provider value={value}>
      {!loading && children}
    </CompanyContext.Provider>
  );
};
