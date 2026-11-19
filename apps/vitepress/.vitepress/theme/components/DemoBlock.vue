<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(
  defineProps<{
    /** .vitepress/demos 下的相对路径，如 counter/basic */
    src: string
    title?: string
    description?: string
  }>(),
  { title: '', description: '' },
)

const demos = import.meta.glob('../../demos/**/*.vue', { eager: true }) as Record<
  string,
  { default: any }
>
const sources = import.meta.glob('../../demos/**/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const key = computed(
  () => `../../demos/${props.src.replace(/^\/+/, '').replace(/\.vue$/, '')}.vue`,
)
const demo = computed(() => {
  const component = demos[key.value]?.default
  return component ? markRaw(component) : null
})
const source = computed(() => sources[key.value] ?? '')

const { isDark } = useData()
const showCode = ref(false)
const highlighted = ref('')
const loading = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined
let highlightToken = 0

async function highlightSource() {
  if (!source.value) return
  const token = ++highlightToken
  loading.value = true
  try {
    const { codeToHtml } = await import('shiki')
    const html = await codeToHtml(source.value, {
      lang: 'vue',
      theme: isDark.value ? 'github-dark' : 'github-light',
    })
    if (token === highlightToken) highlighted.value = html
  } catch (error) {
    console.warn('[DemoBlock] 代码高亮失败，已回退为纯文本。', error)
    if (token === highlightToken) highlighted.value = ''
  } finally {
    if (token === highlightToken) loading.value = false
  }
}

async function toggleCode() {
  showCode.value = !showCode.value
  if (showCode.value && !highlighted.value) await highlightSource()
}

watch(isDark, () => {
  if (showCode.value) highlightSource()
})

async function copySource() {
  if (!source.value) return
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    // 剪贴板不可用时退化为选中文本
    const textarea = document.createElement('textarea')
    textarea.value = source.value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1800)
  }
}

onBeforeUnmount(() => clearTimeout(copyTimer))
</script>

<template>
  <figure class="demo-block">
    <div v-if="title || description" class="demo-block__header">
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>

    <div class="demo-block__preview">
      <component :is="demo" v-if="demo" />
      <div v-else class="demo-block__missing">
        未找到示例 <code>{{ src }}</code>，请确认文件位于
        <code>.vitepress/demos/{{ src }}.vue</code>。
      </div>
    </div>

    <div class="demo-block__actions">
      <button
        type="button"
        class="demo-block__button"
        :aria-expanded="showCode"
        @click="toggleCode"
      >
        <span class="demo-block__icon">{{ showCode ? '▴' : '▾' }}</span>
        {{ showCode ? '收起源码' : '查看源码' }}
      </button>
      <button
        type="button"
        class="demo-block__button"
        :disabled="!source"
        @click="copySource"
      >
        {{ copied ? '✓ 已复制' : '复制代码' }}
      </button>
    </div>

    <div v-show="showCode" class="demo-block__code">
      <div v-if="loading" class="demo-block__loading">代码高亮加载中…</div>
      <div
        v-else-if="highlighted"
        class="demo-block__highlight"
        v-html="highlighted"
      />
      <pre v-else class="demo-block__fallback"><code>{{ source }}</code></pre>
    </div>
  </figure>
</template>

<style scoped>
.demo-block {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  overflow: hidden;
  transition: border-color 0.25s;
}

.demo-block:hover {
  border-color: var(--vp-c-brand-2);
}

.demo-block__header {
  padding: 18px 24px 0;
}

.demo-block__header h3 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-block__header p {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.demo-block__preview {
  padding: 24px;
  background:
    radial-gradient(circle at 1px 1px, var(--vp-c-divider) 1px, transparent 0)
      0 0 / 16px 16px,
    var(--vp-c-bg-soft);
}

.demo-block__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.demo-block__button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.demo-block__button:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}

.demo-block__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.demo-block__icon {
  font-size: 12px;
}

.demo-block__code {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg);
}

.demo-block__loading {
  padding: 18px 24px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.demo-block__highlight :deep(.shiki) {
  margin: 0;
  padding: 18px 24px;
  background: transparent !important;
  overflow-x: auto;
}

.demo-block__highlight :deep(.shiki code) {
  font-size: 13px;
  line-height: 1.7;
}

.demo-block__fallback {
  margin: 0;
  padding: 18px 24px;
  overflow-x: auto;
  color: var(--vp-code-block-color);
  font-size: 13px;
  line-height: 1.7;
}

.demo-block__missing {
  padding: 16px;
  border: 1px dashed var(--vp-c-danger-1);
  border-radius: 8px;
  color: var(--vp-c-danger-1);
  font-size: 14px;
}

.demo-block__missing code {
  font-size: 13px;
}
</style>
