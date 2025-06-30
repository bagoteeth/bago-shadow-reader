'use strict';

async function addBookmark(){
    if (!globalReadStatus) {
        console.log("未进入阅读状态");
        return null;
    }
    // bookmark结构
    var chapterName = await getChapterNameFromReader(bgCurrentBookObj.bookmarkEX.href)
    const bookmark = {
        chapter: chapterName,
        // bookmarkex应已被赋值
        progress: bgCurrentBookObj.bookmarkEX,
        timeStamp: Date.now()
    }
    // 全局变量更新
    bgCurrentBookObj.bookmarksList.push(bookmark);
    // 持久化
    saveCurrentBookObjBookMark();
    return bookmark;
}

function deleteBookmark(timeStamps){
    for(let i = bgCurrentBookObj.bookmarksList.length-1; i >= 0; i--){
        for(let j = 0; j < timeStamps.length; j++){
            if (bgCurrentBookObj.bookmarksList[i].timeStamp == timeStamps[j]){
                bgCurrentBookObj.bookmarksList.splice(i, 1);
                break;
            }
        }
    }
    saveCurrentBookObjBookMark();
}

function saveCurrentBookObjBookMark() {
    if (bgCurrentBookObj == null){
        return;
    }
    chrome.storage.local.get({ books: [] }, function (result) {
        var tmp = result.books;
        var index = tmp.findIndex(e => e.bookName == bgCurrentBookObj.bookName);
        tmp[index].bookmarksList = bgCurrentBookObj.bookmarksList;
        chrome.storage.local.set({ books: tmp });
    });
}