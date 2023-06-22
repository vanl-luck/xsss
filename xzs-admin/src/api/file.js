import { post, postWithLoadTip, get } from "@/utils/request";

export default {
  //   login: (query) => postWithLoadTip(`/api/ssuser/login`, query),
  //   logout: (query) => post(`/apis/user/logout`, query),
  getDirs: (query) => get("/apis/file/dirs", query),
};
