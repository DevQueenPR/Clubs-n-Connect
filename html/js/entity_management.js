//------------------------------------------------------//

// Admin dashboard reference js
// Total associations and clubs functionality

//------------------------------------------------------//


document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display dashboard statistics using the test API
    $.ajax({
        url: 'https://ot1.ojedatech.com/api/api/get_dashboard_statistics',
        type: 'GET',
        success: function (response) {
            console.log("Dashboard statistics:", response); // Verify in console
            
            // Update the elements in HTML with the correct keys
            $('#totalAssociations').text(response.totalAssociations);
            $('#totalClubs').text(response.totalClubs);
        },
        error: function (xhr) {
            console.error("Error fetching dashboard statistics:", xhr);
        }
    });

    // Add click events to cards
    document.querySelector('.card.border-primary').addEventListener('click', () => {
        console.log("Fetching associations...");
        showDataByClassification(1); // Classification 1: Associations
    });

    document.querySelector('.card.border-success').addEventListener('click', () => {
        console.log("Fetching clubs...");
        showDataByClassification(2); // Classification 2: Clubs
    });
});

// Generalized function to fetch and display data by classification
function showDataByClassification(classification) {
    const apiUrl = "https://ot1.ojedatech.com/api/api/get_all_associations";
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Filter data based on classification
            const filteredData = data.filter(item => item.clasification === classification);
            const tableBody = document.getElementById('associationsTableBody');
            tableBody.innerHTML = '';

            if (filteredData.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No data available</td></tr>`;
            } else {
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${item.logo}" alt="Logo" style="width: 50px; height: 50px;"></td>
                        <td>${item.title}</td>
                        <td>${item.description}</td>
                        <td>${item.Facebook || 'N/A'}</td>
                        <td>${item.Instagram || 'N/A'}</td>
                        <td>${item.X || 'N/A'}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            // Display the table
            document.getElementById('associationsTable').style.display = 'table';
        })
        .catch(error => console.error('Error fetching data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    // Fetch the user and role from sessionStorage
    let user;
    let role;

    // Safely get the user from sessionStorage
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.error("Error parsing user data:", e);
        user = null;
    }

    // Get the role from sessionStorage
    role = sessionStorage.getItem('role');

    console.log("User from sessionStorage:", user);  // Debugging: Check user data
    console.log("Role from sessionStorage:", role);  // Debugging: Check role data

    // Redirect to login if user or role is missing
    if (!user || !role) {
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

    // Check visibility for ViewAssociationContainer
    const viewAssociationContainer = document.getElementById('ViewAssociationContainer');

    if (viewAssociationContainer) {
        console.log("ViewAssociationContainer found in the DOM"); // Debugging: Ensure container is found

        // If user is not 'super_admin', hide the container
        if (role !== 'super_admin') {
            console.log("Role is not super_admin, hiding ViewAssociationContainer.");  // Debugging
            viewAssociationContainer.style.display = 'none';  // Hide for non-super admins
        } else {
            console.log("Role is super_admin, displaying ViewAssociationContainer.");  // Debugging
            viewAssociationContainer.style.display = 'block';  // Show for super_admin
        }
    } else {
        console.error("ViewAssociationContainer not found in the DOM");
    }

    // Check if stats cards exist in the DOM
    const statsCards = document.getElementById('statsCards');
    if (!statsCards) {
        console.error("Stats Cards element not found in the DOM");
    } else {
        console.log("Stats Cards element found in the DOM");

        // If the role is not 'super_admin', hide the stats cards
        if (role !== 'super_admin') {
            console.log("Role is not super_admin, hiding stats cards.");  // Debugging: Log if hiding stats cards
            statsCards.style.display = 'none'; // Hide the stats cards for non-super admins
        } else {
            console.log("Role is super_admin, displaying stats cards.");  // Debugging: Log if showing stats cards
            statsCards.style.display = 'block'; // Ensure stats cards are visible for super_admin
        }
    }
});




//------------------------------------------------------//

// Admin associacion and club page reference js
// Toggles the sidebar functionality
//------------------------------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    // Get user role from sessionStorage
    const role = sessionStorage.getItem('role');
    console.log("Role from sessionStorage:", role); // Debugging: Check role data

    // Get the sidebar and toggler elements
    const sidebar = document.getElementById('offcanvas');
    const toggler = document.getElementById('sidebarToggler');

    if (!sidebar || !toggler) {
        console.error("Sidebar or toggler not found in the DOM.");
        return;
    }

    // Ensure they are hidden by default
    sidebar.style.display = 'none';
    toggler.style.display = 'none';

    // Show the sidebar and toggler only if the role is 'super_admin'
    if (role === 'super_admin') {
        console.log("Role is super_admin, showing the sidebar and toggler.");
        sidebar.style.display = ''; // Reset to default display (block or flex depending on CSS)
        toggler.style.display = ''; // Reset to default display (inline-block for buttons)
    } else {
        console.log("Role is not super_admin, keeping the sidebar and toggler hidden.");
    }
});


//------------------------------------------------------//

// Admin associacion and club page reference js
// Create association or club functionality

//------------------------------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    async function handleAssociationAdminFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        console.log("Formulario enviado");
        
        const formData = new FormData(document.getElementById('createAssociationAdminForm'));
        const password = formData.get('adminPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Check if passwords match
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: '¡Las contraseñas no coinciden!',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            
            return; // Stop form submission
        }
        

        const data = {
            title: formData.get('title')?.trim() || null, 
            clasification: parseInt(formData.get('clasification')) || null,
            admin_username: formData.get('adminUsername'),
            admin_password: formData.get('adminPassword'),
            user_type: 'association_admin', // Explicitly set user_type as 'association_admin'
            association_id: formData.get('associationId') || 0 // Adjust if needed
        };

        console.log(data); // Debugging: Log data to check its structure
        await submitData(data, '/api/new_association');
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
    
            // Verifica si el resultado contiene un error relacionado con la existencia de la asociación
            if (result.error && result.error.includes('already exists')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Asociación ya existe',
                    text: 'La asociación con este nombre ya está registrada.',
                    confirmButtonText: 'Aceptar'
                });
            } else if (result.message) {
                // Solo muestra el Swal de éxito cuando la asociación se crea correctamente
                document.getElementById('createAssociationAdminForm').reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Asociación/club creada exitosamente',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000, // Automáticamente se cierra después de 3 segundos
                    timerProgressBar: true,
                })
            }
    
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al procesar la solicitud.',
                confirmButtonText: 'Aceptar'
            });
        }
    }
    

    const createAssociationAdminForm = document.getElementById('createAssociationAdminForm');
    if (createAssociationAdminForm) {
        createAssociationAdminForm.addEventListener('submit', handleAssociationAdminFormSubmit);
    } else {
        console.warn('Form with ID "createAssociationAdminForm" not found');
    }

    // Now, handle role-based visibility for the form container
    let user;
    let role;

    // Safely get user data from sessionStorage
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.error("Error parsing user data:", e);
        user = null;
    }

    // Get role from sessionStorage
    role = sessionStorage.getItem('role');

    console.log("User from sessionStorage:", user);  // Debugging: Check user data
    console.log("Role from sessionStorage:", role);  // Debugging: Check role data

    // Get the form container by its new ID
    const formContainer = document.getElementById('CreateAssociationContainer');

    if (formContainer) {
        console.log("Form container found in the DOM"); // Debugging: Ensure form container is found
    } else {
        console.error("Form container not found in the DOM");
    }

    // If user is not 'super_admin', hide the form container
    if (role !== 'super_admin') {
        console.log("Role is not super_admin, hiding the form.");  // Debugging
        formContainer.style.display = 'none';  // Hide form for non-super admins
    } else {
        console.log("Role is super_admin, displaying the form.");  // Debugging
        formContainer.style.display = 'block';  // Ensure form is visible for super_admin
    }
});


//------------------------------------------------------//

// Admin associacion and club page reference js
// Edit association or club functionality
// Select filter

//------------------------------------------------------//

async function fetchAndPopulateAssociations(clasification) {
    try {
        const role = sessionStorage.getItem("role");
        const user = JSON.parse(sessionStorage.getItem("user"));
        const associationSelect = document.getElementById('associationSelect');
        const filterContainer = document.getElementById('filterContainer');
        const classificationHidden = document.getElementById('classificationHidden');

        if (role === "association_admin") {
            // Lock the dropdown and pre-fill with the user's association
            const associationId = user.associations_clubs_id; // Assuming `associations_clubs_id` holds the correct ID

            filterContainer.style.display = "none"; // Hide the filter dropdown
            associationSelect.innerHTML = ''; // Clear existing options

            // Fetch association details for locked ID
            const response = await fetch(`https://ot1.ojedatech.com/api/api/get_association_by_id/${associationId}`);
            const data = await response.json();

            const lockedOption = document.createElement("option");
            lockedOption.value = associationId;
            lockedOption.textContent = data.title || "Asociación/Club"; // Use fetched name
            associationSelect.appendChild(lockedOption);

            associationSelect.disabled = true; // Lock the selection
            associationSelect.value = associationId; // Ensure the correct value is set

            // Populate classificationHidden and form
            classificationHidden.value = data.clasification || "";
            await populateForm(associationId); // Automatically populate the form

            // Fetch and display broadcasts for the locked association
            console.log(`[DEBUG] Fetching broadcasts for association ID: ${associationId}`);
            await fetchAndDisplayBroadcasts(associationId);

        } else if (role === "super_admin") {
            // Show filter and populate dropdown options dynamically
            filterContainer.style.display = "block";
            associationSelect.disabled = false;

            const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_associations');
            const data = await response.json();

            // Filter associations or clubs based on classification if provided
            const filtered = clasification ? data.filter(item => item.clasification == clasification) : data;

            // Populate the select dropdown with filtered results
            associationSelect.innerHTML = '<option value="">Seleccionar...</option>';
            filtered.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.title;
                associationSelect.appendChild(option);
            });

            // Reset nested sections visibility when no selection
            toggleNestedSections();
        }
    } catch (error) {
        console.error('Error fetching associations:', error);
        // Swal.fire({
        //     icon: 'error',
        //     title: 'Error',
        //     text: 'No se pudieron cargar las asociaciones o clubes.',
        //     confirmButtonText: 'OK'
        // });
        
    }
}


