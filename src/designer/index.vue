<template>
  <div class="designer">
    <header class="designer-header">低代码表单设计器</header>
    <div class="designer-body">
      <el-container class="designer-container">
        <el-aside width="260px" class="designer-aside">
          <!--组件库，改成可拖拽的-->
          <div class="widget-library">
            <div class="library-switch">
              <div class="library-tab" :class="{ active: activeTab === 'widgets' }" @click="activeTab = 'widgets'">组件库</div>
              <div class="library-tab" :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'">表单模板</div>
            </div>
            <div v-show="activeTab === 'widgets'" class="library-content">
              <draggable
                :list="basicFieldsLabel"
                item-key="type"
                :group="{ name: 'widgets', pull: 'clone', put: false }"
                :sort="false"
                :clone="cloneWidget">
        <template #item="{ element: widget }">
          <el-card class="widget-card" shadow="hover" @click="addWidget(widget.type)">
            <span class="widget-card-label">{{ widget.options.label }}</span>
          </el-card>
        </template>
      </draggable>
            </div>
            <div v-show="activeTab === 'templates'" class="library-content library-empty">
              <div class="empty-tip">暂无表单模板</div>
            </div>
          </div>
        </el-aside>
        <!--渲染器，渲染器给组件库落脚点-->
        <el-main class="designer-canvas">
          <div class="canvas-toolbar">
            <div class="toolbar-left">
              <el-button type="success" class="toolbar-btn" @click="getForm">提交</el-button>
              <el-button type="info" class="toolbar-btn" @click="previewForm">预览</el-button>
              <el-button type="danger" class="toolbar-btn" @click="resetForm">重置表单</el-button>
              <!--撤销与重做-->
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="undo">←</el-button>
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="redo">→</el-button>
            </div>
            <div class="toolbar-right">
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="exportJson">导出Json</el-button>
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="importJson">导入Json</el-button>
            </div>
          </div>
          <div class="renderer" @click="selectedEmpty">
        <Renderer ref="rendererRef" :formJson="formJson" :formData="formData"
         @select-widget="selectedWidget"
         @remove-widget="removeWidget"
         @copy-widget="copyWidget"
         @moveUp-widget="moveUp"
         @moveDown-widget="moveDown"
         @record-widgets="recordWidgets"
         :selectedWidgetId="onselectedWidgetId"
         />
        </div>
        </el-main>
        <el-aside width="300px" class="designer-aside">
          <!--属性面板-->
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
              <!--必填/非必填-->
                <el-switch v-model="onselectedWidget.options.required" 
                :active-value="true" :inactive-value="false" 
                active-text="必填" inactive-text="非必填"
                @change="clearValidate"></el-switch>
                <el-input v-model="onselectedWidget.options.label" placeholder="请输入组件名称"/>
                <el-input v-model="onselectedWidget.options.placeholder" placeholder="请输入占位符"/>
                <el-input v-model="onselectedWidget.options.name" placeholder="请输入组件字段名"/>
                <!--<el-input v-model="onselectedWidget" placeholder="显示组件的父组件"></el-input>-->
               <!--下拉框选项--> 
                <div v-if="onselectedWidget.type==='select'||onselectedWidget.type==='radio'||onselectedWidget.type==='checkbox'" class="widget-property-item">
                <div v-for="(item,index) in onselectedWidget.options.optionItems" :key="index">
                  <el-input v-model="item.label" placeholder="请输入选项名称"/>
                  <el-input v-model="item.value" placeholder="请输入选项值"/>
                  <el-button type="warning" @click="removeOption(item)">删除</el-button>
                </div>
                <!--新增按钮-->
                <el-button type="primary" @click="addOption">新增选项</el-button>
                </div>
                <!--滑块选项-->
                <div v-if="onselectedWidget.type==='slider' && onselectedWidget.options.sliderItems" class="widget-property-item">
                  <el-input-number v-model="onselectedWidget.options.sliderItems.min" placeholder="请输入最小值"/>
                  <el-input-number v-model="onselectedWidget.options.sliderItems.max" placeholder="请输入最大值"/>
                  <el-input-number v-model="onselectedWidget.options.sliderItems.step" placeholder="请输入步长"/>
                </div>
                <!--开关选项-->
                <div v-if="onselectedWidget.type==='switch' && onselectedWidget.options.switchItems" class="widget-property-item">
                  <el-input v-model="onselectedWidget.options.switchItems.activeValue" placeholder="请输入激活值"/>
                  <el-input v-model="onselectedWidget.options.switchItems.inactiveValue" placeholder="请输入非激活值"/>
                </div>
          </div>
          </div>
        </el-aside>
      </el-container>
    </div>
    <!--预览表单弹窗-->
    <el-dialog title="预览表单" v-model="previewVisible" width="80%">
      <Renderer :formJson="formJson" :formData="formData" preview />
      <el-button type="primary" @click="previewVisible=false">关闭</el-button>
    </el-dialog>
    <!--导出Json弹窗-->
    <el-dialog title="导出Json" v-model="exportJsonVisible" width="80%">
      <el-input v-model="formJsonStr" placeholder="请输入Json字符串" type="textarea" rows="20" readonly />
      <el-button type="primary" @click="exportJsonVisible=false">关闭</el-button>
      <el-button type="primary" @click="copyJson">复制Json</el-button>
    </el-dialog>
    <!--导入Json弹窗-->
    <el-dialog title="导入Json" v-model="importJsonVisible" width="80%">
      <el-input v-model="formJsonStr2" placeholder="请输入Json字符串" type="textarea" rows="20" />
      <el-button type="primary" @click="importJsonVisible=false">关闭</el-button>
      <el-button type="primary" @click="importJsonSubmit">提交</el-button>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Renderer from '../renderer/index.vue'
