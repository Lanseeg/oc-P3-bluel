"use strict";

/**
 * CREATE MODAL & POPULATE
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

    // Create the modal container
    let editModal = document.createElement('aside');
    editModal.id = 'edit-modal'; // Set the ID for the modal container

    // Create the modal background
    let modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background'); // Add a background overlay for the modal

    // Create the modal window structure (header, content, footer)
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

    // Populate modal content with provided function (if any)
    if (populateModalFunction) {
        populateModalFunction(modalHeader, modalContent, modalFooter);
    } else {
        // If no content, add a default close button
        const defaultCloseButton = document.createElement('button');
        defaultCloseButton.classList.add('close');
        defaultCloseButton.title = 'Close';
        defaultCloseButton.innerHTML = '&times;';
        modalHeader.appendChild(defaultCloseButton);

        // Add event listener to the default close button
        defaultCloseButton.addEventListener('click', () => {
            closeModal(editModal);
        });
    }

    // Closing the modal
    // Close on click outside the modal window
    modalBackground.addEventListener('click', (e) => {
        if (e.target === modalBackground) {
            closeModal(editModal); // Close the modal if the background is clicked
        }
    });

    // Close on pressing Esc
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(editModal); // Close the modal if the Esc key is pressed
        }
    });

    /**
     * Close the modal with a fade-out effect.
     * 
     * @param {HTMLElement} modal - The modal element to be closed.
     */
    function closeModal(modal) {
        modal.querySelector('.modal-window').style.opacity = '0'; // Set opacity to 0 for fade-out
        setTimeout(() => {
            modal.classList.remove('show'); // Remove the 'show' class
            document.body.removeChild(modal); // Remove the modal from the DOM
        }, 500);
    }

    // Return references for future manipulation
    return { modal: editModal, backdrop: modalBackground, header: modalHeader, content: modalContent, footer: modalFooter };
}

// createModal example:
// createModal(modalWindow1);
// createModal(modalWindow1);

/**
 * MODAL WINDOW 1 (admin gallery & httpDELETE from utils.js)
 * to be used as a parameter in createModal()
 * 
 * @param {HTMLElement} header - The header element to be populated.
 * @param {HTMLElement} content - The content element to be populated.
 * @param {HTMLElement} footer - The footer element to be populated.
 */
function modalWindow1(header, content, footer) {
    // HEADER
    const backButton = document.createElement('button');
    backButton.classList.add('back'); // Add class for the back button
    backButton.title = 'Back'; // Set title attribute
    backButton.style.display = 'none'; // Initially hide the back button
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left" id="modal-return"></i>'; // Set the back button icon

    const flexSpace = document.createElement('div');
    flexSpace.classList.add('modal-flex-space'); // Add flexible space for header layout

    const closeButton = document.createElement('button');
    closeButton.classList.add('close'); // Add class for the close button
    closeButton.title = 'Close'; // Set title attribute
    closeButton.innerHTML = '&times;'; // Set the close button content

    header.appendChild(backButton);
    header.appendChild(flexSpace);
    header.appendChild(closeButton);

    // CONTENT
    const galleryTitle = document.createElement('h1');
    galleryTitle.id = 'gallery-edit-title'; // Set ID for the gallery title
    galleryTitle.textContent = 'Gallerie photo'; // Set text content for the title

    const galleryRoll = document.createElement('div');
    galleryRoll.classList.add('gallery-roll'); // Add class for the gallery roll

    content.appendChild(galleryTitle);
    content.appendChild(galleryRoll);
    const addPictureButton = document.createElement('button');
    addPictureButton.id = 'add-picture-btn'; // Set ID for the add photo button
    addPictureButton.textContent = 'Ajouter une photo'; // Set text content for the button
    addPictureButton.title = 'Ajouter une photo'; // Set title attribute

    content.appendChild(addPictureButton);

    // FOOTER

    // Return any elements for later access
    return { galleryRoll, addPictureButton, backButton, closeButton };
}

