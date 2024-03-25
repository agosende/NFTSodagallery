let globalNftData = []; // Declare a global variable to hold the NFT data
        
async function loadNFTData() {
    console.log('Starting to load NFT data from CSV...');
    const response = await fetch('nft_data.csv');
    const csvText = await response.text();
    if (!response.ok) {
        console.error('Failed to fetch nft_data.csv', response.status, response.statusText);
        return [];
    }
    console.log('CSV data fetched successfully.');

    const rows = csvText.trim().split('\n');
    const headers = rows.shift().split(';').map(header => header.trim().toLowerCase().replace(/\s+/g, ''));
    console.log('Headers:', headers);

    const nftData = rows.map(row => {
        const values = row.split(';');
        let nft = {};
        values.forEach((value, index) => {
            const key = headers[index];
            nft[key] = value.trim();
        });
        return nft;
    }).filter(nft => nft.filepath && nft.name && nft.description && nft.family && nft.number);

    console.log(`Loaded ${nftData.length} NFTs.`);
    globalNftData = nftData; // Store the loaded NFT data in the global variable
    displayNFTs(globalNftData); // Call displayNFTs with the loaded data
}

let currentNftData = []; // Variable to store the current subset of NFTs being displayed, initially the same as globalNftData

function displayNFTs(nftData) {
    console.log('Displaying NFTs...');
    if (nftData.length === 0) {
        console.log('No NFT data to display.');
        return;
    }
    currentNftData = nftData; // Update the current displayed NFT data
    const gallery = document.getElementById('nftGallery');
    gallery.innerHTML = ''; // Clear the gallery before adding new items
    nftData.forEach((nft, index) => {
        const nftElement = document.createElement('div');
        nftElement.className = 'nft';
        nftElement.setAttribute('data-family', nft.family);

        // let additionalClasses = '';
        // if (nft.background === 'y') {
        //     additionalClasses += ' colorful-background';
        // }
        // if (nft.shaped === 'y') {
        //     additionalClasses += ' shaped-silhouette';
        // }
        // nftElement.classList += additionalClasses;

        nftElement.innerHTML = `
            <h3>#${nft.number} | ${nft.family}</h3>
            <img src="gallery/${nft.filepath}" alt="${nft.name}" style="width:100%; max-width:200px; height:auto;">
            <h3>${nft.name}</h3>
            <p> ${nft.description}</p>
            <p class="specs">Background: ${nft.background} 
                | Shaped: ${nft.shaped}</p>
                
        `;
        nftElement.addEventListener('click', () => {
            const modal = document.getElementById("nftModal");
            const modalImg = document.getElementById("modalImage");
            const captionText = document.getElementById("modalCaption");
            modal.style.display = "block";
            modalImg.src = `gallery/${nft.filepath}`;
            captionText.innerHTML = `<h3>${nft.name}</h3><p>${nft.description}</p>`;
        });
        nftElement.addEventListener('click', () => openModal(index)); // Pass the current index within the filtered data
        gallery.appendChild(nftElement);
         });

    const modal = document.getElementById('nftModal');
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    console.log('NFTs displayed successfully.');
}

function filterNFTs(family) {
    const filteredData = family === 'All' ? globalNftData : globalNftData.filter(nft => nft.family === family);
    displayNFTs(filteredData); // Display only the filtered NFTs
}

document.addEventListener('DOMContentLoaded', () => {
    loadNFTData(); // Load and display NFT data when the DOM is fully loaded

    // Set up filter buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const family = e.target.getAttribute('data-family');
            filterNFTs(family);
        });
    });
});
let currentSlideIndex = 0;

        // Inside the displayNFTs function, when setting up the click event listener for each NFT
nftElement.addEventListener('click', () => {
    openModal(globalNftData.indexOf(nft)); // Use the index of the nft in the globalNftData
});

// Corrected openModal function to reflect consistent modal ID usage
            function openModal(index) {
        const modal = document.getElementById('nftModal');
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('modalCaption');
        const nft = currentNftData[index];
        modal.style.display = "block";
        modalImg.src = `slider${nft.filepath}`;
        captionText.innerHTML = `
                    <h3>#${nft.number} | ${nft.family}</h3><h3>${nft.name}</h3><p>${nft.description}</p>
                    <p class="specs">Background: ${nft.background} 
                | Shaped: ${nft.shaped}</p>
        `;
        currentSlideIndex = index; // Set the current index based on the clicked NFT within the current subset
    }

    // Refinement in moveSlide to correctly navigate within the currentNftData
    function moveSlide(step) {
        let newIndex = currentSlideIndex + step;
        if (newIndex >= currentNftData.length) {
            newIndex = 0; // Wrap to the start
        } else if (newIndex < 0) {
            newIndex = currentNftData.length - 1; // Wrap to the end
        }
        openModal(newIndex);
    }

        // Close Modal functionality
        const modal = document.getElementById("nftModal");
        const span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        }