// Triggered when the filter changes (super_admin only)
document.getElementById('filter').addEventListener('change', function () {
    const clasification = this.value;
    fetchAndPopulateAssociations(clasification);
});

// Page initialization
document.addEventListener('DOMContentLoaded', function () {
    const clasification = document.getElementById('filter').value || ""; // Default to no classification filter
    fetchAndPopulateAssociations(clasification);
});

// // Populate form and nested sections based on selection
// async function populateForm(associationId) {
//     try {
//         const response = await fetch(`https://ot1.ojedatech.com/api/api/get_association_by_id/${associationId}`);
//         const data = await response.json();

//         // Populate form fields
//         document.getElementById('updateTitle').value = data.title;
//         document.getElementById('description').value = data.description;
//         document.getElementById('facebook').value = data.Facebook;
//         document.getElementById('instagram').value = data.Instagram;
//         document.getElementById('x').value = data.X;

//         // Set classification in hidden input
//         document.getElementById('classificationHidden').value = data.clasification;

//         // Display the current logo
//         const folderName = data.title.replace(/ /g, '_');
//         const logoUrl = `https://ot1.ojedatech.com/api/uploads/${folderName}/logo/logo.png`;
//         const imgPreview = document.getElementById('imagePreview');
//         imgPreview.src = logoUrl;
//         imgPreview.classList.remove('d-none');

//         // Automatically show nested sections
//         visibilityState = true;
//         toggleNestedSections();
//     } catch (error) {
//         console.error('Error populating form:', error);
//         // Swal.fire({
//         //     icon: 'error',
//         //     title: 'Error',
//         //     text: 'No se pudieron cargar los datos de las asociaciones o clubes.',
//         //     confirmButtonText: 'OK'
//         // });
        
//     }
// }

// Function to populate form and set up preview
async function populateForm(associationId) {
    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_association_by_id/${associationId}`);
        const data = await response.json();

        // Populate form fields
        document.getElementById('updateTitle').value = data.title;
        document.getElementById('description').value = data.description;
        document.getElementById('facebook').value = data.Facebook;
        document.getElementById('instagram').value = data.Instagram;
        document.getElementById('x').value = data.X;

        // Set classification in hidden input
        document.getElementById('classificationHidden').value = data.clasification;

        // Display the current logo
        const folderName = data.title.replace(/ /g, '_');
        const logoUrl = `https://ot1.ojedatech.com/api/uploads/${folderName}/logo/logo.png`;
        const imgPreview = document.getElementById('imagePreview');
        imgPreview.src = logoUrl;
        imgPreview.classList.remove('d-none');

        // Automatically show nested sections
        visibilityState = true;
        toggleNestedSections();
    } catch (error) {
        console.error('Error populating form:', error);
    }
}

// Event listener for logo image upload
document.getElementById('logo_image').addEventListener('change', function () {
    const file = this.files[0];
    const imgPreview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgPreview.src = e.target.result; // Set preview source
            imgPreview.classList.remove('d-none'); // Ensure it's visible
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
    }
});




//------------------------------------------------------//

// Admin associacion and club page reference js
// Edit association or club functionality
// Toggle visibility of filters

//------------------------------------------------------//


// Function to toggle the visibility of the entire nested content
function toggleNestedSections() {
    const nestedContentSection = document.getElementById('nestedContentSection');
    nestedContentSection.style.display = visibilityState ? 'block' : 'none'; // Show or hide based on visibilityState
}

// Function to handle changes in the association select dropdown
function handleAssociationSelectionChange() {
    const associationSelect = document.getElementById('associationSelect');
    const selectedAssociation = associationSelect.value;

    // Check if an association is selected
    visibilityState = !!selectedAssociation; // Set visibility based on whether an association is selected

    toggleNestedSections(); // Update the visibility of the nested sections
}

// Event listener to handle changes in the association selection
document.getElementById('associationSelect').addEventListener('change', handleAssociationSelectionChange);

// Fetch associations when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initially no association is selected, so we hide the nested sections
    toggleNestedSections();
});


//------------------------------------------------------//

// Admin associacion and club page reference js
// Edit association or club functionality
// Fetch the basic data  

//------------------------------------------------------//

// Populate form with data of the selected association/club
document.getElementById('associationSelect').addEventListener('change', async function () {
    const associationId = this.value;
    if (associationId) {
        await populateForm(associationId);
        await fetchAndDisplayBroadcasts(associationId); // Call to fetch and display broadcasts
    }
});

//------------------------------------------------------//

// Admin associacion and club page reference js
// Edit association or club functionality
// Populate form of basic data

//------------------------------------------------------//


// Save updates on form submit
document.getElementById('updateForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const associationId = document.getElementById('associationSelect').value;

    const formData = new FormData();
    formData.append('title', document.getElementById('updateTitle').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('Facebook', document.getElementById('facebook').value);
    formData.append('Instagram', document.getElementById('instagram').value);
    formData.append('X', document.getElementById('x').value);

    // Add the classification value here
    const classificationValue = document.getElementById('classificationHidden').value; // This assumes you have a hidden input
    formData.append('clasification', classificationValue); // Correctly append it

    const logoImage = document.getElementById('logo_image').files[0];
    if (logoImage) {
        formData.append('logo_image', logoImage);
    }

    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/update_association/${associationId}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Actualización Exitosa!',
                text: 'La asociación se actualizó correctamente.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            
        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo actualizar la asociación: ${errorData.message}`,
                confirmButtonText: 'OK'
            });
            
        }
    } catch (error) {
        console.error('Error updating association:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo actualizar la asociación`,
            confirmButtonText: 'OK'
        });
        
    }
});

//------------------------------------------------------//

// Admin associacion and club page reference js
// Edit association or club functionality
// New broadcast 

//------------------------------------------------------//

