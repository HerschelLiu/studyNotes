<script setup lang="ts">
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
const mood = computed(() => {
  if (count.value === 0) return '从 0 开始'
  if (count.value >= 10) return '有点上头了'
  return '继续加一'
})

function change(step: number) {
  count.value = Math.max(0, count.value + step)
}
</script>

<template>
  <div class="counter-demo">
    <div class="counter-demo__display">
      <span class="counter-demo__value">{{ count }}</span>
      <span class="counter-demo__mood">{{ mood }}</span>
    </div>

    <div class="counter-demo__actions">
      <button type="button" @click="change(-1)">−1</button>
      <button type="button" class="is-primary" @click="change(1)">+1</button>
      <button type="button" @click="change(10)">+10</button>
      <button type="button" class="is-ghost" @click="count = 0">重置</button>
    </div>

    <p class="counter-demo__hint">
      计算属性 doubled：<strong>{{ doubled }}</strong>
    </p>
  </div>
</template>

<style scoped>
.counter-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 8px 0;
}

.counter-demo__display {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.counter-demo__value {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(120deg, #2563eb, #14b8a6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.counter-demo__mood {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.counter-demo__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.counter-demo__actions button {
  min-width: 64px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    transform 0.2s;
}

.counter-demo__actions button:hover {
  border-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.counter-demo__actions button.is-primary {
  border-color: transparent;
  background: var(--vp-c-brand-1);
  color: #fff;
}

.counter-demo__actions button.is-ghost {
  color: var(--vp-c-text-2);
}

.counter-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.counter-demo__hint strong {
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}
</style>
