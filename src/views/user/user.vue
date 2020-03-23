<template>
  <div class="users">
    <Crumb :name="name"></Crumb>

    <el-card class="box-card">
      <el-row :gutter="15">
        <!-- 搜索框 -->
        <el-col :span="8">
          <!-- 将搜索框中的内容和 getUserParams.query 进行绑定，绑定后发起搜索服务请求  -->
          <el-input
            placeholder="请输入内容"
            v-model="getUserParams.query"
            clearable
            @clear="getUserList"
          >
            <el-button @click="searchUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <!-- 搜索按钮 -->
        <el-col :span="2">
          <el-button type="primary" class="serchBtn" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table border stripe style="width: 100%" :data="userList.users">
        <el-table-column type="index" label="序号" width="60px"></el-table-column>

        <el-table-column prop="create_time" label="日期"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>

        <el-table-column label="状态" width="100px">
          <!-- switch状态开关 -->
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409DFE"
              @change="changeSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250px">
          <!-- 操作图标按钮 通过scope.row可以拿到本行用户信息，可用来给3个图标提供用户信息 -->
          <template v-slot:default="scope">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUser(scope.row.id)"
              >编辑</el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="clearUser(scope.row.id)"
              >删除</el-button>

              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="allotRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getUserParams.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="getUserParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 确定添加 用户 的对话框 重置使用@close 方法，去拿到表单的resetFields 方法-->
    <Addusers ref="addform" :dialogVisible="dialogVisible" @addformConfirm="addformConfirm"></Addusers>
    <!-- <el-dialog title="添加用户" :visible.sync="dialogVisible" width="60%">
     
      <el-form ref="addform" :model="addform" :rules="addformRules" status-icon label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
    </el-form>-->
    <!-- 底部的确认 /取消 -->
    <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addformConfirm">确 定</el-button>
        <el-button @click="closeReset">重置</el-button>
      </span>
    </el-dialog>-->

    <!-- 编辑用户的对话框 -->

    <el-dialog title="修改用户信息" :visible.sync="editVisible" width="60%" @close="resetEditform">
      <!-- 对话框主体信息 -->
      <el-form :model="editform" :rules="editformRules" ref="editform" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editformConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框  -->
    <el-dialog title="分配角色" :visible.sync="allotVisible" width="60%">
      <!-- 对话框主体信息 -->
      <el-form :model="allotform" ref="allotform" label-width="100px">
        <el-form-item label="当前用户">
          <el-input v-model="scopeRow.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input v-model="scopeRow.role_name"></el-input>
        </el-form-item>
        
        <el-form-item label="分配新角色">
          <el-select v-model="newRole" placeholder="请选择">
            <el-option
              v-for="(item) in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="allotVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotformConfirm">确 定</el-button>
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
    /* 自定义校验规则 */
    const checkEmail = (rule, value, callback) => {
      /* 邮箱的验证规则 */
      const regEmail = /^([A-Za-z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/;
      if (regEmail.test(value)) return callback(); //验证为合法的邮箱，将cb（）返回出去
      callback(new Error("请输入正确的邮箱"));
    };
    /* 手机号的验证规则 */
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}/;
      if (regPhone.test(value)) return callback();
      callback(new Error("请输入正确的手机号码"));
    };
    return {
      name: {
        manage: "用户管理",
        b: "用户列表"
      },
      userList: {},
      getUserParams: {
        query: "",
        pagenum: 1,
        pagesize: 20
      },
      total: 100,
      dialogVisible: false,
      editVisible: false,
      allotVisible: false,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      newRole:'',
      userInfo: {},
      editform: {},
      allotform: {},
      scopeRow: {},
      roleList:{},
      
      addformRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 3 到 9 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      editformRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 3 到 9 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    /* 1.获取用户列表数据 */
    getUserList() {
      this.$axios
        .get("users", {
          params: this.getUserParams
        })
        .then(e => {
          if (e.data.meta.status !== 200)
            return this.$message.error(e.data.meta.msg);
          this.userList = e.data.data;
          //console.log(this.userList);
        });
    },
    /* 2.搜索功能 */
    searchUserList() {
      this.getUserParams.pagenum = 1;
      this.getUserList();
    },
    /* 3.分页功能--多少条每页的功能函数 */
    handleSizeChange(newSize) {
      this.getUserParams.pagesize = newSize;
      this.getUserList();
    },
    /* 4.分页功能--选择第几页的功能函数 */
    handleCurrentChange(newPage) {
      this.getUserParams.pagenum = newPage;
      this.getUserList();
    },
    /*5. switch状态 关闭开启，并根据开关状态申请不同的服务器数据 */
    async changeSwitch(state) {
      //console.log(state)
      /* 修改状态的网站 ： 'users/:uId/state/:type' */
      const page = `users/${state.id}/state/${state.mg_state}`;
      const { data: res } = await this.$axios.put(page);

      if (res.meta.status !== 200) {
        /* 如果！==200 ，说明更新状态失败了，但页面的switch却改了，
          所以需要将switch恢复成原来的样子 */
        state.mg_state = !state.mg_state;
        return this.$message.error("更新数据失败");
      }
      /* 更新用户状态 */
      this.$message.success("更新状态成功");
      console.log(state.mg_state);
    },
    /*6. 添加用户表单的重置方法 */
    closeReset() {
      this.$refs.addform.resetFields();
    },
    /* 7. 添加用户的表单的确认方法，先预校验，再往后台传递数据 */
    addformConfirm(e) {
      /* 1.如果确认预校验成功，要 先让表单消失，调用 dialogVisible = false*/
      /* this.$refs.addform.validate(value => {
        if (!value) return;
        
        this.$axios.post("users", this.addform).then(e => {
          //console.log(e.data);
          if (e.data.meta.status !== 201)
            return this.$message.error(e.data.meta.msg);
         
          this.dialogVisible = false;
          this.getUserList();
        });
      }); */
      this.dialogVisible = false;

      this.getUserList();
    },
    /* 8.点击编辑图标 函数功能 */
    editUser(id) {
      this.editVisible = true;
      /* 通过本行 scope.row.id  拿到当前用户的ID， 发起服务器请求(users/:id)拿到用户数据并渲染到编辑对话框中*/
      //console.log(id)
      /* 注意： get('users/$(id)') 不能这样拼接*/
      this.$axios.get("users/" + id).then(e => {
        if (e.data.meta.status !== 200)
          return this.$message.error(e.data.meta.msg);
        this.userInfo = e.data.data;
        console.log(this.userInfo);
      });
    },
    /* 9.点击编辑图标 表单中的确定按钮 函数 */
    editformConfirm() {
      /* 先预处理 */
      // console.log(this.userInfo)
      this.$refs.editform.validate(value => {
        if (!value) return;
        /* 预校验成功，发起请求 */
        this.$axios
          .get("users/" + this.userInfo.id, {
            email: this.userInfo.email,
            mobile: this.userInfo.mobile
          })
          .then(e => {
            if (e.data.meta.status !== 200)
              return this.$message.error(e.data.meta.msg);

            /* 1.重新调 数据加载到用户列表 */
            this.getUserList();
            /* 2. 关闭编辑用户对话框 */
            this.editVisible = false;
            /* 3. 提示修改成功*/
            this.$message.success("修改用户信息成功");
          });
      });
    },
    /* 10. 编辑对话框关闭后 重置 对话框中 的内容 */
    resetEditform() {
      this.$refs.editform.resetFields();
    },
    /* 11. 删除用户 按钮函数 */
    clearUser(id) {
      //console.log(id);
      this.$confirm("此操作将永久删除改用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          /* 确认 删除用户信息后 向后台发送请求 */
          this.$axios.delete("users/" + id).then(e => {
            if (e.data.meta.status !== 200)
              return this.$message.error(e.data.meta.msg);
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 12. 分配角色 图标按钮 */
    allotRole(row) {
      this.scopeRow = row;
      //console.log(this.scopeRow);
      this.allotVisible = true;
      this.$axios.get('roles').then(e=>{
        //console.log(e.data)
        this.roleList=e.data.data

      }
      )},
    /* 13. 分配角色 图标 确认之后的请求，users/:userid/role */
    allotformConfirm(){
      console.log(this.newRole)
      
      this.$axios.put(`users/${this.scopeRow.id}/role`,{
        rid:this.newRole
      }).then(e=>{
        console.log(e.data)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin: 20px 15px;
}
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 10px;
}

.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 15px;
}
.el-select{
  display: flex;
  justify-content: flex-start;
}
</style>