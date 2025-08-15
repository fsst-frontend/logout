import request from '@/utils/request'

// 判断账号是否存在
export const getCheckAccountApi = params => request.get('/violet/api/account/check_user_exist', { params })
// 给手机发送验证码
export const postSendCodeApi = data => request.post('/violet/api/account/sms_vcode', data)
// 给邮箱发送验证码
export const postSendCodeEmailApi = data => request.post('/violet/api/account/email_vcode', data)
// 注销用户
export const postLogoutApi = data => request.post('/violet/api/account/deactivate_no', data)
