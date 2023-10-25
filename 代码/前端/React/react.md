[TOC]

## 推荐的工具链

- **学习 React** 或**创建一个新的[单页](https://react.docschina.org/docs/glossary.html#single-page-application)应用**，请使用 [Create React App](https://react.docschina.org/docs/create-a-new-react-app.html#create-react-app)。
- **用 Node.js 构建服务端渲染的网站**，试试 [Next.js](https://react.docschina.org/docs/create-a-new-react-app.html#nextjs)。[Next.js官方指南](https://nextjs.org/learn/)
- 构建**面向内容的静态网站**，试试 [Gatsby](https://react.docschina.org/docs/create-a-new-react-app.html#gatsby)。
- 打造**组件库**或**将 React 集成到现有代码仓库**，尝试[更灵活的工具链](https://react.docschina.org/docs/create-a-new-react-app.html#more-flexible-toolchains)。

## 更灵活的工具链

以下工具链为 React 提供更多更具灵活性的方案。推荐给更有经验的使用者：

- **[Neutrino](https://neutrinojs.org/)** 把 [webpack](https://webpack.js.org/) 的强大功能和简单预设结合在一起。并且包括了 [React 应用](https://neutrinojs.org/packages/react/)和 [React 组件](https://neutrinojs.org/packages/react-components/)的预设。
- **[Parcel](https://parceljs.org/)** 是一个快速的、零配置的网页应用打包器，并且可以[搭配 React 一起工作](https://parceljs.org/recipes.html#react)。
- **[Razzle](https://github.com/jaredpalmer/razzle)** 是一个无需配置的服务端渲染框架，但它提供了比 Next.js 更多的灵活性。

## Create React App

```bash
npx create-react-app my-app
cd my-app
npm start
```

当准备好部署到生产环境时，执行 `npm run build` 会在 `build` 文件夹内生成你应用的优化版本。

由于react默认没有router功能，所以需要安装`react-router`、`react-router-dom`。

## 注意

### 组件名称必须以大写字母开头。

React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`<div />` 代表 HTML 的 div 标签，而 `<Welcome />` 则代表一个组件，并且需在作用域内使用 `Welcome`。

## 组件&Props

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 同时还可以使用 ES6 的 class 来定义组件：
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

在 `render()` 方法中使用 `this.props` 替换 `props`。

## state&生命周期

示例

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.name}.</h2>
      </div>
    );
  }
}
```

### 向class组件中添加局部的state

State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'React'};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.name}.</h2>
      </div>
    );
  }
}
```

### `setState()`

**不要直接修改State**，例如此代码不会重新渲染组件`this.state.comment = 'Hello';`，而是使用`setState`: `this.setState({comment: 'Hello'});`

---

**构造函数是唯一可以给 `this.state` 赋值的地方**;

---

**State**的更新可能是异步的：因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。

例如，此代码可能会无法更新计数器：

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

---

### 将生命周期方法添加到Class中

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'React'};
  }
    
  // 生命周期: will:函数在进入状态之前调用;did:函数在进入状态之后调用;
  // 挂载
  componentWillMount() {}
  componentDidMount() {} // 可以在这里进行Ajax
  componentWillUpdate(object nextProps, object nextState) {}
  componentDidUpdate(object prevProps, object prevState) {}
  // 卸载
  componentWillUnmount() {}
  
    
  // 特殊状态的处理函数
  // 已加载组件收到新的参数时调用
  componentWillReceiveProps(object nextProps) {} 
  // 组件判断是否重新渲染时调用
  shouldComponentUpdate(object nextProps, object nextState) {}

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.name}.</h2>
      </div>
    );
  }
}
```

## 事件处理

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

```html
// 传统的 HTML
<button onclick="activateLasers()">
  Activate Lasers
</button>

// React 
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

* 不能通过返回 `false` 的方式阻止默认行为。你必须显式的使用 `preventDefault` 。

```react
// html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>

// React
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

* 直接写函数

```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

### 向实践处理程序传递参数

