## 下载与配置

```
npm install vuex --save // 一般使用vue ui或vue create中可以直接加上
npm install vuex-persistedstate // 数据持久化
```

**注:**src下新建store文件夹,其中新建index.js,如果叫其他的名字，在main.js中引用就要写成`import store from './store/名字'`

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
// payload指的是参数
const store = new Vuex.Store({
    state: {
		list: [] // 键值对形式
    },
    getters: { // 相当于计算属性
        demoGetter(state, getters)  {
            return (id) => {
                // 可以通过让 getter 返回一个函数，来实现给 getter 传参
            }
        }
    },
    mutations: { // 必须同步执行 使用store.commit
        demo(state, payload) {
            state.list = payload.list
            /*
            在页面中两种提交方式
            1.
            this.$store.commit('demo', 值);
            
            2.
            this.$store.commit({
            	type: 'demo',
            	list：[] (直接就是传值)
            });
            */
        }
    },
    actions: { // 异步方法放在这里
        demoA({state, commit}, payload) { 
            // Action 通过 store.dispatch 方法触发,与this.$store.commit方式相同
            commit('mutations中的函数')
        }
    },
	plugins: [createPersistedState({
        storage: { // 设置缓存相应方法，默认是window.localStorage的方法
            getItem: key => uni.getStorageSync(key),
            setItem: (key, value) => uni.setStorageSync(key, value),
            removeItem: key => uni.removeStorageSync(key)
        }
    })]
})

export default store;
```

```js
// 页面
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
  	...mapState(['list']),
     /*
     或(一般也不太用)
     ...mapState({
        // 箭头函数可使代码更简练
        count: state => state.count,

        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',

        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
        countPlusLocalState (state) {
          return state.count + this.localCount
        }
      })
     */
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
     // 或
      /*
      ...mapGetters({
          // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
          doneCount: 'doneTodosCount'
        })
      */
  },
  mounted() {
    console.log(this.list);
    console.log(this.doneTodosCount);
    console.log(this.anotherGetter);
    this.demo(值);
    this.add(值);
    this.demoA(值);
    this.addA(值);
  },
  methods: {
      ...mapMutations([
          'demo', // 将 `this.demo()` 映射为 `this.$store.commit('demo')`
		  add: 'demo' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
       ]),
      ...mapActions([
          'demoA', // 将 `this.demoA()` 映射为 `this.$store.commit('demoA')`
		  addA: 'demoA' // 将 `this.addA()` 映射为 `this.$store.commit('demoA')`
       ]),
  }
}
```



vue入口方法main.js需要加上`import store from './store'`,并在`new Vue`中加上store,这样在页面中就可以用this.$store命令

```javascript
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
})
```

