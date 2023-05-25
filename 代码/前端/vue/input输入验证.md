```vue
<input
    type="text"
    class="auctionPopup-bar-input"
    style="width: 126px;"
    placeholder="请输入起始金额"
    v-model="auctionPopupStart"
/>
<script>
new Vue({
	data: {
		auctionPopup: {
            start: '',
            end: '',
            num: '',
        },
    },
    computed: {
        auctionPopupStart: {
            get() {
                return this.auctionPopup.start;
            },
            set(value) {
                this.auctionPopup.start = this.numInputTest(value) == '' ? this.auctionPopup.start : this.numInputTest(value);
                this.$forceUpdate(); // 不加这个，视图会延迟刷新,所有这种验证都要加
            },
        },
    },
	methods: {
		numInputTest(value) {
            // 匹配数字，且保留小数点后两位
            var reg = /^\d{0,}$/;
            var str = value.toString();
            if (reg.test(str) || str.indexOf('.') > -1) {
                if (str.indexOf('.') > -1) {
                    var _arr = str.split('.');
                    if (_arr.length > 2) {
                        _arr.splice(-1, 1);
                        return _arr.join('.');
                    } else {
                        var _arr2 = _arr[1].toString().split('');
                        console.log(_arr2);
                        if (_arr2.length > 2) {
                            _arr2.splice(-1, 1);
                            _arr[1] = _arr2.join('').replace(/,/ig, '');
                        } 
                        return _arr.join('.');  
                    }
                } else {
                    return str;
                }
            } else {
                if (/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(str)) {
                    // 阻止中文输入法下按空格或回车可以输入的问题
                    return '';
                } else {
                    var _arr = str.split('');
                    _arr.splice(-1, 1);

                    return _arr.join().replace(/,/ig, '');
                }
            }
        },
    }
});
</script>
```

