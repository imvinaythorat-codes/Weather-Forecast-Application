// Main application logic
import { getCurrentByCity, getForecastByCity, getCurrentByCoords, getForecastByCoords } from './api.js';
import { renderCurrentWeather, renderForecast, setWeatherBackground, showError, clearError, setLoading, updateRecentDropdown } from './ui.js';
import { addRecentCity, getRecentCities } from './storage.js';

const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const recentSelect = document.getElementById('recentSelect');
const unitToggle = document.getElementById('unitToggle');
const geoBtn = document.getElementById('geoBtn');

let tempUnit = 'C'; // only affects today's temperature per requirements

function setUnit(u) {
  tempUnit = u;
  unitToggle.textContent = u === 'C' ? '°C' : '°F';
  unitToggle.setAttribute('aria-pressed', String(u === 'F'));
}

async function handleCitySearch(city) {
  const q = (city ?? cityInput.value ?? '').trim();
  if (!q) {
    showError('Please enter a city name.');
    return;
  }
  clearError();
  try {
    setLoading(true);
    const [current, forecast] = await Promise.all([
      getCurrentByCity(q),
      getForecastByCity(q)
    ]);
    renderCurrentWeather(current, tempUnit);
    renderForecast(forecast.list || []);
    setWeatherBackground(current.weather?.[0]?.main);
    const updated = addRecentCity(current.name || q);
    updateRecentDropdown(recentSelect, updated);
  } catch (e) {
    showError(e?.message || 'Failed to fetch weather.');
  }
}

async function handleGeoSearch() {
  if (!('geolocation' in navigator)) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  clearError();
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      setLoading(true);
      const [current, forecast] = await Promise.all([
        getCurrentByCoords(latitude, longitude),
        getForecastByCoords(latitude, longitude)
      ]);
      renderCurrentWeather(current, tempUnit);
      renderForecast(forecast.list || []);
      setWeatherBackground(current.weather?.[0]?.main);
    } catch (e) {
      showError(e?.message || 'Failed to fetch weather for current location.');
    }
  }, (err) => {
    showError(err?.message || 'Unable to access your location.');
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
}

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleCitySearch();
});

recentSelect.addEventListener('change', () => {
  const city = recentSelect.value;
  if (city) handleCitySearch(city);
});

unitToggle.addEventListener('click', () => {
  setUnit(tempUnit === 'C' ? 'F' : 'C');
  // Re-render current if available
  const name = document.querySelector('#current h2')?.textContent?.split(' — ')[0];
  if (name) handleCitySearch(name);
});

geoBtn.addEventListener('click', () => handleGeoSearch());

// Initialize
(function init() {
  setUnit('C');
  updateRecentDropdown(recentSelect, getRecentCities());
  // If a ?city=... query param is present, auto-run a search
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('city');
    if (q) {
      cityInput.value = q;
      handleCitySearch(q);
    }
  } catch {}
})();
