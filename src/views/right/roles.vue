<template>
  <div>
    <Crumb :name="name"></Crumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="2">
          <el-button type="primary" class="serchBtn" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- ,index1===0?'roleFormTop':'' -->
      <el-table border stripe style="width: 100%" :data="rolesList" ref="rolesFormRef">
        <el-table-column type="expand" label="权限展开" width="100px">
          <template v-slot:default="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['roleFormBottom',index1==0?'roleFormTop':'','middle']"
            >
              <!-- 一级分类 -->
              <el-col :span="6">
                <el-tag closable @close="removeThreeRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级分类  -->
              <el-col :span="18">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="['roleFormBottom','middle']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeThreeRight(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级分类 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeThreeRight(scope.row,item3.id)"
                      v-for="(item3,index3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>

        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot:default="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>

              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="allotRight(scope.row)"
              >分配权限</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <Addusers ref="addform" :dialogVisible="dialogVisible" @addformConfirm="addformConfirm"></Addusers>

    <!-- 分配权限 对话框  树形控件 在关闭对话框的时候，对树形控件内被勾选的做清空处理 -->
    <el-dialog title="分配权限" :visible.sync="allotVisible" width="60%"  @close="closeAllotChecked">
      <el-tree
        ref="allotRightRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKey"
        :data="rightList"
        :props="allotProps"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="allotVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRightConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumb from "@/components/common/crumb.vue";
import Addusers from "components/common/addusers.vue";

export default {
  components: {
    Crumb,
    Addusers
  },
  data() {
    return {
      dialogVisible: false,
      allotVisible: false,
      name: {
        manage: "用户管理",
        user: "用户列表"
      },
      rolesList: [],
      rightList: [],
      allotProps: {
        label: "authName",
        children: "children"
      },
      defaultCheckedKey: [],
      roleid: ""
    };
  },
  created() {
    this.getrolesList();
  },
  methods: {
    /* 1. 获取角色权限数据 */
    getrolesList() {
      this.$axios.get("roles").then(e => {
        //console.log(e.data);
        this.rolesList = e.data.data;
      });
    },
    /* 2. 添加角色的确定按钮*/
    addformConfirm() {
      this.dialogVisible = false;

      this.getrolesList();
    },
    /* 3. 在展开图标下 删除该角色具体权限的函数 */
    removeThreeRight(role, rightid) {
      /* 删除权限时候的弹框和发送请求  roles/:roleID/rights/:rightid*/
      this.$confirm("此操作将删除此权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "取消权限成功!"
          });
          /* 确认 删除用户信息后 向后台发送请求 */
          this.$axios.delete(`roles/${role.id}/rights/${rightid}`).then(e => {
            console.log(e.data);
            if (e.data.meta.status !== 200)
              return this.$message.error(e.data.meta.msg);
            //this.getrolesList()  不直接调用这个函数，是因为这个函数会重新渲染整个页面，有刷新的动态，用户体验不太好
            role.children = e.data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 4. 分配权限 图标功能 */
    allotRight(role) {
      /* 加载本角色下的所有已获权限的id  */
      
      this.roleid = role.id;
      this.getDefKey(role, this.defaultCheckedKey);

      this.allotVisible = true;
      this.getrightList();
      //console.log(this.defaultCheckedKey);
    },
    /* 5. 获取所有权限 列表信息 */
    getrightList() {
      this.$axios.get("rights/tree").then(e => {
        this.rightList = e.data.data;
        //console.log( this.rightList)
      });
    },
    /* 6. 递归的方式获取角色下所有三级权限的id，并保存到 defaultCheckedKey[]中 ,
    这个方法中传2参数，一个是所有节点，一个是节点数组*/
    getDefKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getDefKey(item, arr);
      });
    },
    /* 7. 分配对话框关闭时，清空分配权限 对话框内的已勾选项目 */
    closeAllotChecked() {
      this.defaultCheckedKey = [];
      
     // console.log(this.defaultCheckedKey);
    },
    /* 7.分配权限对话框 确认按钮 
    发送请求：roles/:roleid/rights 
    参数：rids请求体（被选中叶子节点，半选中的节点的key， 包括1，2，3级节点，用‘，’分割）*/
    allotRightConfirm() {
      const keys = [
        ...this.$refs.allotRightRef.getCheckedKeys(),
        ...this.$refs.allotRightRef.getHalfCheckedKeys()
      ];
      const trKey = keys.join(",");
      //console.log(trKey)

      this.$axios
        .post(`roles/${this.roleid}/rights`, { rids: trKey })
        .then(e => {
          //console.log(e)
        });
      this.getrolesList();
      this.allotVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.roleFormBottom {
  padding: 13px;
  border-bottom: 1px solid #ebeef5;
}
.roleFormTop {
  border-top: 1px solid #ebeef5;
}
.middle {
  display: flex;
  align-items: center;
}
</style>