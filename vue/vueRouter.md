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
//或redirect: { name: 'Guide' }
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

### 页面传值（不设置:id）

* 使用`his.$router.push({ name: 'Guide', params: { id: 456 } });`传值地址栏不会带参数；刷新**会**丢失传值；**注意:params传参，push里面只能是 name:'xxxx',不能是path:'/xxx',因为params只能用name来引入路由，如果这里写成了path，接收参数页面会是undefined！！！**

* 使用`his.$router.push({ name: 'Guide', query: { id: 456 } });`会带参数；刷新**不会**丢失传值



## 命名视图

同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 `sidebar` (侧导航) 和 `main` (主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `router-view` 没有设置名字，那么默认为 `default`。

```html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 `components` 配置 (带上 s)：

```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

### 别名

“重定向”的意思是，当用户访问 `/a`时，URL 将会被替换成 `/b`，然后匹配路由为 `/b`，<code>/a</code> 的别名是 <code>/b</code>，意味着，当用户访问 <code>/b</code> 时，URL 会保持为 <code>/b</code>，但是路由匹配则为 <code>/a</code>，就像用户访问 <code>/a</code> 一样。

上面对应的路由配置为：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

“别名”的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。