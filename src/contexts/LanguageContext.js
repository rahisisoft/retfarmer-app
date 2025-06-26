import { createContext } from "react";

export const LanguageContext = createContext({
  language: "en",
  context: "userboard",
  translations: {},
  changeLanguage: () => {},
  changeContext: () => {}
});
