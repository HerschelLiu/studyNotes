```tsx
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

// Because it's so fucking difficult to detect the scrolling element, just move them all
const move = (nodes: HTMLElement | null, amount: number) => {
  if (nodes) nodes.scrollTop = amount
  else {
    document.documentElement.scrollTop = amount
    ;(document.body.parentNode as HTMLElement).scrollTop = amount
    document.body.scrollTop = amount
  }
}

const position = () => {
  return document.documentElement.scrollTop || (document.body.parentNode as HTMLElement).scrollTop || document.body.scrollTop
}

/**
 * dom滚动到指定位置
 * @param nodes 可以是普通的dom，也可以是window
 * @param to 目标位置
 * @param duration 动画时长
 * @param callback 回调函数
 */
export const useScrollTo = (nodes: HTMLElement | null = null, to: number, duration: number, callback?: Function) => {
  const start = nodes && typeof nodes.scrollTop === 'number' ? nodes.scrollTop : position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = typeof duration === 'undefined' ? 500 : duration
  if (
    nodes &&
    (nodes.scrollHeight === nodes.offsetHeight ||
      (nodes.scrollTop + to > nodes.scrollHeight - nodes.offsetHeight &&
        nodes.scrollHeight - nodes.offsetHeight === nodes.scrollTop &&
        nodes.scrollTop < to))
  ) {
    if (callback && typeof callback === 'function') {
      // the animation is done so lets callback
      callback()
    }
  } else {
    const animateScroll = function () {
      // increment the time
      currentTime += increment
      // find the value with the quadratic in-out easing function
      const val = easeInOutQuad(currentTime, start, change, duration)
      // move the document.body
      move(nodes, val)
      // do the animation unless its over
      if (currentTime < duration) requestAnimFrame(animateScroll)
      else {
        if (callback && typeof callback === 'function') {
          // the animation is done so lets callback
          callback()
        }
      }
    }
    animateScroll()
  }
}

```

