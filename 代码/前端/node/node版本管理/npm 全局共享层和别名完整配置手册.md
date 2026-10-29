# npm 全局共享层 + `npm-global`：完整配置手册（macOS / Windows）

---

## 0. 概念

### 0.1 npm 的全局目录长什么样

npm 的全局目录由 `prefix` 决定，但**两个平台的结构不一样**：

|                                             | macOS / Linux                | Windows                                |
| ------------------------------------------- | ---------------------------- | -------------------------------------- |
| 可执行 shim（`npm-global`、`vue`、`sass`…） | `<prefix>/bin/`              | `<prefix>/`（根目录，没有 bin 子目录） |
| 包本体                                      | `<prefix>/lib/node_modules/` | `<prefix>/node_modules/`               |

这就是为什么：
- **macOS 要往 PATH 加两个目录**（`~/.local/bin` 放我们的脚本 + `~/.npm-global/bin` 放 npm 生成的 shim）
- **Windows 只要加一个目录**（`%USERPROFILE%\.npm-global`，脚本和 shim 都在里面）

### 0.2 PATH 是什么，加进去意味着什么

PATH 是一个用 `:`（Windows 用 `;`）分隔的目录列表。敲 `npm-global` 时，shell 按顺序在这些目录里找同名可执行文件。

- **加在开头**（`export PATH="新目录:$PATH"`）→ 优先级最高
- **加在结尾**（`export PATH="$PATH:新目录"`）→ 兜底，系统自带命令优先

本手册统一用**加在开头**，保证我们装的命令不被旧版本覆盖。

> PATH 是**进程启动时继承**的。改完配置文件，**已经开着的终端不会更新**，必须新开终端（或 `exec zsh`）。VS Code 要**整个退出重开**，只重开终端页不够。

### 0.3 这跟 fnm 有关系吗？

**没有绑定关系。** `prefix` 是 npm 自己的能力，nvm / fnm / volta / 系统 Node / Windows 全通用。

有关系的只是「默认值」：不设 `prefix` 时，npm 会把全局包装进**当前 Node 的安装目录**：

| Node 安装方式  | 不设 prefix 时的全局目录（macOS 示例）                       |
| -------------- | ------------------------------------------------------------ |
| fnm            | `~/Library/Application Support/fnm/node-versions/vX/installation/lib/node_modules` |
| nvm            | `~/.nvm/versions/node/vX/lib/node_modules`                   |
| volta          | `~/.volta/lib/node_modules`                                  |
| 官网 pkg       | `/usr/local/lib/node_modules`                                |
| Homebrew       | `/opt/homebrew/lib/node_modules`                             |
| Windows 安装包 | `%APPDATA%\npm\node_modules`                                 |

fnm/nvm 的 Node 按版本分目录 → 默认就是「每个版本一套全局包」。所以：

> **设统一 prefix = 主动放弃 fnm 的版本隔离。** 两者是相反方向，不是"必须一起用"。

---

## 1. 先选模式

| 模式                          | 做法                                         | 适合谁                                |
| ----------------------------- | -------------------------------------------- | ------------------------------------- |
| 纯版本隔离                    | 什么都不设                                   | 全局包必须跟着 Node 版本走            |
| **版本隔离 + 共享层**（推荐） | 不设 prefix，靠 `npm-global` 自带 `--prefix` | 大部分包跟版本，常用 CLI 要跨版本共用 |
| 全统一                        | `npm config set prefix`                      | 只用一两个 Node 版本                  |

本手册配置的是**第二种**：默认 `npm i -g` 走版本层，`npm-global i <pkg>` 走共享层。

---

## 2. macOS / Linux 详细步骤

### 2.1 第 1 步：确认你用的是哪个 shell 和哪个配置文件

```bash
echo "$SHELL"                 # 常见结果：/bin/zsh
ps -p $$ -o comm=             # 当前进程名：zsh
```

zsh 的启动文件不止一个，**放错文件是最常见的"配置了不生效"原因**：

| 文件          | 什么时候被读                                     | 适不适合放 PATH            |
| ------------- | ------------------------------------------------ | -------------------------- |
| `~/.zshenv`   | 每次启动 zsh 都读（包括脚本、cron）              | 最通用，但会影响非交互程序 |
| `~/.zprofile` | 登录 shell（macOS 终端每个新窗口都是登录 shell） | 可以，但不如 .zshrc 常用   |
| `~/.zshrc`    | 交互式 shell（你在终端里敲命令）                 | **推荐**，日常终端都覆盖   |
| `~/.zlogin`   | 登录 shell，在 .zshrc 之后                       | 少用                       |

