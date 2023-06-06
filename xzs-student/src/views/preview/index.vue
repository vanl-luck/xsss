<template>
  <div style="margin-top: 10px" class="app-contain">
    <el-row :gutter="40">
      <el-col :span="8">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
        >
        </el-tree>
      </el-col>
      <el-col :span="14"> 123 </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },

  data () {
    return {
      filterText: '',
      data: [
        {
          id: 1,
          label: '表格和文档',
          children: [
            {
              id: 7,
              label: 'docs'
            },
            {
              id: 8,
              label: 'xls'
            }
          ]
        },
        {
          id: 2,
          label: '规范和图集',
          children: [
            {
              id: 9,
              label: 'pdf'
            }
          ]
        },
        {
          id: 3,
          label: '课件',
          children: [
            {
              id: 10,
              label: 'ppt'
            }
          ]
        },
        {
          id: 4,
          label: 'REVIT',
          children: [
            {
              id: 11,
              label: 'RVT模型'
            }
          ]
        },
        {
          id: 5,
          label: 'CAD',
          children: [
            {
              id: 12,
              label: 'DWG'
            }
          ]
        },
        {
          id: 6,
          label: '视频',
          children: [
            {
              id: 13,
              label: '通用'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
