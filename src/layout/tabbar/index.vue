<template>
  <div class="tabbar">
    <div class="tabbar_left">
        <!-- 顶部左侧静态 -->
        <el-icon style="margin:0 10px;" @click="changeIcon" >
            <component :is="LayOutSettingStore.fold?'Fold':'Expand' " />
        </el-icon>
        <!-- 左侧面包屑（路由导航） -->
        <el-breadcrumb separator-icon="ArrowRight">
            <!-- 面包动态展示路由名字与标题 -->
          <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <!-- 图标 -->
            <el-icon>
              <component :is="item.meta.icon" />
            </el-icon>
            <!-- 面包屑展示匹配路由的标题 -->
            <span>{{ item.meta.title }}</span>
          </el-breadcrumb-item>

        </el-breadcrumb>        
    </div>

    <div class="tabbar_right">
        <!-- 顶部右侧动态 -->
        <el-button size="small" icon="Refresh" circle @click="refresh"></el-button>
        <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
         
        
        <el-popover
          placement="bottom"
          title="主题设置"
          :width="300"
          trigger="click"
        >
          <template #reference>
            <el-button size="small" icon="Setting" circle></el-button>
          </template>
          <el-form>
            <el-form-item label='主题颜色设置'>
              <div class="demo-color-block">
                <el-color-picker v-model="color" :teleported="false" @change="changeColor"/>
              </div>
            </el-form-item>
            <el-form-item label='暗黑模式'>
              <el-switch
                v-model="dark"
                class="swich"
                style="margin-left: 24px"
                inline-prompt
                active-icon="MoonNight"
                inactive-icon="Sunny"
                @change="changeDark"
              />
            </el-form-item>
          </el-form>
        </el-popover>
        
        
        <img :src="userStore.avatar" style="width: 30px;height: 30px;margin: 0 15px;border-radius: 10px;"></img>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{userStore.username}}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
  </div>
  
</template>

<script setup lang="ts"> 
import { ref } from 'vue'
import {useRoute,useRouter} from 'vue-router'
//获取当前路由对象
let $route = useRoute()
let $router = useRouter()
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
let LayOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let changeIcon=()=>{
    LayOutSettingStore.fold = !LayOutSettingStore.fold
}
let refresh=()=>{
    LayOutSettingStore.refresh =!LayOutSettingStore.refresh
}
let fullScreen=()=>{
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
    
}
//退出登录点击回调
let logout=async()=>{
//第一件事：需向服务器发起请求【退出登录接口】****
//第二件事：仓库当中关于用户相关的数据清空【token|username|avatar】****
//第三件事：跳转至登录页页面****
  await userStore.userLogout()
  //跳转至登录页
  $router.push({path:'/login',query:{redirect:$route.path}})
}




//取色器
const color = ref('#409EFF')
const changeColor=()=>{
  // document.documentElement 是全局变量时
  const el = document.documentElement
  // 设置 css 变量
  el.style.setProperty('--el-color-primary', color.value)
}
//暗黑模式
const dark = ref(false)
const changeDark=()=>{
  //获取HTML根结点
  let html=document.documentElement
  if(dark.value){
    html.className='dark'
  }else{
    html.className=''
  }
}
</script>

<style scoped lang="scss">
.tabbar{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    //background-image: linear-gradient(to right, #ffd8fc,#d1b4ce, #ffd8fc);
    //background-color: #fff;
    .tabbar_left{
        display: flex;
        align-items: center; 
        margin-left: 20px;
    }
   .tabbar_right{
        display: flex;
        align-items: center;
        margin-right: 20px;
    }
}


//取色器样式
.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
//暗黑模式样式
.swich{
  --el-switch-on-color: black;
  --el-switch-off-color: rgb(255, 219, 225);
  // &.fold{
  //     width: calc(100% - $base-menu-min-width);
  //     left: $base-menu-min-width;
  // }
}

</style>