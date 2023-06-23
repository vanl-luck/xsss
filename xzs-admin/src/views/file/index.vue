<template>
  <div>
    <el-breadcrumb class="menu" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        :to="{ path: '#' }"
        @click="handelPath(path)"
        v-for="path in pathList"
        :key="path"
        >{{ path }}</el-breadcrumb-item
      >
      <!-- <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class="fileList">
      <el-link
        class="folder"
        :underline="false"
        v-for="item in folderList"
        :key="item"
        @click="handelFolder(item)"
      >
        <i class="el-icon-folder"> </i>
        <p class="folderName">{{ item.name }}</p>
      </el-link>

      <div class="file" v-for="(item, index) in fileList" :key="index">
        <i class="el-icon-document"></i>
        <p>file</p>
      </div>
    </div>
  </div>
</template>

<script>
import fileApi from "@/api/file";
export default {
  data() {
    return {
      folderList: [],
      fileList: [],
      pathList: [],
    };
  },
  created() {
    this.getfolders();
  },
  methods: {
    handelFolder(item) {
      const { key, name } = item;
      this.getfolders(key);
      console.log("handelFolder", item);
    },
    handelPath(path) {
      console.log("path", path);
    },
    getfolders(Key = "") {
      fileApi.getDirs({ Key }).then((data) => {
        console.log("data", data);
        if (data?.length) {
          const newArr = [];
          let path = [];
          data.forEach((element) => {
            const arr = element.split("/");
            arr.pop();
            path = arr;
            const name = arr[arr.length - 1];
            const obj = {
              name,
              key: element,
            };

            newArr.push(obj);
          });
          this.folderList = newArr;
          this.pathList = path;
        }
      });
    },
    getfiles() {},
    getPreUrl() {},
  },
};
</script>

<style lang="scss" scoped>
.menu {
  margin-left: 67px;
  margin-top: 15px;
  margin-bottom: 1px;
}
.fileList {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  .folder,
  .file {
    width: 150px;
    height: 150px;
    .folderName {
      font-size: 12px;
    }
    i {
      font-size: 80px;
      color: #113970;
    }
  }
}
</style>
