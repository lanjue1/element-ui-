<template>
  <div class="home">
    <el-container>
      <!-- header -->
      <el-header style="height: 100px;">
        <div class="headerPic">
          <img src="@/assets/picture/heima.png" alt srcset />
          <p>电商后台管理后台</p>
        </div>
        <el-button type="primary" plain @click="exit">退出</el-button>
      </el-header>

      <!-- container -->
      <el-container>
        <el-aside :width="isCollapse?'60px':'200px'">
          <!-- 侧边折叠按钮 -->
          <div class="toggleMenu" @click="toggleMenu">|||</div>
          <!-- 侧边导航栏 -->
          <menuCom :menuList='menuList' :iconMenu='iconMenu'  :isCollapse='isCollapse'></menuCom> 
          
        </el-aside>

        <el-main>
          <router-view></router-view>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import menuCom from "./menuCom.vue";
export default {
  name: "Home",
  components: {
    menuCom
  },
  data() {
    return {
      menuList: {},
      iconMenu:{
       125: 'el-icon-user-solid',
       103: 'el-icon-s-tools',
       101: 'el-icon-s-shop',
       102: 'el-icon-s-goods',
       145: 'el-icon-s-data',
       },
       isCollapse:false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getMenuList() {
      this.$axios.get("menus").then(e => {
        if (e.data.meta.status !== 200)
          return this.$message.error(e.data.meta.msg);
        this.menuList = e.data;
        // console.log(this.menuList)
      });
    },
    toggleMenu(){
      this.isCollapse =!this.isCollapse

    }
  }
};
</script>
<style lang="scss" scoped>
.el-header {
  background-color: #373c41;
}
.el-container {
  height: 100vh;
}
.el-aside {
  background-color: #323744;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}
.headerPic {
  display: flex;
  align-items: center;
}
.headerPic p {
  margin-left: 20px;
}
.toggleMenu{
  letter-spacing: 0.2em;
  background-color: #485166;
  text-align: center;
  color: #ffffff;
  padding: 5px 0;
  font-size: 14px;
  cursor: pointer;
}
</style>
