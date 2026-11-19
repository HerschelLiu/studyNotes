<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-before>
      <h1 v-if="frontmatter.title" class="shared-doc-title">
        {{ frontmatter.title }}
      </h1>
    </template>
  </Layout>
</template>
