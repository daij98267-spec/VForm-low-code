<template>
    <el-select v-model="formData[widget.options.name]" :placeholder="widget.options.placeholder">
        <el-option v-for="item in widget.options.optionItems" 
        :label="item.label"
        :value="item.value"
        :key="item.value"></el-option>
    </el-select>
</template>

<script lang="ts" setup>
    defineProps<{ widget: any, formData: any }>()//约定好需要的东西
</script>

<style scoped>

</style>