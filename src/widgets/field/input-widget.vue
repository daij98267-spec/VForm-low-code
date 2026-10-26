<template>
    <el-input 
    v-model="formData[widget.options.name]"
    :placeholder="widget.options.placeholder || '请输入'" />
</template>

<script lang="ts" setup>
    defineProps<{ widget: any, formData: any }>()//约定好需要的东西
</script>

<style scoped>

</style>