// Save new broadcast
document.getElementById('saveNewBroadcast').addEventListener('click', async () => {
    const title = document.getElementById('broadcastTitle').value;
    const description = document.getElementById('broadcastDescription').value;
    const associationId = document.getElementById('associationSelect').value;

      

    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/new_broadcast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                associations_clubs_id: associationId,
            }),
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Broadcast creado exitosamente!',
                toast: true,
                position: 'top-end', // Place the toast in the top-right corner
                showConfirmButton: false, // Hide the confirm button
                timer: 2000, // Auto-close after 2 seconds
                timerProgressBar: true // Show a progress bar
            });
            
            
            // Refresh broadcasts
            await fetchAndDisplayBroadcasts(associationId);
            // Close the modal
            $('#newBroadcastModal').modal('hide');
        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error creando el broadcast: ${errorData.error}`,
                confirmButtonText: 'OK'
            });
            
        }
    } catch (error) {
        console.error('Error creating broadcast:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error creando el broadcast`,
            confirmButtonText: 'OK'
        });
        
    }
});
    // Clear the Broadcast modal inputs when opened
document.getElementById('newBroadcastModal').addEventListener('shown.bs.modal', () => {
    document.getElementById('broadcastTitle').value = '';
    document.getElementById('broadcastDescription').value = '';
    //document.getElementById('associationSelect').value = ''; // Reset dropdown, if necessary
});

   // Clear the Event modal inputs when opened
    document.getElementById('eventModal').addEventListener('hide.bs.modal', () => {
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventDescription').value = '';
    });
//------------------------------------------------------//

// Admin associacion and club page reference js
// Edit association or club functionality
// Edits and deletes broadcasts

//------------------------------------------------------//

// Function to view event details (example handler for the "Ver" button)
// function viewEvent(eventId) {
//     alert(`Funcionalidad para ver detalles del evento con ID: ${eventId}`);
// }

// Function to handle save button click
document.getElementById('saveEventBtn').addEventListener('click', async function (event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario

    // Captura los datos del formulario
    const eventTitle = document.getElementById('eventTitle').value.trim();
    const eventDate = document.getElementById('eventDate').value.trim();
    const eventDescription = document.getElementById('eventDescription').value.trim();
    const eventId = document.getElementById('eventId').value; // ID del evento para editar (si existe)

console.log(eventTitle);
console.log(eventDate);
console.log(eventDescription);
console.log(eventId);

    // Obtén el ID de la asociación seleccionada
    const associationId = document.getElementById('associationSelect').value;

    // Validación básica de campos
    if (!eventTitle || !eventDate || !eventDescription) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos obligatorios.',
        });
        return;
    }

    // Construir el objeto de datos
    const eventData = {
        event_title: eventTitle,
        event_date: eventDate,
        description: eventDescription,
        association_id: associationId, // Incluye el ID de la asociación
    };

    try {
        // Determinar si es una creación o una edición
        const response = await fetch(eventId ? `https://ot1.ojedatech.com/api/api/update_event/${eventId}` : `https://ot1.ojedatech.com/api/api/new_event`, {
            method: eventId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Error al guardar el evento');
        }
        document.getElementById('eventId').value = '';
        const result = await response.json();

       // Mostrar notificación de éxito (como toast)
        Swal.fire({
            icon: 'success',
            title: '¡Evento creado exitosamente!',
            toast: true, // Hace que sea un toast (notificación flotante)
            position: 'top-end', // Aparece en la esquina superior derecha
            showConfirmButton: false, // No muestra el botón "OK"
            timer: 3000, // Desaparece automáticamente después de 3 segundos
            timerProgressBar: true // Muestra una barra de progreso
        });


        // Refresca la tabla de eventos
        await loadCalendarEvents();

        // Limpia el formulario y cierra el modal
        document.getElementById('eventForm').reset();
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
        modalInstance.hide();
    } catch (error) {
        // console.error('Error al guardar el evento:', error);
        // Swal.fire({
        //     icon: 'error',
        //     title: 'Error',
        //     text: error.message || 'No se pudo guardar el evento. Intenta nuevamente.',
        // });
    }
});



async function fetchAndDisplayBroadcasts(associationId) {
    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_broadcast/${associationId}`);
        if (!response.ok) {
            throw new Error(`Error fetching broadcasts: ${response.statusText}`);
        }
        const broadcasts = await response.json();

        const broadcastsContainer = document.getElementById('broadcastsContainer');
        broadcastsContainer.innerHTML = ''; // Clear previous content

        // Create table structure
        const table = document.createElement('table');
        table.className = 'table table-striped';
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Día</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        
        broadcasts.forEach(broadcast => {
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${broadcast.title}</td>
            <td class="broadcast-description">${broadcast.description}</td>
            <td>${broadcast.broadcast_date}</td>
            <td>${broadcast.broadcast_time}</td>
            <td class="text-center">
                <button 
                    class="btn btn-warning btn-sm edit-broadcast" 
                    data-id="${broadcast.id}" 
                    data-bs-toggle="modal" 
                    data-bs-target="#editBroadcastModal">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button 
                    class="btn btn-danger btn-sm delete-broadcast" 
                    data-id="${broadcast.id}">
                    <i class="fas fa-trash-alt"></i> Borrar
                </button>
            </td>
        `;
        

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        broadcastsContainer.appendChild(table);

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-broadcast').forEach(button => {
            button.addEventListener('click', async () => {
                const broadcastId = button.getAttribute('data-id');
                await deleteBroadcast(broadcastId);
            });
        });

        // Add event listeners for edit buttons
        document.querySelectorAll('.edit-broadcast').forEach(button => {
            button.addEventListener('click', () => {
                const broadcastId = button.getAttribute('data-id');
                const broadcastToEdit = broadcasts.find(b => b.id == broadcastId);

                document.getElementById('editBroadcastId').value = broadcastToEdit.id;
                document.getElementById('editBroadcastTitle').value = broadcastToEdit.title;
                document.getElementById('editBroadcastDescription').value = broadcastToEdit.description;
                document.getElementById('editBroadcastDate').textContent = broadcastToEdit.broadcast_date;
                document.getElementById('editBroadcastTime').textContent = broadcastToEdit.broadcast_time;
            });
        });

    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las data de los broadcasts',
            confirmButtonText: 'OK'
        });
        
    }
}


//------------------------------------------------------//

// Admin associacion and club page reference js
// Delete broadcast

//------------------------------------------------------//

async function deleteBroadcast(broadcastId) {
    // Confirm deletion
    const confirmation = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este broadcast? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', // Red for "delete"
        cancelButtonColor: '#6c757d', // Gray for "cancel"
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmation.isConfirmed) {
        try {
            const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_broadcast/${broadcastId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminación Exitosa',
                    text: '¡El Broadcast fue eliminado con éxito!',
                    toast: true, // Make it a toast notification
                    position: 'top-end', // Position at the top-right corner
                    showConfirmButton: false, // No confirm button
                    timer: 3000, // Automatically closes after 3 seconds
                    timerProgressBar: true, // Show a progress bar
                });

                const associationId = document.getElementById('associationSelect').value;
                fetchAndDisplayBroadcasts(associationId); // Refresh the broadcasts
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar el broadcast',
                    text: `No se pudo eliminar el broadcast: ${errorData.error}`,
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error deleting broadcast:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el broadcast.',
                confirmButtonText: 'OK'
            });
        }
    }
}


//------------------------------------------------------//

// Admin associacion and club page reference js
// Edits broadcasts

//------------------------------------------------------//

// Save edits to a broadcast
document.getElementById('saveEditBroadcast').addEventListener('click', async () => {
    const id = document.getElementById('editBroadcastId').value;
    const title = document.getElementById('editBroadcastTitle').value;
    const description = document.getElementById('editBroadcastDescription').value;

    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/update_broadcast/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Broadcast actualizado con éxito!',
                toast: true, // Make it a toast notification
                position: 'top-end', // Position at the top-right corner
                showConfirmButton: false, // No confirm button
                timer: 3000, // Automatically closes after 3 seconds
                timerProgressBar: true, // Progress bar to show countdown
            });
            
            const associationId = document.getElementById('associationSelect').value;
            await fetchAndDisplayBroadcasts(associationId); // Refresh broadcasts
            $('#editBroadcastModal').modal('hide'); // Close the modal
        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Failed to update broadcast',
                text: errorData.error || 'An error occurred while updating the broadcast.',
                confirmButtonText: 'OK', // Show "OK" button for the user to acknowledge
            });
            
        }
    } catch (error) {
        console.error('Error updating broadcast:', error);
        Swal.fire({
            icon: 'error',
            title: 'Failed to update broadcast.',
            text: 'An error occurred. Please try again.',
            confirmButtonText: 'OK', // Show "OK" button
        });
        
    }
});

