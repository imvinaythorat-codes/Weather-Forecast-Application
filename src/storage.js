// Local storage helpers for recent cities dropdown
const KEY = 'recentCities';
const MAX = 5;

export function getRecentCities() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addRecentCity(city) {
  const c = (city ?? '').trim();
  if (!c) return getRecentCities();
  const list = getRecentCities().filter(x => x.toLowerCase() !== c.toLowerCase());
  list.unshift(c);
  if (list.length > MAX) list.length = MAX;
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}
