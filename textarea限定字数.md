```
inputBox {
            width: 100%;
            padding: .5rem 1.35rem;
            background: #fff;
            font-size: .6rem;
            box-sizing: border-box;
        }

        .inputBox>textarea {
            width: 100%;
            height: 9.8rem;
        }

        .wordNum {
            width: 100%;
            height: .9rem;
            text-align: right;
            color: #b7b7b7;
        }

        textarea::-webkit-input-placeholder {
            color: #b7b7b7;
        }
        
        
          <div class="inputBox pingfangMedium">
            <textarea name="name" rows="8" cols="80" placeholder="请填写个人介绍" oninput="wordNum(this);" maxlength="500"></textarea>
            <div class="wordNum">500</div>
        </div>
        
        // 评论
    function wordNum(obj) {
        var wordNumParent = $api.closest(obj, '.inputBox');
        var wordNum = $api.dom(wordNumParent, '.wordNum');
        var textareaVal = $api.val(obj);
        var inputLength = 500 - parseInt(textareaVal.length);

        if (inputLength <= 0) {
            $api.text(wordNum, '0');
            $api.css(wordNum, 'color: red');
        } else {

            $api.text(wordNum, inputLength);
            $api.css(wordNum, 'color: #b7b7b7');
        }
    }
```

