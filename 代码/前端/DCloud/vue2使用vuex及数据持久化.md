`HBuilderX`创建的`uniapp`项目本身带有`Vuex`，只需要进行相应配置即可

在根目录下创建`store`文件夹，并创建`index.js`（名字无所谓）

```js
import Vue from 'vue';
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: {
            getItem: key => uni.getStorageSync(key),
            setItem: (key, value) => uni.setStorageSync(key, value),
            removeItem: key => uni.removeStorageSync(key)
        }
    })],
    state: {
        demo: 0
    },
    getter: {},
    mutations: {
        demo(state, payload) {
            state.demo++;
        },
    },
    actions: {
        demo({ state, commit }, payload) {}
    }
});
```

> 直接在根目录生成`package.json`，使用命令`npm init -y`(`-y`意思是所有都选择yes，省去了按回车),；数据持久化插件 `npm install --save vuex-persistedstate`



在`main.js`中填上

```js
import store from './store/index.js'

const app = new Vue({
    store,
    ...App
})
```

> 此种写法不能使用this.$store命令（网上都这么说），所以使用`mapState， mapMutations等`，如果想支持这种写法，在`main.js`加上`Vue.prototype.$store = store;`