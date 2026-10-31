```js
/*
 * valueNum - 存放三轴数据(x,y,z)的个数
 * tempValue - 用于存放计算阈值的波峰波谷差值的数组(在这个方法里存放值数组长度为5)
 * isDirectionUp - 是否上升的标志位
 * continueUpCount - 持续上升的次数
 * continueUpFormerCount - 上一点的持续上升的次数，为了记录波峰的上升次数
 * lastStatus - 上一点的状态，上升还是下降
 * peakOfWave - 波峰值
 * valleyOfWave - 波谷值
 * timeOfThisPeak - 此次波峰的时间
 * timeOfLastPeak - 上次波峰的时间
 * timeOfNow - 当前的时间
 * gravityOld - 上次传感器的值
 * initialValue - 动态阈值需要动态的数据，这个值用于这些动态数据的阈值,这个值是由大量数据得来的
 * ThreadValue - 初始阈值,这个值是由大量数据得来的
 * minValue - 初始最小值 计算出来的xyz数值乘重力加速度（9.8）,此为手机拿在手里（不摆臂）(由自己多次测试得出的值)
 * maxValue - 初始最大值 自己设定的最大值（我们定位2）乘重力加速度（9.8）,此为手机拿在手里（不摆臂）(由自己多次测试得出的值)
 * g - 重力加速度（9.8）
 * thisSteps 步数
*/

var valueNum = 5,
    tempValue = [],
    isDirectionUp = false,
    continueUpCount = 0,
    continueUpFormerCount = 0,
    lastStatus = false,
    peakOfWave = 0,
    valleyOfWave = 0,
    timeOfThisPeak = 0,
    timeOfLastPeak = 0,
    timeOfNow = 0,
    gravityOld = 0,
    initialValue = 1.7,
    ThreadValue = 2.0,
    minValue = 11,
    maxValue = 19.6,
    g = 9.8,
    thisSteps = 0;

/*
 * @func counterStep - 计步器,x,y,值由手机加速计获取
 * @param x - x轴
 * @param x - y轴
 * @param x - z轴
*/

function counterStep(x, y, z) {
    var _sqrt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)),
        _average = _sqrt * g;
    
    detectorNewStep(_average);
}

/*
 * 监测新的步数
 *
 * 如果检测到了波峰，并且符合时间差以及阈值的条件，则判定为1步
 * 符合时间差条件，波峰波谷差值大于initialValue，则将该差值纳入阈值的计算中
 * @param values  加速传感器三轴的平均值
*/
function detectorNewStep(_values) {

    if (gravityOld == 0) {
        gravityOld = _values;
    } else {
        if (detectorPeak(_values, gravityOld)) { //没进if步数不变

            timeOfLastPeak = timeOfThisPeak;
            timeOfNow = new Date().getTime(); //获取当前系统毫秒时间


            // 时间差大于200ms,小于2s
            if (Number(timeOfNow) - Number(timeOfLastPeak) >= 200 && (Number(timeOfNow) - Number(timeOfLastPeak)) <= 2000 && (Number(peakOfWave) - Number(valleyOfWave) >= Number(ThreadValue))) {
                timeOfThisPeak = timeOfNow;
                //增加步数
                thisSteps++;
            }
    
            if (Number(timeOfNow) - Number(timeOfLastPeak) >= 200 && (Number(peakOfWave) - Number(valleyOfWave) >= Number(initialValue))) {
                timeOfThisPeak = timeOfNow;
                var _diffWaveVal = Number(peakOfWave) - Number(valleyOfWave);
    
                ThreadValue = peak_Valley_Thread(_diffWaveVal);
            }
        }
        gravityOld = _values;
    }

}

/*
 * 监测波峰
 * 以下四个条件判断为波峰
 * 1.目前点为下降的趋势：isDirectionUp为false
 * 2.之前的点为上升的趋势：lastStatus为true
 * 3.到波峰为止，持续上升大于等于2次
 * 4.波峰值大于minValue,小于maxValue
 * 记录波谷值
 * 1.观察波形图，可以发现在出现步子的地方，波谷的下一个就是波峰，有比较明显的特征以及差值
 * 2.所以要记录每次的波谷值，为了和下次的波峰作对比
 * @param _newValue
 * @param _oldValue
 * @return
 */
function detectorPeak(_newValue, _oldValue){
    lastStatus = isDirectionUp;
   
    if (_newValue >= _oldValue) {
        isDirectionUp = true;
        continueUpCount++;
    } else {
        continueUpFormerCount = continueUpCount;
        continueUpCount = 0;
        isDirectionUp = false;
    }

    if (!isDirectionUp && lastStatus && (continueUpFormerCount >= 2 && (_oldValue >= minValue && _oldValue < maxValue))) {
        //满足上面波峰的四个条件，此时为波峰状态
        peakOfWave = _oldValue;
        return true;
    } else if (!lastStatus && isDirectionUp) {
        //满足波谷条件，此时为波谷状态
        valleyOfWave = _oldValue;
        return false;
    } else {
        return false;
    }
}

/*
 * 阈值的计算
 * 1.通过波峰波谷的差值计算阈值
 * 2.记录4个值，存入tempValue[]数组中
 * 3.在将数组传入函数averageValue中计算阈值
 * @param _value
 * @return
 */
function peak_Valley_Thread(_value) {
    var _tempThread = ThreadValue,
        _tempValue = tempValue;

    if (tempValue.length < Number(valueNum)) {
        tempValue.push(_value);
    } else {
        //tempValue数组长度=valueNum=5
        _tempThread = averageValue(tempValue, valueNum);

        _tempValue.shift();
        _tempValue.push(_value);
        tempValue = _tempValue;
    }
    return _tempThread;
}

/*
 * 梯度化阈值
 * 1.计算数组的均值
 * 2.通过均值将阈值梯度化在一个范围里
 *
 * 这些数据是通过大量的统计得到的
 * @param{Array} value
 * @param n
 * @return
 */
function averageValue(_value, _n) {
    if (Array.isArray(_value)) {
        var _ave = 0;

        for (var i = 0; i < _n; i++) {
            _ave += _value[i];
        }
        _ave = _ave / _n;  //计算数组均值
        if (_ave >= 8) {
            _ave = 4.3;
        } else if (_ave >= 7 && _ave < 8) {
            _ave = 3.3;
        } else if (_ave >= 4 && _ave < 7) {
            _ave = 2.3;
        } else if (_ave >= 3 && _ave < 4) {
            _ave = 2.0;
        } else {
            _ave = 1.7;
        }
        return _ave;
    } else {
        console.log('_value必须为数组');
        return 1.7;
    }

}
```