import {basicFieldsLabel } from '../widgets/registry.ts'
import form1 from '../../examples/form1.ts'
import { ref,reactive } from 'vue'
import {generateId,deepClone} from '../utils/util.ts'
import type { Widget ,FieldOption} from '../utils/type.ts'
import { ElMessage } from 'element-plus'
import { getDefaultFormConfig } from '../utils/util.ts'
import draggable from 'vuedraggable'

const onselectedWidgetId=ref<string|null>(null)//被选中组件的id
const onselectedWidget=ref<Widget|null>(null)//被选中的组件
const previewVisible=ref<boolean>(false)//预览表窗是否可见
const exportJsonVisible=ref<boolean>(false)//导出Json弹窗是否可见
const importJsonVisible=ref<boolean>(false)//导入Json弹窗是否可见
const activeTab=ref<string>('widgets')//左侧面板激活的标签：组件库/表单模板
const formJsonStr=ref<string>('')//导出的Json字符串
const formJsonStr2=ref<string>('')//导入的Json字符串
const formJson = reactive<{ widgetList: Widget[]; formConfig: any }>(form1)
const formData=reactive<Record<string, any>>({})
const rendererRef=ref()//渲染器的引用


//删除组件
const removeWidget=(widget:Widget|null)=>{
    if(onselectedWidget.value?.id===widget?.id){//如果选中的组件是删除的组件，那么选中的组件就为空
        onselectedWidget.value=null
        onselectedWidgetId.value=null
    }
    saveHistory()
    formJson.widgetList=formJson.widgetList.filter(opt=>opt.id!==widget?.id)
}
//复制组件
const copyWidget=(widget:Widget|null)=>{
  if(!widget){return}
  saveHistory()
  //在这个组件的下面再复制一份组件
  let id=generateId()
  //不是追加到末尾，而是插入到当前组件的下面
  let copy=deepClone(widget)
  copy.id=id
  copy.options.name=getNextName(widget.type)
  console.log(copy.options.name)
  formJson.widgetList.splice(formJson.widgetList.indexOf(widget)+1,0,copy)
}
//上移组件
const moveUp=(widget:Widget|null)=>{
  if(!widget){return}
  //如果是第一个组件，那么就不上移
  if(formJson.widgetList.indexOf(widget)===0){return}
  //如果不是第一个组件，那么就上移
  else{
    saveHistory()
    const i = formJson.widgetList.indexOf(widget)
  // 上移：交换 i 和 i-1
  const tmp = formJson.widgetList[i]
  formJson.widgetList[i] = formJson.widgetList[i-1]
  formJson.widgetList[i-1] = tmp  
  }
}
//下移组件
const moveDown=(widget:Widget|null)=>{
  if(!widget){return}
  //如果是最后一个组件，那么就不下移
  if(formJson.widgetList.indexOf(widget)===formJson.widgetList.length-1){return}
  //如果不是最后一个组件，那么就下移
  else{
    saveHistory()
    const i = formJson.widgetList.indexOf(widget)
  // 下移：交换 i 和 i+1
  const tmp = formJson.widgetList[i]
  formJson.widgetList[i] = formJson.widgetList[i+1]
  formJson.widgetList[i+1] = tmp  
  }
}

