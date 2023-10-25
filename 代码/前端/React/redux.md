## 开始

[React-Redux](https://www.reduxjs.cn/tutorials/essentials/part-1-overview-concepts#react-redux)

Redux 可以集成到任何的 UI 框架中，其中最常见的是 React 。[**React-Redux**](https://react-redux.js.org/) 是我们的官方包，它可以让 React 组件访问 state 片段和 dispatch actions 更新 store，从而同 Redux 集成起来。

[**Redux Toolkit**](https://redux-toolkit.js.org/) 是我们推荐的编写 Redux 逻辑的方法。 它包含我们认为对于构建 Redux 应用程序必不可少的包和函数。 Redux Toolkit 构建是我们建议的最佳实践中，简化了大多数 Redux 任务，预防了常见错误，并使编写 Redux 应用程序变得更加容易。

```bash
pnpm add react-redux @reduxjs/toolkit
```

由于 Redux Toolkit 依赖于redux`、`redux-thunk` 和 `reselect，所以它们会在安装 `@reduxjs/toolkit` 时自动被安装，因此我们不需要在 `package.json` 文件中专门列出其他包。

```
|- src
	|- store
		|- index.ts
		|- xxx.ts // reducer
```



```tsx
// store/user.ts

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: 'user',
  token: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // (state, action) => {}
    setToken: (state, { type, payload }) => {
      console.log(type) // user/setToken，使用createSlice的话，type是slice的name/reducer的name

      state.token = payload
    }
  }
})

export const { setToken } = userSlice.actions

export default userSlice.reducer

```



```tsx
// store/index.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user'
import xxxReducer from 'xxx'

export default configureStore({
  reducer: {
    user: userReducer,
    xxx: xxxReducer
  }
})
```



```tsx
// main.tsx React18之前

import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from '@/store'
// ...

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
```

```tsx
// main.tsx React18

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from '@/store'
// ...

createRoot(document.querySelector('#root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

**使用**

```tsx
// src/views/xxx.tsx

import { setToken } from '@/store/user'
import { useSelector, useDispatch } from 'react-redux'

const Container: React.FC = () => {
  const token = useSelector((state: any) => state.user.token)
  const dispatch = useDispatch()
  
  const handleSetToken = () => {
    dispatch(setToken(+new Date()))
  }
  
  return (
  	<>
      <div>
        <button onClick={handleSetToken}>setToken</button>
        token: { token }
      </div>
    </>
  )
}

export default Container
```

## createSlice

`createSlice` 允许我们通过向 reducer 添加“准备回调”函数来处理这些情况。我们可以传递一个具有名为 `reducer` 和 `prepare` 这两个函数的对象。当我们调用生成的 action creator 时，“准备回调”函数会使用传入的任何参数被调用。然后它应该创建并返回一个具有 payload 字段（或者，可选的 meta 和 error 字段）的对象，符合 [Flux Standard Action 约定](https://www.reduxjs.cn/tutorials/fundamentals/part-7-standard-patterns#flux-standard-actions)。

```ts
// store/user.ts
...
const userSlice = createSlice({
  ...
  reducers: {
    ...,
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    ...
  }
})

...
```

`prepare`用于将todoColorSelected传入的多个值合成一个

**reducer类似于vuex中的mutations，只能使用同步的方法**

## `createAsyncThunk`与`extraReducers`

> **`createAsyncThunk`和Vuex中的actions在某种程度上是类似的，它们都用于处理异步操作并触发相应的状态更新。**
>
> 不同之处：
>
> 1. `createAsyncThunk`生成的action creators自动处理了异步操作的不同状态（pending, fulfilled, rejected），并将相应的状态和结果数据作为payload传递给reducer函数。这样可以更方便地在reducer中处理异步操作的不同情况。
> 2. `createAsyncThunk`可以方便地处理多个异步操作，并自动生成对应的action creators和reducers。它的语法较为简洁，不需要手动编写多个action和reducer。
> 3. `createAsyncThunk`还可以通过配置选项来定制异步操作的行为，例如设置请求超时时间、自定义请求错误处理等。

**`createAsyncThunk`**是Redux Toolkit提供的一个函数，用于创建处理异步操作的thunk。Thunk是一个函数，用于在Redux中处理副作用和异步操作。`createAsyncThunk`让我们能够更方便地定义异步操作，并自动生成相应的action creators和reducers。会自动生成三个action creators：`pending`、`fulfilled`和`rejected`，分别对应异步操作的不同状态。

- `pending`：表示异步操作正在进行中。
- `fulfilled`：表示异步操作已成功完成，并返回了结果数据。
- `rejected`：表示异步操作失败。

`createAsyncThunk` 接收 2 个参数:

- 将用作生成的 action 类型的前缀的字符串
- 一个 “payload creator” 回调函数，它应该返回一个包含一些数据的 `Promise`，或者一个被拒绝的带有错误的 `Promise`

```tsx
// store/user.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  data: [], 
  loading: false, 
  error: null
}

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`)
    return response.data
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}
  }
})

export const { xxx } = userSlice.actions

export default userSlice.reducer

```

同样是使用`useDispatch`调用

**`extraReducers`**是Redux Toolkit中`createSlice`函数的一个配置选项，用于定义额外的reducer逻辑。通过`extraReducers`，我们可以在一个地方集中定义多个action对应的reducer逻辑，从而简化reducer的编写。

`extraReducers`接受一个回调函数，该函数会接收一个`builder`对象作为参数。我们可以使用`builder`对象的方法来定义不同action对应的reducer逻辑。

`builder`对象提供了一系列方法，用于定义不同action对应的reducer逻辑，常用的方法有：

- `addCase(action, reducer)`：定义某个具体的action对应的reducer逻辑。
- `addMatcher(matcher, reducer)`：定义匹配多个action的reducer逻辑。
- `addDefaultCase(reducer)`：定义默认的reducer逻辑，当没有匹配到其他action时会执行。

```tsx
// store/user.ts

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    increment: (state) => state.count + 1,
    decrement: (state) => state.count - 1,
  },
  extraReducers: builder => {
    builder
      .addCase(someAction, (state, action) => {
        // 处理 someAction 对应的逻辑
      })
      .addMatcher(matcher, (state, action) => {
        // 处理匹配到的多个action 对应的逻辑
      })
      .addDefaultCase((state, action) => {
        // 处理默认的逻辑
      })
  }
})

export const { increment, decrement } = userSlice.actions

export default userSlice.reducer
```

将二者结合后，可以完成调用接口以及根据不同状态完成相应状态处理

```tsx
// store/user.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  data: [], 
  loading: false, 
  error: undefined
}

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`)
    return response.data
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}
  extraReducers: builder => {
  	builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
	}
})

