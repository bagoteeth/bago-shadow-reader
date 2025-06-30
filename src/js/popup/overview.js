'use strict';

const readingTimeTotal = document.getElementById('readingTimeTotal');

document.addEventListener('DOMContentLoaded', function () {
    initOverview();
});

/* 当前持久化变量
books
textSize
dbReadingTimeTotal
*/

function initOverview() {
    chrome.storage.local.get('dbReadingTimeTotal', function (data) {
        const timeTotal = data.dbReadingTimeTotal || 0;
        readingTimeTotal.textContent = timeTotal;
    });
}