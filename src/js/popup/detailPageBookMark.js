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

async function handleAddBookmark() {
    const response = await sendMessageToBackground("addBookmark", {});
    if (response.data != null) {
        // bookmark结构
        const bookmark = response.data.bookmark;
        // 页面更新
        addBookmarkToList(bookmark);
    }
}

function handleDeleteBookmark() {
    const checkboxes = bookmarksList.querySelectorAll('input[type="checkbox"]');
    var bookmarksToDelete = [];
    for (let i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            // 时间戳作为删除依据
            bookmarksToDelete.push(bookmarksList.rows[i].cells[4])
            bookmarksList.deleteRow(i);
        }
    }
    sendMessageToBackground("deleteBookmark", {bookMarkEXs: bookmarksToDelete})
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
    const timeStampCell = row.insertCell(4);

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

    timeStampCell.textContent = bookmark.timeStamp;
    timeStampCell.style.display = 'none';

    createTimeCell.textContent = new Date(bookmark.timeStamp).toLocaleString();

    [chapterCell, progressCell, createTimeCell].forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => {
            parseSpecificBook(currentBookObj.bookName, bookmark.progress.href, bookmark.progress.offset);
        });
    });
}
