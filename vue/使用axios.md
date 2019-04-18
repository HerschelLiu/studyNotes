全局使用axios方法

**方法一**：结合 vue-axios使用

1. 首先在主入口文件main.js中引用

   ```javascript
   import axios from 'axios'
   import VueAxios from 'vue-axios'
   
   Vue.use(VueAxios,axios);
   ```

2.之后就可以使用了，在组件文件中的methods里去使用了




```javascript
getNewsList(){
      this.axios.get('api/getNewsList').then((response)=>{
        this.newsList=response.data.data;
      }).catch((response)=>{
        console.log(response);
      })
 },
```
**方法二**：axios 改写为 Vue 的原型属性

1. 首先在主入口文件main.js中引用，之后挂在vue的原型链上

```javascript
import axios from 'axios'
Vue.prototype.$axios= axios
```

2. 在组件中使用

```javascript
    this.$axios.get('api/getNewsList').then((response)=>{
        	this.newsList=response.data.data;
        }).catch((response)=>{
        	console.log(response);
        })
```

   **方法三**：结合 Vuex的action 
在vuex的仓库文件store.js中引用，使用action添加方法

```javascript
import Vue from 'Vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)
const store = new Vuex.Store({
  // 定义状态
  state: {
    user: {
      name: 'xiaoming'
    }
  },
  actions: {
    // 封装一个 ajax 方法
    login (context) {
      axios({
        method: 'post',
        url: '/user',
        data: context.state.user
      })
    }
  }
})

export default store

```

在组件中发送请求的时候，需要使用 this.$store.dispatch

```javascript
methods: {
  submitForm () {
    this.$store.dispatch('login')
  }
}
```

