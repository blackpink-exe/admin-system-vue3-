//路由鉴权：鉴权，项目当中路由能不能被访问的权限的设置（某一个路由什么条件可以访问，什么条件不可以访问）
import router from '@/router'

import setting from './setting'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'





//全局守卫：项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to, _from, next) => {
    //to:你将要访问哪个路由
    //from:你从哪个路由而来
    //next:路由的放行函数
    nprogress.start()
    let userStore = useUserStore()
    let token = userStore.token
    let username = userStore.username
    if (token) {
        //登录成功访问login，不能访问，指向首页    
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            if (username) {
                next()
            } else {
                try {
                    await userStore.userInfo()
                    next()
                } catch (error) {
                    //token过期：获取不到用户信息
                    //用户手动修改本地存储token
                    //退出登录->用户相关的数据清空
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }

            }
        }
    } else {
        //未登录
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})
//全局后置守卫
router.afterEach((to, _from, _next) => {
    nprogress.done()
    const title = setting.title
    document.title = `${title}-${to.meta.title}`
})

//用户未登录：可以访问login，其余六个路由不能访问（指向login）
//用户登录成功：不可以访问login[指向首页]，其余的路由可以访问