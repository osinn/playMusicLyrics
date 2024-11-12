//$(function(){
    let musicState = false;
    var player = $('#player');                 // 歌曲信息模块
    var playerContent1 = $('#player-content1');// 歌曲信息模块部分dom元素
    var musicName = $('.music-name');          // 歌曲名部分dom元素
    var artistName = $('.artist-name');        // 歌手名部分dom元素
    var musicImgs = $('.music-imgs');          // 左侧封面图dom元素
    var playPauseBtn = $('.play-pause');       // 播放/暂停按钮 dom元素
    var playPrevBtn = $('.prev');              // 上一首按钮 dom元素
    var playNextBtn = $('.next')               // 下一首按钮 dom元素
    var volumeIcon = $('#volume');             // 音量按钮 dom元素
    var orderIcon = $('#order');               // 顺序按钮 dom元素
    var list = $('#list');                     // 列表按钮 dom元素
    var range = $('.range');                   // 音量range条 dom元素
    var panel = $('.panel');                   // 音量隐藏部分 dom元素
    var numText = $('.text');                  // 显示的音量数字 dom元素
    var numText2 = $('.text2');                // 隐藏的音量数字 dom元素
    var time = $('.time');                     // 时间信息部分 dom元素
    var tProgress = $('.current-time');        // 当前播放时间文本部分 dom元素
    var totalTime = $('.total-time');          // 歌曲总时长文本部分 dom元素
    var sArea = $('#s-area');                  // 进度条部分
    var insTime = $('#ins-time');              // 鼠标移动至进度条上面，显示的信息部分
    var sHover = $('#s-hover');                // 鼠标移动至进度条上面，前面变暗的进度条部分
    var seekBar = $('#seek-bar');              // 播放进度条部分
    var lrcList2 = $("#lrc-list2");

    // 一些计算所需的变量
    var seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, bTime, realTimerange, volumeBL, isMove, isMove2, isHide = false, domOpacity = 10, nTime = 0;


    var index = 1;                   // 播放模式索引,默认设为顺序播放
    // 歌曲总时长
    // let duration = 0.001;

    // 应用通知播放/暂停
    function startPlayPause(state){
        if (state) {
            playerContent1.addClass('active'); // 内容栏上移
            musicImgs.addClass('active');      // 左侧图片开始动画效果
            playPauseBtn.attr('class','btn play-pause icon-zanting iconfont') // 显示暂停图标
            musicState = state;
        } else {
            // playerContent1.removeClass('active'); // 内容栏下移
            musicImgs.removeClass('active');      // 左侧图片停止旋转等动画效果
            playPauseBtn.attr('class','btn play-pause icon-jiediankaishi iconfont'); // 显示播放按钮
            musicImgs.removeClass('buffering');    // 移除缓冲类名
            musicState = state;
        }
    }

    // 鼠标移动在进度条上， 触发该函数
	function showHover(event){
		// seekBarPos = sArea.offset();    // 获取进度条长度
		// seekT = event.clientX - seekBarPos.left;  //获取当前鼠标在进度条上的位置
		// seekLoc = duration * (seekT / sArea.outerWidth()); //当前鼠标位置的音频播放秒数： 音频长度(单位：s)*（鼠标在进度条上的位置/进度条的宽度）
		// sHover.width(seekT);  //设置鼠标移动到进度条上变暗的部分宽度
		// cM = seekLoc / 60;    // 计算播放了多少分钟： 音频播放秒速/60
		// ctMinutes = Math.floor(cM);  // 向下取整
		// ctSeconds = Math.floor(seekLoc - ctMinutes * 60); // 计算播放秒数

		// if( (ctMinutes < 0) || (ctSeconds < 0) )
		// 	return;

        // if( (ctMinutes < 0) || (ctSeconds < 0) )
		// 	return;

		// if(ctMinutes < 10)
		// 	ctMinutes = '0'+ctMinutes;
		// if(ctSeconds < 10)
		// 	ctSeconds = '0'+ctSeconds;

        // if( isNaN(ctMinutes) || isNaN(ctSeconds) )
        //     insTime.text('--:--');
        // else
		//     insTime.text(ctMinutes+':'+ctSeconds);  // 设置鼠标移动到进度条上显示的信息

		// insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);  // 淡入效果显示

	}

    // 鼠标移出进度条，触发该函数
    function hideHover(){
        sHover.width(0);  // 设置鼠标移动到进度条上变暗的部分宽度 重置为0
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0); // 淡出效果显示
    }

    // 鼠标点击进度条，触发该函数
    function playFromClickedPos(){
        // audio.currentTime = seekLoc; // 设置音频播放时间 为当前鼠标点击的位置时间
		seekBar.width(seekT);        // 设置进度条播放长度，为当前鼠标点击的长度
		hideHover();                 // 调用该函数，隐藏原来鼠标移动到上方触发的进度条阴影
    }

    // 在音频的播放位置发生改变是触发该函数
    function updateCurrTime(progress){
        const currentTime = Number(progress.position);
        const duration = Number(progress.duration);
        // android.htmlLog("当前进度："+ currentTime + " 总时长："+ duration);

        nTime = new Date();      // 获取当前时间
        nTime = nTime.getTime(); // 将该时间转化为毫秒数

        // 计算当前音频播放的时间
		curMinutes = Math.floor(currentTime  / 60);
        curSeconds = Math.floor(currentTime  - curMinutes * 60);


		// 计算当前音频总时间
		durMinutes = Math.floor(duration / 60);
        
        durSeconds = Math.floor(duration - durMinutes * 60);

        
             
        if(!currentTime || !duration) {
            return;
        }
        try{
            // android.htmlLog("currentTime："+ currentTime + " duration：" + duration);

		// 计算播放进度百分比
		const playProgress = duration > 0 && currentTime > 0 ? (currentTime  / duration) * 100 : 1;
        // android.htmlLog("currentTime22222："+ currentTime + " duration2222：" + duration);
        // 如果时间为个位数，设置其格式
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;

		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;

        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
            tProgress.text(curMinutes+':'+curSeconds);

        if( isNaN(durMinutes) || isNaN(durSeconds) )
            totalTime.text('00:00');
        else
		    totalTime.text(durMinutes+':'+durSeconds);

        // if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) ) {
        //     time.removeClass('active');
        // } else {
        //     time.addClass('active');
        //     console.log("查找歌词：" , (curMinutes + curSeconds));
        //     // findLrcIndex(curMinutes + curSeconds);
        //     findLrcIndex(currentTime);
        // }

        // 设置播放进度条的长度
		seekBar.width(playProgress+'%');

        // 进度条为100 即歌曲播放完时
		if( playProgress == 100 ){
            playPauseBtn.attr('class', 'btn play-pause icon-jiediankaishi iconfont'); // 显示播放按钮
			seekBar.width(0);              // 播放进度条重置为0
            tProgress.text('00:00');       // 播放时间重置为 00:00
            // musicImgs.removeClass('buffering').removeClass('active');  // 移除相关类名
            // if(index != 2){
            //     selectTrack(1);            // 添加这一句，可以实现自动播放
            // }
            // lrcList2.css('bottom', '0');
		} else {
            updateCurrentTime(currentTime);
        }
        } catch(e){
            android.htmlLog("异常："+ e);
        }
    }

    // 点击上一首/下一首时，触发该函数。
    // 注意：后面代码初始化时，会触发一次selectTrack(0)，因此下面一些地方需要判断flag是否为0
    function selectTrack(flag){
        // android.htmlLog("h5UI selectTrack" + flag);
        let skipState = 0;
        // index 播放模式索引,默认设为顺序播放 1
        if(index != 0){
            if( flag == 0 || flag == 1 ){  // 初始 || 点击下一首
                skipState = 1;
            }else{                         // 点击上一首
                skipState = 2;
            }
        }

        if(flag == 0){
            playPauseBtn.attr('class','btn play-pause icon-jiediankaishi iconfont'); // 显示播放图标
        }else{
            musicImgs.removeClass('buffering');
            playPauseBtn.attr('class','btn play-pause icon-zanting iconfont') // 显示暂停图标
        }

        seekBar.width(0);           // 重置播放进度条为0
        time.removeClass('active');
        tProgress.text('00:00');    // 播放时间重置
        totalTime.text('00:00');    // 总时间重置

        nTime = 0;
        bTime = new Date();
        bTime = bTime.getTime();

        if(skipState == 1) {
            try{
                // android.htmlLog("h5UI 播放下一首");
                android.skipToNext();
            } catch (e){
               
            }
        } else if(skipState == 2) {
            // android.htmlLog("h5UI 播放上一首");
            try{
                android.skipToPrevious();
            } catch (e){
               
            }
        }

    }

    // 切换播放顺序(废弃)
    function sequence(){
        ++ index;
        switch(index){
            case 1:
                $('.icon-sequence').css({"background-position":"-80px -179px"})
                break
            case 2:
                audio.loop = true; // 循环播放为true, 歌曲播放完循环播放
                $('.icon-sequence').css({"background-position":"-16px -179px"})
                break
            case 3:
                index = 0;
                audio.loop = false;
                $('.icon-sequence').css({"background-position":"-144px -179px"})
        }
    }

    // 设置音量值(废弃)
    function setValue(){
        // audio.volume = range[0].value / 100;
        // numText.text(range[0].value + "%");
        // numText2.text(range[0].value + "%");
    }

    // range拖动时改变音量和百分数(废弃)
    function rangeDrag(){
        $('.icon-play').css({"background-position":"-80px -195px"});
        realTimerange = this.value;
        audio.volume = this.value / 100;
        numText.text(this.value + "%");
        numText2.text(this.value + "%");
        volumeBL = true;
        if(this.value == 0){
            $('.icon-play').css({"background-position":"-144px -195px"});
            volumeBL = false;
        }
    }

    // 点击图标静音和恢复音量(废弃)
    function hideClick(){
        if(volumeBL){
            $('.icon-play').css({"background-position":"-144px -195px"});
            volumeBL = false;
            realTimerange = range[0].value; // 储存range[0].value当前值
            range[0].value = 0;
            setValue();
        }else{
            $('.icon-play').css({"background-position":"-80px -195px"});
            volumeBL = true;
            range[0].value = realTimerange;
            setValue();
        }
    }

    // 鼠标悬浮时显示/隐藏音量条(废弃)
    function hide(){
        range.hover(() => {panel.css({"display":"block"});}, hide);
        setTimeout(() => {
            if(range.is(":hover") || volumeIcon.is(":hover")){
                panel.css({"display":"block"});
            }else{
                panel.css({"display":"none"});
            }
        }, 1000)
    }

    // 初始化函数
    function initPlayer() {
        audio = new Audio();  // 创建Audio对象
		// selectTrack(0);       // 初始化第一首歌曲的相关信息
        setValue();           // 初始化网页音量
        volumeBL = true;      // 判断音量  false:音量0(静音)  true:有音量
        audio.loop = false;   // 取消歌曲的循环播放功能
        // $(audio).on('timeupdate', updateCurrTime); // 实时更新播放时间

		// 进度条 移入/移出/点击 动作触发相应函数
		sArea.mousemove(function(event){ showHover(event) });
        sArea.mouseout(hideHover);
        sArea.on('click', playFromClickedPos);


        // range拖动时改变音量和百分数
        // range.on('input', rangeDrag);
        // 点击静音和恢复音量
        // volumeIcon.on('click', hideClick);
        // 鼠标悬浮时显示/隐藏音量条
        // volumeIcon.hover(() => { panel.css({"display":"block"}) }, hide);
        // 点击切换播放顺序 顺序播放,循环播放,随机播放
        // orderIcon.on('click',sequence);

    }
    // 调用初始化函数
    initPlayer();
//});
