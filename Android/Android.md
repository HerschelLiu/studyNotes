## 获取strings.xml中的值

```java
<resources>
    <string name="app_name">HelloWorld</string>
</resources>

```

* 代码中通过`R.string.app_name`获取
* 在XML中通过`@string/app_name`获取
  * `string`部分可替换，图片资源就`drawable`，布局文件就`layout`，以此类推

PS：《第一行代码》中说的，但是书里的时安卓4.4，现在是安卓10.0，看目录结构发现，`mipmap`下是图片，`drawable`下是同名的xml文件，不知道是不是现在图片资源都放在`mipmap`下

## 日志工具Log

在调试代码的时候我们需要查看调试信息，那我们就需要用Android Log类。

* `Log.v` 的调试颜色为**黑色**的，任何消息都会输出，这里的v代表verbose啰嗦的意思，平时使用就是`Log.v("","");`

* `Log.d`的输出颜色是**蓝色**的，仅输出debug调试的意思，但他会输出上层的信息，过滤起来可以通过DDMS的Logcat标签来选择.

* `Log.i`的输出为**绿色**，一般提示性的消息information，它不会输出`Log.v`和`Log.d`的信息，但会显示i、w和e的信息

* `Log.w`的意思为**橙色**，可以看作为warning警告，一般需要我们注意优化Android代码，同时选择它后还会输出Log.e的信息。

* `Log.e`为红色，可以想到error错误，这里仅显示红色的错误信息，这些错误就需要我们认真的分析，查看栈的信息了。

* `Log.a`为4.0新增加的。Assert 表示断言失败后的错误消息，这类错误原本是不可能出现的错误，现在却出现了，是极其严重的错误类型

注意：不同的打印方法在使用时都是某个方法带上(String tag, String msg)参数，第一个参数是 tag，一般传入当前的类名就好，主要用于对打印信息进行过滤。第二个参数是 msg，即想要打印的具体内容。

```java
Log.d("HelloWorldActivity","______________onCreate execute______________");
```



### 日志工具（LogCat）

Android Studio可以在最底下找到

点击过滤器那个下拉框，选择 Edit Filter Configuration，在弹出的对话框中点击左上角的加号新创建一个 Filter。含义如下：

Name：Filter 名称

by Log Tag： 通过日志的 tag 过滤

by Log Message：通过日志的 msg 内容过滤

by Package Name：通过包名过滤

by PID：通过PID过滤

by Log Level：通过日志等级过滤

regex：表示可以使用正则表达式进行匹配

## 初次创建（创建活动）

在java文件夹下的包名下，是活动的起始，起始代码如下，只需要重写onCreate

```java
package com.example.helloworld;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); // 关联layout下的activity_main的xml文件，给当前活动加载一个布局
    }
}

```

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/button_1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Button 1"></Button>
</LinearLayout>

```

* 在xml中，定义一个id`@+id/id_name`,引用一个id`@id/id_name`
* `android:layout_width/`android:layout_height指定当前元素的宽/高，`match_parent`表示让当前元素和父元素一样宽/高，`wrap_content`表示当前元素的宽/高只要能够刚好包含里面的内容就行
* `android:text`指定了其中的文字
* 在`onCreate`方法调用`setContentView()`给当前活动加载一个布局。项目中的任何资源都会在R文件中生成一个相应的资源id。一般来说括号里直接`R.layout.layout文件名`就可以，`layout文件名`部分会是红色的，而且上面的文件名下面也会有波浪线，但是运行起来是没错的，这应该是编辑器的原因，重启Android Studio就好了，所以出现这个问题不用管

### 在AndroidManifest文件中注册

所有的活动都要在这个文件中注册才能生效。

活动的注册声明要放在`<application></application>`中，通过`<activity>`标签注册

```xml
<activity android:name=".FirstActivity"
          android:label="This is FirstActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

* `android:name`指定具体注册哪个活动，其值`.FirstActivity`是`包名.FirstActivity`的缩写(com.example.helloworld.FirstActivity)，由于最外层`<manifest>`的属性`package`的值已经设置了包名`com.example.helloworld`，所以可以缩写
* `android:label`指定活动中标题栏(appBar)的内容，如果没有这个属性，标题栏的文字就会变成活动名`com.example.helloworld.FirstActivity`,**给主活动指定的label，不仅会成为标题栏中的内容，还会成为启动器中应用程序显示的名称**
* `<intent-filter>`标签里添加` <action android:name="android.intent.action.MAIN" />`和`<category android:name="android.intent.category.LAUNCHER" />`两个声明，如果想让`FirstActivity`成为主活动，即点击桌面应用图标，首先打开的活动，那就一定要**加上这两个声明**

### 去掉标题栏

在`onCreate`中，且必须在`setContentView()`之前加上`requestWindowFeature(Window.FEATURE_NO_TITLE);`一定要在`setContentView()`之前，不然报错

### 标题栏不隐藏

原因是活动是继承`AppCompatActivity`

解决方法：

1. 将继承的`AppCompatActivity`改为`Activity`

