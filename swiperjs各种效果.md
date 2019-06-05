#### 轮播图中间放大,两边小

```js
var swiper = new Swiper('.mid_banners .swiper-container', {
            effect: 'coverflow',
            autoplay: true,
            centeredSlides: true,
            spaceBetween: '20%',
            slidesPerView: 'auto',
            loop: true,
            loopedSlides: this.goodCount,
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false,
            },
            pagination: {
                el: '.swiper-pagination',
            },
        });
```

