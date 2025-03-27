<template>
  <div>
    <el-table
      :data="PermisstionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="权限值" prop="code"/>
      <el-table-column label="修改时间" prop="updateTime"/>
      <el-table-column label="操作" >
      <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
        <template #="{row}">
          <el-button type="primary" size="small" @click="addPermisstion(row)" :disabled="row.level == 4 ? true : false">
          {{row.level == 3 ? '添加功能': '添加菜单' }}
          </el-button>
          <el-button type="primary" size="small" @click="updatePermisstion(row)" :disabled="row.level==1?true:false">编辑</el-button>
          
          <el-popconfirm :title="`你确定要删除${row.name}?`" @confirm="confirmEvent(row.id)">
            <template #reference>
              <el-button type="danger" size="small" :disabled="row.level==1?true:false">删除</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>



<!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
    width="500"
  >
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
  
</template>

<script setup lang="ts"> 
import { ref, onMounted, reactive } from "vue";
//引入获取菜单请求API
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu';
//引入ts类型
import type { MenuParams, PermisstionResponseData, PermisstionList, Permisstion } from '@/api/acl/menu/type';
import { ElMessage } from "element-plus";
//存储菜单的数据
let PermisstionArr = ref<PermisstionList>([]);
//控制对话框的显示与隐藏
let dialogVisible=ref(false)
//携带的参数
let menuData=reactive<MenuParams>({
  code:'',//权限数值
  level:0, //几级菜单
  name:'', //菜单的名字
  pid:0 //菜单的ID
})
onMounted(()=>{
  getHasPermisstion()
})
const getHasPermisstion=async()=>{
  let result:PermisstionResponseData=await reqAllPermisstion()
  if(result.code==200){
    PermisstionArr.value=result.data

  }
}
const addPermisstion=(row:Permisstion)=>{
  dialogVisible.value=true
  Object.assign(menuData,{
    id:0,
    code:'',
    level:0,
    name:'',
    pid:0 
  })
  menuData.level=row.level+1
  menuData.pid=(row.id as number)
}
const updatePermisstion=(row:Permisstion)=>{
  dialogVisible.value=true
  Object.assign(menuData,row)

}
const save=async()=>{
  let result:Permisstion=await reqAddOrUpdateMenu(menuData)
  //console.log(result)
if(result.code==200){
  getHasPermisstion()
  ElMessage({type:'success',message:menuData.id?'更新成功':'添加成功'})
  dialogVisible.value = false
}
}
const confirmEvent=async(id:number)=>{
  let result:any=await reqRemoveMenu(id)
  //console.log(result)
  if(result.code==200){
    getHasPermisstion()
    ElMessage({type:'success',message:'删除成功'})
    
  }
  
}
</script>

<style scoped lang="scss">

</style>