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
    chrome.storage.local.get('globalReadStatus', function (data) {
        if (!data.globalReadStatus) {
            return
        }
        // bookmark结构
        const bookmark = {
            chapter: currentBookEpub.navigation.get(currentBookObj.bookmarkEX.href).label.trim(),
            // 此时经过navi2，bookmarkex的全文字数应已被赋值
            progress: currentBookObj.bookmarkEX,
            createTime: new Date().toLocaleString()
        }
        // 页面更新
        addBookmarkToList(bookmark);
        // 全局变量更新
        currentBookObj.bookmarksList.push(bookmark);
        // 持久化
        saveCurrentBookObj();
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
    saveCurrentBookObj();
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
    // 占当前章节百分比
    if (bookmark.progress.currentChapterCount == 0) {
        progressCell.textContent = "chapter count error";
    }
    else {
        var percent = (bookmark.progress.offset / bookmark.progress.currentChapterCount) * 100
        progressCell.textContent = percent;
    }
    createTimeCell.textContent = bookmark.createTime;

    [chapterCell, progressCell, createTimeCell].forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => {
            enableReadStatus();
            navigateToChapter2(bookmark.progress.href, bookmark.progress.offset);
        });
    });
}