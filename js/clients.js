document.addEventListener('DOMContentLoaded', () => {

    const newBtn = document.getElementById('new-client-btn');
    const countSpan = document.getElementById('clients-count');
    const searchInput = document.getElementById('client-search');
    const grid = document.getElementById('clients-grid');
    const emptyMsg = document.getElementById('clients-empty');

    const personIcon =
        '<svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" stroke-width="1.5">' +
            '<circle cx="12" cy="8" r="5"/>' +
            '<path d="M4 22c0-4 3.6-7 8-7s8 3 8 7"/>' +
        '</svg>';

    function showClients() {
        const clients = loadData('mycraft_clients', []);
        const term = searchInput.value.toLowerCase();

        countSpan.textContent = clients.length;
        grid.innerHTML = '';

        let found = false;
        clients.forEach((c, i) => {
            if (!c.name.toLowerCase().includes(term)) return;
            found = true;
            const card = document.createElement('article');
            card.className = 'client-card';
            card.dataset.index = i;
            card.style.cursor = 'pointer';
            card.innerHTML =
                '<p class="client-card-name">' + c.name + '</p>' +
                personIcon +
                '<button type="button" class="delete-client-btn" data-index="' + i + '">Supprimer</button>';
            grid.appendChild(card);
        });

        emptyMsg.style.display = found ? 'none' : 'block';
    }

    function seedExample() {
        if (localStorage.getItem('mycraft_clients') !== null) return;
        saveData('mycraft_clients', [{
            name: 'Martin Sophie',
            type: 'Particulier',
            email: 'sophie.martin@email.fr',
            phone: '+33 6 55 44 33 22',
            address: '8 rue des Lilas, Nice'
        }]);
    }

    if (newBtn) {
        newBtn.addEventListener('click', () => {
            window.location.href = 'new_client.html';
        });
    }

    searchInput.addEventListener('input', showClients);

    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-client-btn');
        if (btn) {
            const index = parseInt(btn.dataset.index);
            const clients = loadData('mycraft_clients', []);
            clients.splice(index, 1);
            saveData('mycraft_clients', clients);
            showClients();
            return;
        }
        const card = e.target.closest('.client-card');
        if (card) {
            window.location.href = 'client_detail.html?index=' + card.dataset.index;
        }
    });

    seedExample();
    showClients();
});
