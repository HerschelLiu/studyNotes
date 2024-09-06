```scss
// mixins

/** Mixins */
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

// -- 下方小程序

// flex
@mixin flex-column {
  display: flex;
  flex-direction: column;
}

@mixin flex-row {
  display: flex;
  flex-direction: row;
}

@mixin flex-shrink {
  flex: 0 0 auto;
}

@mixin flex-grow {
  flex: 1 1 auto;
}

@mixin play-icon {
  width: 100%;
  height: 100%;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABeCAMAAACdDFNcAAAAPFBMVEVHcEz///////////////////////////////////////////////////////////////////////////+PybD1AAAAE3RSTlMADU+cv64kBef2cGGLfRgzzNlAZ6h8KAAAA9tJREFUaN61WtmWrCAMFBBlcwH//1/vJWBrtwoBHB7mzOlpy6SyUITpOswaF21YLza/pO3ZRIfupTW6qd+uS3K1jM3YlG/PSzLX8gbH5BecgPX9kamlia6HmT3TbschA1Xs+NvGlxZwyafb5535hISXejDslK8qwe5sbPyaISUBVbvhWb9pdEFQvOlrzAuUSQsP8WdIB3QkFO3vEswRmBATFr7rSkKlggMqj74GXgpTYQ4hMJkqI7bc9LAmcIAl8WdAX0lNFS4ihx9s55VVHmwzGd5Nff9LPk8gPFNLg00hsDbbYYH99LGaeBt6R3x85U2HGyBnmve2wefnekmf0YddkGb4QMKF/sk75boXFoRwuaFm6l5Z65We/hXiT/Trr03BU7O8BN+ZnzBCXFn32hLfTPtoy/E9eMA7zLft5fq97Nl8ijB+UKZAV3rzxY7Is8yPQZeIuYT92Hpm/2T6wY/QNMgI+Srt4z58/PrUqE6qFcfQyeT1twquQuAsWnEO9Ltw8C+S+UQodEDvlOh8m//V9QgHyJ6NPMtNdz04zCh2aMyhuRQ+78AUKsu3YtsVw28yY5IL5FPEDnt/sko7MPoyDEk3VcFnUsgC6X7vcnXwacnHAdhHeKiFP/rW/aaiIXG6avgEvoK6lRCBavjnI4OGTQSRl0n47UkbUWjzzfBPCmCBjN8ayXlsKAPU1Z/BzwDfGtpHcoL1ItvtK0MbuLeJb2DgdaqnscaqTZRVyHv2dFpBwUuSbPgq/qyET503gt0UoV4fG8KYkfkDBLivghfpkElIyTGvQ+7hdXq3XeKBpM/vJ3em57SCiqp7yqvvgmy/CBGXP1b9gtu8TiMylqsnP1NY3yJww0zlPiIQ9lyTlUSH6SiR/5GwkPkWK8A33EDxJMBHmc2dDzsr8nxiTuLM5M8PcVSNngqcDj/hxD/kBu29wU/T1Vcv5S9Mci7Gq68C3ob30NXPRsARfa1gJCV/mvyAK/SCiY4dU0OMluWu5QH+vBNdmNbxG0WImGAj28HlZDSylyZG030Ywad2+ukTy+6NQSbM0Sx5nBy0hXcWCdXJWvHDiJ0mh0J99VAtXBA8p18YsVvSENXkGTngi6r8VDI/yQ38yPJxL+EogTKGa6u+sD1Tgd2Iw2SryIGZ46/dYgJsqytjHX0LGO/1th7zglHFG/qC7cLFG+tV54azJmoIPhclwnTctj8brvf7ZkuLC5x9tDbX1zzy/16w39MLVVPoxwvgLn7SbvBrocrwk6i1qraLzGrd0kty2jT3H6Y1ga1f2P1nzcQVezXuvfsKAoz3sP5HAX1T8A/yCIhYJUVLcwAAAABJRU5ErkJggg==');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 94px;
}

@mixin ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 多行文本截断
@mixin row-ellipsis($line: 2) {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
}

// 绝对定位
@mixin position($absolute, $left: auto, $top: auto, $right: auto, $bottom: auto, $margin: 0) {
  @if $left != auto {
    left: $left;
  }

  @if $right != auto {
    right: $right;
  }

  @if $top != auto {
    top: $top;
  }

  @if $bottom != auto {
    bottom: $bottom;
  }

  @if $margin != 0 {
    margin: $margin;
  }
  position: $absolute;
}

// 渐变
@mixin gradient($deg: 40deg, $startColor: #e62300, $endColor: #d80011, $start: 0%, $end: 100%) {
  background: -webkit-linear-gradient($deg, $startColor $start, $endColor $end);
}

// ios安全区
@mixin safe($css: bottom, $area: 0) {
  #{ $css }: #{$area};
  #{ $css }: calc(#{$area} + constant(safe-area-inset-bottom));
  #{ $css }: calc(#{$area} + env(safe-area-inset-bottom));
}

// 横向1像素边框
@mixin border-horizontal($position: bottom, $distance: 0, $color: rgba($black, 0.08)) {
  @include position(absolute, 0, auto, 0);
  content: '';
  height: 1px;
  background-color: $color;
  #{ $position }: $distance;
}

// 纵向1像素边框
@mixin border-vertical($position: right, $distance: 0, $color: rgba($black, 0.08)) {
  @include position(absolute, auto, 0, auto, 0);
  content: '';
  width: 1px;
  background-color: $color;
  #{ $position }: $distance;
}

// 操作小箭头
@mixin arrow($width: 12px, $height: 12px, $color: currentColor, $rotate: 45deg) {
  content: '';
  width: $width;
  height: $height;
  margin-right: calc(#{$width} / 2);
  transform: rotate($rotate);
  border-top: $color 2px solid;
  border-right: $color 2px solid;
}

// 图片固定比例显示
@mixin ratio($width: 100, $height: 100) {
  @include flex-grow;

  &::after {
    content: '';
    display: inline-block;
    visibility: hidden;
    padding-top: calc(#{$height / $width * 100%});
    vertical-align: top;
  }
}

// 动画
@mixin keyframes-fade-in {
  @keyframes fade-in {
    from {
      transform: translateY(100%);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

@mixin keyframes-fade-opacity {
  @keyframes fade-opacity {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}

@mixin keyframes-rotate {
  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
}

@mixin fade-opacity {
  animation: fade-opacity 0.3s linear both;
}

@mixin fade-in {
  animation: fade-in 0.3s cubic-bezier(0.44, 1.3, 0.67, 1.04) both;
}

@mixin rotate {
  animation: rotate 2s linear infinite;
}

@mixin width {
  width: 100%;
}

@mixin height {
  height: 100%;
}

@mixin width-height {
  width: 100%;
  height: 100%;
}

@mixin view-hover {
  background-color: $background-color !important;
}

@mixin button-hover {
  opacity: 0.9;
}

@mixin block {
  display: block;
}

@mixin pink {
  color: $pink;
}

@mixin blue {
  color: $blue;
}

@mixin gray {
  color: $gray;
}

@mixin yellow {
  color: $yellow;
}

@mixin black {
  color: $black;
}

@mixin brand {
  color: var(--default-color);
}

```