// When edit button is clicked, populate the edit modal with broadcast data
document.querySelectorAll('.edit-broadcast').forEach(button => {
    button.addEventListener('click', () => {
        const broadcastId = button.getAttribute('data-id');
        const broadcastToEdit = broadcasts.find(b => b.id == broadcastId);

        document.getElementById('editBroadcastId').value = broadcastToEdit.id;
        document.getElementById('editBroadcastTitle').value = broadcastToEdit.title;
        document.getElementById('editBroadcastDescription').value = broadcastToEdit.description;
    });
});

//------------------------------------------------------//

// Admin associacion and club page reference js
// Fetch News 

//------------------------------------------------------//

document.getElementById('showNewsImagesBtn').addEventListener('click', function () {
    const associationId = document.getElementById('associationSelect').value; // Make sure this retrieves the correct value

    if (!associationId) {
        // Swal.fire({
        //     toast: true,
        //     position: 'top-end',
        //     icon: 'warning',
        //     title: 'Por favor selecciona una asociación o club.',
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true
        // });
        
        return; // Exit if no association is selected
    }

    // Fetch news images
    fetch(`https://ot1.ojedatech.com/api/api/get_news_by_id/${associationId}`) // Correctly use the variable
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Clear previous images
            const newsImagesContainer = document.getElementById('newsImagesContainer');
            newsImagesContainer.innerHTML = '';

            if (data.news_images && data.news_images.length > 0) {
                // Create and append image elements
                data.news_images.forEach(imageUrl => {
                    const colDiv = document.createElement('div');
                    colDiv.className = 'col-md-4 mb-3';
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.className = 'img-fluid';
                    img.alt = 'News Image';
                    colDiv.appendChild(img);
                    newsImagesContainer.appendChild(colDiv);
                });
            } else {
                newsImagesContainer.innerHTML = '<p>No news images found for this association.</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching news images:", error);
            const newsImagesContainer = document.getElementById('newsImagesContainer');
            newsImagesContainer.innerHTML = '<p>Error occurred while fetching images.</p>';
        });
});

//------------------------------------------------------//

// Admin associacion and club page reference js
// Adds image (upload)

//------------------------------------------------------//

document.getElementById('submitImageBtn').addEventListener('click', function () {
    const associationId = document.getElementById('associationSelect').value; // Get the selected association ID
    const imageFile = document.getElementById('imageUpload').files[0]; // Get the selected image file

    if (!associationId) {
        // Swal.fire({
        //     toast: true,
        //     position: 'top-end',
        //     icon: 'warning',
        //     title: 'Por favor selecciona una asociación o club.',
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true
        // });
        
        return;
    }

    if (!imageFile) {
        // Swal.fire({
        //     toast: true,
        //     position: 'top-end',
        //     icon: 'warning',
        //     title: 'Por favor selecciona una Imagen para subir.',
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true
        // });
        
        return;
    }

    const formData = new FormData();
    formData.append('image', imageFile); // Append the image file to the form data

    // Send a POST request to the new_news API
    fetch(`https://ot1.ojedatech.com/api/api/new_news/${associationId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }
            return data; // Return the data if response is ok
        });
    })
    .then(data => {
        // Success handling
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: data.message || '¡Actividad añadida exitosamente!',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        
        document.getElementById('addImageModal').modal('hide'); // Close modal

        // Optionally refresh the news images
        // You could call the function to refresh the images here if needed
    })
    .catch(error => {
        console.error("Error uploading image:", error);
        // Swal.fire({
        //     icon: 'error', // Ícono para error
        //     title: 'Error',
        //     text: "Ocurrió un error al subir la imagen: " + error.message, // Mensaje dinámico en español
        //     confirmButtonText: 'Ok', // Texto del botón
        // });
        
    });
});


//------------------------------------------------------//

// Admin associacion and club page reference js
//Delete news image

//------------------------------------------------------//

let imageToDelete = '';

document.getElementById('newsImagesContainer').addEventListener('click', function (event) {
    const target = event.target;

    if (target.tagName === 'IMG') {
        imageToDelete = target.src; // Store the image URL to delete
        document.getElementById('imageToDelete').src = imageToDelete; // Show the image in the modal

        // Hide the "show news images" modal
        const newsImagesModal = bootstrap.Modal.getInstance(document.getElementById('newsImagesModal'));
        newsImagesModal.hide();

        // Show the delete modal
        const deleteImageModal = new bootstrap.Modal(document.getElementById('deleteImageModal'));
        deleteImageModal.show();
    }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    const imageName = imageToDelete.split('/').pop(); // Get the image name from the URL
    const associationId = document.getElementById('associationSelect').value; // Get the selected association ID

    fetch(`https://ot1.ojedatech.com/api/api/delete_news/${associationId}/${imageName}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete image");
        }
        return response.json();
    })
    .then(data => {
        console.log("Image deleted successfully:", data);

        // Close the delete modal
        const deleteImageModal = bootstrap.Modal.getInstance(document.getElementById('deleteImageModal'));
        deleteImageModal.hide();

        // Display success toast
        Swal.fire({
            toast: true,
            icon: 'success',
            title: '¡Imagen eliminada correctamente!',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        // Refresh the news images
        showNewsImages();
    })
    .catch(error => {
        console.error("Error deleting image:", error);
    });
});

// Ensure the cancel button works
document.querySelector('#deleteImageModal .btn-secondary').addEventListener('click', function () {
    const deleteImageModal = bootstrap.Modal.getInstance(document.getElementById('deleteImageModal'));
    deleteImageModal.hide();
});


//------------------------------------------------------//

// Admin associacion and club page reference js
// Shows the news images present

//------------------------------------------------------//

document.getElementById('submitImageBtn').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const associationId = document.getElementById('associationIdForImage').value; // Get the association ID
    const imageFile = document.getElementById('imageUpload').files[0]; // Get the selected image file

    const formData = new FormData();
    formData.append('image', imageFile); // Append the image file to the form data

    // Send a POST request to the API
    fetch(`https://ot1.ojedatech.com/api/api/new_news/${associationId}`, {
        method: 'POST',
        body: formData
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upload image");
            }
            return response.json();
        })
        .then(data => {
            // Success handling
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: data.message || 'Noticia añadida exitosamente!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            

            // Clear the form
            document.getElementById('imageUpload').value = "";  // Reset the file input field to clear "Choose File" button
            document.getElementById('associationIdForImage').value = "";  
            document.getElementById('addImageForm').value = "";  
            

            // Optionally refresh the news images
            if (typeof showActivityImages === 'function') {
                showActivityImages(associationId); // Refresh images
            }
        })
        .catch(error => {
            console.error("Error uploading image:", error);
            // Swal.fire({
            //     icon: 'error', // Ícono para error
            //     title: 'Error',
            //     text: "Ocurrió un error al subir la imagen: " + error.message, // Mensaje dinámico en español
            //     confirmButtonText: 'Ok', // Texto del botón
            // });
            
        });
});


//------------------------------------------------------//

// Admin associacion and club page reference js
// Activity funtion

//------------------------------------------------------//


