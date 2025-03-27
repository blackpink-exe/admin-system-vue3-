<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar"></img>
        <div class="bottom">
          <h3 class="title">{{getTime()}}好呀！{{ userStore.username }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms">
      <SvgIcon name="welcome" width="800px" height="400px"></SvgIcon>
    </div>
  </div>
</template>

<script setup lang="ts"> 
import useUserStore from '@/store/modules/user'
import {getTime} from '@/utils/time'
let userStore=useUserStore()
</script>

<style scoped lang="scss">
.box{
  display: flex;
  .avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom{
    margin: 13px 20px;
    .title{
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 30px;
    }
    .subtitle{
    font-style: italic;
    color: pink;
    }
  }

}
.bottoms{
  margin-top: 120px;
  display: flex;
  justify-content: center;
}
</style>