<template>
    <!-- gutter 是列之间的间距 -->
    <el-row :gutter="10">
      <!-- 一列一列渲染；span = 24/列数，比如 2 列每列占 12 -->
      <el-col v-for="(col, i) in columns" :key="i" :span="24 / cols">
        <template v-for="child in col" :key="child.id">
          <!-- 孩子还是容器 → 递归：自己调自己 -->
          <ContainerWidget v-if="child.formItemFlag === false" :widget="child" :formData="formData" />
          <!-- 孩子是字段 → 叶子，正常渲染表单控件 -->
          <el-form-item
    :label="child.options.label"
    :prop="child.options.name"
    :rules="getRules(child)"
    :class="{'highlight': child.id === selectedWidgetId && !preview}"
    @click.stop="selectWidget(child)">
    <component :is="basicFields[child.type]" :widget="child" :formData="formData" />
    <br>
    <hr>
    <el-button type="danger"  size="small" v-if="!preview" @click.stop="removeWidget(child)">x</el-button>
    <el-button type="success" size="small" v-if="!preview" @click.stop="copyWidget(child)">复制</el-button>
    <el-button type="primary" size="small" v-if="!preview" @click.stop="moveUp(child)">↑</el-button>
    <el-button type="primary" size="small" v-if="!preview" @click.stop="moveDown(child)">↓</el-button>
  </el-form-item>
        </template>
      </el-col>
    </el-row>
  </template>

  <script setup lang="ts">
  import { computed,inject } from 'vue'
  import { basicFields } from '../widgets/registry'
  import type { Widget } from '../utils/type.ts'

  // 约定：父组件传进来的容器 + 表单数据（要透传给子字段，别断）
  const props = defineProps<{
    widget: Widget
    formData: Record<string, any>
  }>()

  // 列数：options.cols 可能是 undefined，兜底成 1
  const cols = computed(() => props.widget.options.cols || 1)

  // 把 children 按 cols 轮转分列（行优先阅读顺序）
  // cols=2 时：第0个→第1列，第1个→第2列，第2个→第1列……
  const columns = computed(() => {
    const result: Widget[][] = Array.from({ length: cols.value }, () => [])
    const children = props.widget.children || []
    children.forEach((child, i) => {
      result[i % cols.value].push(child)
    })
    return result
  })
  // 和 renderer/index.vue 里那份逻辑一样；先复制一份让本文件能独立跑，回头再抽到 util.ts 共用
  const getRules = (widget: Widget) => {
    if (widget.options.required) {
      const trigger = ['input', 'textarea'].includes(widget.type) ? 'blur' : 'change'
      return [{ required: true, message: '请输入' + widget.options.label, trigger }]
    }
    return []
  }
 const {
    selectWidget, removeWidget, copyWidget, moveUp, moveDown,
    selectedWidgetId, preview,
  } = inject<any>('formCtx')!
  </script>

<style scoped>
  .highlight { outline: 2px solid #409eff; }
  .el-button { margin-left: 10px; }
</style>