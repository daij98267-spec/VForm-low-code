<template>
  <div class="designer">
    <header class="designer-header">低代码表单设计器</header>
    <div class="designer-body">
      <el-container class="designer-container">
        <el-aside width="260px" class="designer-aside">
          <div class="widget-library">
            <!--标签切换-->
            <div class="library-switch">
              <div class="library-tab" :class="{ active: activeTab === 'widgets' }" @click="activeTab = 'widgets'">组件库</div>
              <div class="library-tab" :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'">表单模板</div>
              <div class="library-tab" :class="{ active: activeTab === 'forms' }" @click="activeTab = 'forms'">我的表单</div>
            </div>
            <!--组件库内容-->
            <div v-show="activeTab === 'widgets'" class="library-content">
              <!--子标签：组件/容器（分段切换式）-->
              <div class="sub-switch" :class="{ right: libraryTab === 'containers' }">
                <div class="sub-switch-thumb"></div>
                <div class="sub-switch-option" :class="{ active: libraryTab === 'fields' }" @click="libraryTab = 'fields'">组件</div>
                <div class="sub-switch-option" :class="{ active: libraryTab === 'containers' }" @click="libraryTab = 'containers'">容器</div>
              </div>
              <draggable
                :list="libraryWidgets"
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
            <!--表单模板-->
            <div v-show="activeTab === 'templates'" class="library-content">
                <el-card v-for="t in templates" :key="t.name" class="template-card" shadow="hover" @click="loadTemplate(t)">
                  <div class="template-card-name">{{ t.name }}</div>
                  <div class="template-card-desc">{{ t.description }}</div>
                </el-card>  
            </div>
            <!--我的表单-->
              <div v-show="activeTab === 'forms'" class="library-content">
                <MyForms @loadForm="loadForm"/>
              </div>
          </div>
        </el-aside>
        <!--渲染器，渲染器给组件库落脚点-->
        <el-main class="designer-canvas">
          <div class="canvas-toolbar">
            <div class="toolbar-left">
              <el-button type="primary" class="toolbar-btn" @click="saveMyForm">保存</el-button>
              <el-button type="success" class="toolbar-btn" @click="getForm">提交</el-button>
              <el-button type="info" class="toolbar-btn" @click="previewForm">预览</el-button>
              <el-button type="danger" class="toolbar-btn" @click="resetForm">重置表单</el-button>
              <!--撤销与重做-->
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="undo">←</el-button>
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="redo">→</el-button>
            </div>
            <div class="toolbar-right">
              <!--导出代码弹窗-->
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="codeDialogRef.open()">导出代码</el-button>
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="exportJson">导出Json</el-button>
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="importJson">导入Json</el-button>
              <el-button type="primary" class="toolbar-btn toolbar-btn-transparent" text @click="aiVisible = !aiVisible">智能助手</el-button>              
            </div>
          </div>
          <div class="renderer" @click="selectedEmpty">
        <Renderer ref="rendererRef" :formJson="formJson" :formData="formData"
         />
        </div>
        </el-main>
        <el-aside width="360px" class="designer-aside">
          <!--属性面板-->
          <PropertyPanel
           :onselectedWidget="onselectedWidget"
           :formJson="formJson"
           @clear-validate="clearValidate"
           @remove-option="removeOption"
           @add-option="addOption" />
        </el-aside>
        <!--智能助手弹窗-->
        <el-aside v-if="aiVisible" width="320px" class="designer-aside" style="border-left: 1px solid #ebeef5;">
          <ChatAI :formJson="formJson" />
        </el-aside>
      </el-container>
    </div>
    <!--预览表单弹窗-->
    <el-dialog title="预览表单" v-model="previewVisible" width="80%">
      <Renderer :formJson="formJson" :formData="formData" preview />
      <el-button type="primary" @click="previewVisible=false">关闭</el-button>
    </el-dialog>
    <!--导出代码弹窗-->
    <CodeDialog ref="codeDialogRef" :formJson="formJson" />
    <!--导出Json弹窗-->
    <el-dialog title="导出Json" v-model="exportJsonVisible" width="80%">
      <el-input v-model="formJsonStr" placeholder="请输入Json字符串" type="textarea" rows="20" readonly />
      <el-button type="primary" @click="exportJsonVisible=false">关闭</el-button>
      <el-button type="primary" @click="copyJson">复制Json</el-button>
    </el-dialog>
    <!--提交表单弹窗-->
  <el-dialog title="提交结果" v-model="submitVisible" width="80%">
    <pre class="submit-result">{{ submitResult }}</pre>
    <el-button type="primary" @click="submitVisible=false">关闭</el-button>
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
import form1 from '../examples/form1.ts'
import { ref,reactive,provide,computed } from 'vue'
import {generateId,deepClone} from '../utils/util.ts'
import type { Widget ,FieldOption} from '../utils/type.ts'
import { ElMessage,ElMessageBox } from 'element-plus'
import { getDefaultFormConfig } from '../utils/util.ts'
import draggable from 'vuedraggable'
import { hasName,findParentArray,findOwner } from '../utils/tree.ts'
import PropertyPanel from '../designer/PropertyPanel.vue'
import { templates } from '../examples/templates.ts'
import CodeDialog from '../designer/codeDialog.vue'
import ChatAI from '../designer/ChatAI.vue'
import MyForms from '../forms/MyForms.vue'
import { saveForm,submitForm } from '../forms/api.ts'
import { useHistory } from '../utils/useHistory.ts'

