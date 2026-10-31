<template>
<!--渲染器-->
<!--整个表都是formData-->
<div class="renderer" >
<el-form ref="formRef" :label-width="formJson.formConfig.labelWidth"
                       :size="formJson.formConfig.size"
                       :model="formData"
                       :label-position="formJson.formConfig.labelPosition"
                       >
    <!--画布只接收，不能往外拖，与组件库共用一个group-->
    <draggable v-model="widgetList" item-key="id" :group="{ name:'widgets', pull:true, put:true }"
    >
        <template #item="{element:widget}">
            <div>
            <!--如果是容器组件-->
        <ContainerWidget v-if="widget.formItemFlag === false" :widget="widget" :formData="formData"
         />
        <el-form-item v-else :label="widget.options.label"  
                      :class="{'highlight':widget.id===selectedWidgetId&&!preview}"
                      :prop="widget.options.name"
                      :rules="getRules(widget)"
                      @click.stop="selectedWidget(widget)&&!preview"
                      >
                      <!--prop 是表单的属性，用于绑定表单数据的属性-->
            <component :is="basicFields[widget.type]"
            :widget="widget"
            :formData="formData"
            />
            <!--这里的formData是传递，不是双向绑定-->
            <!--实现组件的删除-->
            <br>
            <hr>
            <el-button type="danger" size="small" v-if="!preview" @click.stop="removeWidget(widget)">x</el-button>
            <!--实现组件的复制-->
            <el-button type="success" size="small" v-if="!preview" @click="copyWidget(widget)">复制</el-button>
            <!--实现组件的上下交换-->
            <!--如果是第一个组件-->
            <el-button type="primary" size="small" v-if="!preview" @click="moveUp(widget)" :disabled="formJson.widgetList.indexOf(widget)===0">↑</el-button>
            <el-button type="primary" size="small" v-if="!preview" @click="moveDown(widget)" :disabled="formJson.widgetList.indexOf(widget)===formJson.widgetList.length-1">↓</el-button>
        </el-form-item>
        </div>
        </template>
    </draggable>
</el-form>
</div>
</template>

<script setup lang="ts">
import { basicFields } from '../widgets/registry'
import { deepClone } from '../utils/util.ts'
import draggable from 'vuedraggable'
import { computed,ref,provide,inject } from 'vue'
import ContainerWidget from './ContainerWidget.vue'
import { getRules } from '../utils/util.ts'

//拿数据inject
const {
    selectedWidget, removeWidget, copyWidget, moveUp, moveDown,
    selectedWidgetId,recordWidgets
} = inject<any>('formCtx')!

const props = defineProps<{ formJson: any, formData: Record<string, any>,preview?:boolean }>()//约定好需要的东西
//获取表单数据
function getFormData(){
    return deepClone(props.formData)
}
//校验表单
function validateForm(){
    return formRef.value.validate()
}
//导出表单实例
const formRef=ref<any>(null)
function clearValidate(name:string){
    formRef.value.clearValidate(name)
}
defineExpose({
    getFormData,
    clearValidate,
    validateForm
})
const widgetList=computed({
    get:()=>props.formJson.widgetList,
    set:(val)=>{
        recordWidgets(val)
    }
})
//给preview数据
provide('preview', computed(() => props.preview))
</script>

<style scoped>
.highlight { outline: 2px solid #409eff; }
.el-button{
    margin-left: 10px;
}
</style>