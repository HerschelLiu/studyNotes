# jsonp是解决跨域问题的
# 原理：之所以能跨域，发送的并不是ajax请求。
  其实是动态创造一个script标签，因为script标签没有同源策略限制的，
  可以跨域。这个创造出的script标签的src指向服务端地址