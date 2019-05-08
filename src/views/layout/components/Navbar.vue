<template>
  <div class="navbar">
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />-->
    <div class="headtext">欢迎使用销售管理信息审核系统</div>
    <div class="avatar-container">
      <span>欢迎&nbsp;{{name}},</span>
      <span style="cursor: pointer;" @click="logout">【退出登录】</span>
    </div>
    <!-- <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <span style="display:block;" @click="logout">LogOut</span>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
  </div>
</template>

<script>
import {mapGetters} from "vuex";
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    // Hamburger
  },
  computed: {
    // ...mapGetters(["sidebar", "avatar"])
    ...mapGetters(["name"])
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('ToggleSideBar')
    // },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 80px;
  line-height: 80px;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  // .hamburger-container {
  //   line-height: 58px;
  //   height: 50px;
  //   float: left;
  //   padding: 0 10px;
  // }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .headtext{
    height: 80px;
    line-height: 80px;
    display: inline-block;
    position: absolute;
    left: 20px;
    font-size: 32px;
    color: #FFCC33;
    font-weight: 700;
    text-shadow: 2px -1px 1px #fff;
  }
  .avatar-container {
    height: 80px;
    line-height: 80px;
    display: inline-block;
    position: absolute;
    right: 35px;
    color: #fff;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      // .el-icon-caret-bottom {
      //   position: absolute;
      //   right: -20px;
      //   top: 25px;
      //   font-size: 12px;
      // }
    }
  }
}
</style>

