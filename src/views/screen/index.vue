<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div  class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top/>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"/>
          <Sex class="sex"/>
          <Age class="age"/>
        </div>
        <div class="center">
          <Map class="map"/>
          <Line class="line"/>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Couter class="couter"></Couter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 
//引入顶部的子组件
import Top from './components/top/index.vue'
//引入左侧三个子组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
//引入中间两个子组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
//引入右边三个子组件
import Couter from './components/couter/index.vue'
import Year from './components/year/index.vue'
import Rank from './components/rank/index.vue'
import {ref,onMounted} from 'vue'
//获取数据大屏展示内容盒子的DOM元素
let screen=ref()
onMounted(()=>{
  screen.value.style.transform=`scale(${getScale()}) translate(-50%,-50%)`
})
const getScale=(w=1920,h=1080)=>{
  const ww=window.innerWidth/w
  const hh=window.innerHeight/h
  return ww<hh?ww:hh
}
//监听视口变化
window.onresize=()=>{
  screen.value.style.transform=`scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container{
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen{
    position: fixed;
    width: 1920px;
    height: 1080px;
    //background: pink;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top{
      width: 100%;
      height: 40px;
    }
    .bottom{
      display: flex;
      .left{
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        //margin-right: 10px;
        .tourist {
            flex: 1.2;
        }
        .sex {
            flex: 1;
        }
        .age {
            flex: 1;
        }
      }
      .right{
        flex: 1;
        display: flex;
        flex-direction: column;
        //margin-left: 10px;
        .couter{
          flex: 1.5;
        }
        .year{
          flex: 1;
        }
        .rank{
          flex: 1;
        }
      }
      .center{
        flex: 1.5;
        display: flex;
        flex-direction: column;
        .map{
          flex: 3;
        }
        .line{
          flex: 1;
        }
      }
    }
  }
}
</style>