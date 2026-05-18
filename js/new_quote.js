
document.addEventListener('DOMContentLoaded', () => {

    const linesContainer = document.getElementById('quote-lines');
    const addLineBtn     = document.getElementById('add-line-btn');
    const saveBtn        = document.getElementById('save-quote-btn');
    const cancelBtn      = document.getElementById('cancel-quote-btn');

    const totalHtSpan  = document.getElementById('total-ht');
    const totalTvaSpan = document.getElementById('total-tva');
    const totalTtcSpan = document.getElementById('total-ttc');

    const clientInput   = document.getElementById('quote-client');
    const dateInput     = document.getElementById('quote-date');
    const validityInput = document.getElementById('quote-validity');
    const statusInput   = document.getElementById('quote-status');

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
            '<input type="text" class="line-desc" placeholder="Description">' +
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

        totalHtSpan.textContent  = formatEuro(totalHt);
        totalTvaSpan.textContent = formatEuro(totalVat);
        totalTtcSpan.textContent = formatEuro(totalHt + totalVat);
    }

    function saveQuote() {
        if (clientInput.value.trim() === '') {
            alert('Merci d\'indiquer le nom du client.');
            return;
        }

        // le total affiché est en format "1 200,00 €", on le reconvertit en nombre
        const totalTtc = parseFloat(
            totalTtcSpan.textContent.replace(' €', '').replace(',', '.')
        ) || 0;

        let counter = loadData('mycraft_quote_counter', 0);
        counter = counter + 1;
        saveData('mycraft_quote_counter', counter);

        const number = 'DEV-' + String(counter).padStart(4, '0');

        const newQuote = {
            number:   number,
            client:   clientInput.value.trim(),
            date:     dateInput.value || '(sans date)',
            validity: validityInput.value,
            status:   statusInput.value,
            totalTtc: totalTtc
        };

        const quotes = loadData('mycraft_quotes', []);
        quotes.push(newQuote);
        saveData('mycraft_quotes', quotes);

        window.location.href = 'quotes.html';
    }

    addLineBtn.addEventListener('click', () => { addLine(); });

    linesContainer.addEventListener('input', recalculate);
    linesContainer.addEventListener('change', recalculate); // aussi pour les <select>

    linesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-line-btn')) {
            e.target.closest('.quote-line').remove();
            recalculate();
        }
    });

    saveBtn.addEventListener('click', saveQuote);
    cancelBtn.addEventListener('click', () => { window.location.href = 'quotes.html'; });

    addLine();
    recalculate();
});
