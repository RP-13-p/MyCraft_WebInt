document.addEventListener('DOMContentLoaded', () => {

    const countSpan = document.getElementById('catalog-count');
    const searchInput = document.getElementById('catalog-search');
    const categoryFilter = document.getElementById('catalog-category-filter');
    const tbody = document.getElementById('catalog-tbody');
    const emptyMsg = document.getElementById('catalog-empty');

    function buildCategoryFilter(prestations) {
        const categories = [...new Set(prestations.map(p => p.category).filter(Boolean))];
        const current = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="">Toutes catégories</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            if (cat === current) opt.selected = true;
            categoryFilter.appendChild(opt);
        });
    }

    function showCatalog() {
        const prestations = loadData('mycraft_catalog', []);
        const term = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        countSpan.textContent = prestations.length;
        buildCategoryFilter(prestations);
        tbody.innerHTML = '';

        let found = false;
        prestations.forEach((p, i) => {
            if (term && !p.name.toLowerCase().includes(term)) return;
            if (category && p.category !== category) return;
            found = true;
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td data-label="Prestation">' + p.name + '</td>' +
                '<td data-label="Catégorie">' + p.category + '</td>' +
                '<td data-label="Prix HT">' + formatEuro(p.price) + '</td>' +
                '<td data-label="TVA">' + p.tax + '%</td>' +
                '<td data-label="Coût moyen">' + formatEuro(p.avgCost) + '</td>' +
                '<td class="action-icons">' +
                    '<button type="button" class="delete-catalog-btn action-icon-btn" data-index="' + i + '">' +
                        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">' +
                            '<polyline points="3 6 5 6 21 6"/>' +
                            '<path d="M19 6l-1 14H6L5 6"/>' +
                            '<path d="M10 11v6M14 11v6"/>' +
                            '<path d="M9 6V4h6v2"/>' +
                        '</svg>' +
                    '</button>' +
                '</td>';
            tbody.appendChild(tr);
        });

        emptyMsg.style.display = found ? 'none' : 'block';
    }

    function seedExample() {
        if (localStorage.getItem('mycraft_catalog') !== null) return;
        saveData('mycraft_catalog', [
            { name: 'Remplacement robinet', category: 'Plomberie', price: 50, tax: 20, avgCost: 26 },
            { name: 'Installation électrique', category: 'Électricité', price: 80, tax: 20, avgCost: 40 }
        ]);
    }

    searchInput.addEventListener('input', showCatalog);
    categoryFilter.addEventListener('change', showCatalog);

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-catalog-btn');
        if (!btn) return;
        const index = parseInt(btn.dataset.index);
        const prestations = loadData('mycraft_catalog', []);
        prestations.splice(index, 1);
        saveData('mycraft_catalog', prestations);
        showCatalog();
    });

    seedExample();
    showCatalog();
});
