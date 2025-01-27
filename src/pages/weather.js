import { useState } from "react";
import axios from "axios";
import UserLayout from "@/components/UserLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faCloudRain, faCloud, faSnowflake } from "@fortawesome/free-solid-svg-icons";

export default function Weather() {
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const apiKey = "bd499e8f4ad501f0536b34ae2208c9be";

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setForecast(null);
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: location,
          appid: apiKey,
          units: "metric", // Celsius
        },
      });
      setForecast(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching weather data");
      setForecast(null);
    }
    finally {
      setLoading(false);
    }
  };

  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition) => {
    if (condition.includes("rain")) return faCloudRain;
    if (condition.includes("clear")) return faSun;
    if (condition.includes("cloud")) return faCloud;
    if (condition.includes("snow")) return faSnowflake;
    return faCloud; // Default icon
  };
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const groupDataByDate = () => {
    if (!forecast) return null;

    // Group the weather data by date
    const groupedData = forecast.list.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0]; // Extract the date (YYYY-MM-DD)
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return groupedData;
  };

  const groupedForecast = groupDataByDate();

  return (
    <UserLayout>
      <h1>Weather Forecast</h1>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="form-control mb-3"
      />
      <button onClick={fetchWeather} className="btn btn-primary">
       
        {loading ? "Geting..." : "Get Forecast"}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
      {forecast && groupedForecast && (
        <div className="mt-4">
          <h3>Weather Details for {forecast.city.name}</h3>
          {Object.entries(groupedForecast).map(([date, data], index) => (
            <div key={index} className="mb-4">
              <h4>{date}</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Temp (°C)</th>
                    <th>Desc.</th>
                    <th>Hum ~ Pres.</th>
                    <th>Vent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.dt_txt.split(" ")[1]}</td>
                      <td>{item.main.temp} °C</td>
                      <td>{item.weather[0].description}
                      <img
                  src={getWeatherIconUrl(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                  />
                      </td>
                      <td>{item.main.humidity}% ~ {item.main.pressure} hPa.</td>
                      <td>
                        Speed : {item.wind.speed} m/s<br/>
                        Direct. : {item.wind.deg} °<br/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
}
