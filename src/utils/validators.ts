// 校验器表：一个对象，key 是校验名，value 是校验函数。
// element-plus 规定：校验函数签名必须是 (rule, value, callback)。
export const FormValidators: Record<string, any> = {
    email,
    mobilePhone,
    number,
    age,
}
// 邮箱校验
function email(rule: any, value: any, callback: any) {
    // 空值直接放行：因为"必填"由 required 单独负责，这里只管"填了但格式不对"
    if (value === null || value === undefined || value === '') {
        callback()
        return
    }
    //正则表达式校验邮箱格式
    const reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!reg.test(value)) {
        // rule.errorMsg 是我们在 getRules 里挂上去的自定义提示语，没配就用默认的
        callback(new Error(rule.errorMsg || '邮箱格式有误，请重新填写'))
    } else {
        callback()
    }
}
//手机号校验
function mobilePhone(rule: any, value: any, callback: any) {
    // 空值直接放行：因为"必填"由 required 单独负责，这里只管"填了但格式不对"
    if (value === null || value === undefined || value === '') {
        callback()
        return
    }
    //正则表达式校验手机号格式，11位数字，以1开头，后面跟着9位数字，不能以0开头，不能以1开头
    const reg = /^1[3456789]\d{9}$/
    if (!reg.test(value)) {
        // rule.errorMsg 是我们在 getRules 里挂上去的自定义提示语，没配就用默认的
        callback(new Error(rule.errorMsg || '手机号格式有误，请重新填写'))
    } else {
        callback()
    }
}
//number校验
function number(rule: any, value: any, callback: any) {
    // 空值直接放行：因为"必填"由 required 单独负责，这里只管"填了但格式不对"
    if (value === null || value === undefined || value === '') {
        callback()
        return
    }
    //正则表达式校验数字格式
    const reg=/^-?\d+(\.\d+)?$/
    if (!reg.test(value)) {
        // rule.errorMsg 是我们在 getRules 里挂上去的自定义提示语，没配就用默认的
        callback(new Error(rule.errorMsg || '请输入数字'))
    } else {
        callback()
    }
}
//年龄校验
function age(rule: any, value: any, callback: any) {
    // 空值直接放行：因为"必填"由 required 单独负责，这里只管"填了但格式不对"
    if (value === null || value === undefined || value === '') {
        callback()
        return
    }
    //正则表达式校验年龄格式，1-99岁
    const reg=/^[1-9]\d?$|100$/
    if (!reg.test(value)) {
        // rule.errorMsg 是我们在 getRules 里挂上去的自定义提示语，没配就用默认的
        callback(new Error(rule.errorMsg || '请输入1-99岁'))
    } else {
        callback()
    }
}
