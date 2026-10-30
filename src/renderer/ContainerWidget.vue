 <template>
    <!-- 容器：一行 el-row，按列数拆成几个 el-col -->
    <el-row :gutter="10">
      <!-- children 现在是二维数组，children[i] 就是一列 -->
      <el-col
        v-for="(col, i) in (widget.children || [])"
        :key="i"
        :span="24 / colCount"
      >
        <!-- 每一列自己是一个 draggable，list 就绑这一列 -->
        <draggable
          :list="col"
          item-key="id"
          :group="{ name: 'widgets', pull: true, put: true }"
          class="col-draggable"
        >
          <template #item="{ element: child }">
            <div>
              <!-- 孩子还是容器 → 递归：自己调自己 -->
              <ContainerWidget
                v-if="child.formItemFlag === false"
                :widget="child"
                :formData="formData"
              />
              <!-- 孩子是字段 → 叶子，正常渲染 -->
              <el-form-item
                v-else
                :label="child.options.label"
                :prop="child.options.name"
                :rules="getRules(child)"
                :class="{ highlight: child.id === selectedWidgetId && !preview }"
                @click.stop="selectWidget(child)"
              >
                <component :is="basicFields[child.type]" :widget="child" :formData="formData" />
                <br>
                <hr>
                <el-button type="danger" size="small" v-if="!preview" @click.stop="removeWidget(child)">x</el-button>
                <el-button type="success" size="small" v-if="!preview" @click.stop="copyWidget(child)">复制</el-button>
                <el-button type="primary" size="small" v-if="!preview" @click.stop="moveUp(child)">↑</el-button>
                <el-button type="primary" size="small" v-if="!preview" @click.stop="moveDown(child)">↓</el-button>
                <el-button type="info" size="small" v-if="!preview" @click.stop="selectParentWidget(child)">父组件</el-button>
              </el-form-item>
            </div>
          </template>
        </draggable>
      </el-col>
    </el-row>
  </template>

  <script setup lang="ts">
  import { computed, inject } from 'vue'
  import { basicFields } from '../widgets/registry'
  import type { Widget } from '../utils/type.ts'
  import draggable from 'vuedraggable'

  const props = defineProps<{
    widget: Widget
    formData: Record<string, any>
  }>()

  // 列数 = children.length。原来读 options.cols，现在删掉，直接数数组
  const colCount = computed(() => props.widget.children?.length || 1)

  // 和 renderer/index.vue 里那份一样，回头抽 util.ts 共享
  const getRules = (widget: Widget) => {
    if (widget.options.required) {
      const trigger = ['input', 'textarea'].includes(widget.type) ? 'blur' : 'change'
      return [{ required: true, message: '请输入' + widget.options.label, trigger }]
    }
    return []
  }

  const {
    selectWidget, removeWidget, copyWidget, moveUp, moveDown,
    selectedWidgetId, preview,selectParentWidget
  } = inject<any>('formCtx')!
  </script>

  <style scoped>
  .highlight { outline: 2px solid #409eff; }
  .el-button { margin-left: 10px; }
.col-draggable {
    min-height: 80px;            /* 空的保持 80px，有内容自动长高 */
    border: 1px dashed #c0c4cc;  /* 虚线边框，让空列可见 */
    border-radius: 4px;          /* 圆角，好看点 */
    padding: 4px;                /* 让里面的组件别贴着边框 */
  }
  </style>