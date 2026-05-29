document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const index = parseInt(params.get('index'));

    const invoices = loadData('mycraft_invoices', []);
    const invoice = invoices[index];

    if (!invoice) {
        window.location.href = 'invoices.html';
        return;
    }

    const pageTitle = document.getElementById('page-title');
    const numberInput = document.getElementById('invoice-number');
    const clientSelect = document.getElementById('invoice-client');
    const dateInput = document.getElementById('invoice-date');
    const dueInput = document.getElementById('invoice-due');
    const statusSelect = document.getElementById('invoice-status');
    const linesContainer = document.getElementById('invoice-lines');
    const addLineBtn = document.getElementById('add-line-btn');

    const totalHtSpan = document.getElementById('total-ht');
    const totalTvaSpan = document.getElementById('total-tva');
    const totalTtcSpan = document.getElementById('total-ttc');
    const totalCostSpan = document.getElementById('total-cost');
    const totalProfitSpan = document.getElementById('total-profit');

    const modifyBtn = document.getElementById('modify-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    pageTitle.textContent = invoice.number;
    numberInput.value = invoice.number;

    function populateClientSelect() {
        const clients = loadData('mycraft_clients', []);
        clients.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            clientSelect.appendChild(opt);
        });
        clientSelect.value = invoice.client;
        if (!clientSelect.value) {
            clientSelect.options[0].value = invoice.client;
            clientSelect.options[0].textContent = invoice.client;
            clientSelect.value = invoice.client;
        }
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

    function addLine(lineData, disabled) {
        const line = document.createElement('div');
        line.className = 'quote-line';
        line.dataset.avgcost = lineData ? String(lineData.avgCost || 0) : '0';
        line.innerHTML =
            '<select class="line-catalog"' + (disabled ? ' disabled' : '') + '>' + buildCatalogOptions() + '</select>' +
            '<input type="text" class="line-desc" placeholder="Intitulé"' + (disabled ? ' disabled' : '') + '>' +
            '<input type="number" class="line-qty" value="1" min="0" step="0.5"' + (disabled ? ' disabled' : '') + '>' +
            '<input type="number" class="line-price" value="0" min="0" step="0.01"' + (disabled ? ' disabled' : '') + '>' +
            '<select class="line-vat"' + (disabled ? ' disabled' : '') + '>' +
                '<option>20%</option>' +
                '<option>10%</option>' +
                '<option>5,5%</option>' +
                '<option>0%</option>' +
            '</select>' +
            '<span class="line-total">0,00 €</span>' +
            '<button type="button" class="remove-line-btn" style="' + (disabled ? 'display:none' : '') + '">✕</button>';
        linesContainer.appendChild(line);

        if (lineData) {
            line.querySelector('.line-desc').value = lineData.desc || '';
            line.querySelector('.line-qty').value = lineData.qty !== undefined ? lineData.qty : 1;
            line.querySelector('.line-price').value = lineData.price != null ? lineData.price : 0;
            const vatSelect = line.querySelector('.line-vat');
            for (let i = 0; i < vatSelect.options.length; i++) {
                if (vatSelect.options[i].text === lineData.vat) {
                    vatSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    function recalculate() {
        let totalHt = 0;
        let totalVat = 0;
        let totalCost = 0;

        linesContainer.querySelectorAll('.quote-line').forEach(line => {
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
        const profit = totalTtc - totalCost;

        totalHtSpan.textContent = formatEuro(totalHt);
        totalTvaSpan.textContent = formatEuro(totalVat);
        totalTtcSpan.textContent = formatEuro(totalTtc);
        totalCostSpan.textContent = formatEuro(totalCost);
        totalProfitSpan.textContent = formatEuro(profit);
        totalProfitSpan.style.color = profit >= 0 ? '#1a7f37' : '#cc0000';
    }

    function updateDueDate() {
        if (!dateInput.value) return;
        const d = new Date(dateInput.value);
        d.setDate(d.getDate() + 30);
        dueInput.value = d.toISOString().slice(0, 10);
    }

    function saveInvoice() {
        const totalTtc = parseFloat(totalTtcSpan.textContent.replace(' €', '').replace(',', '.')) || 0;
        const totalCostVal = parseFloat(totalCostSpan.textContent.replace(' €', '').replace(',', '.')) || 0;

        const lines = [];
        linesContainer.querySelectorAll('.quote-line').forEach(line => {
            lines.push({
                desc: line.querySelector('.line-desc').value,
                qty: parseFloat(line.querySelector('.line-qty').value) || 0,
                price: parseFloat(line.querySelector('.line-price').value) || 0,
                vat: line.querySelector('.line-vat').value,
                avgCost: parseFloat(line.dataset.avgcost) || 0
            });
        });

        const allInvoices = loadData('mycraft_invoices', []);
        allInvoices[index].client = clientSelect.value;
        allInvoices[index].date = dateInput.value || '(sans date)';
        allInvoices[index].due = dueInput.value || '(sans échéance)';
        allInvoices[index].status = statusSelect.value;
        allInvoices[index].totalTtc = totalTtc;
        allInvoices[index].totalCost = totalCostVal;
        allInvoices[index].profit = totalTtc - totalCostVal;
        allInvoices[index].lines = lines;

        saveData('mycraft_invoices', allInvoices);
        window.location.href = 'invoices.html';
    }

    populateClientSelect();

    if (invoice.date && invoice.date !== '(sans date)') {
        dateInput.value = invoice.date;
    }
    if (invoice.due && invoice.due !== '(sans échéance)') {
        dueInput.value = invoice.due;
    }
    statusSelect.value = invoice.status;

    if (invoice.lines && invoice.lines.length > 0) {
        invoice.lines.forEach(l => addLine(l, true));
    } else {
        addLine(null, true);
    }
    recalculate();

    addLineBtn.addEventListener('click', () => { addLine(null, false); recalculate(); });

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

    dateInput.addEventListener('change', updateDueDate);

    modifyBtn.addEventListener('click', () => {
        clientSelect.disabled = false;
        dateInput.disabled = false;
        dueInput.disabled = false;
        statusSelect.disabled = false;

        linesContainer.querySelectorAll('input, select').forEach(el => {
            el.disabled = false;
        });
        linesContainer.querySelectorAll('.remove-line-btn').forEach(btn => {
            btn.style.display = '';
        });

        addLineBtn.style.display = '';
        modifyBtn.style.display = 'none';
        saveBtn.style.display = '';
    });

    saveBtn.addEventListener('click', saveInvoice);

    cancelBtn.addEventListener('click', () => { window.location.href = 'invoices.html'; });
});
