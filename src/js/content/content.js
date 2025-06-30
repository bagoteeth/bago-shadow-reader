"use strict";

let lastElement;
const displayTextId = "displayTextId";

document.addEventListener("mousemove", event => {
    lastElement = document.elementFromPoint(event.clientX, event.clientY);
});

function handleDisplayText(text) {
    if (!lastElement) {
        return;
    }
    var oldElem = document.getElementById(displayTextId);
    if (oldElem) {
        oldElem.remove();
    }
    var elem = document.createElement("div");
    elem.id = displayTextId;
    elem.textContent = text;
    lastElement.insertAdjacentElement("afterend", elem);
}

function handleUpdateText(text) {
    if (!lastElement) {
        return;
    }
    var oldElem = document.getElementById(displayTextId);
    if (!oldElem) {
        return
    }
    oldElem.textContent = text;
    lastElement.insertAdjacentElement("afterend", oldElem);
}

function handleRemoveDiv() {
    var oldElem = document.getElementById(displayTextId);
    if (oldElem) {
        oldElem.remove();
    }
}