const onselectedWidgetId=ref<string|null>(null)//被选中组件的id
const onselectedWidget=ref<Widget|null>(null)//被选中的组件
const previewVisible=ref<boolean>(false)//预览表窗是否可见
const exportJsonVisible=ref<boolean>(false)//导出Json弹窗是否可见
const importJsonVisible=ref<boolean>(false)//导入Json弹窗是否可见
const activeTab=ref<string>('widgets')//左侧面板激活的标签：组件库/表单模板/我的表单
const libraryTab=ref<string>('fields')//组件库里激活的子标签：组件/容器
//按子标签过滤组件库：组件显示formItemFlag为true的字段，容器显示formItemFlag为false的容器
const libraryWidgets=computed(()=>
  basicFieldsLabel.filter(w=>libraryTab.value==='fields'?w.formItemFlag===true:w.formItemFlag===false)
)
const formJsonStr=ref<string>('')//导出的Json字符串
const formJsonStr2=ref<string>('')//导入的Json字符串
const formJson = reactive<{ widgetList: Widget[]; formConfig: any }>(form1)
const formData=reactive<Record<string, any>>({})
const rendererRef=ref()//渲染器的引用
const submitVisible=ref<boolean>(false)//提交表窗是否可见
const submitResult=ref<string>('')//提交结果，Json字符串
const codeDialogRef=ref()//导出代码弹窗的引用
const aiVisible=ref<boolean>(false)//智能助手弹窗是否可见
const currentId=ref<string>('')//当前的表单id
const { execute, addWidgetCommand, removeWidgetCommand,undo,redo,
  moveWidgetCommand, addOptionCommand, removeOptionCommand,addColCommand,removeColCommand,
  replaceFormCommand } = useHistory(formJson, formData)

//加载模板
 const loadTemplate = (template: any) => {
    execute(replaceFormCommand(
      deepClone(template.formJson.widgetList),
      deepClone(template.formJson.formConfig)
    ))
    onselectedWidget.value = null
    onselectedWidgetId.value = null
  }

//删除组件
 const removeWidget = (widget: Widget | null) => {
    if (!widget) return
    if (onselectedWidget.value?.id === widget.id) {
      onselectedWidget.value = null
      onselectedWidgetId.value = null
    }
    execute(removeWidgetCommand(widget))
  }
