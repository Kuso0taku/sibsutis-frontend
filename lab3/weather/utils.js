export function signed(t) {
    const value = Math.round(t);
    return (value > 0 ? "+" : "") + value + "°C";
}

export function formatDate(dt) {
    const [, month, day] = dt.slice(0, 10).split("-");
    return `${day}-${month}`;
}
