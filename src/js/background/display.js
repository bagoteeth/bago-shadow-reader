'use strict';

function allowDisplay(){
    globalReadStatus = true;

}

// 展示文本只能由快捷键触发
chrome.commands.onCommand.addListener(async command => {
    if (command == "displayText" && globalReadStatus) {
        startTimer();
        globalDisplayStatus = true;
        const textSize = await new Promise(resolve => {
            chrome.storage.local.get({ textSize: 200 }, resolve);
        });
        const displayText = await getTextFromReader(bgCurrentBookObj.bookmarkEX.href, bgCurrentBookObj.bookmarkEX.offset, textSize);

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length === 0) {  
                console.error("No active tab found."); 
                return;  
            }  
            chrome.tabs.sendMessage(tabs[0].id, { action: "displayText" , text: displayText });
        });
    }
    if (command == "nextPage" && globalReadStatus && globalDisplayStatus) {
        startTimer();
        gotoNextPage();

        const textSize = await new Promise(resolve => {
            chrome.storage.local.get({ textSize: 200 }, resolve);
        });
        const displayText = await getTextFromReader(bgCurrentBookObj.bookmarkEX.href, bgCurrentBookObj.bookmarkEX.offset, textSize);

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length === 0) {  
                console.error("No active tab found."); 
                return;  
            }  
            chrome.tabs.sendMessage(tabs[0].id, { action: "displayText" , text: displayText });
        });
    }
});