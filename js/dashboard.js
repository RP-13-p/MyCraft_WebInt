document.addEventListener('DOMContentLoaded', () => {

    const now          = new Date();
    const thisMonth    = now.getMonth();
    const thisYear     = now.getFullYear();

    // Returns true when a YYYY-MM-DD date string belongs to the current month.
    function isThisMonth(dateStr) {
        if (!dateStr || dateStr === '(sans date)') return false;
        const d = new Date(dateStr);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }

    // French locale formatting: "1 234,56 €"
    function formatEuro(amount) {
        return amount.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' €';
    }

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
