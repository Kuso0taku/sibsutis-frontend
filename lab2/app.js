const API_KEY = "5d274a8694e3fae7d0651972d90b5669";
const BASE = "https://api.openweathermap.org/data/2.5";
const FIVE_MIN = 5 * 60 * 1000;

const input = document.getElementById("cityInput");
const getBtn = document.getElementById("getBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");
const weatherInfo = document.getElementById("weatherInfo");
const weatherCard = document.getElementById("weatherCard");
const forecastCard = document.getElementById("forecastCard");
const forecastDiv = document.getElementById("forecast");
const historyDiv = document.getElementById("history");
const historyCard = document.getElementById("historyCard");

let lastCity = ""; // last requested city
let lastFetchTime = 0; // timestamp of the last weather fetch
let staleAlerted = false; // alert only once per fetch

getBtn.onclick = () => {
    const city = input.value.trim();
    if (!city) {
        alert("Введите город");
        return;
    }
    lastCity = city;
    getWeather(city);
};

updateBtn.onclick = () => {
    if (lastCity) getWeather(lastCity);
};

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getBtn.click();
});

function getWeather(city) {
    showLoader(true);
    staleAlerted = false;
    weatherInfo.innerHTML = "";

    Promise.all([
        fetch(`${BASE}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`),
        fetch(`${BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`)
    ])
        .then(([wRes, fRes]) => Promise.all([wRes.json(), fRes.json()]))
        .then(([wData, fData]) => {
            showLoader(false);
            if (wData.cod !== 200 || fData.cod !== "200") throw new Error("city not found");
            renderCurrent(wData);
            renderForecast(fData);
            lastFetchTime = Date.now();
            saveHistory(city);
            checkStale();
        })
        .catch((err) => {
            showLoader(false);
            weatherCard.classList.add("hidden");
            forecastCard.classList.add("hidden");
            alert(`Город не найден (${err.message})`);
        });
}

function showLoader(show) {
    weatherCard.classList.remove("hidden");
    loader.classList.toggle("hidden", !show);
    weatherInfo.classList.toggle("hidden", show);
    forecastCard.classList.toggle("hidden", show);
}

function renderCurrent(data) {
    const icon = data.weather[0].icon;
    weatherInfo.innerHTML = `
        <div class="weather-main">
            <div class="temp">${signed(data.main.temp)}</div>
            <div class="icon-line">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
                <div class="city-block">
                    <div class="city-name">${data.name}</div>
                    <div class="desc">${data.weather[0].description}</div>
                </div>
            </div>
        </div>
        <div class="weather-details">
            <div class="detail"><b>Ощущается</b><span>${signed(data.main.feels_like)}</span></div>
            <div class="detail"><b>Влажность</b><span>${data.main.humidity}%</span></div>
            <div class="detail"><b>Ветер</b><span>${data.wind.speed} м/с</span></div>
            <div class="detail"><b>Давление</b><span>${Math.round(data.main.pressure * 0.75)} мм</span></div>
            <div class="detail"><b>Облачность</b><span>${data.clouds.all}%</span></div>
            <div class="detail"><b>Мин/Макс</b><span>${signed(data.main.temp_min)}/${signed(data.main.temp_max)}</span></div>
        </div>
        <div class="last-updated">Обновлено: ${new Date(lastFetchTime || Date.now()).toLocaleTimeString()}</div>`;
}

function renderForecast(data) {
    const seenDays = new Set(); // one item per day
    const days = [];
    for (const item of data.list) {
        const date = item.dt_txt.slice(0, 10);
        if (!seenDays.has(date)) {
            seenDays.add(date);
            days.push(item);
        }
        if (days.length === 5) break;
    }

    forecastDiv.innerHTML = days.map((item) => `
        <div class="forecast-day">
            <div class="day">${formatDate(item.dt_txt)}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
            <div class="temp">${signed(item.main.temp)}</div>
            <div class="desc">${item.weather[0].description}</div>
        </div>`).join("");

    forecastCard.classList.remove("hidden");
}

function signed(t) {
    t = Math.round(t);
    return (t > 0 ? "+" : "") + t + "°C";
}

function formatDate(dt) {
    const [, m, d] = dt.slice(0, 10).split("-");
    return `${d}-${m}`;
}

function saveHistory(city) {
    let cities = getHistory();
    cities = cities.filter((c) => c.toLowerCase() !== city.toLowerCase()); // no duplicates
    cities.unshift(city);
    cities = cities.slice(0, 5); // keep last five
    localStorage.setItem("cities", JSON.stringify(cities));
    renderHistory();
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem("cities")) || [];
    } catch (e) {
        return []; // corrupted storage
    }
}

function renderHistory() {
    const cities = getHistory();
    if (!cities.length) {
        historyCard.classList.add("hidden");
        historyDiv.innerHTML = "";
        return;
    }
    historyCard.classList.remove("hidden");
    historyDiv.innerHTML = cities.map((c) => `<button>${c}</button>`).join("");
    historyDiv.querySelectorAll("button").forEach((btn) => {
        btn.onclick = () => {
            input.value = btn.textContent;
            lastCity = btn.textContent;
            getWeather(btn.textContent);
        };
    });
}

function checkStale() {
    if (lastFetchTime && Date.now() - lastFetchTime > FIVE_MIN && !staleAlerted) {
        staleAlerted = true;
        alert("Погода могла измениться с последнего запроса (прошло больше 5 минут). Нажми Обновить!");
    }
}

setInterval(checkStale, 30000); // poll for staleness

renderHistory();