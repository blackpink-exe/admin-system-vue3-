<template>
  <div>
    <el-card style="height: 80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索：" style="width: 400px;">
          <el-input placeholder="请您输入搜索职位关键字" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item fixed="right">
          <el-button type="primary" @click="search" :disabled="keyword ? false : true">搜索</el-button>
          <el-button type="primary" plain  @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
      <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
      <el-table border style="margin: 10px 0px;" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="职位名称" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" width="280px" label="操作">
          <template #="{row}">
            <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
                <template #reference>
                    <el-button type="primary" size="small" icon="Delete">删除</el-button>
                </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
      @size-change="sizeChange" />
    </el-card>



    <!-- 添加职位与更新已有职位的结构:对话框 -->
    <el-dialog v-model="dialogVisite" :title="RoleParams.id?'更新职位':'添加职位'">
    <el-form :model="RoleParams" ref="form" :rules="rules">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请您输入职位名称" v-model="RoleParams.roleName"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisite = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>




  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
    <!-- 身体部分 -->
      <template #default>
        <el-tree
          ref="tree"
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all="true"
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button >取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
  </el-drawer>



  </div>
  
</template>

<script setup lang="ts"> 
import {ref,reactive,onMounted, nextTick} from 'vue'
import {reqAllRoleList,reqAddOrUpdateRole,reqAllMenuList,reqSetPermisstion} from '@/api/acl/role'
import type {Records,RoleData,RoleResponseData,MenuList,MenuResponseData} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
let pageNo=ref(1)
let pageSize=ref(10)
let total=ref(0)
let keyword=ref('')
let allRole=ref<Records>([])
let settingStore=useLayOutSettingStore()
//控制对话框的显示与隐藏
let dialogVisite=ref(false)
//获取form组件实例
let form = ref<any>();
//获取tree组件实例
let tree = ref<any>();
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
    roleName: ''
})
let drawer=ref(false)
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([]);
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([]);
onMounted(()=>{
  getHasRole()
})
const getHasRole=async(pager=1)=>{
  pageNo.value=pager
  let result:RoleResponseData =await reqAllRoleList(pageNo.value,pageSize.value,keyword.value)
  //console.log(result)
  if(result.code==200){
    allRole.value=result.data.records
    total.value=result.data.total
  }
}
const sizeChange=()=>{
  getHasRole(pageNo.value)
}
const search=()=>{
  getHasRole(pageNo.value)
}
const reset=()=>{
  settingStore.refresh=!settingStore.refresh
}
const addRole=()=>{
  Object.assign(RoleParams,{roleName: '',id:0})
  dialogVisite.value=true
  //清空上一次表单校验错误结果
  nextTick(()=>{
    form.value.clearValidate('roleName')
  })
}
const updateRole=(row:RoleData)=>{
  Object.assign(RoleParams,row)
  dialogVisite.value=true
  //清空上一次表单校验错误结果
  nextTick(()=>{
    form.value.clearValidate('roleName')
  })
}
const validatorRoleName=(_rule:any,value:any,callBack:any)=>{
  //console.log(value)
  if(value.trim().length>=2){
    callBack()
  }else{
    callBack(new Error('职位名称至少两位'))
  }
}
const rules={
  roleName:[{required:true,trigger:'blur',validator: validatorRoleName }]
}
//树形控件的测试数据
const defaultProps = {
  children: 'children',
  label: 'name',
}
const setPermisstion=async(row:any)=>{
  drawer.value=true
  Object.assign(RoleParams,row)
  let result:MenuResponseData =await reqAllMenuList((RoleParams.id as number))
  //console.log(result)
  if(result.code==200){
    menuArr.value=result.data
    selectArr.value = filterSelectArr(menuArr.value,[])
  }
}
const filterSelectArr=(allData: any, initArr: any)=>{
  allData.forEach((item:any)=>{
    if(item.select&&item.level==4){
      initArr.push(item.id)
    }
    if(item.children&&item.children.length>0){
      filterSelectArr(item.children,initArr)      
    }
  })
  return initArr
}
const handler=async()=>{
  let arr1=tree.value.getCheckedKeys()
  let arr2=tree.value.getHalfCheckedKeys()
  let arr=arr1.concat(arr2)
  //console.log(arr1)
  let result:any=await reqSetPermisstion((RoleParams.id as number),arr)
  if(result.code==200){
    drawer.value=false
    ElMessage({type:'success',message:'分配权限成功'})
    window.location.reload()
  }
}
const removeRole=(_row:any)=>{

}
const save=async()=>{
  //console.log(form)
  //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
  await form.value.validate()
  let result:any=await reqAddOrUpdateRole(RoleParams)
  if(result.code==200){
    ElMessage({type:'success',message:RoleParams.id?'更新成功':'添加成功'})
    getHasRole(RoleParams.id?pageNo.value:1)
    dialogVisite.value=false    
  }
}





</script>

<style scoped lang="scss">
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>