<template>
    <div class="wrapper">
        <div class="header">
            <el-row :gutter="10">
                <el-col class="left" :xs="24" :sm="12">
                    <el-select v-model="schema" placeholder="模式选择">
                        <el-option
                            v-for="i in schemaList" :key="i.k" :label="i.v"
                            :value="i.k">
                        </el-option>
                    </el-select>
                    <el-button @click="type=!type" :size="size" class="iconfont icon-zhuanhuan">
                        <span style="margin-left: 8px;">{{type ? '例句' : '单词'}}</span>
                    </el-button>
                </el-col>
                <el-col class="right" :xs="24" :sm="8">
                    <el-date-picker
                        @change="pullLists(false)"
                        v-model="dataTime"
                        format="YYYY-MM-DD"
                        type="data"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-button v-if="schema==='1'" @click="mode=!mode" :size="size" class="iconfont icon-zhuanhuan">
                        <span style="margin-left: 8px;">{{mode ? '汉英' : '英汉'}}</span>
                    </el-button>
                </el-col>
                <el-col class="right btnWrap" :xs="24" :sm="4">
                    <el-button @click="pushLists" type="text" icon="el-icon-upload"></el-button>
                    <el-button @click="pullLists" type="text" icon="el-icon-refresh-right"></el-button>
                    <el-button v-if="!hash" @click="loginVisible=true" type="text" icon="el-icon-user"></el-button>
                </el-col>
            </el-row>
            <item v-if="schema==='0'" :type="type" @submit="saveItem"></item>
        </div>
        <el-dialog
            title="用户登录"
            v-model="loginVisible"
            :before-close="cancelDialog"
            width="80%"
        >
            <el-input v-model.trim="hash" placeholder="请输入用户账号"></el-input>
            <template #footer>
                <el-button type="info" @click="loginVisible = false;cancelDialog()">取消</el-button>
                <el-button type="primary" @click="login">立即登录</el-button>
            </template>

        </el-dialog>
        <el-scrollbar>
            <el-row :gutter="10" class="content">
                <!--昨日-->
                <template v-for="(v,k) in pageLists" :key="k">
                    <el-col :xs="24" :sm="12" :md="8">
                        <el-card class="box-card">
                            <template #header>
                                <span>{{k}}</span>
                                <div>
                                    <!-- <el-button size="mini" type="text" icon="el-icon-check"></el-button>-->
                                    <el-button @click="updateLists({v,k})" size="mini" type="text" icon="el-icon-upload"></el-button>
                                </div>
                            </template>
                            <draggable
                                class="list-group"
                                v-bind="dragOptions"
                                :component-data="{ tag: 'div', name: 'flip-list', type: 'transition' }"
                                :list="v"
                                tag="transition-group"
                                item-key="_t"
                                @start="isDragging = true"
                                @end="isDragging = false"
                            >
                                <template #item="{ element,index }">
                                    <List @delete="v.splice(index,1)" :type="type" :list="element" :mode="mode" :schema="schema"></List>
                                </template>
                            </draggable>
                        </el-card>
                    </el-col>
                </template>
            </el-row>
            <el-pagination
                background
                :small="isSmall"
                @current-change="changePage"
                :page-size="1"
                layout="prev, pager,next,slot"
                v-model:currentPage="index"
                :total="fileLists.length">
                <template #default>
                    <p style="color: #ccc;font-size: 12px;">{{formatTime(fileLists.reverse()[index-1])}}</p>
                </template>
            </el-pagination>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import Draggable from 'vuedraggable'
import clone from 'lodash/clone'
import difference from 'lodash/difference'

import reduce from 'lodash/reduce'
import concat from 'lodash/concat'
const schemaList =[
    {k:'3',v:'预览模式'},
    {k:'0',v:'编辑模式'},
    {k:'1',v:'记忆模式'},
    {k:'2',v:'对比模式'}
]
const origin = ['https://source.renserve.com/assets/txt/2021/05/24/b0942262-bc3c-11eb-91cf-fa163e1211f0.pdf']
const mockData = []

