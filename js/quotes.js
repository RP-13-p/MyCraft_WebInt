
document.addEventListener('DOMContentLoaded', () => {

    const signedCountSpan    = document.getElementById('signed-count');
    const notSignedCountSpan = document.getElementById('not-signed-count');
    const newQuoteBtn        = document.getElementById('new-quote-btn');
    const tbody              = document.getElementById('quotes-tbody');
    const emptyMsg           = document.getElementById('quotes-empty');

    function formatEuro(amount) {
        return amount.toFixed(2).replace('.', ',') + ' €';
    }

    function countSignedThisMonth() {
        const quotes = loadData('mycraft_quotes', []);
        const now = new Date();
        return quotes.filter(q => {
            if (q.status !== 'Accepté') return false;
            if (!q.date || q.date === '(sans date)') return false;
            const d = new Date(q.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
    }

    function countNotSigned() {
        const quotes = loadData('mycraft_quotes', []);
        return quotes.filter(q => q.status !== 'Accepté').length;
    }

    function showQuotes() {
        const quotes = loadData('mycraft_quotes', []);

        // Update the counter cards
        signedCountSpan.textContent    = countSignedThisMonth();
        notSignedCountSpan.textContent = countNotSigned();

        tbody.innerHTML = '';   // clear the table before rebuilding it

        if (quotes.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        quotes.forEach((q, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + q.number + '</td>' +
                '<td>' + q.client + '</td>' +
                '<td>' + formatEuro(q.totalTtc) + '</td>' +
                '<td>' + q.status + '</td>' +
                '<td>' + q.date + '</td>' +
                '<td class="action-icons">' +
                    '<button type="button" class="action-icon-btn">' +
                        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">' +
                            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
                            '<circle cx="12" cy="12" r="3"/>' +
                        '</svg>' +
                    '</button>' +
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
                number:   'DEV-0001',
                client:   'Dupont Jean',
                date:     '2026-05-07',
                validity: '30',
                status:   'Brouillon',
                totalTtc: 1200
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

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-quote-btn');
        if (btn) {
            const index = parseInt(btn.dataset.index);
            const quotes = loadData('mycraft_quotes', []);
            quotes.splice(index, 1);   // remove 1 item at position "index"
            saveData('mycraft_quotes', quotes);
            showQuotes();
        }
    });

    seedExample();
    showQuotes();
});