// Initialization when the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const role = sessionStorage.getItem("role");
        console.log(`User role: ${role}`);

        // For association admin, use their associated club ID
        if (role === "association_admin") {
            const user = JSON.parse(sessionStorage.getItem("user"));
            currentAssociationId = user.associations_clubs_id; // Set association ID for admin
        } 
        // For super admin, use the selected value from the dropdown
        else if (role === "super_admin") {
            const associationSelect = document.getElementById('associationSelect');
            currentAssociationId = associationSelect ? associationSelect.value : null; // From dropdown
        }

        console.log(`Detected Association ID: ${currentAssociationId}`);
        
        if (currentAssociationId) {
            showActivityImages(currentAssociationId); // Display images on page load
        } else {
            console.error("No Association ID found during initialization.");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

// Submit new activity (image upload)
document.getElementById("activityform").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Ensure we have a valid association ID
    if (!currentAssociationId) {
        console.error("No Association ID available for activity upload.");
        // Swal.fire({
        //     icon: 'warning', // Ícono para advertencia
        //     title: 'Advertencia',
        //     text: 'No se detectó un ID de asociación. Por favor, revise su selección o inicie sesión.',
        //     confirmButtonText: 'Ok', // Texto del botón
        // });
        
        return;
    }

    console.log(`Submitting activity form for Association ID: ${currentAssociationId}`);

    // Form data setup
    const formData = new FormData();
    const imageFile = document.querySelector('input[name="image"]').files[0];
    formData.append("image", imageFile);

    // Send POST request to your Flask endpoint
    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/new_activity/${currentAssociationId}`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Activity images:", data.activity_images);
            // Display success toast
            Swal.fire({
                toast: true,
                icon: 'success',
                title: '¡Imagen añadida exitosamente!',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            showActivityImages(currentAssociationId); // Refresh images after upload
        } else {
            console.error("Failed to upload image:", response.statusText);
            Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Error al subir la imagen',
                text: 'Por favor, inténtalo nuevamente.',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    } catch (error) {
        console.error("Error during activity upload:", error);
        Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Error al subir la imagen',
            text: 'Por favor, inténtalo nuevamente.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }
});

// Handle association dropdown change for super admin
document.getElementById('associationSelect').addEventListener('change', async function () {
    const selectedAssociationId = this.value;
    console.log(`Dropdown changed. New Association ID: ${selectedAssociationId}`);

    if (selectedAssociationId) {
        currentAssociationId = selectedAssociationId; // Update global ID
        await populateForm(currentAssociationId);
        await fetchAndDisplayBroadcasts(currentAssociationId); // Fetch and display broadcasts
        showActivityImages(currentAssociationId); // Fetch and display activity images
    } else {
        console.error("No association selected.");
    }
});

//------------------------------------------------------//

// Admin associacion and club page reference js
// Shows Activity funtion

//------------------------------------------------------//

// Function to fetch and display activity images
function showActivityImages(associationId) {
    console.log(`Calling showActivityImages with ID: ${associationId}`);

    if (!associationId) {
        console.error("No association ID provided to showActivityImages.");
        return;
    }

    fetch(`https://ot1.ojedatech.com/api/api/get_activity_by_id/${associationId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched activity images:", data);

            const activityImagesContainer = document.getElementById('activityImagesContainer');
            activityImagesContainer.innerHTML = ''; // Clear existing images

            if (data.activity_images && data.activity_images.length > 0) {
                data.activity_images.forEach(function (imageUrl) {
                    const colDiv = document.createElement('div');
                    colDiv.className = 'col-md-4 mb-3';
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.className = 'img-fluid activity-image';
                    img.alt = 'Activity Image';
                    colDiv.appendChild(img);
                    activityImagesContainer.appendChild(colDiv);
                });
            } else {
                activityImagesContainer.innerHTML = '<p>No activity images found for this association.</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching activity images:", error);
        });
}

// Event listener to handle image deletion when clicked
document.getElementById('activityImagesContainer').addEventListener('click', function (event) {
    const target = event.target;

    // Check if the clicked element is an image
    if (target.tagName === 'IMG') {
        const imageUrl = target.src; // Get the image URL
        const imageName = imageUrl.split('/').pop(); // Extract the image name

        // Ensure we have the current association ID
        if (!currentAssociationId) {
            console.error("No Association ID available for image deletion.");
            return;
        }
        // SweetAlert2 confirmation dialog
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Esta acción borrará la imagen: ${imageName}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33', // Red color for delete
            cancelButtonColor: '#3085d6', // Default blue for cancel
        }).then((result) => {
            if (result.isConfirmed) {
                // Call function to delete the image
                deleteActivityImage(currentAssociationId, imageName);
            }
        });
    }
});

//------------------------------------------------------//

// Admin associacion and club page reference js
// Delete activity funtion

//------------------------------------------------------//

// Function to delete the activity image

