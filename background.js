var tabId;
var windowId;
var flag = 1;
var timedict = {};
// var btn = document.getElementById("btn");
// var blockurl = document.getElementById("url");

// btn.addEventListener("click", () => {
//     var dom = bg.parseDomainFromUrl(blockurl.value);
//     console.log(`成功设置域名：${dom}`);
// });

function isEmpty(dict) {
    for (a in dict)
        return false;
    return true;
}

function getlen(dict) {
    var sum = 0;
    for (a in dict)
        sum++;
    return sum;
}

function parseDomainFromUrl(url) {
    let t, n;
    return n = document.createElement("a"), n.href = url, t = n.hostname, t;
}

function parseURL(url) {
    url = String(url);
    if (url.slice(0, 8) === "https://") {
        url = url.slice(8);
        console.log(url);
    } else if (url.slice(0, 7) === "http://") {
        url = url.slice(7);
    }
    return url;
}

function TimetoStr(h, m, s) {
    return String(h) + '-' + String(m) + '-' + String(s);
}

function StrtoTime(s) {
    a = s.split('-');

    return { "hour": a[0], "minute": a[1], "second": a[2] };
}

function getdate() {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    str = String(year) + '-' + String(month + 1) + '-' + String(date)
    return str;
}

function interval() {
    // chrome.storage.local.clear(function() { console.log("clear all!"); });
    let url;
    try {
        let tmp_url;
        chrome.tabs.query({ 'active': true }, async a => {
            flag = 0;
            for (let i = 0; i < getlen(a); ++i) {
                if (flag)
                    return;
                value = a[i];
                tabId = value.id;
                tmp_url = parseDomainFromUrl(value.url);
                // console.log(url);
                windowId = value.windowId;
                if (windowId !== -1) {
                    await chrome.windows.get(windowId, function(chromeWindow) {
                        if (chromeWindow.state !== "minimized") {
                            url = tmp_url;
                            // console.log(chromeWindow.state);
                            if (url.slice(0, 19) !== "chrome-extension://") {
                                // console.log(`${url}`);

                                chrome.storage.local.get(`${url}`, (dict) => {
                                    let tdict = dict[`${url}`];
                                    // console.log(tdict);
                                    if (!isEmpty(tdict)) {
                                        let date = getdate();
                                        if (date !== tdict['date']) {
                                            let time = StrtoTime(tdict['setTime']);
                                            time['date'] = tdict['date'];
                                            time['setTime'] = tdict['setTime'];
                                            chrome.storage.local.set({
                                                [`${url}`]: time
                                            });
                                            tdict = time;
                                        }
                                        let second = tdict['second'];
                                        let minute = tdict['minute'];
                                        let hour = tdict['hour'];
                                        second--;
                                        if (second < 0) {
                                            second = 59;
                                            minute -= 1;
                                        }
                                        if (minute < 0) {
                                            minute = 59;
                                            hour -= 1;
                                        }
                                        if (hour == -1) {
                                            tdict['second'] = 0;
                                            tdict['minute'] = 0;
                                            tdict['hour'] = 0;
                                            chrome.storage.local.set({
                                                [`${url}`]: tdict
                                            });
                                            console.log("时间归零");
                                            chrome.tabs.update(tabId, { "url": "suspended.html" }, tab => {});
                                        } else {
                                            tdict['second'] = second;
                                            tdict['minute'] = minute;
                                            tdict['hour'] = hour;
                                            chrome.storage.local.set({
                                                [`${url}`]: tdict
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        })
    } catch { console.log("background.js"); }
}


window.setInterval(() => { interval() }, 1000);
// chrome.tabs.onActivated.addListener(tab => {
//     //在这里写判断网页是否在里面

//     //每次这个时候都判断，判断存在了才开始计时，计时的第一步是先判断是否时间已经到了
//     //时间到了之后，
//     tabId = tab.tabId;
//     //在这里写计时

// }), window.setInterval(() => { interval(tabId) }, 1000);