在循环中，通常我们会为事件处理函数传递额外的参数。例如，若 `id` 是你要删除那一行的 ID，以下两种方式都可以向事件处理函数传递参数：

```html
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

在这两种情况下，React 的事件对象 `e` 会被作为**参数**传递。如果通过箭头函数的方式，事件对象**必须显式**的进行传递，而通过 `bind` 的方式，事件对象以及更多的参数将会**被隐式的进行传递**。

## 条件渲染

通过花括号包裹代码，你可以[在 JSX 中嵌入任何表达式](https://react.docschina.org/docs/introducing-jsx.html#embedding-expressions-in-jsx)。这也包括 JavaScript 中的逻辑与 (&&) 运算符。它可以很方便地进行元素的条件渲染。

```react
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&      
          <h2>You have {unreadMessages.length} unread messages.</h2>     
      }    
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

### 阻止组件渲染

在极少数情况下，你可能希望能隐藏组件，即使它已经被其他组件渲染。若要完成此操作，你可以让 `render` 方法直接返回 `null`，而不进行任何渲染。

```react
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

## 列表&key

当你创建一个元素时，必须包括一个特殊的 `key` 属性

```react
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);

// JSX 允许在大括号中嵌入任何表达式，所以我们可以内联 map() 返回的结果：
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

**用 key 提取组件**

元素的 key 只有放在就近的数组上下文中才有意义。

比方说，如果你[提取](https://react.docschina.org/docs/components-and-props.html#extracting-components)出一个 `ListItem` 组件，你应该把 key 保留在数组中的这个 `<ListItem />` 元素上，而不是放在 `ListItem` 组件中的 `<li>` 元素上。

```react
function ListItem(props) {
  // 正确！这里不需要指定 key：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 正确！key 应该在数组的上下文中被指定
    <ListItem key={number.toString()} value={number} />

  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

## 使用PropTypes进行类型检查

要在组件的 props 上进行类型检查，你只需配置特定的 `propTypes` 属性：

```react
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string，
  children: PropTypes.element.isRequired
};
// 指定 props 的默认值：
Greeting.defaultProps = {
  name: 'Stranger'
};
```

以下提供了使用不同验证器的例子：

```react
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,

  // 一个 React 元素。
  optionalElement: PropTypes.element,

  // 一个 React 元素类型（即，MyComponent）。
  optionalElementType: PropTypes.elementType,

  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `onOfType` 中不会起作用。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```



## 组件间通信

```jsx
// 父组件
import React from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  const value = 'Hello, World!';

  return (
    <div>
      <ChildComponent prop={value} />
    </div>
  );
}

// 子组件
import React from 'react';

function ChildComponent(props) {
  return <div>{props.prop}</div>;
}

export default ChildComponent;

```



## Hook

*Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

[Hook API 索引](https://react.docschina.org/docs/hooks-reference.html)

### State Hook

```react
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

`useState` 会返回一对值：**当前**状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 `this.setState`，但是它不会把新的 state 和旧的 state 进行合并。

```react
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

`setState`可以起不同的名字

### Effect Hook

在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。统一把这些操作称为“副作用”，或者简称为“作用”。

useEffect接收两个参数：第一个参数是一个函数，用于执行副作用操作；第二个参数是一个依赖项数组，用于控制何时执行副作用操作。如果依赖项数组为空，则副作用操作只在组件挂载和卸载时执行；如果依赖项数组为空数组，这样 useEffect 就只会在组件挂载时运行一次，不会在组件更新时再次运行；如果依赖项数组不为空，则副作用操作在组件挂载、依赖项发生变化和组件卸载时执行。

`useEffect`给函数组件增加了操作副作用的能力（例如访问API、修改DOM、订阅事件等。它类似于类组件中的生命周期方法，但是更加灵活和易于使用。）。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

```react
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    // `componentDidMount`+`componentDidUpdate`
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

副作用函数还可以通过返回一个函数来指定如何“清除”副作用。例如，在下面的组件中使用副作用函数来订阅好友的在线状态，并通过取消订阅来进行清除操作：

