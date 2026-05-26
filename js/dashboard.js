document.addEventListener('DOMContentLoaded', () => {

    function pad(n) { return String(n).padStart(2, '0'); }

    // French locale formatting: "1 234,56 €"
    function formatEuro(amount) {
        return amount.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' €';
    }

    // Returns true when a YYYY-MM-DD date string belongs to the current month.
    function isThisMonth(dateStr) {
        if (!dateStr || dateStr === '(sans date)') return false;
        const n = MyCraft.now();
        const d = new Date(dateStr);
        return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }

    // --- Live clock ---
    const dateEl = document.getElementById('dash-date');
    const timeEl = document.getElementById('dash-time');

    function updateClock() {
        const n = MyCraft.now();
        dateEl.textContent = pad(n.getDate()) + '/' + pad(n.getMonth() + 1) + '/' + n.getFullYear();
        timeEl.textContent = pad(n.getHours()) + 'h' + pad(n.getMinutes());
    }

    updateClock();
    setInterval(updateClock, 60000); // refresh every minute

    // --- Metrics ---
    const invoices = loadData('mycraft_invoices', []);

    // Revenue: sum of totalTtc for paid invoices this month
    const revenue = invoices
        .filter(inv => inv.status === 'Payée' && isThisMonth(inv.date))
        .reduce((sum, inv) => sum + (parseFloat(inv.totalTtc) || 0), 0);

    // Profit: sum of the profit field on invoices this month
    const profit = invoices
        .filter(inv => isThisMonth(inv.date))
        .reduce((sum, inv) => sum + (parseFloat(inv.profit) || 0), 0);

    // Interventions: total number of invoices this month
    const interventions = invoices.filter(inv => isThisMonth(inv.date)).length;

    document.getElementById('dash-revenue').textContent       = formatEuro(revenue);
    document.getElementById('dash-interventions').textContent = interventions;

    const profitEl = document.getElementById('dash-profit');
    profitEl.textContent = (profit >= 0 ? '+ ' : '') + formatEuro(profit);
});
