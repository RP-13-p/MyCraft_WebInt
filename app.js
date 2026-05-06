document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const profileBtn = document.getElementById('profile-btn');

    // Manage the sidebar toggle
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close the sidebar if clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Redirect to settings.html when clicking the profile button
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
    }
});