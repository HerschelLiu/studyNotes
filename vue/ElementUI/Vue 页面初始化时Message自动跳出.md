将使用方式从`Vue.use(Message)`变为`Vue.prototype.$message = Message`
使用`Vue.component(Message.name,Message)`,在调用`this.$message`或`Message()`会报错