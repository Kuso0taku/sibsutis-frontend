const API_KEY = "5d274a8694e3fae7d0651972d90b5669";
const BASE = "https://api.openweathermap.org/data/2.5";

function fail(kind, code, message) {
    return { kind, code, message }; // kind: network | notFound | unknown
}

async function request(path, city) {
    const url = `${BASE}/${path}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;

    let res;
    try {
        res = await fetch(url);
    } catch (e) {
        throw fail("network", "network", "Нет соединения с сервером. Проверьте подключение к интернету.");
    }

    let data;
    try {
        data = await res.json();
    } catch (e) {
        throw fail("unknown", res.status, "Сервер вернул ответ, который не удалось прочитать.");
    }

    if (res.status === 404) throw fail("notFound", 404, `Город «${city}» не найден.`);
    if (!res.ok) throw fail("unknown", res.status, data.message || "Сервер не смог обработать запрос.");

    return data;
}

export async function getWeather(city) {
    const [current, forecast] = await Promise.all([
        request("weather", city),
        request("forecast", city)
    ]);

    return { current, forecast };
}
