// Utility functions to save and load data from localStorage
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Read a value. If the key does not exist yet, return the default value.
function loadData(key, defaultValue) {
    const raw = localStorage.getItem(key);
    if (raw === null) {
        return defaultValue;
    }
    return JSON.parse(raw);
}
