`
{
    "bookName": "xxx",
    "bookmarksList": {
        "chapter": "chapterName",
        "progress": {
            "href": "",
            "offset": 0,
            "currentChapterCount: 0    
        },
        "timeStamp": Date.now()
    }
    "bookmarkEX": {
        "href": "",
        "offset": 0,
        "currentChapterCount: 0    
    },
    "base64": "xxx",
    "readTime": 0,
    "readStatus": "xxx"
}
`
var bgCurrentBookObj;
`
[{"href1": 111}, {"href2": 222}]
`
var bgCurrentBookToclist = [];
var bodyText;
var displayText;

var readerTabId = null;

var globalReadStatus = false;
var globalDisplayStatus = false;

var timerInterval;
var isTimerRunning = false;
var currentReadingTime;
var globalReadingTimeTotal;