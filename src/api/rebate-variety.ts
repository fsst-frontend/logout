import request from '@/utils/request'

/**
 * 获取返佣比例
 */
export const getMyTransactionGroupRebateConfig = () => request.get(`http://127.0.0.1:4523/m1/6709163-0-default/violet/api/taskcenter/get_partner_summary`)
