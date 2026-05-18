// Small shared helper to read and write data in the browser localStorage.
// Load this file BEFORE the other scripts on each page.

// Save any value (object, array, string...) with a given key.
// localStorage can only store text, so we convert the value to JSON first.
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
