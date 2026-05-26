
document.addEventListener('DOMContentLoaded', () => {

    const linesContainer = document.getElementById('invoice-lines');
    const addLineBtn     = document.getElementById('add-line-btn');
    const saveBtn        = document.getElementById('save-invoice-btn');
    const cancelBtn      = document.getElementById('cancel-invoice-btn');

    const totalHtSpan     = document.getElementById('total-ht');
    const totalTvaSpan    = document.getElementById('total-tva');
    const totalTtcSpan    = document.getElementById('total-ttc');
    const invoiceCostInput = document.getElementById('invoice-cost');
    const totalProfitSpan  = document.getElementById('total-profit');

    const clientInput = document.getElementById('invoice-client');
    const dateInput   = document.getElementById('invoice-date');
    const dueInput    = document.getElementById('invoice-due');
    const statusInput = document.getElementById('invoice-status');

    function populateClientSelect() {
        const clients = loadData('mycraft_clients', []);
        clients.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            clientInput.appendChild(opt);
        });
    }

    function formatEuro(amount) {
        return amount.toFixed(2).replace('.', ',') + ' €';
    }

    function readVatRate(text) {
        return parseFloat(text.replace('%', '').replace(',', '.'));
    }

    function addLine() {
        const line = document.createElement('div');
        line.className = 'quote-line';
        line.innerHTML =
            '<input type="text" class="line-desc" placeholder="Intitulé">' +
            '<input type="number" class="line-qty" value="1" min="0" step="0.5">' +
            '<input type="number" class="line-price" value="0" min="0" step="0.01">' +
            '<select class="line-vat">' +
                '<option>20%</option>' +
                '<option>10%</option>' +
                '<option>5,5%</option>' +
                '<option>0%</option>' +
            '</select>' +
            '<span class="line-total">0,00 €</span>' +
            '<button type="button" class="remove-line-btn">✕</button>';
        linesContainer.appendChild(line);
    }

    function recalculate() {
        let totalHt  = 0;
        let totalVat = 0;

        document.querySelectorAll('.quote-line').forEach((line) => {
            const qty   = parseFloat(line.querySelector('.line-qty').value)   || 0;
            const price = parseFloat(line.querySelector('.line-price').value) || 0;
            const rate  = readVatRate(line.querySelector('.line-vat').value);
            const lineHt = qty * price;
            line.querySelector('.line-total').textContent = formatEuro(lineHt);
            totalHt  += lineHt;
            totalVat += lineHt * (rate / 100);
        });

        const totalTtc = totalHt + totalVat;
        const cost     = parseFloat(invoiceCostInput.value) || 0;
        const profit   = totalTtc - cost;

        totalHtSpan.textContent     = formatEuro(totalHt);
        totalTvaSpan.textContent    = formatEuro(totalVat);
        totalTtcSpan.textContent    = formatEuro(totalTtc);
        totalProfitSpan.textContent = formatEuro(profit);
        totalProfitSpan.style.color = profit >= 0 ? '#1a7f37' : '#cc0000';
    }

    function saveInvoice() {
        if (clientInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom du client.');
            return;
        }

        const totalTtc  = parseFloat(
            totalTtcSpan.textContent.replace(' €', '').replace(',', '.')
        ) || 0;
        const totalCost = parseFloat(invoiceCostInput.value) || 0;
        const profit    = totalTtc - totalCost;

        let counter = loadData('mycraft_invoice_counter', 0);
        counter = counter + 1;
        saveData('mycraft_invoice_counter', counter);

        const number = 'FAC-' + String(counter).padStart(4, '0');

        const newInvoice = {
            number:    number,
            client:    clientInput.value.trim(),
            date:      dateInput.value || '(sans date)',
            due:       dueInput.value  || '(sans échéance)',
            status:    statusInput.value,
            totalTtc:  totalTtc,
            totalCost: totalCost,
            profit:    profit
        };

        const invoices = loadData('mycraft_invoices', []);
        invoices.push(newInvoice);
        saveData('mycraft_invoices', invoices);

        window.location.href = 'invoices.html';
    }

    addLineBtn.addEventListener('click', () => { addLine(); });

    linesContainer.addEventListener('input', recalculate);
    linesContainer.addEventListener('change', recalculate);
    invoiceCostInput.addEventListener('input', recalculate);

    linesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-line-btn')) {
            e.target.closest('.quote-line').remove();
            recalculate();
        }
    });

    document.getElementById('invoice-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveInvoice();
    });
    cancelBtn.addEventListener('click', () => { window.location.href = 'invoices.html'; });

    populateClientSelect();
    addLine();
    recalculate();
});
