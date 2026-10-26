<template>
    <el-input type="textarea" v-model="formData[widget.options.name]"
     :placeholder="widget.options.placeholder" />
</template>

<script lang="ts" setup>
    defineProps<{ widget: any, formData: any  }>()//约定好需要的东西
</script>

<style scoped>

</style>
