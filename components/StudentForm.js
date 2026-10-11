"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createStudentAction } from "../lib/actions";

const initialState = { error: "" };

export default function StudentForm({ schemaKind }) {
  const [state, formAction, isPending] = useActionState(
    createStudentAction,
    initialState
  );
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const normalizedCity = city.trim();

    if (!normalizedCity) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setWeatherLoading(true);
      try {
        const response = await fetch(
          `/api/weather?city=${encodeURIComponent(normalizedCity)}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load the weather.");
        }

        setWeather(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setWeatherError(error.message || "Could not load the weather.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setWeatherLoading(false);
        }
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [city]);

  function handleCityChange(event) {
    const nextCity = event.target.value;
    setCity(nextCity);
    setWeather(null);
    setWeatherError("");
    setWeatherLoading(Boolean(nextCity.trim()));
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <h2 className="mb-6 text-xl font-bold text-slate-950">
        Student information
      </h2>

      {state.error && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {schemaKind === "legacy" && (
          <div>
            <label
              htmlFor="student_number"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Student number
            </label>
            <input
              id="student_number"
              name="student_number"
              type="text"
              autoComplete="off"
              maxLength={32}
              required
              className="form-field"
              placeholder="e.g. 2026001"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="first_name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            maxLength={100}
            required
            className="form-field"
            placeholder="First name"
          />
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            maxLength={100}
            required
            className="form-field"
            placeholder="Last name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={255}
            required
            className="form-field"
            placeholder="student@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Phone <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            className="form-field"
            placeholder="e.g. 403-555-0101"
          />
        </div>

        <>
            <div className="sm:col-span-2">
              <h3 className="border-t border-slate-100 pt-5 text-base font-bold text-slate-900">
                Mailing address
              </h3>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="street_address"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Street address
              </label>
              <input
                id="street_address"
                name="street_address"
                type="text"
                autoComplete="street-address"
                maxLength={255}
                required
                className="form-field"
                placeholder="Street address"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                maxLength={100}
                required
                value={city}
                onChange={handleCityChange}
                className="form-field"
                placeholder="City"
              />
            </div>

            <div>
              <label
                htmlFor="province_state"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Province / state
              </label>
              <input
                id="province_state"
                name="province_state"
                type="text"
                autoComplete="address-level1"
                maxLength={100}
                required
                className="form-field"
                placeholder="Province or state"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                autoComplete="country-name"
                maxLength={100}
                required
                className="form-field"
                placeholder="Country"
              />
            </div>

            <div>
              <label
                htmlFor="postal_code"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Postal code
              </label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                autoComplete="postal-code"
                maxLength={12}
                pattern="[A-Za-z0-9][A-Za-z0-9 -]{0,10}[A-Za-z0-9]"
                title="Enter a valid postal code."
                required
                className="form-field"
                placeholder="Postal code"
              />
            </div>
            <div className="sm:col-span-2" aria-live="polite">
              {weatherLoading && (
                <p className="text-sm text-slate-500">
                  Loading current weather for {city.trim()}...
                </p>
              )}
              {weatherError && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {weatherError}
                </p>
              )}
              {weather && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Current weather in {weather.city}
                    {weather.country ? `, ${weather.country}` : ""}
                  </p>
                  <p className="mt-1 text-sm capitalize text-slate-700">
                    {weather.description}, {weather.temperature}°C
                  </p>
                </div>
              )}
            </div>
          </>

        <div className="sm:col-span-2">
          <h3 className="border-t border-slate-100 pt-5 text-base font-bold text-slate-900">
            Program information
          </h3>
        </div>

        <div>
          <label
            htmlFor="program"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Program
          </label>
          <input
            id="program"
            name="program"
            type="text"
            maxLength={120}
            required
            className="form-field"
            placeholder="e.g. Software Development"
          />
        </div>

        <div>
          <label
            htmlFor="year"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Year
          </label>
          <select
            id="year"
            name="year"
            defaultValue=""
            required
            className="form-field"
          >
            <option value="" disabled>
              Select a year
            </option>
            {["Y1", "Y2", "Y3", "Y4"].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/students"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Adding student..." : "Add student"}
        </button>
      </div>
    </form>
  );
}
