"use client";

import { useState } from "react";
import axios from "axios";

type WeatherProps = {
  latitude: number;
  longitude: number;
};

export default function WeatherButton({ latitude, longitude }: WeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      setWeather(response.data.current_weather);
      setIsOpen(true);
    } catch (error) {
      console.error("Ошибка загрузки погоды", error);
    }
  };

  return (
    <>
      <button
        onClick={fetchWeather}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Weather
      </button>

      {isOpen && weather && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Погода</h2>
            <p>Температура: {weather.temperature}°C</p>
            <p>Ветер: {weather.windspeed} км/ч</p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
