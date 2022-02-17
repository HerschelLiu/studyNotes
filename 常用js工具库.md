## Day.js

一个极简的处理时间和日期的 JavaScript 库，和 Moment.js 的 API 设计保持一样, 但体积仅有2KB。

```js
npm install dayjs
```

### 基本用法

```js
import dayjs from 'dayjs'

dayjs().format('YYYY-MM-DD HH:mm') // => 2022-01-03 15:06
dayjs('2022-1-3 15:06').toDate() // => Mon Jan 03 2022 15:06:00 GMT+0800 (中国标准时间)
```

## qs

一个轻量的 url 参数转换的 JavaScript 库

```js
npm install qs
```

### 基本用法

```js
import qs from 'qs'

qs.parse('user=tom&age=22') // => { user: "tom", age: "22" }
qs.stringify({ user: "tom", age: "22" }) // => user=tom&age=22
```

## js-cookie

一个简单的、轻量的处理 cookies 的 js API

```js
npm install js-cookie
```

### 基本用法

```js
import Cookies from 'js-cookie'

Cookies.set('name', 'value', { expires: 7 }) // 有效期7天
Cookies.get('name') // => 'value'
```

## flv.js

bilibili 开源的 html5 flash 视频播放器，使浏览器在不借助 flash 插件的情况下可以播放 flv，目前主流的直播、点播解决方案。

```js
npm install flv.js
```

### 基本用法

```js
<video autoplay controls width="100%" height="500" id="myVideo"></video>

import flvjs from 'flv.js'

// 页面渲染完成后执行
if (flvjs.isSupported()) {
  var myVideo = document.getElementById('myVideo')
  var flvPlayer = flvjs.createPlayer({
    type: 'flv',
    url: 'http://localhost:8080/test.flv' // 视频 url 地址
  })
  flvPlayer.attachMediaElement(myVideo)
  flvPlayer.load()
  flvPlayer.play()
}
```

## vConsole

一个轻量、可拓展、针对手机网页的前端开发者调试面板。如果你还苦于在手机上如何调试代码，用它就对了。

```js
npm install vconsole
```

### 基本用法

```js
import VConsole from 'vconsole'

const vConsole = new VConsole()
console.log('Hello world')
```

## Animate.css

一个跨浏览器的 css3 动画库，内置了很多典型的 css3 动画，兼容性好，使用方便。

```js
npm install animate.css
```

### 基本用法

```js
<h1 class="animate__animated animate__bounce">An animated element</h1>

import 'animate.css'
```

## animejs

一款功能强大的 Javascript 动画库。可以与CSS3属性、SVG、DOM元素、JS对象一起工作，制作出各种高性能、平滑过渡的动画效果。

```js
npm install animejs
```

### 基本用法

```js
<div class="ball" style="width: 50px; height: 50px; background: blue"></div>

import anime from 'animejs/lib/anime.es.js'

// 页面渲染完成之后执行
anime({
  targets: '.ball',
  translateX: 250,
  rotate: '1turn',
  backgroundColor: '#F00',
  duration: 800
})
```

## lodash.js

一个一致性、模块化、高性能的 JavaScript 实用工具库

```js
npm install lodash
```

### 基本用法

```js
import _ from 'lodash'

_.max([4, 2, 8, 6]) // 返回数组中的最大值 => 8
_.intersection([1, 2, 3], [2, 3, 4]) // 返回多个数组的交集 => [2, 3]
```

## mescroll.js

一款精致的、在H5端运行的下拉刷新和上拉加载插件，主要用于列表分页、刷新等场景。

```js
npm install mescroll.js
```

### 基本用法（vue组件）

```js
<template>
  <div>
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <!--内容...-->
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from 'mescroll.js/mescroll.vue'

export default {
  components: {
    MescrollVue
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置
      mescrollUp: {
        // 上拉加载的配置
        callback: this.upCallback
      },
      dataList: [] // 列表数据
    }
  },
  methods: {
    // 初始化的回调,可获取到mescroll对象
    mescrollInit(mescroll) {
      this.mescroll = mescroll
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      // 发送请求
      axios
        .get('xxxxxx', {
          params: {
            num: page.num, // 当前页码
            size: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data
          // 如果是第一页需手动置空列表
          if (page.num === 1) this.dataList = []
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr)
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
          })
        })
        .catch(e => {
          // 请求失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr()
        })
    }
  }
}
</script>

<style scoped>
.mescroll {
  position: fixed;
  top: 44px;
  bottom: 0;
  height: auto;
}
</style>
```

## Chart.js

一套基于 HTML5 的简单、干净并且有吸引力的 JavaScript 图表库

```js
npm install chart.js
```

### 基本用法

```js
<canvas id="myChart" width="400" height="400"></canvas>

import Chart from 'chart.js/auto'

// 页面渲染完成后执行
const ctx = document.getElementById('myChart')
const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
})
```