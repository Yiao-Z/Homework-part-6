export async function GET(request) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Weather is not configured. Add OPENWEATHER_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  const city = new URL(request.url).searchParams.get("city")?.trim();

  if (!city || city.length > 100) {
    return Response.json(
      { error: "Enter a city name up to 100 characters long." },
      { status: 400 }
    );
  }

  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  weatherUrl.searchParams.set("q", city);
  weatherUrl.searchParams.set("appid", apiKey);
  weatherUrl.searchParams.set("units", "metric");

  let response;
  try {
    response = await fetch(weatherUrl, { cache: "no-store" });
  } catch (error) {
    console.error("Could not reach OpenWeather:", error);
    return Response.json(
      { error: "Could not reach the weather service. Please try again." },
      { status: 502 }
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("OpenWeather returned an unreadable response:", error);
    return Response.json(
      { error: "The weather service returned an invalid response." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      return Response.json(
        { error: "City not found. Check the spelling and try again." },
        { status: 404 }
      );
    }

    if (response.status === 401 || response.status === 403) {
      console.error("OpenWeather rejected the API key:", data.message);
      return Response.json(
        { error: "OpenWeather rejected the API key. Check your key and try again." },
        { status: 503 }
      );
    }

    console.error("OpenWeather request failed:", response.status, data.message);
    return Response.json(
      { error: "The weather service could not complete the request. Please try again." },
      { status: 502 }
    );
  }

  const weather = data.weather?.[0];
  const temperature = data.main?.temp;

  if (
    typeof data.name !== "string" ||
    typeof temperature !== "number" ||
    typeof weather?.description !== "string"
  ) {
    console.error("OpenWeather response is missing required weather data.");
    return Response.json(
      { error: "The weather service returned incomplete weather data." },
      { status: 502 }
    );
  }

  return Response.json({
    city: data.name,
    country: data.sys?.country || "",
    temperature: Math.round(temperature),
    feelsLike:
      typeof data.main?.feels_like === "number"
        ? Math.round(data.main.feels_like)
        : null,
    description: weather.description,
    humidity:
      typeof data.main?.humidity === "number" ? data.main.humidity : null,
    windSpeed:
      typeof data.wind?.speed === "number" ? data.wind.speed : null,
  });
}
