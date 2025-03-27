 <template>
  <div class="layout_cantainer">
    <!--左侧菜单-->
    <div class="layout_slider">
        <Logo />
        <!-- 展示菜单 -->
        <!-- 滚动组件 --> 
        <el-scrollbar class="scrollbar">
            <!-- 菜单组件 -->
            <el-menu :collapse="LayOutSettingStore.fold" :default-active="$route.path" background-color="#001529" text-color="white">
                <Menu :menuList="userStore.menuRoutes"></Menu>
            </el-menu>
        </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
        <Tabbar/>
    </div>
    <!--内容展示区域-->
    <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
        <Main/>
    </div>
        
  </div>
</template>

<script setup lang="ts"> 
import {useRoute} from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'
//获取用户相关的小仓库
let LayOutSettingStore = useLayOutSettingStore()
const userStore = useUserStore()
//获取当前路由对象
let $route = useRoute()
</script>

<style scoped lang="scss">
.layout_cantainer{
    width: 100%;
    height: 100vh;

    .layout_slider{
        width:$base-menu-width;
        height:100vh;
        background: $base-menu-background;
        transition: all 0.3s;
        .scrollbar{
            width:100%;
            height:calc(100vh - $base-menu-logo-height);
            .el-menu{
                border-right: none;
            }
        }

    }
    .layout_tabbar{
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;
        //background: white;
        &.fold{
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width;

        }
    }
    .layout_main{
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        //background: pink;
        //background: white;
        top: $base-tabbar-height;
        left: $base-menu-width;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;        
        &.fold{
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>