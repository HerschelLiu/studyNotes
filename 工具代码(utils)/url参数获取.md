```js
/**
   * @description 获取url上的参数。
   * @author Yu-Root
   * @version 0.0.1
   * @param {String} paramName 必传，参数名。
   * @returns {String} 参数值。
   *
   */
function getUrlKey(paramName) {
    return decodeURIComponent((new RegExp("[?|&]" + paramName + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null;
}
// 使用
let res = getUrlKey("name")
```

