```tsx
/* eslint-disable no-console */

/** 有样式的打印 */
export function useLog(title: string, info: string | undefined) {
  if (import.meta.env.DEV) {
    console.log(
      `%c${title}%c${info || ''}`,
      'background-color: #43bb88; color: #ffffff; padding: .2em 0.5em; border-radius: 3px 0 0 3px;',
      'background-color: #f47920; color: #ffffff; padding: .2em 0.5em; border-radius: 0 3px 3px 0;'
    )
  }
}

```

