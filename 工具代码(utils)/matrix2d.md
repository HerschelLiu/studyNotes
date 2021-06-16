```javascript
// matrix空数组
var abcdef = 'abcdef'.split('')

// 数组转matrix值
function arrayToMatrix(a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// 角度转弧度
function radians(d) {
  return d % 360 * Math.PI / 180
}

function deltaTransformPoint(matrix, x, y) {
  return {
    x: x * matrix.a + y * matrix.c + 0,
    y: x * matrix.b + y * matrix.d + 0
  }
}

// 2d图形矩阵
function Matrix2d(source) {
  var i; var base = arrayToMatrix([1, 0, 0, 1, 0, 0])

  if (typeof source === 'string') {
    source = arrayToMatrix(source.split(/[\s,]+/).map(parseFloat))
  } else if (arguments.length === 6) {
    source = arrayToMatrix([].slice.call(arguments))
  } else if (Array.isArray(source)) {
    source = arrayToMatrix(source)
  } else if (source && typeof source === 'object') {
    // source = source;
  } else {
    source = base
  }

  // merge source
  for (i = abcdef.length - 1; i >= 0; --i) { this[abcdef[i]] = source[abcdef[i]] != null ? source[abcdef[i]] : base[abcdef[i]] }
}

// 成员方法
Matrix2d.prototype = {
  // 平移
  translate: function(x, y) {
    // return new Matrix2d(this.native().translate(x || 0, y || 0))
    return this.multiply(new Matrix2d({
      a: 1,
      c: 0,
      e: x || 0,
      b: 0,
      d: 1,
      f: y || 0
    }))
  },

  // 缩放
  scale: function(x, y, cx, cy) {
    // support uniformal scale
    if (arguments.length === 1) {
      y = x
    } else if (arguments.length === 3) {
      cy = cx
      cx = y
      y = x
    }

    return this.around(cx, cy, new Matrix2d(x, 0, 0, y, 0, 0))
  },

  // 旋转
  rotate: function(r, cx, cy) {
    r = radians(r)
    return this.around(cx, cy, new Matrix2d(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
  },

  // 围绕
  around: function(cx, cy, matrix) {
    return this
      .multiply(new Matrix2d(1, 0, 0, 1, cx || 0, cy || 0))
      .multiply(matrix)
      .multiply(new Matrix2d(1, 0, 0, 1, -cx || 0, -cy || 0))
  },

  // 矩阵合并
  multiply: function(m2) {
    var m1 = this
    var rs = new Matrix2d({
      a: m1.a * m2.a + m1.c * m2.b,
      c: m1.a * m2.c + m1.c * m2.d,
      e: m1.a * m2.e + m1.c * m2.f + m1.e,
      b: m1.b * m2.a + m1.d * m2.b,
      d: m1.b * m2.c + m1.d * m2.d,
      f: m1.b * m2.e + m1.d * m2.f + m1.f
    })

    return rs
  },

  // 叠加设置context2d的矩阵
  transform: function(ctx2d) {
    ctx2d.transform(this.a, this.b, this.c, this.d, this.e, this.f)
  },

  // 基于matrix转换点坐标
  matrixTransform: function(point) {
    return {
      x: this.a * point.x + this.c * point.y + this.e,
      y: this.b * point.x + this.d * point.y + this.f
    }
  },

  // 全局坐标转本地坐标
  world2local: function(p) {
    return this.inverse().matrixTransform(p)
  },

  // 矩阵倒转
  inverse: function() {
    var denom = this.a * this.d - this.b * this.c
    return new Matrix2d({
      a: this.d / denom,
      b: this.b / -denom,
      c: this.c / -denom,
      d: this.a / denom,
      e: (this.d * this.e - this.c * this.f) / -denom,
      f: (this.b * this.e - this.a * this.f) / denom
    })
  },

  // 矩阵属性反推 matrix -> {rotation, ...}
  extract: function() {
    // find delta transform points
    var px = deltaTransformPoint(this, 0, 1)
    var py = deltaTransformPoint(this, 1, 0)
    var skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

    return {
      // translation
      x: this.e,
      y: this.f,
      transformedX: (this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b),
      transformedY: (this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d), // skew

      skewX: -skewX,
      skewY: 180 / Math.PI * Math.atan2(py.y, py.x), // scale

      scaleX: Math.sqrt(this.a * this.a + this.b * this.b),
      scaleY: Math.sqrt(this.c * this.c + this.d * this.d), // rotation

      rotation: skewX,
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f,
      matrix: new Matrix2d(this)
    }
  },

  // toArray
  toArray: function() {
    return [this.a, this.b, this.c, this.d, this.e, this.f]
  },

  // toString
  toString: function() {
    return '' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ''
  }
}

export default Matrix2d

```