**结论：日常用 → 写 `~/.zshrc`；如果希望 cron / 脚本 / GUI 程序也能找到，改写到 `~/.zshenv`。**

如果你用 **oh-my-zsh**，配置文件仍然是 `~/.zshrc`，只是里面会有一句 `source $ZSH/oh-my-zsh.sh`。**PATH 那行要加在这句之后**（文件末尾最稳），否则某些插件可能重排 PATH。

如果你设过 `ZDOTDIR`，配置文件在 `$ZDOTDIR/.zshrc`：

```bash
echo "${ZDOTDIR:-$HOME}"      # 没设置时会输出 $HOME
```

### 2.2 第 2 步：建目录

```bash
mkdir -p "$HOME/.npm-global/lib/node_modules" "$HOME/.npm-global/bin"
mkdir -p "$HOME/.local/bin"

ls -ld "$HOME/.npm-global" "$HOME/.npm-global/bin" "$HOME/.local/bin"
```

期望输出类似：

```
drwxr-xr-x  herschel  staff  /Users/herschel/.npm-global
drwxr-xr-x  herschel  staff  /Users/herschel/.npm-global/bin
drwxr-xr-x  herschel  staff  /Users/herschel/.local/bin
```

> `~/.local/bin` 只是一个"放用户脚本"的通用目录，跟 npm 无关；也可以换成 `~/bin`，后面 PATH 同步改。

### 2.3 第 3 步：生成 `npm-global` 脚本

```bash
cat > "$HOME/.local/bin/npm-global" <<'SH'
#!/bin/sh
exec npm --prefix "${NPM_GLOBAL_PREFIX:-$HOME/.npm-global}" -g "$@"
SH
chmod +x "$HOME/.local/bin/npm-global"
```

四个关键点：

1. `<<'SH'` 用**单引号**，保证 `$HOME` 不被立刻展开，而是在运行时展开。
2. `"$@"` 把参数原样透传，所以 `npm-global i wrangler` → `npm --prefix ... -g i wrangler`。
3. `-g` 已经写死在脚本里，**以后不用手敲**。
4. `chmod +x` **必须做**，否则会报 `permission denied`。

验证脚本本身没问题（此时还没进 PATH，用绝对路径测）：

```bash
"$HOME/.local/bin/npm-global" ls --depth=0
```

### 2.4 第 4 步：把两个目录加进 PATH

#### 方式 A（推荐）：命令行追加，幂等

```bash
RC="$HOME/.zshrc"     # bash 用户改成 $HOME/.bashrc
grep -qs 'npm-global/bin' "$RC" || \
  printf 'export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"\n' >> "$RC"
```

- `grep -qs ... ||` 的作用：**已经有这行了就不再追加**，重复执行不会产生重复 PATH 条目。
- `printf` 比 `echo` 可靠（不会把 `\n` 或 `-` 开头的字符串解释错）。
- 用 `>>` 追加到文件末尾；如果文件不存在会自动创建。

**fish 用户**语法不同，用这个：

```bash
RC="$HOME/.config/fish/config.fish"
mkdir -p "$(dirname "$RC")"
grep -qs 'npm-global/bin' "$RC" || \
  echo 'fish_add_path $HOME/.local/bin $HOME/.npm-global/bin' >> "$RC"
```

（`fish_add_path` 需要 fish 3.2+；老版本用 `set -Ux fish_user_paths $HOME/.local/bin $HOME/.npm-global/bin $fish_user_paths`）

#### 方式 B：手动编辑

```bash
code ~/.zshrc      # 或 nano ~/.zshrc / vim ~/.zshrc
```

在**文件末尾**新增一行：

```bash
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"
```

改完大概长这样（示例）：

```bash
# ~/.zshrc 末尾
source $ZSH/oh-my-zsh.sh          # oh-my-zsh 的初始化（本来就有）

export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"
```

保存退出：`nano` 按 `Ctrl+O` `Enter` `Ctrl+X`；`vim` 按 `Esc` 输入 `:wq`。

#### 方式 C：只用当前这个终端（临时测试，不写入文件）

```bash
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"
```

关掉终端就失效。**建议先用这个验证能用，再写进配置文件**，避免把 PATH 改坏。

### 2.5 第 5 步：让配置生效

```bash
exec "$SHELL" -l        # 或者：exec zsh / 关掉终端重开
```

### 2.6 第 6 步：逐条验证

