// 这里跟vue2有点区别，vue2中是直接导入vue，然后通过vue.use(xxx)
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

import getters from './getters'
interface Modules {
    [propName: string]: any;
}
// 因为我把模块拆分了，但是我又不想每次都导入，就通过这个自动导入modules目录下的模块
const modulesFiles = require.context('./modules', true, /\.ts$/);
const modules = modulesFiles.keys().reduce((module:Modules, modulePath) => {
    const moduleName:string = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    module[moduleName] = value.default
    return module
}, {})
// 调用createStore
export default createStore({
    plugins: [createPersistedState({key: 'English'})],
    getters,
    modules
})
