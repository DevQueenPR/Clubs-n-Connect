document.addEventListener('DOMContentLoaded', function () {
    const referencesSection = document.getElementById('referencesSection');
    let role;

    // Get the role from sessionStorage
    try {
        role = sessionStorage.getItem('role');
    } catch (error) {
        console.error("Error retrieving role:", error);
        role = null;
    }

    // Check the user's role
    if (role === 'super_admin') {
        referencesSection.style.display = 'block'; // Show the content
    } else {
        // Redirect to no-access page or show an error message
        Swal.fire({
            icon: 'error', // Error icon
            title: 'Access Denegado',
            text: 'No tienes acceso a esta sección.',
            confirmButtonText: 'OK',
        }).then(() => {
            // Redirect to login page after the user clicks "OK"
            window.location.href = '/login.html';
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Form submission for creating a new reference
    const createForm = document.getElementById('createReferenceForm');
    const createModal = document.getElementById('createReferenceModal');

    // Reset the form fields when the modal is shown
    if (createModal) {
        createModal.addEventListener('shown.bs.modal', () => {
            // Clear input fields when the modal is shown
            document.getElementById('createLinkName').value = '';
            document.getElementById('createLinkUrl').value = '';
        });
    }

    if (createForm) {
        createForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Get input values
            const linkName = document.getElementById('createLinkName').value;
            const linkUrl = document.getElementById('createLinkUrl').value;

            try {
                // API request to create a new reference
                const response = await fetch('https://ot1.ojedatech.com/api/api/new_references', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        link_name: linkName,
                        link_url: linkUrl,
                    }),
                });

                const result = await response.json();
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Referencia creada exitosamente',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000, // Automatically close after 3 seconds
                        timerProgressBar: true,
                    });

                    bootstrap.Modal.getInstance(createModal).hide(); // Close modal
                    fetchReferencesForManage(); // Refresh the table
                } else {
                    Swal.fire({
                        icon: 'error', // Error icon
                        title: 'Error',
                        text: result.error || 'No se pudo crear la referencia',
                        confirmButtonText: 'Ok',
                    });
                }
            } catch (error) {
                console.error('Error creating reference:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error inesperado',
                    text: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Ok',
                });
            }
        });
    }
});


// Function to fetch and display references
async function fetchReferencesForManage() {
    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_all_references`); // Fetch all references
        if (!response.ok) throw new Error('Failed to fetch references');

        const references = await response.json();
        const referenceTableBody = document.getElementById('referenceTableBody');

        if (referenceTableBody) {
            referenceTableBody.innerHTML = ''; // Clear the table

            if (references.length === 0) {
                referenceTableBody.innerHTML = '<tr><td colspan="3">No references available</td></tr>';
                return;
            }

            references.forEach(reference => {
                const row = document.createElement('tr');

                // Link name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = reference.link_name;
                row.appendChild(nameCell);

                // Link URL cell
                const urlCell = document.createElement('td');
                const link = document.createElement('a');
                link.href = reference.link_url;
                link.textContent = reference.link_url;
                link.target = '_blank';
                urlCell.appendChild(link);
                row.appendChild(urlCell);

                // Actions cell
                const actionCell = document.createElement('td');
                actionCell.className = 'action-buttons';

                // Edit button
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-sm btn-warning d-flex align-items-center gap-2'; // Add some spacing
                editButton.onclick = () =>
                    openUpdateModal(reference.id, reference.link_name, reference.link_url);

                // Add Font Awesome icon to the edit button
                const editIcon = document.createElement('i');
                editIcon.className = 'fas fa-edit'; // Font Awesome edit icon
                editButton.appendChild(editIcon);

                // Add text to the edit button
                const editText = document.createTextNode(' Editar');
                editButton.appendChild(editText);

                actionCell.appendChild(editButton);

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-sm btn-danger d-flex align-items-center gap-2'; // Add some spacing
                deleteButton.onclick = () => deleteReference(reference.id);

                // Add Font Awesome icon to the delete button
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fas fa-trash-alt'; // Font Awesome delete icon
                deleteButton.appendChild(deleteIcon);

                // Add text to the delete button
                const deleteText = document.createTextNode(' Borrar');
                deleteButton.appendChild(deleteText);

                actionCell.appendChild(deleteButton);


                row.appendChild(actionCell);
                referenceTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching references:', error);
        const referenceTableBody = document.getElementById('referenceTableBody');
        if (referenceTableBody) {
            referenceTableBody.innerHTML =
                '<tr><td colspan="3">Error loading references</td></tr>';
        }
    }
}



// Function to open the update modal
function openUpdateModal(id, linkName, linkUrl) {
    document.getElementById('updateReferenceId').value = id; // Populate hidden ID field
    document.getElementById('updateLinkName').value = linkName; // Populate name field
    document.getElementById('updateLinkUrl').value = linkUrl; // Populate URL field

    const updateModal = new bootstrap.Modal(document.getElementById('updateReferenceModal')); // Show the modal
    updateModal.show();
}

// Handle update form submission
const updateForm = document.getElementById('updateReferenceForm');
if (updateForm) {
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = document.getElementById('updateReferenceId').value; // Get reference ID
        const linkName = document.getElementById('updateLinkName').value; // Get updated name
        const linkUrl = document.getElementById('updateLinkUrl').value; // Get updated URL

        if (!id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Falta el ID. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Ok',
            });
            
            return;
        }

        try {
            // Send the ID as part of the URL
            const response = await fetch(`https://ot1.ojedatech.com/api/api/update_references/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link_name: linkName,
                    link_url: linkUrl
                })
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Referencia actualizada exitosamente',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000, // Automatically close after 3 seconds
                    timerProgressBar: true,
                });            
                
                bootstrap.Modal.getInstance(document.getElementById('updateReferenceModal')).hide(); // Close modal
                fetchReferencesForManage(); // Refresh the table for managing references
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Actualización',
                    text: result.error || 'No se pudo actualizar la referencia.',
                    confirmButtonText: 'Ok',
                });
                
            }
        } catch (error) {
            console.error('Error updating reference:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Actualización',
                text: result.error || 'No se pudo actualizar la referencia.',
                confirmButtonText: 'Ok',
            });
            
        }
    });
}