```bash
# 1) PATH 里有没有这两个目录（应该能看到，且位置靠前）
echo "$PATH" | tr ':' '\n' | grep -nE '\.local/bin|npm-global/bin'

# 2) 脚本能不能被找到
command -v npm-global
# 期望：/Users/你/.local/bin/npm-global

# 3) 功能是否正常
npm-global ls --depth=0
# 期望：列出共享层已装的包；空的话只输出一行路径

# 4) 共享层路径是否正确
npm --prefix ~/.npm-global root -g
# 期望：/Users/你/.npm-global/lib/node_modules
```

### 2.7 macOS 特有的坑

| 现象                                         | 原因                             | 处理                                                     |
| -------------------------------------------- | -------------------------------- | -------------------------------------------------------- |
| `zsh: no such file or directory: npm-global` | 文件没 `chmod +x`                | `chmod +x ~/.local/bin/npm-global`                       |
| 改完 `.zshrc` 不生效                         | 当前终端是旧进程                 | `exec zsh` 或新开窗口                                    |
| 只对 `zsh -c` 生效、终端不生效               | 写进了 `.zshenv` 之类            | 检查你改的是 `~/.zshrc`                                  |
| PATH 里有重复条目                            | 多次追加                         | zsh 可以在 `.zshrc` 里加 `typeset -U path PATH` 自动去重 |
| 新终端里又没了                               | oh-my-zsh 插件重排 PATH          | 把 PATH 行放到 `.zshrc` **最末尾**                       |
| Dock 启动的 GUI 程序找不到命令               | GUI 不读 `.zshrc`                | 用 `launchctl setenv PATH "$PATH"` 或从终端启动程序      |
| `/etc/zprofile` 的 `path_helper` 插队        | 系统在 `/etc/zprofile` 重建 PATH | `.zshrc` 在它之后执行，**在 .zshrc 里 prepend 就行**     |

---

## 3. Windows 详细步骤（PowerShell）

### 3.1 第 1 步：确认环境

```powershell
$PSVersionTable.PSVersion      # 5.1 或 7.x 都行
node -v
npm -v
$env:USERPROFILE              # 例：C:\Users\herschel
```

### 3.2 第 2 步：建目录

```powershell
$prefix = "$env:USERPROFILE\.npm-global"
New-Item -ItemType Directory -Force "$prefix\lib\node_modules", "$prefix\bin" | Out-Null
Get-ChildItem $prefix
```

> Windows 下包本体在 `<prefix>\node_modules`，`<prefix>\bin` 其实用不到，建着只是和 macOS 保持结构一致。

### 3.3 第 3 步：生成 `npm-global.cmd`

```powershell
@'
@echo off
npm --prefix "%USERPROFILE%\.npm-global" -g %*
'@ | Set-Content -Encoding ASCII "$env:USERPROFILE\.npm-global\npm-global.cmd"
```

要点：

1. `@' ... '@` 是 **literal here-string**，里面的 `%USERPROFILE%` 不会被 PowerShell 展开，留给 cmd 展开。
2. `-Encoding ASCII` 很重要：带 BOM 的 UTF-8 会让 cmd 把第一行解析成乱码。
3. `%*` 是 cmd 的"透传所有参数"。

**不用 PowerShell 的话**，也可以用记事本：

