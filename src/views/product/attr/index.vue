<template>
    <div>
        <!-- 三级分类全局组件 -->
        <Category :scene="scene"/>
        <el-card style="margin:10px 0px">
            <div v-show="scene==1">
                <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id?false:true" @click="addAttr">添加属性</el-button>
                <el-table border style="margin:10px 0px" :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{row}">
                            <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id" >{{ item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #="{row}">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
                            <el-popconfirm :title='`你确定要删除${row.attrName}?`' width="200px" icon="Delete" @confirm="deleteAttr(row.id)">
                              <template #reference>
                                <el-button type="primary" size="small" icon="Delete"></el-button>
                              </template>
                            </el-popconfirm>
                        </template>                        
                    </el-table-column>
                </el-table>
            </div>



            <div v-show="scene==0">            
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>                       
                </el-form>
                <el-button :disabled="attrParams.attrName?false:true" type="primary" size="default" icon="Plus" @click="addAttrValue">添加属性值</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>    
                <el-table border style="margin:10px 0px" :data="attrParams.attrValueList">
                    <el-table-column width="80px" label="序号" type="index" align="center" ></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{row,$index}">
                            <el-input  :ref="(vc:any)=>inputArr[$index]=vc" v-if="row.flag" @blur="toLook(row,$index)" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
                            <div v-else @click="toEdit(row,$index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性操作">
                        <template #="{$index}">
                            <el-button type="primary" size="default" icon="Delete" @click="attrParams.attrValueList.splice($index,1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table> 
                <el-button type="primary" size="default" @click="save" :disabled="attrParams.attrValueList.length>0?false:true">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>   


            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts"> 
import {watch,ref,reactive,nextTick,onBeforeUnmount} from 'vue';
import useCategoryStore from '@/store/modules/category';
import {reqAttr,reqAddOrUpdateAttr,reqRemoveAttr} from '@/api/product/attr';
import { ElMessage } from 'element-plus';
import type {Attr,AttrResponseData,AttrValue} from '@/api/product/attr/type'
let categoryStore = useCategoryStore()
let attrArr=ref<Attr[]>([])
let scene=ref(1)

let attrParams=reactive<Attr>({
    attrName: '',//新增的属性的名字
    attrValueList:[], //新增的属性值的数组
    categoryId:'',//三级分类的id
    categoryLevel:3//代表的是三分类
})
//准备一个数组：将来存储对应的组件示例el-input
let inputArr=ref<any>([])
watch(()=>categoryStore.c3Id,()=>{
    attrArr.value=[]
    if(!categoryStore.c3Id) return;
    getAttr()
})
const getAttr=async()=>{
    const {c1Id,c2Id,c3Id}=categoryStore
    console.log(c1Id,c2Id,c3Id)
    let result:AttrResponseData=await reqAttr(c1Id,c2Id,c3Id)
    if(result.code==200){
        attrArr.value=result.data
    }
    
}
const addAttr=()=>{
    scene.value=0
    //每一次点击的时候,先清空一下数据再收集数据
    Object.assign(attrParams, {
        attrName: "",//新增的属性的名字
        attrValueList: [//新增的属性值数组
        ],
        categoryId: categoryStore.c3Id,//三级分类的ID
        categoryLevel: 3,//代表的是三级分类
    })
}
const updateAttr=(row:AttrValue)=>{
    scene.value=0
    //将已有的属性对象赋值给attrParams对象即为
    //ES6->Object.assign进行对象的合并
    //深拷贝！！！！！！
    Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
const cancel=()=>{
    scene.value=1
}
const addAttrValue=()=>{
    attrParams.attrValueList.push({
        valueName:'',
        flag:true
    })
    //获取最好el-input组件聚焦
    nextTick(()=>{
        inputArr.value[attrParams.attrValueList.length-1].focus();
    })
}
const save=async()=>{
    //发请求
    let result: any = await reqAddOrUpdateAttr(attrParams);
    //添加属性|修改已有的属性已经成功
    if (result.code == 200) {
        //切换场景
        scene.value = 0;
        //提示信息
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        });
        //获取全部已有的属性与属性值
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }
}
const toLook=(row:AttrValue,$index:number)=>{
    //非法情况1（没有文本内容的情况）
    if(row.valueName.trim()==''){
    //删除调用对应属性值为空的元素
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:'error',
            message:'属性值不能为空'
        })
        return;
    }
    //非法情况2（文本内容不能重复）
    let repeat = attrParams.attrValueList.find((item)=>{
        if(item!=row){
            return item.valueName==row.valueName
        }
    })
    if(repeat){
    //将重复的属性值从数组当中干掉   
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:'error',
            message:'属性值不能重复'
        })
        return;
    }
    row.flag=false 
}
const toEdit=(row:AttrValue,$index:number)=>{
    row.flag=true 
    //nextTick:响应式数据发生变化，获取更新的DOM（组件实例）
    nextTick(()=>{
        inputArr.value[$index].focus();
    })
}
const deleteAttr=async (attrId:number)=>{
    let result= await reqRemoveAttr(attrId)
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getAttr()
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(()=>{
    //清空仓库的数据
    categoryStore.$reset()
})
</script>

<style scoped lang="scss">

</style>