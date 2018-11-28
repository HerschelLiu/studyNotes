```html + css + javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        html,
        body {
            width: 100%;
            height: 100%;
            text-align: center;
        }

        li {
            position: relative;
            display: inline-block;
            list-style: none;
        }

        canvas,
        img {
            width: 400px;
            height: 220px;
            border: 1px solid darkgray;
        }

        button {
            padding: 6px 20px;
            margin: 6px 3px;
        }
    </style>
</head>

<body>
    <header>
        <video id="video" src="./video/mov_bbb.mp4" controls="" width="440" height="260"></video>
        <p>视频播放器-VIDEO</p>
    </header>

    <section>
        <ul>
            <li>
                <img id="rendering-img" class="img">
                <p>获取当前帧到-IMG</p>
            </li>
            <li>
                <canvas id="canvas" class="canvas"></canvas>
                <p>视频同步渲染到-CANVAS</p>
            </li>
        </ul>
    </section>

    <footer>
        <button id="video-play-btn">视频播放</button>
        <button id="video-pause-btn">视频暂停</button>
        <button id="video-volumed-btn">音量增大</button>
        <button id="video-volumex-btn">音量减小</button>
        <button id="fullscreen-btn">视频全屏</button>
        <button id="get-current-btn">获取当前视频帧</button>
        <button id="rendering-btn">视频同步渲染</button>
        <button id="body-bg-btn">渲染到body背景</button>
    </footer>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
    <script>
        (function () {

            var video = document.getElementById("video");
            var canvas = document.getElementById("canvas");
            var interval = null;

            //截取视频画面
            var CaptureFirstFrame = function () {

                this.CaptureVideo = function (img, rsy, bbg) {
                    //canvas 缩放比率
                    this.scale = 1;

                    //创建canvas元素
                    this.canvas = document.createElement("canvas");

                    //设置canvas画布大小
                    this.canvas.width = canvas.width = video.videoWidth * this.scale;
                    this.canvas.height = canvas.height = video.videoHeight * this.scale;

                    //设置canvas画布内容、位置
                    this.canvas.getContext('2d').drawImage(video, 0, 0, this.canvas.width, this.canvas.height);


                    //注：
                    /*
                     * canvas.toDataURL("image/png", 1) 方法可能会出错！！！
                     * 因为 【 如果视频文件所在的 域 和 当前index.html页面所在域不同，就会出现跨域传输的问题】，【及便是给img标签加上crossOrigin': 'anonymous' 也没用！】
                     * 所以 请将 视频文件 和 当前index.html页面放在同一个域中，才能正常运行。
                     */

                    if (img) {
                        $('#rendering-img').attr({
                            'crossOrigin': 'anonymous',
                            'src': this.canvas.toDataURL("image/png", 1)
                        });
                    };

                    if (rsy) {
                        canvas.getContext('2d').drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
                    };

                    if (bbg) {
                        $(document.body).css('background-image', 'url(' + this.canvas.toDataURL("image/png",
                            1) + ')');
                    };
                }
            };

            //打开全屏方法
            CaptureFirstFrame.prototype.openFullscreen = function (element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullScreen();
                }
            };

            var V = new CaptureFirstFrame();

            //监听视频加载完成时 获取第一帧
            video.addEventListener('loadeddata', function () {
                V.CaptureVideo(true);
            }, false);

            //监听视频播放时
            video.addEventListener('play', function () {
                //播放时
            }, false);

            //监听视频暂停时
            video.addEventListener('pause', function () {
                clearInterval(interval);
            }, false);

            //视频播放
            document.getElementById("video-play-btn").addEventListener('click', function () {
                video.play();
            }, false);

            //视频暂停
            document.getElementById("video-pause-btn").addEventListener('click', function () {
                video.pause();
            }, false);

            //音量增大
            document.getElementById("video-volumed-btn").addEventListener('click', function () {
                (video.volume > 1 || video.volume == 1) ? video.volume = 1: video.volume = video.volume +
                    0.1;
                console.log(video.volume)
            }, false);

            //音量减小
            document.getElementById("video-volumex-btn").addEventListener('click', function () {
                    (video.volume < 0.2 || video.volume == 0) ? video.volume = 0: video.volume = video.volume -
                        0.1;
                    console.log(video.volume)
                },
                false); //视频全屏 
            document.getElementById("fullscreen-btn").addEventListener('click', function () {
                V.openFullscreen(video);
            }, false); //获取当前帧 
            document.getElementById("get-current-btn").addEventListener('click',
                function () {
                    V.CaptureVideo(true);
                }, false); //视频同步渲染
            document.getElementById("rendering-btn").addEventListener('click', function () {
                clearInterval(interval);
                interval = window.setInterval(function () {
                    V.CaptureVideo(false, true);
                }, 1);
            }, false); //渲染到body背景
            document.getElementById("body-bg-btn").addEventListener('click', function () {
                clearInterval(interval);
                interval = window.setInterval(function () {
                    V.CaptureVideo(false, false, true);
                }, 1);
            }, false);
        })();
    </script>
</body>

</html>
```

