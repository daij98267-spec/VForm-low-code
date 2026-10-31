<template>
    <el-radio-group v-model="formData[widget.options.name]" >
        <el-radio v-for="item in widget.options.optionItems" 
        :key="item.value" 
        :value="item.value"
        :label="item.label">
        {{ item.label }}
        </el-radio>
    </el-radio-group>
</template>
<script lang="ts" setup>
    import { useFieldDefault } from '../../utils/util.ts'
    const props = defineProps<{ widget:any, formData: Record<string, any> }>()//约定好需要的东西
    useFieldDefault(props.formData,props.widget)
</script>
<style scoped>

</style>
