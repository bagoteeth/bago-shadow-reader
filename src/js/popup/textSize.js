'use strict';

// textSizeContainer
const textSizeModifyButton = document.getElementById('textSizeModifyButton');
const textSizeInput = document.getElementById('textSizeInput');
const textSizeSaveButton = document.getElementById('textSizeSaveButton');

document.addEventListener('DOMContentLoaded', function () {
  initializeTextSize();

  textSizeModifyButton.addEventListener('click', handleTextSizeModifyButtonClick);
  textSizeSaveButton.addEventListener('click', handleTextSizeSaveButtonClick);
});


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

function initializeTextSize() {
  chrome.storage.local.get({ textSize: 200 }, function (data) {
    textSizeInput.value = data.textSize;
    currentTextSize = data.textSize;
  });
}