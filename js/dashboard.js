document.addEventListener('DOMContentLoaded', () => {

    function fmtEuro(amount) {
        return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }

    function isThisMonth(dateStr) {
        if (!dateStr || dateStr === '(sans date)') return false;
        const n = new Date();
        const d = new Date(dateStr);
        return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }

    const dateEl = document.getElementById('dash-date');
    const timeEl = document.getElementById('dash-time');

    function updateClock() {
        const n = new Date();
        dateEl.textContent = pad(n.getDate()) + '/' + pad(n.getMonth() + 1) + '/' + n.getFullYear();
        timeEl.textContent = pad(n.getHours()) + 'h' + pad(n.getMinutes());
    }

    updateClock();
    setInterval(updateClock, 60000);

    const invoices = loadData('mycraft_invoices', []);

    const revenue = invoices
        .filter(inv => inv.status === 'Payée' && isThisMonth(inv.date))
        .reduce((sum, inv) => sum + (parseFloat(inv.totalTtc) || 0), 0);

    const profit = invoices
        .filter(inv => inv.status === 'Payée' && isThisMonth(inv.date))
        .reduce((sum, inv) => sum + (parseFloat(inv.profit) || 0), 0);

    const interventions = invoices.filter(inv => inv.status === 'Payée' && isThisMonth(inv.date)).length;

    document.getElementById('dash-revenue').textContent = fmtEuro(revenue);
    document.getElementById('dash-interventions').textContent = interventions;

    const profitEl = document.getElementById('dash-profit');
    profitEl.textContent = (profit >= 0 ? '+ ' : '') + fmtEuro(profit);
});
