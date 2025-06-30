'use strict';

// background.js
importScripts("bookPraser.js", "router.js", "readingController.js", "display.js", "timer.js", "bookmark.js", "variables.js", "reader.js");

chrome.runtime.onInstalled.addListener(function () {
    console.log("插件已安装");
    chrome.storage.local.get('textSize', function (data) {
        const previousSize = data.textSize || 200;
        chrome.storage.local.set({ textSize: previousSize });
    });
    chrome.storage.local.get('dbReadingTimeTotal', function (data) {
        const previousSize = data.dbReadingTimeTotal || 0;
        chrome.storage.local.set({ dbReadingTimeTotal: previousSize });
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        oldValue = JSON.stringify(oldValue);
        newValue = JSON.stringify(newValue);
        console.log(
            `
            Storage key "${key}" in namespace "${namespace}" changed. 
            Old value was 
            ${oldValue}
            New value is 
            ${newValue}
            `
        );
    }
});

