import { post, postWithLoadTip, get } from "@/utils/request";

export default {
  //   查询文件夹
  getDirs: (query) => get(`/apis/file/dirs`, query),
  //   查询文件
  getFiles: (query) => get("/apis/file/getfilesbydir", query),
  //   查询预览和下载URL
  geturl: (query) => post("/apis/file/geturl", query),

  //  修改授权文件
  setPathById: (query) => post("/apis/file/setPathById", query),

  //   查询授权文件
  getPathById: (query) => get("/apis/file/getPathById", query),

  //getDirectoriesBySchoolId
  getDirectoriesBySchoolId: (query) =>
    get("/apis/file/getDirectoriesBySchoolId", query),

  setDirectoriesBySchoolId: (query) =>
    post("/apis/file/setDirectoriesBySchoolId", query),

  //getLevelList
  getLevelList: (query) => get("/apis/file/getLevelList", query),
};
