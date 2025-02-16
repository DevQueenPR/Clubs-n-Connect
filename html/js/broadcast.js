document.addEventListener("DOMContentLoaded", function() {
    const broadcastList = document.getElementById('broadcast-list');
    const broadcastListId = document.getElementById('broadcast-list-id');

    // Get the ID from the URL parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Fetch the 'id' parameter from the URL

    async function fetchBroadcasts() {
        try {
            const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_broadcasts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const broadcasts = await response.json();

            // Clear any existing content
            broadcastList.innerHTML = '';

            // Check if there are no broadcasts
            if (broadcasts.length === 0) {
                broadcastList.innerHTML = `
                    <li class="list-group-item list-group-item-black text-center text-muted">
                        <strong>No broadcasts available at the moment.</strong>
                    </li>
                `;
                return; // Exit the function if no broadcasts are available
            }


            // Loop through the broadcasts and create list items
            broadcasts.forEach(broadcast => {
                const listItem = document.createElement('li');
                // Adjust height by increasing padding
                listItem.className = 'list-group-item list-group-item-black mb-4 border border-dark bg-light py-3';
                listItem.innerHTML = `
                <div class="d-flex justify-content-between">
            <h5 class="mb-1 color-white">${broadcast.title}</h5>
             <div class="text-muted color-white">
            <span>${broadcast.broadcast_date}</span><br />
            <span>${broadcast.broadcast_time}</span>
        </div>
        </div>
        <h6 class="mb-1 color-white">${broadcast.asociacion_title}</h6>
        <hr />
        <p class="mb-0 color-white">${broadcast.description}</p>
    `;
            


                // Append the list item to the broadcast list
                broadcastList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching broadcasts:', error);
            broadcastList.innerHTML = `
                <li class="list-group-item list-group-item-black text-center text-danger">
                    <strong>Error loading broadcasts. Please try again later.</strong>
                </li>
            `;
        }
    }

    async function fetchBroadcastById(id) {
        console.log(`ID before fetching broadcast: ${id}`); // Check what ID you're using
    
        try {
            console.log(`Fetching broadcasts with ID: ${id}`); // Log the ID for debugging
            const response = await fetch(`https://ot1.ojedatech.com/api/api/get_broadcast/${id}`);
            
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`); // Log HTTP error status
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const broadcasts = await response.json(); // Expect an array of broadcasts
            console.log('Fetched broadcasts:', broadcasts); // Log the response here
    
            // Clear any existing content in the ID-specific list
            if (broadcastListId) {
                broadcastListId.innerHTML = '';
            } else {
                console.error('broadcastListId element not found in the DOM');
                return; // Exit if the element is not found
            }
    
            // Check if there are broadcasts
            if (!broadcasts || broadcasts.length === 0) {
                broadcastListId.innerHTML = `
                    <li class="list-group-item list-group-item-black text-center text-muted">
                        <strong>No broadcasts found from this club or association</strong>
                    </li>
                `;
                console.log(`No broadcasts found with ID: ${id}`); // Log if no broadcasts are found
                return; // Exit the function if no broadcasts are found
            }
    
            // Loop through the broadcasts and create list items
            broadcasts.forEach(broadcast => {
                // Create a list item for the broadcast
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
                    <hr /> <!-- Horizontal line -->
                    <p class="mb-0">${broadcast.description}</p>

                `;
    
                // Append the list item to the ID-specific broadcast list
                if (broadcastListId) {
                    broadcastListId.appendChild(listItem);
                    console.log(`Broadcast details for ID ${id}:`, listItem); // Log the details of the fetched broadcast
                } else {
                    console.error('broadcastListId element not found in the DOM');
                }
            });
        } catch (error) {
            console.error('Error fetching broadcasts by ID:', error);
            if (broadcastListId) {
                broadcastListId.innerHTML = `
                    <li class="list-group-item list-group-item-black text-center text-danger">
                        <strong>Error loading broadcasts. Please try again later.</strong>
                    </li>
                `;
            }
        }
    }
    
    

    fetchBroadcasts(); // Fetch all broadcasts
    if (id) { // Check if ID exists
        fetchBroadcastById(id); // Fetch broadcast by ID
    }
});

