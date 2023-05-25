## video高度

做有关视频的网页时，不知道video应该设置多高，看了优酷、爱奇艺的移动端网页，虽然没看到明确的代码，但是在优酷中，用开发者工具发现高度为210.94px,而爱奇艺的为210.05px。在爱奇艺中，用的是百分比，所以直接按爱奇艺的尺寸

```html + css
.videoPlayer {
    position: relative;
    width: 100%;
    padding-top: 56.25%;//高度占比
}

video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

<div class="videoPlayer">
    <video src="./video/test.mp4" controls="controls" playsinline>
    您的浏览器不支持 video 标签。
    </video>
</div>
```