```react
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    // `componentDidMount`+`componentDidUpdate`
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      // `componentWillUnmount`
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

跟 `useState` 一样，你可以在组件中多次使用 `useEffect`

> `useEffect(() => {}, [])`
>
> 传入空的依赖数组 `[]`，意味着该 hook 只在组件挂载时运行一次，并非重新渲染时       

> **useEffect执行两次**
>
> 这是React18新增特性，仅在开发模式且使用严格模式才会这样。生产环境还是只有一次。之所以执行两次，是为了模拟立即卸载组件和重新挂载组件，来帮助开发者提前发现重复挂载造成的bug。
>
> **解决：**
>
> 1. 删除index.js中<React.StrictMode>，即去掉严格模式
>
> 2. 在设置的参数的`useEffect`中加非空判断
> 3. 把初始化放到`useReducer`里面

### useReducer

当我们在React中使用`useReducer`这个hooks时，它提供了一种管理复杂状态逻辑的方式。它可以用来替代`useState`，特别适合处理具有多个相互关联的状态的情况。

`useReducer`接收两个参数：reducer函数和初始状态。`reducer`函数接收两个参数：当前状态和一个操作（action），并返回一个新的状态。它的作用是根据操作类型来更新状态。

下面是一个使用`useReducer`的示例：

 ```jsx
 import React, { useReducer } from 'react';
 
 const initialState = { count: 0 };
 
 function reducer(state, action) {
   switch (action.type) {
     case 'increment':
       return { count: state.count + 1 };
     case 'decrement':
       return { count: state.count - 1 };
     default:
       throw new Error();
   }
 }
 
 function Counter() {
   const [state, dispatch] = useReducer(reducer, initialState);
 
   return (
     <div>
       Count: {state.count}
       <button onClick={() => dispatch({ type: 'increment' })}>+</button>
       <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
     </div>
   );
 }
 
 ```

在上面的示例中，我们定义了一个简单的计数器组件。初始状态为`{ count: 0 }`，并定义了一个`reducer`函数来处理状态的更新。当点击加号按钮时，会派发一个`{ type: 'increment' }`的操作给`dispatch`函数，从而触发状态的更新。

使用`useReducer` hooks的好处是它可以帮助我们将状态和更新逻辑分离出来，使代码更加清晰和可维护。它也可以用于处理复杂的状态转换逻辑，例如在表单处理、数据获取和异步操作等方面。

> Q：使用普通函数处理和使用useReducer有什么区别
>
> A：
>
> ```jsx
> import React, { useState } from 'react';
> 
> function Counter() {
>   const [count, setCount] = useState(0);
> 
>   const increment = () => {
>     setCount(count + 1);
>   };
> 
>   const decrement = () => {
>     setCount(count - 1);
>   };
> 
>   return (
>     <div>
>       Count: {count}
>       <button onClick={increment}>+</button>
>       <button onClick={decrement}>-</button>
>     </div>
>   );
> }
> 
> ```
>
> 使用`useState`的方式非常简单和直观，我们只需要定义一个状态变量`count`和两个更新函数`increment`和`decrement`。但是当状态逻辑变得复杂时，我们可能需要处理更多的状态和操作，这时使用`useState`可能会导致代码变得冗长和难以维护。
>
> 相比之下，`useReducer`提供了一种更优雅的方式来处理复杂状态逻辑。它将状态和操作逻辑封装在一个reducer函数中，通过派发操作（action）来触发状态的更新。这种方式使得代码更加结构化和可扩展，特别适用于处理具有多个相互关联的状态的情况。
>
> 使用`useReducer`的一些优势包括：
>
> - 代码结构清晰：将状态和操作逻辑封装在一个reducer函数中，使代码更加模块化和易于理解。
> - 可维护性高：当状态逻辑变得复杂时，使用`useReducer`可以更好地组织代码，使其易于扩展和维护。
> - 更好的性能：由于`useReducer`的更新是基于操作类型而不是具体的值，它可以避免一些不必要的重渲染。
>
> 总之，使用`useReducer`可以将复杂的状态逻辑更好地组织起来，并提供更好的可读性和可维护性。但对于简单的状态更新逻辑，使用`useState`可能更加简洁和直观。选择使用哪个取决于具体的情况和个人偏好。

### Hook使用规则

Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中。）

### 自定义Hook

前面，我们介绍了一个叫 `FriendStatus` 的组件，它通过调用 `useState` 和 `useEffect` 的 Hook 来订阅一个好友的在线状态。假设我们想在另一个组件里重用这个订阅逻辑。

首先，我们把这个逻辑抽取到一个叫做 `useFriendStatus` 的自定义 Hook 里：

```react
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {  
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

它将 `friendID` 作为参数，并返回该好友是否在线：

现在我们可以在两个组件中使用它：

```react
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}


function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);
  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

这两个组件的 state 是完全独立的。Hook 是一种复用*状态逻辑*的方式，它不复用 state 本身。事实上 Hook 的每次*调用*都有一个完全独立的 state —— 因此你可以在单个组件中多次调用同一个自定义 Hook。



自定义 Hook 更像是一种约定而不是功能。如果函数的名字以 “`use`” 开头并调用其他 Hook，我们就说这是一个自定义 Hook。 `useSomething` 的命名约定可以让我们的 linter 插件在使用 Hook 的代码中找到 bug。

### 其他Hook

#### useRef

React的useRef是一个Hook函数，它可以用来创建一个可变的引用，类似于在类组件中使用的this.refs。useRef返回一个对象，该对象包含一个current属性，该属性可以存储任何值，并且在组件的整个生命周期中保持不变。

useRef的主要作用是在函数组件中保存和访问DOM节点或其他组件实例。它可以用来：

1. 获取DOM节点的引用，以便在需要时对其进行操作，例如设置焦点或滚动位置。
2. 在组件之间共享数据，例如在父组件和子组件之间传递数据。
3. 在组件的生命周期中存储和访问变量，例如计时器或动画的状态。

使用useRef非常简单，只需要在函数组件中调用它即可：

```react
import React, { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(null);

  // 在组件挂载后，将焦点设置到myRef所引用的DOM节点上
  useEffect(() => {
    myRef.current.focus();
  }, []);

  return (
    <div>
      <input type="text" ref={myRef} />
    </div>
  );
}
```

在上面的例子中，我们创建了一个名为myRef的引用，并将其传递给一个input元素的ref属性。在组件挂载后，我们使用useEffect钩子函数将焦点设置到myRef所引用的DOM节点上。

> useRef和Vue中的ref有些相似。在Vue中，ref可以用来获取DOM节点的引用，也可以用来在组件之间共享数据。在React中，useRef也可以用来获取DOM节点的引用，也可以用来在组件之间共享数据。
>
> 不过，Vue中的ref还可以用来获取子组件实例的引用，而在React中，可以使用React.forwardRef来获取子组件实例的引用。另外，Vue中的ref可以是一个字符串或一个函数，而在React中，useRef只能是一个函数。
>
> 总的来说，useRef和Vue中的ref有些相似，但也有一些不同之处。

#### useLayoutEffect

与useEffect非常相似，但是它会在DOM更新之前同步执行，而不是在DOM更新之后异步执行。

useLayoutEffect的作用是在DOM更新之前同步执行一些操作，例如获取DOM元素的尺寸、位置等信息，然后根据这些信息进行一些计算或者操作。这样可以避免在DOM更新之后再进行一次渲染，提高性能。

使用方法与useEffect类似，只需要传入一个回调函数即可。例如：

```react
import { useLayoutEffect } from 'react';

function MyComponent() {
  useLayoutEffect(() => {
    // 在DOM更新之前同步执行的操作
  }, [依赖项]);
  // ...
}
```

与useEffect的区别在于，useEffect是在DOM更新之后异步执行的，而useLayoutEffect是在DOM更新之前同步执行的。因此，如果需要在DOM更新之前同步执行一些操作，就应该使用useLayoutEffect。但是需要注意的是，由于useLayoutEffect是同步执行的，如果操作过于耗时，可能会导致页面卡顿。因此，需要谨慎使用。

另外，useLayoutEffect的使用场景比较特殊，一般只有在需要获取DOM元素的尺寸、位置等信息时才会用到。如果没有这种需求，一般情况下使用useEffect即可。

#### useMemo

在需要进行大量计算或者复杂操作的场景下使用，可以避免不必要的重复计算，提高性能。例如：

1. 对于一些需要进行复杂计算的数据，可以使用useMemo进行缓存，避免每次重新计算。
2. 对于一些需要进行大量数据处理的组件，可以使用useMemo进行优化，避免每次重新渲染时都进行数据处理。
3. 对于一些需要进行条件渲染的组件，可以使用useMemo进行优化，避免每次重新渲染时都进行条件判断。

总之，当需要进行复杂计算或者数据处理时，可以考虑使用useMemo进行优化，提高性能。

> 类似于Vue中的计算属性。在React中，useMemo接收一个函数和一个依赖数组作为参数，函数返回的值会被缓存起来，只有依赖数组中的值发生变化时，才会重新计算。这与Vue中的计算属性类似，计算属性也是根据依赖的数据进行计算，只有依赖的数据发生变化时，才会重新计算。
>
> 因此，可以将useMemo看作是React中的计算属性，用来优化组件的性能。



#### useCallback

在React中，每当组件重新渲染时，所有的函数都会重新创建。这意味着，如果一个函数被频繁地创建和销毁，会对性能产生负面影响。

为了避免这种情况，React提供了useCallback钩子。useCallback可以缓存一个函数，并在依赖项发生变化时，返回缓存的函数。这样，就可以避免函数的重复创建和销毁，提高性能。

下面是一些使用useCallback的场景：

1. 将一个函数作为props传递给子组件时，可以使用useCallback来避免子组件不必要的重新渲染。例如：

```react
const MyComponent = ({ onClick }) => {
  return <button onClick={onClick}>Click me</button>;
};

const ParentComponent = () => {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return <MyComponent onClick={handleClick} />;
};
```

在这个例子中，handleClick函数被缓存，并作为props传递给了MyComponent组件。由于handleClick没有依赖项，它只会在组件挂载时被创建一次。

2. 当需要在依赖项发生变化时，避免函数重新创建，可以使用useCallback来缓存函数。例如：

```react
const ParentComponent = ({ count }) => {
  const handleClick = useCallback(() => {
    console.log(`Button clicked ${count} times`);
  }, [count]);

  return <button onClick={handleClick}>Click me</button>;
};
```

在这个例子中，handleClick函数被缓存，并且依赖于count变量。每当count变量发生变化时，handleClick函数会被重新创建。

3. 当需要在使用useEffect时，避免函数作为依赖项时，可以使用useCallback来缓存函数。例如：

```react
const ParentComponent = ({ count }) => {
  const handleClick = useCallback(() => {
    console.log(`Button clicked ${count} times`);
  }, [count]);

  useEffect(() => {
    console.log('Component mounted');
  }, [handleClick]);

  return <button onClick={handleClick}>Click me</button>;
};
```

在这个例子中，handleClick函数被缓存，并作为useEffect的依赖项。由于handleClick函数不会在每次重新渲染时重新创建，因此可以避免useEffect的不必要调用。

总之，当需要缓存函数以提高性能时，可以使用useCallback。

#### useContext

让你不使用组件嵌套就可以订阅 React 的 Context。

> useContext和Vue的provide和inject功能类似，都可以用于在组件之间共享数据。在React中，useContext是通过Context对象来实现数据共享的，而在Vue中，provide和inject是通过provide/inject选项来实现数据共享的。两者的实现方式不同，但都可以达到相同的目的。

React的useContext可以用于在组件之间共享数据，避免了通过props层层传递数据的繁琐过程。使用useContext需要先创建一个Context对象，然后在需要共享数据的组件中使用useContext来获取Context对象中的数据。

**需要注意的是，useContext只能用在函数组件或自定义Hook中，而不能用在类组件中。**

具体使用步骤如下：

1. 创建一个Context对象

```javascript
const MyContext = React.createContext(defaultValue);
```

其中defaultValue是可选的，表示当没有匹配到Provider时的默认值。

2. 在需要共享数据的组件中使用useContext获取Context对象中的数据

```javascript
const myData = useContext(MyContext);
```

其中MyContext是上一步创建的Context对象。

3. 在需要提供数据的组件中使用Provider提供数据

```javascript
<MyContext.Provider value={myData}>
  <ChildComponent />
</MyContext.Provider>
```

其中value是需要共享的数据，ChildComponent是需要共享数据的组件。

完整示例代码如下：

```javascript
import React, { useContext } from 'react';

const MyContext = React.createContext('default value');

function ParentComponent() {
  return (
    <MyContext.Provider value="hello world">
      <ChildComponent />
    </MyContext.Provider>
  );
}

function ChildComponent() {
  const myData = useContext(MyContext);
  return <div>{myData}</div>;
}

export default ParentComponent;
```

在上面的示例中，ParentComponent提供了一个MyContext.Provider，将数据"hello world"提供给了ChildComponent。ChildComponent中使用useContext获取了MyContext中的数据，并将其渲染到了页面上。

#### useId

它可以用来生成唯一的 ID。

#### useSyncExternalStore

用于在组件之间共享状态。

使用useSyncExternalStore Hook，我们可以将状态存储在外部存储中，并在多个组件之间共享。下面是一个使用useSyncExternalStore Hook的示例：

```jsx
import React, { useSyncExternalStore } from 'react';

function App() {
  const [count, setCount] = useSyncExternalStore('count', 0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default App;
```

在这个示例中，我们使用了useSyncExternalStore Hook来创建一个名为'count'的外部存储，并将其初始化为0。然后，我们在组件中使用这个存储来存储和更新计数器的值。当我们在一个组件中更新计数器的值时，其他使用相同外部存储的组件也会自动更新。

需要注意的是，useSyncExternalStore Hook是React 18中新增的API，需要在React 18及以上版本中使用。

#### useTransition

useTransition是React的一个Hook，用于在UI中实现平滑的过渡效果。它的作用是在组件状态发生变化时，让UI过渡更加平滑，避免出现突兀的变化。

`const [isPending, startTransition] = useTransition(suspenseConfig)`

**suspenseConfig**：

- startTransition：用于启动过渡。当调用startTransition时，React将会暂停渲染，直到过渡完成或超时。

- suspenseConfig.timeoutMs：用于设置过渡的超时时间。如果过渡时间超过了这个时间，React将会中止过渡并抛出一个错误。

- suspenseConfig.busyDelayMs：用于设置过渡的延迟时间。在过渡开始之前，React将会等待这个时间，以确保过渡不会太快而导致闪烁。

useTransition的用法如下：

```jsx
const [isPending, startTransition] = useTransition({
  timeoutMs: 3000,
});

function handleClick() {
  startTransition(() => {
    setIsPending(true);
    // 执行一些异步操作
    setIsPending(false);
  });
}

return (
  <div>
    <button onClick={handleClick}>开始过渡</button>
    {isPending ? <Spinner /> : <Content />}
  </div>
);
```

在上面的例子中，我们使用useTransition创建了一个isPending状态和一个startTransition函数。当用户点击按钮时，我们调用startTransition函数，并在回调函数中执行一些异步操作。在这个过程中，isPending状态会变为true，显示一个Spinner组件，等待异步操作完成后，isPending状态会变为false，显示Content组件。

useTransition的参数是一个对象，其中timeoutMs表示过渡的时间，单位是毫秒。在过渡期间，React会暂停渲染，直到过渡完成。这样可以避免出现闪烁或者卡顿的情况。

## vite+react+TS

### 搭建

安装

```bash
# 局部
npm i -D vite
# 全局
npm i -g vite
```

使用

```bash
npm/yarn/pnpm create vite@latest
# 你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Vite + Vue 项目，使用ts需要改为vue-ts运行:
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue

cd <project-name>
npm install
npm run dev
```

> 查看 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 以获取每个模板的更多细节：`vanilla`，`vanilla-ts`, `vue`, `vue-ts`，`react`，`react-ts`，`react-swc`，`react-swc-ts`，`preact`，`preact-ts`，`lit`，`lit-ts`，`svelte`，`svelte-ts`。

### 初始化

#### Typescript配置

```bash
pnpm add -D @types/node
```

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  }
}
```



#### vite配置

```tsx
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// import { visualizer } from 'rollup-plugin-visualizer' // vite打包分析插件,需要install

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // vite配置文件使用env
  
  // 全局变量
  const define = {}
  if (mode !== 'development') define['process.platform'] = 'win32'
  else define['process.env'] = process.env
  
  return defineConfig({
    base: env.VITE_APP_BASE_URL, // 需要.env文件
    define,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    /** https://cn.vitejs.dev/config/build-options.html */
    build: {
      terserOptions: {
        compress: {
          drop_console: true, // 构建时删除调用console
          drop_debugger: true // 构建时删除调用debugger
        }
      },
      minify: 'terser',
      cssCodeSplit: true, // 启用/禁用 CSS 代码拆分
      assetsInlineLimit: 1024 * 1, // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
    },
    plugins: [
      react()，
      /* stats.html */
      // visualizer()
    ],
  })
}

```



#### normalize.css

```bash
pnpm add normalize.css
```

```tsx
// main.tsx
import 'normalize.css'
```



#### saas

> Vite 对 .scss, .sass, .less, .styl 和 .stylus 文件提供了内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖。



## 推荐库

### Classnames-一个简单的支持动态多类名的工具库

```bash
npm install classnames --save

# import classnames from 'classnames'
```

**使用**

```jsx
classNames('foo', { bar: true }); // => 'foo bar'

classNames({ 'foo-bar': true }); // => 'foo-bar'

classNames({ 'foo-bar': false }); // => ''

classNames({ foo: true }, { bar: true }); // => 'foo bar'

classNames({ foo: true, bar: true }); // => 'foo bar'

// lots of arguments of various types

classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// other falsy values are just ignored

classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

**数组方式**

```js
var arr = ['b', { c: true, d: false }];

classNames('a', arr); // => 'a b c'
```

**ES6中使用动态类名**

```bash
let buttonType = 'primary';`

classNames({ [`btn-${buttonType}`]: true });
```



### `assembly-css`基础样式库



## 其他

### vsCode输入html不能补全

在设置中搜索`emmet:include languages`，添加一项`"javascript": "javascriptreact"`

### 为什么写React组件的时候，需要先引入React？

在react 老版本中 因为 jsx 在被 babel 编译后，会使用React.createElement ，所以需要引入 React，防止找不到 React 引起报错。新版编译后做了处理，所以不用再引入了

### 函数组件和class组件的区别

**函数组件**

* 称为**函数式编程**
* **无状态**的,每一次更新数据都会重新调用函数,生成新的函数执行上下文。在hook出现之前,函数组件大都只能用来当作纯展示组件,因为它内部**没有存储状态(state),没有生命周期,并且逻辑不能复用**

**class组件**

* 称为**面向对象编程**
* 有状态,有自己的生命周期

### [使用 PropTypes 进行类型检查 – React (docschina.org)](https://react.docschina.org/docs/typechecking-with-proptypes.html)

> 自 React v15.5 起，`React.PropTypes` 已移入另一个包中。请使用 [`prop-types` 库](https://www.npmjs.com/package/prop-types) 代替。
>
> 我们提供了一个 [codemod 脚本](https://react.docschina.org/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes)来做自动转换。

```bash
npm i prop-types
```