1. 打开记事本
2. 粘贴上面 3 行（去掉 `@'` 和 `'@`）
3. 另存为 → 路径选 `C:\Users\你\.npm-global\` → 文件名 `npm-global.cmd` → 保存类型选「所有文件」→ 编码选 `ANSI`

验证（用绝对路径）：

```powershell
& "$env:USERPROFILE\.npm-global\npm-global.cmd" ls --depth=0
```

### 3.4 第 4 步：把目录加进 PATH

Windows 的 PATH 分**用户级**和**系统级**，我们只改**用户级**（不需要管理员权限）。

#### 方式 A（推荐）：图形界面

1. `Win + R` → 输入 `sysdm.cpl` → 回车
2. 切到「**高级**」选项卡 → 点「**环境变量…**」
3. 上方「**用户变量**」区域，选中 `Path` → 点「**编辑…**」
4. 点「**新建**」→ 输入：

   ```
   %USERPROFILE%\.npm-global
   ```

5. 点「确定」→「确定」→「确定」关闭所有对话框
6. **关闭所有终端窗口**，重新打开 PowerShell

> 另一种入口：`Win + R` → `rundll32.exe sysdm.cpl,EditEnvironmentVariables`

#### 方式 B：PowerShell 追加

```powershell
$dir  = "$env:USERPROFILE\.npm-global"
$user = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($user -notlike "*$dir*") {
  [Environment]::SetEnvironmentVariable('Path', ($user.TrimEnd(';') + ';' + $dir), 'User')
  "已添加：$dir"
} else {
  "已存在：$dir"
}
```

**注意**：这种方式会把用户 Path 写成 `REG_SZ`，如果你的原 Path 里含有 `%xxx%` 变量（很少见），变量会失效。介意就用方式 A 的图形界面，它保持 `REG_EXPAND_SZ`。

#### 方式 C：只对当前窗口生效（临时测试）

```powershell
$env:Path += ";$env:USERPROFILE\.npm-global"
```

#### ⚠️ 千万不要用 `setx`

```cmd
:: 不要这样写！
setx PATH "%PATH%;%USERPROFILE%\.npm-global"
```

原因：`%PATH%` 会把**系统 Path + 用户 Path 合并**写进用户 Path，造成重复膨胀；而且 `setx` 超过 **1024 字符会静默截断**，直接把 PATH 弄坏。

#### 补充：如果你更想用 PowerShell 函数而不是 .cmd

```powershell
if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force | Out-Null }
Add-Content $PROFILE 'function npm-global { npm --prefix "$env:USERPROFILE\.npm-global" -g @args }'
. $PROFILE
```

如果提示「禁止运行脚本」，执行一次：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 3.5 第 5 步：生效

**新开一个 PowerShell 窗口**（已有的窗口不会更新）。VS Code 里的终端也一样，必须**完全退出 VS Code** 再打开。

### 3.6 第 6 步：逐条验证

```powershell
# 1) PATH 里有没有（注意：where 在 PowerShell 里是 Where-Object 的别名，必须写 where.exe）
[Environment]::GetEnvironmentVariable('Path','User') -split ';' | Select-String 'npm-global'

# 2) 能不能找到命令
where.exe npm-global
# 期望：C:\Users\你\.npm-global\npm-global.cmd

# 3) 功能是否正常
npm-global ls --depth=0
```

### 3.7 Windows 特有的坑

| 现象                              | 原因                                   | 处理                                                  |
| --------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| `'npm-global' 不是内部或外部命令` | 新终端没开 / Path 没保存 / .cmd 不存在 | 按 3.4 重新加，确认 `.npm-global\npm-global.cmd` 存在 |
| 运行 .cmd 一闪而过或乱码          | 文件带 BOM 或存成了 UTF-16             | `Set-Content -Encoding ASCII` 重新生成                |
| `where npm-global` 没结果但文件在 | 你用的是 PowerShell 的 `where` 别名    | 必须写 `where.exe`                                    |
| VS Code 终端里不生效              | VS Code 启动时继承了旧 PATH            | 完全退出 VS Code 再开                                 |
| Path 越改越长                     | 用了 `setx` / 重复追加                 | 图形界面里清理重复项                                  |
| 公司电脑 Path 被组策略锁定        | 无权限                                 | 只能用方式 C 临时加，或让 IT 处理                     |

---

## 4. 跨平台验证清单（复制粘贴即可）

| 检查项     | macOS / Linux                                  | Windows                                                |
| ---------- | ---------------------------------------------- | ------------------------------------------------------ |
| 脚本存在   | `ls -l ~/.local/bin/npm-global`                | `Get-Item $env:USERPROFILE\.npm-global\npm-global.cmd` |
| 有执行权限 | `chmod +x ~/.local/bin/npm-global`             | 不适用                                                 |
| 在 PATH 里 | `echo $PATH \| tr ':' '\n' \| grep npm-global` | `where.exe npm-global`                                 |
| 命令可用   | `command -v npm-global`                        | `Get-Command npm-global`                               |
| 共享层路径 | `npm --prefix ~/.npm-global root -g`           | `npm --prefix $env:USERPROFILE\.npm-global root -g`    |
| 实际安装   | `npm-global i <包名>` 后 `npm-global ls`       | 同左                                                   |
| 默认层路径 | `npm root -g`                                  | `npm root -g`                                          |

---

## 5. 故障排查：症状 → 原因 → 处理

| 症状                                             | 最可能的原因                             | 处理                                                         |
| ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------ |
| `command not found: npm-global`                  | PATH 没生效 / 文件不在 PATH 目录 / 没 +x | `echo $PATH` 确认；`chmod +x`；`exec zsh`                    |
| `npm error code ENOENT ... lstat '<prefix>/lib'` | `prefix` 指向了一个**空目录**            | `npm config get prefix` 查；改成有效目录或 `npm config delete prefix` |
| `EACCES: permission denied`                      | 装到了系统目录（`/usr/local`）           | 改用共享层 `npm-global i`                                    |
| 装完命令找不到                                   | 需要新终端；或该包没有 `bin`             | `ls ~/.npm-global/bin`；`npm-global ls`                      |
| 命令存在但版本不对                               | 版本层和共享层同名                       | `command -v 命令` 看实际路径                                 |
| PATH 里有重复条目                                | 多次追加                                 | zsh 加 `typeset -U path PATH`；或手动清理                    |
| Windows `.cmd` 无法执行                          | 编码/BOM                                 | 用 ASCII 重新生成                                            |
| Windows Path 被截断                              | 用过 `setx`                              | 图形界面里修复                                               |

---

## 6. 回滚

macOS / Linux：

```bash
rm -f "$HOME/.local/bin/npm-global"
rm -rf "$HOME/.npm-global"          # 会连共享层已装的包一起删
# 再从 ~/.zshrc 里删掉那行 export PATH=...
exec zsh
```

Windows：

```powershell
Remove-Item "$env:USERPROFILE\.npm-global" -Recurse -Force
# 再从「环境变量 → 用户变量 → Path」里删掉 %USERPROFILE%\.npm-global
```

如果之前把默认 prefix 也统一了，别忘撤销：

```bash
npm config delete prefix
```

---

## 7. 一键脚本（整段复制执行）

### 7.1 macOS / Linux

```bash
#!/bin/sh
set -e

