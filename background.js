'use strict';

// background.js
chrome.runtime.onInstalled.addListener(function () {
    console.log("插件已安装");
    chrome.storage.local.get('textSize', function (data) {
        const previousSize = data.textSize || 200;
        chrome.storage.local.set({ textSize: previousSize });
    });
    chrome.storage.local.get('readingTimeTotal', function (data) {
        const previousSize = data.readingTimeTotal || 0;
        chrome.storage.local.set({ readingTimeTotal: previousSize });
    });
    chrome.storage.local.get('wordCountTotal', function (data) {
        const previousSize = data.wordCountTotal || 0;
        chrome.storage.local.set({ wordCountTotal: previousSize });
    });
    chrome.storage.local.get('globalReadStatus', function (data) {
        const previousSize = data.globalReadStatus || false;
        chrome.storage.local.set({ globalReadStatus: previousSize });
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
