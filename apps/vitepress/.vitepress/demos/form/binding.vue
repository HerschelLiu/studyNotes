<script setup lang="ts">
import { computed, ref } from 'vue'

const name = ref('')
const framework = ref('Vue 3')
const frameworks = ['Vue 3', 'React', 'Svelte', '原生 JS']
const trimmed = computed(() => name.value.trim())
const greeting = computed(() =>
  trimmed.value ? `你好，${trimmed.value}！` : '在上方输入名字，这里会实时更新',
)
</script>

<template>
  <div class="binding-demo">
    <label class="binding-demo__field">
      <span>你的名字</span>
      <input
        v-model="name"
        type="text"
        maxlength="20"
        placeholder="输入后观察下方变化"
      />
    </label>

    <label class="binding-demo__field">
      <span>常用框架</span>
      <select v-model="framework">
        <option v-for="item in frameworks" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>

    <p class="binding-demo__preview">{{ greeting }}</p>

    <p class="binding-demo__meta">
      字符数：{{ name.length }} / 20 · 当前选择：<strong>{{ framework }}</strong>
    </p>
  </div>
</template>

<style scoped>
.binding-demo {
  display: grid;
  gap: 14px;
  max-width: 520px;
  margin: 0 auto;
}

.binding-demo__field {
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.binding-demo__field input,
.binding-demo__field select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.binding-demo__field input:focus,
.binding-demo__field select:focus {
  border-color: var(--vp-c-brand-2);
}

.binding-demo__preview {
  margin: 4px 0 0;
  padding: 14px 16px;
  border-left: 3px solid var(--vp-c-brand-2);
  border-radius: 0 8px 8px 0;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
  font-size: 15px;
}

.binding-demo__meta {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.binding-demo__meta strong {
  color: var(--vp-c-brand-1);
}
</style>
