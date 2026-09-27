const API_KEY = "5d274a8694e3fae7d0651972d90b5669";
const BASE = "https://api.openweathermap.org/data/2.5";

async function request(path, city) {
    const url = `${BASE}/${path}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
    const res = await fetch(url);
    return res.json();
}

export async function getWeather(city) {
    const [current, forecast] = await Promise.all([
        request("weather", city),
        request("forecast", city)
    ]);

    if (current.cod !== 200 || forecast.cod !== "200") throw new Error("city not found");

    return { current, forecast };
}
