名字就叫calcFloat吧
```javascript
var calc = {
            //加
            add: function (num1, num2) {
                var baseNum, baseNum1, baseNum2;
                /*try{
                //在此运行代码
                }
                catch(err){
                //在此处理错误
                }*/
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                /*Math.pow(a,b) => a的b次方*/
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                return (num1 * baseNum + num2 * baseNum) / baseNum;
            },
            //减
            sub: function (num1, num2) {
                // num1 - num2
                var baseNum, baseNum1, baseNum2;
                var precision; // 精度
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                // precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                precision = Math.max(baseNum1, baseNum2);
                baseNum = Math.pow(10, precision);
                return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
            },
            //乘
            multi: function (num1, num2) {
                var baseNum = 0;
                try {
                    baseNum += num1.toString().split(".")[1].length;
                } catch (e) {}
                try {
                    baseNum += num2.toString().split(".")[1].length;
                } catch (e) {}
                return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) /
                    Math.pow(10, baseNum);
            },
            //除
            divide: function (num1, num2) {
                var baseNum1, baseNum2, baseNum3, baseNum4;
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum3 = Number(num1.toString().replace(".", ""));
                baseNum4 = Number(num2.toString().replace(".", ""));
                return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
            }
        };
```

