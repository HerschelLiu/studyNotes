```bash
npm i mitt
```



```js
import mitt from 'mitt';
import { onMounted, onUnmounted } from 'vue';

// 使用单例事件总线（原实现每个实例独立，无法跨组件通信）
const globalEmitter = mitt();

/**
 * 全局事件总线钩子（优化版）
 * @param {string | Record<string, (payload?: any) => void>} [nameOrMap] 事件名（字符串）或事件映射对象（{事件名: 处理函数}）
 * @param {(payload?: any) => void} [callback] 当第一个参数为字符串时的事件处理函数
 * @returns {import('mitt').Emitter} 全局事件发射器实例
 */
export const useMitt = (nameOrMap, callback) => {
  // 处理事件注册逻辑
  const registerEvents = () => {
    if (!nameOrMap) return; // 无参数时不注册具体事件
    
    if (typeof nameOrMap === 'string') {
      if (typeof callback === 'function') {
        globalEmitter.on(nameOrMap, callback);
      }
      return;
    }

    if (typeof nameOrMap === 'object') {
      Object.entries(nameOrMap).forEach(([eventName, handler]) => {
        if (typeof handler === 'function') {
          globalEmitter.on(eventName, handler);
        }
      });
    }
  };

  // 处理事件移除逻辑
  const unregisterEvents = () => {
    if (!nameOrMap) return; // 无参数时不执行移除
    
    if (typeof nameOrMap === 'string') {
      if (typeof callback === 'function') {
        globalEmitter.off(nameOrMap, callback);
      }
      return;
    }

    if (typeof nameOrMap === 'object') {
      Object.entries(nameOrMap).forEach(([eventName, handler]) => {
        if (typeof handler === 'function') {
          globalEmitter.off(eventName, handler);
        }
      });
    }
  };

  onMounted(registerEvents);
  onUnmounted(unregisterEvents);

  return globalEmitter;
};

```

用法：

示例1：字符串事件名 + 回调函数

```js
<script setup>
import { useMitt } from '@/hooks/useMitt';

// 1. 注册事件监听（组件挂载时自动注册）
useMitt('userLogin', (userInfo) => {
  console.log('接收到用户登录事件:', userInfo);
});

// 2. 触发事件（任意组件中）
const handleSubmit = () => {
  const emitter = useMitt(); // 直接获取全局emitter
  emitter.emit('userLogin', { name: '张三', id: 123 });
};
</script>
```

示例2：事件映射对象（推荐新用法）

```js
<script setup>
import { useMitt } from '@/hooks/useMitt';

// 1. 定义事件处理函数
const handleOrderCreate = (order) => {
  console.log('新订单创建:', order);
};

const handleMessageUpdate = (message) => {
  console.log('消息更新:', message);
};

// 2. 批量注册事件（组件挂载时自动注册）
useMitt({
  orderCreate: handleOrderCreate,
  messageUpdate: handleMessageUpdate
});

// 3. 触发事件（示例）
const createNewOrder = () => {
  useMitt().emit('orderCreate', { id: 456, amount: 99.9 });
};
</script>
```

