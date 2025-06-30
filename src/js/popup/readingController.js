'use strict';

// ReadingControllerContainer
const exitButton = document.getElementById('exitButton');
const lastChapterButton = document.getElementById('lastChapterButton');
const lastPageButton = document.getElementById('lastPageButton');
const nextPageButton = document.getElementById('nextPageButton');
const nextChapterButton = document.getElementById('nextChapterButton');

document.addEventListener('DOMContentLoaded', function () {
    exitButton.addEventListener('click', handleExitReading);
    lastChapterButton.addEventListener('click', handleLastChapterButton);
    lastPageButton.addEventListener('click', handleLastPageButton);
    nextPageButton.addEventListener('click', handleNextPageButton);
    nextChapterButton.addEventListener('click', handleNextChapterButton);
});

function handleExitReading() {
    sendMessageToBackground("exitReading", {})
}

function handleLastChapterButton() {
    sendMessageToBackground("lastChapter", {})
}

function handleLastPageButton() {
    sendMessageToBackground("lastPage", {})
}

function handleNextPageButton() {
    sendMessageToBackground("nextPage", {})
}

function handleNextChapterButton() {
    sendMessageToBackground("nextChapter", {})
}
