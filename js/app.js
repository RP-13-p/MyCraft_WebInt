document.addEventListener('DOMContentLoaded', () => {
    const menuBtn    = document.getElementById('menu-btn');
    const sidebar    = document.getElementById('sidebar');
    const profileBtn = document.getElementById('profile-btn');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
    }

});