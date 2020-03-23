<template>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">{{name.manage}}</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{name.user}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        props:{
            name:Object,
            
        },
       
    }
</script>

<style lang="scss" scoped>
.el-breadcrumb{
  margin-bottom: 20px;
}
</style>