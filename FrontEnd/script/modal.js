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
    const flexSpace = document.createElement('div');
    flexSpace.classList.add('modal-flex-space');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.title = 'Close';
    closeButton.innerHTML = '&times;';

    header.appendChild(flexSpace);
    header.appendChild(closeButton);

    // Add close button functionality
    closeButton.addEventListener('click', () => {
        closeModal(document.querySelector('#edit-modal'));
        console.log("Closing modal clicking X");
    });

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

    // Listen to add-picture-btn
    addPictureButton.addEventListener('click', () => {
        createModal(modalWindow2);
        console.log("Opening modal 2");
    });

    // Return any elements for later access
    return { galleryRoll, addPictureButton, closeButton };
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

        console.log(`Adding image: ${item.title} in admin Gallery`);
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

function modalWindow2(header, content, footer, closeModal) {
    // HEADER
    const backButton = document.createElement('button');
    backButton.classList.add('back');
    backButton.title = 'Back';
    backButton.style.display = 'inline'; // Show the back button in window 2
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

    // Add close button functionality
    closeButton.addEventListener('click', () => {
        closeModal(document.querySelector('#edit-modal'));
        console.log("Closing modal clicking X");
    });

    // Add go back to window 1 (back arrow)
    backButton.addEventListener('click', () => {
        createModal(modalWindow1);
        console.log("Opening modal");
    });

    // CONTENT
    const galleryTitle = document.createElement('h1');
    galleryTitle.id = 'gallery-edit-title';
    galleryTitle.textContent = 'Ajout photo';

    content.appendChild(galleryTitle);

    // Calls createPhotoForm
    const photoFormSection = createPhotoForm(categories);
    content.appendChild(photoFormSection);
    console.log("Called photoFormSection functin");

    // You can add your form submission logic here, for example:
    // httpPostImage(url, token, formData);

    // You can add your form submission logic here, for example:
    // httpPostImage(url, token, formData);


    /*
    return { galleryRoll, addPictureButton, backButton, closeButton };
    */
}

/**
 * Creates and returns a form section for adding a photo.
 * 
 * @param {Array} categories - Array of category objects to populate the category dropdown.
 * @returns {HTMLElement} - The form section element.
 */
function createPhotoForm(categories) {
    const addPhotoContent = document.createElement('div');
    addPhotoContent.classList.add('add-photo-content');

    const form = document.createElement('form');
    form.id = 'photoForm';

    // Upload box now inside the form
    const uploadBox = document.createElement('div');
    uploadBox.classList.add('upload-box');

    const iconImg = document.createElement('i');
    iconImg.classList.add('fa-regular', 'fa-image');
    iconImg.id = 'iconImg';

    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.id = 'image';
    uploadInput.name = 'image';
    uploadInput.accept = '.jpg, .png';
    uploadInput.required = true;

    const fileUploadNote = document.createElement('p');
    fileUploadNote.id = 'file-upload-note';
    fileUploadNote.textContent = 'jpg, png : 4mo max';

    uploadBox.appendChild(iconImg);
    uploadBox.appendChild(uploadInput);
    uploadBox.appendChild(fileUploadNote);

    // Append the upload box to the form
    form.appendChild(uploadBox);

    const formGroup1 = document.createElement('div');
    formGroup1.classList.add('form-group');

    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'photoTitle');
    labelTitle.textContent = 'Titre';

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.id = 'title';
    inputTitle.name = 'title';
    inputTitle.maxLength = 60;
    inputTitle.required = true;

    formGroup1.appendChild(labelTitle);
    formGroup1.appendChild(inputTitle);

    const formGroup2 = document.createElement('div');
    formGroup2.classList.add('form-group');

    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'photoCategory');
    labelCategory.textContent = 'Catégorie';

    const selectCategory = document.createElement('select');
    selectCategory.id = 'category';
    selectCategory.name = 'category';
    selectCategory.required = true;
    
    // Dynamically populate the select options based on categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // Use the category ID as the value
        option.textContent = category.name; // Display the category name
        selectCategory.appendChild(option);
    });


    formGroup2.appendChild(labelCategory);
    formGroup2.appendChild(selectCategory);

    const borderBottom = document.createElement('div');
    borderBottom.classList.add('border-bottom');

    form.appendChild(formGroup1);
    form.appendChild(formGroup2);
    form.appendChild(borderBottom);

    // Create the Submit Button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('submit-btn');
    submitButton.textContent = 'Valider';

    form.appendChild(submitButton);

    // Append the form to the modal content section
    addPhotoContent.appendChild(form);

    //check authToken on console LOG - to remove after -
    console.log(authToken);

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        const formData = new FormData(form); // Create FormData object from the form
    
        // Log the FormData entries to ensure correct data is being sent
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        const works_endpoint = 'http://localhost:5678/api/works'; // The actual API endpoint
    
        try {
            const response = await httpPostImage(works_endpoint, authToken, formData);
            if (response.error) {
                console.error('Error uploading image:', response.message);
            } else {
                console.log('Image uploaded successfully:', response);
                // Additional logic here, e.g., updating the UI, redirecting, etc.
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    });
    console.log(form);
    return form;
}
