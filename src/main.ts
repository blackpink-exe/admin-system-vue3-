import { createApp } from 'vue'
import App from '@/App.vue'
//引入模板的全局样式
import '@/styles/index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/element/index.scss'
//引入svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import gloablComponent from '@/components'
//配置element-plus国际化
//@ts-ignore
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './router'
//引入仓库
import pinia from './store'
const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,//中文
})
//引入路由鉴权文件
import './permission'
//安装自定义插件
app.use(gloablComponent)
//安装仓库
app.use(pinia)

app.use(router)





app.mount('#app')


