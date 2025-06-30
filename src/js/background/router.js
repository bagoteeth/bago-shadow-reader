"use strict";

chrome.runtime.onMessage.addListener((req, sender, resp) => {
    console.log("Message received:", req);
    switch (req.action) {
        // 解析epub，同时复制bookobj全局变量
        case "praseEpubMeta":
            getEpubMeta(req.payload.bookName).then(data => {
                sendResponse({data});
            })
            .catch(err =>{
                sendResponse({error: err.toString()});
            });
            return true;
        case "exitReading":
            exitReading();
        case "lastChapter":
            gotoLastChapter();
        case "lastPage":
            gotoLastPage();
        case "nextPage":
            gotoNextPage();
        case "nextChapter":
            gotoNextChapter();
        case "parseSpecificBook":
            navigateToChapter(req.payload.bookName, req.payload.href, req.payload.offset);
        case "addBookmark":
            sendResponse(addBookmark());
        case "deleteBookmark":
            deleteBookmark(req.payload.bookMarkEXs);
        default:
            sendResponse({error: "unknown action"});
    }
})

async function sendMessageToContent(action, payload) {
    await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
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

async function sendMessageToReader(action, payload) {
    const tabId = await ensureReaderTab();
    return await chrome.tabs.sendMessage(tabId, { 
        action: action, 
        payload: payload
    });
}