document.addEventListener('DOMContentLoaded', () => {

    // --- Get all elements from the page ---
    const nameInput    = document.getElementById('client-name');
    const typeInput    = document.getElementById('client-type');
    const emailInput   = document.getElementById('client-email');
    const phoneInput   = document.getElementById('client-phone');
    const addressInput = document.getElementById('client-address');

    const saveBtn   = document.getElementById('save-client-btn');
    const cancelBtn = document.getElementById('cancel-client-btn');

    // --- Save a client ---

    function saveClient() {
        // Simple check: name is required
        if (nameInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom du client.');
            return;
        }

        const newClient = {
            name:    nameInput.value.trim(),
            type:    typeInput.value,
            email:   emailInput.value.trim(),
            phone:   phoneInput.value.trim(),
            address: addressInput.value.trim()
        };

        // Add the client to the existing list, then save
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
