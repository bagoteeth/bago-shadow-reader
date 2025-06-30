'use strict';

function exitReading() {
    stopReadingByTimer();
    globalReadStatus = false;
    globalDisplayStatus = false;
    // 删除页面渲染
    sendMessageToContent("removeDiv", {});
}

function saveCurrentBookObj() {
    if (bgCurrentBookObj == null) {
        return;
    }
    chrome.storage.local.get({ books: [] }, function (result) {
        var tmp = result.books;
        var index = tmp.findIndex(e => e.bookName == bgCurrentBookObj.bookName);
        tmp[index] = bgCurrentBookObj;
        chrome.storage.local.set({ books: tmp });
    });
}

function gotoLastChapter() {
    var targetHref = getLastChapter(bgCurrentBookObj.bookmarkEX.href);
    updateWebText(targetHref, 0);
}

function gotoLastPage() {
    if (bgCurrentBookObj.bookmarkEX.offset == 0) {
        var targetHref = getLastChapter(bgCurrentBookObj.bookmarkEX.href);
        updateWebText(targetHref, 0);
    }
    else {
        var targetOffset = bgCurrentBookObj.bookmarkEX.offset - currentTextSize;
        if (targetOffset < 0) {
            targetOffset = 0;
        }
        updateWebText(bgCurrentBookObj.bookmarkEX.href, targetOffset);
    }
}

function gotoNextPage() {
    if (bgCurrentBookObj.bookmarkEX.offset + currentTextSize >= bgCurrentBookObj.bookmarkEX.currentChapterCount - 1) {
        var targetHref = getNextChapter(bgCurrentBookObj.bookmarkEX.href);
        if (targetHref != bgCurrentBookObj.bookmarkEX.href) {
            updateWebText(targetHref, 0);
        }
    }
    else {
        var targetOffset = bgCurrentBookObj.bookmarkEX.offset + currentTextSize;
        updateWebText(bgCurrentBookObj.bookmarkEX.href, targetOffset);
    }
}

function gotoNextChapter() {
    var targetHref = getNextChapter(bgCurrentBookObj.bookmarkEX.href);
    if (targetHref != bgCurrentBookObj.bookmarkEX.href) {
        updateWebText(targetHref, 0);
    }
}

function getLastChapter(href) {
    for (let i = 0; i < bgCurrentBookToclist.length; i++) {
        if (bgCurrentBookToclist[i] == href) {
            if (i == 0) {
                return href;
            }
            else {
                return bgCurrentBookToclist[i - 1];
            }
        }
    }
    console.log("invalid href");
}

function getNextChapter(href) {
    for (let i = 0; i < bgCurrentBookToclist.length; i++) {
        if (bgCurrentBookToclist[i] == href) {
            if (i == bgCurrentBookToclist.length) {
                return href;
            }
            else {
                return bgCurrentBookToclist[i + 1];
            }
        }
    }
    console.log("invalid href");
}

// 每次重新解析epub
// bg存href, offset
// reader解析epub
// bg允许阅读
async function navigateToChapter(bookName, href, offset) {
    chrome.storage.local.get({ books: [] }, async (result) => {
        bgCurrentBookObj = result.books.find(book => {
            return book.bookName.trim() == bookName;
        });
    });
    bgCurrentBookObj.bookmarkEX.href = href;
    bgCurrentBookObj.bookmarkEX.offset = offset;
    const meta = await getBookMetaFromReader(bookName);
    meta.data.toclist.forEach(toc => {
        bgCurrentBookToclist.push({"href": toc.href, "count": toc.count});
        if (bgCurrentBookObj.bookmarkEX.href == "") {
            bgCurrentBookObj.bookmarkEX.href = toc.href;
            bgCurrentBookObj.bookmarkEX.currentChapterCount = toc.count;
        }
    });
    await loadEpubFromReader(bookName)

    globalReadStatus = true;

}

async function updateWebText(href, offset) {
    const textSize = await new Promise(resolve => {
        chrome.storage.local.get({ textSize: 200 }, resolve);
    });
    const displayText = await getTextFromReader(href, offset, textSize);

    await sendMessageToContent("updateText", {text: displayText})

    const tocEntry = bgCurrentBookToclist.find(item => item.href === href);
    bgCurrentBookObj.bookmarkEX.href = href;
    bgCurrentBookObj.bookmarkEX.offset = offset;
    bgCurrentBookObj.bookmarkEX.currentChapterCount = tocEntry.count;
    saveCurrentBookObj();
}