// Function to delete a reference

// Function to delete a reference
async function deleteReference(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¡Esta acción no se puede deshacer!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn btn-danger btn-lg me-2', // Clase de Bootstrap para un botón rojo
            cancelButton: 'btn btn-secondary btn-lg', // Clase para el botón de cancelar
        },
        buttonsStyling: false, // Necesario para usar las clases personalizadas
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Make DELETE request
                const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_references/${id}`, { 
                    method: 'DELETE' 
                });

                if (!response.ok) throw new Error('Failed to delete reference');

                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminación Exitosa',
                    text: 'La referencia se eliminó correctamente.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                // Refresh the references table
                fetchReferencesForManage();
            } catch (error) {
                console.error('Error:', error);
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Eliminar',
                    text: 'Hubo un error al eliminar la referencia. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Ok',
                });
            }
        }
    });
}

// async function deleteReference(id) {
//     Swal.fire({
//         title: '¿Estás seguro?',
//         text: '¡Esta acción no se puede deshacer!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Sí, eliminar',
//         cancelButtonText: 'Cancelar'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Proceed with the deletion if confirmed
//             deleteReference();
//         }
//     });
    
//     // if (!confirm('Are you sure you want to delete this reference?')) return; // Confirm before deletion

//     try {
//         const response = await fetch(`https://ot1.ojedatech.com/api/api/delete_references/${id}`, { method: 'DELETE' }); // Make DELETE request
//         if (!response.ok) throw new Error('Failed to delete reference');

//         Swal.fire({
//             icon: 'success',
//             title: 'Eliminación Exitosa',
//             text: 'La referencia se eliminó correctamente.',
//             toast: true, // Make it a toast notification
//             position: 'top-end', // You can change this to other positions like 'top-right', 'bottom-left', etc.
//             showConfirmButton: false, // Removes the confirm button
//             timer: 3000, // Sets how long the toast will be displayed in milliseconds
//             timerProgressBar: true // Adds a progress bar that counts down with the timer
//         });
        
        
//         fetchReferencesForManage(); // Refresh the table after deletion
//     } catch (error) {
//         console.error('Error:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Error al Eliminar',
//             text: 'Hubo un error al eliminar la referencia. Por favor, inténtalo de nuevo.',
//             confirmButtonText: 'Ok',
//         });
        
//     }
// }

// Initialize the page by fetching references
document.addEventListener('DOMContentLoaded', () => {
    fetchReferencesForManage(); // Load references on page load
});
