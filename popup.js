'use strict';
const statusPreRead = "未阅读";
const statusOnRead = "阅读中";
const statusPostRead= "已读完";
// overviewContainer
const wordCountTotal = document.getElementById('wordCountTotal');
const readingTimeTotal = document.getElementById('readingTimeTotal');
// fileListContainer
const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton');

const selectAll = document.getElementById('selectAll');
const fileList = document.getElementById('fileList');
// detailPageContainer
const detailPage = document.getElementById('detailPageContainer');
const detailPageFileName = document.getElementById('bookTitle');
const detailPageWriter = document.getElementById('writer');
const detailPageTime = document.getElementById('readingTime');
const detailPageStatus = document.getElementById('bookStatus');
const tocList = document.getElementById('tocList').querySelector('tbody');
const bookmarksList = document.getElementById('bookmarksList').querySelector('tbody');
const selectAllBookmarks = document.getElementById('selectAllBookmarks');
const addBookmarkButton = document.getElementById('addBookmarkButton');
const deleteBookmarkButton = document.getElementById('deleteBookmarkButton');
const continueReadingButton = document.getElementById('continueReadingButton');
const detailPageCloseButton = document.getElementById('closeButton');
// ReadingControllerContainer
const exitButton = document.getElementById('exitButton');
const lastChapterButton = document.getElementById('lastChapterButton');
const lastPageButton = document.getElementById('lastPageButton');
const nextPageButton = document.getElementById('nextPageButton');
const nextChapterButton = document.getElementById('nextChapterButton');
// textSizeContainer
const textSizeModifyButton = document.getElementById('textSizeModifyButton');
const textSizeInput = document.getElementById('textSizeInput');
const textSizeSaveButton = document.getElementById('textSizeSaveButton');

var currentBookObj;
var currentBookEpub;
var currentTextSize;

document.addEventListener('DOMContentLoaded', function () {
  initOverview();
  initializeFileList();
  initializeTextSize();

  addButton.addEventListener('click', handleAddButtonClick);
  deleteButton.addEventListener('click', handleDeleteButtonClick);
  selectAll.addEventListener('change', handleSelectAllChange);
  fileList.addEventListener('click', handleDetailPageShown);
  fileList.addEventListener('mouseover', handleMouseOver);
  fileList.addEventListener('mouseout', handleMouseOut);

  selectAllBookmarks.addEventListener('click', handleSelectAllBookmarksChange);
  addBookmarkButton.addEventListener('click', handleAddBookmark);
  deleteBookmarkButton.addEventListener('click', handleDeleteBookmark);
  continueReadingButton.addEventListener('click', handleContinueReading);
  detailPageCloseButton.addEventListener('click', handleCloseDetailPageClick);

  exitButton.addEventListener('click', handleExitButton);
  lastChapterButton.addEventListener('click', handleLastChapterButton);
  lastPageButton.addEventListener('click', handleLastPageButton);
  nextPageButton.addEventListener('click', handleNextPageButton);
  nextChapterButton.addEventListener('click', handleNextChapterButton);

  textSizeModifyButton.addEventListener('click', handleTextSizeModifyButtonClick);
  textSizeSaveButton.addEventListener('click', handleTextSizeSaveButtonClick);
});

function handleAddBookmark(){
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
  chrome.storage.local.get({ books: []}, function (result){
    var tmp = result.books;
    var index = tmp.findIndex(e => e.bookName == currentBookObj.bookName);
    tmp[index] = currentBookObj;
    chrome.storage.local.set({books: tmp});
  });
}



function handleDeleteBookmark(){
  const checkboxes = bookmarksList.querySelectorAll('input[type="checkbox"]');
  for(let i = checkboxes.length-1;i>=0;i--){
    if(checkboxes[i].checked){
      bookmarksList.deleteRow(i);
      currentBookObj.bookmarksList.splice(i, 1);
    }
  }
  chrome.storage.local.get({ books: []}, function (result){
    var tmp = result.books;
    var index = tmp.findIndex(e => e.bookName == currentBookObj.bookName);
    tmp[index] = currentBookObj;
    chrome.storage.local.set({books: tmp});
  });
}

