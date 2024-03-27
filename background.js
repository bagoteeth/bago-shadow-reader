'use strict';

// background.js
chrome.runtime.onInstalled.addListener(function (){
    console.log("插件已安装");
    chrome.storage.local.get('textSize', function(data){
        const previousSize = data.textSize || 200;
        chrome.storage.local.set({textSize: previousSize})
    });
});

chrome.storage.onChanged.addListener(function(changes, namespace){
    for(let [key, {oldValue, newValue}] of Object.entries(changes)){
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

// 没用
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addFiles') {
        const selectedFiles = request.files;
        chrome.storage.local.get({ files: [] }, function (result) {
            const tmpFiles = result.files;
            for (const file of selectedFiles) {
                tmpFiles.push(file.name);
            }
            chrome.storage.local.set({ files: tmpFiles });
        });
    }
    else if (request.action === 'deleteFiles') {
        const filesToDelete = request.files;
        chrome.storage.local.get({ files: [] }, function (result) {
            const tmpFiles = result.files.filter(fileName => !filesToDelete.includes(fileName));
            chrome.storage.local.set({ files: tmpFiles });
        });
    } 
    else if (request.action === 'getFiles') {
        chrome.storage.local.get({ files: [] }, function (result) {
            sendResponse({ files: result.files });
        });
        return true; // Ensure sendResponse is called asynchronously
    }
});