## 注意：vue-resource模板里没有，需要自己手动下载，安装方法与`vue-router`一样
### vue-resource是vue提供来调用数据的
### 在`main.js`中添加
```
import VueResource from 'vue-resource'
Vue.use(VueResource)
```
### 在`App.vue`中添加
```
const ERR_OK = 0
export default {
	...
    data () {
      return {
        seller: {}
      }
    },
    created () {
      this.$http.get('/api/seller').then((response) => {
        response = response.json() // 应该为response.body
        if (response.errno === ERR_OK) {
          this.seller = response.data
          console.log(this.seller)
        }
      })
    }
  }
 ```
 **`response.json()`返回的是一个Promise类型的，之前json返回的是Object，所以应该为`response.body`**