function deleteActivityImage(associationId, imageName) {
    console.log(`Deleting image ${imageName} for Association ID: ${associationId}`);

    fetch(`https://ot1.ojedatech.com/api/api/delete_activity/${associationId}/${imageName}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed response:", response);
            throw new Error("No se pudo borrar la imagen. Estado: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Image deleted successfully:", data);

        // Mostrar notificación de éxito
        // Swal.fire({
        //     toast: true,
        //     icon: 'success',
        //     title: '¡Imagen borrada exitosamente!',
        //     position: 'top-end',
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true,
        // });

        // Actualizar las imágenes
        if (typeof showActivityImages === 'function') {
            showActivityImages(associationId);
        } else {
            console.error("showActivityImages no está definido.");
        }
    })
    .catch(error => {


        // Mostrar notificación de error
        Swal.fire({
            toast: true,
            icon: 'success',
            title: '¡Imagen borrada exitosamente!',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        showActivityImages(associationId);
    });
}


//------------------------------------------------------//

// Admin associacion and club page reference js
// Show Calendar
// Creative activy donde se manejan las funciones de los eventos

//------------------------------------------------------//

// Función para cargar eventos desde la API y llenar la tabla
async function loadCalendarEvents() {
    try {
        const response = await fetch('https://ot1.ojedatech.com/api/api/events');
        const events = await response.json();

        // Llenar la tabla con los eventos
        populateCalendarTable(events);
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los eventos.',
        });
    }
}

// Función para llenar la tabla con los eventos
// function populateCalendarTable(events) {
//     const calendarTableBody = document.getElementById('calendarTableBody');
//     calendarTableBody.innerHTML = '';

//     if (events.length === 0) {
//         const emptyRow = document.createElement('tr');
//         emptyRow.innerHTML = '<td colspan="4" class="text-center">No hay eventos programados.</td>';
//         calendarTableBody.appendChild(emptyRow);
//         return;
//     }
//     // <td>${new Date(event.event_date).toLocaleDateString('es-ES')}</td>
//     events.forEach(event => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${event.event_title}</td>
//             <td>${event.description || 'Sin descripción'}</td>

//              <td>${event.event_date}</td>
//             <td>
//                 <button class="btn btn-info btn-sm" onclick="editEvent(${event.id})">
//                     <i class="fas fa-edit"></i> Editar
//                 </button>
//                 <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">
//                     <i class="fas fa-trash-alt"></i> Eliminar
//                 </button>
//             </td>
//         `;
//         calendarTableBody.appendChild(row);
//     });
// }

// document.getElementById('saveEventBtn').addEventListener('click', async function (event) {
//     event.preventDefault();

//     const eventId = document.getElementById('eventId').value;
//     const title = document.getElementById('eventTitle').value.trim();
//     const date = document.getElementById('eventDate').value;
//     const description = document.getElementById('eventDescription').value.trim();

//     if (!title || !date) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Campos obligatorios',
//             text: 'Por favor, completa el título y la fecha del evento.',
//         });
//         return;
//     }

//     const eventData = {
//         event_title: title,
//         event_date: date,
//         description: description,
//     };

//     try {
//         const response = await fetch(`https://ot1.ojedatech.com/api/api/events/${eventId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(eventData),
//         });

//         if (response.ok) {
//             Swal.fire({
//                 icon: 'success',
//                 title: '¡Evento actualizado!',
//                 toast: true,
//                 position: 'top-end',
//                 timer: 3000,
//                 timerProgressBar: true,
//                 showConfirmButton: false,
//             });

//             loadCalendarEvents(); // Recargar la tabla de eventos
//             bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
//         } else {
//             throw new Error('Error al actualizar el evento.');
//         }
//     } catch (error) {
//         console.error('Error al guardar los cambios:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'No se pudo guardar los cambios. Intenta nuevamente.',
//         });
//     }
// });



// Función para guardar los cambios del evento (actualización o creación)
// document.getElementById('saveEventBtn').addEventListener('click', async function () {
//     const eventId = document.getElementById('eventId').value;
//     const title = document.getElementById('eventTitle').value.trim();
//     const date = document.getElementById('eventDate').value;
//     const description = document.getElementById('eventDescription').value.trim();

//     // Validar campos obligatorios
//     if (!title || !date) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Campos obligatorios',
//             text: 'Por favor, completa el título y la fecha del evento.',
//         });
//         return;
//     }

//     const eventData = {
//         event_title: title,
//         event_date: date,
//         description: description,
//     };

//     try {
//         const response = await fetch(`https://ot1.ojedatech.com/api/api/events/${eventId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(eventData),
//         });

//         if (response.ok) {
//             Swal.fire({
//                 icon: 'success',
//                 title: '¡Evento actualizado!',
//                 text: 'El evento se actualizó correctamente.',
//                 toast: true,
//                 position: 'top-end',
//                 timer: 3000,
//                 timerProgressBar: true,
//                 showConfirmButton: false, // Elimina el botón "OK"
//             });
            

//             // Refresca la tabla con los eventos
//             loadCalendarEvents();

//             // Cierra el modal
//             const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
//             modal.hide();
//         } else {
//             throw new Error('Error al actualizar el evento.');
//         }
//     } catch (error) {
//         console.error('Error al guardar los cambios:', error);
//         // Swal.fire({
//         //     icon: 'error',
//         //     title: 'Error',
//         //     text: 'No se pudo guardar los cambios. Intenta nuevamente.',
//         // });
//     }
// });

// Función para eliminar un evento
async function deleteEvent(eventId) {
    try {
        const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto eliminará el evento de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (confirmation.isConfirmed) {
            const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_event/${eventId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El evento se eliminó exitosamente.',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });

                // Recargar la tabla
                loadCalendarEvents();
            } else {
                throw new Error('Error al eliminar el evento.');
            }
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el evento. Intenta nuevamente.',
        });
    }
}

// Cargar los eventos al cargar la página
document.addEventListener('DOMContentLoaded', loadCalendarEvents);



let currentAssociation_clubsId = null; // Global ID tracker
const filter = document.getElementById('filter');
const associationSelect = document.getElementById('associationSelect');
const calendarTableBody = document.getElementById('calendarTableBody');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const role = sessionStorage.getItem("role");
        console.log(`User role: ${role}`);

        // For association admin, use their associated club ID
        if (role === "association_admin") {
            const user = JSON.parse(sessionStorage.getItem("user"));
            currentAssociation_clubsId = user.associations_clubs_id; // Set association ID for admin
        } 
        // For super admin, use the selected value from the dropdown
        else if (role === "super_admin") {
            currentAssociation_clubsId = associationSelect ? associationSelect.value : null; // From dropdown
        }

        console.log(`Detected Association ID: ${currentAssociation_clubsId}`);
        
        if (currentAssociation_clubsId) {
            const events = await fetchEventsForAssociation(currentAssociation_clubsId);
            populateCalendarTable(events);
        } else {
            console.error("No Association ID found during initialization.");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

// Function to fetch events for a given association ID
async function fetchEventsForAssociation(associationId) {
    try {
        console.log(`[DEBUG] Fetching events for association ID: ${associationId}`);

        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_events/${associationId}`);
        if (!response.ok) {
            throw new Error('Error fetching events: ' + response.statusText);
        }

        const events = await response.json();
        console.log('[DEBUG] Fetched events:', events);

        return events; // Return the events array
    } catch (error) {
        console.error('Error fetching events:', error);
        return []; // Return an empty array on error
    }
}

// Function to populate the events table ///////////////////
// Function to populate the events table
function populateCalendarTable(events) {
    // Clear the current table content
    calendarTableBody.innerHTML = '';

    if (events.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5" class="text-center">No hay eventos programados.</td>';
        calendarTableBody.appendChild(emptyRow);
        return;
    }

    // Populate the table with the events
    events.forEach(event => {
        const row = document.createElement('tr');
        // <td>${new Date(event.event_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
        row.innerHTML = `
            <td>${event.event_title}</td>
            <td>${event.description || 'Sin descripción'}</td>
            <td>${event.event_date}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-info view-event" data-id="${event.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-event" data-id="${event.id}">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </td>
        `;

        calendarTableBody.appendChild(row);
    });

    // Add listeners for delete buttons
    document.querySelectorAll('.delete-event').forEach(button => {
        button.addEventListener('click', async function () {
            const eventId = button.getAttribute('data-id');
            await deleteEvent(eventId); // Function to handle event deletion
        });
    });

    // Add listeners for view buttons
    document.querySelectorAll('.view-event').forEach(button => {
        button.addEventListener('click', function () {
            const eventId = button.getAttribute('data-id');
            viewEvent(eventId); // Function to handle viewing event details
        });
    });
}

// Function to handle filter changes
async function handleFilterChange() {
    const selectedId = associationSelect.value;

    if (!selectedId) {
        console.warn('[DEBUG] No association ID selected.');
        populateCalendarTable([]); // Clear the table
        return;
    }

    currentAssociation_clubsId = selectedId; // Update the global tracker
    const events = await fetchEventsForAssociation(selectedId);
    populateCalendarTable(events);
}

// // Function to view event details
// function viewEvent(eventId) {
//     alert(`Detalles del evento con ID: ${eventId}`);
// }

// Function to view event details and populate the modal
// function viewEvent(eventId) {
//     // Llama a la API para obtener los datos del evento usando el ID
//     fetch(`https://ot1.ojedatech.com/api/api/update_event/${eventId}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('No se pudo obtener el evento');
//             }
//             return response.json();
//         })
//         .then(event => {
//             // Llena los campos del modal con los datos del evento
//             document.getElementById('eventId').value = event.id;
//             document.getElementById('eventTitle').value = event.event_title;
//             document.getElementById('eventDescription').value = event.description || '';
//             document.getElementById('eventDate').value = event.event_date;

//             // Muestra el modal
//             const modalInstance = new bootstrap.Modal(document.getElementById('eventModal'));
//             modalInstance.show();
//         })
//         .catch(error => {
//             console.error('Error al obtener los detalles del evento:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'No se pudo cargar la información del evento.',
//             });
//         });
// }

// Function to view event details and populate the modal


function viewEvent(eventId) {
    fetch(`https://ot1.ojedatech.com/api/api/get_event/${eventId}`)  // GET request to fetch event details
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el evento');
            }
            return response.json();
        })
        .then(event => {
            // Populate modal fields with event data
            // document.getElementById('eventId').value = event.id;
            // document.getElementById('eventTitle').value = event.event_title;
            // document.getElementById('eventDescription').value = event.description || '';
            // document.getElementById('eventDate').value = event.event_date;

            event.forEach(event => {
                document.getElementById('eventId').value = event.id;
                document.getElementById('eventTitle').value = event.event_title || '';  // Ensure it's not undefined
                document.getElementById('eventDescription').value = event.description || '';  // Ensure description is not undefined
                document.getElementById('eventDate').value = formatDate(event.event_date); 
            });


            // Show the modal
            const modalInstance = new bootstrap.Modal(document.getElementById('eventModal'));
            modalInstance.show();
        })
        .catch(error => {
            console.error('Error al obtener los detalles del evento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la información del evento.',
            });
        });
}

// Function to submit the updated event
function updateEvent() {
    const eventId = document.getElementById('eventId').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventDate = document.getElementById('eventDate').value;

    const data = {
        event_title: eventTitle,
        event_date: eventDate,
        description: eventDescription,
    };

    fetch(`https://ot1.ojedatech.com/api/api/update_event/${eventId}`, {
        method: 'PUT',  // PUT request to update the event
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo actualizar el evento');
            }
            return response.json();
        })
        .then(result => {
            Swal.fire({
                icon: 'success',
                title: 'Evento actualizado',
                text: result.message || 'El evento fue actualizado con éxito.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            // Close the modal
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
            modalInstance.hide();
        })
        .catch(error => {
            console.error('Error al actualizar el evento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el evento.',
            });
        });
}


// Function to delete an event
async function deleteEvent(eventId) {
    try {
        const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto eliminará el evento de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (confirmation.isConfirmed) {
            const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_event/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar el evento.');

            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El evento se eliminó exitosamente.',
                timer: 2000,
            });

            // Reload events after deletion
            const events = await fetchEventsForAssociation(currentAssociation_clubsId);
            populateCalendarTable(events);
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el evento.',
        });
    }
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Event Listener for Filter Dropdown
filter.addEventListener('change', async function () {
    const classification = this.value;

    // Fetch associations based on the selected classification
    await fetchAndPopulateAssociations(classification);

    // Trigger table population if an association is selected
    associationSelect.addEventListener('change', handleFilterChange);
});

