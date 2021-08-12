import { getDate } from '../../utils/function'
import { isHaveValue } from '../../utils/validate'
import computedBehavior from '../../utils/computed.js'

Component({
  options: {
    multipleSlots: true
  },

  /** 继承行为 */
  behaviors: [computedBehavior],

  /**
   * 继承样式
   */
  externalClasses: ['custom-audio-player-class'],

  /**
   * 组件的属性列表
   */
  properties: {
    /** 是否显示时间 */
    showTime: {
      type: Boolean,
      value: true
    },
    /** 音频地址 */
    src: {
      type: String,
      value: ''
    },
    /** 是否自定义播放按钮 */
    customPlayBtn: {
      type: Boolean,
      value: false
    },
    /** 播放按钮图片 */
    playBtnImg: {
      type: String,
      value: ''
    },
    /** 暂停按钮图片 */
    pauseBtnImg: {
      type: String,
      value: ''
    },
    /** 是否自动播放 */
    autoplay: {
      type: Boolean,
      value: false
    },
    /** 是否显示进度条 */
    showProgress: {
      type: Boolean,
      value: true
    },
    /** 是否自定义进度条 */
    customProgress: {
      type: Boolean,
      value: false
    },
    /** 静音按钮图片 */
    muteImg: {
      type: String,
      value: ''
    },
    /** 非静音状态按钮图片 */
    voiceImg: {
      type: String,
      value: ''
    },
    /** 是否允许拖动进度条 */
    movable: {
      type: Boolean,
      value: true
    },
    /** 是否显示进度条按钮 */
    showProgressBtn: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的方法列表
   */
  data: {
    innerAudioContext: < WechatMiniprogram.InnerAudioContext | undefined > undefined,
    /** 当前音频的播放位置（单位 s）。 */
    currentTimeStr: '00:00',
    currentTime: 0,
    /** 当前音频的长度（单位 s） */
    durationStr: '00:00',
    duration: 0,
    /** 播放状态 */
    playStatus: '',
    /** 是否静音 */
    isMute: false,
    /**
     * 播放进度条百分比
     */
    percent: 0
  },

  watch: {
    /**
     * 播放进度条百分比
     */
    'currentTime': function(data: number) {
      this.setData({
        percent: data / this.data.duration * 100
      })
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    /**
     * 在组件在视图层布局完成后执行
     */
    ready() {
      this.data.innerAudioContext = wx.createInnerAudioContext()
      this.data.innerAudioContext.src = this.data.src
      this.data.innerAudioContext.autoplay = this.data.autoplay
      this.data.innerAudioContext.onCanplay(() => {
        if (this.data.autoplay) {
          /** 不要删除，不然初始就不能获取到音频总长度 */
          // eslint-disable-next-line no-unused-expressions
          this.data.innerAudioContext!.duration
          setTimeout(() => {
            this.setData({
              durationStr: getDate(this.data.innerAudioContext!.duration * 1000, 'm:s'),
              duration: this.data.innerAudioContext!.duration
            })
          }, 1000)
        }
      })
      this.data.innerAudioContext.onPlay(() => {
        this.setData({
          playStatus: 'play'
        })
        this.triggerEvent('change', {
          status: 'play'
        })
      })
      this.data.innerAudioContext.onPause(() => {
        this.setData({
          playStatus: 'pause'
        })
        this.triggerEvent('change', {
          status: 'pause'
        })
      })
      this.data.innerAudioContext.onStop(() => {
        this.setData({
          playStatus: 'stop'
        })

        this.triggerEvent('change', {
          status: 'stop'
        })
      })
      this.data.innerAudioContext.onEnded(() => {
        wx.nextTick(() => {
          this.setData({
            currentTimeStr: '00:00',
            currentTime: 0,
            percent: 0
          })
        })
      })
      this.data.innerAudioContext.onTimeUpdate(() => {
        if (!isHaveValue(this.data.duration) && !this.data.autoplay) {
          this.setData({
            durationStr: getDate(this.data.innerAudioContext!.duration * 1000, 'm:s'),
            duration: this.data.innerAudioContext!.duration
          })
        }
        this.setData({
          currentTimeStr: getDate(this.data.innerAudioContext!.currentTime * 1000, 'm:s'),
          currentTime: this.data.innerAudioContext!.currentTime
        })
      })
      this.data.innerAudioContext.onSeeked(() => {
        this.setData({
          currentTimeStr: getDate(this.data.innerAudioContext!.currentTime * 1000, 'm:s'),
          currentTime: this.data.innerAudioContext!.currentTime
        })
      })
    },
    /**
     * 在组件实例被从页面节点树移除时执行
     */
    detached() {
      if (this.data.innerAudioContext) {
        this.data.innerAudioContext.destroy()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换播放状态
     */
    handleTogglePlay() {
      if (this.data.innerAudioContext) {
        if (this.data.playStatus === 'play') {
          this.data.innerAudioContext.pause()
        } else {
          this.data.innerAudioContext.play()
        }
      }
    },

    /**
     * 切换静音状态
     */
    handleToggleMute() {
      if (this.data.innerAudioContext) {
        this.data.innerAudioContext.volume = this.data.isMute ? 1 : 0
        this.setData({
          isMute: !this.data.isMute
        })
      }
    },

    /**
     * 进度条按钮移动
     */
    handleProgressBtnMove(e: any) {
      if (this.data.innerAudioContext) {
        this.setData({
          percent: e.detail.x
        })
      }
    },
    /**
     * 进度条按钮移动结束
     */
    handleProgressBtnTouchend() {
      if (this.data.innerAudioContext) {
        this.data.innerAudioContext.seek(this.data.percent / 100 * this.data.duration)
      }
    }
  }
})
