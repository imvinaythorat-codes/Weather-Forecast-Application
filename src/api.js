const FN = '/.netlify/functions/weather';

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
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getCurrentByCity(city) {
  return request(`${FN}?type=current&city=${encodeURIComponent(city)}`);
}

export async function getForecastByCity(city) {
  return request(`${FN}?type=forecast&city=${encodeURIComponent(city)}`);
}

export async function getCurrentByCoords(lat, lon) {
  return request(`${FN}?type=current&lat=${lat}&lon=${lon}`);
}

export async function getForecastByCoords(lat, lon) {
  return request(`${FN}?type=forecast&lat=${lat}&lon=${lon}`);
}
