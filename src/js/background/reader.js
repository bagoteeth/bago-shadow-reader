async function ensureReaderTab() {
    if (readerTabId !== null) {
        // 检查是否还存在
        try {
            await chrome.tabs.get(readerTabId);
            return readerTabId;
        } catch (e) {
            readerTabId = null;
        }
    }

    const tab = await chrome.tabs.create({
        url: chrome.runtime.getURL("../../html/reader.html"),
        active: false
    });
    readerTabId = tab.id;

    // 等待 reader 页面加载完成
    await new Promise(resolve => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === readerTabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        });
    });

    return readerTabId;
}

async function getChapterNameFromReader(href) {
    return sendMessageToReader("getChapterName", {
        href: href
    });
}

async function getBookMetaFromReader(bookName) {
    return sendMessageToReader("praseEpubMeta", {
        bookName: bookName
    });
}

async function loadEpubFromReader(bookName) {
    sendMessageToReader("loadEpub", {
        bookName: bookName
    });
}

async function getTextFromReader(href, offset, size) {
    return sendMessageToReader("getEpubContent", {
        href: href,
        offset: offset,
        size: size
    });
}