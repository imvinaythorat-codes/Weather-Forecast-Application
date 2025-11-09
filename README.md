# Weather Forecast (JavaScript, HTML, Tailwind CSS)

A simple, responsive weather forecast application that fetches current and 5-day forecast data and displays it with a clean UI.

## Features
- Search by city name
- Use current location (geolocation)
- Recently searched cities dropdown (localStorage)
- Today’s temperature unit toggle (°C/°F)
- Rainy-condition dynamic background
- Error handling with friendly messages
- Responsive layout (desktop, iPad Mini, iPhone SE)

## Tech
- HTML + Tailwind CSS (CDN)
- Vanilla JavaScript (modules)
- OpenWeatherMap API

## Setup
1. Open `index.html` directly in your browser (no build step required).
2. Replace the API key placeholder in `src/api.js`:
   - Find: `const API_KEY = 'YOUR_OPENWEATHER_API_KEY';`
   - Replace with your OpenWeatherMap API key. Do not commit secrets to public repos.

## Development notes
- Project structure
  - `index.html` – layout and UI containers
  - `styles.css` – a few custom styles in addition to Tailwind utilities
  - `src/api.js` – API requests to OpenWeatherMap
  - `src/ui.js` – rendering and UI helpers
  - `src/storage.js` – localStorage helpers for recent cities
  - `src/app.js` – app wiring, events, state
- .gitignore excludes `node_modules` and typical artifacts (even though we don’t install packages here).
- Commit often with meaningful messages (HTML, CSS, JS, README separately as needed). Avoid committing secrets.

## Roadmap / Ideas
- Add icons set or SVGs for metrics
- Support theme toggle
- Add service worker for offline caching (optional)

## License
MIT (add your preferred license)
