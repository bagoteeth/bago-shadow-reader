'use strict';

const bookmarksList = document.getElementById('bookmarksList').querySelector('tbody');
const selectAllBookmarks = document.getElementById('selectAllBookmarks');
const addBookmarkButton = document.getElementById('addBookmarkButton');
const deleteBookmarkButton = document.getElementById('deleteBookmarkButton');

document.addEventListener('DOMContentLoaded', function () {
    selectAllBookmarks.addEventListener('click', handleSelectAllBookmarksChange);
    addBookmarkButton.addEventListener('click', handleAddBookmark);
    deleteBookmarkButton.addEventListener('click', handleDeleteBookmark);
});

function handleAddBookmark() {
    // todo判断在阅读状态
    const bookmark = {
        chapter: currentBookEpub.navigation.get(currentBookObj.bookmarkEX.href).label.trim(),
        progress: currentBookObj.bookmarkEX,
        createTime: new Date().toLocaleString()
    }
    // 页面更新
    addBookmarkToList(bookmark);
    // 全局变量更新
    currentBookObj.bookmarksList.push(bookmark);
    // 持久化
    chrome.storage.local.get({ books: [] }, function (result) {
        var tmp = result.books;
        var index = tmp.findIndex(e => e.bookName == currentBookObj.bookName);
        tmp[index] = currentBookObj;
        chrome.storage.local.set({ books: tmp });
    });
}

function handleDeleteBookmark() {
    const checkboxes = bookmarksList.querySelectorAll('input[type="checkbox"]');
    for (let i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            bookmarksList.deleteRow(i);
            currentBookObj.bookmarksList.splice(i, 1);
        }
    }
    chrome.storage.local.get({ books: [] }, function (result) {
        var tmp = result.books;
        var index = tmp.findIndex(e => e.bookName == currentBookObj.bookName);
        tmp[index] = currentBookObj;
        chrome.storage.local.set({ books: tmp });
    });
}

function handleSelectAllBookmarksChange() {
    const checkboxes = bookmarksList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllBookmarks.checked;
    });
}

function addBookmarkToList(bookmark) {
    const row = bookmarksList.insertRow();
    const checkboxCell = row.insertCell(0);
    const chapterCell = row.insertCell(1);
    const progressCell = row.insertCell(2);
    const createTimeCell = row.insertCell(3);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxCell.appendChild(checkbox);
    chapterCell.textContent = bookmark.chapter;
    // todo change to percentage
    progressCell.textContent = JSON.stringify(bookmark.progress);
    createTimeCell.textContent = bookmark.createTime;

    [chapterCell, progressCell, createTimeCell].forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => {
            navigateToChapter2(bookmark.progress.href, bookmark.progress.offset);
        });
    });
}