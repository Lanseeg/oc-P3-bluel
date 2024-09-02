"use strict";
// API
// API documentation: SWAGGER UI http://localhost:5678/api-docs/#/
const base = "http://localhost:5678/api/"

//WORKS & CATEGORIES
const works_endpoint = `${base}works`;
let works = [];
const url_categories = `${base}categories`;
let categories = [];
const portfolioSection = document.querySelector('#js-portfolio');
const galleryDiv = document.querySelector('#js-portfolio .gallery');

//LOGIN & LOGOUT
const url_login = `${base}users/login`;
const auth = document.getElementById('login-form');
const mainElement = document.querySelector('main');
const loginButton = document.getElementById('loginBtn');
async function userLogin() {
    await httpPost();
}
// INITALIZE API DATA. Used on projects.js
async function initializeData() {
    await getCategories();
    await getWorks();

}

/**
 * HTTP GET
 * 
 * @param String url 
 * @returns Array
 */
async function httpGet(url) {
    try {
        const response = await fetch(url);
        // Prevent reloading
        if (response.redirected) {
            console.log('Redirection détectée vers :', response.url);
            return; // Empêche de suivre la redirection
        }
        // -  -
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

// GET WORKS
async function getWorks() {
    works = await httpGet(works_endpoint);
}

// GET CATEGORIES
async function getCategories() {
    categories = await httpGet(url_categories);
}

/**
 * HTTP POST LOGIN
 * 
 * Sends a POST request to log in the user.
 * 
 * @param {String} url - Endpoint URL to send POST request.
 * @param {Object} credentials - Object with 'email' and 'password'.
 * @returns {Object} - Returns response data from API.
 */
async function httpPost(url, credentials) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        // Prevent reloading
        if (response.redirected) {
            console.log('Redirection détectée vers :', response.url);
            return;
        }
        // -  -

        // Parse response as JSON
        const data = await response.json();
        // Return response data
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

/**
 * HTTP DELETE
 * 
 * @param {String} endpoint - The endpoint URL to send the DELETE request to
 * @param {String} id - The ID of the item to delete
 * @param {String} authToken - The authentication token (if needed)
 * @returns {Boolean} - Returns true if the deletion was successful, false otherwise
 */
async function httpDelete(endpoint, id, authToken) {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        // Prevent reloading
        if (response.redirected) {
            console.log('Redirection détectée vers :', response.url);
            return false;
        }
        // - - 
        if (!response.ok) {
            throw new Error('Failed to delete the item');
        }

        return true; // Return true on successful deletion
    } catch (error) {
        console.error(error);
        return false; // Return false on failure
    }
}


/**
 * HTTP POST Work
 * 
 * @param {String} works_endpoint - The API endpoint to send the request to.
 * @param {String} authToken - The authorization token for the request.
 * @param {FormData} formData - The form data to send in the request body.
 * @returns {Promise<Object>} - The response from the API in JSON format, or an error object if the request fails.
 */
async function httpPostImage(works_endpoint, authToken, formData) {
    try {
        const response = await fetch(works_endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                // 'Content-Type' is not set because `FormData` automatically sets it
            },
            body: formData
        });
        // Prevent reloading
        if (response.redirected) {
            console.log('Redirection détectée vers :', response.url);
            return { error: true, message: 'Redirection détectée' };
        }
        // - - 

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        alert("HTTP Error: " + error.message);
        return { error: true, message: error.message }; // Return an error object for better handling
    }
}