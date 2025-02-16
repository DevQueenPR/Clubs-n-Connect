document.addEventListener('DOMContentLoaded', function() {
    let role = sessionStorage.getItem('role');
    
    if (role === 'super_admin') {
        // Show all relevant content for super_admin
        document.getElementById('navbar').style.display = 'block';
        document.getElementById('offcanvas').style.display = 'block';
        document.getElementById('sidebarToggler').style.display = 'block';
        document.getElementById('adminAccordion').style.display = 'block';
        document.getElementById('footer').style.display = 'block';
    } else {
        // Redirect if the role is not super_admin
        Swal.fire({
            icon: 'error', // Error icon
            title: 'Acceso Denegado',
            text: 'No tienes acceso a esta página, Favor de hacer login.',
            confirmButtonText: 'OK',
        }).then(() => {
            // Redirect to login page after the user clicks "OK"
            window.location.href = '/login.html';
        });
    }
});


//------------------------------------------------------//

// Admin Administration reference js
// Fetch admins functionality

//------------------------------------------------------//


document.addEventListener('DOMContentLoaded', function() {
    // Function to populate dropdown with admins
    function populateAdminDropdown(admins, dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.innerHTML = ''; // Clear previous options
            admins.forEach(admin => {
                const option = document.createElement('option');
                option.value = admin.id;
                option.textContent = admin.username;
                dropdown.appendChild(option);
            });
        }
    }

    // Function to fetch and display admins
    async function fetchAdmins() {
        try {
            const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_admins'); // Replace with your actual API URL
            const admins = await response.json();

            // Populate the table with admins
            const tableBody = document.getElementById('adminTableBody');
            if (tableBody) {
                tableBody.innerHTML = ''; // Clear any previous data
                admins.forEach(admin => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${admin.username}</td>
                        <td>${admin.role}</td>
                        <td>${admin.association_title || 'N/A'}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            // Populate dropdowns
            populateAdminDropdown(admins, 'adminSelect');  // For reset password
            populateAdminDropdown(admins, 'adminDropdown'); // For delete
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    }

    // Call fetchAdmins on DOM load
    fetchAdmins();
});


//------------------------------------------------------//

// Admin Administration reference js
// Create admins functionality

//------------------------------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    async function handleAdminFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(document.getElementById('createAdminForm'));
        const adminPassword = formData.get('adminPassword'); // Get the admin password
        const confirmAdminPassword = document.getElementById('confirmAdminPassword').value; // Get the confirmation password

        // Check if passwords match
        if (adminPassword !== confirmAdminPassword) {
            Swal.fire({
                icon: 'error', // Ícono de error
                title: 'Error',
                text: '¡Las contraseñas no coinciden!', // Mensaje en español
                toast: true, // Estilo toast
                position: 'top-right', // Posición del toast
                showConfirmButton: false, // Elimina el botón
                timer: 3000, // Tiempo visible (3 segundos)
                timerProgressBar: true // Barra de progreso visual
            });
            return; // Stop form submission
        }

        const data = {
            admin_username: formData.get('adminUsername'),
            admin_password: adminPassword, // Use the password directly
            user_type: formData.get('userType'),
            association_id: formData.get('userType') === 'association_admin' ? formData.get('associationId') : null
        };

        console.log(data); // Debugging: Log data to check its structure
        await submitData(data, '/api/new_admin');
    }

    async function submitData(data, endpoint) {
        try {
            const response = await fetch(`https://ot1.ojedatech.com/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Admin creado exitosamente',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000, // Automatically close after 3 seconds
                timerProgressBar: true,
            });
            document.getElementById('createAdminForm').reset();
            
        } catch (error) {
            Swal.fire({
                icon: 'error', // Ícono de error
                title: 'Error',
                text: 'Error: ' + error.message, // Mensaje con el error
                toast: true, // Estilo toast
                position: 'top-right', // Posición del toast
                showConfirmButton: false, // Sin botón de confirmación
                timer: 3000, // Tiempo visible
                timerProgressBar: true // Barra de progreso visual
            });
            
        }
    }

    async function fetchAssociations() {
        try {
            const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_associations');
            const associations = await response.json();

            const associationDropdown = document.getElementById('associationId');
            associationDropdown.innerHTML = '<option value="" disabled selected>Select an association</option>';

            associations.forEach(assoc => {
                const option = document.createElement('option');
                option.value = assoc.id;
                option.textContent = assoc.title;
                associationDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to fetch associations:', error);
            const associationDropdown = document.getElementById('associationId');
            associationDropdown.innerHTML = '<option value="" disabled>Error loading associations</option>';
        }
    }

    const userTypeDropdown = document.getElementById('userType');
    const associationDropdownContainer = document.getElementById('associationDropdownContainer');

    userTypeDropdown.addEventListener('change', (event) => {
        if (event.target.value === 'association_admin') {
            associationDropdownContainer.style.display = 'block'; // Show the association dropdown
            fetchAssociations(); // Fetch associations when this option is selected
        } else {
            associationDropdownContainer.style.display = 'none'; // Hide the association dropdown
        }
    });

    const createAdminForm = document.getElementById('createAdminForm');
    if (createAdminForm) {
        createAdminForm.addEventListener('submit', handleAdminFormSubmit);
    } else {
        console.warn('Form with ID "createAdminForm" not found');
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const roleDropdown = document.getElementById("resetRoleSelect");
    const adminDropdown = document.getElementById("resetAdminSelect");
    const resultMessage = document.getElementById("resetResultMessage");

    // Fetch admins when the role changes
    roleDropdown.addEventListener("change", async () => {
        const selectedRole = roleDropdown.value;
        adminDropdown.innerHTML = '<option value="" disabled selected>-- Select Admin --</option>'; // Clear previous options

        if (!selectedRole) return; // Exit if no role is selected

        // Fetch admins based on the selected role
        try {
            const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_admins');
            const admins = await response.json();

            const filteredAdmins = admins.filter(admin =>
                selectedRole === "admin" ? admin.role === "association_admin" : admin.role === "super_admin"
            );

            if (filteredAdmins.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No ${selectedRole === "admin" ? "Admins" : "Super Admins"} found.`,
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                return;
            }

            filteredAdmins.forEach(admin => {
                const option = document.createElement("option");
                option.value = admin.id;
                option.textContent = admin.username;
                adminDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching admins:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error al cargar administradores.",
                confirmButtonText: 'Aceptar',
            });
        }
    });

    // Form submission handler for resetting password
    document.getElementById("resetPasswordForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const adminId = adminDropdown.value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate admin selection
        if (!adminId) {
            Swal.fire({
                icon: 'error',
                title: '¡Por favor selecciona un admin!',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            
            return;
        }

        // Validate password matching
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: '¡Las contraseñas no coinciden!',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            
            return;
        }

        // Validate non-empty password fields
        if (!newPassword || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: '¡Los campos de contraseña no pueden estar vacíos!',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            
            return;
        }

        // Send the request to reset the password
        try {
            const response = await fetch('https://ot1.ojedatech.com/api/api/reset_admin_password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adminId, newPassword }),
            });

            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña restablecida exitosamente!',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });

            document.getElementById('resetPasswordForm').reset();
            
        } catch (error) {
            console.error("Error resetting password:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al restablecer la contraseña.',
                confirmButtonText: 'Aceptar'
            });
            
        }
    });
});




