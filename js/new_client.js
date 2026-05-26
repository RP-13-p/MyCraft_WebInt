document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const nameInput    = document.getElementById('client-name');
    const typeInput    = document.getElementById('client-type');
    const emailInput   = document.getElementById('client-email');
    const phoneInput   = document.getElementById('client-phone');
    const addressInput = document.getElementById('client-address');
    const geoStatus    = document.getElementById('geo-status');
    const mapEl        = document.getElementById('client-map');

    const saveBtn   = document.getElementById('save-client-btn');
    const cancelBtn = document.getElementById('cancel-client-btn');

    // Coordinates updated each time a geocoding result is found
    let lat = null;
    let lng = null;
    let map = null;
    let marker = null;
    let debounceTimer = null;

    // --- Map (Leaflet + OpenStreetMap) ---

    function showMap(latVal, lngVal) {
        // Reveal the container on first use
        mapEl.style.display = 'block';

        if (!map) {
            map = L.map('client-map').setView([latVal, lngVal], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            marker = L.marker([latVal, lngVal]).addTo(map);
        } else {
            map.setView([latVal, lngVal], 14);
            marker.setLatLng([latVal, lngVal]);
        }

        // Fix tile sizing when the container was hidden at init time
        map.invalidateSize();
    }

    // --- Geocoding via Nominatim (OpenStreetMap, no API key) ---

    function geocodeAddress(address) {
        if (!address.trim()) {
            geoStatus.textContent = '';
            return;
        }

        geoStatus.textContent = 'Recherche…';

        const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
                    encodeURIComponent(address);

        fetch(url, { headers: { 'Accept-Language': 'fr' } })
            .then(r => r.json())
            .then(data => {
                if (!data.length) {
                    geoStatus.textContent = 'Adresse introuvable.';
                    lat = null;
                    lng = null;
                    return;
                }
                lat = parseFloat(data[0].lat);
                lng = parseFloat(data[0].lon);
                geoStatus.textContent = '';
                showMap(lat, lng);
            })
            .catch(() => {
                geoStatus.textContent = 'Impossible de contacter le service de cartographie.';
            });
    }

    // Wait 800 ms after the user stops typing before calling the API
    addressInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => geocodeAddress(addressInput.value), 800);
    });

    // --- Save a client ---

    function saveClient() {
        if (nameInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom du client.');
            return;
        }

        const newClient = {
            name:    nameInput.value.trim(),
            type:    typeInput.value,
            email:   emailInput.value.trim(),
            phone:   phoneInput.value.trim(),
            address: addressInput.value.trim(),
            lat:     lat,   // null if address was not geocoded
            lng:     lng
        };

        const clients = loadData('mycraft_clients', []);
        clients.push(newClient);
        saveData('mycraft_clients', clients);

        window.location.href = 'clients.html';
    }

    // --- Events ---

    saveBtn.addEventListener('click', saveClient);

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'clients.html';
    });
});