export const { xxx } = userSlice.actions

export default userSlice.reducer

```



## `useSelector`与记忆化的 Selector 函数

`useSelector` *总会* 返回一个新的数组，所以 *每次* 执行以上操作我们的组件都将重新渲染，即使返回的数据并没有发生改变！

`createSelector` 将一个或多个“输入 selector ”函数作为参数，外加一个“输出 selector ”函数。 当我们调用 `selectPostsByUser(state, userId)` 时，`createSelector` 会将所有参数传递给每个输入 selector 。无论这些输入 selector 返回什么，都将成为输出 selector 的参数。

```ts
...
initialState: {
  posts: [{ id: '' }],
  userId: ''
}
...

export const selectAllPosts = state => state.posts

export const selectPostById = (state, postId) =>
  state.posts.find(post => post.id === postId)

// before

// views/xxx.tsx
/* 获取userId */
const user = useSelector(state => selectPostById(state, userId))

const postsForUser = useSelector(state => {
  const allPosts = selectAllPosts(state)
  return allPosts.filter(post => post.id === userId)
})

// after

// store/xxx.ts

import { createSelector } from '@reduxjs/toolkit'
                            
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId], // 数组或单一项
  (posts, userId) => posts.filter(post => post.id === userId)
)

// viewx/xxx.tsx
const postsForUser = useSelector(state => selectPostsByUser(state, userId))
```



## 归一化State与`createEntityAdapter`

在Redux中，归一化（Normalization）是一种处理数据的方法，用于将具有关联关系的数据拆分为多个实体，并使用唯一的ID进行引用。而`createEntityAdapter`是Redux Toolkit提供的一个工具函数，用于简化和管理归一化的数据状态。

```tsx
// 归一化前的state结构
const state = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
  posts: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 2 },
    { id: 3, title: 'Post 3', userId: 1 },
  ],
};

// 归一化后的state结构
const state = {
  users: {
    byId: {
      1: { id: 1, name: 'Alice' },
      2: { id: 2, name: 'Bob' },
    },
    allIds: [1, 2],
  },
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', userId: 1 },
      2: { id: 2, title: 'Post 2', userId: 2 },
      3: { id: 3, title: 'Post 3', userId: 1 },
    },
    allIds: [1, 2, 3],
  },
};

```

通过归一化，我们将`users`和`posts`拆分为两个实体，并使用`byId`对象存储每个实体的数据，使用`allIds`数组存储所有实体的ID。

**使用' createEntityAdapter '管理范式化 state**

`createEntityAdapter`是Redux Toolkit提供的一个工具函数，用于简化和管理归一化的数据状态。它提供了一组方法来处理和操作实体数据。

好处：

- 我们不必自己编写代码来管理范式化
- `createEntityAdapter` 的预构建 reducer 函数处理一些常见的情况，例如“添加所有项”、“更新项”或“删除多个项”
- `createEntityAdapter` 可以基于项的内容将 ID 保持在排序的数组中，并且仅在添加/删除项或排序规则更改时才更新该数组。

```tsx
// store/user.ts
import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit'

