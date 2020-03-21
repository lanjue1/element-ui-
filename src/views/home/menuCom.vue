<template>
    <el-menu  style="left: -20px;" 
            router 
            unique-opened
            :collapse-transition='false'
            :collapse="isCollapse"
            :default-active='$route.path'
            background-color="#323744"
            text-color="#fff"
            active-text-color="#409EFF"
          >
          <!-- el-submenu 一级菜单 template一级菜单模版区-->
            <el-submenu  
                    :index="item.id+''" v-for="item in menuList.data" :key='item.id'>
              <template slot="title" >    
                 <i  :class="iconMenu[item.id]" ></i>
                <span>{{item.authName}}</span>
                
              </template>

              <!-- el-menu-item 二级菜单 -->
              <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key='item2.id'>
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{item2.authName}}</span>
                </template>
              </el-menu-item>

              
              
            </el-submenu>
            
          </el-menu>
</template>

<script>
    export default {
        props:{
            menuList:Object,
            iconMenu:Object,
            isCollapse:Boolean, 
        }
    }
</script>

<style lang="scss" scoped>
.el-submenu{
    left: 10px !important;
}
.el-menu-item{
    left: 20px;
    
    
}
.el-menu{
    border-right: none;
}
</style>