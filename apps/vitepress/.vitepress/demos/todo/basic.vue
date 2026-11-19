<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const newTodo = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const todos = ref<Todo[]>([
  { id: 1, text: '搭建 VitePress 文档站', done: true },
  { id: 2, text: '补齐交互示例', done: false },
  { id: 3, text: '部署到 GitHub Pages', done: false },
])

let nextId = 4
const remaining = computed(() => todos.value.filter((todo) => !todo.done).length)

async function addTodo() {
  const text = newTodo.value.trim()
  if (!text) return
  todos.value.push({ id: nextId++, text, done: false })
  newTodo.value = ''
  await nextTick()
  inputRef.value?.focus()
}

function removeTodo(id: number) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}
</script>

<template>
  <div class="todo-demo">
    <form class="todo-demo__form" @submit.prevent="addTodo">
      <input
        ref="inputRef"
        v-model="newTodo"
        type="text"
        maxlength="40"
        placeholder="添加一条待办，回车确认"
        aria-label="新增待办"
      />
      <button type="submit" :disabled="!newTodo.trim()">添加</button>
    </form>

    <ul class="todo-demo__list">
      <li v-for="todo in todos" :key="todo.id" :class="{ 'is-done': todo.done }">
        <label>
          <input v-model="todo.done" type="checkbox" />
          <span>{{ todo.text }}</span>
        </label>
        <button type="button" aria-label="删除" @click="removeTodo(todo.id)">×</button>
      </li>
      <li v-if="!todos.length" class="todo-demo__empty">暂无待办，添加一条试试</li>
    </ul>

    <p class="todo-demo__summary">
      剩余 <strong>{{ remaining }}</strong> 项 / 共 {{ todos.length }} 项
    </p>
  </div>
</template>

<style scoped>
.todo-demo {
  max-width: 520px;
  margin: 0 auto;
}

.todo-demo__form {
  display: flex;
  gap: 8px;
}

.todo-demo__form input {
  flex: 1;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.todo-demo__form input:focus {
  border-color: var(--vp-c-brand-2);
}

.todo-demo__form button {
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.todo-demo__form button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.todo-demo__list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}

.todo-demo__list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 14px;
}

.todo-demo__list li:last-child {
  border-bottom: none;
}

.todo-demo__list label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  min-width: 0;
}

.todo-demo__list label span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-demo__list li.is-done label span {
  color: var(--vp-c-text-3);
  text-decoration: line-through;
}

.todo-demo__list li > button {
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.todo-demo__list li > button:hover {
  color: var(--vp-c-danger-1);
}

.todo-demo__empty {
  justify-content: center;
  color: var(--vp-c-text-3);
}

.todo-demo__summary {
  margin: 12px 0 0;
  text-align: right;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.todo-demo__summary strong {
  color: var(--vp-c-brand-1);
}
</style>
