<!-- 日期选择器组件 -->
<template>
  <el-date-picker
    v-model="formData[widget.options.name]"
    type="date"
    :placeholder="widget.options.placeholder"
  />
</template>

<script lang="ts" setup>
    defineProps<{ widget: any, formData: any }>()//约定好需要的东西
</script>
<style scoped>

</style>