2. 在onCreate()方法中加入如下代码：

    ```java
    if (getSupportActionBar() != null){
       getSupportActionBar().hide();
    }
    ```
    
    此代码放在`onCreate`中任何位置都可以

### Toast

点击按钮触发个Toast

```xml
// activity_main.xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:id="@+id/button_1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Button 1"></Button>

</androidx.constraintlayout.widget.ConstraintLayout>
```

```java
// MainActivity.java
package com.example.helloworld;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getSupportActionBar() != null){
            getSupportActionBar().hide();
        }
        setContentView(R.layout.activity_main);
        Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(MainActivity.this, "You click button 1", Toast.LENGTH_SHORT).show();// 活动.this, 文本, 时长，有两个内置选项Toast.LENGTH_SHORT和Toast.LENGTH_LONG
            }
        });
    }
}

```

**PS: 编写时如果字的颜色变红/提示需要引入包，直接`Alt + Shift + Enter`自动生成,或`Alt + Enter`手动选择生成，就可以了。**

* `findViewById()`获取组件中定义的元素(类似JS/JQ中的`getElementId/$('#id')`),使用`R.id.(android:id)`来取xml中Button的`android:id`值，但是这个返回的是个View对象，所以需要加上(Button)转成Button对象
* `setOnClickListener`注册点击监听器，点击按钮会触发其中的`onclick`方法

### 菜单

```xml
// res/menu/main.xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/add_item"
        android:title="Add"></item>
    <item
        android:id="@+id/remove_item"
        android:title="Remove"></item>
</menu>
```

```java
// MainActivity.java
package com.example.helloworld;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(MainActivity.this, "You click button 1", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    } // 创建menu

    public boolean onOptionsItemSelected(MenuItem item) { // menu中的每一项
        switch (item.getItemId()) {
            case R.id.add_item:
                Toast.makeText(this, "You click Add", Toast.LENGTH_SHORT).show();
                break;
            case R.id.remove_item:
                Toast.makeText(this, "You click Remove", Toast.LENGTH_SHORT).show();
                break;
        }
        return true;
    }
}


```

完成之后，在标题栏右侧会出现点点点，点击就会打开菜单栏，如果隐藏的菜单栏，就无法通过点击或menu键显示菜单

### 销毁活动

只需要按下`back`键就可以销毁当前活动，或者在代码中加入`finish()`



## 新建第二个活动

每个活动即每个`onCreate`都是单独一个java文件，**所有活动都要在<Application>**里注册。不是主活动就不用设置`<intent-filter>`中的内容

### 使用`Intent`在活动中穿梭

`intent`是Android程序中各组件之间进行交互的一种重要方式，不仅可以指明当前组件想要执行的动作，还可以在各组件之间传递数据。一般可用于**启动活动**、**启动服务**、**发送广播**等场景。用法分为**显示**和**隐式**

```java
// 显示
Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, SecondActivity.class);
                startActivity(intent);
            }
        });
```

构建Intent，传入`MainActivity.this`作为上下文, `SecondActivity.class`作为目标活动，即在`MainActivity`这个活动基础上打开`SecondActivity`这个活动，然后通过`startActivity()`方法执行这个Intent

**隐式**

不明确指出想要启动哪一个活动，而是指定了一系列更为抽象的`action`和`category`等信息，然后交由系统去分析这个Intent，并帮我们找出合适的活动去启动

```
// AndroidManifest.xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.example.helloworld.ACTION_START"></action>
        <category android:name="android.intent.category.DEFAULT"></category>
    </intent-filter>
</activity>

//MainActivity.java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("com.example.helloworld.ACTION_START");
                startActivity(intent);
            }
        });
    }
```

**`com.example.helloworld`是包名**

`android.intent.category.DEFAULT`是一种默认的`category`，在调用`startActivity()`会自动将这个`category`添加进Intent

每个Intent只能指定一个action，但是能指定多个category

```diff
// AndroidManifest.xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.example.helloworld.ACTION_START"></action>
        <category android:name="android.intent.category.DEFAULT"></category>
+	    <category android:name="com.example.helloworld.MY_CATEGORY"></category>  
    </intent-filter>
</activity>

//MainActivity.java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("com.example.helloworld.ACTION_START");
+               intent.addCategory("com.example.helloworld.MY_CATEGORY");
                startActivity(intent);
            }
        });
    }
```

#### 向下个活动传递数据

```diff
// MainActivity.java
button1.setOnClickListener(new View.OnClickListener(){
    @Override
    public void onClick(View v) {
        String data = "Hello SecondActivity";
        Intent intent = new Intent("com.example.helloworld.ACTION_START");
+       intent.putExtra("extra_data", data);
        startActivity(intent);
    }
});

// SecondActivity.java
public class SecondActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.second_layout);
+       Intent intent = getIntent();
+       String data = intent.getStringExtra("extra_data");
        Log.d("SecondActivity", data);
    }
```

`getStringExtra`获取字符串数据，`getIntExtra`获取整型数据，`getBooleanExtra`获取布尔型数据，以此类推

#### 返回数据给上一个活动

`startActivityForResult()`第一个参数是Intent，第二个参数是请求码

