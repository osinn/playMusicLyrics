let scrollBottom = 0;
function updateCurrentTime(currentTime) {
    try {
        // console.log("进度", currentTime);
        const lyrics = document.querySelectorAll('.lyric');

        const lyricTime = Array.from(lyrics).map(lyric => ({
            time: lyric.dataset.time.split(':').reduce((acc, val) => acc * 60 + +val, 0),
        node: lyric
        }));

        // 获取当前应该显示的歌词行
        let currentLyric = null;
        try{
            currentLyric = getCurrentLine(lyricTime, currentTime);
            // android.htmlLog("桌面歌词组件播放当前位置："+ currentLyric);
        } catch(e) {
            android.htmlLog("桌面歌词组件播放异常："+ e);
            return;
        }

        // android.htmlLog("桌面歌词组件播放当前位置节点：" + currentLyric.currentLine);
        const currentLine = currentLyric.currentLine;

        if(!currentLine) {
            return;
        }
        
        // android.htmlLog("桌面歌词组件播放当前位置进度："+ currentLine.node.innerHTML);
        if (currentLine &&  currentLine.node.innerHTML && currentLine.node.innerHTML.length > 0) {
            // 移除所有歌词的 active 类

            lyrics.forEach(lyric => {
                // console.log(lyric);
                if(lyric == currentLine.node && currentLine.node.classList.contains('active')) {
                
                } else {
                    lyric.classList.remove('active');
                }
            });

            if(!currentLine.node.classList.contains('active')) {
                // android.htmlLog("桌面歌词组件播放滚动激活" + currentLine.node.innerHTML);
                currentLine.node.classList.add('active');
                // 计算页面的总高度和当前滚动位置
                const totalHeight = document.getElementById('lrc-list2').scrollHeight;


                const scrollTop = document.getElementById('lrc-list2').scrollTop + 403;
                const currentTimeTrunc = Math.trunc(currentTime);
                if(scrollTop >= totalHeight && currentTimeTrunc) {
                    scrollBottom += 30;
                    $("#lrc-list2").css('bottom', scrollBottom +'px');
                }
            }
            // android.htmlLog("桌面歌词组件播放滚动");
            currentLine.node.scrollIntoView({ behavior: 'smooth', block: 'center',inline: "center" });
        }
    } catch(e) {
        android.htmlLog("桌面歌词组件播放异常："+ e);
    }
}

// 模拟整数每秒递增 会找不到 261.01 最后一行位置
function getCurrentLine(lyricTime, currentTime) {
    let currentLine = null;
    let lyricNumber = 0;
    let lyricTotalNumber = 0;
    try {
        for (let i = 0; i < lyricTime.length; i++) {
            let lyric = lyricTime[i].node.innerHTML;
            if (currentTime >= lyricTime[i].time && (!currentLine || currentTime - lyricTime[i].time < currentTime - currentLine.time)) {
                currentLine = lyricTime[i];
                if(lyric && lyric.length > 0) {
                    lyricNumber++;
                }
            }
    
            
            if(lyric && lyric.length > 0) {
                lyricTotalNumber++;
            }
        }
    } catch(e) {
        android.htmlLog("桌面歌词组件播放异常："+ e);
    }
    return {
        currentLine: currentLine,
        lyricNumber: lyricNumber,
        lyricTotalNumber: lyricTotalNumber
    };
}