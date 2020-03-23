<template>
  <div>
    <Crumb :name='name'></Crumb>
    <el-card >
      <el-table :data="rightList" border stripe style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>

        <el-table-column prop="level" label="权限等级">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Crumb from "@/components/common/crumb.vue";

export default {
    components:{
        Crumb,
    },
  data() {
    return {
      name: {
        manage: "用户管理",
        user: "用户列表"
      },
      rightList:[],
    };
  },
  created(){
    this.getrightList()
  },
  methods: {
    getrightList() {
      this.$axios.get('rights/list').then(e=>{
        
        this.rightList=e.data.data
        //console.log( this.rightList)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>