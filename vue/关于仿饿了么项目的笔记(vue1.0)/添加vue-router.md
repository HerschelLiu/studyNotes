## [vue-router官网：https://router.vuejs.org/zh-cn](https://router.vuejs.org/zh-cn)
### 在package.json中，找到`dependencies`,添加`"vue-router": "^0.7.13"`（一般情况下已存在，所以不用再下载）
### 在main.js中加上
## 以下内容参看`饿了么项目`
```
import VueRouter from 'vue-router'
Vue.use(VueRouter)
```
### 具体用法见官网

## 以上用法2.0已经写好，只需要在`router`文件夹中的`index.js`中添加即可
```
import Vue from 'vue' // 模板
import Router from 'vue-router' // 模板
// import HelloWorld from '@/components/HelloWorld'
import goods from '../components/goods/goods'// 自己用到的
Vue.use(Router) // 模板

export default new Router({
  routes: [
    // 注释掉的为模板
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
    // 自己用到的
    {
      path: '/goods',
      component: goods
    }
  ]
})
```
**不要照着`HelloWorld.vue`**里那么写，要在`path: '/goods'`这里写完整，如上，不然内容不会显示
**不要忘记在`components`文件夹里创建相同名字的文件夹及其文件**
```
<div class="tab">
      <div class="tab-item">
        <router-link to="/goods">
          商品
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">
          评论
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">
          商家
        </router-link>
      </div>
    </div>
    <router-view></router-view>
```
必须要在想要跳转的位置加上`<router-link to="path">`，这个标签在渲染时会渲染成<a>标签
跳转的内容会在`<router-view></router-view>`标签位置展示

## 选中样式是`linkActiveClass`,可以在`router`文件夹中的`index.js`中的`export default new Router`添加`linkActiveClass: '类名（一般是active）'`

##  设置路由跳转
 在index.js原有内容上添加
 ```
 const router = new Router()
 router.push('/goods')
```
**不要用`go（）`，会使页面一直刷新。要用`push（）`**