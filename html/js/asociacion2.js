//------------------------------------------------------//

// Asociacion and club page reference js
// Grabbing the specific entity functionality

//------------------------------------------------------//

// Function to fetch details of an association or club
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type');

    if (id) {
        fetchEntityDetails(id, type);
    } else {
        document.getElementById('association-details').innerText = 'Entidad no encontrada.';
    }
});


//------------------------------------------------------//

// Asociacion and club page reference js
// Displays basic data (logo, title, description, social media) of the entity functionality

//------------------------------------------------------//

// Fetch and display details based on type (association or club)
async function fetchEntityDetails(id, type) {
    try {
        const endpoint = `https://ot1.ojedatech.com/api/api/get_association_by_id/${id}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const entity = await response.json();
        console.log('Fetched entity:', entity);

        document.getElementById('association-details').innerHTML = `
            <div class="container mt-5">
                <div class="row align-items-center text-center text-md-left">
                    <div class="col-12 col-md-2 text-center mb-3 mb-md-0">
                        <div class="logo-circle">
                            <img src="${entity.logo}" alt="Logo de ${entity.title}" class="img-fluid logo">
                        </div>
                    </div>
                    <div class="col-12 col-md-10">
                        <h1 class="title-near-logo title-2">${entity.title}</h1>
                    </div>
                </div>
                <div class="row mt-4 justify-content-center">
                    <div class="col-12 col-sm-10 col-md-8 bg-light p-4 description-square">
                        <p class="text-center">${entity.description}</p>
                    </div>
                </div>
            </div>
        `;

        // Update social media links
        updateSocialMediaLinks(entity);

        // Fetch board members if the entity has a board
        fetchBoardMembers(id);
        fetchNewsByAssociationId(id);

    } catch (error) {
        console.error('Error fetching entity details:', error);
        document.getElementById('association-details').innerText = 'Error loading entity details.';
    }
}

function updateSocialMediaLinks(entity) {
    // Update Facebook link
    const facebookLink = document.getElementById('facebookLink');
    if (entity.Facebook) {
        facebookLink.href = entity.Facebook;
        facebookLink.target = '_blank'; // Open in a new tab
    } else {
        facebookLink.href = '#';
        facebookLink.style.opacity = '0.5'; // Dim the icon if no link is available
    }

    // Update Twitter link
    const twitterLink = document.getElementById('twitterLink');
    if (entity.X) {
        twitterLink.href = entity.X;
        twitterLink.target = '_blank';
    } else {
        twitterLink.href = '#';
        twitterLink.style.opacity = '0.5';
    }

    // Update Instagram link
    const instagramLink = document.getElementById('instagramLink');
    if (entity.Instagram) {
        instagramLink.href = entity.Instagram;
        instagramLink.target = '_blank';
    } else {
        instagramLink.href = '#';
        instagramLink.style.opacity = '0.5';
    }
}

//------------------------------------------------------//

// Asociacion and club page reference js
// News functionality

//------------------------------------------------------//

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for the associations to populate and get the associationId
        const role = sessionStorage.getItem("role");
        let associationId;

        if (role === "association_admin") {
            // If role is association_admin, get the ID directly from the user session
            const user = JSON.parse(sessionStorage.getItem("user"));
            associationId = user.associations_clubs_id; // Assuming this is the correct field
        } else if (role === "super_admin") {
            // If role is super_admin, get the selected value from the dropdown after it loads
            const associationSelect = document.getElementById('associationSelect');
            associationId = associationSelect.value;
        }

        if (associationId) {
            console.log(`Fetching data for association ID: ${associationId}`); // Log the association ID

            // Fetch news and broadcasts using the associationId
            await fetchNewsByAssociationId(associationId);
            await fetchBroadcastById(associationId);
        } else {
            console.error('No association ID available');
        }
    } catch (error) {
        console.error('Error during DOMContentLoaded execution:', error);
    }
});


// Function to fetch news images for the carousel
async function fetchNewsByAssociationId(id) {
    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_news_by_id/${id}`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched news:', data); // Log the news data

        // Check if there are news images to update the carousel
        if (data.news_images && data.news_images.length > 0) {
            updateCarousel(data.news_images, data.association_title);
        } else {
            console.warn('No news images found for this association.');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Function to update the carousel with fetched images
function updateCarousel(newsImages, associationTitle) {
    const carouselInner = document.querySelector('#carouselInner'); // Your carousel inner container
    carouselInner.innerHTML = ''; // Clear existing items

    newsImages.forEach((image, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : ''); // Set first item as active
        
        const img = document.createElement('img');
        img.src = image; // Set the image source
        img.className = 'd-block w-100'; // Bootstrap classes for full width
        img.alt = `News image ${index + 1} for ${associationTitle}`;
        
        carouselItem.appendChild(img); // Append the image to the carousel item
        carouselInner.appendChild(carouselItem); // Append the item to the carousel inner
    });

    console.log('Carousel updated with images:', newsImages); // Log the images added to the carousel
}


//------------------------------------------------------//

// Asociacion and club page reference js
// Broadcast functionality

//------------------------------------------------------//

document.addEventListener("DOMContentLoaded", function() {
    const broadcastListId = document.getElementById('broadcast-list-id');

    // Get the ID from the URL parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Fetch the 'id' parameter from the URL

    if (id) {
        async function fetchBroadcastById(id) {
            console.log(`Fetching broadcasts with ID: ${id}`); // Log the ID for debugging

            try {
                const response = await fetch(`https://ot1.ojedatech.com/api/api/get_broadcast/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const broadcasts = await response.json(); // Expect an array of broadcasts
                console.log('Fetched broadcasts:', broadcasts);

                // Clear any existing content in the ID-specific list
                broadcastListId.innerHTML = '';

                // Check if there are broadcasts
                if (!broadcasts || broadcasts.length === 0) {
                    broadcastListId.innerHTML = `
                        <li class="list-group-item list-group-item-black text-center text-muted">
                            <strong>No broadcasts found from this club or association</strong>
                        </li>
                    `;
                    return; // Exit the function if no broadcasts are found
                }

                // Loop through the broadcasts and create list items
                broadcasts.forEach(broadcast => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item list-group-item-black mb-4 border border-dark bg-light py-3';
                    listItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="mb-1">${broadcast.title}</h5>
                            <div class="text-muted quick-links">
                                <span>${broadcast.broadcast_date}</span><br />
                                <span>${broadcast.broadcast_time}</span>
                            </div>
                        </div>
                        <hr />
                        <p class="mb-0">${broadcast.description}</p>
                    `;
                    broadcastListId.appendChild(listItem);
                });
            } catch (error) {
                console.error('Error fetching broadcasts by ID:', error);
                broadcastListId.innerHTML = `
                    <li class="list-group-item list-group-item-black text-center text-danger">
                        <strong>Error loading broadcasts. Please try again later.</strong>
                    </li>
                `;
            }
        }

        fetchBroadcastById(id); // Fetch broadcasts by ID if ID is present in the URL
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const broadcastList = document.getElementById('broadcast-list-id');
    const broadcastSectionContainer = document.getElementById('broadcast-section-container');

    function adjustBroadcastScroll() {
        const items = broadcastList.querySelectorAll('.list-group-item'); // Get all broadcast items
        if (items.length > 2) {
            // Enable scrolling if more than 2 items
            broadcastList.style.overflowY = 'auto';
            broadcastList.style.maxHeight = '530px'; // Adjust height if needed
        } else {
            // Disable scrolling for 2 or fewer items
            broadcastList.style.overflowY = 'hidden';
            broadcastList.style.maxHeight = 'none';
        }
    }

    // Call the function initially
    adjustBroadcastScroll();

    // Optionally, if broadcasts are dynamically added
    const observer = new MutationObserver(adjustBroadcastScroll);
    observer.observe(broadcastList, { childList: true });
});


//------------------------------------------------------//

// Asociacion and club page reference js
// Activity functionality

//------------------------------------------------------//

async function fetchActivityByAssociationId() {
    // Get the association ID from the URL parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('No association ID found in the URL parameters.');
        return;
    }

    try {
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_activity_by_id/${id}`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched activities:', data); // Log the activity data

        // Check if there are activity images to update the grid
        if (data.activity_images && data.activity_images.length > 0) {
            updateGrid(data.activity_images);
        } else {
            console.warn('No activity images found for this association.');
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

// Function to update the Masonry grid with activity images
function updateGrid(activityImages) {
    const grid = document.querySelector('.grid');
    grid.innerHTML = ''; // Clear the grid before adding new images

    // Add images to the grid
    activityImages.forEach(imageUrl => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Activity Image';
        gridItem.appendChild(img);
        grid.appendChild(gridItem);
    });

    // Reinitialize Masonry layout after adding images
    imagesLoaded(grid, function() {
        var masonry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true
        });

        masonry.layout(); // Force layout
    });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', fetchActivityByAssociationId);


//------------------------------------------------------//

// Asociacion and club page reference js
// Calendar functionality

//------------------------------------------------------//

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar'); // Calendar container

    // Extract the association_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedAssociationId = urlParams.get('id'); // Get the `id` parameter
    console.log('Selected Association ID for calendar:', selectedAssociationId);

    // Initialize the FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es', // Set locale to Spanish
        timeZone: 'America/La_Paz',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [], // Start with an empty events array
        eventClick: function (info) {
            // Extraer detalles del evento clicado
            const eventTitle = info.event.title || 'Sin título';
            const eventDescription = info.event.extendedProps.description || 'Sin descripción';
            const eventDate = info.event.start 
                ? info.event.start.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                : 'Sin fecha';

            console.log('Evento clicado:', {
                title: eventTitle,
                description: eventDescription,
                date: eventDate
            });

            // Usar SweetAlert2 para mostrar el modal
            Swal.fire({
                title: eventTitle,
                html: `
                <div style="text-align: justify !important;">
                    <p><strong>Descripción:</strong> ${eventDescription}</p>
                    <p><strong>Fecha:</strong> ${eventDate}</p>
                </div>
                `,
                //icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }
    });

    console.log('Calendar initialized.');
    calendar.render(); // Render the calendar immediately

    // Fetch events from the API and refresh the calendar
    function loadEvents() {
        console.log('Fetching events for Association ID:', selectedAssociationId);

        if (!selectedAssociationId) {
            console.warn('No Association ID found in the URL.');
            return; // Do not attempt to fetch events if no association ID
        }

        fetch(`https://ot1.ojedatech.com/api/api/get_events/${selectedAssociationId}`)
            .then(response => {
                console.log('API Response Status:', response.status);

                if (!response.ok) {
                    throw new Error('Error al cargar eventos: ' + response.statusText);
                }

                return response.json();
            })
            .then(events => {
                console.log('Fetched Events:', events);

                // Format events for FullCalendar
                const formattedEvents = events.map(event => {
                    console.log('Original Event:', event); // Debug each raw event
                    return {
                        id: event.id,
                        title: event.event_title,
                        start: new Date(event.event_date).toISOString(), // Convert to ISO format
                        description: event.description
                    };
                });

                console.log('Adding events to calendar:', formattedEvents);

                // Refresh the calendar events
                calendar.removeAllEvents(); // Remove all existing events
                formattedEvents.forEach(event => {
                    calendar.addEvent(event); // Add each event individually
                });

                console.log('Calendar updated with new events.');
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }

    // Load events after the calendar is initialized
    loadEvents();

    // Set up a periodic refresh (optional)
    setInterval(() => {
        console.log('Refreshing events...');
        loadEvents();
    }, 5000); // Refresh every 60 seconds

    // Debug: Log the browser's timezone
    console.log('Browser Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
});



//------------------------------------------------------//

// Asociacion and club page reference js
// Board member functionality

//------------------------------------------------------//


function formatSafeTitle(title) {
    const trimmedTitle = title.trim();

    // Replace all spaces with underscores
    const formattedTitle = trimmedTitle.replace(/ /g, "_");

    return formattedTitle;
}

async function fetchBoardMembers(id) {
    try {
        console.log("Fetching board members for association ID:", id);
        const response = await fetch(`https://ot1.ojedatech.com/api/api/get_board_members/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const boardData = await response.json();
        console.log('Fetched board members data:', boardData);

        // Ensure the members array exists
        if (!boardData.members || boardData.members.length === 0) {
            console.log("No board members found.");
            document.getElementById('board-members').innerText = 'No board members available.';
            return;
        }

        // Mapping of roles to Spanish translations
        const roleTranslations = {
            president: "Presidente",
            vicepresident: "Vicepresidente",
            secretary: "Secretario",
            treasurer: "Tesorero",
            vocal_1: "Vocal 1",
            vocal_2: "Vocal 2",
            vocal_3: "Vocal 3"
        };

        // Construct HTML for board members dynamically
        let boardHtml = `<div class="row text-center">`;

        // Use the association title and format it with underscores
        const safeTitle = formatSafeTitle(boardData.title); // Custom function for safeTitle formatting

        boardData.members.forEach((member, index) => {
            // Construct the image URL correctly for each member based on their role
            let imageUrl = `https://ot1.ojedatech.com/api//uploads/${safeTitle}/board/${member.role}.png`;
            
            // If the role is 'vocal_1', 'vocal_2', 'vocal_3', use vocal1.png, vocal2.png, vocal3.png
            if (member.role.startsWith("vocal_")) {
                const vocalIndex = member.role.split("_")[1]; // Get the index from 'vocal_1'
                imageUrl = `https://ot1.ojedatech.com/api//uploads/${safeTitle}/board/vocal${vocalIndex}.png`;
            }
            
            console.log(`Loading image for ${member.role}: ${imageUrl}`); // Log the URL for each role

            // Translate the role to Spanish
            const roleInSpanish = roleTranslations[member.role] || member.role;

            boardHtml += `
                <div class="col-6 col-md-3 mb-4 circle-wrapper">
                    <div class="circle-item">
                        <img src="${imageUrl}" alt="${member.name}" class="img-fluid rounded-circle">
                    </div>
                    <p class="circle-text mt-2">${roleInSpanish}: ${member.name}</p>
                </div>
            `;
            
            // Close the row after every 4 members
            if ((index + 1) % 4 === 0) {
                boardHtml += `</div><div class="row text-center">`;
            }
        });

        boardHtml += `</div>`; // Close the final row

        // Insert the HTML into the page
        const boardMembersElement = document.getElementById('board-members');
        if (boardMembersElement) {
            boardMembersElement.innerHTML = boardHtml;
            console.log("Board members HTML inserted into the page.");
        } else {
            console.error("Element with id 'board-members' not found.");
        }

    } catch (error) {
        console.error('Error fetching board members:', error);
        document.getElementById('board-members').innerText = 'Error loading board members.';
    }
}
