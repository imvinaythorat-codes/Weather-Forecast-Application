// API layer for OpenWeatherMap
// Replace YOUR_OPENWEATHER_API_KEY in README and here before use.

const API_KEY = 'f89062a8ddb3cee873e3732af5e7aad9'; // TODO: insert your key for local testing (do not commit real keys)
const BASE = 'https://api.openweathermap.org/data/2.5';

export function buildIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

async function request(url) {
  const res = await fetch(url);
  if (!res.ok) {
    let msg = `API error (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      // Ignore JSON parse errors and use default message
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function getCurrentByCity(city) {
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return request(url);
}

export async function getForecastByCity(city) {
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return request(url);
}

export async function getCurrentByCoords(lat, lon) {
  const url = `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return request(url);
}

export async function getForecastByCoords(lat, lon) {
  const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return request(url);
}
