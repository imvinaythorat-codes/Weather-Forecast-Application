  // UI rendering utilities
  import { buildIconUrl } from './api.js';

  const currentEl = document.getElementById('current');
  const forecastGrid = document.getElementById('forecastGrid');
  const errorBox = document.getElementById('errorBox');

  export function setLoading(isLoading) {
    if (isLoading) {
      currentEl.innerHTML = skeletonCurrent();
      forecastGrid.innerHTML = skeletonForecast();
    }
  }

  export function clearError() {
    errorBox.className = 'mt-4 hidden';
    errorBox.innerHTML = '';
  }

  export function showError(message) {
    errorBox.className = 'mt-4 error-box';
    errorBox.innerHTML = `<p>${escapeHtml(message)}</p>`;
  }

export function setWeatherBackground(conditionMain, sys) {
  const body = document.body;
  const cond = (conditionMain || '').toLowerCase();
  body.classList.remove('rainy','theme-sunny','theme-cloudy','theme-night');
  const now = Date.now() / 1000;
  const isNight = sys?.sunset && sys?.sunrise ? (now < sys.sunrise || now > sys.sunset) : false;
  if (cond.includes('rain')) {
    body.classList.add('rainy');
  } else if (isNight) {
    body.classList.add('theme-night');
  } else if (cond.includes('cloud')) {
    body.classList.add('theme-cloudy');
  } else if (cond.includes('clear') || cond.includes('sun')) {
    body.classList.add('theme-sunny');
  }
}

  export function renderCurrentWeather(data, unit = 'C') {
    const tempC = data.main?.temp;
    const tempDisplay = unit === 'F' ? `${toF(tempC).toFixed(1)}°F` : `${Math.round(tempC)}°C`;
    
    // Check for extreme temperature alert
    const alertHtml = tempC > 40 ? `
      <div class="mt-3 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded dark:bg-red-950 dark:text-red-200 dark:border-red-800">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚠️</span>
          <p class="font-semibold">Extreme Heat Alert!</p>
        </div>
        <p class="text-sm mt-1">Temperature is dangerously high at ${Math.round(tempC)}°C. Stay hydrated and avoid outdoor activities.</p>
      </div>
    ` : '';
    
  const items = [
    { label: 'Temperature', value: tempDisplay, icon: '🌡️', tip: `Feels like ${Math.round(data.main?.feels_like ?? tempC)}°C` },
    { label: 'Humidity', value: `${data.main?.humidity ?? '-'}%`, icon: '💧', tip: 'Relative humidity' },
    { label: 'Wind', value: `${Math.round(data.wind?.speed ?? 0)} m/s`, icon: '💨', tip: `Gust ${Math.round(data.wind?.gust ?? 0)} m/s` }
  ];

    const card = `
      <article class="weather-card md:col-span-2 animate-fade-in">
        <div class="flex items-center gap-4">
          <img alt="weather icon" class="w-16 h-16" src="${buildIconUrl(data.weather?.[0]?.icon)}" />
          <div>
            <h2 class="text-2xl font-semibold">${escapeHtml(data.name)} — ${escapeHtml(data.weather?.[0]?.main ?? '')}</h2>
            <p class="text-slate-600 dark:text-slate-300">${escapeHtml(data.weather?.[0]?.description ?? '')}</p>
          </div>
        </div>
      <div class="grid grid-cols-3 gap-4 mt-4">
        ${items.map(i => metricCell(i.icon, i.label, i.value, i.tip)).join('')}
      </div>
      ${sunBlock(data.sys)}
      ${alertHtml}
    </article>
  `;

    currentEl.innerHTML = card;
    animateIn(currentEl, '.weather-card');
  }

