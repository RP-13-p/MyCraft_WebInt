document.addEventListener('DOMContentLoaded', () => {

    const paidCountSpan = document.getElementById('paid-count');
    const notPaidCountSpan = document.getElementById('not-paid-count');
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const tbody = document.getElementById('invoices-tbody');
    const emptyMsg = document.getElementById('invoices-empty');

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

    function statusSelect(current, index) {
        const opts = ['À payer', 'Payée'];
        let html = '<select class="status-select table-status-select" data-index="' + index + '">';
        opts.forEach(o => {
            html += '<option' + (o === current ? ' selected' : '') + '>' + o + '</option>';
        });
        html += '</select>';
        return html;
    }

    function showInvoices() {
        const invoices = loadData('mycraft_invoices', []);

        paidCountSpan.textContent = countPaidThisMonth();
        notPaidCountSpan.textContent = countNotPaid();

        tbody.innerHTML = '';

        if (invoices.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        const today = new Date();

        invoices.forEach((inv, index) => {
            const profit = inv.profit || 0;
            const profitColor = profit >= 0 ? '#1a7f37' : '#cc0000';

            const isOverdue = inv.status === 'À payer' &&
                              inv.due && inv.due !== '(sans échéance)' &&
                              new Date(inv.due) < today;
            const dueStyle = isOverdue ? 'color:#cc0000;font-weight:bold' : '';

            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td data-label="N° Facture">' + inv.number + '</td>' +
                '<td data-label="Client">' + inv.client + '</td>' +
                '<td data-label="Montant TTC">' + formatEuro(inv.totalTtc) + '</td>' +
                '<td data-label="Coût">' + formatEuro(inv.totalCost || 0) + '</td>' +
                '<td data-label="Résultat" style="color:' + profitColor + '">' + formatEuro(profit) + '</td>' +
                '<td data-label="Statut">' + statusSelect(inv.status, index) + '</td>' +
                '<td data-label="Échéance" style="' + dueStyle + '">' + inv.due + '</td>' +
                '<td class="action-icons">' +
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
        if (localStorage.getItem('mycraft_invoices') !== null) return;
        saveData('mycraft_invoices', [{
            number: 'FAC-0001',
            client: 'Leroy Thomas',
            date: '2026-05-07',
            due: '2026-06-07',
            status: 'À payer',
            totalTtc: 1200,
            totalCost: 600,
            profit: 600
        }]);
        saveData('mycraft_invoice_counter', 1);
    }

    if (newInvoiceBtn) {
        newInvoiceBtn.addEventListener('click', () => {
            window.location.href = 'new_invoice.html';
        });
    }

    tbody.addEventListener('change', (e) => {
        const sel = e.target.closest('.status-select');
        if (!sel) return;
        const index = parseInt(sel.dataset.index);
        const invoices = loadData('mycraft_invoices', []);
        invoices[index].status = sel.value;
        saveData('mycraft_invoices', invoices);
        showInvoices();
    });

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-invoice-btn');
        if (!btn) return;
        const index = parseInt(btn.dataset.index);
        const invoices = loadData('mycraft_invoices', []);
        invoices.splice(index, 1);
        saveData('mycraft_invoices', invoices);
        showInvoices();
    });

    seedExample();
    showInvoices();
});
