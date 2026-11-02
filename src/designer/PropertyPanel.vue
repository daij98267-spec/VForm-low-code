<template>
    <div class="widget-properties">
        <!--属性面板显示表单的配置-->
        <div v-if="!onselectedWidget" class="form-property-config">
            <div class="prop-label">表单标签宽度（px）</div>
            <el-input-number v-model="formJson.formConfig.labelWidth" placeholder="请输入标签宽度"></el-input-number>
            <div class="prop-label">标签对齐方式</div>
            <el-select v-model="formJson.formConfig.labelPosition" placeholder="请选择标签对齐方式">
                <el-option label="左对齐" value="left" />
                <el-option label="顶部" value="top" />
                <el-option label="右对齐" value="right" />
            </el-select>
            <div class="prop-label">组件大小</div>
            <el-select v-model="formJson.formConfig.size" placeholder="请选择组件大小">
                <el-option label="小" value="small" />
                <el-option label="默认" value="" />
                <el-option label="大" value="large" />
            </el-select>
        </div>
        <!--属性面板显示选中的组件-->
        <div v-if="onselectedWidget" class="widget-property-item">
            <!--叶子组件特有的属性-->
            <div v-if="onselectedWidget.formItemFlag == true">
                <!--必填/非必填-->
                <div class="prop-label">是否必填</div>
                <el-switch v-model="onselectedWidget.options.required" :active-value="true" :inactive-value="false"
                    active-text="必填" inactive-text="非必填" @change="clearValidate"></el-switch>
                <!--组件的类型是啥，它有对应的校验规则-->
                <div>
                  <div class="prop-label">校验规则</div>
                  <el-select v-model="onselectedWidget.options.validation" placeholder="请选择该组件的校验规则">
                    <el-option label="无" value=""></el-option>                    
                    <el-option label="邮箱" value="email"></el-option>
                    <el-option label="手机号" value="mobilePhone"></el-option>
                    <el-option label="年龄" value="age"></el-option>
                    <el-option label="数字" value="number"></el-option>
                  </el-select>
                  <!--校验提示语提示，有规则才有提示语-->
                  <div class="prop-label">校验提示语</div>
                  <el-input v-if="onselectedWidget.options.validation" v-model="onselectedWidget.options.validationHint" placeholder="请输入校验提示语" />
                </div>
                <!--组件所依赖的其他组件，显隐条件，依赖字段不能是自己-->
                <div>
                  <div class="prop-label">显隐条件 · 依赖字段</div>
                  <el-select v-model="visibleField" placeholder="请选择依赖字段">
                    <el-option label="无" value=""></el-option>
                    <el-option v-for="item in collectFieldNames(formJson.widgetList).filter((name) => name !== onselectedWidget.options.name)"
                        :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <div class="prop-label">触发值（依赖字段等于这个值才显示）</div>
                  <el-input v-if="visibleField" v-model="visibleValue" placeholder="触发值（依赖字段等于这个值才显示）" />
                </div>
                </div>
                <!--容器组件特有的属性-->
                <div v-if="onselectedWidget.type === 'tabs'">
                  <div class="prop-label section">Tab 标签</div>
                  <!--tab标签-->
                  <div v-for="(item,index) in onselectedWidget.options.tabNames" :key="index">
                    <el-input v-model="onselectedWidget.options.tabNames[index]" placeholder="请输入tab标签" />
                  </div>
                </div>
            <div class="prop-label section">基本设置</div>
            <div class="prop-label">组件名称（画布上显示的标题）</div>
            <el-input v-model="onselectedWidget.options.label" placeholder="请输入组件名称" />
            <div class="prop-label">占位符（输入框里的提示文字）</div>
            <el-input v-model="onselectedWidget.options.placeholder" placeholder="请输入占位符" />
            <div class="prop-label">字段名（提交数据时的 key）</div>
            <el-input v-model="onselectedWidget.options.name" placeholder="请输入组件字段名" />
            <!--<el-input v-model="onselectedWidget" placeholder="显示组件的父组件"></el-input>-->
            <!--下拉框选项-->
            <div v-if="onselectedWidget.type === 'select' || onselectedWidget.type === 'radio' || onselectedWidget.type === 'checkbox'"
                class="widget-property-item">
                <div class="prop-label section">选项配置</div>
                <div v-for="(item, index) in onselectedWidget.options.optionItems" :key="index">
                    <div class="prop-label">选项名称</div>
                    <el-input v-model="item.label" placeholder="请输入选项名称" />
                    <div class="prop-label">选项值</div>
                    <el-input v-model="item.value" placeholder="请输入选项值" />
                    <el-button type="warning" @click="removeOption(item)">删除选项</el-button>
                </div>
                <!--新增按钮-->
                <el-button type="primary" @click="addOption">新增选项</el-button>
            </div>
            <!--滑块选项-->
            <div v-if="onselectedWidget.type === 'slider' && onselectedWidget.options.sliderItems"
                class="widget-property-item">
                <div class="prop-label section">滑块配置</div>
                <div class="prop-label">最小值</div>
                <el-input-number v-model="onselectedWidget.options.sliderItems.min" placeholder="请输入最小值" />
                <div class="prop-label">最大值</div>
                <el-input-number v-model="onselectedWidget.options.sliderItems.max" placeholder="请输入最大值" />
                <div class="prop-label">步长</div>
                <el-input-number v-model="onselectedWidget.options.sliderItems.step" placeholder="请输入步长" />
            </div>
            <!--开关选项-->
            <div v-if="onselectedWidget.type === 'switch' && onselectedWidget.options.switchItems"
                class="widget-property-item">
                <div class="prop-label section">开关配置</div>
                <div class="prop-label">激活值（打开时的值）</div>
                <el-input v-model="onselectedWidget.options.switchItems.activeValue" placeholder="请输入激活值" />
                <div class="prop-label">非激活值（关闭时的值）</div>
                <el-input v-model="onselectedWidget.options.switchItems.inactiveValue" placeholder="请输入非激活值" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineEmits,computed} from 'vue'
import {collectFieldNames} from '../utils/tree.ts'

const props=defineProps<{ onselectedWidget:any, formJson: any }>()
const emit = defineEmits(['clear-validate', 'remove-option', 'add-option',])

 const visibleField = computed({
    get: () => props.onselectedWidget?.options?.visibleWhen?.field ?? '',
    set: (field: string) => {
      const w = props.onselectedWidget
      if (!w) return
      if (!field) {                    // 选了「无」→ 删掉整个条件
        delete w.options.visibleWhen
        return
      }
      if (!w.options.visibleWhen) w.options.visibleWhen = { field: '', value: '' }
      w.options.visibleWhen.field = field
    }
  })
  const visibleValue = computed({
    get: () => props.onselectedWidget?.options?.visibleWhen?.value ?? '',
    set: (value: any) => {
      const w = props.onselectedWidget
      if (!w) return
      if (!w.options.visibleWhen) w.options.visibleWhen = { field: '', value: '' }
      w.options.visibleWhen.value = value
    }
  })
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

/* 每个配置项的小标签 */
.prop-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  line-height: 1.4;
}

/* 分组标题（基本设置/选项配置等） */
.prop-label.section {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
}

/* 下拉框和数字输入框也统一占满一行、留出间距 */
.widget-properties :deep(.el-select),
.widget-properties :deep(.el-input-number) {
  width: 100%;
  margin-bottom: 12px;
}

.widget-properties :deep(.el-switch) {
  margin-bottom: 12px;
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

</style>