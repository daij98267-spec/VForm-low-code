<template>
    <el-input 
    v-model="formData[widget.options.name]"
    :placeholder="widget.options.placeholder || '请输入'" />
</template>

<script lang="ts" setup>
    import { useFieldDefault } from '../../utils/util.ts'
    const props = defineProps<{ widget: any, formData: any }>()//约定好需要的东西
    useFieldDefault(props.formData,props.widget)
</script>

<style scoped>

</style>