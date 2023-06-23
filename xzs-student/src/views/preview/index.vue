<template>
  <div>
    <el-breadcrumb class="menu" separator-class="el-icon-arrow-right">
      <el-link
        @click="handelPath(index)"
        v-for="(path, index) in pathList"
        :key="path"
        >{{ path }}
        <span> > </span>
      </el-link>
    </el-breadcrumb>
    <div class="fileList">
      <el-link
        class="folder"
        :underline="false"
        v-for="item in folderList"
        :key="item.key"
        @click="handelFolder(item)"
      >
        <i class="el-icon-folder"> </i>
        <p class="folderName">{{ item.name }}</p>
      </el-link>

      <el-link
        class="file"
        :underline="false"
        v-for="(item, index) in fileList"
        :key="index"
        @click="handelPreUrl(item.Key)"
      >
        <div class="file-icon">
          <i class="el-icon-document"></i>
          <p>{{ item.name }}</p>
        </div>

        <div class="file-actions">
          <button @click="downloadFile">Download</button>
          <button @click="previewFile">Preview</button>
        </div>
      </el-link>
    </div>
  </div>
</template>

<script>
import fileApi from '@/api/file'
export default {
  data () {
    return {
      folderList: [],
      fileList: [],
      pathList: []
    }
  },
  created () {
    this.getfolders()
    this.getfiles()
  },
  methods: {
    handelFolder (item) {
      const { key } = item
      this.getfolders(key)
      this.getfiles(key)
      console.log('handelFolder', item)
    },
    handelPath (index) {
      //   console.log("path", index);
      const path = this.pathList.slice(0, index + 1).join('/') + '/'
      console.log('path', path)
      this.getfolders(path)
      this.getfiles(path)
    },
    getfolders (Key = '') {
      fileApi.getDirs({ Key }).then((data) => {
        console.log('data', data)
        if (data?.length) {
          const newArr = []
          data.forEach((element) => {
            const arr = element.split('/')
            arr.pop()
            const name = arr[arr.length - 1]
            const obj = {
              name,
              key: element
            }
            newArr.push(obj)
          })
          this.folderList = newArr
        } else {
          this.folderList = []
        }
        if (Key) {
          const pathList = Key.split('/')
          pathList.pop()
          this.pathList = pathList
        } else {
          this.pathList = ['水利工程制图资源库']
        }
      })
    },
    getfiles (Key = '') {
      fileApi.getFiles({ Key }).then((res) => {
        if (res.data?.length) {
          const fileList = res.data.map((item) => {
            item.name = item.Key.split('/').pop()
            return item
          })
          this.fileList = fileList
          console.log('fileList', fileList)
        } else {
          this.fileList = []
        }
      })
    },
    handelPreUrl (Key) {
      if (Key) {
        fileApi.geturl({ Key }).then((res) => {
          window.open(res.previewUrl, '_blank')

          console.log('res', res)
        })
      }
    }
  }
}
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
