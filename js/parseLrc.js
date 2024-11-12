/**
 * 解析歌词字符串
 * 每个歌词对象
 * {time:开始时间,words:歌词内容}
 */
function parseLrc() {
    var lines = lrc.split('\n')
    var result = []
    for (let i = 0; i < lines.length; i++) {
        var str = lines[i]
        var parts = str.split(']')
        var timeStr = parts[0].substring(1)
        var obj = {
            time: parseTime(timeStr),
            timeStr: timeStr,
            words: parts[1]
        }
        result.push(obj)
    }
    return result
}

/**
 * @description: 将一个时间字符串解析为数字（秒）
 * @param {*} timeStr
 * @return {*}
 */
function parseTime(timeStr) {
    var parts = timeStr.split(':')
    return +parts[0] * 60 + +parts[1]

    // 保留小数点
    // const [minutes, seconds] = timeStr.split(':');
    // const [sec, millisec] = seconds.split('.');

    // const totalSeconds = parseInt(minutes) * 60 + parseInt(sec) + (millisec ? parseInt(millisec) / 100 : 0);
    // return totalSeconds;
}

var lrcData = [];//parseLrc()

var doms = {
    ul: document.querySelector('.music-lrc div'),
    container: document.querySelector('.music-lrc')
}

/**
 * @description: 计算出，在当前播放器播放到第几秒的情况
 * lrcData数组中，应该高亮显示的歌词下
 * @return {*}
 */
function findIndex() {
    // 播放器当前时间
    var curTime = doms.audio.currentTime
    for (let i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time) {
            return i - 1
        }
    }
    return lrcData.length - 1
}

// 界面
/**
 * @description: 创建歌词界面元素
 * @return {*}
 */
function createLrcElements() {
    // 创建一个文档片段，脱离dom元素
    var frag = document.createDocumentFragment()
    for (let i = 0; i < lrcData.length; i++) {
        var li = document.createElement('p');
        let word = lrcData[i].words;
        li.textContent = lrcData[i].words;
        li.setAttribute('data-time', lrcData[i].timeStr);
        li.setAttribute('data-index', lrcData[i].time);
        li.classList.add('lyric');
        if(word.length == 0) {
            li.classList.add('lrc-li-hidden');
        }
        
        if(i == 0) {
            li.classList.add('active')
        }
        frag.appendChild(li)  // 添加到文档片段
    }
    doms.ul.appendChild(frag)

    setTimeout(function() {
        liHeight = doms.ul.children[0].clientHeight;
        maxOffset = doms.ul.clientHeight - containerHeight;
        containerHeight = $(".music-lrc").height();
    }, 500);
}

// createLrcElements()

// 容器高度
var containerHeight = 0;// $(".music-lrc").height();

// li高度
var liHeight = 0; // doms.ul.children[0].clientHeight;
// 获取最大偏移高度
var maxOffset = 0;//doms.ul.clientHeight - containerHeight
/**
 * @description: 设置ul 元素的偏移量
 * @return {*}
 */
function setOffset(index) {
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if (offset < 0) {
        offset = 0
    }
    if (offset > maxOffset) {
        offset = maxOffset
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
    // 去除active样式
    var li = doms.ul.querySelector('.active')
    if(li) {
        li.classList.remove('active')
    }
    li = doms.ul.children[index]
    if (li) {
        li.classList.add('active')
    }
}

function findTime(curTime) {
    for (let i = 0; i < lrcData.length; i++) {
       
        if (curTime < lrcData[i].time) {
            return i - 1;
        }
    }
    // 播放到最后一句了
    return lrcData.length - 1;
}

function findLrcIndex(time) {
    const curTime = findTime(Number(time));
    setOffset(curTime);
}
