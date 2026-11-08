import { ref } from 'vue'
import type { Widget,FieldOption } from './type.ts'
import { deepClone } from './util.ts'
import { findParentArray, captureWidgetData, deleteWidgetFormData,collectFieldNames,captureColumnData,deleteColumnFormData } from './tree.ts'

interface Command {
    do(): void//执行操作
    undo(): void//逆向恢复
}

export function useHistory(
    formJson: { widgetList: Widget[]; formConfig: any },
    formData: Record<string, any>
) {
    const undoStack = ref<Command[]>([])
    const redoStack = ref<Command[]>([])

    function execute(cmd: Command) {//执行操作
        cmd.do()//执行操作
        undoStack.value.push(cmd)//添加到撤销栈
        redoStack.value = []//清空重做栈
    }
    function record(cmd: Command) {//记录已经发生的操作
          undoStack.value.push(cmd)
          redoStack.value = []
    }
    function undo() {
        const cmd = undoStack.value.pop()
        if (!cmd) return
        cmd.undo()
        redoStack.value.push(cmd)
    }
    function redo() {
        const cmd = redoStack.value.pop()
        if (!cmd) return
        cmd.do()
        undoStack.value.push(cmd)
    }
    //比如删除一个组件的命令
    function removeWidgetCommand(widget: Widget): Command {
        const parentArr = findParentArray(formJson.widgetList, widget)!
        let index = -1
        let saved: Record<string, any> = {}
        return {
            do() {
                index = parentArr.indexOf(widget)//记录组件在父组件的位置
                saved = captureWidgetData(formData, widget)//捕获这个组件的所有formData值
                deleteWidgetFormData(formData, widget)//删除这个组件的所有formData值
                parentArr.splice(index, 1)//删除这个组件
            },
            undo() {
                parentArr.splice(index, 0, widget)//在父组件的位置插入这个组件
                Object.assign(formData, saved)//恢复这个组件的所有formData值
            }
        }
    }
     // 添加组件：把 widget 插到 parentArr 的第 index 位；undo = 摘掉 + 删数据
  function addWidgetCommand(widget: Widget, parentArr: Widget[], index: number): Command {
    return {
      do() {
        parentArr.splice(index, 0, widget)
      },
      undo() {
        parentArr.splice(parentArr.indexOf(widget), 1)
        deleteWidgetFormData(formData, widget)
      }
    }
  }
//上移下移
 function moveWidgetCommand(widget: Widget, parentArr: Widget[], delta: -1 | 1): Command {
    let from = -1
    let to = -1
    function swap() {
      const tmp = parentArr[from]
      parentArr[from] = parentArr[to]
      parentArr[to] = tmp
    }
    return {
      do() {
        from = parentArr.indexOf(widget)
        to = from + delta
        swap()
      },
      undo() {
        swap()   // from/to 还是那两个位置，再换一次 = 还原
      }
    }
  }

  //增删选项
   function removeOptionCommand(optionItems: FieldOption[], item: FieldOption): Command {
    let index = -1
    return {
      do() {
        index = optionItems.indexOf(item)
        optionItems.splice(index, 1)
      },
      undo() {
        optionItems.splice(index, 0, item)
      }
    }
  }

  function addOptionCommand(optionItems: FieldOption[]): Command {
    const item: FieldOption = { label: '', value: '' }   // 在 do 外建好，redo 时还是同一个对象
    return {
      do() {
        optionItems.push(item)
      },
      undo() {
        optionItems.pop()
      }
    }
  }
  //增删列
 function addColCommand(widget: Widget, index: number, tabName?: string): Command {
    return {
      do() {
        widget.children!.splice(index + 1, 0, [])
        if (widget.type === 'tabs' && tabName !== undefined) {
          widget.options.tabNames!.splice(index + 1, 0, tabName)
        }
      },
      undo() {
        widget.children!.splice(index + 1, 1)
        if (widget.type === 'tabs' && tabName !== undefined) {
          widget.options.tabNames!.splice(index + 1, 1)
        }
      }
    }
  }

  function removeColCommand(widget: Widget, index: number): Command {
    let removedCol: Widget[] = []
    let removedTabName: string | undefined
    let savedData: Record<string, any> = {}
    return {
      do() {
        removedCol = widget.children![index]
        savedData = captureColumnData(formData, removedCol)  // 1. 记住数据
        deleteColumnFormData(formData, removedCol)           // 2. 删数据
        widget.children!.splice(index, 1)                    // 3. 删结构
        if (widget.type === 'tabs') {
          removedTabName = widget.options.tabNames![index]
          widget.options.tabNames!.splice(index, 1)
        }
      },
      undo() {
        widget.children!.splice(index, 0, removedCol)
        if (widget.type === 'tabs' && removedTabName !== undefined) {
          widget.options.tabNames!.splice(index, 0, removedTabName)
        }
        Object.assign(formData, savedData)                   // 数据写回
      }
    }
  }
  //整树替换，加载表单
  function replaceFormCommand(newWidgetList: Widget[], newFormConfig: any): Command {
    let oldWidgetList: Widget[] = []
    let oldFormConfig: any = null
    let oldFormData: Record<string, any> = {}
    const clearFormData = () => Object.keys(formData).forEach(k => delete formData[k])
    return {
      do() {
        oldWidgetList = deepClone(formJson.widgetList)
        oldFormConfig = deepClone(formJson.formConfig)
        oldFormData = deepClone(formData)
        clearFormData()
        formJson.widgetList = newWidgetList
        formJson.formConfig = newFormConfig
      },
      undo() {
        clearFormData()
        Object.assign(formData, oldFormData)
        formJson.widgetList = oldWidgetList
        formJson.formConfig = oldFormConfig
      }
    }
  }
  //浅快照
   function replaceStructureCommand(before: Widget[], after: Widget[]): Command {
    return {
      do()   { formJson.widgetList = after },
      undo() { formJson.widgetList = before }
    }
  }
    return { execute, undo, redo, removeWidgetCommand,addWidgetCommand,replaceFormCommand,
      addColCommand,removeColCommand,addOptionCommand,removeOptionCommand,moveWidgetCommand,
      replaceStructureCommand,record
    }
}