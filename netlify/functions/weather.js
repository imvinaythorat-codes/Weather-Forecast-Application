export async function handler(event) {
  const params = event.queryStringParameters || {};
  const type = params.type === 'forecast' ? 'forecast' : 'current';
  const key = process.env.OWM_API_KEY;
  if (!key) return json(500, { message: 'Missing OWM_API_KEY' });

  const base = 'https://api.openweathermap.org/data/2.5';
  const endpoint = type === 'forecast' ? `${base}/forecast` : `${base}/weather`;

  const { city, lat, lon } = params;
  let q = '';
  if (city) q = `q=${encodeURIComponent(city)}`;
  else if (lat && lon) q = `lat=${lat}&lon=${lon}`;
  else return json(400, { message: 'city or lat/lon required' });

  const url = `${endpoint}?${q}&units=metric&appid=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return json(res.status, data);
  } catch (e) {
    return json(500, { message: e?.message || 'Upstream fetch failed' });
  }
}

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  };
}