function handleContinueReading(){
  navigateToChapter2(currentBookObj.bookmarkEX.href, currentBookObj.bookmarkEX.offset);
}

function handleExitButton() {
  chrome.storage.local.set({ globalReadStatus: false });
  // todo 停止计时
}

function handleLastChapterButton() {

}

function handleLastPageButton() {

}

function handleNextPageButton() {

}

function handleNextChapterButton() {

}

function handleTextSizeModifyButtonClick() {
  textSizeInput.removeAttribute('disabled');
  textSizeInput.focus;
}

function handleTextSizeSaveButtonClick() {
  const newSize = parseInt(textSizeInput.value);
  chrome.storage.local.set({ textSize: newSize });
  currentTextSize = newSize;

  textSizeInput.setAttribute('disabled', true);
}

function handleCloseDetailPageClick() {
  detailPage.style.display = 'none';
}

function initializeFileList() {
  //获取本地记录
  chrome.storage.local.get({ books: [] }, function (result) {
    const tmpFiles = result.books;
    for(let book of tmpFiles){
      addFileToTable(book.bookName);
    }
  });
  // chrome.runtime.sendMessage({ action: 'getFiles' }, function (response) {
  //   response.files.forEach(file => addFileToTable(file));
  // });
}

function initOverview() {
  chrome.storage.local.get('readingTimeTotal', function (data) {
    const previousSize = data.readingTimeTotal || 0;
    readingTimeTotal.value = data.readingTimeTotal;
  });
chrome.storage.local.get('wordCountTotal', function (data) {
    const previousSize = data.wordCountTotal || 0;
    wordCountTotal.value = data.wordCountTotal;
  });
}

function initializeTextSize() {
  chrome.storage.local.get({ textSize: 200 }, function (data) {
    textSizeInput.value = data.textSize;
    currentTextSize = data.textSize;
  });
}

function handleAddButtonClick() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.epub';
  fileInput.multiple = true;
  fileInput.addEventListener('change', handleFileInputChange);
  fileInput.click();

  // chrome.fileSystem.chooseEntry({type: 'openFile', accepts: [{extensions: ['epub']}], accpetcMultiple: true}, function(fileEntries){
  //   if (fileEntries && fileEntries,length > 0){
  //     fileEntries.forEach(fe => handleFileInput(fe));
  //   } else {
  //     alert('未选择文件');
  //   }
  // });
}

function handleDeleteButtonClick() {
  const filesToDelete = [];
  const checkboxes = document.querySelectorAll('.file-row input[type="checkbox"]');
  for (let i = checkboxes.length - 1; i >= 0; i--) {
    if (checkboxes[i].checked) {
      filesToDelete.push(checkboxes[i].parentElement.nextElementSibling.textContent);
      // filelist开头多一行标题
      fileList.deleteRow(i + 1);
    }
  }
  // chrome.runtime.sendMessage({ action: 'deleteFiles', files: filesToDelete });
  chrome.storage.local.get({ books: [] }, function (result) {
    const tmpFiles = result.books.filter(function (book) {
      return !filesToDelete.includes(book.bookName);
    })
    chrome.storage.local.set({ books: tmpFiles });
  });
}

function handleSelectAllChange() {
  const checkboxes = document.querySelectorAll('.file-row input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  });
}

function handleSelectAllBookmarksChange() {
  const checkboxes = bookmarksList.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAllBookmarks.checked;
  });
}

// deprecated
// 每个文件调用一次
function handleFileInput(fe) {
  var fileName = fe.name;

  fe.file(file => {
    var reader = new FileReader;
    reader.onload = function(event){
      var fileContent = event.target.result;
      chrome.fileSystem.getWritableEntry(fe, function(writableEntry){
        // 重名不进行操作
        chrome.fileSystem.restoreEntry(fileName ,function(existingEntry){
          if(existingEntry){
            alert('存在重名文件，不进行操作：', fileName);
            return;
          }
        });

        writableEntry.createWriter(function(writer){
          writer.onerror = function(err){
            alert('写入文件错误', err);
          };
          writer.onwriteend = function(){
            chrome.storage.local.get({books: []}, function(result){
              const tmpFiles = result.books || {};
              tmpFiles.push({
                bookName: fileName,
                url: writableEntry.toURL(),
                readTime: 0,
                readStatus: statusPreRead,
                /* bookmarksList{
                  chapter: xxx,
                  progress: xxx,
                  createTime: xxx
                } */
                bookmarksList: [],
                bookmarkEX: 0,
              });
              chrome.storage.local.set({ books: tmpFiles });
            });
          };
          writer.write(new Blob([fileContent]));
        });
      });
    };
    reader.readAsArrayBuffer(file);
    addFileToTable(fileName);
  });
}

