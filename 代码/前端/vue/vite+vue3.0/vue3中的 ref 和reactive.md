## ref和 reactive
|       特性       |                             ref                              |                           reactive                           |
| :--------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| **适用数据类型** | 基本类型（如 `Number`, `String`, `Boolean`）或可替换的复杂类型对象 |           对象、数组等复杂类型，且需要保持引用不变           |
|   **访问方式**   |                 需通过 `.value` 访问和修改值                 |             直接通过属性访问（如 `state.count`）             |
|  **响应式原理**  |       通过对象包装器实现，内部对复杂类型调用 `reactive       |           基于 `Proxy` 代理对象，深度追踪嵌套属性            |
|   **解构行为**   |     解构后仍保留响应性（如 `const { value } = refObj`）      |           直接解构会丢失响应性，需用 `toRefs` 转换           |
|    **可变性**    |           可重新赋值（如 `ref.value = newValue`）            | 对象本身不可重新赋值（如 `state = newObj` 会丢失响应性），只能修改内部属性 |

数组推荐使用 ref，因为一般情况下使用数组，需要带着下标值进行改变，或者数组整体改变，而使用 reactive，下标赋值可能不会触发视图更新



**性能差异**

- `ref`对简单值的性能开销更低，`reactive`处理深层嵌套对象时可能有更高内存消耗
- 复杂对象用 `reactive` 更高效（仅一次代理）



**Object.assign**

```js
const state = reactive({ name: 'Alice' });
// ✅ 正确：合并到原有对象
Object.assign(state, { name: 'Bob' }); 
```

此时 `state` 的引用未改变，仅更新了属性值，因此响应性保留.

但是要**避免覆盖整个对象**, 会导致响应性丢失

```js
// ❌ 错误：直接替换整个对象
state = Object.assign({}, state, { name: 'Bob' });
```

此时 `state` 被重新赋值，原有的响应式代理被覆盖，新的普通对象不具备响应性



## shallowRef 和shallowReactive

仅浅层值（顶层属性变化）响应，嵌套深层数据无法响应式

**注意事项**

1. **不要混合使用**：避免将 `shallowReactive` 对象传入 `reactive`，否则会破坏浅层特性
2. **强制更新**：可通过 `triggerRef(shallowRefObj)` 手动触发 `shallowRef` 的更新(强制触发依赖于一个[浅层 ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 的副作用，这通常在对浅引用的内部值进行深度变更后使用。强制触发依赖于一个[浅层 ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 的副作用，这通常在对浅引用的内部值进行深度变更后使用。)
3. **与 `toRefs` 结合**：对 `shallowReactive` 使用 `toRefs` 仍会保持浅层特性
