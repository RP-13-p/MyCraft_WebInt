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
