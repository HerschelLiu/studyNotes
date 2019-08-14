# actionsheet
```vue
<template>
	<view>
		<view class="actionsheet" :class="showActionsheet?'toggle':''">
		    <view class="actionsheet-content">
		        <view class="actionsheet-title">{{actionsheetTitle}}</view>
                <block v-for="(item, index) in itemList" :key="index">
                    <view class="actionsheet-cell" :style="{color: item.color}" :data-tap-index="index" @tap="clickItem">{{item.text}}</view>
                </block>
		    </view>
            <view class="actionsheet-cancel" @tap="cancelActionsheet">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
        props: {
            showActionsheet: {
                type: Boolean,
                default: false
            },
            actionsheetTitle: {
                type: String,
                default: ''
            },
            itemList: {
                type: Array,
                default() {
                    return [{
                        text: {
                            type: String,
                            default: ''
                        },
                        color: {
                            type: String,
                            default: '#161616'
                        }
                    }]
                 }
            },
        },
        methods: {
            cancelActionsheet() {
                this.$emit('cancelActionsheet');
            },
            clickItem(e) {
                this.$emit('clickItem', {
                    tapIndex: e.currentTarget.dataset.tapIndex
                });
            }
        }
	}
</script>

<style>
.actionsheet {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 12upx 8upx;
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
    z-index: 1000;
    box-sizing: border-box;
    visibility: hidden;
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
    -webkit-backface-visibility: hidden;
    transition: transform .3s, visibility .3s;
    transition: transform .3s, visibility .3s, -webkit-transform .3s;
    -webkit-transition: visibility .3s, -webkit-transform .3s;
    transition: visibility .3s, -webkit-transform .3s;
    backface-visibility: hidden;
}

.toggle {
    visibility: visible;
    -webkit-transform: translate(0);
    transform: translate(0);
}

.actionsheet-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 34upx;
    background: #FFFFFF;
    border-radius: 25upx;
    font-size: 32upx;
    overflow: hidden;
}

.actionsheet-content .actionsheet-title,
.actionsheet-content .actionsheet-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 92upx;
    font-size: 32upx;
    border-bottom: 1upx solid #D6D6D6;
}

.actionsheet-content .actionsheet-cell:last-child {
    border-bottom: 0;
}

.actionsheet-cancel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 92upx;
    margin-top: 25upx;
    background: #FFFFFF;
    font-size: 32upx;
    color: #888888;
    border-radius: 25upx;
}
</style>

// 父组件
<my-actionsheet actionsheetTitle="请选择更多操作" :showActionsheet="showActionsheet" :itemList="itemList" @cancelActionsheet="cancelActionsheet" @clickItem="clickItem"></my-actionsheet>
// main.js 全局组件
import myActionsheet from 'components/myActionsheet/myActionsheet.vue'

Vue.component('myActionsheet', myActionsheet)
```

