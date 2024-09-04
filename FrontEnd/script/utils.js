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
 * @param {String} endpoint - The endpoint URL to send the DELETE request to.
 * @param {String} id - The ID of the item to delete.
 * @param {String} authToken - The authentication token.
 * @returns {Boolean} - Returns true if the deletion was successful, false otherwise.
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

        console.log('HTTP DELETE response:', response);
        if (!response.ok) {
            throw new Error('Failed to delete the item');
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * HTTP POST Work (post new project)
 * 
 * @param {String} works_endpoint - The API endpoint to send the request to.
 * @param {String} authToken - The authorization token for the request.
 * @param {FormData} formData - The form data to send in the request body.
 * @returns {Promise<Object>} - The response from the API in JSON format, or an error object if the request fails.
 */
async function httpPostWork(works_endpoint, authToken, formData) {
    try {
        const response = await fetch(works_endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        alert("HTTP Error: " + error.message);
        return { error: true, message: error.message };
    }
}
