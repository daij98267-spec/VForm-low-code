// // 把一个大的 widget 列表「分片」渲染进目标响应式数组，避免一次性挂载卡死主线程
// import { nextTick } from 'vue'
// import type { Widget } from './type.ts'

// const DEFAULT_CHUNK = 100

// export function renderWidgetsInChunks(
//     targetArray: Widget[],        // 要往里 push 的响应式数组（formJson.widgetList）
//     targetList: Widget[],         // 要渲染的完整目标列表
//     chunkSize: number = DEFAULT_CHUNK
// ): Promise<void> {
//     return new Promise((resolve) => {
//         targetArray.splice(0, targetArray.length)   // 原地清空，保留数组引用
//         let i = 0

//         // 调度器：优先 requestIdleCallback，不支持则 setTimeout 兜底
//         const schedule = (cb: () => void) => {
//             const ric = (window as any).requestIdleCallback
//             ric ? ric(() => cb(), { timeout: 100 }) : setTimeout(cb, 0)
//         }

//         const feed = () => {
//             targetArray.push(...targetList.slice(i, i + chunkSize))  // 一批 push，Vue 只新增这批 DOM
//             i += chunkSize
//             if (i < targetList.length) {
//                 schedule(feed)                          // 让浏览器先画这一批，再排下一批
//             } else {
//                 nextTick().then(() => resolve())        // 最后一批也等 DOM 刷完再 resolve
//             }
//         }

//         feed()
//     })
// }