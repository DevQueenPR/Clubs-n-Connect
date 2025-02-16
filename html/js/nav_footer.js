document.addEventListener("DOMContentLoaded", function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});

document.addEventListener('DOMContentLoaded', function() {
    // Select the container element where the sidebar will be loaded
    const sidebarContainer = document.getElementById('sidebarContainer');
    
    // Use fetch to load the sidebar content
    fetch('sidebar.html')
        .then(response => response.text())
        .then(html => {
            // Insert the sidebar content into the container
            sidebarContainer.innerHTML = html;

            // Add logout functionality
            const logoutButtons = document.querySelectorAll('.logoutBtn');
            logoutButtons.forEach(function(logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('role');
                    window.location.href = '/index.html';
                });
            });
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });
});
