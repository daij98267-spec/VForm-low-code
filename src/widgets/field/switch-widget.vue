<template>
    <!-- 开关组件 -->
    <el-switch
        v-model="formData[widget.options.name]"
        :active-value="widget.options?.switchItems?.activeValue||true"
        :inactive-value="widget.options?.switchItems?.inactiveValue||false"
    />
</template>

<script lang="ts" setup>
    import { useFieldDefault } from '../../utils/util.ts'
    const props = defineProps<{ widget: any, formData: any }>()//约定好需要的东西
    useFieldDefault(props.formData,props.widget)
</script>

<style scoped>

</style>
