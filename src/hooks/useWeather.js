import { useState, useEffect } from "react";
import { convertToFlag } from "../helpers";

export function useWeather(query, callback) {
  const [weather, setWeather] = useState({});
  const [displayLocation, setDisplayLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    callback?.();
    async function fetchWeather() {
      if (query.length < 2) return;
      try {
        setIsLoading(true);
        // 1) Getting location (geocoding)
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } = geoData.results.at(0);
        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
  }, [query, callback]);

  return { weather, displayLocation, isLoading };
}
