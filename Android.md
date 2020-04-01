# LinearLayout

[LinearLayout](http://developer.android.com/reference/android/widget/LinearLayout.html) 是 [ViewGroup](http://developer.android.com/reference/android/view/ViewGroup.html) 的子类，用于放置水平或者垂直方向的子视图部件，放置方向由属性 [android:orientation](http://developer.android.com/reference/android/widget/LinearLayout.html#attr_android:orientation) 决定。[LinearLayout](http://developer.android.com/reference/android/widget/LinearLayout.html) 里的子布局按照 XML 里定义的顺序显示在屏幕上。

所有的 Views 都会用到 [android:layout_width](http://developer.android.com/reference/android/view/View.html#attr_android:layout_width) 和 [android:layout_height](http://developer.android.com/reference/android/view/View.html#attr_android:layout_height) 这两个属性来设置自身的大小。

由于 [LinearLayout](http://developer.android.com/reference/android/widget/LinearLayout.html) 是整个视图的根布局，所以通过指定 width 和 height 属性为 `"match_parent"` 可以使其宽度和高度充满整个屏幕。该值表示子 View 扩张自己宽度和高度来 *匹配* 父控件的宽度和高度。