import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  temperature: number;
  description: string;
  windSpeed: number;
  humidity: number;
}

export function WeatherDashboard() {
  const [city, setCity] = useState<string>("London");
  const [inputCity, setInputCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
        );
        const data = response.data;
        setWeather({
          temperature: data.current.temp_c,
          description: data.current.condition.text,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
        });

        setError(null);
      } catch {
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity("");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city name"
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weather && !loading && !error && (
        <div>
          <h1 className="text-xl font-bold">{city}</h1>
          <p className="text-lg">{weather.temperature}°C</p>
          <p>{weather.description}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} kph</p>
        </div>
      )}
    </div>
  );
}
