"use strict";
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