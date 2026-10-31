<!-- 日期选择器组件 -->
<template>
  <el-date-picker
    v-model="formData[widget.options.name]"
    type="date"
    :placeholder="widget.options.placeholder"
  />
</template>

<script lang="ts" setup>
    import { useFieldDefault } from '../../utils/util.ts'
    const props = defineProps<{ widget: any, formData: any }>()//约定好需要的东西
    useFieldDefault(props.formData,props.widget)
</script>
<style scoped>

</style>