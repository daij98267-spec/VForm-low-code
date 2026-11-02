// 模板清单：左侧「表单模板」tab 显示用
import form2 from './form2'
import form3 from './form3'
import form4 from './form4'

export const templates = [
    { name: '学生职业规划表', description: '条件显隐演示', formJson: form2 },
    { name: '报名登记表', description: '栅格容器 + 校验', formJson: form3 },
    { name: '用户偏好设置', description: '选项卡容器', formJson: form4 },
]