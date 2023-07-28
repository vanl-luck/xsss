<template>
  <div class="has-logo">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in filteredRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import Cookies from "js-cookie";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar", "routes", "userName"]),
    filteredRoutes() {
      // const userName = Cookies.get("adminUserName");
      console.log("userName", this.userName);

      // debugger;

      if (this.userName == "admin") {
        console.log("this.routes", this.routes);
        return this.routes;
      }

      const filterroutes = [];
      // 设置需要过滤的一级菜单的列表
      const filterMenu = ["LogPage"];
      this.routes.forEach((item) => {
        if (item.name == "UserPage") {
          item.children = item.children.filter(
            (route) => route.name !== "UserAdminPageList"
          );
        }
        const isHiden = filterMenu.some((t) => t == item.name);
        !isHiden && filterroutes.push(item);
      });
      return filterroutes;
      // return userName == "admin" ? this.routes : filterroutes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