function handleFileInputChange(event) {
  const selectedFiles = event.target.files;
  for (const file of selectedFiles) {
    if (checkDuplicate(file.name)) {
      alert(`${file.name}已存在`);
      return;
    }
  }
  for (const file of selectedFiles) {
    addFileToTable(file.name);
  }
  // 持久化
  // chrome.runtime.sendMessage({ action: 'addFiles', files: selectedFiles})
  chrome.storage.local.get({ books: [] }, function (result) {
    const tmpFiles = result.books || [];
    for (const file of selectedFiles) {
      blob2Base64(file2Blob(file)).then(bs64 => {
        tmpFiles.push({
          // fixme
          bookName: file.name,
          readTime: 0,
          readStatus: statusPreRead,
          /* {
            chapter: xxx,
            progress: xxx,
            createTime: xxx
          } */
          bookmarksList: [],
          bookmarkEX: {
            href: "",
            offset: 0,
          },
          // 文件本体
          base64:bs64,
        });
        chrome.storage.local.set({ books: tmpFiles });
      }).catch(err => {
        alert(err);
      });
    }
  });
}

function file2Blob(file){
  return new Blob([file], {type: file.type});
}

function blob2Base64(blob){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      var base64 = reader.result; 
      resolve(base64);
    };
    reader.onerror = err => {
      reject(err);
    }
  });
}

function base642Blob(bs64){
  const mimeType = 'application/epub+zip';
  const byteCharacters = atob(bs64.split(";base64,")[1]);
  const byteNumbers = [];
  for(let i = 0; i < byteCharacters.length; i++){
    byteNumbers.push(byteCharacters.charCodeAt(i));
  }
  const byteArr = new Uint8Array(byteNumbers);
  return new Blob([byteArr], {type: mimeType});
}

function checkDuplicate(fileNameText) {
  const existingFiles = Array.from(fileList.querySelectorAll('.file-row td:nth-child(2)')).map(cell => cell.textContent.trim());
  return existingFiles.includes(fileNameText);
}

// 只负责修改表格，持久化在其他地方做
function addFileToTable(fileNameText) {
  const row = fileList.insertRow();
  row.classList.add('file-row');

  const checkboxCell = row.insertCell(0);
  const filenameCell = row.insertCell(1);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkboxCell.appendChild(checkbox);
  const fileName = document.createTextNode(fileNameText);
  filenameCell.appendChild(fileName);
}

function handleDetailPageShown(event) {
  if (!(event.target && event.target.tagName === 'TD' && event.target.parentElement.rowIndex > 0 && event.target.cellIndex === 1)) {
    return;
  }
  const bookName = event.target.textContent.trim();
  chrome.storage.local.get({ books: []}, function (result){
    currentBookObj = result.books.find(book => {
      return book.bookName.trim() == bookName;
    });
    // 加载阅读时间，状态，书签
    detailPageStatus.textContent = currentBookObj.readStatus;
    detailPageTime.textContent = currentBookObj.readTime;
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
        if(currentBookObj.bookmarkEX.href == ""){
          currentBookObj.bookmarkEX.href = toc.href;
        }
      });
    });
    
    detailPage.style.display = 'block';
  });
}

function addTocToList(chapterName, href){
  const row = tocList.insertRow();
  const chapterCell = row.insertCell(0);
  // const progressCell = row.insertCell(1);
  
  chapterCell.textContent = chapterName;

  // progressCell.textContent = href;
  

  [chapterCell].forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.addEventListener('click', () => {
      navigateToChapter2(href, 0);
    });
  });
}

