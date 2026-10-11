"use client";

import { useState } from "react";

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setWeather(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load the weather.");
      }

      setWeather(data);
    } catch (requestError) {
      setError(requestError.message || "Could not load the weather.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="weather-heading"
      className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4">
        <h2 id="weather-heading" className="text-lg font-bold text-slate-950">
          City weather
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Search for current weather in any city.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="w-full max-w-md">
          <label
            htmlFor="weather-city"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            City
          </label>
          <input
            id="weather-city"
            name="city"
            type="search"
            required
            maxLength={100}
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Toronto"
            className="form-field"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {isLoading ? "Loading..." : "Get weather"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {weather && (
        <div
          aria-live="polite"
          className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-slate-900">
              {weather.city}
              {weather.country ? `, ${weather.country}` : ""}
            </p>
            <p className="mt-1 capitalize text-sm text-slate-500">
              {weather.description}
            </p>
          </div>
          <p className="text-4xl font-bold tracking-tight text-slate-950">
            {weather.temperature}
            <span className="text-2xl">°C</span>
          </p>
          <dl className="grid grid-cols-2 gap-x-5 gap-y-1 text-sm text-slate-600">
            {weather.feelsLike !== null && (
              <div>
                <dt className="inline">Feels like </dt>
                <dd className="inline font-semibold">{weather.feelsLike}°C</dd>
              </div>
            )}
            {weather.humidity !== null && (
              <div>
                <dt className="inline">Humidity </dt>
                <dd className="inline font-semibold">{weather.humidity}%</dd>
              </div>
            )}
            {weather.windSpeed !== null && (
              <div>
                <dt className="inline">Wind </dt>
                <dd className="inline font-semibold">
                  {weather.windSpeed} m/s
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Weather data by{" "}
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-slate-600"
        >
          OpenWeather
        </a>
      </p>
    </section>
  );
}
