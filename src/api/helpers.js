import axios from 'axios'
// 请求状态
const ERR_OK = 0

// 跨域get请求数据
export function get(url) {
  return function(params = {}) {
    return axios.get(url, {
      params
    }).then((res) => {
      const {errno, data} = res.data
      if (errno === ERR_OK) {
        return data
      }
    }).catch((e) => {
    })
  }
}
