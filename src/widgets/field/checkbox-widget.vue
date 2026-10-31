<template>
    <el-checkbox-group v-model="formData[widget.options.name]">
        <el-checkbox v-for="item in widget.options.optionItems" 
        :key="item.value" 
        :value="item.value"
        :label="item.label">
        </el-checkbox>
    </el-checkbox-group>
</template>

<script lang="ts" setup>
    //label是展示的，value是存在formData里的值6
    import { useFieldDefault } from '../../utils/util.ts'
    const props = defineProps<{ widget: any, formData: any }>()//约定好需要的东西
    useFieldDefault(props.formData,props.widget)

</script>

<style scoped>

</style>