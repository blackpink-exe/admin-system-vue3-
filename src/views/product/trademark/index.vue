<template>
<div>
  <el-card >
    <el-button type="primary" icon="Plus" style="margin: 10px 0 15px 0;" @click="addTrademark">品牌管理</el-button>
  
    <el-table style="width: 100%;margin: 10px 0;" border :data="trademarkArr" >
    <el-table-column label="序号" width="100px" prop="id" align="center"/><!-- type="index" -->
    <el-table-column prop="tmName" label="品牌名称" align="center"/>
    <el-table-column label="品牌LOGO" >
      <template #="{row}">
        <h1>{{ row.logoUrl }}</h1>
        <img :src="row.logoUrl" alt=""style="width:50px;height:50px">
      </template>
    </el-table-column>
    <el-table-column label="品牌操作">
      <template #="{row}">
        <el-button type="primary" icon="Edit" style="margin:0 10px;background: pink;" @click="updateTrademark(row)"/>
          <el-popconfirm :title='`你确定要删除${row.tmName}?`' width="210px" icon="Delete" @confirm="removeTradeMark(row.id)">
            <template template #reference>
              <el-button type="primary" icon="Delete" style="margin:0 10px;background: red;"/>
            </template>
          </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>



  <el-pagination
  @size-change="changePage"
  @current-change="getHasTrademark"
  v-model:current-page="pageNo"
  v-model:page-size="limit"
  :page-sizes="[3, 5, 7, 9]"
  :background="true"
  layout="prev, pager, next, jumper,->,sizes,total"
  :total="total"
  />
  </el-card> 
  
  
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id?'修改品牌':'添加品牌'">
    
    <el-form style="width: 75%;" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"/>
      </el-form-item>

      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- upload组件属性：action图片上传路径书写/api，代理服务器不发送这次post请求 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>

</div>

</template>

<script setup lang="ts">
import { ref,onMounted, reactive } from 'vue';
import {reqHasTrademark,reqAddOrUpdateTrademark,reqDeleteTrademark} from '@/api/product/trademark'
import { ElMessage, type UploadProps } from 'element-plus'
import type{Records,TradeMark} from '@/api/product/trademark/type'
//当前页码
let pageNo = ref(1)
//每一页展示多少条数据
let limit = ref(3)
//存储已有品牌数据总数
let total=ref(0)
//存储已有品牌的数据
let trademarkArr=ref<Records>([])
//控制对话框显示与隐藏
let dialogFormVisible=ref(false)
//定义收集新增品牌数据
let trademarkParams=reactive<TradeMark>({
  tmName:'',
  logoUrl:''
})
//获取el-form组件实例
let formRef=ref()


//获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用此函数即可
const getHasTrademark=async()=>{
  let result=await reqHasTrademark(pageNo.value,limit.value)
  if(result.code==200){
    total.value=result.data.total
    trademarkArr.value=result.data.records
  }
}
onMounted(()=>{
  getHasTrademark()
})
const changePage=()=>{
  pageNo.value=1
  getHasTrademark()
}
//添加品牌按钮回调
const addTrademark=()=>{
  //title.value=t
  trademarkParams.id=0
  dialogFormVisible.value = true
  trademarkParams.tmName=''
  trademarkParams.logoUrl=''

  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
//修改已有品牌的按钮的回调
const updateTrademark=(row:TradeMark)=>{
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  //title.value=t
  dialogFormVisible.value = true
  trademarkParams.id=row.id
  trademarkParams.tmName=row.tmName
  trademarkParams.logoUrl=row.logoUrl
}
//对话框底部取消按钮
const cancel=()=>{
  dialogFormVisible.value = false
}
//对话框底部确定按钮
const confirm=async()=>{
  //在你发请求之前，要对于整个表单进行校验
  //调用这个方法进行全部表单校验，如果校验全部通过，在执行后面的语代码
  await formRef.value.validate()

  let result:any=reqAddOrUpdateTrademark(trademarkParams)
  if(result.code==200){
    dialogFormVisible.value = false
    ElMessage({
      type:'success',
      message:trademarkParams.id?'修改品牌成功':'添加品牌成功'
    })
    
    getHasTrademark()

  }else{
    ElMessage({
      type:'error',
      message:trademarkParams.id?'修改品牌失败':'添加品牌失败'
    }) 
    dialogFormVisible.value = false
  }
  if(!trademarkParams.id) pageNo.value=1
  console.log(trademarkParams);
}
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
  //要求：上传文件格式png|jpg|gif 4M
  //console.log(rawFile);
  if(rawFile.type=='image/jpeg'||rawFile.type=='image/png'||rawFile.type=='image/gif'){
    if(rawFile.size/1024/1024<=4){
      return true
    }else{
      ElMessage({
        type:'error',
        message:'上传文件大小不能超过4M'
      })
      return false
    }
  }else{
    ElMessage({
      type:'error',
      message:'上传文件格式务必PNG|JPG|GIF'
    })
    return false
  }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  trademarkParams.logoUrl=response.data
  //图片上传成功，清除掉对于图片校验结果
  formRef.value.clearValidate('logoUrl')
}
//品牌自定义校验规则方法
const validatorTmName=(value:any,callBack:any)=>{
  //自定义校验规则：当表单元素触发blur（失去焦点）时候，会触发此方法
  if(value.trim().length>=2){
    callBack()
  }else{
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
//品牌LOGO图片的自定义校验规则
const validatorLogoUrl=(value:any,callback:any)=>{
  if(value){
    callback() 
  }else{
    callback(new Error('品牌LOGO图片不能为空'))
  }
}
//表单校验规则对象
const rules = reactive({
 tmName:[
  {required:true,trigger:'blur',validator:validatorTmName}
 ],
 logoUrl:[
  {required:true,validator:validatorLogoUrl}
 ] 
})

//删除已有品牌的回调
const removeTradeMark=async(id:number)=>{
  let result=await reqDeleteTrademark(id)
  if(result.code==200){
    ElMessage({
      type:'success',
      message:'删除品牌成功'
    })
    getHasTrademark() 
  }else{
    ElMessage({
      type:'error',
      message:'删除品牌失败'
    }) 
  }

}
</script>



<style scoped lang="scss">

</style>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>