export function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer); // restart the timer on every call
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

export function signed(t) {
    const value = Math.round(t);
    return (value > 0 ? "+" : "") + value + "°C";
}

export function formatDate(dt) {
    const [, month, day] = dt.slice(0, 10).split("-");
    return `${day}-${month}`;
}
