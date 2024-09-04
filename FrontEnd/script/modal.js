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
 * Needs adminGallery, deleteItem & showNotification
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
    const borderBottom = document.createElement('div');

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
        deleteIcon.title = 'Supprimer';

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
 * In use in adminGallery. Needs showNotification & displayGallery.
 * 
 * @param {HTMLElement} deleteIcon - The element that triggers the deletion.
 * @param {HTMLElement} articleAdmin - The item to be deleted.
 * @param {String} itemId - The ID of the item to delete.
 * @param {String} authToken - The authentication.
 */
function deleteItem(deleteIcon, articleAdmin, itemId, authToken) {
    deleteIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        
        // Utiliser window.confirm pour demander la confirmation
        const confirmDeletion = window.confirm("Confirmer la suppression ?");
        
        if (confirmDeletion) {
            // Call httpDelete si l'utilisateur confirme la suppression
            const result = await httpDelete(works_endpoint, itemId, authToken);
            
            if (result) {
                showNotification('Photo supprimée avec succès', 'info');
                articleAdmin.remove();
                
                // Met à jour la galerie
                works = works.filter(work => work.id !== itemId);
                displayGallery(works);
            } else {
                showNotification('Erreur lors de la suppression', 'error');
            }
        } else {
            // Si l'utilisateur annule la suppression
            showNotification('Suppression annulée.', 'info');
        }
    });
}


/**
 * Populates the admin gallery (in MODAL WINDOW 2)
 * Needs createPhotoForm
 * 
 * @param {HTMLElement} header - The header element of the modal where buttons are added.
 * @param {HTMLElement} content - The content element of the modal where the form is inserted.
 * @param {HTMLElement} footer - The footer element of the modal (not used in this window).
 * @param {Function} closeModal - A callback function to close the modal.
 */
function modalWindow2(header, content, footer, closeModal) {
    // HEADER
    const backButton = document.createElement('button');
    backButton.classList.add('back');
    backButton.title = 'Back';
    backButton.style.display = 'inline'; // Display the back button in the second modal
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
        closeModal(document.querySelector('#edit-modal')); // Close the modal when clicking the "X" button
        console.log("Closing modal clicking X");
    });

    // Add go back to the first modal window (back arrow)
    backButton.addEventListener('click', () => {
        createModal(modalWindow1); // Re-open the first modal window
        console.log("Opening modal");
    });

    // CONTENT
    const galleryTitle = document.createElement('h1');
    galleryTitle.id = 'gallery-edit-title';
    galleryTitle.textContent = 'Ajout photo'; // Set the title of the second modal

    content.appendChild(galleryTitle);

    // Calls createPhotoForm to generate and append the form
    const photoFormSection = createPhotoForm(categories);
    content.appendChild(photoFormSection);
    console.log("Called photoFormSection function");
}

/**
 * Creates and returns a form section for adding a photo.
 * Needs handleImagePreview, checkFormValidity & handleFormSubmit
 * 
 * @param {Array} categories - Array of category objects to populate the category dropdown.
 * @returns {HTMLElement} - The form section element.
 */
function createPhotoForm(categories) {
    const addPhotoContent = document.createElement('div');
    addPhotoContent.classList.add('add-photo-content');
    
    // Form creation
    const form = document.createElement('form');
    form.id = 'photoForm';
    
    const uploadBox = document.createElement('div');
    uploadBox.classList.add('upload-box');
    
    const iconImg = document.createElement('i');
    iconImg.classList.add('fa-regular', 'fa-image');
    iconImg.id = 'iconImg';
    
    // Create a group to modify default file input style
    const uploadBtnGroup = document.createElement('button');
    uploadBtnGroup.classList.add('upload-btn-group');
    
    // element p will be styled. Z-index 0
    const uploadLabel = document.createElement('p');
    uploadLabel.classList.add('upload-btn');
    uploadLabel.textContent = '+ Ajouter photo';

    // Hide the input and make it clickable via the label
    // z-index 1 & opacity 0
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.id = 'image';
    uploadInput.name = 'image';
    uploadInput.accept = '.jpg, .png';
    // uploadInput.style.zIndex = '1'; // above the label
    
    uploadBtnGroup.appendChild(uploadInput);
    uploadBtnGroup.appendChild(uploadLabel);
    
    const fileUploadNote = document.createElement('p');
    fileUploadNote.id = 'file-upload-note';
    fileUploadNote.textContent = 'jpg, png : 4mo max';
    
    uploadBox.appendChild(iconImg);
    uploadBox.appendChild(uploadBtnGroup);
    uploadBox.appendChild(fileUploadNote);
    
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

    // Dynamically populate categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // API accepts only id n°
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

    // Create the error message span
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error-message');
    form.appendChild(errorMessage);

    // Create the Submit Button (disabled by default)
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('submit-btn');
    submitButton.textContent = 'Valider';
    submitButton.style.display = 'none'; // Initially hidden

    // Create the Disabled Submit Button (visible by default)
    const submitButtonOff = document.createElement('button');
    submitButtonOff.type = 'button';
    submitButtonOff.classList.add('submit-btn-off');
    submitButtonOff.textContent = 'Valider';

    form.appendChild(submitButtonOff);
    form.appendChild(submitButton);

    // Append the form
    addPhotoContent.appendChild(form);

    // Form validation check with checkFormValidity
    uploadInput.addEventListener('change', function () {
        handleImagePreview(uploadInput.files[0], uploadBox, uploadInput, () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));
    });

    // Check form validity on input change
    inputTitle.addEventListener('input', () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));
    selectCategory.addEventListener('change', () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));

    // Handle the click event on the disabled submit button
    submitButtonOff.addEventListener('click', function () {
        errorMessage.textContent = 'Veuillez renseigner tous les champs';
        console.log("Please choose an image, a title & a category");
    });

    // Check form validity on form submission
    form.addEventListener('submit', (e) => {
        console.log("Submitting photo upload form");
        handleFormSubmit(e, form, errorMessage, uploadBox, iconImg, uploadInput, fileUploadNote, () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));
    });

    return addPhotoContent;
}