// Initial load (if needed, based on association)
associationSelect.addEventListener('change', handleFilterChange);

//------------------------------------------------------// 
// Admin associacion and club page reference js
// Calendar and events management
//------------------------------------------------------//



// Function to delete an event
async function deleteEvent(eventId) {
    if (!eventId) {
        console.error('El ID del evento no está definido');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El ID del evento no es válido.',
        });
        return;
    }

    console.log('Intentando eliminar el evento con ID:', eventId);

    try {
        const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este evento? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (confirmation.isConfirmed) {
            const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_event/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al eliminar el evento: ${response.statusText} (${errorText})`);
            }

            const result = await response.json();

            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: result.message || 'Evento eliminado con éxito.',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false, // Elimina el botón "OK"
            });

            // Recargar la tabla
            const events = await fetchEventsForAssociation(currentAssociation_clubsId);
            populateCalendarTable(events);
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el evento. Intenta nuevamente.',
        });
    }
}

// Add delete button functionality
document.querySelectorAll('.delete-event-btn').forEach(button => {
    button.addEventListener('click', () => {
        const eventId = button.getAttribute('data-id');
        deleteEvent(eventId);
    });
});


// Función para cargar eventos en el calendario
async function loadCalendarEvents() {
    try {
        const associationId = document.getElementById('associationSelect').value; // Obtener ID de asociación seleccionada
        if (!associationId) {
            console.warn('No se ha seleccionado una asociación.');
            return;
        }

        // Petición a la API para obtener eventos
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_events/${associationId}`);
        if (!response.ok) {
            throw new Error('Error al cargar los eventos.');
        }

        const events = await response.json();
        
        // Función para poblar la tabla con los eventos
        populateCalendarTable(events); // Asegúrate de que esta función esté definida
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
    }
}



//------------------------------------------------------//

// Admin associacion and club page reference js
// Board members funtion

//------------------------------------------------------//


async function updateBoard() {
    const form = document.getElementById('updateBoardForm');
    const formData = new FormData(form);
    
    // Add board ID to the request URL
    const boardId = document.getElementById('boardId').value;

    try {
        const response = await fetch(`https://ot1.ojedatech.com/api//update_board/${boardId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to update board");
        }

        const result = await response.json();

        Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'La junta directiva se actualizó correctamente.'
        });
        

    } catch (error) {
        // document.getElementById('responseMessage').innerHTML = `
        //     <div class="alert alert-danger">Error: ${error.message}</div>
        // `;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la junta directiva. Por favor, intenta nuevamente.'
        });
    }
}


let currentAssociationId = null; // Global ID tracker

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Determine the association ID based on the user's role
        const role = sessionStorage.getItem("role");
        console.log(`User role detected: ${role}`);
        
        if (role === "association_admin") {
            const user = JSON.parse(sessionStorage.getItem("user"));
            currentAssociationId = user.associations_clubs_id; // Fetch the ID for association admin
        } else if (role === "super_admin") {
            const associationSelect = document.getElementById('associationSelect');
            currentAssociationId = associationSelect ? associationSelect.value : null; // Use dropdown selection for super admin
        }

        console.log(`Determined Association ID: ${currentAssociationId}`);

        if (currentAssociationId) {
            await fetchBoardDetailsByAssociationId(currentAssociationId); // Pass the ID explicitly
        } else {
            console.error("No Association ID available.");
            document.getElementById("responseMessage").innerText = "Error: Association ID not found.";
        }
    } catch (error) {
        console.error("Error in DOMContentLoaded execution:", error);
    }
});

