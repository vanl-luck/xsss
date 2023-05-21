import { post } from '@/utils/request'

export default {
  index: () => post('/admin/dashboard/index')
}
