<template>
    <el-dialog title="导出代码" v-model="visible" width="80%">
        <el-input v-model="codeStr" type="textarea" :rows="24" readonly placeholder="生成的代码" />
        <template #footer>
            <el-button @click="visible = false">关闭</el-button>
            <el-button type="primary" @click="copyCode">复制代码</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateCode } from '../utils/codegen.ts'

const props = defineProps<{ formJson: any }>()

const visible = ref(false)//弹窗是否显示
const codeStr = ref('')//生成的代码

// 打开时用当前 formJson 重新生成代码
function open() {
    codeStr.value = generateCode(props.formJson)
    visible.value = true
}

async function copyCode() {
    await navigator.clipboard.writeText(codeStr.value)
    ElMessage.success('已复制')
}

defineExpose({ open })
</script>