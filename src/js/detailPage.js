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

var currentBookObj;
var currentBookEpub;

document.addEventListener('DOMContentLoaded', function () {
    continueReadingButton.addEventListener('click', handleContinueReading);
    detailPageCloseButton.addEventListener('click', handleCloseDetailPageClick);
});

function handleContinueReading() {
    navigateToChapter2(currentBookObj.bookmarkEX.href, currentBookObj.bookmarkEX.offset);
}

function handleCloseDetailPageClick() {
    detailPage.style.display = 'none';
}

function navigateToChapter2(href, offset) {
    enableReadStatus();

    var sec = currentBookEpub.spine.get(href);
    if (!sec) {
        console.log('section not exists: ', href);
        return;
    }
    sec.load(currentBookEpub.load.bind(currentBookEpub)).then(html => {
        // 取所有文本，提取前size字符
        try {
            var $div = $('<div>').html(html);
            var bodyText = $div.find('body').text().replace(/\n\s*\n/g, '\n').trim();

            var result = '';
            var charCount = 0;
            for (let j = offset; j < bodyText.length; j++) {
                // 排除空格，连续多个换行只留1个
                if (bodyText.charAt(j) == ' ') {
                    continue;
                }
                result += bodyText.charAt(j);
                if (bodyText.charAt(j).trim() !== '') {
                    charCount++;
                }

                if (charCount > currentTextSize) {
                    break;
                }
            }
            //todo 先log，之后改到嵌入页面；单本和总计时也在那时开始;bookmarkex修改也在这
            startTimer();
            // bookmarkex变化，进入阅读模式。存storage
            currentBookObj.bookmarkEX.href = href;
            currentBookObj.bookmarkEX.offset = offset;
            currentBookObj.bookmarkEX.currentChapterCount = bodyText.length;
            saveCurrentBookObj();

            console.log(`从${offset}开始的${currentTextSize}字符：
        ${result}`);
        }
        catch (error) {
            console.error('处理HTML内容时出现错误:', error);
        }
    });
}

function base642Blob(bs64) {
    const mimeType = 'application/epub+zip';
    const byteCharacters = atob(bs64.split(";base64,")[1]);
    const byteNumbers = [];
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers.push(byteCharacters.charCodeAt(i));
    }
    const byteArr = new Uint8Array(byteNumbers);
    return new Blob([byteArr], { type: mimeType });
}

function handleDetailPageShown(event) {
    if (!(event.target && event.target.tagName === 'TD' && event.target.parentElement.rowIndex > 0 && event.target.cellIndex === 1)) {
        return;
    }
    // 如果之前在读其他书，要先保存重置相关记录
    handleExitReading();

    const bookName = event.target.textContent.trim();
    chrome.storage.local.get({ books: [] }, function (result) {
        currentBookObj = result.books.find(book => {
            return book.bookName.trim() == bookName;
        });
        // 加载阅读时间，状态，书签
        detailPageStatus.textContent = currentBookObj.readStatus;
        detailPageTime.textContent = currentBookObj.readTime;
        currentReadingTime = currentBookObj.readTime;
        bookmarksList.innerHTML = '';
        tocList.innerHTML = '';
        currentBookObj.bookmarksList.forEach(bookmark => addBookmarkToList(bookmark));
        //加载书名，作者，目录
        currentBookEpub = ePub(base642Blob(currentBookObj.base64));

        currentBookEpub.loaded.metadata.then(meta => {
            detailPageFileName.textContent = meta.title;
            detailPageWriter.textContent = meta.creator;
        });

        currentBookEpub.ready.then(() => {
            currentBookEpub.navigation.forEach(toc => {
                const chapterName = toc.label.trim();
                addTocToList(chapterName, toc.href);
                if (currentBookObj.bookmarkEX.href == "") {
                    currentBookObj.bookmarkEX.href = toc.href;
                }
            });
        });

        detailPage.style.display = 'block';
    });
}