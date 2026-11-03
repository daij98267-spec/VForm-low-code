<template>
    <div ref="panelRef" class="ai-panel">
        <!-- 左缘拖拽条：按住左右拖动，可伸缩整个侧边栏 -->
        <div class="ai-resize-handle" title="拖动调整宽度" @pointerdown="onResizeStart"></div>

        <!-- 头部 -->
        <div class="ai-panel-header">
            <span class="ai-panel-dot"></span>
            <span class="ai-panel-title">AI 助手</span>
            <span class="ai-panel-sub">流式对话</span>
        </div>

        <!-- 消息列表 -->
        <div ref="listRef" class="ai-message-list">
            <div v-if="messages.length === 0 && !aiLoading" class="ai-empty">
                和我聊天吧~<br />可以问表单设计、字段配置、校验规则
            </div>

            <div v-for="(msg, i) in messages" :key="i" class="ai-message-row"
                :class="msg.role === 'user' ? 'is-user' : 'is-ai'">
                <div class="ai-bubble">{{ msg.content }}</div>
            </div>

            <!-- 加载中的圈圈（只在 AI 还没吐出第一个字时显示） -->
            <div v-if="aiLoading && messages[messages.length - 1]?.content === ''" class="ai-message-row is-ai">
                <div class="ai-bubble ai-loading-bubble"><span class="ai-spinner"></span></div>
            </div>
        </div>

        <!-- 底部输入区 -->
        <div class="ai-input-row">
            <el-input v-model="aiPrompt" type="textarea" :rows="2" resize="none" placeholder="输入消息，Enter 发送…" />
            <el-button type="primary" :loading="aiLoading" class="ai-send-btn" @click="sendMessage">发送</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, reactive,onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface ChatMessage {
    role: 'user' | 'ai'
    content: string
}

const aiPrompt = ref<string>('')
const aiLoading = ref<boolean>(false)
const messages = ref<ChatMessage[]>([])
const listRef = ref<HTMLElement>()

// 滚动到最底部
const scrollToBottom = async () => {
    await nextTick()
    const el = listRef.value
    if (el) el.scrollTop = el.scrollHeight
}
//发送消息
const sendMessage = async () => {
    const text = aiPrompt.value.trim()//用户的提示词去掉空格
    if (!text) {
        ElMessage.warning('请先输入描述')
        return
    }
    // 先把用户的话推到右侧
    messages.value.push({ role: 'user', content: text })
    aiPrompt.value = ''
    aiLoading.value = true

    const aiMsg = reactive({ role: 'ai' as const, content: '' })
    messages.value.push(aiMsg)
    scrollToBottom()

    try {
        const resp = await fetch('http://localhost:3000/llm/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })

        const reader = resp.body!.getReader()              // ② 开始拉流
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            let idx
            while ((idx = buffer.indexOf('\n\n')) !== -1) {
                const event = buffer.slice(0, idx)
                buffer = buffer.slice(idx + 2)
                if (!event.startsWith('data:')) continue
                const jsonStr = event.slice(5).trim()
                if (jsonStr === '[DONE]') continue          // ③ 你自己的后端发 [DONE]
                const text2 = JSON.parse(jsonStr)           // ④ 这里解析出来是纯字符串，不是 {content}
                if (text2) aiMsg.content += text2
            }
        }
        aiLoading.value = false
        scrollToBottom()
    }
    catch (err) {
        ElMessage.error('AI 助手回复失败')
    }
}


// ==================== 新增：侧边栏拖拽伸缩（纯 UI，与聊天逻辑无关） ====================
const panelRef = ref<HTMLElement>()
let asideEl: HTMLElement | null = null
let startX = 0
let startWidth = 0

onMounted(() => {
    // 面板在最右侧的 el-aside 里，拖拽条直接改它的宽度，不侵入 index.vue
    asideEl = (panelRef.value?.closest('.el-aside') as HTMLElement) ?? null
})

const onResizeStart = (e: PointerEvent) => {
    if (!asideEl) return
    startX = e.clientX
    startWidth = asideEl.getBoundingClientRect().width
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', onResizeEnd)
}

const onResizeMove = (e: PointerEvent) => {
    if (!asideEl) return
    // 面板贴屏幕右缘：鼠标往左拖 = 变宽
    const w = startWidth + (startX - e.clientX)
    asideEl.style.width = Math.min(640, Math.max(260, w)) + 'px'
}

const onResizeEnd = () => {
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('pointermove', onResizeMove)
    window.removeEventListener('pointerup', onResizeEnd)
}
</script>

<style scoped>
.ai-panel {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-sizing: border-box;
}

/* ---------- 左缘拖拽条 ---------- */
.ai-resize-handle {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 7px;
    cursor: col-resize;
    z-index: 10;
}

.ai-resize-handle::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: transparent;
    transition: background 0.15s, width 0.15s;
}

.ai-resize-handle:hover::after {
    width: 3px;
    left: 2px;
    background: #409eff;
}

/* ---------- 头部 ---------- */
.ai-panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;
}

.ai-panel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #409eff, #7c3aed);
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
}

.ai-panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.ai-panel-sub {
    margin-left: auto;
    font-size: 11px;
    color: #c0c4cc;
}

/* ---------- 消息列表 ---------- */
.ai-message-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    background: #f7f8fa;
}

.ai-message-list::-webkit-scrollbar {
    width: 6px;
}

.ai-message-list::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
}

.ai-message-list::-webkit-scrollbar-thumb:hover {
    background: #c0c4cc;
}

.ai-empty {
    margin: auto;
    color: #909399;
    font-size: 13px;
    line-height: 1.8;
    text-align: center;
}

/* ---------- 消息气泡 ---------- */
.ai-message-row {
    display: flex;
}

.ai-message-row.is-user {
    justify-content: flex-end;
}

.ai-message-row.is-ai {
    justify-content: flex-start;
}

.ai-bubble {
    max-width: 85%;
    padding: 9px 13px;
    font-size: 13px;
    line-height: 1.65;
    white-space: pre-wrap;
    word-break: break-word;
}

.is-user .ai-bubble {
    background: #409eff;
    color: #fff;
    border-radius: 12px 12px 4px 12px;
}

.is-ai .ai-bubble {
    background: #ffffff;
    color: #303133;
    border: 1px solid #e4e7ed;
    border-radius: 12px 12px 12px 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* ---------- 加载动画 ---------- */
.ai-loading-bubble {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 36px;
}

.ai-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #dcdfe6;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ---------- 底部输入区 ---------- */
.ai-input-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    padding: 12px 16px;
    border-top: 1px solid #ebeef5;
    background: #ffffff;
    flex-shrink: 0;
}

.ai-input-row .el-input {
    flex: 1;
}

.ai-input-row :deep(.el-textarea__inner) {
    background: #f5f7fa;
    border-radius: 10px;
    padding: 9px 12px;
    transition: background 0.2s, box-shadow 0.2s;
}

.ai-input-row :deep(.el-textarea__inner:focus) {
    background: #ffffff;
    box-shadow: 0 0 0 1px #409eff inset;
}

.ai-send-btn {
    border-radius: 10px;
    height: 40px;
    padding: 0 18px;
}
</style>
