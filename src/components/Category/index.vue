<template>
    <el-card>
        <el-form inline="true">
            <el-form-item label="一级分类" style="width: 300px;">
                <!-- change:选中值发生变化时触发 -->
                <el-select v-model="categoryStore.c1Id" @change="handler" :disabled="scene==0?true:false">
                    <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
                    <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类" style="width: 300px;">
                <el-select v-model="categoryStore.c2Id" @change="handler1" :disabled="scene==0?true:false">
                    <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类" style="width: 300px;">
                <el-select v-model="categoryStore.c3Id" :disabled="scene==0?true:false">
                    <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category';
let categoryStore = useCategoryStore()
onMounted(()=>{
    getC1()
})
const getC1=()=>{
    categoryStore.getC1()
}
//
const handler=()=>{
    categoryStore.c2Id=''    
    categoryStore.c2Arr=[]
    categoryStore.c3Id=''
    categoryStore.getC2()
}
const handler1=()=>{
    categoryStore.c3Id=''
    categoryStore.getC3()
}
defineProps(['scene'])
</script>

<style scoped></style>