/**
 * Handles the image preview when a file is selected.
 * Needs checkFormValidity
 * 
 * @param {File} file - The selected file object.
 * @param {HTMLElement} uploadBox - The element containing the upload box.
 * @param {HTMLInputElement} uploadInput - The file input element.
 * @param {Function} checkFormValidity - Function to check the form's validity and toggle submit buttons.
 */
function handleImagePreview(file, uploadBox, uploadInput, checkFormValidity) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Create the image element
            const previewImg = document.createElement('img');
            previewImg.src = e.target.result;
            previewImg.alt = 'Preview Image';
            previewImg.classList.add('image-preview');

            uploadBox.innerHTML = '';
            uploadBox.appendChild(previewImg);

            // Hide input elements
            uploadInput.style.display = 'none';
            uploadBox.appendChild(uploadInput);
            console.log("image selected");

            // If image clicked, select another picture
            previewImg.addEventListener('click', function () {
                uploadInput.click();
            });

            // Check form validity after image selection
            checkFormValidity();
        };
        reader.readAsDataURL(file);
    } else {
        checkFormValidity();
    }
}

/**
 * Checks the validity of the form and toggles the submit button visibility.
 * 
 * @param {HTMLInputElement} uploadInput - The file input element.
 * @param {HTMLInputElement} inputTitle - The title input element.
 * @param {HTMLSelectElement} selectCategory - The category select element.
 * @param {HTMLElement} submitButton - The submit button element.
 * @param {HTMLElement} submitButtonOff - The disabled submit button element.
 */
function checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff) {
    const image = uploadInput.files[0];
    const title = inputTitle.value.trim();
    const category = selectCategory.value;

    if (image && title && category) {
        submitButtonOff.style.display = 'none';
        submitButton.style.display = 'inline-block';
    } else {
        submitButtonOff.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
}

/**
 * Handles the form submission for uploading an image.
 * Needs checkFormValidity, httpPostWork from utils.js & showNotification from utils.js
 * 
 * @param {Event} e - The event object.
 * @param {HTMLFormElement} form - The form element.
 * @param {HTMLElement} errorMessage - The element to display error messages.
 * @param {HTMLElement} uploadBox - The element containing the upload box.
 * @param {HTMLElement} iconImg - The icon element to display if the form is reset.
 * @param {HTMLInputElement} uploadInput - The file input element.
 * @param {HTMLElement} fileUploadNote - The element displaying the file upload note.
 * @param {Function} checkFormValidity - Function to check the form's validity and toggle submit buttons.
 */
async function handleFormSubmit(e, form, errorMessage, uploadBox, iconImg, uploadInput, fileUploadNote, checkFormValidity) {
    e.preventDefault(); // Prevent default form submission

    // Clear any previous error messages
    errorMessage.textContent = '';

    // Recheck form
    const image = uploadInput.files[0];
    const title = form.querySelector('#title').value.trim();
    const category = form.querySelector('#category').value;

    if (!image || !title || !category) {
        errorMessage.textContent = 'Veuillez renseigner tous les champs';
        return;
    }

    const formData = new FormData(form); // Create FormData object from the form

    try {
        const response = await httpPostWork(works_endpoint, authToken, formData);
        if (response.error) {
            console.error('Error uploading image:', response.message);
            errorMessage.textContent = 'Erreur lors du téléchargement, veuillez essayer de nouveau.'; // Display error message
            showNotification('Upload failed, please try again', 'error'); // Show error notification
        } else {
            console.log('Image uploaded successfully:', response);
            errorMessage.textContent = '';
            showNotification('Projet ajouté avec succès!', 'success');
            form.reset();

            // Process data for displayGallery
            const category = categories.find(cat => cat.id == response.categoryId);
            const newWork = {
                ...response,
                category: category // Associate categories
            };

            // Adds new project to works
            works.push(newWork);

            // Updates gallery
            displayGallery(works);

            // Reset upload box
            uploadBox.innerHTML = '';
            uploadBox.appendChild(iconImg);
            uploadBox.appendChild(uploadInput);
            uploadBox.appendChild(fileUploadNote);

            // Reset input
            uploadInput.style.display = 'block';

            // Reset the submit buttons visibility
            checkFormValidity(); // Reset the buttons after form reset

        }
    } catch (error) {
        console.error('Unexpected error with API:', error);
        errorMessage.textContent = 'Erreur, svp essayez de nouveau';
        showNotification('Désolé, erreur lors du téléchargement...', 'error');
    }
}