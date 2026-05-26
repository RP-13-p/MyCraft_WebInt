
document.addEventListener('DOMContentLoaded', () => {

    const signedCountSpan    = document.getElementById('signed-count');
    const notSignedCountSpan = document.getElementById('not-signed-count');
    const newQuoteBtn        = document.getElementById('new-quote-btn');
    const tbody              = document.getElementById('quotes-tbody');
    const emptyMsg           = document.getElementById('quotes-empty');

    function formatEuro(amount) {
        return parseFloat(amount).toFixed(2).replace('.', ',') + ' €';
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function countSigned() {
        const quotes = loadData('mycraft_quotes', []);
        return quotes.filter(q => q.status === 'Signé' || q.status === 'Facturé').length;
    }

    function countNotSigned() {
        const quotes = loadData('mycraft_quotes', []);
        return quotes.filter(q => q.status !== 'Signé' && q.status !== 'Validé' && q.status !== 'Facturé').length;
    }

    function invoiceFromQuote(index) {
        const quotes = loadData('mycraft_quotes', []);
        const q = quotes[index];
        if (!q) return;

        let counter = loadData('mycraft_invoice_counter', 0);
        counter = counter + 1;
        saveData('mycraft_invoice_counter', counter);

        const newInvoice = {
            number:    'FAC-' + String(counter).padStart(4, '0'),
            client:    q.client,
            date:      new Date().toISOString().slice(0, 10),
            due:       '',
            status:    'À payer',
            totalTtc:  q.totalTtc,
            totalCost: q.totalCost || 0,
            profit:    q.profit    || 0
        };

        const invoices = loadData('mycraft_invoices', []);
        invoices.push(newInvoice);
        saveData('mycraft_invoices', invoices);

        // mark the quote as invoiced
        quotes[index].status = 'Facturé';
        saveData('mycraft_quotes', quotes);

        showQuotes();
    }

    function statusSelect(current, index) {
        if (current === 'Facturé') {
            return '<select class="status-select table-status-select" data-index="' + index + '" disabled>' +
                '<option selected>Facturé</option>' +
            '</select>';
        }
        const opts = ['Envoyé', 'Signé', 'Validé'];
        let html = '<select class="status-select table-status-select" data-index="' + index + '">';
        opts.forEach(o => {
            html += '<option' + (o === current ? ' selected' : '') + '>' + o + '</option>';
        });
        html += '</select>';
        return html;
    }

    function showQuotes() {
        const quotes = loadData('mycraft_quotes', []);

        // Update the counter cards
        signedCountSpan.textContent    = countSigned();
        notSignedCountSpan.textContent = countNotSigned();

        tbody.innerHTML = '';   // clear the table before rebuilding it

        if (quotes.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        const today = MyCraft.now();

        quotes.forEach((q, index) => {
            // Expiry: red if past today and not yet invoiced
            let expiryDisplay = q.expiryDate || '—';
            let expiryStyle   = '';
            if (q.expiryDate && q.status !== 'Facturé') {
                const expDate = new Date(q.expiryDate);
                if (expDate < today) {
                    const d = expDate;
                    expiryDisplay = pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
                    expiryStyle = 'color:#cc0000;font-weight:bold';
                } else {
                    const d = expDate;
                    expiryDisplay = pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
                }
            }

            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + q.number + '</td>' +
                '<td>' + q.client + '</td>' +
                '<td>' + formatEuro(q.totalTtc) + '</td>' +
                '<td>' + statusSelect(q.status, index) + '</td>' +
                '<td>' + q.date + '</td>' +
                '<td style="' + expiryStyle + '">' + expiryDisplay + '</td>' +
                '<td class="action-icons">' +
                    '<button type="button" class="delete-quote-btn action-icon-btn" data-index="' + index + '">' +
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
        if (localStorage.getItem('mycraft_quotes') === null) {
            const example = [{
                number:    'DEV-0001',
                client:    'Dupont Jean',
                date:      '2026-05-07',
                validity:  '30',
                status:    'Envoyé',
                totalTtc:  1200,
                totalCost: 600,
                profit:    600
            }];
            saveData('mycraft_quotes', example);
            saveData('mycraft_quote_counter', 1);
        }
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => {
            window.location.href = 'new_quote.html';
        });
    }

    tbody.addEventListener('change', (e) => {
        const sel = e.target.closest('.status-select');
        if (!sel) return;
        const index = parseInt(sel.dataset.index);
        const newStatus = sel.value;
        if (newStatus === 'Validé') {
            invoiceFromQuote(index);
        } else {
            const quotes = loadData('mycraft_quotes', []);
            quotes[index].status = newStatus;
            saveData('mycraft_quotes', quotes);
            showQuotes();
        }
    });

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-quote-btn');
        if (!btn) return;
        const index = parseInt(btn.dataset.index);
        const quotes = loadData('mycraft_quotes', []);
        quotes.splice(index, 1);   // remove 1 item at position "index"
        saveData('mycraft_quotes', quotes);
        showQuotes();
    });

    seedExample();
    showQuotes();
});
