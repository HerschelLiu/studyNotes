## 继承Activity和AppCompatActivity区别

AppCompatActivity

* 主要是为了兼容低版本的一些问题
* 是用来替代ActionBarActivity的
* 默认带标题（因为带ActionBar，现在已经不用这个了，取而代之的是TooBar），且和`requestWindowFeature(Window.FEATURE_NO_TITLE);`冲突
* theme主题只能用android:theme=”@style/AppTheme （appTheme主题或者其子类），而不能用android:style。 否则会提示错误： `Caused by: java.lang.IllegalStateException: You need to use a Theme.AppCompat theme (or descendant) with this activity.`

Activity

* 默认不带标题

## ConstraintLayout布局中使用控件提示`This view is not constrained vertically: at runtime it will jump to the top unless you add a vertical constraint less…`
要检查一下ConstraintLayout中的约束条件是否完整.所谓的完整就是**水平和垂直**的约束都要有
**解决方法:**
点击右上角图片样式的按钮切换到布局预览模式，在预览图上方点击魔术棒

## mipmap和drawable的区别

mipmap只是用来放app的icon图标(启动图即应用图标)的。虽然一些切图放在mipmap上，项目运行也是没有错误的。但是作为一个严谨的开发者，我们需要遵守规范