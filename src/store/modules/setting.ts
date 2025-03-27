//小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'
let useLayOutSettingStore = defineStore('setting', {
    state: () => {
        return {
            fold: false,//用于控制菜单折叠还是收起控制
            refresh: true,//用于控制刷新
        }
    }

})
export default useLayOutSettingStore
