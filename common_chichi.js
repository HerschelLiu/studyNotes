/**
 * @author 赤赤
 */

/**
 * 表单验证 S
 * validator.add(registerForm.userName, [{
 *   strategy: 'minLength:6',
 *   errormsg: '用户名长度不能小于10位'
 * }]);
 * 或
 * validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');
 */
var strategies = {
    isNonEmpty: function (value, errMsg) {
        if (value === '') {
            return errMsg;
        }
    },
    minLength: function (value, minlength, errMsg) {
        if (value.length < minlength) {
            return errMsg;
        }
    }
};

var Validator = function () { 
    this.cache = [];
};

Validator.prototype.add = function (dom, rules, errMsg) { 
    var that = this;
    var commonFunc = function (rule, errorMsg) {
        var ary = rule.split(':');
        that.cache.push(function () { 
            var strategy = ary.shift();
            ary.unshift(dom.value);
            ary.push(errorMsg);
            return strategies[strategy].apply(dom, ary);
        });

        if (Array.isArray(rules)) {
            for (var i = 0, rule; rule = rules[i++];) {
                commonFunc(rule.strategy, rule.errorMsg);
            }
        } else {
            commonFunc(rules, errMsg);
        }
    }
};

Validator.prototype.start = function() {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var msg = validatorFunc();
        if (msg) {
            return msg;
        }
    }
};
// 表单验证 E
export default {
    Validator
}
