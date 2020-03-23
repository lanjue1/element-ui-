<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="60%">
      <!-- 对话框主体信息 -->
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
      </el-form>
      <!-- 底部的确认 /取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addformConfirm">确 定</el-button>
        <el-button @click="closeReset">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props:{
        dialogVisible:Boolean,
    },
  data() {
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
        
        addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
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
      }
    };
  },
  methods: {
    closeReset() {
      this.$refs.addform.resetFields();
    },
    addformConfirm() {
      /* 1.如果确认预校验成功，要 先让表单消失，调用 dialogVisible = false*/
      this.$refs.addform.validate(value => {
        if (!value) return;
        /* 预校验成功，发起请求 */
        this.$axios.post("users", this.addform).then(e => {
          //console.log(e.data);
          if (e.data.meta.status !== 201)
            return this.$message.error(e.data.meta.msg);
          /* 往后台添加用户数据成功后，1：让表单消失；2：刷新用户列表数据 */
          
          
          console.log(this.dialogVisible)
          this.$emit('addformConfirm',this.dialogVisible)
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>