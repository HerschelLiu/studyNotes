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
    redirect: '/home/guide', // 路由重定向，即如果地址是http://localhost:8080/#/home页面会直接变成http://localhost:8080/#/guide
//或redirect: { name: 'Guide' }
    children: [{ // 这么写就是guide页面及这里配置的其他页面会显示在Home页的<router-view />处
      path: 'guide',
    //path: 'guide/:id', // 传参
      name: 'Guide',
      props: true, // route.params 将会被设置为组件属性。请尽可能保持 props 函数为无状态的，因为它只会在路由发生变化时起作用。
    //props: { newsletterPopup: false }, // 如果 props 是一个对象，它会被按原样设置为组件属性。
    //props: (route) => ({ query: route.query.q }), //你可以创建一个函数返回 props。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。
      component: Guide,
      meta: { // 路由元数据
          needLogin: true // 键值对
      }
    }]
  },
]

const router = new VueRouter({
  routes
})

export default router
```

**注意：**`this.$router.push/replace('')`中是path值不是name值，而是path值

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

* 使用`this.$router.push({ name: 'Guide', params: { id: 456 } });`传值地址栏不会带参数；刷新**会**丢失传值；**注意:params传参，push里面只能是 name:'xxxx',不能是path:'/xxx',因为params只能用name来引入路由，如果这里写成了path，接收参数页面会是undefined！！！**

* 使用`this.$router.push({ name: 'Guide', query: { id: 456 } });`会带参数；刷新**不会**丢失传值



## 路由元信息

定义路由的时候可以配置 `meta` 字段。

可以遍历`$route.matched/(导航守卫中的路由对象).matched`。内容为当前路由所有的路由记录，比如`/home/guide`，log出的结果为

```js
[
    {
        "path": "/home",
        "name": "Home",
        "redirect": "/home/guide",
        "meta": {},
        ...
    },
    {
        "path": "/home/guide",
        "name": "Guide",
        "parent": { ... },
        "meta": {
            "needLogin": true
        },
        ...
    }
]
```

可以使用这种方法来进行登录

```js
// router/index.js new VueRouter后
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needLogin)) { 
    if (!store.state.token) {
      next({ name: 'Login' })
    }
    else next()
  } else { 
    next()
  }
})
```



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

“重定向”的意思是，当用户访问 `/a`时，URL 将会被替换成 `/b`，然后匹配路由为 `/b`；<code>/a</code> 的别名是 <code>/b</code>，意味着，当用户访问 <code>/b</code> 时，URL 会保持为 <code>/b</code>，但是路由匹配则为 <code>/a</code>，就像用户访问 <code>/a</code> 一样。

上面对应的路由配置为：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

“别名”的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。