'use strict';
// fileListContainer
const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton');
const exitButton = document.getElementById('exitButton');
const selectAll = document.getElementById('selectAll');
const fileList = document.getElementById('fileList');
// detailPageContainer
const detailPage = document.getElementById('detailPageContainer');
const detailPageFileName = document.getElementById('bookTitle');
const detailPageWordCount = document.getElementById('wordCount');
const detailPageTime = document.getElementById('readingTime');
const detailPageStatus = document.getElementById('bookStatus');
const tocList = document.getElementById('tocList');
const bookmarksList = document.getElementById('bookmarksList');
const deleteBookmarkButton = document.getElementById('deleteBookmarkButton');
const continueReadingButton = document.getElementById('continueReadingButton');
const detailPageCloseButton = document.getElementById('closeButton');
// textSizeContainer
const textSizeModifyButton = document.getElementById('textSizeModifyButton')
const textSizeInput = document.getElementById('textSizeInput')
const textSizeSaveButton = document.getElementById('textSizeSaveButton')

document.addEventListener('DOMContentLoaded', function () {
  initializeFileList();
  initializeTextSize();

  addButton.addEventListener('click', handleAddButtonClick);
  deleteButton.addEventListener('click', handleDeleteButtonClick);
  selectAll.addEventListener('change', handleSelectAllChange);
  fileList.addEventListener('click', handleDetailPageShown);
  fileList.addEventListener('mouseover', handleMouseOver);
  fileList.addEventListener('mouseout', handleMouseOut);

  deleteBookmarkButton.addEventListener('click', handleDeleteBookmark);
  continueReadingButton.addEventListener('click', handleContinueReading);
  detailPageCloseButton.addEventListener('click', handleCloseDetailPageClick);

  textSizeModifyButton.addEventListener('click', handleTextSizeModifyButtonClick);
  textSizeSaveButton.addEventListener('click', handleTextSizeSaveButtonClick);
});

function handleDeleteBookmark(){

}

function handleContinueReading(){

}

function handleTextSizeModifyButtonClick() {
  textSizeInput.removeAttribute('disabled');
  textSizeInput.focus;
}

function handleTextSizeSaveButtonClick() {
  const newSize = parseInt(textSizeInput.value);
  chrome.storage.local.set({ textSize: newSize })

  textSizeInput.setAttribute('disabled', true);
}

function handleCloseDetailPageClick() {
  detailPage.style.display = 'none';
}

function initializeFileList() {
  //获取本地记录
  chrome.storage.local.get({ files: [] }, function (result) {
    const tmpFiles = result.files;
    tmpFiles.forEach(file => addFileToTable(file));
  });
  // chrome.runtime.sendMessage({ action: 'getFiles' }, function (response) {
  //   response.files.forEach(file => addFileToTable(file));
  // });
}

function initializeTextSize() {
  chrome.storage.local.get({ textSize: 200 }, function (data) {
    textSizeInput.value = data.textSize;
  });
}

function handleAddButtonClick() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.epub';
  fileInput.multiple = true;
  fileInput.addEventListener('change', handleFileInputChange);
  fileInput.click();
}

function handleDeleteButtonClick() {
  const filesToDelete = [];
  const checkboxes = document.querySelectorAll('.file-row input[type="checkbox"]');
  for (let i = checkboxes.length - 1; i >= 0; i--) {
    if (checkboxes[i].checked) {
      // 不能同名
      filesToDelete.push(checkboxes[i].parentElement.nextElementSibling.textContent);
      // filelist开头多一行标题，checkboxes相当于从第二行开始
      fileList.deleteRow(i + 1);
    }
  }
  // chrome.runtime.sendMessage({ action: 'deleteFiles', files: filesToDelete });
  chrome.storage.local.get({ files: [] }, function (result) {
    const tmpFiles = result.files.filter(function (fileName) {
      return !filesToDelete.includes(fileName);
    })
    chrome.storage.local.set({ files: tmpFiles });
  });
}

function handleSelectAllChange() {
  const checkboxes = document.querySelectorAll('.file-row input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
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
  chrome.storage.local.get({ files: [] }, function (result) {
    const tmpFiles = result.files;
    for (const file of selectedFiles) {
      tmpFiles.push(file.name);
    }
    chrome.storage.local.set({ files: tmpFiles });
  });
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
  // 暂时只显示文件名
  const fileName = document.createTextNode(fileNameText);
  filenameCell.appendChild(fileName);
}

function handleDetailPageShown(event) {
  if (event.target && event.target.tagName === 'TD' && event.target.parentElement.rowIndex > 0 && event.target.cellIndex === 1) {
    detailPageFileName.textContent = event.target.textContent.trim();
    //加载字数，时间，状态，目录，书签
    
    detailPage.style.display = 'block';
  }
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

