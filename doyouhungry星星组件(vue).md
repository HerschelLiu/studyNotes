```
<template>
  <div class="star" :class="starType">
    <!-- eslint-disable-next-line -->
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []
        // 求星星的分数，向下取余。比如分数为4.2，Math.floor(this.score * 2)为8，亮星星数量为4
        // 比如分数为4.5，Math.floor(this.score * 2)为9，亮星星数量为4加一个半
        let score = Math.floor(this.score * 2) / 2
        // 分数是否有小数
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>

<style>
.star{
  font-size: 0;
}
.star .star-item{
  display: inline-block;
  background-repeat: no-repeat;
}
.star-48 .star-item{
  width: 20px;
  height: 20px;
  margin-right: 22px;
  background-size: 20px 20px !important;
}
.star-36 .star-item{
  width: 15px;
  height: 15px;
  margin-right: 6px;
  background-size: 15px 15px !important;
}
.star-24 .star-item{
  width: 10px;
  height: 10px;
  margin-right: 3px;
  background-size: 10px 10px !important;
}
.star-48 .star-item:last-child,
.star-36 .star-item:last-child,
.star-24 .star-item:last-child{
  margin-right: 0;
}

.star-48 .on{
  background: url("images/star48_on@2x.png");
}
.star-48 .half{
  background: url("images/star48_half@2x.png");
}
.star-48 .off{
  background: url("images/star48_off@2x.png");
}


.star-36 .on{
  background: url("images/star36_on@2x.png");
}
.star-36 .half{
  background: url("images/star36_half@2x.png");
}
.star-36 .off{
  background: url("images/star36_off@2x.png");
}


.star-24 .on{
  background: url("images/star24_on@2x.png");
}
.star-24 .half{
  background: url("images/star24_half@2x.png");
}
.star-24 .off{
  background: url("images/star24_off@2x.png");
}
@media(min-device-pixel-ratio: 3),(-webkit-device-pixel-ratio: 3){
  .star-48 .on{
    background: url("images/star48_on@3x.png");
  }
  .star-48 .star-item .half{
    background: url("images/star48_half@3x.png");
  }
  .star-48 .star-item .off{
    background: url("images/star48_off@3x.png");
  }


  .star-36 .on{
    background: url("images/star36_on@3x.png");
  }
  .star-36 .half{
    background: url("images/star36_half@3x.png");
  }
  .star-36 .off{
    background: url("images/star36_off@3x.png");
  }


  .star-24 .on{
    background: url("images/star24_on@3x.png");
  }
  .star-24 .half{
    background: url("images/star24_half@3x.png");
  }
  .star-24 .off{
    background: url("images/star24_off@3x.png");
  }
}
</style>

```