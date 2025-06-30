'use strict';

function sendMessageToBackground(action, payload) {  
    return new Promise((resolve, reject) => {  
        chrome.runtime.sendMessage({ action: action, payload: payload }, (response) => {  
            if (chrome.runtime.lastError) {  
                return reject(chrome.runtime.lastError);  
            }  
            resolve(response);  
        });  
    });  
}  

function sendMessageToContent(action, payload) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs.length === 0) {  
            console.error("No active tab found.");  
            return;  
        }  
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: action, 
            payload: payload
        });
    });
}