//------------------------------------------------------//

// Admin Administration reference js
// Delete admin functionality

//------------------------------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    const roleDropdown = document.getElementById('roleDropdown');
    const deleteAdminDropdown = document.getElementById('deleteAdminDropdown'); // Updated ID
    const statusMessage = document.getElementById('statusMessage');

    // Clear and set default option for delete admin dropdown when page loads
    deleteAdminDropdown.innerHTML = '<option value="" disabled selected>-- Select User --</option>';

    // Fetch users based on role selection
    roleDropdown.addEventListener('change', async () => {
        const selectedRole = roleDropdown.value;
        deleteAdminDropdown.innerHTML = '<option value="" disabled selected>-- Select User --</option>'; // Reset dropdown to default option
        statusMessage.textContent = ''; // Clear any status messages

        if (!selectedRole) {
            statusMessage.textContent = 'Please select a role.';
            return;
        }

        // Fetch users based on the selected role
        try {
            const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_admins');
            const admins = await response.json();

            // Adjust role filtering to match your database values
            const filteredAdmins = admins.filter(admin => {
                if (selectedRole === 'admin') {
                    return admin.role === 'association_admin';
                } else if (selectedRole === 'super_admin') {
                    return admin.role === 'super_admin';
                }
                return false;
            });

            if (filteredAdmins.length === 0) {
                statusMessage.textContent = `No ${selectedRole.replace('_', ' ')}s found.`;
                return;
            }

            // Populate the admin dropdown
            filteredAdmins.forEach(admin => {
                const option = document.createElement('option');
                option.value = admin.id;
                option.textContent = admin.username;
                deleteAdminDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            statusMessage.textContent = 'Failed to load users.';
        }
    });

    // Delete admin when delete button is clicked
    document.getElementById('deleteButton').addEventListener('click', async () => {
        const adminId = deleteAdminDropdown.value;

        if (!adminId) {
            statusMessage.textContent = 'Please select a user to delete.';
            return;
        }

        try {
            const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_admin/${adminId}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error,
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminación realizada exitosamente',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000, // Automatically close after 3 seconds
                    timerProgressBar: true,
                });

                // Remove deleted admin from dropdown
                deleteAdminDropdown.querySelector(`option[value="${adminId}"]`).remove();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar al usuario.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});
