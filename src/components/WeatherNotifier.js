import { useEffect, useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';


const WeatherNotifier = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation('weather');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const region = user?.region || "Cibitoke";

    // Demande permission à chaque login (donc pas de limite journalière ici)
    
    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          fetchWeatherAndNotify(region);
        }
      });
    } else {
      fetchWeatherAndNotify(region);
    }
    

  }, [language, t]); // rappel à chaque changement de langue

  const getAgriculturalAdvice = (description, temp) => {
    const desc = description.toLowerCase();

    if (desc.includes("rain") || desc.includes("pluie") || desc.includes("averse")) {
      return t.advice_rain;
    } 
    if (temp >= 35) {
      return t.advice_heat;
    }
    if (temp <= 10) {
      return t.advice_cold;
    }
    if (desc.includes("wind") || desc.includes("vent")) {
      return t.advice_wind;
    }
    return t.advice_normal;
  };

  const fetchWeatherAndNotify = async (region) => {
    try {
      const apiKey = "bd499e8f4ad501f0536b34ae2208c9be"; // ta clé API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${apiKey}&units=metric&lang=${language}`
      );

      if (!response.ok) throw new Error("Erreur météo");

      const data = await response.json();
      const weather = {
        temp: data.main.temp,
        description: data.weather[0].description,
      };

      const advice = getAgriculturalAdvice(weather.description, weather.temp);

      new Notification(t.daily_weather_title, {
        body: `📍 ${region}\n🌡️ ${weather.temp}°C — ${weather.description}\n\n${advice}`,
        icon: "/images/logo.png",
      });
    } catch (err) {
      console.error("Erreur de météo :", err);
    }
  };

  return null; // aucun rendu visuel
};

export default WeatherNotifier;
