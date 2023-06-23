import { post, get } from '@/utils/request'

export default {
  //   查询文件夹
  getDirs: (query) => get(`/apis/file/dirs`, query),
  //   查询文件
  getFiles: (query) => get('/apis/file/getfilesbydir', query),
  //   查询预览和下载URL
  geturl: (query) => post('/apis/file/geturl', query)
}