export function renderForecast(list) {
    // Choose midday entries for the next 5 days
    const byDay = {};
    for (const item of list) {
      const [date, time] = item.dt_txt.split(' ');
      if (!byDay[date] || time.startsWith('12:00')) byDay[date] = item;
    }
    const days = Object.entries(byDay).slice(0, 5);

    forecastGrid.innerHTML = days
      .map(([date, item]) => forecastCard(date, item))
      .join('');

    animateIn(forecastGrid, '.weather-card', 60);
  }

  export function updateRecentDropdown(selectEl, cities) {
    if (!cities || cities.length === 0) {
      selectEl.classList.add('hidden');
      selectEl.innerHTML = '';
      return;
    }
    selectEl.classList.remove('hidden');
    selectEl.innerHTML = cities
      .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
      .join('');
  }

  function forecastCard(date, item) {
    const d = new Date(date);
    const nice = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const temp = Math.round(item.main?.temp ?? 0);
    const wind = Math.round(item.wind?.speed ?? 0);
    const hum = item.main?.humidity ?? '-';
    return `
      <article class="weather-card">
        <div class="flex items-center gap-3">
          <img alt="icon" class="w-12 h-12" src="${buildIconUrl(item.weather?.[0]?.icon)}" />
          <div>
            <h3 class="font-semibold">${nice}</h3>
            <p class="text-slate-600 dark:text-slate-300">${escapeHtml(item.weather?.[0]?.main ?? '')}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-3 text-sm">
          ${metricCell('🌡️', 'Temp', `${temp}°C`)}
          ${metricCell('💨', 'Wind', `${wind} m/s`)}
          ${metricCell('💧', 'Humidity', `${hum}%`)}
        </div>
      </article>
    `;
  }

function metricCell(icon, label, value, tip) {
  return `
    <div class="rounded-lg shadow-sm bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/40 p-2 border border-slate-200 dark:border-slate-700 transition-colors hover:shadow-md overflow-hidden min-w-0" title="${tip ? escapeHtml(tip) : ''}">
      <div class="text-base leading-none">${icon}</div>
      <div class="text-xs text-slate-500 dark:text-slate-400 truncate">${label}</div>
      <div class="text-sm font-semibold truncate leading-tight text-slate-900 dark:text-slate-100">${value}</div>
    </div>
  `;
}

  function skeletonCurrent() {
    return `<div class="weather-card animate-pulse h-40"></div>`;
  }

function skeletonForecast() {
  return `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">${Array.from({length:5}).map(()=>'<div class="weather-card h-36 animate-pulse"></div>').join('')}</div>`;
}

export function renderSparkline(list) {
  // Build a simple temp trend sparkline for next 5 days (midday points)
  const mount = document.getElementById('sparkline');
  if (!mount) return;
  const byDay = {};
  for (const item of list || []) {
    const [date, time] = item.dt_txt.split(' ');
    if (!byDay[date] || time.startsWith('12:00')) byDay[date] = item;
  }
  const days = Object.values(byDay).slice(0,5);
  if (days.length < 2) { mount.innerHTML = ''; return; }
  const temps = days.map(d => Math.round(d.main?.temp ?? 0));
  const w = 220, h = 40, pad = 4;
  const min = Math.min(...temps), max = Math.max(...temps);
  const range = Math.max(1, max - min);
  const step = (w - pad*2) / (temps.length - 1);
  const points = temps.map((t,i) => [pad + i*step, h - pad - ((t - min) / range) * (h - pad*2)]);
  const d = points.map((p,i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
  mount.innerHTML = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="opacity-80">
      <path d="${d}" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
}

function sunBlock(sys) {
  if (!sys?.sunset || !sys?.sunrise) return '';
  const toTime = (s) => new Date(s * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `
    <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
      ${metricCell('🌅', 'Sunrise', toTime(sys.sunrise))}
      ${metricCell('🌇', 'Sunset', toTime(sys.sunset))}
    </div>
  `;
}

function animateIn(container, selector = '.weather-card', stagger = 0) {
    const nodes = Array.from(container.querySelectorAll(selector));
    nodes.forEach((el, i) => {
      el.classList.add('opacity-0', 'translate-y-2');
      // Force reflow to ensure transition applies
      void el.offsetWidth;
      const start = () => {
        el.classList.add('transition', 'duration-500');
        el.classList.remove('opacity-0', 'translate-y-2');
        el.classList.add('opacity-100', 'translate-y-0');
      };
      if (stagger) {
        setTimeout(() => requestAnimationFrame(start), i * stagger);
      } else {
        requestAnimationFrame(start);
      }
    });
  }

  function toF(c) { return (c * 9) / 5 + 32; }
  function escapeHtml(s) { return (s ?? '').toString().replace(/[&<>\"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c])); }
