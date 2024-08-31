"use strict";

// MODAL
/**
 * CREATE MODAL & POPULATE IT
 * 
 * @param {Function} [populateModalFunction] - An optional function that populates the header, content, and footer of the modal.
 * @returns {Object} An object containing references to the modal, backdrop, header, content, and footer.
 */
function createModal(populateModalFunction = null) {
    let body = document.querySelector('body');

    const existingModal = document.querySelector('#edit-modal');
    if (existingModal) {
        body.removeChild(existingModal);
    }

    // Modal container
    let editModal = document.createElement('aside');
    editModal.id = 'edit-modal'; // Set the ID for the modal container

    // Modal background
    let modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background'); // Add a background overlay for the modal

    // Modal window structure (header, content, footer)
    let modalWindow = document.createElement('div');
    modalWindow.classList.add('modal-window');

    let modalHeader = document.createElement('header');
    modalHeader.classList.add('modal-header');

    let modalContent = document.createElement('section');
    modalContent.classList.add('modal-content');

    let modalFooter = document.createElement('footer');
    modalFooter.classList.add('modal-footer');

    modalWindow.appendChild(modalHeader);
    modalWindow.appendChild(modalContent);
    modalWindow.appendChild(modalFooter);

    // Append the modal window to the background
    modalBackground.appendChild(modalWindow);
    // Assemble the complete modal
    editModal.appendChild(modalBackground);
    // Append the modal to the body
    body.appendChild(editModal);

    // Fade-in effect
    setTimeout(() => {
        modalWindow.style.opacity = '1';
    }, 10);

    /**
     * Close modal function with fade-out
     * 
     * @param {HTMLElement} modal - The modal element to be closed.
     */
    function closeModal(modal) {
        if (!document.body.contains(modal)) {
            return; // Exit the function if the modal is not in the DOM
        }
        modal.querySelector('.modal-window').style.opacity = '0'; // Set opacity to 0 for fade-out
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.classList.remove('show'); // Remove the 'show' class
                document.body.removeChild(modal); // Remove the modal from the DOM
            }
        }, 500);
    }

    // Populate modal content with provided function (if any)
    if (populateModalFunction) {
        populateModalFunction(modalHeader, modalContent, modalFooter, closeModal);
    }

    // Closing the modal
    // Close on click outside the modal window
    modalBackground.addEventListener('click', (e) => {
        if (e.target === modalBackground) {
            closeModal(editModal);
            console.log("Closing modal clicking outside");
        }
    });

    // Close on pressing Esc. key
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(editModal);
            console.log("Closing modal pressing Esc.");
        }
    });

    // Return references for future manipulation
    return { modal: editModal, backdrop: modalBackground, header: modalHeader, content: modalContent, footer: modalFooter };
}

/**
 * MODAL WINDOW 1 (admin gallery & httpDELETE from utils.js)
 * To be used as a parameter in createModal()
 * 
 * @param {HTMLElement} header
 * @param {HTMLElement} content
 * @param {HTMLElement} footer
 */
function modalWindow1(header, content, footer, closeModal) {
    // HEADER
    const backButton = document.createElement('button');
    backButton.classList.add('back');
    backButton.title = 'Back';
    backButton.style.display = 'none'; // Hide the back button in window 1
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left" id="modal-return"></i>'; // Set the back button icon

    const flexSpace = document.createElement('div');
    flexSpace.classList.add('modal-flex-space');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.title = 'Close';
    closeButton.innerHTML = '&times;';

    header.appendChild(backButton);
    header.appendChild(flexSpace);
    header.appendChild(closeButton);

    // CONTENT
    const galleryTitle = document.createElement('h1');
    galleryTitle.id = 'gallery-edit-title';
    galleryTitle.textContent = 'Gallerie photo';

    // GALLERY ROLL (adminGallery)
    const galleryRoll = document.createElement('div');
    galleryRoll.classList.add('gallery-roll');

    content.appendChild(galleryTitle);
    content.appendChild(galleryRoll);

    const addPictureButton = document.createElement('button');
    addPictureButton.id = 'add-picture-btn';
    addPictureButton.textContent = 'Ajouter une photo';
    addPictureButton.title = 'Ajouter une photo';

    content.appendChild(addPictureButton);

    // Call populateAdminGallery with works from utils.js
    adminGallery(galleryRoll, works);

    // Add close button functionality
    closeButton.addEventListener('click', () => {
        closeModal(document.querySelector('#edit-modal'));
        console.log("Closing modal clicking X");
    });

    // Return any elements for later access
    return { galleryRoll, addPictureButton, backButton, closeButton };
}

/**
 * Populates the admin gallery (in MODAL WINDOW 1)
 * 
 * @param {HTMLElement} galleryRoll - The gallery container element.
 * @param {Array} works - The array of works from utils.js.
 */
function adminGallery(galleryRoll, works) {
    if (!galleryRoll) {
        console.error("Gallery container not found.");
        return;
    }

    galleryRoll.innerHTML = "";

    // Populate the gallery with admin items
    works.forEach((item) => {
        const articleAdmin = document.createElement("article");
        articleAdmin.classList.add("article-admin");
        articleAdmin.setAttribute("data-category", item.category.name);

        const adminImg = document.createElement("img");
        adminImg.src = item.imageUrl;
        adminImg.alt = item.title;

        // Add a delete trash icon
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash', 'delete-icon');
        deleteIcon.title = 'Delete';

        // Append the image and delete icon to the article
        articleAdmin.appendChild(adminImg);
        articleAdmin.appendChild(deleteIcon);

        // Append the article to the gallery roll
        galleryRoll.appendChild(articleAdmin);

        // Delete work if trash icon is clicked
        deleteItem(deleteIcon, articleAdmin, item.id, authToken);
    });
}

/**
 * DELETE ITEM: Handles the deletion of an item with a cancel option.
 * In use in adminGallery
 * 
 * @param {HTMLElement} deleteIcon - The element that triggers the deletion.
 * @param {HTMLElement} articleAdmin - The item to be deleted.
 * @param {String} itemId - The ID of the item to delete.
 * @param {String} authToken - The authentication.
 */
function deleteItem(deleteIcon, articleAdmin, itemId, authToken) {
    deleteIcon.addEventListener('click', async (event) => {
        event.preventDefault();

        let cancelDeletion = false;
        console.log("Asking for work deletion, waiting...");

        const cancelNotification = document.createElement('div');
        cancelNotification.classList.add('loading-indicator', 'error');
        cancelNotification.innerHTML = `Suppression... <button id="cancelDelete">Annuler</button>`;
        document.body.appendChild(cancelNotification);

        const cancelButton = document.getElementById('cancelDelete');

        cancelButton.addEventListener('click', () => {
            cancelDeletion = true;
            showNotification('Suppression annulée.', 'info');
            console.log("Deletion cancelled by user");
            cancelNotification.remove();
        });

        await new Promise((resolve) => setTimeout(resolve, 4300));

        if (!cancelDeletion) {
            const result = await httpDelete(works_endpoint, itemId, authToken);
            cancelNotification.remove();

            if (result) {
                showNotification('Photo deleted successfully', 'info');
                console.log("Deletion successful");
                articleAdmin.remove();
            } else {
                showNotification('Error deleting the photo', 'error');
                console.log("Work couldn't be deleted (backend error)");
            }
        } else {
            cancelNotification.remove();
        }
    });
}