//选到空白地方，把选中的组件清空，并显示formConfig的配置
const selectedEmpty=()=>{
  onselectedWidget.value=null
  onselectedWidgetId.value=null
  //在属性面板显示formConfig的配置
  console.log(111)
}
//选中组件
const selectedWidget=(widget:Widget|null)=>{
    onselectedWidget.value=widget
    onselectedWidgetId.value=widget?.id||null
}
//删除选项
const removeOption=(item:FieldOption|null)=>{
  if(!onselectedWidget.value?.options.optionItems){
    return
  }
  saveHistory()
  onselectedWidget.value.options.optionItems=onselectedWidget.value.options.optionItems.filter(opt=>opt!==item)||[]
}
//新增选项
const addOption=()=>{
  if(!onselectedWidget.value?.options.optionItems){
    return
  }
  saveHistory()
  onselectedWidget.value.options.optionItems.push({label:'',value:''})
}
const getForm=async()=>{
  //校验表单
  try{
    await rendererRef.value.validateForm()
    const getData=await rendererRef.value.getFormData()
    console.log(getData)
    console.log(formData)
    console.log(getData)
    console.log(formData)
  }catch(error){
    //加弹窗提示
    ElMessage.error({
      message: '请输入必填字段',
      type: 'error'
    })
    return
  }
  }
//点击组件库，把组件库中的组件追加到formJson里
const addWidget=(type:string)=>{
  saveHistory()
  const widget=basicFieldsLabel.find(widget=>widget.type===type)
  let id=generateId()
  let name=getNextName(type)
  if(!widget){return}
  formJson.widgetList.push({formItemFlag:widget.formItemFlag,category:widget.category,
    children:deepClone(widget.children),type:widget.type,id,options:{...deepClone(widget.options),name}})
}
//预览表单
const previewForm=()=>{
  previewVisible.value=true
}
//导出JSON
const exportJson=()=>{
  formJsonStr.value=JSON.stringify(formJson, null, 2)
  exportJsonVisible.value=true
}
//复制Json
const copyJson=()=>{
  navigator.clipboard.writeText(formJsonStr.value)
}
//导入Json
const importJson=()=>{
  importJsonVisible.value=true
}
//导入Json提交
const importJsonSubmit=()=>{
  //解析Json字符串
  try {
    const json = JSON.parse(formJsonStr2.value)
    //判断是否是Json字符串，是否有widgetList和formConfig，widgetList是否是数组，formConfig是否是对象
    if (json.widgetList && json.formConfig && Array.isArray(json.widgetList) && typeof json.formConfig === 'object') {
      saveHistory()
      formJson.widgetList = json.widgetList
      formJson.formConfig = json.formConfig
      //导入新Json后，属性面板指向的当前组件要清空为null
      onselectedWidget.value=null
      onselectedWidgetId.value=null
    }
  } catch (error) {
    //加弹窗提示，表单不关
    ElMessage.error({
      message: '导入Json失败',
      type: 'error'
    })
    }
  importJsonVisible.value=true
}
//重置表单
const resetForm =()=>{
  //清空formData，把formData里的数据清空
  const clearFormData=()=>{
    Object.keys(formData).forEach(key=>delete formData[key])
  }
  clearFormData()
  //清空formJson，formConfig用默认值，widgetList清空
  formJson.widgetList=[]
  formJson.formConfig=getDefaultFormConfig()
  //属性面板中指向的当前组件要清空为null
  onselectedWidget.value=null
  onselectedWidgetId.value=null
}
//记录组件位置
const recordWidgets=(val:Widget[])=>{
  saveHistory()
  formJson.widgetList=val
}
//拖入定位
const cloneWidget=(widget:Widget)=>{
  console.log(widget)
  let id=generateId()
  let name=getNextName(widget.type)
  saveHistory()
  return {formItemFlag:widget.formItemFlag,category:widget.category,
    children:deepClone(widget.children),type:widget.type,id,options:{...deepClone(widget.options),name}}
}