//复制组件
const copyWidget = (widget: Widget | null) => {
  if (!widget) return
  const copy = deepClone(widget)
  copy.id = generateId()
  copy.options.name = getNextName(widget.type)
  const parentArr = findParentArray(formJson.widgetList, widget)
  if (!parentArr) return
  execute(addWidgetCommand(copy, parentArr, parentArr.indexOf(widget) + 1))
}
//上移组件
 const moveUp = (widget: Widget | null) => {
    if (!widget) return
    const parentArr = findParentArray(formJson.widgetList, widget)
    if (!parentArr || parentArr.indexOf(widget) === 0) return
    execute(moveWidgetCommand(widget, parentArr, -1))
  }
//下移组件
 const moveDown = (widget: Widget | null) => {
    if (!widget) return
    const parentArr = findParentArray(formJson.widgetList, widget)
    if (!parentArr || parentArr.indexOf(widget) === parentArr.length - 1) return
    execute(moveWidgetCommand(widget, parentArr, 1))
  }
//选中父组件
const selectParentWidget=(widget:Widget|null)=>{
  if(!widget){return}
  const parentArr=findParentArray(formJson.widgetList, widget)
  if(!parentArr){return}
  //拿到父组件的id
  if (parentArr === formJson.widgetList) { return }
const parent=findOwner(formJson.widgetList,parentArr)
selectedWidget(parent)
}
//选到空白地方，把选中的组件清空，并显示formConfig的配置
const selectedEmpty=()=>{
  onselectedWidget.value=null
  onselectedWidgetId.value=null
  //在属性面板显示formConfig的配置
}
//选中组件
const selectedWidget=(widget:Widget|null)=>{
    onselectedWidget.value=widget
    onselectedWidgetId.value=widget?.id||null
}
//删除选项
 const removeOption = (item: FieldOption | null) => {
    const optionItems = onselectedWidget.value?.options.optionItems
    if (!optionItems || !item) return
    execute(removeOptionCommand(optionItems, item))
  }
//新增选项
const addOption = () => {
    const optionItems = onselectedWidget.value?.options.optionItems
    if (!optionItems) return
    execute(addOptionCommand(optionItems))
  }
