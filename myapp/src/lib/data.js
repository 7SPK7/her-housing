// const puppeteer = require('puppeteer');

import {readFileSync, writeFileSync} from "fs";

/**
 * 
 * @param {number} page Page number 
 * @returns 
 */
export async function fetchHousingData(page) {
    return await fetch(`https://offcampus.vt.edu/bff/listing/search/list?url=%2Fhousing%2Fpage-${page}&seed=6794&locale=en`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Microsoft Edge\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://offcampus.vt.edu/housing",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then((response) => {
        return response.json();
      });
}

/**
 * @param {number} page
 */
function saveHousingData(page) {
  fetchHousingData(page).then((data) => {
    writeFileSync(`data/page-${page}.json`, JSON.stringify(data));
  });
}

/**
 * @param {number} page
 */
function openPageFile(page) {
  return JSON.parse(readFileSync(`data/page-${page}.json`).toString());
}