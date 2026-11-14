<template>
  <el-timeline>
    <el-timeline-item
      v-for="(item, index) in flowRecordList"
      :key="index"
      :icon="setIcon(item.finishTime)"
      :color="setColor(item.finishTime)">
      <p style="font-weight: 700">{{ item.taskName }}</p>
      <el-card :body-style="{ padding: '10px' }">
        <el-descriptions
          class="margin-top"
          :column="1"
          size="small"
          border>
          <el-descriptions-item
            v-if="item.assigneeName"
            label-class-name="my-label">
            <template #label>
              <el-icon><User /></el-icon>
              办理人
            </template>
            {{ item.assigneeName }}
            <el-tag
              type="info"
              size="small">
              {{ item.deptName }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item
            v-if="item.candidate"
            label-class-name="my-label">
            <template #label>
              <el-icon><User /></el-icon>
              候选办理
            </template>
            {{ item.candidate }}
          </el-descriptions-item>

          <el-descriptions-item label-class-name="my-label">
            <template #label>
              <el-icon><Calendar /></el-icon>
              接收时间
            </template>
            {{ item.createTime }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="item.finishTime"
            label-class-name="my-label">
            <template #label>
              <el-icon><Calendar /></el-icon>
              处理时间
            </template>
            {{ item.finishTime }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="item.duration"
            label-class-name="my-label">
            <template #label>
              <el-icon><Clock /></el-icon>
              耗时
            </template>
            {{ item.duration }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="item.comment"
            label-class-name="my-label">
            <template #label>
              <el-icon><Tickets /></el-icon>
              处理意见
            </template>
            {{ item.comment.comment }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script lang="ts" setup>
  import type { ResponseListFlowRecord } from '@/api/flowable/task'

  const props = withDefaults(defineProps<{
    flowRecordList: ResponseListFlowRecord['flowList']
  }>(), {
    flowRecordList: () => []
  })

  const emit = defineEmits([])

  const setIcon = (val: string) => {
    if (val) {
      return 'Check'
    } else {
      return 'Clock'
    }
  }

  const setColor = (val: string) => {
    if (val) {
      return '#2bc418'
    } else {
      return '#b3bdbb'
    }
  }
</script>
