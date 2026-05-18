
document.addEventListener('DOMContentLoaded', () => {

    const paidCountSpan    = document.getElementById('paid-count');
    const notPaidCountSpan = document.getElementById('not-paid-count');
    const newInvoiceBtn    = document.getElementById('new-invoice-btn');
    const tbody            = document.getElementById('invoices-tbody');
    const emptyMsg         = document.getElementById('invoices-empty');

    function formatEuro(amount) {
        return amount.toFixed(2).replace('.', ',') + ' €';
    }

    function countPaidThisMonth() {
        const invoices = loadData('mycraft_invoices', []);
        const now = new Date();
        return invoices.filter(inv => {
            if (inv.status !== 'Payée') return false;
            if (!inv.date || inv.date === '(sans date)') return false;
            const d = new Date(inv.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
    }

    function countNotPaid() {
        const invoices = loadData('mycraft_invoices', []);
        return invoices.filter(inv => inv.status !== 'Payée').length;
    }

    function showInvoices() {
        const invoices = loadData('mycraft_invoices', []);

        // Update the counter cards
        paidCountSpan.textContent    = countPaidThisMonth();
        notPaidCountSpan.textContent = countNotPaid();

        tbody.innerHTML = '';   // clear the table before rebuilding it

        if (invoices.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        invoices.forEach((inv, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + inv.number + '</td>' +
                '<td>' + inv.client + '</td>' +
                '<td>' + formatEuro(inv.totalTtc) + '</td>' +
                '<td>' + inv.status + '</td>' +
                '<td>' + inv.due + '</td>' +
                '<td class="action-icons">' +
                    '<button type="button" class="action-icon-btn">' +
                        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">' +
                            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
                            '<circle cx="12" cy="12" r="3"/>' +
                        '</svg>' +
                    '</button>' +
                    '<button type="button" class="delete-invoice-btn action-icon-btn" data-index="' + index + '">' +
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
    }

    function seedExample() {
        if (localStorage.getItem('mycraft_invoices') === null) {
            const example = [{
                number:   'FAC-0001',
                client:   'Dupont Jean',
                date:     '2026-05-07',
                due:      '2026-06-07',
                status:   'Envoyée',
                totalTtc: 1200
            }];
            saveData('mycraft_invoices', example);
            saveData('mycraft_invoice_counter', 1);
        }
    }

    if (newInvoiceBtn) {
        newInvoiceBtn.addEventListener('click', () => {
            window.location.href = 'new_invoice.html';
        });
    }

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-invoice-btn');
        if (btn) {
            const index = parseInt(btn.dataset.index);
            const invoices = loadData('mycraft_invoices', []);
            invoices.splice(index, 1);   // remove 1 item at position "index"
            saveData('mycraft_invoices', invoices);
            showInvoices();
        }
    });

    seedExample();
    showInvoices();
});
