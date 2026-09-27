import { getWeather } from "./api.js";
import { getHistory, saveCity } from "./storage.js";
import { hideWeather, renderCurrent, renderForecast, renderHistory, showLoader } from "./ui.js";

const FIVE_MIN = 5 * 60 * 1000;

const input = document.getElementById("cityInput");
const getBtn = document.getElementById("getBtn");
const updateBtn = document.getElementById("updateBtn");

let lastCity = ""; // last requested city
let lastFetchTime = 0; // timestamp of the last weather fetch
let staleAlerted = false; // alert only once per fetch

getBtn.onclick = () => loadCity(input.value);

updateBtn.onclick = () => {
    if (lastCity) loadCity(lastCity);
};

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getBtn.click();
});

function loadCity(rawCity) {
    const city = rawCity.trim();
    if (!city) {
        alert("Введите город");
        return;
    }

    lastCity = city;
    staleAlerted = false;
    showLoader(true);

    getWeather(city)
        .then((data) => {
            showLoader(false);
            const fetchedAt = Date.now();
            lastFetchTime = fetchedAt;
            renderCurrent(data.current, fetchedAt);
            renderForecast(data.forecast);
            renderHistory(saveCity(city), selectCity);
            checkStale();
        })
        .catch((err) => {
            showLoader(false);
            hideWeather();
            alert(`Город не найден (${err.message})`);
        });
}

function selectCity(city) {
    input.value = city;
    loadCity(city);
}

function checkStale() {
    if (lastFetchTime && Date.now() - lastFetchTime > FIVE_MIN && !staleAlerted) {
        staleAlerted = true;
        alert("Погода могла измениться с последнего запроса (прошло больше 5 минут). Нажми Обновить!");
    }
}

setInterval(checkStale, 30000); // poll for staleness

renderHistory(getHistory(), selectCity);
