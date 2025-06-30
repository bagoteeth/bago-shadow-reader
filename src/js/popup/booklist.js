'use strict';

const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton');

const selectAll = document.getElementById('selectAll');
const fileList = document.getElementById('fileList');

document.addEventListener('DOMContentLoaded', function () {
    initializeFileList();

    addButton.addEventListener('click', handleAddButtonClick);
    deleteButton.addEventListener('click', handleDeleteButtonClick);
    selectAll.addEventListener('change', handleSelectAllChange);
    fileList.addEventListener('click', handleDetailPageShown);
    fileList.addEventListener('mouseover', handleMouseOver);
    fileList.addEventListener('mouseout', handleMouseOut);
});

function initializeFileList() {
    //获取本地记录
    chrome.storage.local.get({ books: [] }, function (result) {
        const tmpFiles = result.books;
        for (let book of tmpFiles) {
            addFileToTable(book.bookName);
        }
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
            filesToDelete.push(checkboxes[i].parentElement.nextElementSibling.textContent);
            // filelist开头多一行标题
            fileList.deleteRow(i + 1);
        }
    }
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
    chrome.storage.local.get({ books: [] }, function (result) {
        const tmpFiles = result.books || [];
        for (const file of selectedFiles) {
            blob2Base64(file2Blob(file)).then(bs64 => {
                tmpFiles.push({
                    // book结构
                    bookName: file.name,
                    readTime: 0,
                    readStatus: statusPreRead,
                    /* {
                      chapter: xxx,
                      progress: xxx,
                      timeStamp: xxx
                    } */
                    bookmarksList: [],
                    bookmarkEX: {
                        href: "",
                        offset: 0,
                        currentChapterCount: 0
                    },
                    // 文件本体
                    base64: bs64,
                });
                chrome.storage.local.set({ books: tmpFiles });
            }).catch(err => {
                alert(err);
            });
        }
    });
}

function file2Blob(file) {
    return new Blob([file], { type: file.type });
}

function blob2Base64(blob) {
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