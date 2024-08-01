"use strict";

let lastElement
const displayTextId = "displayTextId"

document.addEventListener("mousemove", event => {
    lastElement = document.elementFromPoint(event.clientX, event.clientY);
});

chrome.runtime.onMessage.addListener((req, sender, resp) => {
    if (req.action != "displayText") {
        return;
    }
    if (!lastElement) {
        return;
    }
    var oldElem = document.getElementById(displayTextId);
    if (oldElem) {
        oldElem.remove();
    }
    var elem = document.createElement("div");
    elem.id = displayTextId;
    elem.textContent = req.text;
    lastElement.insertAdjacentElement("afterend", elem);
});
