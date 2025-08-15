import request from '@/utils/request'

/**
 * 获取合伙人总览
 */
export const getPartnerSummary = () => request.get(`/violet/api/taskcenter/get_partner_summary`)

/**
 * 获取我的邀请人列表
 */
export const getMyInviteesInfoList = params => request.get(`/violet/api/taskcenter/get_my_invitees_info_list`, { params })

/**
 * 我的返佣
 */
export const getMyTraderRebateRecordList = params => request.get(`/violet/api/taskcenter/get_my_trader_rebate_record_list`, { params })

/**
 * 回赠记录已获取列表
 */
export const getMyTraderReturnRecordList = params => request.get(`/violet/api/taskcenter/get_my_trader_return_record_list`, { params })

// 回赠记录已回赠列表
export const getMySubTraderReturnRecordList = params => request.get(`/violet/api/taskcenter/get_sub_trader_return_record_list`, { params })

// 获取邀请码列表
export const getInviteCodeList = () => request.get(`/violet/api/taskcenter/get_invitation_code_list`)

// 创建邀请码
export const createInviteCode = data => request.post(`/violet/api/taskcenter/create_invitation_code`, data)

// 设置邀请码默认
export const setInviteCodeDefault = data => request.post(`/violet/api/taskcenter/set_invitation_code_default`, data)

// 更新备注
export const updateInviteCodeRemark = data => request.post(`/violet/api/taskcenter/update_invitation_code`, data)

// 获取品种返点比例配置
export const getTransactionGroupConfig = () => request.get(`/violet/api/taskcenter/get_my_transaction_group_rebate_config`)

// 是否是交易员
export const isTrader = () => request.get(`/violet/api/copytrading/is_signal_provider`)
