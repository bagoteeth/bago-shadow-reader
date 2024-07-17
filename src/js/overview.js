'use strict';

const readingTimeTotal = document.getElementById('readingTimeTotal');

var currentReadingTimeTotal;

document.addEventListener('DOMContentLoaded', function () {
    initOverview();
});

function initOverview() {
    chrome.storage.local.get('readingTimeTotal', function (data) {
        const previousSize = data.readingTimeTotal || 0;
        readingTimeTotal.value = data.readingTimeTotal;
    });
    // chrome.storage.local.get('wordCountTotal', function (data) {
    //   const previousSize = data.wordCountTotal || 0;
    //   wordCountTotal.value = data.wordCountTotal;
    // });
}