const getForm=async()=>{
  //校验表单是否完整
  try{
    await rendererRef.value.validateForm()
    const getData=await rendererRef.value.getFormData()
    submitVisible.value=true
    submitResult.value=JSON.stringify(getData, null, 2)
    //调接口放到submission表里
    await submitForm(currentId.value,getData)
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
 const addWidget = (type: string) => {
    performance.mark('addWidget-start')
    performance.mark('collectField-start')
    const template = basicFieldsLabel.find(w => w.type === type)
    performance.mark('collectField-end')
    if (!template) return
    performance.mark('defineWidget-start')
    const widget: Widget = deepClone(template)   // 一次深拷，options/children/formItemFlag 全带走
    widget.id = generateId()                     // 注入唯一 id
    widget.options.name = getNextName(type)      // 注入唯一 name
    performance.mark('defineWidget-end')
    performance.mark('saveHistory-start')
    execute(addWidgetCommand(widget, formJson.widgetList, formJson.widgetList.length))
    performance.mark('saveHistory-end')
    performance.mark('addWidget-end')
    const segments = [
  ['addWidget总计', 'addWidget-start', 'addWidget-end'],
  ['查找组件模板', 'collectField-start', 'collectField-end'],
  ['构造widget(deepClone)', 'defineWidget-start', 'defineWidget-end'],
  ['execute入栈', 'saveHistory-start', 'saveHistory-end'],
] as const

segments.forEach(([name, s, e]) => performance.measure(name, s, e))
console.table(
  performance.getEntriesByType('measure')
    .filter(m => segments.some(([n]) => n === m.name))
    .map(m => ({ 阶段: m.name, 耗时ms: m.duration.toFixed(3) }))
)
segments.forEach(([, s, e]) => { performance.clearMarks(s); performance.clearMarks(e) })
segments.forEach(([n]) => performance.clearMeasures(n))
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
 const importJsonSubmit=async()=>{
    try {
      const json = JSON.parse(formJsonStr2.value)
      if (json.widgetList && json.formConfig && Array.isArray(json.widgetList) && typeof json.formConfig === 'object') {
        execute(replaceFormCommand(json.widgetList, json.formConfig))
        onselectedWidget.value=null
        onselectedWidgetId.value=null
        importJsonVisible.value=false
        ElMessage.success({ message: '导入Json成功', type: 'success' })
      }
    } catch (error) {
      ElMessage.error({ message: '导入Json失败', type: 'error' })
      importJsonVisible.value=false
    }
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
  formJson.widgetList=val
}
//拖入定位
const cloneWidget=(widget:Widget)=>{
  let id=generateId()
  let name=getNextName(widget.type)
  return {formItemFlag:widget.formItemFlag,category:widget.category,
    children:deepClone(widget.children),type:widget.type,id,options:{...deepClone(widget.options),name}}
}

//清空表单验证
const clearValidate=()=>{
  rendererRef.value.clearValidate(onselectedWidget.value?.options.name)
}
//给formData中的每一个name一个唯一、稳定、有意义的值
const getNextName = (type: string) => {
  //递归查找整棵树是否存在name
  let i=1
  while(hasName(formJson.widgetList,type+i)){
    i++
  }
  return type+i
}

//增加列
 const addCol = (widget: Widget, index: number) => {
    if (widget.children!.length < 4) {
      if (widget.type === 'tabs') {
        ElMessageBox.prompt('请输入tab标签', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
        }).then((tabName) => {
          if (tabName.value) execute(addColCommand(widget, index, tabName.value))
        }).catch(() => {})
      } else if (widget.type === 'grid') {
        execute(addColCommand(widget, index))
      }
    }
  }
  const removeCol = (widget: Widget, index: number) => {
    if (widget.children!.length === 1) {
      ElMessage.error({ message: '至少保留有一列', type: 'error' })
      return
    }
    if (widget.children![index].length > 0) {
      ElMessageBox.confirm('确认删除这一列吗？', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        if (widget.children![index].find((item) => item.id === onselectedWidget.value?.id)) {
          onselectedWidget.value = null
          onselectedWidgetId.value = null
        }
        execute(removeColCommand(widget, index))
      })
    } else {
      execute(removeColCommand(widget, index))
    }
  }
  const loadForm=(MyformJson:any,id:string)=>{
      try {
          if (!MyformJson || !MyformJson.widgetList) {
              ElMessage.error('该表单数据为空或不存在')
              return
          }
          execute(replaceFormCommand(
              deepClone(MyformJson.widgetList),
              deepClone(MyformJson.formConfig ?? getDefaultFormConfig())
          ))
          currentId.value=id
          onselectedWidget.value = null
          onselectedWidgetId.value = null
          ElMessage.success('表单已载入')
      } catch (error) {
          ElMessage.error('加载表单失败')
      }
  }
//保存表单
const saveMyForm=async()=>{
  //拿到当前id
  await saveForm(currentId.value,JSON.stringify(formJson))
  if(currentId.value){
    ElMessage.success('表单已保存')
  }
  else{
    ElMessage.error('保存失败')
  }
}
//提供方法，组件之间的通信
provide('formCtx', {
    selectedWidget, removeWidget, copyWidget, moveUp, moveDown,
    selectParentWidget, addCol, removeCol, recordWidgets,
    selectedWidgetId: computed(() => onselectedWidgetId.value),
})
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

/* 组件库内的分段切换器：组件/容器 */
.sub-switch {
  position: relative;
  display: flex;
  margin-bottom: 10px;
  padding: 3px;
  background: #f0f1f5;
  border-radius: 999px;
}

.sub-switch-thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc(50% - 3px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
  transition: transform 0.25s ease;
}

.sub-switch.right .sub-switch-thumb {
  transform: translateX(100%);
}

.sub-switch-option {
  position: relative;
  z-index: 1;
  flex: 1;
  text-align: center;
  padding: 6px 0;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  user-select: none;
  transition: color 0.25s ease;
}

.sub-switch-option.active {
  color: #fff;
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

  .template-card {
    margin-bottom: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid #ebeef5;
  }
  .template-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  }
  .template-card :deep(.el-card__body) {
    padding: 12px 14px;
  }
  .template-card-name {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
  .template-card-desc {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
</style>
