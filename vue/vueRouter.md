## 结构

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home.vue';
import Guide from '@/views/guide.vue';
import Index from '@/views/index.vue';

Vue.use(VueRouter)
/*
例如Guide
不带/则路径是http://localhost:8080/#/home/guide
带/则是http://localhost:8080/#/guide
*/
const routes = [
  {
      path: '/',
      name: 'Index',
      component: Index,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/guide', // 路由重定向，及如果地址是http://localhost:8080/#/页面会直接变成http://localhost:8080/#/guide
    children: [{ // 这么写就是guide页面及这里配置的其他页面会显示在Home页的<router-view />处
      path: 'guide/:id',
      name: 'Guide',
      component: Guide
    }]
  },
]

const router = new VueRouter({
  routes
})

export default router
```

**注意：**`this.$router.push('')`中是path值不是name值

## 动态路由匹配

例如Guide页

```js
// Home页 => Guide页 传值
// 1, 2地址栏路径是http://localhost:8080/#/guide/123(或456)
// 3是http://localhost:8080/#/guide/?id=789
1. this.$router.push(`/guide/${123}`); 
2. this.$router.push({
            name: 'Guide',
            params: {
                id: 456
            }
        });
3. this.$router.push({
            name: 'Guide',
            query: {
                id: 789
            }
        });
// Guide页获取
1. console.log(this.$route.params.id);
2. console.log(this.$route.params.id);
3. console.log(this.$route.query.id);
```

> 重复点击路由或者刷新会导致报错（`Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location: "/guide/456"`），但是报错不影响代码运行
>
> 解决办法https://blog.juanertu.com/archives/721f45a5
>
> 在 router/index.js 文件中添加一段代码即可：
>
> ```js
> // 解决重复点击路由报错的BUG
> const originalPush = VueRouter.prototype.push
> VueRouter.prototype.push = function push(location) {
>   return originalPush.call(this, location).catch((err) => err)
> }
> ```
>
> 