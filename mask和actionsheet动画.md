```css
.uni-mask {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .6)
}

.uni-fade-enter-active,
.uni-fade-leave-active {
    -webkit-transition-duration: .25s;
    transition-duration: .25s;
    -webkit-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease;
    transition-timing-function: ease
}

.uni-fade-enter,
.uni-fade-leave-active {
    opacity: 0
}
```

