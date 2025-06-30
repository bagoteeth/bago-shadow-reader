'use strict';

const statusPreRead = "未阅读";
const statusOnRead = "阅读中";
const statusPostRead = "已读完";

const detailPage = document.getElementById('detailPageContainer');
const detailPageFileName = document.getElementById('bookTitle');
const detailPageWriter = document.getElementById('writer');
const detailPageTime = document.getElementById('readingTime');
const detailPageStatus = document.getElementById('bookStatus');
const continueReadingButton = document.getElementById('continueReadingButton');
const detailPageCloseButton = document.getElementById('closeButton');

document.addEventListener('DOMContentLoaded', function () {
    continueReadingButton.addEventListener('click', handleContinueReading);
    detailPageCloseButton.addEventListener('click', handleCloseDetailPageClick);
});

function handleContinueReading() {
    parseSpecificBook(currentBookObj.bookName, currentBookObj.bookmarkEX.href, currentBookObj.bookmarkEX.offset);
}

function handleCloseDetailPageClick() {
    detailPage.style.display = 'none';
}

function parseSpecificBook(bookName, href, offset) {
    sendMessageToBackground("parseSpecificBook", {bookName, href, offset});
}


function handleDetailPageShown(event) {
    if (!(event.target && event.target.tagName === 'TD' && event.target.parentElement.rowIndex > 0 && event.target.cellIndex === 1)) {
        return;
    }
    // 如果之前在读其他书，要先保存重置相关记录。应该在点击继续阅读类按钮时才更新
    // handleExitReading();

    const bookName = event.target.textContent.trim();
    chrome.storage.local.get({ books: [] }, async (result) => {
        currentBookObj = result.books.find(book => {
            return book.bookName.trim() == bookName;
        });
        //加载书名，作者，目录；同时将本书赋值到background的全局变量
        const response = await sendMessageToBackground("praseEpubMeta", { bookName })
        // 加载阅读时间，状态，书签
        detailPageStatus.textContent = currentBookObj.readStatus;
        detailPageTime.textContent = currentBookObj.readTime;
        bookmarksList.innerHTML = '';
        tocList.innerHTML = '';
        currentBookObj.bookmarksList.forEach(bookmark => addBookmarkToList(bookmark));
        if (currentBookObj.bookmarkEX.href == "") {
            continueReadingButton.textContent = "开始阅读";
        } else {
            continueReadingButton.textContent = "继续阅读";
        }

        detailPageFileName.textContent = response.data.title;
        detailPageWriter.textContent = response.data.creator;
        response.data.toclist.forEach(toc => {
            currentBookToclist.push({"href": toc.href, "count": toc.count});
            addTocToList(toc.chapterName, toc.href);
            if (currentBookObj.bookmarkEX.href == "") {
                currentBookObj.bookmarkEX.href = toc.href;
            }
        });

        detailPage.style.display = 'block';
    });
}

