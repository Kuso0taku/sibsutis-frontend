import { getWeather } from "./api.js";
import { getCached, getHistory, saveCity, setCached } from "./storage.js";
import {
    hideMessage,
    hideWeather,
    renderCurrent,
    renderForecast,
    renderHistory,
    showLoader,
    showMessage
} from "./ui.js";
import { debounce } from "./utils.js";

const FIVE_MIN = 5 * 60 * 1000;
const TYPING_DELAY = 500; // live search waits for a pause in typing
const MIN_CHARS = 3;

const ERROR_TITLES = {
    network: "Нет подключения к интернету",
    notFound: "Город не найден",
    unknown: "Что-то пошло не так"
};

const input = document.getElementById("cityInput");
const getBtn = document.getElementById("getBtn");
const updateBtn = document.getElementById("updateBtn");

let lastCity = ""; // last requested city
let lastFetchTime = 0; // timestamp of the last weather fetch
let staleShown = false; // show the stale hint only once per fetch

getBtn.onclick = () => loadCity(input.value, true);

updateBtn.onclick = () => {
    if (lastCity) loadCity(lastCity, false); // update always asks the API again
};

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getBtn.click();
});

input.addEventListener("input", debounce(searchWhileTyping, TYPING_DELAY));

function searchWhileTyping() {
    const city = input.value.trim();
    if (city.length >= MIN_CHARS) loadCity(city, true);
}

function loadCity(rawCity, useCache) {
    const city = rawCity.trim();
    if (!city) {
        showMessage({ kind: "info", title: "Введите город", text: "Например: Новосибирск" });
        return;
    }

    lastCity = city;

    if (useCache) {
        const cached = getCached(city);
        if (cached) {
            showWeather(cached);
            return;
        }
    }

    staleShown = false;
    hideMessage();
    showLoader(true);

    getWeather(city)
        .then((data) => {
            showLoader(false);
            const weather = { ...data, fetchedAt: Date.now() };
            setCached(city, weather);
            showWeather(weather);
        })
        .catch(showError);
}

function showWeather(weather) {
    lastFetchTime = weather.fetchedAt;
    hideMessage();
    renderCurrent(weather.current, weather.fetchedAt);
    renderForecast(weather.forecast);
    renderHistory(saveCity(lastCity), selectCity);
    checkStale();
}

function showError(err) {
    showLoader(false);
    hideWeather();
    showMessage({
        kind: "error",
        title: ERROR_TITLES[err.kind] || ERROR_TITLES.unknown,
        text: err.message,
        code: err.code,
        onRetry: () => loadCity(lastCity, false)
    });
}

function selectCity(city) {
    input.value = city;
    loadCity(city, true);
}

function checkStale() {
    if (lastFetchTime && Date.now() - lastFetchTime > FIVE_MIN && !staleShown) {
        staleShown = true;
        showMessage({
            kind: "info",
            title: "Данные устарели",
            text: "Погода могла измениться с последнего запроса (прошло больше 5 минут).",
            onRetry: () => loadCity(lastCity, false)
        });
    }
}

setInterval(checkStale, 30000); // poll for staleness

renderHistory(getHistory(), selectCity);
