import { useState } from "react";
import axios from "axios";
import UserLayout from "@/components/UserLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faCloudRain, faCloud, faSnowflake } from "@fortawesome/free-solid-svg-icons";
import Calendar from 'react-calendar';
import { useEffect } from 'react';


export default function Weather() {
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const agriculturalEvents = {
  '2025-01-10': 'Récolte du maïs (saison A)',
  '2025-02-15': 'Semis de haricots (saison B)',
  '2025-03-05': 'Traitement phytosanitaire',
  '2025-10-01': 'Semis du maïs et manioc',
  // Ajoute d'autres événements ici
};

  const apiKey = "bd499e8f4ad501f0536b34ae2208c9be";

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
      <div className="weather-card container">
        <h1 className="mb-4">Weather Forecast</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
          />
          <button onClick={fetchWeather} className="btn btn-primary">
            {loading ? "Getting..." : "Get Forecast"}
          </button>
        </div>

        {error && <p className="text-danger">{error}</p>}

        {forecast && groupedForecast && (
          <div className="mt-4">
            <h3 className="text-primary">Weather Details for {forecast.city.name}</h3>
            {Object.entries(groupedForecast).map(([date, data], index) => (
              <div key={index} className="mb-4">
                <div className="date-title">{date}</div>
                <table className="table table-bordered mt-2">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Temp (°C)</th>
                      <th>Description</th>
                      <th>Humidity / Pressure</th>
                      <th>Wind</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.dt_txt.split(" ")[1]}</td>
                        <td>{item.main.temp} °C</td>
                        <td>
                          {item.weather[0].description}
                          <img
                            src={getWeatherIconUrl(item.weather[0].icon)}
                            alt={item.weather[0].description}
                            className="weather-icon"
                          />
                        </td>
                        <td>{item.main.humidity}% ~ {item.main.pressure} hPa</td>
                        <td>
                          Speed: {item.wind.speed} m/s<br />
                          Dir: {item.wind.deg}°
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Calendrier Agricole du Burundi */}
        <div className="mt-5">
  <h3 className="text-success">📅 Calendrier Agricole du Burundi</h3>
  <Calendar
    onClickDay={(value) => {
      const key = value.toISOString().split('T')[0];
      const event = agriculturalEvents[key];
      if (event) {
        alert(`📌 ${event}`);
      }
    }}
    tileContent={({ date }) => {
      const key = date.toISOString().split('T')[0];
      return agriculturalEvents[key] ? (
        <div style={{ fontSize: '0.7em', color: 'green' }}>📍</div>
      ) : null;
    }}
  />
</div>

      </div>
    </UserLayout>
  );
}
