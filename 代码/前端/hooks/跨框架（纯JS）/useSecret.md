`npm i jsencrypt`

[http://www.travistidwell.com/jsencrypt](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

```ts
import JSEncrypt from 'jsencrypt'

/**
 * @description RSA 加密
 * @str 加密字符串
 * @key 秘钥
 * */
export function useSecret(str: string, key: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(key)
  return String(encryptor.encrypt(str))
}

/**
 * @description RSA 解密
 * @str 解密字符串
 * @key 秘钥
 * */
export function useDeSecret(str: string, key: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(key)
  return String(encryptor.decrypt(str))
}

```

