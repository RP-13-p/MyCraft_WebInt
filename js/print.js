function buildPrintData(doc, type) {
    const settings = loadData('mycraft_settings', {});

    return {
        company: {
            name: settings.company || '',
            siret: settings.siret || '',
            address: settings.address || '',
            phone: settings.phone || '',
            email: settings.email || ''
        },
        number: doc.number,
        client: doc.client,
        date: doc.date,
        due: type === 'invoice' ? (doc.due || '') : '',
        validity: type === 'quote' ? (doc.validity || '') : '',
        expiryDate: type === 'quote' ? (doc.expiryDate || '') : '',
        status: doc.status,
        lines: doc.lines || [],
        totalTtc: doc.totalTtc || 0,
        totalCost: doc.totalCost || 0,
        profit: doc.profit || 0
    };
}

function buildPrintHTML(doc, type) {
    const data = buildPrintData(doc, type);

    function fmtDate(iso) {
        if (!iso || iso.startsWith('(')) return iso || '—';
        const d = new Date(iso);
        return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
    }

    let linesHtml = '';
    let totalHt = 0;
    let totalTva = 0;

    data.lines.forEach(function(line) {
        const ht = line.qty * line.price;
        const rate = parseFloat(line.vat.replace('%', '').replace(',', '.'));
        totalHt += ht;
        totalTva += ht * (rate / 100);
        linesHtml +=
            '<tr>' +
            '<td>' + line.desc + '</td>' +
            '<td class="num">' + line.qty + '</td>' +
            '<td class="num">' + formatEuro(line.price) + '</td>' +
            '<td class="num">' + line.vat + '</td>' +
            '<td class="num">' + formatEuro(ht) + '</td>' +
            '</tr>';
    });

    const ttc = data.lines.length > 0 ? totalHt + totalTva : data.totalTtc;
    const docLabel = type === 'invoice' ? 'FACTURE' : 'DEVIS';
    const recipientLabel = type === 'invoice' ? 'Facturé à' : 'Émis à';

    let docInfoHtml =
        '<p class="print-doc-title">' + docLabel + ' N° ' + data.number + '</p>' +
        '<p>Date : ' + fmtDate(data.date) + '</p>';

    if (type === 'invoice') {
        docInfoHtml += '<p>Échéance : ' + fmtDate(data.due) + '</p>';
    } else {
        docInfoHtml += '<p>Validité : ' + (data.validity || '—') + ' jours</p>';
        if (data.expiryDate) {
            docInfoHtml += '<p>Expire le : ' + fmtDate(data.expiryDate) + '</p>';
        }
    }
    docInfoHtml += '<p>Statut : ' + data.status + '</p>';

    const legalLine = type === 'invoice'
        ? 'Paiement à réception de facture. En cas de retard, pénalités au taux légal en vigueur.'
        : 'Devis valable ' + (data.validity || '30') + ' jours à compter de la date d\'émission.';

    return (
        '<div class="print-header">' +
            '<div class="print-issuer">' +
                '<span class="print-company-name">' + (data.company.name || 'MyCraft') + '</span>' +
                (data.company.address ? '<p>' + data.company.address + '</p>' : '') +
                (data.company.siret ? '<p>SIRET : ' + data.company.siret + '</p>' : '') +
                (data.company.email ? '<p>' + data.company.email + '</p>' : '') +
                (data.company.phone ? '<p>' + data.company.phone + '</p>' : '') +
            '</div>' +
            '<div class="print-recipient">' +
                '<p><strong>' + recipientLabel + '</strong></p>' +
                '<p>' + data.client + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="print-doc-info">' + docInfoHtml + '</div>' +
        '<table class="print-lines">' +
            '<thead><tr>' +
                '<th>Description</th>' +
                '<th class="num">Qté</th>' +
                '<th class="num">Prix HT</th>' +
                '<th class="num">TVA</th>' +
                '<th class="num">Total HT</th>' +
            '</tr></thead>' +
            '<tbody>' + (linesHtml || '<tr><td colspan="5">—</td></tr>') + '</tbody>' +
        '</table>' +
        '<div class="print-totals">' +
            (data.lines.length > 0 ?
                '<p><span>Total HT</span><span>' + formatEuro(totalHt) + '</span></p>' +
                '<p><span>TVA</span><span>' + formatEuro(totalTva) + '</span></p>'
            : '') +
            '<p class="print-total-ttc"><span>Total TTC</span><span>' + formatEuro(ttc) + '</span></p>' +
        '</div>' +
        '<div class="print-legal">' +
            '<p>' + (data.company.name || 'MyCraft') + (data.company.siret ? ' — SIRET : ' + data.company.siret : '') + '</p>' +
            '<p>' + legalLine + '</p>' +
        '</div>'
    );
}
