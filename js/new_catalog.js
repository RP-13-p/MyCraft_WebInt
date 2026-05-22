document.addEventListener('DOMContentLoaded', () => {

    const nameInput    = document.getElementById('catalog-name');
    const categoryInput = document.getElementById('catalog-category');
    const priceInput   = document.getElementById('catalog-price');
    const taxInput     = document.getElementById('catalog-tax');
    const avgCostInput = document.getElementById('catalog-avgcost');

    const saveBtn   = document.getElementById('save-catalog-btn');
    const cancelBtn = document.getElementById('cancel-catalog-btn');

    function savePrestation() {
        if (nameInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom de la prestation.');
            return;
        }

        const newPrestation = {
            name:     nameInput.value.trim(),
            category: categoryInput.value.trim(),
            price:    parseFloat(priceInput.value) || 0,
            tax:      parseFloat(taxInput.value)   || 0,
            avgCost:  parseFloat(avgCostInput.value) || 0
        };

        const prestations = loadData('mycraft_catalog', []);
        prestations.push(newPrestation);
        saveData('mycraft_catalog', prestations);

        window.location.href = 'catalog.html';
    }

    saveBtn.addEventListener('click', savePrestation);
    cancelBtn.addEventListener('click', () => { window.location.href = 'catalog.html'; });
});
