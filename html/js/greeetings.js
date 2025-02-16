document.addEventListener('DOMContentLoaded', function () {
    // Fetch the user from sessionStorage
    let user;
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.error("Error parsing user data:", e);
        user = null;
    }

    // If user data is missing, redirect to login
    if (!user) {
        Swal.fire({
            icon: 'error',
            title: 'Datos de usuario no encontrados',
            text: 'Por favor, inicie sesión.',
            showConfirmButton: false,  // Remove the confirm button
            timer: 3000  // Auto-close after 3 seconds
        }).then(() => {
            window.location.href = '/login.html'; // Redirect to login page after alert closes
        });
        return;
    }

    // Update the greeting message with the username
    const greetingMessage = document.getElementById('greetingMessage');
    if (greetingMessage) {
        greetingMessage.textContent = `Bienvenido, ${user.username}`;
    } else {
        console.error("Greeting message element not found in the DOM.");
    }

    // Optionally, verify role if needed
    const role = sessionStorage.getItem('role');
    console.log("Role:", role);
});
