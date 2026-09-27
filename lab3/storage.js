const HISTORY_KEY = "cities";
const CACHE_KEY = "weather-cache";
const MAX_HISTORY = 5;

export function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        return []; // corrupted storage
    }
}

export function saveCity(city) {
    const cities = getHistory().filter((c) => c.toLowerCase() !== city.toLowerCase()); // no duplicates
    cities.unshift(city);
    const latest = cities.slice(0, MAX_HISTORY); // keep last five
    localStorage.setItem(HISTORY_KEY, JSON.stringify(latest));
    return latest;
}

function readCache() {
    try {
        return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
    } catch (e) {
        return {}; // corrupted cache
    }
}

export function getCached(city) {
    return readCache()[city.trim().toLowerCase()] || null; // city names ignore case
}

export function setCached(city, data) {
    const cache = readCache();
    cache[city.trim().toLowerCase()] = data;
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); // cache dies with the tab
    } catch (e) {
        // cache is full or disabled, weather still works without it
    }
}
