## VUE

`npm i clipboard`

[https://clipboardjs.com](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

```tsx
import Clipboard from 'clipboard'

import { useError, useSuccess } from '@/hooks/useTip'

/** 复制成功回调 */
export function clipboardSuccess() {
  useSuccess('复制成功')
}

/** 复制失败回调 */
export function clipboardError() {
  useError('复制失败，当前浏览器不支持')
}

/** 复制到粘贴版 */
export function handleClipboard(text: string, event: MouseEvent) {
  const clipboard = new Clipboard(event.target as Element, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  ;(clipboard as any).onClick(event)
}

```

