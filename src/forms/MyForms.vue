<template>
    <div class="my-forms">
        <!-- 顶部小标题行 -->
        <div class="forms-header">
            <span class="forms-title">已保存的表单</span>
            <el-button type="primary" size="small" @click="dialogVisible=true">新建表单</el-button>
            <span class="forms-count" v-if="forms.length">{{ forms.length }}</span>
        </div>

        <!-- 列表 -->
        <div class="form-list">
            <el-card v-for="f in forms" :key="f.id" class="form-card" shadow="never" @click="loadForm(f.id)">
                <div class="form-card-name">
                    <span class="form-card-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                        </svg>
                    </span>
                    {{ f.title }}
                </div>
                <div class="form-card-desc">{{ f.created_at }}</div>
            </el-card>
        </div>

        <!-- 空状态 -->
        <div class="form-empty" v-if="!forms.length">
            还没有保存过表单<br />保存后就会出现在这里
        </div>
        <el-dialog title="新建表单" v-model="dialogVisible" width="30%">
            <el-input v-model="formTitle" placeholder="请输入表单标题" />
            <el-button type="primary" @click="create">新建</el-button>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getForms } from './api.ts'
import {getFormDetail,createForm} from './api.ts'

const forms = ref<any>([])
const dialogVisible = ref(false)
const formTitle = ref('')
//get请求拿到forms
const emit = defineEmits(['loadForm'])
onMounted(async () => { forms.value = await getForms() })

//加载表单
const loadForm=async(id:string)=>{
    const MyformJson=await getFormDetail(id)
    console.log(MyformJson)
    emit('loadForm', MyformJson)
}

//新建表单
const create=async()=>{
    const id=await createForm(formTitle.value)
    console.log(id)
}

</script>

<style scoped>
.my-forms {
    padding: 0;
}

/* ---------- 顶部标题行 ---------- */
.forms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 2px 8px;
}

.forms-title {
    font-size: 12px;
    color: #909399;
    letter-spacing: 0.5px;
}

.forms-count {
    min-width: 20px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    font-size: 11px;
    color: #667eea;
    background: rgba(102, 126, 234, 0.08);
    border-radius: 999px;
    padding: 0 6px;
}

/* ---------- 卡片列表 ---------- */
.form-list {
    display: flex;
    flex-direction: column;
}

.form-card {
    margin-bottom: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid #ebeef5;
}

.form-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.12);
}

.form-card :deep(.el-card__body) {
    padding: 12px 14px;
}

.form-card-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #303133;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.form-card-icon {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    flex-shrink: 0;
}

.form-card-desc {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    padding-left: 34px;
}

/* ---------- 空状态 ---------- */
.form-empty {
    padding: 32px 12px;
    text-align: center;
    font-size: 12px;
    color: #c0c4cc;
    line-height: 1.9;
}
</style>
