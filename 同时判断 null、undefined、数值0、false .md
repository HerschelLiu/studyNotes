```js
// var str = undefined; 
// var str = null;
// var str = '';
// var str = 0;
// var str = false;
// var str = [];     //not null
// var str = {};    // not null
if (!str) {
    console.log("is null")
} else {
    console.log("not null")
}

console.log(!str) // true

// 或者
if (!(!str)) {
    console.log("not null")
} else {
    console.log("is null")
}
```

