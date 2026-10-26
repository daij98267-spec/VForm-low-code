<template>
    <!-- 滑动选择器组件 -->
    <el-slider
        v-model="formData[widget.options.name]"
        :label="widget.options.label"
        :min="widget.options?.sliderItems?.min||0"
        :max="widget.options?.sliderItems?.max||100"
        :step="widget.options?.sliderItems?.step||10"
    />
</template>

<script lang="ts" setup>
import type { Widget } from '../../utils/type';
    defineProps<{ widget: Widget, formData: any }>()//约定好需要的东西
</script>

<style scoped>

</style>