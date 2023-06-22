<template>
  <div>
    <el-breadcrumb class="menu" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="fileList">
      <a
        class="folder"
        v-for="(item, index) in items"
        :key="index"
        @click="handelFolder"
      >
        <i class="el-icon-folder"> </i>
        <p>folder</p>
      </a>

      <div class="file" v-for="(item, index) in files" :key="index">
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
      items: new Array(20).fill(1),
      files: new Array(5).fill(1),
    };
  },
  created() {
    this.getfolders();
  },
  methods: {
    handelFolder() {
      console.log("handelFolder");
    },
    getfolders() {
      fileApi.getUrl().then((data) => {
        console.log("data", data);
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
    // float: left;
    i {
      font-size: 80px;
      color: #113970;
    }
  }
}
</style>
