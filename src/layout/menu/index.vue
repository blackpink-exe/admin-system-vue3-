<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
     <template v-if="!item.children">
        <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
          <el-icon>
              <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
              <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
     </template>

    <!-- 有子路由但是只有一个子路由 -->
    <template v-if="item.children&&item.children.length==1"> <!-- v-if为真才会显示 -->
        <el-menu-item v-if="!item.children.hidden " :index="item.children[0].path" @click="goRoute">
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
    </el-menu-item>

     </template>
    <!-- 有子路由且个数大于一个 -->
    <el-sub-menu :index="item.path" v-if="item.children&&item.children.length>1">
      <template #title>
        <el-icon>
            <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
  
</template>

<script setup lang="ts"> 
import {useRouter} from 'vue-router'
//获取父组件传递过来的全部路由数组
defineProps(['menuList'])
//获取当前路由对象
const $router = useRouter()
const goRoute = (vc:any)=>{
    $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped >

</style>