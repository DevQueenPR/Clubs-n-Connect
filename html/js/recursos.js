const apiUrl = 'https://ot1.ojedatech.com/api/api/get_all_references';

// Fetch and display references for the general page
async function fetchReferences() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const references = await response.json();
        const referenceList = document.getElementById('referenceList');

        if (referenceList) {
            referenceList.innerHTML = ''; // Clear the list first

            if (references.length === 0) {
                referenceList.innerHTML = '<li>No references available</li>';
                return;
            }

            references.forEach(reference => {
                if (reference.link_name && reference.link_url) {
                    const link = document.createElement('a');
                    link.href = reference.link_url;
                    link.target = '_blank'; // Opens in a new tab
                    link.className = 'reference-link'; // Styling for the clickable area
            
                    const listItem = document.createElement('li');
                    listItem.className = 'reference-item';
                    listItem.textContent = reference.link_name; // Display the link name
            
                    link.appendChild(listItem); // Nest the list item inside the link
                    referenceList.appendChild(link); // Add the link (with nested list item) to the list
                }
            });
            
        }
    } catch (error) {
        console.error('Error:', error);
        const referenceList = document.getElementById('referenceList');
        if (referenceList) {
            referenceList.innerHTML = `<li>Error loading references</li>`;
        }
    }
}

// Initialize the general page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('referenceList')) {
        fetchReferences(); // Load references for general view
    }
});


