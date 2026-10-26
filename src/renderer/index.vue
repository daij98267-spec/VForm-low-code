<template>
<!--渲染器-->
<!--整个表都是formData-->
<div class="renderer" >
<el-form ref="formRef" :label-width="formJson.formConfig.labelWidth" :model="formData">
    <!--画布只接收，不能往外拖，与组件库共用一个group-->
    <draggable v-model="widgetList" item-key="id" :group="{ name:'widgets', pull:false, put:true }">
        <template #item="{element:widget}">
        <el-form-item :label="widget.options.label"  
                      :class="{'highlight':widget.id===props.selectedWidgetId&&!props.preview}"
                      :prop="widget.options.name"
                      :rules="getRules(widget)"
                      @click="selectWidget(widget)"
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
        </template>
    </draggable>
</el-form>
</div>
</template>

<script setup lang="ts">
import { basicFields } from '../widgets/registry'
import { deepClone } from '../utils/util.ts'
import draggable from 'vuedraggable'
import { computed,ref } from 'vue'

const emit = defineEmits(['select-widget','remove-widget','copy-widget','moveUp-widget','moveDown-widget','record-widgets'])
const props = defineProps<{ formJson: any, formData: Record<string, any>,selectedWidgetId?:any,preview?:boolean }>()//约定好需要的东西
//把选中的组件递给designer，属性面板里面控制
const selectWidget=(widget:any)=>{
    if(props.preview){return}
    emit('select-widget',widget)
}
//选到空白地方，把选中的组件清空，并显示formConfig的配置
//复制组件
const copyWidget=(widget:any)=>{
    emit('copy-widget',widget)
}
//删除组件
const removeWidget=(widget:any)=>{
    emit('remove-widget',widget)
}
//上移组件
const moveUp=(widget:any)=>{
    emit('moveUp-widget',widget)
}
//下移组件
const moveDown=(widget:any)=>{
    emit('moveDown-widget',widget)
}

function getFormData(){
    return deepClone(props.formData)
}
//导出表单实例
const formRef=ref<any>(null)
function clearValidate(name:string){
    formRef.value.clearValidate(name)
}

defineExpose({
    getFormData,
    clearValidate
})
const widgetList=computed({
    get:()=>props.formJson.widgetList,
    set:(val)=>{
        emit('record-widgets',val)
    }
})
const getRules=(widget:any)=>{
    if(widget.options.required){
        const trigger = ['input','textarea'].includes(widget.type) ? 'blur' : 'change'
        return [{ required: true, message: '请输入'+widget.options.label, trigger }]
    }
    else{
        return []
    }
}
</script>

<style scoped>
.highlight { outline: 2px solid #409eff; }
.el-button{
    margin-left: 10px;
}
</style>