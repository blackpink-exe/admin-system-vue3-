<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form 
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" :show-password="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"> 
import {User,Lock} from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user';
import { ElNotification } from 'element-plus';
import { useRouter,useRoute } from 'vue-router';
import { getTime } from '@/utils/time';
import { reactive,ref } from 'vue';
//获取路由器
const $router=useRouter()
//获取路由
const $route=useRoute()
let loginForm=reactive({
  username:'admin',
  password:'111111' 
})
//获取表单实例
const loginForms=ref()
//定义变量控制按钮加载效果
let loading=ref(false)
const userStore=useUserStore()
//登录按钮回调
const login=async()=>{
  //保证全部表单校验通过再发请求
  await loginForms.value.validate()
  loading.value=true
  //点击登录按钮以后干什么
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出提示登陆失败信息
  try{
    await userStore.userLogin(loginForm);
    //判断登录的时候，路由路径当中是否有query参数，如果有就往query参数跳转，如果没有就往首页跳转
    let redirect:any=$route.query.redirect
    $router.push({path:redirect||'/'})
    ElNotification({
      type: 'success', 
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    });
    loading.value=false
  } catch(error){
    loading.value=false
    ElNotification({
      type: 'error', 
      message: (error as Error).message,  
    })
  }
  
}
const validatorUserName = (_rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //函数：如果符合条件callBack放行通过】
  //如果不符合条件callBack方法，注入错误提示信息
  if (value.length >=5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('用户名长度至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >=6 && value.length <= 15) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}
//表单校验规则
const rules =({
  username: [
    { validator: validatorUserName, trigger: 'change' },
  ],
  password: [
    { validator: validatorPassword, trigger: 'change' }, 
  ]
})
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg');
  background-size: cover;
}
.login_form {
  position: relative;
  width: 80%;
  top:30vh;
  background: url('@/assets/images/login_form.png');  
  padding: 40px;
  h1{
    color: white;
    font-size: 40px;
  }
  h2{
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }
  .login_btn{
    width: 100%;
  }
}
</style>