//清空表单验证
const clearValidate=()=>{
  rendererRef.value.clearValidate(onselectedWidget.value?.options.name)
}
//给formData中的每一个name一个唯一、稳定、有意义的值
const getNextName=(type:string)=>{
  let i=1
  while(formJson.widgetList.some(widget=>widget.type===type&&widget.options.name===type+i)){
    i++
  }
  return type+i
}
const undoStack=ref<any[]>([])//里面存的是撤销栈
//撤销与重做
const undo=()=>{
  if(undoStack.value.length===0){
    return
  }
  redoStack.value.push(deepClone(formJson))
  console.log(undoStack.value)
  Object.assign(formJson,undoStack.value.pop()||{})
}
//存档
const saveHistory=()=>{
  //把当前的状态压入撤销栈
  //每次操作前存档
  undoStack.value.push(deepClone(formJson))
  redoStack.value=[]
}
//重做，重做本身也要存档放到栈里面
const redoStack=ref<any[]>([])//里面存的是重做栈
const redo=()=>{
  if(redoStack.value.length===0){
    return
  }
  undoStack.value.push(deepClone(formJson))
  Object.assign(formJson,redoStack.value.pop()||{})
}


</script>



<style scoped>
.designer {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.designer-header {
  flex-shrink: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.designer-body {
  flex: 1;
  overflow: hidden;
}

.designer-container {
  height: 100%;
}

.designer-aside {
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.designer-aside:first-child {
  border-right: 1px solid #ebeef5;
}

.designer-aside:last-child {
  border-right: none;
  border-left: 1px solid #ebeef5;
}

/* ============ 左侧组件库 ============ */
.widget-library {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.library-switch {
  display: flex;
  flex-shrink: 0;
  padding: 12px;
  gap: 8px;
  background: #f7f8fa;
  border-bottom: 1px solid #ebeef5;
}

.library-tab {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
}

.library-tab:hover {
  color: #667eea;
  border-color: #667eea;
}

.library-tab.active {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.library-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip {
  color: #909399;
  font-size: 14px;
}

.widget-card {
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.25s ease;
  border: 1px solid #ebeef5;
}

.widget-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.widget-card :deep(.el-card__body) {
  padding: 12px 14px;
}

.widget-card-label {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* ============ 中间画布 ============ */
.designer-canvas {
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: #f5f7fa;
  padding: 0;
}

.canvas-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.toolbar-btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

/* 透明按钮（导入/导出） */
.toolbar-btn-transparent {
  background: transparent !important;
  border: none !important;
  color: #667eea !important;
  box-shadow: none !important;
  padding: 8px 12px;
}

.toolbar-btn-transparent:hover {
  background: rgba(102, 126, 234, 0.08) !important;
  color: #764ba2 !important;
  transform: translateY(0);
  box-shadow: none !important;
}

.renderer {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

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
