```ts
import abilityAccessCtrl, { Permissions } from '@ohos.abilityAccessCtrl';
import bundleManager from '@ohos.bundle.bundleManager';

const accessAuth = async(permissionName: Permissions, message?: string) => {
  const atManager = abilityAccessCtrl.createAtManager();
  const { authResults } = await atManager.requestPermissionsFromUser(globalThis.getContext(),[permissionName])
  if(authResults[0] === -1){
    throw new Error(message ?? '未授权')
  }
  if(authResults[0] === 2){
    throw new Error('授权异常')
  }
}

export default accessAuth
```

