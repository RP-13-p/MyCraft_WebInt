// quotes.js
// Handles the Quotes page:
//  - add and remove service lines in the form
//  - calculate totals automatically when the user types
//  - save a quote to localStorage and show it in the table
//  - delete a quote from the table

document.addEventListener('DOMContentLoaded', () => {

    // --- Get all elements from the page ---
    const linesContainer = document.getElementById('quote-lines');
    const addLineBtn     = document.getElementById('add-line-btn');
    const saveBtn        = document.getElementById('save-quote-btn');
    const cancelBtn      = document.getElementById('cancel-quote-btn');
    const newQuoteBtn    = document.getElementById('new-quote-btn');

    const totalHtSpan  = document.getElementById('total-ht');
    const totalTvaSpan = document.getElementById('total-tva');
    const totalTtcSpan = document.getElementById('total-ttc');

    const clientInput   = document.getElementById('quote-client');
    const dateInput     = document.getElementById('quote-date');
    const validityInput = document.getElementById('quote-validity');
    const statusInput   = document.getElementById('quote-status');

    const tbody    = document.getElementById('quotes-tbody');
    const emptyMsg = document.getElementById('quotes-empty');

    // --- Small utility functions ---

    // Format a number as French currency: 1200 -> "1200,00 €"
    function formatEuro(amount) {
        return amount.toFixed(2).replace('.', ',') + ' \u20ac';
    }

    // Read the VAT rate from the select text: "5,5%" -> 5.5
    function readVatRate(text) {
        const withoutPercent = text.replace('%', '').replace(',', '.');
        return parseFloat(withoutPercent);
    }

    // --- Service lines ---

    // Create a new empty line and add it to the form
    function addLine() {
        const line = document.createElement('div');
        line.className = 'quote-line';
        line.innerHTML =
            '<input type="text" class="line-desc" placeholder="Description">' +
            '<input type="number" class="line-qty" value="1" min="0" step="0.5">' +
            '<input type="number" class="line-price" value="0" min="0" step="0.01">' +
            '<select class="line-vat">' +
                '<option>20%</option>' +
                '<option>10%</option>' +
                '<option>5,5%</option>' +
                '<option>0%</option>' +
            '</select>' +
            '<span class="line-total">0,00 \u20ac</span>' +
            '<button type="button" class="remove-line-btn">\u2715</button>';
        linesContainer.appendChild(line);
    }

    // Recalculate the total of each line, then update the global totals
    function recalculate() {
        let totalHt  = 0;
        let totalVat = 0;

        const lines = document.querySelectorAll('.quote-line');
        lines.forEach((line) => {
            // parseFloat(...) || 0 : if the field is empty, we count 0
            const qty   = parseFloat(line.querySelector('.line-qty').value)   || 0;
            const price = parseFloat(line.querySelector('.line-price').value) || 0;
            const rate  = readVatRate(line.querySelector('.line-vat').value);

            const lineHt = qty * price;
            line.querySelector('.line-total').textContent = formatEuro(lineHt);

            totalHt  += lineHt;
            totalVat += lineHt * (rate / 100);
        });

        totalHtSpan.textContent  = formatEuro(totalHt);
        totalTvaSpan.textContent = formatEuro(totalVat);
        totalTtcSpan.textContent = formatEuro(totalHt + totalVat);
    }

    // --- Quote table ---

    function showQuotes() {
        const quotes = loadData('mycraft_quotes', []);

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
                '<td>' + q.date + '</td>' +
                '<td>' + formatEuro(q.totalTtc) + '</td>' +
                '<td>' + q.status + '</td>' +
                '<td><button type="button" class="delete-quote-btn" data-index="' + index + '">Supprimer</button></td>';
            tbody.appendChild(tr);
        });
    }

    // --- Save a quote ---

    function saveQuote() {
        // Simple check: client name is required
        if (clientInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom du client.');
            return;
        }

        // Read the TTC total already displayed: remove " €" and put back the dot
        const totalTtc = parseFloat(
            totalTtcSpan.textContent.replace(' \u20ac', '').replace(',', '.')
        ) || 0;

        // Quote number: we keep a counter in localStorage
        let counter = loadData('mycraft_quote_counter', 0);
        counter = counter + 1;
        saveData('mycraft_quote_counter', counter);

        // String(7).padStart(4, '0') -> "0007"
        const number = 'DEV-' + String(counter).padStart(4, '0');

        const newQuote = {
            number:   number,
            client:   clientInput.value.trim(),
            date:     dateInput.value || '(sans date)',
            validity: validityInput.value,
            status:   statusInput.value,
            totalTtc: totalTtc
        };

        // Add the quote to the existing list, then save
        const quotes = loadData('mycraft_quotes', []);
        quotes.push(newQuote);
        saveData('mycraft_quotes', quotes);

        showQuotes();
        resetForm();
    }

    // Reset the form after saving or cancelling
    function resetForm() {
        clientInput.value   = '';
        dateInput.value     = '';
        validityInput.value = '30';
        statusInput.value   = 'Brouillon';
        linesContainer.innerHTML = '';
        addLine();
        recalculate();
    }

    // On the very first visit, add one example quote so the table is not empty
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

    // --- Events ---

    addLineBtn.addEventListener('click', () => {
        addLine();
    });

    // One listener on the container catches all input events from child fields.
    // Events "bubble up" from a child to its parent, so we only need one listener.
    linesContainer.addEventListener('input', recalculate);
    linesContainer.addEventListener('change', recalculate);  // also catches select changes

    // Click on a remove button inside a line
    linesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-line-btn')) {
            e.target.closest('.quote-line').remove();
            recalculate();
        }
    });

    saveBtn.addEventListener('click', saveQuote);
    cancelBtn.addEventListener('click', resetForm);

    // The "+ New quote" button at the top just focuses the client field
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => {
            clientInput.focus();
        });
    }

    // Click on "Supprimer" in the quote table
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-quote-btn')) {
            const index = parseInt(e.target.dataset.index);
            const quotes = loadData('mycraft_quotes', []);
            quotes.splice(index, 1);   // remove 1 item at position "index"
            saveData('mycraft_quotes', quotes);
            showQuotes();
        }
    });

    // --- On page load ---
    seedExample();
    addLine();       // always start with one empty line
    recalculate();
    showQuotes();
});
