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

    let editModal = document.createElement('aside');
    editModal.id = 'edit-modal';

    // Modal background
    let modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background');

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

    modalBackground.appendChild(modalWindow);
    editModal.appendChild(modalBackground);
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
            return;
        }
        modal.querySelector('.modal-window').style.opacity = '0';
        setTimeout(() => modal.remove(), 500);
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
        }
    });

    // Close on pressing Esc. key
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(editModal);
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

    closeButton.addEventListener('click', () => {
        closeModal(document.querySelector('#edit-modal'));
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

    addPictureButton.addEventListener('click', () => {
        createModal(modalWindow2);
    });

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

    works.forEach((item) => {
        const articleAdmin = document.createElement("article");
        articleAdmin.classList.add("article-admin");
        articleAdmin.setAttribute("data-category", item.category.name);

        const adminImg = document.createElement("img");
        adminImg.src = item.imageUrl;
        adminImg.alt = item.title;

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash', 'delete-icon');
        deleteIcon.title = 'Supprimer';

        articleAdmin.appendChild(adminImg);
        articleAdmin.appendChild(deleteIcon);
        galleryRoll.appendChild(articleAdmin);

        // Delete work if trash icon is clicked
        deleteItem(deleteIcon, articleAdmin, item.id, authToken);
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

        const confirmDeletion = window.confirm("Confirmer la suppression ?");

        if (confirmDeletion) {
            const result = await httpDelete(works_endpoint, itemId, authToken);
            if (result) {
                showNotification('Photo supprimée avec succès', 'info');
                articleAdmin.remove();

                works = works.filter(work => work.id !== itemId);
                displayGallery(works);

            } else {
                showNotification('Erreur lors de la suppression', 'error');
            }
        } else {
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
    backButton.style.display = 'inline';
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left" id="modal-return"></i>';

    const flexSpace = document.createElement('div');
    flexSpace.classList.add('modal-flex-space');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.title = 'Close';
    closeButton.innerHTML = '&times;';

    header.appendChild(backButton);
    header.appendChild(flexSpace);
    header.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        closeModal(document.querySelector('#edit-modal'));
    });

    backButton.addEventListener('click', () => {
        createModal(modalWindow1);
    });

    // CONTENT
    const galleryTitle = document.createElement('h1');
    galleryTitle.id = 'gallery-edit-title';
    galleryTitle.textContent = 'Ajout photo';

    content.appendChild(galleryTitle);

    const photoFormSection = createPhotoForm();

    content.appendChild(photoFormSection);
}

/**
 * Creates and returns a form section for adding a photo.
 * Needs handleImagePreview, checkFormValidity & handleFormSubmit
 * 
 * @returns {HTMLElement} - The form section element.
 */
function createPhotoForm() {
    const addPhotoContent = document.createElement('div');
    addPhotoContent.classList.add('add-photo-content');

    const form = document.createElement('form');
    form.id = 'photoForm';

    const uploadBox = document.createElement('div');
    uploadBox.classList.add('upload-box');

    const iconImg = document.createElement('i');
    iconImg.classList.add('fa-regular', 'fa-image');
    iconImg.id = 'iconImg';

    const uploadBtnGroup = document.createElement('a');
    uploadBtnGroup.classList.add('upload-btn-group');

    // Needs CSS rule Z-index 0
    const uploadLabel = document.createElement('span');
    uploadLabel.classList.add('upload-btn');
    uploadLabel.textContent = '+ Ajouter photo';

    // Needs CSS rule z-index 1 & opacity 0
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.id = 'image';
    uploadInput.name = 'image';
    uploadInput.accept = '.jpg, .png';

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
    labelTitle.setAttribute('for', 'title');
    labelTitle.textContent = 'Titre';

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.id = 'title';
    inputTitle.name = 'title';
    inputTitle.maxLength = 150;

    formGroup1.appendChild(labelTitle);
    formGroup1.appendChild(inputTitle);

    const formGroup2 = document.createElement('div');
    formGroup2.classList.add('form-group');

    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'category');
    labelCategory.textContent = 'Catégorie';

    const selectCategory = document.createElement('select');
    selectCategory.id = 'category';
    selectCategory.name = 'category';

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

    // Error Message
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error-message');
    form.appendChild(errorMessage);

    // Submit Button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('submit-btn');
    submitButton.textContent = 'Valider';
    submitButton.style.display = 'none';

    // Deactivated Submit Button (visible by default)
    const submitButtonOff = document.createElement('button');
    submitButtonOff.type = 'button';
    submitButtonOff.classList.add('submit-btn-off');
    submitButtonOff.textContent = 'Valider';

    form.appendChild(submitButtonOff);
    form.appendChild(submitButton);

    addPhotoContent.appendChild(form);

    uploadInput.addEventListener('change', function () {
        handleImagePreview(uploadInput.files[0], uploadBox, uploadInput, () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));
    });

    inputTitle.addEventListener('input', () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));
    selectCategory.addEventListener('change', () => checkFormValidity(uploadInput, inputTitle, selectCategory, submitButton, submitButtonOff));

    submitButtonOff.addEventListener('click', function () {
        errorMessage.textContent = 'Veuillez renseigner tous les champs';
    });

    form.addEventListener('submit', (e) => {
        submitButton.disabled = true;
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
    const maxFileSize = 4;
    const allowedFiles = ['image/jpeg', 'image/png'];
    const errorMessage = document.querySelector('.error-message');

    if (file) {
        const fileType = file.type;
        const fileSizeMB = file.size / (1024 * 1024);

        if (!allowedFiles.includes(fileType)) {
            errorMessage.textContent = 'Veuillez sélectionner un fichier JPG ou PNG.';
            showNotification('Veuillez sélectionner un fichier JPG ou PNG.', 'error');
            uploadInput.value = '';
            checkFormValidity();
            return;
        }

        if (fileSizeMB > maxFileSize) {
            errorMessage.textContent = 'Désolé, la taille du fichier ne doit pas dépasser 4 Mo.';
            showNotification('Désolé, la taille du fichier ne doit pas dépasser 4 Mo.', 'error');
            uploadInput.value = '';
            checkFormValidity();
            return;
        }

        // If ok, display the image preview
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImg = document.createElement('img');
            previewImg.src = e.target.result;
            previewImg.alt = 'Preview Image';
            previewImg.classList.add('image-preview');

            uploadBox.innerHTML = '';
            uploadBox.appendChild(previewImg);
            uploadInput.style.display = 'none';
            uploadBox.appendChild(uploadInput);

            previewImg.addEventListener('click', function () {
                uploadInput.click(); // Allow user to click the preview to change the image
            });

            // Clear any error message if file is valid
            errorMessage.textContent = '';
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
async function handleFormSubmit(e, form, errorMessage, uploadBox, iconImg, uploadInput, fileUploadNote, checkFormValidity, closeModal) {
    e.preventDefault();
    errorMessage.textContent = '';

    // Check form again
    const image = uploadInput.files[0];
    const title = form.querySelector('#title').value.trim();
    const category = form.querySelector('#category').value;

    if (!image || !title || !category) {
        errorMessage.textContent = 'Veuillez renseigner tous les champs';
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await httpPostWork(works_endpoint, authToken, formData);
        if (response.error) {
            console.error('Error uploading image:', response.message);
            errorMessage.textContent = 'Erreur lors du téléchargement, veuillez essayer de nouveau.'; // Display error message
            showNotification('Upload failed, please try again', 'error'); // Show error notification
        } else {
            errorMessage.textContent = '';
            showNotification('Projet ajouté avec succès!', 'success');
            form.reset();

            // Process data for displayGallery
            const category = categories.find(cat => cat.id == response.categoryId);
            const newWork = {
                ...response, // Spread properties
                category: category
            };

            // Update Galleries
            works.push(newWork);
            displayGallery(works);
            checkFormValidity();
            createModal(modalWindow2);
        }

    } catch (error) {
        errorMessage.textContent = 'Erreur, svp essayez de nouveau';
        showNotification('Désolé, erreur lors du téléchargement...', 'error');
    }
}