"use strict";

/**
 * CALL DISPLAY FUNCTIONS WHEN API DATA IS READY ON utils.js
 * 
 * @param {Array} data - An array of work objects used to populate the gallery
 */
document.addEventListener("DOMContentLoaded", async () => {
    await initializeData();
    if (categories.length > 0) {
        createFilters(categories);
    } else {
        console.log("Les catégories ne sont pas disponibles.");
    }
    if (works.length > 0) {
        displayGallery(works);
    } else {
        console.log("Les travaux ne sont pas disponibles.");
    }
});

/**
 * CREATE GALLERY (working with getWorks on utils.js)
 * 
 * @param {Array} data - An array of work objects used to populate the gallery
 */
function displayGallery(works) {
    galleryDiv.innerHTML = "";
    works.forEach((item) => {
        // Create article card
        const articleCard = document.createElement("article");
        articleCard.classList.add("articleCard");
        articleCard.setAttribute("data-category", item.category.name);
        // Create an image element for the card
        const cardImg = document.createElement("img");
        cardImg.src = item.imageUrl;
        cardImg.alt = item.title;
        // Create a placeholder
        cardImg.onerror = () => {
            cardImg.src = "path/to/placeholder-image.png"; // Remplace par le chemin de ton image de secours
            cardImg.alt = "Image non disponible";
            console.log(`Failed to load image for: ${item.title} - URL: ${item.imageUrl}`);
        };
        console.log(`Adding image: ${item.title} - URL: ${item.imageUrl}`);
        // Create a figcaption
        const cardTitle = document.createElement("figcaption");
        cardTitle.textContent = item.title;
        // Append the image and title elements to the article element
        articleCard.appendChild(cardImg);
        articleCard.appendChild(cardTitle);

        // Append the article element to the gallery div
        galleryDiv.appendChild(articleCard);
    });
}

/**
 * CREATE FILTERS (working with getCategories on utils.js)
 * 
 * @param {Array} data - An array of category objects used to create filter buttons
 * 
 * Note: +++ TO ADD +++: hide filters if logged in (requires security.js)
 */
function createFilters(categories) {
    // Create a container for the filters
    const filtersDiv = document.createElement("div");
    filtersDiv.id = "filters";
    filtersDiv.classList.add('filters');
    // Add an "All" button to show all items
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => filterGallery("Tous"));
    filtersDiv.appendChild(allButton);
    // Create a button for each category
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name; // Utilisation de category.name si les catégories ont cette propriété
        button.addEventListener("click", () => filterGallery(category.name));
        filtersDiv.appendChild(button);
        console.log("category:" + category.name);
    });
    // Insert the filters container before the gallery
    portfolioSection.insertBefore(filtersDiv, galleryDiv);
}

/**
 * Filters the gallery based on the selected category.
 * 
 * @param {String} category
 */
function filterGallery(category) {
    const articles = galleryDiv.querySelectorAll(".articleCard");
    const buttons = document.querySelectorAll('.filters button');
    console.log(`Filter selected: ${category}`);
    articles.forEach(article => {
        if (category === "Tous" || article.getAttribute("data-category") === category) {
            article.style.display = "block";
        } else {
            article.style.display = "none";
        }
    });
    // ACTIVE FILTERS
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = Array.from(buttons).find(button => button.textContent === category || (category === "Tous" && button.textContent === "Tous"));
    if (activeButton) {
        activeButton.classList.add('active');
    }
}
