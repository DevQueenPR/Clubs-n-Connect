//------------------------------------------------------//

// Index page reference js
// Carousel functionality

//------------------------------------------------------//
document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch news images and populate the carousel
    function fetchNewsImages() {
        fetch('https://ot1.ojedatech.com/api/api/get_all_news') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Log the API response to check its structure
                
                const carouselInner = document.getElementById('carouselInner');

                // Clear existing images in the carousel
                carouselInner.innerHTML = '';

                // Initialize a variable to track the first item
                let firstItem = true;

                // Iterate through the array of associations
                data.forEach(association => {
                    // Check if news_images exists and is an array
                    if (Array.isArray(association.news_images) && association.news_images.length > 0) {
                        association.news_images.forEach(image => {
                            const carouselItem = document.createElement('div');
                            carouselItem.className = 'carousel-item' + (firstItem ? ' active' : '');
                            firstItem = false; // Set first item as active

                            // Create the image element
                            const imgElement = document.createElement('img');
                            imgElement.src = image;
                            imgElement.className = 'd-block w-100'; // Bootstrap class for responsive images
                            imgElement.alt = 'News Image'; // Customize the alt text

                            // Append the image to the carousel item
                            carouselItem.appendChild(imgElement);
                            // Append the carousel item to the carousel inner
                            carouselInner.appendChild(carouselItem);
                        });
                    }
                });

                // Check if no images were found
                if (carouselInner.children.length === 0) {
                    const noImageMessage = document.createElement('div');
                    noImageMessage.className = 'carousel-item active'; // Make this item active
                    noImageMessage.textContent = 'No news images available.';
                    carouselInner.appendChild(noImageMessage);
                }
            })
            .catch(error => {
                console.error('Error fetching news images:', error);
                const carouselInner = document.getElementById('carouselInner');
                carouselInner.innerHTML = '<div class="carousel-item active">Error loading images.</div>';
            });
    }

    // Call the function to fetch images on page load
    fetchNewsImages();
});

//------------------------------------------------------//

// Index page reference js
// Broadcast functionality

//------------------------------------------------------//

document.addEventListener("DOMContentLoaded", function() {
    const broadcastList = document.getElementById('broadcast-list');

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

    fetchBroadcasts(); // Fetch all broadcasts when the page is loaded
});
