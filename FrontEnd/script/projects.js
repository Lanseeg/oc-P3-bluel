"use strict";

//FILTERS & GALLERY
/**
 * CALL DISPLAY FUNCTIONS WHEN API DATA IS READY ON utils.js
 * 
 * @param {Array} data - An array of work objects used to populate the gallery
 */
document.addEventListener("DOMContentLoaded", async () => {
    await initializeData();
    if (works.length > 0) {
        displayGallery(works);
        createFilters(categories, works);
    }
});

async function checkAuthToken() {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        injectEditElements();
    }
}

// Inject edit elements if user logged in
function injectEditElements() {
    // Inject editBtn
    const editBtn = document.createElement('span');
    editBtn.id = 'editBtn';
    editBtn.innerHTML = '<a href="#"><i class="fa-regular fa-pen-to-square"></i>modifier</a>';
    const portfolioTitle = document.querySelector('#js-portfolio h2');
    portfolioTitle.appendChild(editBtn);

    document.getElementById('editBtn').addEventListener('click', async () => {
        // Display & populate modal from modal.js
        createModal(modalWindow1);
    });

    // Edit mode top bar
    const editModeBar = document.createElement('div');
    editModeBar.id = 'editModeBar';
    editModeBar.innerHTML = '<a href="#"><i class="fa-regular fa-pen-to-square"></i> mode édition</a>';

    document.body.prepend(editModeBar);

    editModeBar.addEventListener('click', async () => {
        createModal(modalWindow1);
    });
}

// Check for auth token on page load
checkAuthToken();

/**
 * CREATE GALLERY (working with getWorks on utils.js)
 * 
 * @param {Array} data - An array of work objects used to populate the gallery
 */
function displayGallery(works) {
    galleryDiv.innerHTML = "";
    works.forEach((item) => {

        //Safeguard
        if (!item.category || !item.category.name) {
            console.error('Invalid category for item:', item);
            return;
        }

        const articleCard = document.createElement("article");
        articleCard.classList.add("articleCard");
        articleCard.setAttribute("data-category", item.category.name);

        const cardImg = document.createElement("img");
        cardImg.src = item.imageUrl;
        cardImg.alt = item.title;

        const cardTitle = document.createElement("figcaption");
        cardTitle.textContent = item.title;

        articleCard.appendChild(cardImg);
        articleCard.appendChild(cardTitle);

        galleryDiv.appendChild(articleCard);
    });
}

/**
 * CREATE FILTERS (working with getCategories on utils.js)
 * 
 * @param {Array} categories - An array of category objects used to create filter buttons
 * @param {Array} works - An array of work objects used to check if categories have projects
 * 
 * Note: Hides filters if the user is logged in or there are no projects for a category
 */
function createFilters(categories, works) {
    // If user is logged in, do not show the filters
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        return;
    }

    // Create filter container
    const filtersDiv = document.createElement("div");
    filtersDiv.id = "filters";
    filtersDiv.classList.add('filters');

    // "Tous" (All) filter button
    if (works.length > 0) {
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.addEventListener("click", () => filterGallery("Tous"));
        filtersDiv.appendChild(allButton);
    }

    // Only create filter buttons for non-empty categories
    categories.forEach(category => {
        const worksCheck = works.some(work => work.category.name === category.name);

        if (worksCheck) {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.addEventListener("click", () => filterGallery(category.name));
            filtersDiv.appendChild(button);
        }
    });

    // Check filter buttons and append
    if (filtersDiv.children.length > 0) {
        portfolioSection.insertBefore(filtersDiv, galleryDiv);
    }
}

/**
 * Filters the gallery based on the selected category.
 * 
 * @param {String} category
 */
function filterGallery(category) {

    const articles = galleryDiv.querySelectorAll(".articleCard");
    const buttons = document.querySelectorAll('.filters button');

    articles.forEach(article => {
        if (category === "Tous" || article.getAttribute("data-category") === category) {
            article.style.display = "block";
        } else {
            article.style.display = "none";
        }
    });

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = Array.from(buttons).find(button => button.textContent === category || (category === "Tous" && button.textContent === "Tous"));
    if (activeButton) {
        activeButton.classList.add('active');
    }
}