async function fetchBoardDetailsByAssociationId(associationId) {
    if (!associationId) {
        console.error("No association ID provided to fetchBoardDetailsByAssociationId");
        return;
    }

    try {
        console.log(`Fetching board details for Association ID: ${associationId}`);
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_board_members/${associationId}`);
        if (!response.ok) throw new Error(`Failed to fetch board members. Status: ${response.status}`);
        const data = await response.json();

        if (data && data.members) {
            console.log("Fetched board members data:", data.members);
            data.members.forEach(member => {
                document.getElementById(`${member.role}_name`).value = member.name || '';
                document.getElementById(`${member.role}_img`).src = member.image || '';
            });
        } else {
            console.warn("No board members found for this association ID.");
        }
    } catch (error) {
        console.error("Error fetching board member data:", error);
        document.getElementById("responseMessage").innerText =
            "Error fetching board details. Please try again.";
    }
}

async function updateBoard() {
    if (!currentAssociationId) {
        console.error("Association ID is undefined in updateBoard");
        document.getElementById("responseMessage").innerText = "Association ID is undefined.";
        return;
    }

    console.log("Updating board for Association ID:", currentAssociationId);

    const boardData = {
        associations_clubs_id: currentAssociationId,
        members: []
    };

    const roles = [
        { id: 'president', nameId: 'president_name', imgId: 'president_img' },
        { id: 'vicepresident', nameId: 'vicepresident_name', imgId: 'vicepresident_img' },
        { id: 'secretary', nameId: 'secretary_name', imgId: 'secretary_img' },
        { id: 'treasurer', nameId: 'treasurer_name', imgId: 'treasurer_img' },
        { id: 'vocal_1', nameId: 'vocal_1_name', imgId: 'vocal_1_img' },
        { id: 'vocal_2', nameId: 'vocal_2_name', imgId: 'vocal_2_img' },
        { id: 'vocal_3', nameId: 'vocal_3_name', imgId: 'vocal_3_img' }
    ];

    let allValid = true;
    roles.forEach(role => {
        const name = document.getElementById(role.nameId).value.trim();
        const image = document.getElementById(role.imgId).src;
        console.log(`Processing ${role.id}: Name: ${name}, Image: ${image}`);

        if (!name) {
            console.error(`Missing name for ${role.id}`);
            //alert(`Please enter a name for ${role.id}`);
            allValid = false;
        }

        boardData.members.push({ role: role.id, name, image });
    });

    if (!allValid) {
        console.log("Validation failed. Aborting update.");
        return;
    }

    console.log("Prepared board data for update:", boardData);

    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/update_board/${currentAssociationId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(boardData)
        });
        const data = await response.json();

        if (data.success) {
            console.log("Board updated successfully");
            // Mostrar toast de éxito
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'La junta directiva se actualizó correctamente.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        
            await fetchBoardDetailsByAssociationId(currentAssociationId); // Refrescar detalles de la junta
        } else {
            console.error("Board update error:", data.message || "Unknown error");
            // Mostrar toast de error
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: `Error: ${data.message || "Error desconocido"}`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
        
    } catch (error) {
        console.error("Error updating board:", error);
        document.getElementById("responseMessage").innerText = "Error updating board.";
    }
}


// Listen for changes in the associationSelect dropdown to trigger data fetches
document.getElementById("associationSelect").addEventListener("change", function() {
    currentAssociationId = this.value;  // Store selected ID in the global variable
    console.log("Selected Association ID:", currentAssociationId);  // Log selected ID
    if (currentAssociationId) {
        fetchBoardDetailsByAssociationId(currentAssociationId);
    }
});

// Button click event for updating the board
document.querySelector(".btn.btn-primary").addEventListener("click", function() {
    if (currentAssociationId) {
        console.log("Updating board for selected association ID:", currentAssociationId);
        updateBoard();
    } else {
        document.getElementById("responseMessage").innerText = "Please select an association to update.";
    }
});

function previewImage(input, imgId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById(imgId);
            if (imgElement) {
                console.log(`Updating image: ${imgId}`);
                imgElement.src = e.target.result;
                imgElement.style.display = 'block'; // Asegúrate de que la imagen sea visible
            } else {
                console.error(`Image element with ID "${imgId}" not found.`);
            }
        };
        reader.readAsDataURL(file);
    } else {
        console.error("No file selected.");
    }
}


document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        const imgId = this.id.replace('_file', '_img');
        console.log(`Input ID: ${this.id}, Calculated Image ID: ${imgId}`);
        previewImage(this, imgId);
    });
});

function logVocal2Details() {
    const vocal2Name = document.getElementById("vocal_2_name").value;
    const vocal2FileInput = document.getElementById("vocal_2_image");
    const vocal2File = vocal2FileInput.files[0];

    console.log("Vocal 2 Name (from input):", vocal2Name);

    if (vocal2File) {
        console.log("Vocal 2 File Name:", vocal2File.name);
        console.log("Vocal 2 File Size:", vocal2File.size, "bytes");
        console.log("Vocal 2 File Type:", vocal2File.type);
    } else {
        console.log("No file selected for Vocal 2.");
    }
}


//------------------------------------------------------//

// Admin associacion and club page reference js
// Delete association or club functionality

//------------------------------------------------------//


document.addEventListener('DOMContentLoaded', () => {
    // Get user and role from sessionStorage
    let user;
    let role;

    // Safely get user data from sessionStorage
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.error("Error parsing user data:", e);
        user = null;
    }

    // Get role from sessionStorage
    role = sessionStorage.getItem('role');

    console.log("User from sessionStorage:", user);  // Debugging: Check user data
    console.log("Role from sessionStorage:", role);  // Debugging: Check role data

    // Get the delete association container element by its new ID
    const deleteAssociationContainer = document.getElementById('deleteAssociationContainer');

    if (deleteAssociationContainer) {
        console.log("Delete association container found in the DOM"); // Debugging: Ensure container is found
    } else {
        console.error("Delete association container not found in the DOM");
    }

    // If user is not 'super_admin', hide the delete association section
    if (role !== 'super_admin') {
        console.log("Role is not super_admin, hiding the delete section.");  // Debugging
        deleteAssociationContainer.style.display = 'none';  // Hide delete section for non-super admins
    } else {
        console.log("Role is super_admin, displaying the delete section.");  // Debugging
        deleteAssociationContainer.style.display = 'block';  // Ensure delete section is visible for super_admin
    }

    // Event listener to handle fetching associations/clubs based on selected entity type
    document.getElementById('entityType').addEventListener('change', function() {
        const entityType = this.value; // Get selected entity type (1 or 2)
        console.log('Selected entity type:', entityType); // Log the selected entity type
        const deleteAssociationId = document.getElementById('deleteAssociationId');
        deleteAssociationId.innerHTML = '<option value="" disabled selected>Seleccionar asociación/club</option>'; // Reset the dropdown

        // Fetch associations/clubs based on selected type
        fetch('https://ot1.ojedatech.com/api/api/get_all_associations')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the response to see its structure
                data.forEach(association => {
                    // Check if the clasification matches the selected entity type
                    if (association.clasification == entityType) {
                        const option = document.createElement('option');
                        option.value = association.id; // Set the value to the association ID
                        option.textContent = association.title; // Set the display text to the association title
                        deleteAssociationId.appendChild(option); // Append the option to the dropdown
                    }
                });
            })
            .catch(error => console.error('Error fetching associations:', error));
    });

    // Handle form submission
    document.getElementById('deleteAssociationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedId = document.getElementById('deleteAssociationId').value;

        // Show confirmation Swal first
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará permanentemente la asociación o club.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar',
            // Add custom classes for large buttons and spacing
            customClass: {
                confirmButton: 'btn btn-danger btn-lg me-3 ',  // Large red button
                cancelButton: 'btn btn-secondary btn-lg',    // Large gray button
            },
            buttonsStyling: false 
        }).then((result) => {
            if (result.isConfirmed) {
                // Call the delete API with the selected ID
                fetch(`https://ot1.ojedatech.com/api/api/delete_association/${selectedId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('deleteAssociationId').innerHTML = '<option value="" disabled selected>Seleccionar asociación/club</option>';
                    document.getElementById('entityType').value = ''; // Reset to "Seleccionar tipo"

                    Swal.fire({
                        icon: 'success',
                        title: 'Asociación/club borrada exitosamente',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000, // Automatically close after 3 seconds
                        timerProgressBar: true,
                    });

                })
                .catch(error => {
                    console.error('Error deleting association:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al eliminar.', // Error message in Spanish
                        confirmButtonText: 'Aceptar'
                    });
                });
            } else {
                // If the user cancels the action, show a cancel message (optional)
                Swal.fire({
                    icon: 'info',
                    title: 'Acción cancelada',
                    text: 'La eliminación de la asociación o club fue cancelada.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
});


// Get the delete association container element by its ID
const deleteAssociationContainer = document.getElementById('deleteAssociationContainer');

// Ensure the container is initially hidden
if (deleteAssociationContainer) {
    deleteAssociationContainer.style.display = 'none'; // Hide by default
    console.log("Delete association container initially hidden.");
} else {
    console.error("Delete association container not found in the DOM.");
}

// Show the delete section only if the role is 'super_admin'
if (role === 'super_admin' && deleteAssociationContainer) {
    console.log("Role is super_admin, showing the delete section.");
    deleteAssociationContainer.style.display = 'block'; // Display for super_admin
} else {
    console.log("Role is not super_admin, keeping the delete section hidden.");
}

//------------------------------------------------------//

// Admin associacion and club page reference js
// View calendar and create

//------------------------------------------------------//

// Área para cargar el calendario

document.addEventListener('DOMContentLoaded', function () {
    const calendarTableBody = document.getElementById('calendarTableBody');
    const eventForm = document.getElementById('eventForm');
    const eventIdInput = document.getElementById('eventId');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDateInput = document.getElementById('eventDate');
    const eventDescriptionInput = document.getElementById('eventDescription');

    // Función para cargar eventos desde la API
   // Función para cargar eventos desde la API y generar la tabla
async function loadCalendarEvents() {
    try {
        const response = await fetch('https://ot1.ojedatech.com/api/api/events');
        const events = await response.json();

        calendarTableBody.innerHTML = ''; // Limpiar la tabla

        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.event_title}</td>
                <td>${event.description || 'Sin descripción'}</td>
                <td>${new Date(event.event_date).toLocaleDateString()}</td>
                <td>
                    <button 
                        class="btn btn-warning btn-sm" 
                        onclick="editEvent(${event.id})">Editar</button>
                    <button 
                        class="btn btn-danger btn-sm" 
                        onclick="deleteEvent(${event.id})">Eliminar</button>
                </td>
            `;
            calendarTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        alert('No se pudieron cargar los eventos.');
    }
}

// Función para manejar el evento de edición (llenar y mostrar modal)
async function editEvent(eventId) {
    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/events/${eventId}`);
        if (!response.ok) throw new Error('No se pudo obtener el evento');

        const event = await response.json();

        // Llenar el formulario con los datos del evento
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.event_title;
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventDate').value = event.event_date;

        // Mostrar el modal
        const eventModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('eventModal'));
        eventModal.show();
    } catch (error) {
        console.error('Error al obtener el evento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar los datos del evento.',
        });
    }
}

// Función para manejar el envío del formulario
eventForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = eventIdInput.value;
    const title = eventTitleInput.value;
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value;

    const event = { event_title: title, event_date: date, description };

    try {
        const response = id
            ? await fetch(`https://ot1.ojedatech.com/api/api/events/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(event),
              })
            : await fetch('https://ot1.ojedatech.com/api/api/events', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(event),
              });

        if (response.ok) {
            alert('Evento guardado exitosamente.');
            loadCalendarEvents(); // Recargar la tabla
            eventForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        } else {
            throw new Error('Error al guardar el evento.');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});


    // Cargar eventos al cargar la página
    loadCalendarEvents();
});
