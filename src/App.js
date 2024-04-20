import React from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useWeather } from "./hooks/useWeather";
import Input from "./components/Input";
import Weather from "./components/Weather";

export default function App() {
  const [location, setLocation] = useLocalStorageState("", "location");

  const { weather, displayLocation, isLoading } = useWeather(location);

  function handleChangeLocation(e) {
    setLocation(e.target.value);
  }

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <Input location={location} onChangeLocation={handleChangeLocation} />
      {isLoading ? (
        <p className="loader">Loading...</p>
      ) : (
        <>{weather.weathercode && <Weather weather={weather} location={displayLocation} />}</>
      )}
    </div>
  );
}
