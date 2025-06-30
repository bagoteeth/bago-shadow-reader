"use strict";

chrome.runtime.onMessage.addListener((req, sender, resp) => {
    console.log("Message received:", req);
    switch (req.action) {
        case "displayText":
            handleDisplayText(req.text);
        case "updateText":
            handleUpdateText(req.text);
        case "removeDiv":
            handleRemoveDiv();
        default:
            sendResponse({ error: "unknown action" });
    }
});