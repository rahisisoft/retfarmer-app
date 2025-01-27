import UserLayout from "@/components/UserLayout";
import axios from "axios";
import { useState } from "react";
import Tableau from "../components/Tableau";

export default function Analysis() {
  const [location, setLocation] = useState(""); // Location input
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [property, setProperty] = useState("phh2o"); // Default property
  const [soilData, setSoilData] = useState(null);
  const [layers, setLayers] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch coordinates from Nominatim API
  const fetchCoordinates = async () => {
    try {
      setLoading(true);
      setSoilData(null);
      setError(null);
      setLayers(null);

      if (!location) {
        setError("Please enter a valid location.");
        return null;
      }

      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: location,
          format: "json",
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLatitude(lat);
        setLongitude(lon);
        setError(null);
        return { lat, lon };
      } else {
        throw new Error("Location not found.");
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      setError("Error fetching coordinates. Please check the location.");
      return null;
    }
  };

  // Fetch soil data
  const fetchSoilData = async ({ lat, lon }) => {
    try {
      
      if (!lon || !lat || lon < -180 || lon > 180 || lat < -90 || lat > 90) {
        setError("Please enter valid latitude and longitude values.");
        return;
      }

      const response = await axios.get(`https://rest.isric.org/soilgrids/v2.0/properties/query`, {
        params: {
          lon,
          lat,
          property,
        },
      });

      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error("No data received from the API.");
      }

      setSoilData(response.data);
      setLayers(response.data.properties.layers || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching soil data:", err);
      setError(err.response?.data?.message || "Error fetching soil data.");
      setSoilData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    const coordinates = await fetchCoordinates();
    if (coordinates) {
      await fetchSoilData(coordinates); // Pass coordinates directly
    }
  };

  return (
    <UserLayout>
      <h1>Soil Analysis</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Location Input */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
            placeholder="Enter location (e.g., Paris)"
            required
          />
        </div>
        {/* Property Input */}
        <div className="mb-3">
          <label htmlFor="property" className="form-label">
            Property
          </label>
          <select
            id="property"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="form-select"
          >
            <option value="phh2o">pH in water</option>
            <option value="ocd">Organic Carbon Density</option>
            <option value="cec">Cation Exchange Capacity</option>
            {/* Add more properties as needed */}
          </select>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ marginTop: "10px" }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {/* Error Display */}
      {error && <p className="text-danger">{error}</p>}
      {/* Soil Data Display */}
      <hr/>
      <h1>Soil Data : {location} - {property}</h1>
      <table className="table table-bordered table-striped table-sm">
        <thead>
          <tr>
            <th>Label</th><th>Top Depth (cm)</th><th>Bottom Depth (cm)</th><th>Q0.05</th>
            <th>Q0.5</th><th>Q0.95</th><th>Mean</th><th>Uncertainty</th>
          </tr>
        </thead>
        <tbody>
          {layers?.[0].depths.map((depth, index) => (
            <tr key={index}>
              <td>
                {depth.label}
              </td>
              <td>
                {depth.range.top_depth}
              </td>
              <td>
                {depth.range.bottom_depth}
              </td>
              <td>
                {depth.values["Q0.05"] || "N/A"}
              </td>
              <td>
                {depth.values["Q0.5"] || "N/A"}
              </td>
              <td>
                {depth.values["Q0.95"] || "N/A"}
              </td>
              <td>
                {depth.values.mean || "N/A"}
              </td>
              <td>
                {depth.values.uncertainty || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </UserLayout>
  );
}
