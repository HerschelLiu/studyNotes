

## 使用自定义cli来完成统一模板

### **初始化**

```bash
mkdir create-herschel-monorepo && cd create-herschel-monorepo
npm init -y
npm install commander degit replace-in-files ora chalk inquirer
npm install -D typescript @types/node tsup @types/degit

npx tsc --init
```

- `commander`: 用于解析命令行参数
- `degit`: 克隆模板仓库
- `replace-in-files`: 批量替换文件内容
- `ora` & `chalk`: 美化控制台输出
- `inquirer`：让用户在初始化时选择包管理工具（pnpm、npm、yarn）
- `tsup`: 打包工具



#### **`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}

```

> **`"module": "NodeNext"`**生成符合 Node.js 模块系统的代码（CommonJS 或 ES Modules）
>
> - 如果 `package.json` 中设置了 `"type": "module"`，TypeScript 会生成 ES Modules（`.mjs`）。
> - 否则生成 CommonJS 模块（`.cjs`）
>
> **`"moduleResolution": "NodeNext"`**让 TypeScript 能正确解析 `node_modules` 中的模块路径，并支持 `package.json` 的 `exports` 和 `imports` 字段。
>
>  **`"esModuleInterop": true`**允许 `import` CommonJS 模块（如 `const fs = require('fs')` 可写为 `import fs from 'fs'`）。
>
> **`"skipLibCheck": true`**跳过对声明文件（`.d.ts`）的类型检查。加快编译速度，但可能牺牲类型安全性（建议在类型依赖复杂时启用）。
>
> **`"declaration": true`**：生成 `.d.ts` 类型声明文件（适合发布库）。

####  **`tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'node16',
  banner: { js: '#!/usr/bin/env node' } // 保持 CLI 可执行性
});
```



#### **`package.json`**

```json
{
  "name": "create-herschel-project",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "engines": {
    "node": "^20.15.0"
  },
  "type": "module",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "npm run build", // 发布前自动构建
    "typecheck": "tsc --noEmit"
  },
  "bin": {
    "create-herschel-project": "dist/index.js"
  },
  "keywords": [],
  "author": "herscheliu",
  "license": "MIT",
  "description": "安装私有project",
  "dependencies": {
    "chalk": "^5.4.1",
    "commander": "^13.1.0",
    "degit": "^2.8.4",
    "execa": "^9.5.2",
    "fast-glob": "^3.3.3",
    "inquirer": "^12.5.2",
    "ora": "^8.2.0",
    "replace-in-file": "^8.3.0",
    "replace-in-files": "^3.0.0"
  },
  "devDependencies": {
    "@types/degit": "^2.8.6",
    "@types/node": "^22.14.1",
    "tsup": "^8.4.0",
    "typescript": "^5.8.3"
  }
}

```

### **目录结构**

**ts**

```lua
├── package.json
├── src
│   ├── index.ts
│   ├── types
│   │   └── index.d.ts
│   └── utils
│       ├── downloader.ts
│       ├── package.ts
│       └── prompt.ts
├── tsconfig.json
└── tsup.config.ts
```



### **功能实现**

[create-project](https://github.com/HerschelLiu/create-project)

### 本地调试

```bash
npm link #默认读取`package.json`的bin字段
create-herschel-project test
```



### **发布到 npm**

1. **登录 npm 账户**：

   ```bash
   npm login
   ```

2. **发布包**：

   ```bash
   npm publish --access public
   ```

### 使用方式

用户只需执行：

```bash
npx create-herschel-monorepo my-project
```

工具会自动完成：

1. 克隆模板仓库到 `my-project` 目录
2. 将 `%NAMESPACE%` 替换为 `@my-project`
3. （可选）自动安装依赖