// 用户偏好设置：演示选项卡容器 + switch/slider/checkbox 控件
import { getDefaultFormConfig } from '../utils/util'

const widgetList = [
    {
        id: 'tabs_1',
        type: 'tabs',
        options: {
            label: '选项卡',
            name: 'container',
            tabNames: ['基础设置', '偏好设置'],
        },
        category: 'container',
        formItemFlag: false,
        icon: 'tabs',
        children: [
            // tab1：基础设置
            [
                {
                    id: 'select_1',
                    type: 'select',
                    options: {
                        label: '主题',
                        name: 'theme',
                        placeholder: '请选择主题',
                        defaultValue: '明亮',
                        optionItems: [
                            { label: '明亮', value: '明亮' },
                            { label: '暗黑', value: '暗黑' },
                            { label: '跟随系统', value: '跟随系统' },
                        ],
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'select',
                },
                {
                    id: 'switch_1',
                    type: 'switch',
                    options: {
                        label: '接收通知',
                        name: 'notify',
                        defaultValue: true,
                        switchItems: {
                            activeValue: true,
                            inactiveValue: false,
                        },
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'switch',
                },
            ],
            // tab2：偏好设置
            [
                {
                    id: 'checkbox_1',
                    type: 'checkbox',
                    options: {
                        label: '爱好',
                        name: 'hobby',
                        defaultValue: [],
                        optionItems: [
                            { label: '篮球', value: '篮球' },
                            { label: '足球', value: '足球' },
                            { label: '游戏', value: '游戏' },
                        ],
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'checkbox',
                },
                {
                    id: 'slider_1',
                    type: 'slider',
                    options: {
                        label: '音量',
                        name: 'volume',
                        defaultValue: 50,
                        sliderItems: {
                            min: 0,
                            max: 100,
                            step: 1,
                        },
                    },
                    category: 'field',
                    formItemFlag: true,
                    icon: 'slider',
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