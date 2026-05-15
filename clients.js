// clients.js
// Handles the Clients page:
//  - save a client to localStorage
//  - show the list of clients in the table
//  - delete a client
// Same structure as quotes.js, but simpler (no lines, no totals).

document.addEventListener('DOMContentLoaded', () => {

    // --- Get all elements from the page ---
    const nameInput    = document.getElementById('client-name');
    const typeInput    = document.getElementById('client-type');
    const emailInput   = document.getElementById('client-email');
    const phoneInput   = document.getElementById('client-phone');
    const addressInput = document.getElementById('client-address');

    const saveBtn   = document.getElementById('save-client-btn');
    const cancelBtn = document.getElementById('cancel-client-btn');
    const newBtn    = document.getElementById('new-client-btn');

    const tbody    = document.getElementById('clients-tbody');
    const emptyMsg = document.getElementById('clients-empty');

    // --- Show the list of clients ---

    function showClients() {
        const clients = loadData('mycraft_clients', []);

        tbody.innerHTML = '';   // clear the table before rebuilding it

        if (clients.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        clients.forEach((c, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + c.name + '</td>' +
                '<td>' + c.type + '</td>' +
                '<td>' + c.email + '</td>' +
                '<td>' + c.phone + '</td>' +
                '<td>' + c.address + '</td>' +
                '<td><button type="button" class="delete-client-btn" data-index="' + index + '">Supprimer</button></td>';
            tbody.appendChild(tr);
        });
    }

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

        showClients();
        resetForm();
    }

    // Reset the form after saving or cancelling
    function resetForm() {
        nameInput.value    = '';
        typeInput.value    = 'Particulier';
        emailInput.value   = '';
        phoneInput.value   = '';
        addressInput.value = '';
    }

    // On the very first visit, add one example client so the table is not empty
    function seedExample() {
        if (localStorage.getItem('mycraft_clients') === null) {
            const example = [{
                name:    'Dupont Jean',
                type:    'Particulier',
                email:   'jean.dupont@email.fr',
                phone:   '+33 6 11 22 33 44',
                address: '12 avenue des Tilleuls, Antibes'
            }];
            saveData('mycraft_clients', example);
        }
    }

    // --- Events ---

    saveBtn.addEventListener('click', saveClient);
    cancelBtn.addEventListener('click', resetForm);

    // The "+ New client" button at the top just focuses the name field
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            nameInput.focus();
        });
    }

    // Click on "Supprimer" in the client table
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-client-btn')) {
            const index = parseInt(e.target.dataset.index);
            const clients = loadData('mycraft_clients', []);
            clients.splice(index, 1);   // remove 1 item at position "index"
            saveData('mycraft_clients', clients);
            showClients();
        }
    });

    // --- On page load ---
    seedExample();
    showClients();
});