function addBookmarkToList(bookmark){
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
    })
  });
}

async function getCfiFromHref(href) {
  const id= href.split('#')[1];
  var sec = currentBookEpub.spine.get(href);
  sec.load(currentBookEpub.load.bind(currentBookEpub)).then(html => {
    const el = id ? html.document.getElementById(id) : html.document.body;
    console.log(html.cfiFromElement(el));
    return html.cfiFromElement(el);
  });
}

// todo无法正确找到
function getChapterFromCFI(cfi){
  let flattenedToc = (function flatten(items) {
    return [].concat.apply([], items.map(item => [].concat.apply(
        [item],
        flatten(item.subitems)
    )));
  })(currentBookEpub.navigation.toc);
  console.log("flattenedToc", flattenedToc);

  let parsed = new ePub.CFI(cfi);
  console.log("parsed", parsed);

  let entry = currentBookEpub.spine.get(parsed.spinePos);
  console.log("entry", entry);
  if (!entry) return null;

  let matched = Object.entries(currentBookEpub.navigation.tocById).filter(e => e[1] == entry.index);
  console.log("matched", matched);
  if (matched.length < 1) return null;

  let matchedToc = flattenedToc.filter(e => e.id == matched[0][0]);
  console.log("matchedToc", matchedToc);
  if (matchedToc.length < 1) return null;
  return matchedToc[0].label.trim();
}

function getChapterFromCFI2(cfi){
  let spineItem = currentBookEpub.spine.get(cfi);
  let navItem = currentBookEpub.navigation.get(spineItem.href);
  return navItem.label.trim();
}

// deprecated
// 让特殊书签跳转到对应index（特殊书签，目录，书签）
function navigateToChapter(cfi){
  currentBookObj.bookmarkEX = cfi;
  chrome.storage.local.set({ globalReadStatus: true });
  // todo 其他
}

// 未能弄清楚如何用cfi控制位置，通过href/index+自定义offset定位
function navigateToChapter2(href, offset){
  currentBookObj.bookmarkEX.href = href;
  currentBookObj.bookmarkEX.offset = offset;
  // bookmarkex变化，进入阅读模式。存storage
  chrome.storage.local.get({ books: []}, function (result){
    var tmp = result.books;
    var index = tmp.findIndex(e => e.bookName == currentBookObj.bookName);
    tmp[index] = currentBookObj;
    chrome.storage.local.set({books: tmp});
  });
  chrome.storage.local.set({ globalReadStatus: true });

  var sec = currentBookEpub.spine.get(href);
  if (!sec){
    console.log('section not exists: ', href);
    return;
  }
  sec.load(currentBookEpub.load.bind(currentBookEpub)).then(html => {
    // 取所有文本，提取前size字符
    try{
      var $div = $('<div>').html(html);
      var bodyText = $div.find('body').text().replace(/\n\s*\n/g, '\n').trim();

      var result = '';
      var charCount = 0;
      for(let j=offset; j<bodyText.length;j++){
        // 排除空格，连续多个换行只留1个
        if (bodyText.charAt(j) == ' '){
          continue;
        }
        result += bodyText.charAt(j);
        if (bodyText.charAt(j).trim() !== ''){
          charCount++;
        }
        
        if (charCount > currentTextSize){
          break;
        }
      }
      console.log(`从${offset}开始的${currentTextSize}字符：
      ${result}`);
    }
    catch (error) {
      console.error('处理HTML内容时出现错误:', error);
    }
  });

  // todo 其他
}

function handleMouseOver(event) {
  if (event.target && event.target.tagName === 'TD' && event.target.parentElement.rowIndex > 0 && event.target.cellIndex === 1) {
    event.target.style.color = '#888888';
    event.target.style.cursor = 'pointer';
  }
}

function handleMouseOut(event) {
  if (event.target && event.target.tagName === 'TD' && event.target.parentElement.rowIndex > 0 && event.target.cellIndex === 1) {
    event.target.style.color = '';
    event.target.style.cursor = '';
  }
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.action != "modifyRendition"){
    return;
  }
  console.log("popup render");
  var div = document.querySelector("currentRendition");
  if(div){
    currentBookEpub.renderTo(div);
  }
});