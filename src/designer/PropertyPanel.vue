<template>
    <div class="widget-properties">
        <!--属性面板显示表单的配置-->
        <div v-if="!onselectedWidget" class="form-property-config">
            <el-input-number v-model="formJson.formConfig.labelWidth" placeholder="请输入标签宽度"></el-input-number>
            <el-select v-model="formJson.formConfig.labelPosition" placeholder="请选择标签对齐方式">
                <el-option label="左对齐" value="left" />
                <el-option label="顶部" value="top" />
                <el-option label="右对齐" value="right" />
            </el-select>
            <el-select v-model="formJson.formConfig.size" placeholder="请选择组件大小">
                <el-option label="小" value="small" />
                <el-option label="默认" value="" />
                <el-option label="大" value="large" />
            </el-select>
        </div>
        <!--属性面板显示选中的组件-->
        <div v-if="onselectedWidget" class="widget-property-item">
            <div v-if="onselectedWidget.formItemFlag == true">
                <!--必填/非必填-->
                <el-switch v-model="onselectedWidget.options.required" :active-value="true" :inactive-value="false"
                    active-text="必填" inactive-text="非必填" @change="clearValidate"></el-switch>
            </div>
            <el-input v-model="onselectedWidget.options.label" placeholder="请输入组件名称" />
            <el-input v-model="onselectedWidget.options.placeholder" placeholder="请输入占位符" />
            <el-input v-model="onselectedWidget.options.name" placeholder="请输入组件字段名" />
            <!--<el-input v-model="onselectedWidget" placeholder="显示组件的父组件"></el-input>-->
            <!--下拉框选项-->
            <div v-if="onselectedWidget.type === 'select' || onselectedWidget.type === 'radio' || onselectedWidget.type === 'checkbox'"
                class="widget-property-item">
                <div v-for="(item, index) in onselectedWidget.options.optionItems" :key="index">
                    <el-input v-model="item.label" placeholder="请输入选项名称" />
                    <el-input v-model="item.value" placeholder="请输入选项值" />
                    <el-button type="warning" @click="removeOption(item)">删除选项</el-button>
                </div>
                <!--新增按钮-->
                <el-button type="primary" @click="addOption">新增选项</el-button>
            </div>
            <!--滑块选项-->
            <div v-if="onselectedWidget.type === 'slider' && onselectedWidget.options.sliderItems"
                class="widget-property-item">
                <el-input-number v-model="onselectedWidget.options.sliderItems.min" placeholder="请输入最小值" />
                <el-input-number v-model="onselectedWidget.options.sliderItems.max" placeholder="请输入最大值" />
                <el-input-number v-model="onselectedWidget.options.sliderItems.step" placeholder="请输入步长" />
            </div>
            <!--开关选项-->
            <div v-if="onselectedWidget.type === 'switch' && onselectedWidget.options.switchItems"
                class="widget-property-item">
                <el-input v-model="onselectedWidget.options.switchItems.activeValue" placeholder="请输入激活值" />
                <el-input v-model="onselectedWidget.options.switchItems.inactiveValue" placeholder="请输入非激活值" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineEmits} from 'vue'

defineProps<{ onselectedWidget:any, formJson: any }>()
const emit = defineEmits(['clear-validate', 'remove-option', 'add-option'])
const clearValidate = () => {
    emit('clear-validate')
}
const removeOption = (item: any) => {
    emit('remove-option', item)
}
const addOption = () => {
    emit('add-option')
}
</script>

<style scoped>
/* ============ 右侧属性面板 ============ */
.widget-properties {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  background: #fff;
}

.widget-properties :deep(.el-input) {
  margin-bottom: 12px;
}

.widget-properties :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: box-shadow 0.2s ease;
}

.widget-properties :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.widget-properties :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #667eea inset;
}

.widget-properties :deep(.el-button) {
  margin-bottom: 10px;
  border-radius: 6px;
}

.form-property-config,
.widget-property-item {
  display: flex;
  flex-direction: column;
}

/* 属性面板标题 */
.widget-properties::before {
  content: '属性配置';
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

/* 滚动条美化 */
.library-content::-webkit-scrollbar,
.widget-properties::-webkit-scrollbar,
.renderer::-webkit-scrollbar,
.designer-canvas::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.library-content::-webkit-scrollbar-thumb,
.widget-properties::-webkit-scrollbar-thumb,
.renderer::-webkit-scrollbar-thumb,
.designer-canvas::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.library-content::-webkit-scrollbar-thumb:hover,
.widget-properties::-webkit-scrollbar-thumb:hover,
.renderer::-webkit-scrollbar-thumb:hover,
.designer-canvas::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>