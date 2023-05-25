```css
.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: -999999;
    opacity: 0;
   
}

.mask.active {
    z-index: 999999;
    opacity: 1;
    transition: opacity 0.1s;
}
```

