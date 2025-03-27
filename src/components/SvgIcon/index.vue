
<template>
  <div>
    <svg :width="width" :height="height">
      <use :xlink:href="prefix+name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
    prefix:{
        type:String,
        default:'#icon-'
    },
    name:String,
    color:{
        type:String,
        default:''
    },
    width:{
        type:String,
        default:'30px'
    },
    height:{
        type:String,
        default:'30px'
    }
})

</script>

<style>
</style>