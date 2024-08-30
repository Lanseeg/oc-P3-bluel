"use strict";
//NOTIFICATION BAR
const errorMessageSpan = document.querySelector('.error-message');
// User messages
const loadingIndicator = document.createElement('div');
const logoutMessage = document.createElement('div');
// Message: login
loadingIndicator.classList.add('loading-indicator');
loadingIndicator.style.display = 'none';
loadingIndicator.textContent = 'Connexion...'; // Loading message
mainElement.insertAdjacentElement('afterend', loadingIndicator);
// Message: logout
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

    // Add class based on the type of notification
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

    // Set the message
    notification.textContent = message;

    notification.style.display = 'block';
    notification.style.zIndex = '9999';

    document.body.appendChild(notification);

    // Timer to remove the notification
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
//Test notifications:
//showNotification('Message example', 'info');//"info", "success" or "error"