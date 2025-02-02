"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import ReactDOM from "react-dom";
import dynamic from "next/dynamic";
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudFog,
} from "lucide-react";

const isBrowser = typeof window !== "undefined";

const DynamicLeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

type WeatherData = {
  temperature: number;
  minTemp: number | string;
  maxTemp: number | string;
  windspeed: number;
  weathercode: number;
  hourly: number[];
};

type WeatherProps = {
  latitude: number;
  longitude: number;
  userImage: string;
  userName: string;
};

export default function WeatherButton({
  latitude,
  longitude,
  userImage,
  userName,
}: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchWeather = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: latitude,
            longitude: longitude,
            current_weather: true,
            temperature_unit: "celsius",
            daily: ["temperature_2m_max", "temperature_2m_min"],
            hourly: ["temperature_2m"],
            windspeed_unit: "kmh",
            timezone: "auto",
          },
        }
      );

      if (
        response.data &&
        response.data.current_weather &&
        response.data.daily
      ) {
        setWeather({
          temperature: response.data.current_weather.temperature,
          minTemp: response.data.daily.temperature_2m_min?.[0] ?? "No data",
          maxTemp: response.data.daily.temperature_2m_max?.[0] ?? "No data",
          windspeed: response.data.current_weather.windspeed,
          weathercode: response.data.current_weather.weathercode,
          hourly: response.data.hourly.temperature_2m.slice(0, 12),
        });
      } else {
        console.error("Error", response.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen) {
      fetchWeather();
      interval = setInterval(fetchWeather, 30000);
    }
    return () => clearInterval(interval);
  }, [isOpen, fetchWeather]);

  const getWeatherIcon = (weathercode: number) => {
    if (weathercode === 0) return <Sun className="w-16 h-16 text-yellow-500" />;
    if (weathercode >= 1 && weathercode <= 3)
      return <Cloud className="w-16 h-16 text-blue-400" />;
    if (weathercode >= 45 && weathercode <= 48)
      return <CloudFog className="w-16 h-16 text-blue-500" />;
    if (weathercode >= 51 && weathercode <= 67)
      return <CloudRain className="w-16 h-16 text-blue-600" />;
    if (weathercode >= 71 && weathercode <= 86)
      return <Snowflake className="w-16 h-16 text-blue-200" />;
    if (weathercode >= 95 && weathercode <= 99)
      return <CloudLightning className="w-16 h-16 text-cyan-700" />;
    return <Cloud className="w-16 h-16 text-gray-400" />;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 px-6 py-3 flex items-center gap-2 rounded-lg bg-cyan-600 text-white 
  hover:bg-cyan-700 active:scale-90 transition-all duration-300 ease-in-out animate-fade-in mx-auto group"
      >
        <Cloud className="w-5 h-5 group-hover:rotate-12" />
        Weather
      </button>

      {isOpen && weather && typeof window !== "undefined" && document.body
        ? ReactDOM.createPortal(
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-10  rounded shadow-2xl w-4/5 h-4/5 max-w-4xl overflow-auto flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h2>CURRENT WEATHER</h2>
                    <div className="flex items-center gap-3 mb-4">
                      {getWeatherIcon(weather.weathercode)}
                      <h3 className="text-6xl md:text-5xl sm:text-3xl font-bold text-cyan-700 leading-none">
                        {weather.temperature} °C
                      </h3>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base">
                      {" "}
                      <strong className="text-cyan-700">
                        ⬇️ MIN Temperature:
                      </strong>{" "}
                      {weather.maxTemp}°C
                    </p>
                    <p className="text-sm sm:text-base">
                      {" "}
                      <strong className="text-cyan-700">
                        ⬆️ MAX Temperature:
                      </strong>{" "}
                      {weather.minTemp}°C
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong className="text-cyan-700">💨 Wind Speed: </strong>
                      {weather.windspeed} km/h
                    </p>
                  </div>
                </div>
                <h3 className="text-sm sm:text-base">
                  <strong className="text-cyan-700">📅 Hourly Weather: </strong>
                </h3>
                <div className="flex overflow-x-auto whitespace-nowrap gap-2 sm:gap-4 p-2 w-full">
                  {weather.hourly.map((temp: number, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-2 rounded text-center"
                    >
                      <p>{index + 1} h</p>
                      <p className="text-xl">{temp}°C</p>
                    </div>
                  ))}
                </div>
                {isBrowser && (
                  <DynamicLeafletMap
                    latitude={latitude}
                    longitude={longitude}
                    userImage={userImage}
                    userName={userName}
                  />
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-800 transition mx-auto"
                >
                  Close
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