```diff
// MainActivity.java
button1.setOnClickListener(new View.OnClickListener(){
    @Override
    public void onClick(View v) {
+      Intent intent = new Intent("com.example.helloworld.ACTION_START");
+      startActivityForResult(intent, 1); // 这个1就是requestCode
    }
});

// onCreate下
+ @Override
+ protected void onActivityResult(int requestCode, int resultCode, Intent data) {
+ 	switch(requestCode) {
+ 		case 1:
+ 			if (resultCode == RESULT_OK) {
+ 				String returnedData = data.getStringExtra("data_return");
+ 				Log.d("mainActivity", returnedData);
+ 			}
+ 		default: break;
+ 	}
+ }

// SecondActivity.java
// 通过点击按钮返回
protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	requestWindowFeature(Window.FEATURE_NO_TITLE);
	setContentView(R.layout.second_layout);
	Button button2 = (Button) findViewById(R.id.button_2);
	button2.setOnClickListener(new View.OnClickListener() {
		@Override
		public void onClick(View v) {
+  			Intent intent = new Intent();
+			intent.putExtra("data_return", "Hello MainActivity");
+			setResult(RESULT_OK, intent);
			finish();
		}
	});
}

// 通过back键返回
+ @Override
+ public void onBackPressed() {
+ 	 Intent intent = new Intent();
+ 	 intent.putExtra("data_return", "Hello MainActivity");
+ 	 setResult(RESULT_OK, intent);
+ 	 finish();
+ }
```

setResult第一个参数一般只用`RESULT_OK`或`RESULT_CANCELED`这两个

## 活动的生命周期

### 活动的生存期

Activity类中定义了七个回调方法，覆盖了活动生命周期的每个环节。

* 完整生存期
  + `onCreate()`: 每个活动中都会重写这个方法，他会在活动第一次被创建的时候调用

  + `onDestroy()`: 在活动销毁之前调用，之后状态变为销毁状态

* 可见生存期

  + `onStart()`：活动由不可见变为可见的时候调用

  + `onStop()`: 在活动完全不可见的时候调用。与`onPause()`不同在于，如果启动的新活动是一个对话框式的活动，会运行`onPause()`

* 前台生存期

  + `onResume()`: 在活动准备好和用户进行交互的时候调用。此活动一定位于返回栈的栈顶，并且处于运行状态
  + `onPause()`: 在系统准备去启动或者恢复另一个活动时调用。

* `onRestart()`: 在活动由停止状态变为运行状态之前调用

```java
@Override
protected void onStart() {
    super.onStart();
    Log.d(TAG, "onStart");
}
```

**其他方法相同**

#### 活动被回收的怎么办

A打开B，如果内存不足，A会被回收，此时B返回，A会重新调用`onCreate（）`，但是A的临时数据和状态都没了，可以使用**`onSaveInstanceState()`**，这个方法会保证一定在活动被回收之前调用，因此我们可以通过这个方法来解决活动被回收时

`onSaveInstanceState()`方法会携带一个 `Bundle` 类型的参数，`Bundle` 提供了一系列的方法
用于保存数据，比如可以使用 `putString()`方法保存字符串，使用 `putInt()`方法保存整型数据，以此类推。每个保存方法需要传入两个参数，第一个参数是键，用于后面从 Bundle 中取值，
第二个参数是真正要保存的内容。

```java
// MainActivity.java
@Override
protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    String tempData = "Something you just typed";
    outState.putString("data_key", tempData);
}
```

`onCreate()`也有一个Bundle类型参数

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.d(TAG, "onCreate");
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(R.layout.activity_main);
    if (savedInstanceState != null) {
        String tempData = savedInstanceState.getString("data_key");
        Log.d(TAG, tempData);
    }
}
```

## 活动的启动模式

启动模式一共有四种，分别是 `standard`、``singleTop`、`singleTask` 和 `singleInstance` ，可以 在`AndroidManifest.xml`中通过给 `<activity>`标签指定`android:launchMode` 属性来选择启动模式。

### standard

默认的启动模式。对于使用``standard`模式的活动，系统不会在乎这个活动是否已经在返回栈中存在，每次启动都会创建该活动的一个新的实例。**即一直入栈**

### singleTop

如果启动的活动就是返回栈的**栈顶**，直接使用，不会再创建新的活动实例，不是栈顶还是会新建

### singleTask

活动在整个应用程序的上下文中**只存在一个**实例。如果发现已经存在则直接使用该实例，并把在这
个活动之上的**所有活动统统出栈**，如果没有发现就会创建一个新的活动实例。

### singleInstance

在这种模式下会有一个单独的返回栈来管理这个活动，不管是哪个应用程序来访问这个活动，都共用的同一个返回栈，也就解决了共享活动实例的问题。

**返回问题：**1，2，3共3个活动，栈A有1，3两个活动，栈B有2活动，因为3是栈A的，所以栈A在栈B上面，点击返回的话则是3 -> 1 -> 2 -> 退出

### 随时随地退出程序

如果返回栈中有很多栈，退出程序只能一次次点返回，可以用一个专门的集合类对所有的活动进行管理