PREFIX="$HOME/.npm-global"
LOCALBIN="$HOME/.local/bin"

mkdir -p "$PREFIX/lib/node_modules" "$PREFIX/bin" "$LOCALBIN"

cat > "$LOCALBIN/npm-global" <<'SH'
#!/bin/sh
exec npm --prefix "${NPM_GLOBAL_PREFIX:-$HOME/.npm-global}" -g "$@"
SH
chmod +x "$LOCALBIN/npm-global"

SHELL_NAME="${SHELL##*/}"
if [ "$SHELL_NAME" = "fish" ]; then
  RC="$HOME/.config/fish/config.fish"
  mkdir -p "$(dirname "$RC")"
  grep -qs 'npm-global/bin' "$RC" || echo 'fish_add_path $HOME/.local/bin $HOME/.npm-global/bin' >> "$RC"
else
  case "$SHELL_NAME" in
    zsh)  RC="${ZDOTDIR:-$HOME}/.zshrc" ;;
    bash) RC="$HOME/.bashrc" ;;
    *)    RC="$HOME/.profile" ;;
  esac
  grep -qs 'npm-global/bin' "$RC" || echo 'export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"' >> "$RC"
fi

echo "✅ 已写入 $RC"
echo "👉 执行 exec \"\$SHELL\" -l 生效，然后跑：npm-global ls"
```

### 7.2 Windows（PowerShell）

```powershell
$prefix = "$env:USERPROFILE\.npm-global"
New-Item -ItemType Directory -Force "$prefix\lib\node_modules", "$prefix\bin" | Out-Null

@'
@echo off
npm --prefix "%USERPROFILE%\.npm-global" -g %*
'@ | Set-Content -Encoding ASCII "$prefix\npm-global.cmd"

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($userPath -notlike "*$prefix*") {
  [Environment]::SetEnvironmentVariable('Path', ($userPath.TrimEnd(';') + ';' + $prefix), 'User')
  Write-Host "✅ 已加入用户 PATH：$prefix"
} else {
  Write-Host "ℹ️ PATH 已包含：$prefix"
}
Write-Host "👉 关闭本窗口重新打开，然后跑：npm-global ls"
```

---

## 8. 和 fnm / nvm 共存的注意事项

1. **共享层不受版本切换影响**：`npm-global` 的命令在 `<prefix>/bin`，跟 fnm 的 multishell 无关。
2. **但共享层里的命令仍由 PATH 里第一个 node 执行**——纯 JS 包没问题，带原生扩展（`.node`）的包请装到版本层。
3. **fnm 下新装的全局包要新开终端**才进 PATH。
4. **升级 Node 大版本后**，版本层要重装；共享层不用。
5. **两者名字冲突时**，谁的 PATH 靠前谁赢。macOS 上 fnm 的 multishell 一般在 `~/.local/bin` 之后？不一定——用 `command -v xxx` 确认实际路径，别靠猜。
6. 想在脚本里用共享层命令而 PATH 不可靠时，直接写绝对路径或 `NPM_GLOBAL_PREFIX=... npm-global`。