//------------------------------------------------------//

// Asociaciones and clubs page reference js
// Entity functionality

//------------------------------------------------------//

let allAsociaciones = []; // Store all fetched associations

document.addEventListener("DOMContentLoaded", function () {
    const asociacionesList = document.getElementById('asociaciones-list');
    const clubsList = document.getElementById('clubs-list');

    if (asociacionesList) {
        fetchAsociaciones(asociacionesList, clubsList);
    } else {
        console.error('asociaciones-list element not found');
    }
});

// Function to fetch asociaciones and populate the DOM
async function fetchAsociaciones(asociacionesList, clubsList) {
    try {
        const response = await fetch('https://ot1.ojedatech.com/api/api/get_all_associations');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched asociaciones:', data);
        allAsociaciones = data; // Store fetched data

        // Clear the lists
        asociacionesList.innerHTML = '';
        clubsList.innerHTML = '';

        // Check the URL for the type parameter to display the correct cards
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'clubs') {
            showClubs(clubsList);
        } else {
            showAsociaciones(asociacionesList);
        }
    } catch (error) {
        console.error('Error fetching asociaciones:', error);
    }
}

//------------------------------------------------------//

// Asociaciones and clubs page reference js
// Shows clubs

//------------------------------------------------------//

function showClubs(clubsList) {
    // Clear any existing content
    clubsList.innerHTML = '';

    // Add title for Clubs
    const clubsTitle = document.createElement('h2');
    clubsTitle.innerText = 'Clubes';
    clubsTitle.className = 'title text-center my-4';
    clubsList.appendChild(clubsTitle);

    // Generate cards for each club
    allAsociaciones.forEach(asociacion => {
        if (asociacion.clasification === 2) { // Only clubs
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';

            card.innerHTML = `
    <div class="cards-entity-card position-relative clickable-card">
        <!-- Image wrapper -->
        <div class="cards-entity-img-wrapper">
            <img src="${asociacion.logo}" class="cards-entity-img-top" alt="Logo de ${asociacion.title}">
        </div>
        
        <!-- Card body -->
        <div class="cards-entity-body">
            <!-- Title -->
            <h5 class="cards-entity-title">${asociacion.title}</h5>

            <!-- Description -->
            <p class="cards-entity-description">
                ${asociacion.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>
        </div>
    </div>
            `;

            card.addEventListener('click', function () {
                window.location.href = `/asociacion.html?id=${asociacion.id}&type=club`;
            });

            clubsList.appendChild(card);
        }
    });
}

//------------------------------------------------------//

// Asociaciones and clubs page reference js
// Shows Asociaciones

//------------------------------------------------------//

// Function to show only associations
function showAsociaciones(asociacionesList) {
    // Clear any existing content
    asociacionesList.innerHTML = '';

    // Add title for Asociaciones
    const asociacionesTitle = document.createElement('h2');
    asociacionesTitle.innerText = 'Asociaciones';
    asociacionesTitle.className = 'title text-center my-4';
    asociacionesList.appendChild(asociacionesTitle);

    // Generate cards for each association
    allAsociaciones.forEach(asociacion => {
        if (asociacion.clasification === 1) { // Only associations
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
    <div class="cards-entity-card position-relative clickable-card">
        <!-- Image wrapper -->
        <div class="cards-entity-img-wrapper">
            <img src="${asociacion.logo}" class="cards-entity-img-top" alt="Logo de ${asociacion.title}">
        </div>
        
        <!-- Card body -->
        <div class="cards-entity-body">
            <!-- Title -->
            <h5 class="cards-entity-title">${asociacion.title}</h5>

            <!-- Description -->
            <p class="cards-entity-description">
                ${asociacion.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>
        </div>
    </div>
`;


//Prueba3
//             card.innerHTML = `
//     <div class="cards-entity-card position-relative clickable-card">
//         <!-- Top image wrapper -->
//         <div class="cards-entity-img-wrapper">
//             <img src="${asociacion.logo}" class="cards-entity-img-top" alt="Logo de ${asociacion.title}">
//         </div>
        
//         <!-- Body content -->
//         <div class="cards-entity-body">
//             <!-- Title -->
//             <h5 class="cards-entity-title">${asociacion.title}</h5>

//             <!-- Description (optional, if available) -->
//             <p class="cards-entity-description">
//                 ${asociacion.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
//             </p>
//         </div>
//     </div>
// `;

            

// Prueba2            
//             card.innerHTML = `
//    <div class="cards-entity-card position-relative clickable-card">
//        <!-- Top image wrapper -->
//        <div class="cards-entity-img-wrapper" style="background-image: url('${asociacion.logo}');">
//        </div>
      
//        <!-- Body content -->
//        <div class="cards-entity-body">
//            <!-- Title -->
//            <h5 class="cards-entity-title">${asociacion.title}</h5>

//            <!-- Description (optional, if available) -->
//            <p class="cards-entity-description">
//                ${asociacion.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
//            </p>
//        </div>
//    </div>
// `;
// Prueba 1
//             card.innerHTML = `
//     <div class="cards-entity-card position-relative clickable-card">
//         <!-- Top image wrapper -->
//         <div class="cards-entity-img-wrapper">
//             <img src="${asociacion.logo}" class="cards-entity-img-top logo-img" alt="Logo de ${asociacion.title}">
//         </div>
        
//         <!-- Body content -->
//         <div class="cards-entity-body">

//             <!-- Title -->
//             <h5 class="cards-entity-title">${asociacion.title}</h5>

//             <!-- Description (optional, if available) -->
//             <p class="cards-entity-description">
//                 ${asociacion.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
//             </p>
//         </div>
//     </div>
// `;

            // OG
            // card.innerHTML = `
            //     <div class="cards-entity-card position-relative clickable-card">
            //         <img src="${asociacion.logo}" class="cards-entity-img-top logo-img" alt="Logo de ${asociacion.title}">
            //         <div class="cards-entity-body text-center">
            //             <h5 class="cards-entity-title">${asociacion.title}</h5>
            //         </div>
            //     </div>
            // `;

            card.addEventListener('click', function () {
                window.location.href = `/asociacion.html?id=${asociacion.id}&type=asociacion`;
            });

            asociacionesList.appendChild(card);
        }
    });
}