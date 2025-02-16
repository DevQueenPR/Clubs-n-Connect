

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Por favor ingrese ambos, nombre de usuario y contraseña.',
            toast: true, // Hace que sea una notificación tipo toast
            position: 'top-end', // Posición en la esquina superior derecha
            showConfirmButton: false, // No se muestra el botón
            timer: 3000, // Desaparece después de 3 segundos
            timerProgressBar: true, // Muestra una barra de progreso del tiempo
            background: '#f39c12', // Fondo opcional: color amarillo
        });
        
        return;
    }

    try {
        const response = await fetch('https://ot1.ojedatech.com/api/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        // Check if the response is a valid JSON
        if (!response.ok) {
            const text = await response.text();
            console.error("Server Response:", text); // Log for debugging
            Swal.fire({
                icon: 'error',
                title: 'Error al Iniciar Sesión',
                text: 'Falló el inicio de sesión: ' + response.status,
                confirmButtonText: 'OK', // El usuario debe hacer clic en "OK" para cerrar
            });
            
            return;
        }

        const data = await response.json();

        if (data.message === "Login successful") {
            // Save both the user data and role in sessionStorage
            sessionStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("role", data.role); // Ensure role is also set
            sessionStorage.setItem("access", data.access);

            // Redirect based on the role
            if (data.role === "super_admin") {
                window.location.href = "entity_management.html";
            } else if (data.role === "association_admin") {
                window.location.href = "entity_management.html";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Rol no reconocido',
                    text: 'Por favor contacte support.',
                    confirmButtonText: 'OK',
                });
                
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: data.message || 'Inicio de sesión fallido.',
                confirmButtonText: 'OK',
            });
            
        }
    } catch (error) {
        console.error("Error during login:", error);
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error',
            text: 'Por favor intente de nuevo.',
            confirmButtonText: 'OK',
        });
        
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function () {
        // Clear the session data
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');

        // Redirect to index.html (or your login page)
        window.location.href = '/index.html';
    });
});
