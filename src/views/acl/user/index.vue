<template>
  <div>
    <el-card style="height: 80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：" style="width: 400px;">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item fixed="right">
          <el-button type="primary" @click="search" :disabled="keyword?false:true">搜索</el-button>
          <el-button type="primary" plain  @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0px;">
      <el-button type="primary" @click="addUser" >添加</el-button>
      <el-button type="danger" @click="deleteSelectUser" :disabled="selectIdArr.length>0?false:true">批量删除</el-button>
      <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="userArr" >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
            <template #="{row}">
                <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
                    <template #reference>
                        <el-button type="danger" size="small" icon="Delete">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
      </el-table>


          <!-- 分页器 -->
      <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handler"
      @current-change="getHasUser"
      /> 
    </el-card>

    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
      <template #header>
        <h4>{{userParams.id?'更新用户' : '添加用户'}}</h4>
      </template>
    <!-- 身体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
            <el-form-item label="用户姓名" prop="username">
                <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="name">
                <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="userParams.id?false:true">
                <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
            </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>



    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
    <!-- 头部标题:将来文字内容应该动态的 -->
      <template #header>
        <h4>分配角色用户</h4>
      </template>
    <!-- 身体部分 -->
      <template #default>
        <el-form>
            <el-form-item label="用户姓名" >
                <el-input :disabled="true" v-model="userParams.username"></el-input>
            </el-form-item>
            <el-form-item label="用户角色">
                <el-checkbox @change="handleCheckAllChange"
                v-model="checkAll"
                :indeterminate="isIndeterminate">全选</el-checkbox>
                <!-- 显示职位的的复选框 -->
                <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="(role,index) in allRole" :key="index" :label="role">{{role.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1=false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
    
  </div>
  
</template>

<script setup lang="ts"> 
import {ref,reactive,onMounted,nextTick} from 'vue'
import {reqUserInfo,reqAddOrUpdateUser,reqAllRole,reqSetUserRole,reqRemoveUser,reqSelectUser} from '@/api/acl/user'
import type {UserResponseData,Records,User,AllRole,AllRoleResponseData,SetRoleData} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';
import useLayOutSettingStore from '@/store/modules/setting'
//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(5);
//用户总个数
let total = ref<number>(0);
//存储全部用户的数组
let userArr = ref<Records>([]);
//定义响应式数据控制抽屉的显示与隐藏
let drawer=ref(false)
//控制分配角色抽屉显示与隐藏
let drawer1=ref(false)
//存储全部职位的数据
let allRole = ref<AllRole>([]);
//当前用户已有的职位
let userRole = ref<AllRole>([]);
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([]);
//收集用户信息的响应式数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
});
//获取form组件实例
let formRef = ref<any>();
let keyword=ref('')
let settingStore=useLayOutSettingStore()
onMounted(()=>{
  getHasUser()
})
const getHasUser=async(pager=1)=>{
  pageNo.value=pager
  let result:UserResponseData=await reqUserInfo(pageNo.value,pageSize.value,keyword.value)
  //console.log(result)
  if(result.code==200){
    total.value=result.data.total
    userArr.value=result.data.records
  }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
    getHasUser();
}
//添加用户按钮的回调
const addUser=()=>{
  drawer.value=true
  Object.assign(userParams,{
    id:0,
    username: '',
    name: '',
    password: ''
  })
  //清除上一次的错误的提示信息
  nextTick(()=>{
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
//更新已有的用户按钮的回调
//row:即为已有用户的账号信息
const updateUser=(row:any)=>{
  drawer.value=true
  Object.assign(userParams,row)
  nextTick(()=>{
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
const cancel=()=>{
    drawer.value=false
}
const save=async()=>{
  await formRef.value.validate()
  let result:any=await reqAddOrUpdateUser(userParams)
  if(result.code==200){
    drawer.value=false
    //getHasUser(userParams.id?pageNo.value:1)
    ElMessage({type:'success',message:userParams.id?'更新成功':'添加成功'})
    //浏览器自动刷新一次
    window.location.reload();
  }else{
    drawer.value=false
    ElMessage({type:'error',message:userParams.id?'更新失败':'添加失败'})
  }

}
const validatorUsername=(_rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=5){
    callBack();
  }else{
    callBack(new Error('用户名字至少五位'))
  }
}
const validatorname=(_rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=5){
    callBack();
  }else{
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword=(_rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=6){
    callBack();
  }else{
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验的规则对象
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
//收集顶部复选框全选数据
const checkAll = ref<boolean>(false);
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true);
//分配角色按钮的回调
const setRole=async(row:any)=>{

  Object.assign(userParams,row)
  let result:AllRoleResponseData= await reqAllRole(row.id)
  if(result.code==200){
    allRole.value=result.data.allRolesList
    userRole.value=result.data.assignRoles
    drawer1.value=true
  }
}
const handleCheckAllChange=(val:any)=>{
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange=(value:any)=>{
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
const confirmClick=async()=>{
  let data:SetRoleData ={
    userId:(userParams.id as number),
    roleIdList:userRole.value.map(item=>{
      return (item.id as number)
    })
  }
  let result:any=await reqSetUserRole(data)
  if(result.code==200){
    drawer1.value=false
    ElMessage({type:'success',message:'分配职务成功'})
    getHasUser(pageNo.value)
  }
}
//删除某一个用户
const deleteUser=async(id:number)=>{
  let result:any=await reqRemoveUser(id)
  if(result.code==200){
    ElMessage({type:'success',message:'删除成功'})
    getHasUser(pageNo.value)
  }
}
//table复选框勾选的时候会触发的事件
const selectChange=(value:any)=>{
  selectIdArr.value=value
}
//批量删除按钮的回调
const deleteSelectUser=async()=>{
  //整理批量删除的参数
  let idsList: any =selectIdArr.value.map(item=>item.id)
  let result:any = await reqSelectUser(idsList)
  if(result.code==200){
    ElMessage({type:'success',message:'删除成功'})
    getHasUser(pageNo.value)
  }
}
const search=()=>{
  getHasUser()
  keyword.value=''
}
const reset=()=>{
  settingStore.refresh=!settingStore.refresh
}
</script>



<style scoped lang="scss">
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>