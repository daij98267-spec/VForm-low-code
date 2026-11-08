<template>
    <!-- 外层 div 永远在，作为 IntersectionObserver 的观察目标，ref 全程稳定 -->
    <div ref="placeholderRef" class="lazy-field">
        <!-- 未挂载：占位 div 撑住高度，保留滚动空间 -->
        <div v-if="!visible" class="lazy-placeholder"></div>
        <!-- 已挂载：渲染真正的字段组件 -->
        <component v-if="visible" :is="comp" :widget="widget" :formData="formData" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'

// 注意：这个组件 script 里用不到 props（全部在模板里透传），
// 所以不写 `const props = defineProps(...)`——写了 props 又不用，vue-tsc 会报 TS6133「声明了但未使用」。
defineProps<{
    comp: Component                // 字段组件本身，就是 basicFields[type]
    widget: any                    // 透传给字段组件
    formData: Record<string, any>  // 透传给字段组件
}>()

const visible = ref(false)
const placeholderRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
    if (!placeholderRef.value) return   // TS 里 ref 的 value 可能是 null，observe 前判空

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {//如果进入视口
            visible.value = true        // 进入视口 → 挂载字段组件
            observer?.disconnect()      // 一次性：挂载完就停止观察
            observer = null
        }
    })
    observer.observe(placeholderRef.value)
})

onBeforeUnmount(() => {
    observer?.disconnect()          // 组件被删时兜底清理，防止 observer 悬空
    observer = null
})
</script>

<style scoped>
.lazy-placeholder {
    min-height: 80px;
    /* 估算的字段高度，用来撑住滚动空间，可按需调 */
}
</style>