import { useContext, useEffect, useMemo } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";

const DEFAULT_LANGUAGE = "en";

export const useTranslation = (context) => {
  const {
    language,
    translations,
    context: currentContext,
    changeContext
  } = useContext(LanguageContext);

  // ✅ Corrigé pour éviter la boucle infinie
  useEffect(() => {
    if (context && currentContext !== context) {
      changeContext(context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const t = useMemo(() => {
    const ctxTranslations = translations?.[context] || {};
    return ctxTranslations?.[language] || ctxTranslations?.[DEFAULT_LANGUAGE] || {};
  }, [translations, context, language]);

  return { t };
};
