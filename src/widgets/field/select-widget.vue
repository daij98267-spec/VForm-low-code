<template>
    <el-select v-model="formData[widget.options.name]" :placeholder="widget.options.placeholder">
        <el-option v-for="item in widget.options.optionItems" 
        :label="item.label"
        :value="item.value"
        :key="item.value"></el-option>
    </el-select>
</template>

<script lang="ts" setup>
    import { useFieldDefault } from '../../utils/util.ts'
    const props = defineProps<{ widget: any, formData: any }>()//约定好需要的东西
    useFieldDefault(props.formData,props.widget)
</script>

<style scoped>

</style>