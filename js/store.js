function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key, defaultValue) {
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : JSON.parse(raw);
}

function formatEuro(amount) {
    return parseFloat(amount).toFixed(2).replace('.', ',') + ' €';
}

function pad(n) { return String(n).padStart(2, '0'); }