const userAdapter = createEntityAdapter()
const initialState = userAdapter.getInitialState([
  {
    id: -1,
    name: 'init'
  }
])

const userSlice = createSlice({
  name: 'user',
  initialState, // 需要数据为数组，如果是对象的话，还没搞懂
  reducers: {
    addUser: (state, action) => {
      userAdapter.addOne(state, {
        id: action.payload.id,
        name: action.payload.name
      })
    }
  }
})

export const { xxx } = userSlice.actions

export default userSlice.reducer

export const { selectAll, selectById, selectIds } = userAdapter.getSelectors((state: any) => state)
export const selectUsers = createSelector(selectAll, state => state)
export const selectUsersIds = createSelector(selectIds, state => state)
export const selectUserById = createSelector(selectById, state => state)

```

```tsx
// src/views/xxx.tsx

import { useState } from 'react'
import { addUser, selectAll, selectById, selectIds, selectUsers, selectUserById, selectUsersIds } from '@/store/user'
import { useSelector, useDispatch } from 'react-redux'

const Container: React.FC = () => {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch()

  const handleClick = () => {
    setCount(count => count + 1)
    dispatch(addUser({id: count, name: `item ${count}`}))
  }
  // 直接使用useSelector
  const user = useSelector((state: any) => selectAll(state.user))
  const userIds = useSelector((state: any) => selectIds(state.user))
  const UserById = ({ id }: { id: number }) => {
    const userById = useSelector((state: any) => selectById(state.user, id))

    if (userById) {
      return (<div>id: {userById.id},name: { userById.name }</div>)
    }

    return null
  }
  
  // 使用记忆化Selector
  const users = useSelector((state: any) => selectUsers(state.user))
  const userIds = useSelector((state: any) => selectUsersIds(state.user))
  const UserById = ({ id }: { id: number }) => {
    const userById = useSelector((state: any) => selectUserById(state.user, id))

    if (userById) {
      return (<div>id: {userById.id},name: { userById.name }</div>)
    }

    return null
  }
  
  return (
    <>
      <div>
        <button onClick={handleClick}>add</button>
      	<div>{ userIds.join(',') }</div>
        <ul>
          {
            user.map((item: any) => 
              (<li key={item.id}>
                {item.id}: {item.name}
                 <UserById key={item.id} id={item.id} />
              </li>))
          }
        </ul>
      </div>
    </>
  )
}

export default Container
```



`createEntityAdapter` 接受一个选项对象，该对象可能包含一个 `sortComparer` 函数，该函数将用于通过比较两个项目来保持项目 id 数组的排序(工作方式与 `array.sort()` 相同)。

**`createEntityAdapter` 还会生成一些用于从 store 中读取值的记忆化 selectors**。

调用 `createEntityAdapter` 会为我们返回一个“适配器”对象，其中包含几个预置的 reducer 函数，包括：

- `addOne` / `addMany`：向 state 添加新 items
- `upsertOne` / `upsertMany`：添加新 items 或更新现有 items
- `updateOne` / `updateMany`：通过提供部分值更新现有 items
- `removeOne` / `removeMany`：根据 ID 删除 items
- `setAll`：替换所有现有 items

我们可以将这些函数用作 case reducers，或用作 `createSlice` 内部的“突变助手”（mutating helpers）。

该适配器还包含：

- `getInitialState`：返回一个类似于 `{ ids: [], entities: {} }` 的对象，用于存储 item 的标准化 state 以及包含所有 item ID 的数组
- `getSelectors`：生成一组标准的 selector 函数



1. `selectAll`：`selectAll`是一个选择器函数，用于从实体状态中选择所有的实体数据。它接受一个参数，即完整的实体状态对象，返回一个数组，包含实体状态中所有的实体数据。例如，`selectAllUsers(state)`将返回一个包含所有用户数据的数组。
2. `selectById`：`selectById`是一个选择器函数，用于根据实体的ID从实体状态中选择指定的实体数据。它接受两个参数，即完整的实体状态对象和实体的ID，返回一个包含指定ID的实体数据。例如，`selectUserById(state, userId)`将返回一个包含指定ID用户数据的对象。
3. `selectIds`：`selectIds`是一个选择器函数，用于从实体状态中选择所有实体的ID。它接受一个参数，即完整的实体状态对象，返回一个数组，包含实体状态中所有实体的ID。例如，`selectUserIds(state)`将返回一个包含所有用户ID的数组。
