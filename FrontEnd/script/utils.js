"use strict";

// API documentation: SWAGGER UI http://localhost:5678/api-docs/#/
const base = "http://localhost:5678/api/"

const works_endpoint = `${base}works`;
let works = []; // Store the gallery data globally
const url_categories = `${base}categories`;
let categories = [];
const portfolioSection = document.querySelector('#js-portfolio');
const galleryDiv = document.querySelector('#js-portfolio .gallery');

// INITALIZE API DATA. Used on projects.js
async function initializeData() {
    await getCategories();
    await getWorks();
}
initializeData();

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
