## ref、reactive、toRef、toRefs的区别

* reactive用于为对象添加响应式状态`const state = reactive({.count: 0 })`

  * 获取数据值的时候直接获取，不需要加.value
  * 参数只能传入对象类型

* ref 用于为数据添加响应式状态。由于reactive只能传入对象类型的参数，而对于基本数据类型要添加响应式状态就只能用ref了，同样返回一个具有响应式状态的副本。`const name = ref('Neo') console.log(name.value)// Neo`

  * 获取数据值的时候需要加.value。可以理解为ref是通过reactive包装了一层具有value属性的对象实现的
  * **参数可以传递任意数据类型**，传递对象类型时也能保持深度响应式，所以适用性更广。
  * vue 3.0 setup里定义数据时推荐优先使用ref，方便逻辑拆分和业务解耦。

* toRef 用于为源响应式对象上的属性新建一个ref，从而保持对其源对象属性的响应式连接。接收两个参数：源响应式对象和属性名，返回一个ref数据。例如使用父组件传递的props数据时，要引用props的某个属性且要保持响应式连接时就很有用。

  * 获取数据值的时候需要加.value
  * toRef后的ref数据不是原始数据的拷贝，而是引用，改变结果数据的值也会同时改变原始数据

  ```vue
  props: [title]
  
  setup (props) {
  	const { myTitle } = toRef(props, 'title')
  	console.log(myTitle.value)
  }
  ```

  

* toRefs用于将响应式对象转换为结果对象，其中结果对象的每个属性都是指向原始对象相应属性的ref。常用于es6的解构赋值操作，因为在对一个响应式对象直接解构时解构后的数据将不再有响应式，而使用toRefs可以方便解决这一问题。**如果 `title` 是可选的 prop，则传入的 `props` 中可能没有 `title` 。在这种情况下，`toRefs` 将不会为 `title` 创建一个 ref 。你需要使用 `toRef` 替代它**

  * 获取数据值的时候需要加.value
  * toRefs后的ref数据不是原始数据的拷贝，而是引用，改变结果数据的值也会同时改变原始数据
  * 作用其实和 toRef 类似，只不过 toRef 是一个个手动赋值，而 toRefs 是自动赋值。

  ```vue
  props: [title]
  
  setup (props) {
  	const { myTitle } = toRefs(props)
  	console.log(myTitle.value)
  }
  ```


## 何时使用ref、reacive、toRefs、toRef

使用这些事为了响应式化，响应式化即**普通变量，在setup等函数中改变值时，视图中不会更新，响应式变量反之**，所以**只有要视图变化的数据用这些就行，不在视图显示的变量没必要用**