"use strict";

// USER NOTIFICATIONS
const errorMessageSpan = document.querySelector('.error-message');

function displayErrorMessage(message) {
    errorMessageSpan.textContent = message;
    errorMessageSpan.style.display = 'block';
}

// Login & Logout user notifications
const loadingIndicator = document.createElement('div');
const logoutMessage = document.createElement('div');

loadingIndicator.classList.add('loading-indicator');
loadingIndicator.style.display = 'none';
loadingIndicator.textContent = 'Connexion...'; // Loading message
mainElement.insertAdjacentElement('afterend', loadingIndicator);

logoutMessage.id = 'logoutMessage';
logoutMessage.classList.add('hidden');
logoutMessage.textContent = 'Déconnexion...'; // Logout message
mainElement.insertAdjacentElement('afterend', logoutMessage);

const authToken = sessionStorage.getItem('authToken');

/**
 * showNotification with a green, red, or neutral background
 * 
 * @param {String} message - The message to display.
 * @param {String} type - The type of notification: 'success', 'error', or 'info' (default).
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('loading-indicator');

    switch (type) {
        case 'success':
            notification.classList.add('success');
            break;
        case 'error':
            notification.classList.add('error');
            break;
        default:
            notification.classList.add('info');
    }

    notification.textContent = message;

    notification.style.display = 'block';

    document.body.appendChild(notification);

    // Timer to remove the notification
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

//Test notifications:
//showNotification('Message example', 'info');//"info", "success" or "error"