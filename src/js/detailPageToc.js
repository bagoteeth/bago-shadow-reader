'use strict';

const tocList = document.getElementById('tocList').querySelector('tbody');

function addTocToList(chapterName, href) {
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