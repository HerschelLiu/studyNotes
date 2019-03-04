```css
 /* 聊天对话气泡 */
 /* 聊天部分 */
 .chat {
     width: 100%;
     height: 100%;
     padding: .5rem;
     overflow: hidden;
     box-sizing: border-box;
 }

 /* 时间 */

 .chat-time {
     width: 100%;
     text-align: center;
     margin-bottom: .75rem;
     font-size: .6rem;
     color: #757575;
 }

 /* 左右气泡 */
 .chat-left {
     float: left;
 }

 .chat-right {
     float: right;
 }

 /* 每一条 */

 .chat-item {
     width: 100%;
     margin-bottom: .75rem;
     overflow: hidden;
 }

 /* 头像 */
 .chat .chat-left .chat-media {
     float: left;
     width: 2rem;
 }

 .chat .chat-right .chat-media {
     float: right;
     width: 2rem;
 }

 /* 内容 */
 .chat .chat-inner {
     max-width: 70%;
     overflow: hidden;
     box-sizing: border-box;
 }

 .chat .chat-left .chat-inner {
     /* float: left; */
     padding-left: .5rem;
     /* max-width: 70%; */
 }

 .chat .chat-right .chat-inner {
     float: right;
     padding-right: .5rem;
 }

 /* 名字 */
 .chat .chat-name {
     width: 100%;
     font-size: 0.6rem;
     color: #757575;
     margin-bottom: 0.25rem;
 }

 .chat .chat-right .chat-name {
     float: right;
     text-align: right;
 }

 .chat-content {
     /* float: left; */
     max-width: 80%;
     min-height: 2rem;
     line-height: normal;
     padding: 0.5rem;
     font-size: 0.7rem;
     color: #3c3c3c;
     border-radius: 0.2rem;
     word-break: break-all;
     word-wrap: break-word;
     text-align: justify;
     box-sizing: border-box;
 }

 .chat-content img {
     width: 100%;
 }

 .chat .chat-left .chat-content {
     float: left;
     background: #fff;
 }

 .chat .chat-right .chat-content {
     float: right;
     background: #fff;
 }

 .chat .chat-status {
     width: 2rem;
     height: 2rem;
     line-height: 2rem;
     font-size: .6rem;
     text-align: center;
 }

 .chat .chat-left .chat-status {
     float: left;
 }

 .chat .chat-right .chat-status {
     float: right;
 }

 .chat-unread {
     color: #3692fa;
 }

 .chat-read {
     color: #bbb;
 }

 /* 右 */
 /* <div class="chat-item chat-right">
    <div class="chat-media">
        <img src="./img/test/avatar1.png" alt="" class="img-wh">
    </div>
    <div class="chat-inner">
        <div class="chat-content">
            我的新剧今年六月份杀青
        </div>
        <div class="chat-status chat-read">已读</div>
    </div>
</div>*/
 /* 左 */
 /* <div class="chat-item chat-left">
    <div class="chat-media">
        <img src="./img/test/avatar2.png" alt="" class="img-wh">
    </div>
    <div class="chat-inner">
        <div class="chat-content">
            是那个《琅琊榜》还是那个《大好时光》啊！你前年拍的《伪装者》我特别喜欢看。期待您的新剧！
        </div>
        <div class="chat-status chat-read">已读</div>
    </div>
</div>  */
```

