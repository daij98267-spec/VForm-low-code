import type { Widget } from '../utils/type.ts'
//判断树中是否有指定名称的组件
export function hasName(list:Widget[],name:string):boolean{
    return list.some(widget=>{
        // 当前节点匹配
        if(widget.options.name===name){
            return true
        }
        // 递归子节点（这里子数组字段按需改：widget.widgetList / widget.children）
        if (widget.children && widget.children.length > 0) {
            //递归每列子节点
            for(const column of widget.children){
                if(hasName(column,name)){
                    return true
                }
            }
            return false
        }
        return false
    })
}
export function findParentArray(list: Widget[], widget: Widget | null): Widget[] | null {
    for (const item of list) {
      // 命中：widget 直接在这个 list 里，返回这个 list（就是它「所属的那一列」）
      if (item.id === widget?.id) {
        return list
      }
      // 没命中但有孩子（children 是二维，每一列是一个 Widget[]），逐列递归
      if (item.children) {
        for (const column of item.children) {
          const found = findParentArray(column, widget)
          if (found) return found
        }
      }
    }
    return null
  }

// 递归找children的父组件
export function findOwner(list: Widget[],parentArr:Widget[]): Widget | null {
  for (const w of list) {
    if (w.children) {
      // 二维：判断"某一列 === parentArr"
      for (const col of w.children) {
        if (col === parentArr) { return w }
      }
      // 递归：进每一列里找更深层嵌套的容器
      for (const col of w.children) {
        const found = findOwner(col,parentArr)
        if (found) return found
      }
    }
  }
  return null
}