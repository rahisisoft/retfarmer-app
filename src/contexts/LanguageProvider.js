import React, { useState, useEffect, useCallback } from "react";
import axios from "@/utils/axiosInstance";
import { LanguageContext } from "./LanguageContext";

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("rn");
  const [context, setContext] = useState("userboard");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "rn";
    const storedCtx = localStorage.getItem("lang_context") || "userboard";
    setLanguage(storedLang);
    setContext(storedCtx);
  }, []);

  const fetchTranslations = useCallback(async () => {
    try {
      const res = await axios.get("/get_translations.php");
      setTranslations(res.data || {});
    } catch (error) {
      console.error("Erreur de chargement des traductions :", error);
    }
  }, []);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("lang_context", context);
  }, [context]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const changeContext = (ctx) => {
    setContext((prev) => (prev === ctx ? prev : ctx)); // ✅ évite les updates inutiles
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        context,
        translations,
        changeLanguage,
        changeContext,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
