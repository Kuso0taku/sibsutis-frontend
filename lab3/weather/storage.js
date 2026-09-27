const HISTORY_KEY = "cities";
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
