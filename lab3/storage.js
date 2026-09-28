const HISTORY_KEY = "cities";
const CACHE_KEY = "weather-cache";
const MAX_HISTORY = 5;

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCity(city) {
    const cities = getHistory().filter((c) => c.toLowerCase() !== city.toLowerCase());
    cities.unshift(city);
    const latest = cities.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(latest));
    return latest;
}

function readCache() {
    try {
        return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function getCached(city) {
    return readCache()[city.trim().toLowerCase()] || null;
}

function setCached(city, data) {
    const cache = readCache();
    cache[city.trim().toLowerCase()] = data;
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
    }
}
