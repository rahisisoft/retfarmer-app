import { useState, useEffect,useContext } from "react";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';

export default function Weather() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation('weather');

  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cropAlerts, setCropAlerts] = useState([]);
  const [nextSeasonAlerts, setNextSeasonAlerts] = useState([]);
  const [upcomingAlerts, setUpcomingAlerts] = useState([]);

  const [regions, setRegions] = useState([]);
  const [crops, setCrops] = useState([]);

  const [filterRegion, setFilterRegion] = useState("");
  const [filterCrop, setFilterCrop] = useState("");
  
  const [expandedDays, setExpandedDays] = useState({});

  const router = useRouter();
  const apiKey = "bd499e8f4ad501f0536b34ae2208c9be";

  // Charger régions & cultures pour filtres
  useEffect(() => {
    axiosInstance.get("/get_regions.php").then(res => setRegions(res.data));
    axiosInstance.get("/get_crops.php").then(res => setCrops(res.data));
  }, []);

  // Charger alertes du jour & saison suivante
  useEffect(() => {
    axiosInstance.get("/get_crop_alerts.php").then(res => setCropAlerts(res.data));
    axiosInstance.get("/get_crop_next_season_alerts.php").then(res => setNextSeasonAlerts(res.data.alerts || []));
  }, []);

  // Charger alertes à venir selon filtres
  useEffect(() => {
    const params = {};
    if (filterRegion) params.region_id = filterRegion;
    if (filterCrop) params.crop_id = filterCrop;

    axiosInstance.get("/get_crop_upcoming_alerts.php", { params })
      .then(res => setUpcomingAlerts(res.data || []))
      .catch(err => console.error("Erreur chargement alertes à venir :", err));
  }, [filterRegion, filterCrop]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setForecast(null);
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: location,
          appid: apiKey,
          units: "metric",
        },
      });
      setForecast(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching weather data");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const toggleDayDetails = (date) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const getWeatherAdvice = (dayData) => {
    const conditions = dayData.map(item => item.weather[0].main);
    const temps = dayData.map(item => item.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const humidities = dayData.map(item => item.main.humidity);
    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
    
    if (conditions.includes("Rain")) {
      return `🌧️ ${t.rain_advice}`;
    }
    if (maxTemp > 30) {
      return `🔥 ${t.heat_advice}`;
    }
    if (minTemp < 5) {
      return `❄️ ${t.cold_advice}`;
    }
    if (conditions.includes("Clear") && maxTemp > 25) {
      return `☀️ ${t.sunny_advice}`;
    }
    if (avgHumidity > 80) {
      return `💧 ${t.humidity_advice}`;
    }
    return `🌾 ${t.normal_conditions}`;
  };

  const getDayIcon = (dayData) => {
    const conditions = dayData.map(item => item.weather[0].main);
    if (conditions.includes("Thunderstorm")) return "⛈️";
    if (conditions.includes("Rain")) return "🌧️";
    if (conditions.includes("Snow")) return "❄️";
    if (conditions.includes("Clear")) return "☀️";
    if (conditions.includes("Clouds")) return "☁️";
    return "🌤️";
  };

  const calculateDayAverages = (dayData) => {
    const temps = dayData.map(item => item.main.temp);
    const humidities = dayData.map(item => item.main.humidity);
    const winds = dayData.map(item => item.wind.speed);
    
    return {
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      minTemp: Math.min(...temps).toFixed(1),
      avgHumidity: (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(0),
      maxWind: Math.max(...winds).toFixed(1)
    };
  };

  const groupDataByDate = () => {
    if (!forecast) return null;
    return forecast.list.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  const groupedForecast = groupDataByDate();

  return (
    <UserLayout>
      <div className="container py-4">
        <div className="row">
          {/* Colonne gauche - Météo */}
          <div className="col-md-8">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h2 className="mb-4">🌤️ ${t.weather_title}</h2>
                <div className="alert alert-info">
                  <strong>📊 {t.weather_info} :</strong> 
                  <ul className="mb-0 mt-2">
                    <li>{t.forecast_impact}</li>
                    <li>{t.colored_icons}</li>
                    <li>{t.auto_advice}</li>
                  </ul>
                </div>
                
                <div className="input-group my-3">
                  <input
                    type="text"
                    placeholder="Entrez une localité (ex: Paris, FR)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control"
                  />
                  <button onClick={fetchWeather} className="btn btn-primary">
                    {loading ? "Chargement..." : "Afficher"}
                  </button>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                {forecast && groupedForecast && (
                  <div>
                    <h5 className="text-success mb-3">
                      📍 {forecast.city.name}, {forecast.city.country} | 
                      Population: {forecast.city.population?.toLocaleString() || "N/A"}
                    </h5>
                    
                    {/* Légende des symboles */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <small><span className="text-danger fw-bold">●</span> {t.legend_high_temp}</small>
                      <small><span className="text-primary fw-bold">●</span> {t.legend_low_temp}</small>
                      <small><span className="text-warning fw-bold">●</span> {t.legend_wind}</small>
                      <small><span className="text-success fw-bold">●</span> {t.legend_good}</small>
                    </div>

                    {Object.entries(groupedForecast).map(([date, dayData], i) => {
                      const dayAverages = calculateDayAverages(dayData);
                      const dayAdvice = getWeatherAdvice(dayData);
                      const dayIcon = getDayIcon(dayData);
                      
                      return (
                        <div key={i} className="mb-4 border rounded p-3">
                          <div 
                            className="d-flex justify-content-between align-items-center mb-2 cursor-pointer"
                            onClick={() => toggleDayDetails(date)}
                          >
                            <h5 className="mb-0">
                              {dayIcon} {new Date(date).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </h5>
                            <div>
                              <span className="text-danger fw-bold">{dayAverages.maxTemp}°C</span> / 
                              <span className="text-primary fw-bold"> {dayAverages.minTemp}°C</span>
                              <span className="ms-2">💧 {dayAverages.avgHumidity}%</span>
                              <span className="ms-2">🌬️ {dayAverages.maxWind}m/s</span>
                              <button 
                                className="btn btn-sm btn-outline-secondary ms-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDayDetails(date);
                                }}
                              >
                                {expandedDays[date] ? "Réduire" : "Détails"}
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-success mb-2">
                            <strong>{t.agricultural_advice} :</strong> {dayAdvice}
                          </div>
                          
                          {expandedDays[date] && (
                            <table className="table table-sm table-bordered mt-2">
                              <thead className="table-light">
                                <tr>
                                  <th>{t.hour}</th>
                                  <th>{t.temperature_c}</th>
                                  <th>{t.conditions}</th>
                                  <th>{t.humidity}</th>
                                  <th>{t.wind}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dayData.map((item, idx) => {
                                  const isHot = item.main.temp > 28;
                                  const isCold = item.main.temp < 10;
                                  const isWindy = item.wind.speed > 8;
                                  
                                  return (
                                    <tr key={idx}>
                                      <td>{item.dt_txt.split(" ")[1].substring(0, 5)}</td>
                                      <td className={isHot ? "text-danger fw-bold" : isCold ? "text-primary fw-bold" : ""}>
                                        {item.main.temp}°C
                                      </td>
                                      <td>
                                        <span className="d-inline-flex align-items-center">
                                          <img
                                            src={getWeatherIconUrl(item.weather[0].icon)}
                                            alt={item.weather[0].description}
                                            className="me-2"
                                            style={{ width: 30 }}
                                          />
                                          {item.weather[0].description}
                                        </span>
                                      </td>
                                      <td>{item.main.humidity}%</td>
                                      <td className={isWindy ? "text-warning fw-bold" : ""}>
                                        {item.wind.speed} m/s
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Alertes avec filtres */}
          <div className="col-md-4">
            <div className="card mb-3 shadow-sm">
              <div className="card-body text-center">
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => router.push("/adminCal")}
                >
                  📅 Gérer le Calendrier Agricole
                </button>
              </div>
            </div>

            {/* Filtres */}
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5>Filtres Alertes À Venir</h5>
                <div className="mb-2">
                  <select
                    className="form-select"
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                  >
                    <option value="">Toutes Régions</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    className="form-select"
                    value={filterCrop}
                    onChange={(e) => setFilterCrop(e.target.value)}
                  >
                    <option value="">Toutes Cultures</option>
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Alertes du jour */}
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">🔔 Alertes du Jour</h5>
                {cropAlerts.length === 0 ? (
                  <p className="text-muted">Aucune alerte aujourd’hui.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {cropAlerts.map((item, idx) => {
                      const today = new Date().toISOString().split("T")[0];
                      const isSowing = item.sowing_start <= today && today <= item.sowing_end;
                      return (
                        <li className="list-group-item small" key={idx}>
                          {isSowing ? (
                            <>📌 <strong>Semis de {item.crop}</strong> ({item.region}, {item.season})</>
                          ) : (
                            <>🌾 <strong>Récolte de {item.crop}</strong> ({item.region}, {item.season})</>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            {/* Alertes prochaines activités */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📅 À Venir (15 jours)</h5>
                {upcomingAlerts.length === 0 ? (
                  <p className="text-muted">Aucune activité prévue dans 15 jours.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {upcomingAlerts.map((item, idx) => (
                      <li className="list-group-item small" key={idx}>
                        🔄 <strong>{item.crop}</strong> ({item.region})<br />
                        {item.type === "sowing" ? "Semis" : "Récolte"} prévu le {item.date}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Saison suivante */}
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">🧭 Saison Suivante</h5>
                {nextSeasonAlerts.length === 0 ? (
                  <p className="text-muted">Aucune donnée.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {nextSeasonAlerts.map((item, idx) => (
                      <li className="list-group-item small" key={idx}>
                        🌱 <strong>{item.crop}</strong> à <em>{item.region}</em><br />
                        Semis : {item.sowing_start} ➜ {item.sowing_end}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}