<template>
    <!-- 开关组件 -->
    <el-switch
        v-model="formData[widget.options.name]"
        :active-value="widget.options?.switchItems?.activeValue||true"
        :inactive-value="widget.options?.switchItems?.inactiveValue||false"
    />
</template>

<script lang="ts" setup>
    defineProps<{ widget: any, formData: any }>()//约定好需要的东西
</script>

<style scoped>

</style>
