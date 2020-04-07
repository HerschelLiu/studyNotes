## 继承Activity和AppCompatActivity区别

AppCompatActivity

* 主要是为了兼容低版本的一些问题
* 是用来替代ActionBarActivity的
* 默认带标题（因为i带ActionBar，现在已经不用这个了，取而代之的是TooBar），且和`requestWindowFeature(Window.FEATURE_NO_TITLE);`冲突
* theme主题只能用android:theme=”@style/AppTheme （appTheme主题或者其子类），而不能用android:style。 否则会提示错误： `Caused by: java.lang.IllegalStateException: You need to use a Theme.AppCompat theme (or descendant) with this activity.`

Activity

* 默认不带标题

# This view is not constrained vertically: at runtime

android studio在布局的时候没有选择水平对其约束会出`This view is not constrained vertically: at runtime it will jump to the top unless you add a vertical constraint`，将布局切换到Design模式，在出现问题的布局地方右键，然后选择对齐方式（constrain）为`parent top`(父控件顶部对齐)