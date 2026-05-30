document.addEventListener('DOMContentLoaded', () => {

    const linesContainer = document.getElementById('quote-lines');
    const addLineBtn = document.getElementById('add-line-btn');
    const cancelBtn = document.getElementById('cancel-quote-btn');

    const totalHtSpan = document.getElementById('total-ht');
    const totalTvaSpan = document.getElementById('total-tva');
    const totalTtcSpan = document.getElementById('total-ttc');
    const totalCostSpan = document.getElementById('total-cost');
    const totalProfitSpan = document.getElementById('total-profit');

    const clientInput = document.getElementById('quote-client');
    const dateInput = document.getElementById('quote-date');
    const validityInput = document.getElementById('quote-validity');
    const statusInput = document.getElementById('quote-status');
    const expiryEl = document.getElementById('quote-expiry');

    function populateClientSelect() {
        const clients = loadData('mycraft_clients', []);
        clients.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            clientInput.appendChild(opt);
        });
    }

    function readVatRate(text) {
        return parseFloat(text.replace('%', '').replace(',', '.'));
    }

    function buildCatalogOptions() {
        const prestations = loadData('mycraft_catalog', []);
        let opts = '<option value="">-- Catalogue --</option>';
        prestations.forEach((p, i) => {
            opts += '<option value="' + i + '">' + p.name + '</option>';
        });
        return opts;
    }

    function addLine() {
        const line = document.createElement('div');
        line.className = 'quote-line';
        line.innerHTML =
            '<select class="line-catalog" aria-label="Catalogue">' + buildCatalogOptions() + '</select>' +
            '<input type="text" class="line-desc" placeholder="Intitulé">' +
            '<input type="number" class="line-qty" value="1" min="0" step="0.5">' +
            '<input type="number" class="line-price" value="0" min="0" step="0.01">' +
            '<select class="line-vat" aria-label="TVA">' +
                '<option>20%</option>' +
                '<option>10%</option>' +
                '<option>5,5%</option>' +
                '<option>0%</option>' +
            '</select>' +
            '<span class="line-total">0,00 €</span>' +
            '<button type="button" class="remove-line-btn" aria-label="Supprimer la ligne">✕</button>';
        linesContainer.appendChild(line);
    }

    function recalculate() {
        let totalHt = 0;
        let totalVat = 0;
        let totalCost = 0;

        document.querySelectorAll('.quote-line').forEach((line) => {
            const qty = parseFloat(line.querySelector('.line-qty').value) || 0;
            const price = parseFloat(line.querySelector('.line-price').value) || 0;
            const rate = readVatRate(line.querySelector('.line-vat').value);
            const avgCost = parseFloat(line.dataset.avgcost) || 0;
            const lineHt = qty * price;
            line.querySelector('.line-total').textContent = formatEuro(lineHt);
            totalHt += lineHt;
            totalVat += lineHt * (rate / 100);
            totalCost += qty * avgCost;
        });

        const totalTtc = totalHt + totalVat;
        const totalProfit = totalTtc - totalCost;

        totalHtSpan.textContent = formatEuro(totalHt);
        totalTvaSpan.textContent = formatEuro(totalVat);
        totalTtcSpan.textContent = formatEuro(totalTtc);
        totalCostSpan.textContent = formatEuro(totalCost);
        totalProfitSpan.textContent = formatEuro(totalProfit);
        totalProfitSpan.style.color = totalProfit >= 0 ? '#1a7f37' : '#cc0000';
    }

    function computeExpiry() {
        if (!dateInput.value || !validityInput.value) return '';
        const d = new Date(dateInput.value);
        d.setDate(d.getDate() + parseInt(validityInput.value));
        return d.toISOString().slice(0, 10);
    }

    function updateExpiryDisplay() {
        const iso = computeExpiry();
        if (!iso) { expiryEl.textContent = ''; return; }
        const d = new Date(iso);
        expiryEl.textContent = 'Expire le : ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
    }

    function saveQuote() {
        const totalTtc = parseFloat(totalTtcSpan.textContent.replace(' €', '').replace(',', '.')) || 0;
        const totalCost = parseFloat(totalCostSpan.textContent.replace(' €', '').replace(',', '.')) || 0;

        const lines = [];
        document.querySelectorAll('.quote-line').forEach(line => {
            lines.push({
                desc: line.querySelector('.line-desc').value,
                qty: parseFloat(line.querySelector('.line-qty').value) || 0,
                price: parseFloat(line.querySelector('.line-price').value) || 0,
                vat: line.querySelector('.line-vat').value,
                avgCost: parseFloat(line.dataset.avgcost) || 0
            });
        });

        let counter = loadData('mycraft_quote_counter', 0) + 1;
        saveData('mycraft_quote_counter', counter);

        const newQuote = {
            number: 'DEV-' + String(counter).padStart(4, '0'),
            client: clientInput.value.trim(),
            date: dateInput.value || '(sans date)',
            validity: validityInput.value,
            expiryDate: computeExpiry(),
            status: statusInput.value,
            totalTtc: totalTtc,
            totalCost: totalCost,
            profit: totalTtc - totalCost,
            lines: lines
        };

        const quotes = loadData('mycraft_quotes', []);
        quotes.push(newQuote);
        saveData('mycraft_quotes', quotes);

        window.location.href = 'quotes.html';
    }

    addLineBtn.addEventListener('click', () => { addLine(); });
    linesContainer.addEventListener('input', recalculate);

    linesContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('line-catalog')) {
            const line = e.target.closest('.quote-line');
            const idx = e.target.value;
            if (idx === '') {
                line.dataset.avgcost = '0';
            } else {
                const prestations = loadData('mycraft_catalog', []);
                const p = prestations[parseInt(idx)];
                if (p) {
                    line.querySelector('.line-desc').value = p.name;
                    line.querySelector('.line-price').value = p.price;
                    const vatSelect = line.querySelector('.line-vat');
                    for (let i = 0; i < vatSelect.options.length; i++) {
                        if (parseFloat(vatSelect.options[i].text) === parseFloat(p.tax)) {
                            vatSelect.selectedIndex = i;
                            break;
                        }
                    }
                    line.dataset.avgcost = String(p.avgCost);
                }
            }
        }
        recalculate();
    });

    linesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-line-btn')) {
            e.target.closest('.quote-line').remove();
            recalculate();
        }
    });

    dateInput.addEventListener('change', updateExpiryDisplay);
    validityInput.addEventListener('input', updateExpiryDisplay);

    document.getElementById('quote-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveQuote();
    });
    cancelBtn.addEventListener('click', () => { window.location.href = 'quotes.html'; });

    populateClientSelect();
    dateInput.value = new Date().toISOString().slice(0, 10);
    updateExpiryDisplay();
    addLine();
    recalculate();
});
