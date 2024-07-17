'use strict';

// background.js
var mouseX;
var mouseY;
var currentRendition = null;

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

// document.onmousemove = function(e){
//     mouseX = e.pageX;
//     mouseY = e.pageY;
// };
    

// chrome.commands.onCommand.addListener(command => {
//     if (command == "displayText"){
//         console.log(`displayText x: ${mouseX}, y: ${mouseY}`);
//         if(currentRendition){
//             currentRendition.remove();
//         }
//         let currentElem = document.elementFromPoint(mouseX, mouseY);
//         currentRendition = document.createElement("currentRendition");
//         if(currentElem){
//             currentElem.insertAdjacentElement("afterend", currentRendition);
//         }
//         chrome.runtime.sendMessage({action: "modifyRendition"});
//     }
// });