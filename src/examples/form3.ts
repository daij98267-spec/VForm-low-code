// 报名登记表：演示栅格容器 + 手机号校验
import { getDefaultFormConfig } from '../utils/util'

const widgetList = [
    {
        id: 'container_1',
        type: 'grid',
        options: {
            label: '栅格容器',
            name: 'container',
        },
        category: 'container',
        formItemFlag: false,
        icon: 'grid',
        children: [
            // 第 1 列
            [
                {
                    id: 'input_1',
                    type: 'input',
                    options: {
                        label: '姓名',
                        name: 'name',
                        placeholder: '请输入姓名',
                        required: true,
                        defaultValue: '',
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'input',
                },
                {
                    id: 'select_1',
                    type: 'select',
                    options: {
                        label: '性别',
                        name: 'gender',
                        placeholder: '请选择性别',
                        defaultValue: '男',
                        required: true,
                        optionItems: [
                            { label: '男', value: '男' },
                            { label: '女', value: '女' },
                        ],
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'select',
                },
            ],
            // 第 2 列
            [
                {
                    id: 'input_2',
                    type: 'input',
                    options: {
                        label: '手机号',
                        name: 'phone',
                        placeholder: '请输入手机号',
                        required: true,
                        defaultValue: '',
                        validation: 'mobilePhone',
                        validationHint: '请输入正确的手机号',
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'input',
                },
                {
                    id: 'datepicker_1',
                    type: 'datepicker',
                    options: {
                        label: '出生日期',
                        name: 'birthday',
                        placeholder: '请选择出生日期',
                        required: true,
                        // 不设 defaultValue：日期默认空，不预填
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'datepicker',
                },
            ],
        ],
    },
]

const formJson = {
    widgetList,
    formConfig: getDefaultFormConfig(),
}
export default formJson