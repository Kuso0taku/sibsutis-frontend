const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const weatherInfo = document.getElementById("weatherInfo");
const forecastCard = document.getElementById("forecastCard");
const forecastDiv = document.getElementById("forecast");
const historyCard = document.getElementById("historyCard");
const historyDiv = document.getElementById("history");
const messageCard = document.getElementById("messageCard");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const messageCode = document.getElementById("messageCode");
const messageBtn = document.getElementById("messageBtn");

function showLoader(show) {
    weatherCard.classList.remove("hidden");
    loader.classList.toggle("hidden", !show);
    weatherInfo.classList.toggle("hidden", show);
    forecastCard.classList.toggle("hidden", show);
}

function hideWeather() {
    weatherCard.classList.add("hidden");
    forecastCard.classList.add("hidden");
}

function showMessage({ kind, title, text, code = "", onRetry = null }) {
    messageCard.dataset.kind = kind; // error messages are red, hints are purple
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageCode.parentElement.classList.toggle("hidden", !code);
    messageCode.textContent = code;
    messageBtn.classList.toggle("hidden", !onRetry);
    messageBtn.onclick = onRetry || null;
    messageCard.classList.remove("hidden");
}

function hideMessage() {
    messageCard.classList.add("hidden");
}

function renderCurrent(data, fetchedAt) {
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
        <div class="last-updated">Обновлено: ${new Date(fetchedAt).toLocaleTimeString()}</div>`;
}

function renderForecast(data) {
    const days = pickFiveDays(data.list);

    forecastDiv.innerHTML = days.map((item) => `
        <div class="forecast-day">
            <div class="day">${formatDate(item.dt_txt)}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
            <div class="temp">${signed(item.main.temp)}</div>
            <div class="desc">${item.weather[0].description}</div>
        </div>`).join("");

    forecastCard.classList.remove("hidden");
}

function pickFiveDays(list) {
    const seenDays = new Set(); // one item per day
    const days = [];
    for (const item of list) {
        const date = item.dt_txt.slice(0, 10);
        if (!seenDays.has(date)) {
            seenDays.add(date);
            days.push(item);
        }
        if (days.length === 5) break;
    }
    return days;
}

function renderHistory(cities, onSelect) {
    if (!cities.length) {
        historyCard.classList.add("hidden");
        historyDiv.innerHTML = "";
        return;
    }

    historyCard.classList.remove("hidden");
    historyDiv.innerHTML = cities.map((c) => `<button data-city="${c}">${c}</button>`).join("");
    historyDiv.querySelectorAll("button").forEach((btn) => {
        btn.onclick = () => onSelect(btn.dataset.city);
    });
}
