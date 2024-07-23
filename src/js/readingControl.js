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

var timerInterval;
var isTimerRunning = false;
// 都会在计时操作之前赋值
var currentReadingTime;
var globalReadingTimeTotal;

function handleExitReading() {
    disableReadStatus();
    stopTimer();
    saveCurrentBookObj();
}

function handleLastChapterButton() {
    chrome.storage.local.get('globalReadStatus', function (data) {
        if (!data.globalReadStatus) {
            return;
        }
        var targetHref = getLastChapter(currentBookObj.bookmarkEX.href);
        navigateToChapter2(targetHref, 0);
    });
}

function handleLastPageButton() {
    chrome.storage.local.get('globalReadStatus', function (data) {
        if (!data.globalReadStatus) {
            return;
        }
        if (currentBookObj.bookmarkEX.offset == 0) {
            var targetHref = getLastChapter(currentBookObj.bookmarkEX.href);
            navigateToChapter2(targetHref, 0);
        }
        else {
            var targetOffset = currentBookObj.bookmarkEX.offset - currentTextSize;
            if (targetOffset < 0) {
                targetOffset = 0;
            }
            navigateToChapter2(currentBookObj.bookmarkEX.href, targetOffset);
        }
    });
}

function handleNextPageButton() {
    chrome.storage.local.get('globalReadStatus', function (data) {
        if (!data.globalReadStatus) {
            return;
        }
        if (currentBookObj.bookmarkEX.offset + currentTextSize >= currentBookObj.bookmarkEX.currentChapterCount - 1) {
            var targetHref = getNextChapter(currentBookObj.bookmarkEX.href);
            if (targetHref != currentBookObj.bookmarkEX.href) {
                navigateToChapter2(targetHref, 0);
            }
        }
        else {
            var targetOffset = currentBookObj.bookmarkEX.offset + currentTextSize;
            navigateToChapter2(currentBookObj.bookmarkEX.href, targetOffset);
        }
    });
}

function handleNextChapterButton() {
    chrome.storage.local.get('globalReadStatus', function (data) {
        if (!data.globalReadStatus) {
            return;
        }
        var targetHref = getNextChapter(currentBookObj.bookmarkEX.href);
        if (targetHref != currentBookObj.bookmarkEX.href) {
            navigateToChapter2(targetHref, 0);
        }
    });
}

function enableReadStatus() {
    chrome.storage.local.set({ globalReadStatus: true });
}

function disableReadStatus() {
    chrome.storage.local.set({ globalReadStatus: false });
    // todo 删除页面渲染
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    chrome.storage.local.set({ dbReadingTimeTotal, globalReadingTimeTotal });
}

function updateTimer() {
    currentReadingTime++;
    globalReadingTimeTotal++;
    detailPageTime.textContent = currentReadingTime;
    readingTimeTotal.textContent = globalReadingTimeTotal;
}

function saveCurrentBookObj() {
    chrome.storage.local.get({ books: [] }, function (result) {
        var tmp = result.books;
        var index = tmp.findIndex(e => e.bookName == currentBookObj.bookName);
        tmp[index] = currentBookObj;
        chrome.storage.local.set({ books: tmp });
    });
}

function getLastChapter(href) {
    for (let i = 0; i < currentBookToclist.length; i++) {
        if (currentBookToclist[i] == href) {
            if (i == 0) {
                return href;
            }
            else {
                return currentBookToclist[i - 1];
            }
        }
    }
    console.log("invalid href");
}

function getNextChapter(href) {
    for (let i = 0; i < currentBookToclist.length; i++) {
        if (currentBookToclist[i] == href) {
            if (i == currentBookToclist.length) {
                return href;
            }
            else {
                return currentBookToclist[i + 1];
            }
        }
    }
    console.log("invalid href");
}