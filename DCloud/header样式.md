**头部**

```html
<view class="header">
            <view class="header-content">
                <view class="header-btns left">
                    <view class="header-btn-icon">
                        <uni-icon type="back" :color="'#000000'" size="24"></uni-icon>
                    </view>
                    <view class="header-btn-text">返回</view>
                </view>
                <view class="header-container">哈哈哈</view>
                <view class="header-btns right">
                    <view class="header-btn-icon">
                        <uni-icon type="back" :color="'#000000'" size="24"></uni-icon>
                    </view>
                    <view class="header-btn-text">菜单</view>
                </view>
            </view>
        </view>
```

```stylus
<style lang="stylus">
font-size($size = 28rpx, $color = #161616)
    font-size $size
    color $color
.header
    position fixed
    top 88rpx
    left 0
    width 100%
    padding 0 14rpx
    box-sizing border-box
    background #FFFFFF
    .header-content
        flex-direction row
        align-items center
        width 100%
        height 88rpx
        .header-container
            flex-direction row
            align-items center
            justify-content center
            width 100%
            height 100%
            margin 0 10rpx
            font-size(30rpx, #000000)
        .header-btns
            flex-shrink 0
            flex-direction row
            align-items center
            width: 120rpx;
            height 100%
            padding:0 12upx;
            .header-btn-icon
                width 48rpx
                height 48rpx
            .header-btn-text
                font-size(28rpx, #000000)
            &.left
                padding-left 0
            &.right
                padding-right 0
</style>
```

**搜索框**

```html
<view class="search-box">
	<view class="search">
		<view class="search-input">
			<input type="text" value="" v-model="searchText" placeholder="请输入商品名或ID" @confirm="requestData" @input="searchInput" />
			<view class="blurInput" v-if="cancelSearch" @tap="inputBlur"><image :src="src + 'index/cancelsearch.png'" mode="scaleToFill"></image></view>
		</view>
		<image :src="src + 'index/search.png'" mode="scaleToFill" class="search-icon right"></image>
	</view>
</view>
```

```stylus
<style lang="stylus">
.search-box
        flex-direction row
        justify-content center
        align-items center
        height 97upx
        background #EEEEEE
        .search
            flex-direction row
            align-items center
            width 693upx
            height 73upx
            background #FFFFFF
            border-radius 36.5upx
            padding 0 33upx
            font-size(26upx, #7A7A7A)
            .search-icon
                flex 0 0 24upx
                width 24upx
                height 24upx
                &.left
                    margin-right 12upx
                &.right
                    margin-left 12upx
            .search-input
                flex-direction row
                align-items center
                width 100%
                input
                    width 100%
                    height 40rpx
                .blurInput
                    padding 15upx
                    image
                        width 32upx
                        height 32upx
</style>
```

```javascript
data() {
    return {
        searchText: '',
        cancelSearch: false,
        goodsArr: []// 商品列表
    }
},
computed: {
    noSearchResult() {
        if (this.searchText == '') {
            return false;
        } else {
            if (this.goodsArr.length == 0) {
                return true;
            } else {
                return false;
            }
        }
    }
},
methods: {
    searchInput(e) {
        if (e.detail.value != '') {
            this.cancelSearch = true;
        } else {
            this.cancelSearch = false;
        }
    },
    inputBlur() {
        this.searchText = '';
        this.cancelSearch = false;
        uni.hideKeyboard();
        this.page = 1;
        this.requestData(); //请求数据
    },
}
```

