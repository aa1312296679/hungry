import { get } from './helpers'
// 定义多个数据接口的请求函数
const getSeller = get('api/seller')
const getGoods = get('api/goods')
const getRatings = get('api/ratings')

export {
  getSeller,
  getGoods,
  getRatings
}
