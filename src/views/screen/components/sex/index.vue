<template>
  <div class="box1">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="">
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="">
      </div>

    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="echarts" ref="charts">111</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,ref } from 'vue';
import * as echarts from 'echarts'
let charts=ref()
onMounted(()=>{
  let mycharts=echarts.init(charts.value)
  mycharts.setOption({
    //组件标题
    title: {
      text: '男女比例',//主标题
      textStyle: {//主标题颜色
        color: 'skyblue'
      },
      left: '40%'
    },
    //x|y
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20
        }
      }
      ,
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20
        }
      }
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }

  })
})
</script>

<style scoped lang="scss">
.box1 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title{
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }
  .sex{
    display: flex;
    justify-content: center;
    //margin-top: 30px;
    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .rate{
    display: flex;
    justify-content: space-between;
    color: white;
  }
  .echarts {
    height: 100px;
  }
}
</style>