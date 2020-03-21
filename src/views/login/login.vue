<template>
  <div class="login">
    <div class="loginForm">
      <!-- 表单图片 -->

      <div class="pic">
        <img src="@/assets/picture/movie.jpg" alt srcset />
      </div>

      <!-- 表单主题 1.绑定model，2，表单验证:1.绑定rules,2,给rules{}放各种验证规则，3，将各项规则通过prop绑给formItem -->
      <el-form label-width="0px" class="form" 
               :model="loginForm" :rules="rules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item label class="formButton">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//import { Button, Form, FormItem, Input } from "element-ui";

export default {
  name: "login",
  data() {
    return {
      //1. 表单登录的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单的验证规则对象
      rules: {
        // 用户名验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 9, message: "长度在 3 到 9 个字符", trigger: "blur" }
        ],
        // 验证密码的验证规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      // 重置按钮，重置表单
      this.$refs.loginFormRef.resetFields();
      this.loginForm.username='';
      this.loginForm.password='';

    },
    login(){
      // 通过validate（）可以进行表单的预验证，方法中需要传递一个回调函数，函数中2个参数，第一个是布尔值，第二个是对象
      this.$refs.loginFormRef.validate(async (valid)=>{
        
        if(!valid) return; // 如果预验证，没有通过，就直接返回；不发起请求验证
        
        //通过后，配置请求的根路径，发起axios请求，拿到请求结果
         /* this.$axios.post('login',this.loginForm).then((e)=>{
            console.log(e.data)
        }) */
        // 第二种拿到请求方法
        const {data:res}=await this.$axios.post('login',this.loginForm)        
        if(res.meta.status!=200) return this.$message.error('登录失败');      
                                  this.$message.success('登录成功');      
        /* 将登录成功后的token保存到客户端 的 sessionStorage 中，
           1， token只应在当前网站打开期间生效，所以将token 保存到 sessionStorage中，localStorage是永久生效的
           2，通过编程式导航跳转到后台主页，路由地址/home
        */
       // 调用 sessionStorage 来保存 token
      
        
          window.sessionStorage.setItem("token",res.data.token);
       // 登录跳转到home主页
           this.$router.push("/home");
       
      })

    }
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: #274a6c;
}
.loginForm {
  position: absolute;
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.pic {
  position: absolute;
  width: 130px;
  height: 130px;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  left: 50%;
  transform: translate(-50%, -50%);
}
.pic img {
  width: 130px;
  border-radius: 50%;
  background-color: #ddd;
}
.form {
  margin-top: 120px;
  box-sizing: border-box;
  padding: 0 20px;
}
.formButton {
  display: flex;
  justify-content: flex-end;
}
</style>