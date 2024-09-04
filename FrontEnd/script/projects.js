"use strict";

//FILTERS & GALLERY
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
        console.log("Can't retrieve categories");
    }
    if (works.length > 0) {
        displayGallery(works);
    } else {
        console.log("Can't retrieve works");
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
        // Safeguard to ensure category exists
        if (!item.category || !item.category.name) {
            console.error('Invalid category for item:', item);
            return;
        }

        // Create article card
        const articleCard = document.createElement("article");
        articleCard.classList.add("articleCard");
        articleCard.setAttribute("data-category", item.category.name);

        // Create an image element for the card
        const cardImg = document.createElement("img");
        cardImg.src = item.imageUrl;
        cardImg.alt = item.title;

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
 * @param {Array} categories - An array of category objects used to create filter buttons
 * 
 * Note: Hides filters if the user is logged in (requires security.js)
 */
function createFilters(categories) {
    // If user logged in do not show the filters
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        console.log("User is logged in, hiding filters.");
        return;
    }

    const filtersDiv = document.createElement("div");
    filtersDiv.id = "filters";
    filtersDiv.classList.add('filters');

    //"All" button
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => filterGallery("Tous"));
    filtersDiv.appendChild(allButton);

    // Create a button for each category
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.addEventListener("click", () => filterGallery(category.name));
        filtersDiv.appendChild(button);
        console.log("category:" + category.name);
    });

    // Insert the filters container before gallery
    portfolioSection.insertBefore(filtersDiv, galleryDiv);
}

/**
 * Filters the gallery based on the selected category.
 * 
 * @param {String} category
 */
function filterGallery(category) {
    //Declare works and filter buttons
    const articles = galleryDiv.querySelectorAll(".articleCard");
    const buttons = document.querySelectorAll('.filters button');
    console.log(`Filter selected: ${category}`);
    //Logic to display or not the work
    articles.forEach(article => {
        if (category === "Tous" || article.getAttribute("data-category") === category) {
            article.style.display = "block";
        } else {
            article.style.display = "none";
        }
    });
    // Color the active filter
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = Array.from(buttons).find(button => button.textContent === category || (category === "Tous" && button.textContent === "Tous"));
    if (activeButton) {
        activeButton.classList.add('active');
    }
}
