<template>
  <div>
    <el-card>
    <el-table boder :data="skuArr" style="margin: 10px 0;width: 100%;"><!--  -->
      <el-table-column label="序号" align="center" type="index" width="80px"></el-table-column>
      <el-table-column label="名称" prop="skuName" show-overflow-tooltip width="150px" ></el-table-column>
      <el-table-column label="描述" prop="skuDesc" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #="{row}">
          <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;"/>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="150px"></el-table-column>
      <el-table-column label="价格" prop="price" width="150px"></el-table-column>
      <el-table-column label="操作" width="450px" fixed="right">
        <template #="{row}">
          <el-button type="primary" size="small" @click="updateSale(row)" :icon="row.isSale==1?'Bottom':'Top'"></el-button>
          <el-button type="primary" size="small" @click="updateSku" icon="Edit"></el-button>
          <el-button type="primary" size="small" @click="findeSku(row)" icon="InfoFilled"></el-button>
          <el-popconfirm 
          :title="`你确定删除${row.skuName}?`" 
          icon="InfoFilled" 
          icon-color="#626AEF"
          @confirm="removeSku(row)"
          width="200px" 
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="400"
      @size-change="handler"
      @current-change="getHasSku"
    /> 


    <!-- 抽屉组件 展示商品的详情 -->
    <el-drawer v-model="drawer" >
    <template #header>
      <h4>查看商品详情</h4>
    </template>
    <template #default>
      <el-row style="margin: 10px 0px;">
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row style="margin: 10px 0px;">
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row style="margin: 10px 0px;">
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row style="margin: 10px 0px;">
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin:5px;">{{item.valueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0px;">
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id" style="margin:5px;">{{item.saleAttrValueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0px;">
        <el-col :span="6">商品图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width: 100%;height: 100%;"/>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
  </el-card>
  </div>
</template>

<script setup lang="ts"> 
import { ref,onMounted} from 'vue';
import {reqSkuList,reqSaleSku,reqCancelSale,reqSkuInfo,reqRemoveSku} from '@/api/product/sku'
import type{SkuResponseData,SkuData,SkuInfoData} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus';
let pageNo=ref<number>(1)
let pageSize=ref<number>(10)
let total=ref(1)
let skuArr=ref<SkuData[]>([])
let drawer=ref(false)
let skuInfo=ref<any>({})
onMounted(()=>{
  getHasSku()
})
const getHasSku=async(pager=1)=>{
  pageNo.value=pager
  let result:SkuResponseData=await reqSkuList(pageNo.value,pageSize.value)
  //console.log(result)
  if(result.code==200){
    total.value=result.data.total
    skuArr.value=result.data.records
  }
}
const handler=(pagesize:number)=>{
  pageSize.value=pagesize
  getHasSku(pageNo.value);
}
const updateSale=async(row:SkuData)=>{
  if(row.isSale==0){
    await reqSaleSku((row.id as number));
    ElMessage({type:'success',message:'上架成功'})
    getHasSku(pageNo.value)
  }else{
    await reqCancelSale((row.id as number))
    ElMessage({type:'success',message:'下架成功'})
    getHasSku(pageNo.value)
  }
}
const updateSku=()=>{
  ElMessage({type:'success',message:'程序员正在努力更新中...'})
}
const findeSku=async(row:SkuData)=>{
  drawer.value=true  
  let result:SkuInfoData = await reqSkuInfo((row.id as number))
  console.log(result)
  if(result.code==200){
    skuInfo.value=result.data
  }
}
const removeSku=async(row:any)=>{
  let result=await reqRemoveSku(row.id)
  if(result.code==200){
    ElMessage({type:'success',message:`${result.message}`})
    getHasSku(pageNo.value)
  }else{
    ElMessage({type:'error',message:`${result.message}`})
  }
}

</script>

<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>