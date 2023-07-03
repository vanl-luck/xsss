<template>
  <div class="app">
    <header class="student-header">
      <div class="head-user">
        <div class="avatar-wrapper">
          <el-badge :is-dot="messageCount !== 0">
            <el-avatar class="el-dropdown-avatar" size="medium" :src="userInfo.imagePath === null ? require('@/assets/avatar.png') : userInfo.imagePath"></el-avatar>
          </el-badge>
        </div>
        <el-dropdown trigger="click" placement="bottom">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push({path:'/user/index'})">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="$router.push({path:'/user/message'})">
              <el-badge :value="messageCount" v-if="messageCount !== 0">
                <span>消息中心</span>
              </el-badge>
              <span v-else>消息中心</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout" divided>退出</el-dropdown-item>
          </el-dropdown-menu>
          <span class="username">{{ userInfo.username }}</span>
          <i class="el-icon-arrow-down el-dropdown-icon"></i>
        </el-dropdown>
      </div>
      <nav class="menu">
        <ul>
          <li :class="{ active: defaultUrl === '/index' }">
            <router-link to="/index">首页</router-link>
          </li>
          <li :class="{ active: defaultUrl === '/paper/index' }">
            <router-link to="/paper/index">试卷中心</router-link>
          </li>
          <li :class="{ active: defaultUrl === '/record/index' }">
            <router-link to="/record/index">考试记录</router-link>
          </li>
          <li :class="{ active: defaultUrl === '/question/index' }">
            <router-link to="/question/index">错题本</router-link>
          </li>
          <li :class="{ active: defaultUrl === '/preview/index' }">
            <router-link to="/preview/index">预览文件</router-link>
          </li>
        </ul>
      </nav>
      <div class="logo">
        <!-- <a href="/"><img src="@/assets/logo.png" height="56"/></a> -->
      </div>
    </header>
    <main class="student-main">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import loginApi from '@/api/login'
import userApi from '@/api/user'
export default {
  name: 'Layout',
  data () {
    return {
      defaultUrl: '/index',
      userInfo: {
        imagePath: null
      }
    }
  },
  created () {
    let _this = this
    this.defaultUrl = this.routeSelect(this.$route.path)
    this.getUserMessageInfo()
    userApi.getCurrentUser().then(re => {
      _this.userInfo = re.response
    })
  },
  watch: {
    $route (to, from) {
      this.defaultUrl = this.routeSelect(to.path)
    }
  },
  methods: {
    routeSelect (path) {
      let topPath = ['/', '/index', '/paper/index', '/record/index', '/question/index']
      if (topPath.indexOf(path)) {
        return path
      }
      return null
    },
    logout () {
      let _this = this
      loginApi.logout().then(function (result) {
        if (result && result.code === 1) {
          _this.clearLogin()
          _this.$router.push({ path: '/login' })
        }
      })
    },
    ...mapActions('user', ['getUserMessageInfo']),
    ...mapMutations('user', ['clearLogin'])
  },
  computed: {
    ...mapState('user', {
      messageCount: state => state.messageCount
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
