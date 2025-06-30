
let currentBookEpub = null;

chrome.runtime.onMessage.addListener((req, sender, resp) => {
    switch (req.action) {
        case "praseEpubMeta":
            praseEpubMeta(req.payload.bookName).then(data => {
                sendResponse({data});
            })
            .catch(err =>{
                sendResponse({error: err.toString()});
            });
            return true;
        case "getChapterName":
            getChapterNameFromHref(req.payload.href).then(data => {
                sendResponse({data});
            })
            .catch(err =>{
                sendResponse({error: err.toString()});
            });
            return true;
        case "loadEpub":
            loadCurrentBook(req.payload.bookName);
            sendResponse({ status: "ok" });
            return true;
        case "getEpubContent":
            getEpubContent(req.payload.href, req.payload.offset, req.payload.size).then(data => {
                sendResponse({data});
            })
            .catch(err =>{
                sendResponse({error: err.toString()});
            });
            return true;
        default:
            sendResponse({error: "unknown action"});
            return false;
    }
})

// 返回书名，作者，目录
async function praseEpubMeta(bookName) {
    const tmpBookObj = await getBookObj(bookName);
    const tmpBookEpub = ePub(tmpBookObj.base64);
    await tmpBookEpub.ready;

    const meta = tmpBookEpub.loaded.metadata;
    const nav = tmpBookEpub.navigation;
    const tocList = await Promise.all(
        nav.map(async toc => {
            const count = await countSectionChars(toc.href);
            return {
                chapterName: toc.label.trim(),
                href: toc.href,
                count: count, 
            }
        })
    );

    return {
        title: meta.title,
        creator: meta.creator,
        toclist: tocList
    };
}

async function countSectionChars(href) {
    const sec = currentBookEpub.spine.get(href);
    if (!sec) {
        throw new Error(`section not exists: ${href}`);
    }
    const contents = await sec.load(currentBookEpub.load.bind(currentBookEpub));
    const bodyText = html2epubText(contents);

    return bodyText.length;
}

// 已经load过epub
function getChapterNameFromHref(href) {
    return currentBookEpub.navigation.get(href).label.trim();
}

async function loadCurrentBook(bookName) {
    const tmpBookObj = await getBookObj(bookName);
    currentBookEpub = ePub(tmpBookObj.base64);
    await currentBookEpub.ready;
}

// 已经load过epub
async function getEpubContent(href, offset, size) {
    var sec = currentBookEpub.spine.get(href);
    if (!sec) {
        throw new Error(`section not exists: ${href}`);
    }
    const contents = await sec.load(currentBookEpub.load.bind(currentBookEpub));
    const bodyText = html2epubText(contents);
    var result = '';
    var charCount = 0;

    for (let j = offset; j < bodyText.length; j++) {
        result += bodyText.charAt(j);
        charCount++;

        if (charCount >= size) {
            break;
        }
    }
    return result;
}

function getBookObj(bookName) {
    return new Promise((resolve) => {
        chrome.storage.local.get({ books: [] }, (result) => {
            var tmpBookObj = result.books.find(book => {
                return book.bookName.trim() == bookName;
            });
            resolve(tmpBookObj);
        })
    });
}

function html2epubText(html) {
    var $div = $('<div>').html(html);
    var bodyText = $div.find('body').text().replace(/\n\s*\n/g, '\n').trim();
    var result = '';
    for (let j = 0; j < bodyText.length; j++) {
        // 排除空格，连续多个换行只留1个
        if (bodyText.charAt(j) == ' ') {
            continue;
        }
        result += bodyText.charAt(j);
    }
    return result;
}

// todo bg转content用
function showEpubText(bodyText, href, offset) {
    var result = '';
    var charCount = 0;

    for (let j = offset; j < bodyText.length; j++) {
        result += bodyText.charAt(j);
        charCount++;

        if (charCount >= currentTextSize) {
            break;
        }
    }
    allowDisplay();
    // 将result bodytext href offset currentBookObj发给background，允许快捷键触发显示
    sendMessageToContent("allowDisplay", {
        result: result,
        bodyText: bodyText,
        href: href,
        offset: offset,
        currentBookObj: currentBookObj,
        currentBookToclist: currentBookToclist
    });

    // console.log(`从${offset}开始的${currentTextSize}字符：
    //     ${result}`);
}