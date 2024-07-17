'use strict';

// overviewContainer
// const wordCountTotal = document.getElementById('wordCountTotal');
// fileListContainer
// detailPageContainer

// deprecated
// 每个文件调用一次
// function handleFileInput(fe) {
//   var fileName = fe.name;

//   fe.file(file => {
//     var reader = new FileReader;
//     reader.onload = function (event) {
//       var fileContent = event.target.result;
//       chrome.fileSystem.getWritableEntry(fe, function (writableEntry) {
//         // 重名不进行操作
//         chrome.fileSystem.restoreEntry(fileName, function (existingEntry) {
//           if (existingEntry) {
//             alert('存在重名文件，不进行操作：', fileName);
//             return;
//           }
//         });

//         writableEntry.createWriter(function (writer) {
//           writer.onerror = function (err) {
//             alert('写入文件错误', err);
//           };
//           writer.onwriteend = function () {
//             chrome.storage.local.get({ books: [] }, function (result) {
//               const tmpFiles = result.books || {};
//               // 这里是定义book结构
//               tmpFiles.push({
//                 bookName: fileName,
//                 url: writableEntry.toURL(),
//                 readTime: 0,
//                 readStatus: statusPreRead,
//                 /* bookmarksList{
//                   chapter: xxx,
//                   progress: xxx,
//                   createTime: xxx
//                 } */
//                 bookmarksList: [],
//                 bookmarkEX: 0,
//               });
//               chrome.storage.local.set({ books: tmpFiles });
//             });
//           };
//           writer.write(new Blob([fileContent]));
//         });
//       });
//     };
//     reader.readAsArrayBuffer(file);
//     addFileToTable(fileName);
//   });
// }

// async function getCfiFromHref(href) {
//   const id = href.split('#')[1];
//   var sec = currentBookEpub.spine.get(href);
//   sec.load(currentBookEpub.load.bind(currentBookEpub)).then(html => {
//     const el = id ? html.document.getElementById(id) : html.document.body;
//     console.log(html.cfiFromElement(el));
//     return html.cfiFromElement(el);
//   });
// }

// todo无法正确找到
// function getChapterFromCFI(cfi){
//   let flattenedToc = (function flatten(items) {
//     return [].concat.apply([], items.map(item => [].concat.apply(
//         [item],
//         flatten(item.subitems)
//     )));
//   })(currentBookEpub.navigation.toc);
//   console.log("flattenedToc", flattenedToc);

//   let parsed = new ePub.CFI(cfi);
//   console.log("parsed", parsed);

//   let entry = currentBookEpub.spine.get(parsed.spinePos);
//   console.log("entry", entry);
//   if (!entry) return null;

//   let matched = Object.entries(currentBookEpub.navigation.tocById).filter(e => e[1] == entry.index);
//   console.log("matched", matched);
//   if (matched.length < 1) return null;

//   let matchedToc = flattenedToc.filter(e => e.id == matched[0][0]);
//   console.log("matchedToc", matchedToc);
//   if (matchedToc.length < 1) return null;
//   return matchedToc[0].label.trim();
// }

// function getChapterFromCFI2(cfi){
//   let spineItem = currentBookEpub.spine.get(cfi);
//   let navItem = currentBookEpub.navigation.get(spineItem.href);
//   return navItem.label.trim();
// }

// deprecated
// 让特殊书签跳转到对应index（特殊书签，目录，书签）
// function navigateToChapter(cfi){
//   currentBookObj.bookmarkEX = cfi;
//   chrome.storage.local.set({ globalReadStatus: true });
// }

// 未能弄清楚如何用cfi控制位置，通过href/index+自定义offset定位

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.action != "modifyRendition") {
    return;
  }
  console.log("popup render");
  var div = document.querySelector("currentRendition");
  if (div) {
    currentBookEpub.renderTo(div);
  }
});