import {Options, Vue} from 'vue-class-component';
import Item from '@/components/Item.vue';
import List from '@/components/List.vue';
import {CloudInfo, ListInfo,ItemInfo} from '@/types/config.d.ts'
import {createNamespacedHelpers} from 'vuex'
const {mapState, mapActions, mapMutations} = createNamespacedHelpers('app');// 通过这个函数来辅助我们找到user模块
@Options({
    data() {
        return {
            index:1,
            loginVisible:false,
            mode: false,
            type: false,
            // 在 #app 标签下渲染一个按钮组件//172.24.29.21:5200 /coin/api
            dataTime: '',
            hash: '',
            isSmall:false,
            currentTime: '',
            itemList: {},
            schemaList,
            schema: '3',
            size: 'large',
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: (<any>this).schema==='1' || (<any>this).schema==='3',
                ghostClass: "ghost"
            };
        },
        pageLists(){
            let rangeTime=this.formatTime(this.fileLists.reverse()[this.index-1],[])
            return reduce(this.lists,(result:ListInfo, v, k):ListInfo=>{
                k>=rangeTime[0] && k<=rangeTime[1] && (result[k]=v)
                return result
            },{})
        },
        ...mapState([
            'fileLists',
            'cloudInfo',
            'account',
            'lists'
        ])
    },
    components: {
        Item,
        List,
        Draggable
    },
    methods: {
        changePage(v:number){
            this.getLists(this.fileLists.reverse()[v-1])
            this.dataTime=this.formatTime(this.fileLists.reverse()[v-1],'startTime')
        },
        formatTime(v:string,type:any){
            if(/_/.test(v)){
                let data=v.split('_')
                let handleTime=moment(data[0]).week(data[1])
                let startTime=handleTime.startOf('week').format('YYYY-MM-DD')
                let endTime=handleTime.endOf('week').format('YYYY-MM-DD')
                if(type){
                    if(typeof(type)==='string'){
                        return type==='startTime'?startTime:endTime
                    }else {
                        return [startTime,endTime]
                    }
                }else {
                    return `${startTime} ~ ${endTime}`
                }
            }
        },
        cancelDialog(done:any){
            this.hash='';
            done && done()
        },
        login(){
            if(this.hash){
                axios.post(`${this.baseUrl}/tools/login`,{
                    k:this.hash,
                    c:'english'
                }).then((response:any)=> {
                    if(!response.data.code){
                        this.setAccount(this.hash)
                        this.loginVisible=false
                    }else {
                        this.hash=''
                        this.setAccount('')
                    }
                    let type=response.data.code?'error':'success'
                    this.$message[type]({
                        message:response.data.msg,
                        type
                    });
                }).catch((err:any)=>{
                    this.$message.error({
                        message:err.message || '登录失败',
                        type:'error'
                    });
                })
            }
        },
        getPage(){
            //本地
            this.hash && axios.get(`${this.baseUrl}/tools/index?dir=english&c=english&k=${this.hash}`)
                .then((response:any)=> {
                    //更新
                    let needPost=difference(this.fileLists,response.data.data)
                    let needUpdate=difference(response.data.data,this.fileLists)
                    if(needUpdate.length){
                        this.updatePage(response.data.data)
                    }
                    if(needPost.length===2){
                        //每周自动检测更新,不能把原来的更新掉，本周更新上周的数据
                        let t=needPost[0]
                        let rangeTime= this.formatTime(t,[])
                        let lists=reduce(this.lists,(result:ListInfo, v, k):ListInfo=>{
                            k>=rangeTime[0] && k<=rangeTime[1] && (result[k]=v)
                            return result
                        },{})
                        //更新此次数据
                        this.postData(lists,t,'数据自动上传更新完成')
                    }
                }).catch((err:any)=>{
                    this.$message.error({
                        message:err.message || '获取分页失败',
                        type:'error'
                    });
                })
        },
        getLists(week:string){
            let currentTime = moment().format('YYYY-MM-DD')
            let t=week || `${new Date().getFullYear()}_${moment(this.dataTime || currentTime).week()}`
            if(!week){
                this.index=this.fileLists.reverse().findIndex((i:string)=>i===t)+1
            }
            this.hash && axios.get(`${this.baseUrl}/tools?dir=english&c=english&t=${t}&k=${this.hash}`)
                .then((response:any)=> {
                    let type=response.data.code?'error':'success'
                    if(!response.data.code){
                        this.updateLists({v:response.data.data})
                        this.itemList[this.currentTime]=this.lists[this.currentTime] || []
                    }else {
                        /*let url=window.location.href.replace(`#${this.hash}`,'')
                        // @ts-ignore
                        window.history.pushState({},0,url);*/
                        this.hash=''
                        this.setAccount('')
                    }
                    this.$message[type]({
                        message:response.data.msg,
                        type
                    });
                }).catch((err:any)=>{
                    this.$message.error({
                        message:err.message || '更新失败',
                        type:'error'
                    });
                })
        },
        pullLists(isConfirm:boolean=true){
            if(!isConfirm){
                return this.getLists()
            }
            this.$confirm('确认获取云存储数据?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((err:any) => {
                if(!this.hash){
                    return this.$message.error('请联系管理员获取登录账号！')
                }
                this.getLists()
            }).catch(() => {});
        },
        postData(data:object,t:string,msg?:string){
            this.hash && axios.post(`${this.baseUrl}/tools/update`,{
                t,
                dir:'english',
                c:'english',
                k:this.hash,
                v:data
            }).then((response:any)=> {
                let type=response.data.code?'error':'success'
                if(response.data.code){
                    /*let url=window.location.href.replace(`#${this.hash}`,'')
                    // @ts-ignore
                    window.history.pushState({}, 0, url);*/
                    this.hash=''
                    this.setAccount('')
                }
                this.$message[type]({
                    message:msg || response.data.msg,
                    type
                });
            }).catch((err:any)=>{
                this.$message.error({
                    message:err.message || '更新失败',
                    type:'error'
                });
            })
        },
        pushLists(){
            let currentTime = moment().format('YYYY-MM-DD')
            let t=`${new Date().getFullYear()}_${moment(this.dataTime || currentTime).week()}`
            this.$confirm('确认上传本地存储数据?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(!this.hash){
                    return this.$message.error('请联系管理员获取登录账号！')
                }
                this.postData(this.lists,t)
            }).catch(() => {});
        },
        ...mapMutations([
            'setAccount',
            'setUpdateTime',
            'updatePage',
            'updateLists',
        ]),
        saveItem(item:ItemInfo){
            let currentTime = moment().format('YYYY-MM-DD')
            let _currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            item.t=currentTime
            item._t=_currentTime
            let posts: ItemInfo = clone(item)
            if (!this.itemList[currentTime]) {
                this.itemList[currentTime]=[posts]
            } else {
                this.itemList[currentTime].unshift(posts)
            }
            this.updateLists({v:this.itemList[currentTime],k:currentTime})
        }
    },
    created() {
        this.isSmall=document.body.clientWidth<768
        this.hash=this.account || location.hash.replace('#','')
        this.getPage()
        this.currentTime = moment().format('YYYY-MM-DD')
        this.dataTime= this.currentTime
        this.itemList[this.currentTime]=this.lists[this.currentTime] || []
    }
})
export default class Home extends Vue {
}
</script>

<style scoped lang="scss">
::v-deep .el-scrollbar__view {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom:100px;
    .el-pagination {
        position: absolute;
        bottom:0;
        left:0;
        right:0;
        text-align: center;
        //margin-bottom:20px;
    }
}
.btnWrap {
    .el-button {
        border: 1px solid #409EFF;
        width:40px;
    }
}
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
}


::v-deep [readonly] {
    border: none!important;
}
::v-deep .el-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
        width:30px;
        border: 1px solid #409EFF;
        border-radius: 50%;
    }
}
.content {
    display:flex;
}
::v-deep .el-scrollbar {
    height:100vh;
    width:100%;
    .is-horizontal {
        display:none !important;
    }
    &__wrap {
        overflow-x:hidden;
    }
}
::v-deep .el-card {
    margin-bottom:10px;
    &__header {
        padding:8px 20px !important;
        color:#999999;
    }
    &__body {
        color:#333;
    }
}
.header {
    .el-row {
        > div {
            margin-bottom:10px;
        }
    }
    .el-button {
        margin-left:10px;
    }
    .right {
        display:flex;
        justify-content:flex-end;
    }
}
</style>
