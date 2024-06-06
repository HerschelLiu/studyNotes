以2.4.9为例

## 添加外部编辑器

在设置->数据编辑中添加外部脚本编辑器，即添加 vscode。在3.x 版本还可以添加安卓sdk、微信开发工具等

# 练习

微信小游戏飞机大战

### 背景

1. 资源管理器中 assets 下创建固定名称`resources`的文件夹用以保存资源
2. 点击`Cabvas`节点，在右侧`Canvas`中，设置`Design Resolution`设置为480x800
3. 将`background.png`移入节点，并再复制出一份，分别命名为`background1`、`background2`
   1. `background1`放在(240， 410)位置
   2. 在`background1`下创建空节点，起名为`bg`,在把空节点移到最外层。为什么不在最外边创建空节点？因为这样原点位置在左下角，在`background1`下创建空节点，原点就在中间
   3. 将两个背景节点移动到`bg`中层级按照顺序
   4. `background2`设置位置为(0, 852)，因为图片高852
4. 资源管理器中 assets 下新建`Script`文件夹
5. 在`Script`中新建 ts 文件，命名为`BgContral`,来编写背景的脚本。点击`bg`这个空节点，然后把该文件拖动到右侧的属性检查器上

```ts
// BgControl

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class BgControl extends cc.Component {
  start() {}

  /**
   * @param {number} dt 两帧之间的间隔,浮点数
   */
  update(dt: number) {
    // 移动
    // 遍历子物体（背景）
    for (const bgNode of this.node.children) {
      // 每一帧改为每秒移动，统一设备
      bgNode.y -= 50 * dt
      if (bgNode.y <= -bgNode.height) {
        bgNode.y += bgNode.height * 2
      }
    }
  }
}

```



6. 拖动玩家飞机图片到层级管理器，重命名为`player`,设置位置为(240, 123)
7. 创建``PlayerContral`ts 文件，移动到 player 上（同上）

```ts
// PlayerContral
```

