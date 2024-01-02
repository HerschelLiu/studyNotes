以 vite 生成项目为例

## 开始

```bash
npm install react-router-dom localforage match-sorter sort-by
```

### 添加路由

`src/router/constant/`存放404页面、登录页面等固定且无权限的公用

`src/views/constant/Page404/index.tsx`

```tsx
import { Layout, Empty } from 'antd'
import { useRouteError } from 'react-router-dom'

const { Content } = Layout

const Page404: React.FC = () => {
  const error = useRouteError()
  console.error(error)
  
  return (
    <>
      <Content>
        <Empty
          description={
            <span className="color-#54585e font-size-15px text-center">
              对不起，页面不存在或你没有权限访问此页面
            </span>
          }
        />
      </Content>
    </>
  )
}

export default Page404

```





`src/router/index.tsx`

```ts
import type { RouteObject } from 'react-router-dom'

import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Page404 from '@/views/constant/Page404'

const constantFiles: any = import.meta.glob(['./constant/*.ts', './constant/*.tsx'], { eager: true })
const constantModules: RouteObject[] = Object.keys(constantFiles).map((key: any) => {
  return constantFiles[key].default
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Page404 />
  }
])

export default router

```

`src/main.tsx`

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'

createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
)

```

