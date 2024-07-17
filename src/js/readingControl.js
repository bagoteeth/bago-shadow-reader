'use strict';

// ReadingControllerContainer
const exitButton = document.getElementById('exitButton');
const lastChapterButton = document.getElementById('lastChapterButton');
const lastPageButton = document.getElementById('lastPageButton');
const nextPageButton = document.getElementById('nextPageButton');
const nextChapterButton = document.getElementById('nextChapterButton');

document.addEventListener('DOMContentLoaded', function () {
    exitButton.addEventListener('click', handleExitButton);
    lastChapterButton.addEventListener('click', handleLastChapterButton);
    lastPageButton.addEventListener('click', handleLastPageButton);
    nextPageButton.addEventListener('click', handleNextPageButton);
    nextChapterButton.addEventListener('click', handleNextChapterButton);
});


function handleExitButton() {
    chrome.storage.local.set({ globalReadStatus: false });
    // todo 停止计时
}

function handleLastChapterButton() {

}

function handleLastPageButton() {

}

function handleNextPageButton() {

}

function handleNextChapterButton() {

}