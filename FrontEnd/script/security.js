"use strict";

//LOG IN&OUT, INJECT EDITBTN
// API documentation: SWAGGER UI http://localhost:5678/api-docs/#/

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the authToken from session storage
    const authToken = sessionStorage.getItem('authToken');
    let store = sessionStorage;
    // Redirect if auth & on the login page
    if (authToken && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
        return;
    }

    if (auth && window.location.pathname.includes('login.html')) {
        handleLogin(auth, url_login, loadingIndicator, errorMessageSpan, store);
    }

    /**
   * HANDLE LOGIN: Login form submission
   * 
   * @param {HTMLElement} formElement - Login form element.
   * @param {String} urlLogin - URL endpoint.
   * @param {HTMLElement} loadingIndicator
   * @param {HTMLElement} errorMessageElement
   * @param {Storage} store - Store auth token (sessionStorage/localStorage).
   */
    function handleLogin(formElement, urlLogin, loadingIndicator, errorMessageElement, store) {
        formElement.addEventListener("submit", async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const email = formElement.email.value.trim();
            const password = formElement.password.value.trim();
            if (!email || !password) {
                displayErrorMessage("Veuillez saisir tous les champs du formulaire",
                    errorMessageElement); // Error message for empty fields
                return;
            }
            const data = { email, password };
            loadingIndicator.style.display = 'block';

            try {
                // Use httpPost from utils.js
                const result = await httpPost(urlLogin, data);
                if (!result || !result.token) {
                    throw new Error('Identifiant ou mot de passe inconnu'); // General error message
                }
                // If token received, store & redirect
                store.setItem("authToken", result.token);
                window.location = 'index.html';
            } catch (error) {
                //console.error('Erreur:', error);
                displayErrorMessage('Identifiant ou mot de passe inconnu',
                    errorMessageElement);
            } finally {
                loadingIndicator.style.display = 'none'; // Hide loading indicator
            }
        });
    }

    function displayErrorMessage(message, errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
    }

    // LOGOUT
    if (authToken) {
        loginButton.innerHTML = '<a href="#" id="logoutBtn">logout</a>';
        const logoutBtn = document.getElementById('logoutBtn');
        //Listen to Log out button
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            logoutMessage.classList.add('show');
            // Timer to hide message & redirect to login page
            setTimeout(() => {
                logoutMessage.classList.remove('show');
                window.location.href = 'index.html';
            }, 350);
        });
    }
});
