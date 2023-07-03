<template>
  <div>
    <el-breadcrumb class="menu" separator-class="el-icon-arrow-right">
      <el-link
        @click="handelPath(index)"
        v-for="(path, index) in pathList"
        :key="path"
        >{{ path }}
        <span class="path-icon"> > </span>
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
        <i class="el-icon-folder folder-icon"> </i>
        <p class="folderName">{{ item.name }}</p>
      </el-link>

      <el-link
        class="file file-container"
        :underline="false"
        v-for="(item, index) in fileList"
        :key="index"
      >
        <div class="file-icon">
          <i class="el-icon-document"></i>
          <p>{{ item.name }}</p>
        </div>

        <div class="file-actions">
          <i
            class="el-icon-view icon-button"
            :disabled="!item.isView"
            @click="handelPreUrl(item.Key, $event)"
            >预览</i
          >
          <i
            round
            class="el-icon-download icon-button"
            :disabled="item.isView"
            @click="handelDownloadFile(item.Key)"
            style="margin: 0"
            >下载
          </i>
        </div>

        <!-- <div class="overlay"></div> -->
      </el-link>
    </div>
    <el-image
      style="width: 100%; height: 100%"
      :preview-src-list="url"
      v-if="url.length > 0"
    >
    </el-image>
  </div>
</template>

<script>
import fileApi from '@/api/file'
export default {
  data () {
    return {
      folderList: [],
      fileList: [],
      pathList: [],
      typeList: [
        'pptx',
        'ppt',
        'pot',
        'potx',
        'pps',
        'ppsx',
        'dps',
        'dpt',
        'pptm',
        'potm',
        'ppsm',
        'doc',
        'dot',
        'wps',
        'wpt',
        'docx',
        'dotx',
        'docm',
        'dotm',
        'xls',
        'xlt',
        'et',
        'ett',
        'xlsx',
        'xltx',
        'csv',
        'xlsb',
        'xlsm',
        'xltm',
        'ets',
        'pdf',
        'lrc',
        'c',
        'cpp',
        'h',
        'asm',
        's',
        'java',
        'asp',
        'bat',
        'bas',
        'prg',
        'cmd',
        'rtf',
        'txt',
        'log',
        'xml',
        'htm',
        'html',
        'jpg',
        'dwg',
        'skp'
      ],
      url: []
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
            const type = item.name.split('.')[1]
            console.log('type', type)
            const isView = this.typeList.find((item) => item === type)
            item.isView = Boolean(isView)
            return item
          })
          this.fileList = fileList
          console.log('fileList', fileList)
        } else {
          this.fileList = []
        }
      })
    },
    handelDownloadFile (Key) {
      if (Key) {
        fileApi.geturl({ Key }).then((res) => {
          window.open(res.downloadUrl, '_blank')
        })
      }
    },
    handelPreUrl (Key, event) {
      const suffix = Key.split('.').pop()
      // 命中图片格式
      if (suffix === 'jpg' || suffix === 'png') {
        return fileApi.geturl({ Key }).then((res) => {
          window.open(res.downloadUrl, '_blank')
          // this.url = res.downloadUrl
        })
      } else if (Key) {
        fileApi.geturl({ Key }).then((res) => {
          window.open(res.previewUrl, '_blank')
          console.log('res', res)
        })
      }
      // 命中dwg格式
      // else if (suffix === 'dwg') {
      //   return fileApi.geturl({ Key }).then((res) => {
      //     window.open(
      //       'https://ow365.cn/?i=31837&ssl=1&furl=' + res.downloadUrl,
      //       '_blank'
      //     )
      //     // this.url = res.downloadUrl
      //   })
      // }
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
  padding: 10px 20px 30px;
  .el-link--inner {
    width: 100%;
    height: 100%;
    position: relative;
    p {
      position: absolute;
      top: 90px;
      left: 0;
      right: 0;
      line-height: 18px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }
    p:hover {
      overflow: visible;
      white-space: normal;
      -webkit-line-clamp: none;
    }
  }
  .folder,
  .file {
    width: 150px;
    height: 120px;
    margin: 0 10px;
    .folderName {
      font-size: 12px;
    }
    .folder-icon {
      font-size: 70px;
      color: #113970;
    }

    .file-actions {
      position: absolute;
      //   bottom: 92px;
      top: 60px;
      left: 0;
      width: 100%;
      display: none;
      justify-content: center;
      background-color: white;
      .icon-button {
        font-size: 14px;
        color: #113970;
      }

      .icon-button:first-child {
        margin-right: 15px;
      }
    }
  }
}

.file-container {
  position: relative;

  //   border: 1px solid #000;
}

.file-icon {
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    color: #113970;

    font-size: 70px;
  }

  p {
    margin-top: 10px;
    font-size: 12px;
  }
}

.file-container:hover .file-actions {
  display: flex;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
}

.file-container:hover .file-actions,
.file-container:hover .overlay {
  display: flex;
}

.file-container:hover .el-icon-document {
  opacity: 0.2;
}

.path-icon {
  margin: 0 5px;
}
</style>
