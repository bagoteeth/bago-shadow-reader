'use strict';

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        currentReadingTime = bgCurrentBookObj.readTime;
        chrome.storage.local.get('dbReadingTimeTotal', function (data) {
            globalReadingTimeTotal = data.dbReadingTimeTotal;
        });
        timerInterval = setInterval(updateReadingByTimer, 1000);
    }
}

function stopReadingByTimer() {
    if (!isTimerRunning){
        return
    }
    isTimerRunning = false;
    clearInterval(timerInterval);
    saveGlobalReadingTime();
    saveCurrentBookObj();
}

// 每分钟存storage
function updateReadingByTimer() {
    currentReadingTime++;
    globalReadingTimeTotal++;
    if (globalReadingTimeTotal%60 == 0){
        saveGlobalReadingTime();
        saveCurrentBookObj();
    }
}

function saveGlobalReadingTime() {
    chrome.storage.local.set({ dbReadingTimeTotal: globalReadingTimeTotal });
}