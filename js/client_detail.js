document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const index = parseInt(params.get('index'));

    const clients = loadData('mycraft_clients', []);
    const client = clients[index];

    if (!client) {
        window.location.href = 'clients.html';
        return;
    }

    const nameInput = document.getElementById('client-name');
    const typeInput = document.getElementById('client-type');
    const siretInput = document.getElementById('client-siret');
    const siretGroup = document.getElementById('siret-group');
    const emailInput = document.getElementById('client-email');
    const phoneInput = document.getElementById('client-phone');
    const addressInput = document.getElementById('client-address');
    const geoStatus = document.getElementById('geo-status');
    const mapEl = document.getElementById('client-map');
    const pageTitle = document.getElementById('page-title');

    const modifyBtn = document.getElementById('modify-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    let lat = client.lat || null;
    let lng = client.lng || null;
    let map = null;
    let marker = null;
    let debounceTimer = null;

    pageTitle.textContent = client.name;

    nameInput.value = client.name;
    typeInput.value = client.type || 'Particulier';
    siretInput.value = client.siret || '';
    siretGroup.style.display = client.type === 'Professionnel' ? '' : 'none';
    emailInput.value = client.email || '';
    phoneInput.value = client.phone || '';
    addressInput.value = client.address || '';

    if (lat && lng) {
        showMap(lat, lng);
    }

    function showMap(latVal, lngVal) {
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

        map.invalidateSize();
    }

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
                try { showMap(lat, lng); } catch (e) {}
            })
            .catch(() => {
                geoStatus.textContent = 'Impossible de contacter le service de cartographie.';
            });
    }

    typeInput.addEventListener('change', () => {
        siretGroup.style.display = typeInput.value === 'Professionnel' ? '' : 'none';
    });

    addressInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => geocodeAddress(addressInput.value), 800);
    });

    modifyBtn.addEventListener('click', () => {
        nameInput.disabled = false;
        typeInput.disabled = false;
        siretInput.disabled = false;
        emailInput.disabled = false;
        phoneInput.disabled = false;
        addressInput.disabled = false;
        modifyBtn.style.display = 'none';
        saveBtn.style.display = '';
    });

    saveBtn.addEventListener('click', () => {
        if (nameInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom du client.');
            return;
        }

        const allClients = loadData('mycraft_clients', []);
        allClients[index] = {
            name: nameInput.value.trim(),
            type: typeInput.value,
            siret: typeInput.value === 'Professionnel' ? siretInput.value.trim() : '',
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            lat: lat,
            lng: lng
        };
        saveData('mycraft_clients', allClients);
        window.location.href = 'clients.html';
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'clients.html';
    });
});
