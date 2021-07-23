<template>
    <div class="list" :class="[border,type?'flex_ud':'flex_lr']">
        <div class="flexRow">
            <div class="flexWrap realInfo">
                <el-input :type="type?'textarea':'text'" autosize :class="list._flag && 'flagItem'" class="left" :readonly="readonly_en" v-model="en"></el-input>
                <el-input :type="type?'textarea':'text'" autosize :class="list._flag && 'flagItem'" class="right" :readonly="readonly_zh" v-model="zh"></el-input>
                <div class="btnWrap">
                    <el-button v-if="schema==='0'" type="text" @click.stop="confirm" icon="el-icon-delete"></el-button>
                    <el-button v-if="schema!=='3' && schema!=='2'" type="text" @click.stop="setIsEdit" icon="el-icon-edit"></el-button>
                </div>
            </div>
            <div class="flexWrap compareInfo" v-if="schema==='2'">
                <el-input :type="type?'textarea':'text'" autosize :class="list._flag && 'flagItem'" class="left" readonly v-model="list._en"></el-input>
                <el-input :type="type?'textarea':'text'" autosize :class="list._flag && 'flagItem'" class="right" readonly v-model="list._zh"></el-input>
                <div class="btnWrap">
                    <el-button type="text" :icon="list._flag?'el-icon-star-on':'el-icon-star-off'" @click="list._flag=!list._flag"></el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
@Options({
    props:{
        'list':Object,'mode':Boolean,'schema':String,'type':Boolean
    },
    data() {

    },
    methods:{
        confirm(){
            this.$confirm('确认删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('delete')
            }).catch(() =>{});
        },
        setIsEdit(){
            if((<any>this).schema==='1'){
                (<any>this).list._edit=!(<any>this).list._edit
            }else {
                (<any>this).list.edit=!(<any>this).list.edit
            }
        }
    },
    computed:{
        border(){
            switch (this.schema){
                case '0':case '3':
                    return this.type && 'border'
                case '2':
                    return 'border'
                default:
                    return ''
            }
        },
        readonly_zh(){
            let v1=(<any>this).list._edit || (<any>this).mode
            return (<any>this).schema==='1'?v1:!(<any>this).list.edit
        },
        readonly_en(){
            let v1=(<any>this).list._edit || !(<any>this).mode
            return (<any>this).schema==='1'?v1:!(<any>this).list.edit
        },
        en:{
            get():string{
                return ((<any>this).schema==='1' && (<any>this).mode)?(<any>this).list._en:(<any>this).list.en
            },
            set(v:string):void{
                if((<any>this).schema==='1'){
                    (<any>this).list._en=v
                }else {
                    (<any>this).list.en=v
                }
            }
        },
        zh:{
            get():string{
                return ((<any>this).schema==='1' && !(<any>this).mode)?(<any>this).list._zh:(<any>this).list.zh
            },
            set(v:string):void{
                if((<any>this).schema==='1'){
                    (<any>this).list._zh=v
                }else {
                    (<any>this).list.zh=v
                }
            }
        }
    },
    created() {

    }
})
export default class Item extends Vue {
}
</script>

<style scoped lang="scss">
.previewWrap {
    margin-bottom:20px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
::v-deep .flagItem .el-input__inner{
    color:#000;
}
.el-button {
    padding:0 4px;
}
.border {
    border: 1px solid #ccc;
    margin-bottom:10px;
    border-radius: 5px;
    padding: 3px;
    box-sizing: border-box;
}
.flexWrap {
    display: flex;
}
.flex_ud {
    .flexWrap {
        flex-direction: column;
        .btnWrap {
            align-self: flex-end;
        }
    }
}
.flex_lr {
    .left {
        flex: 1;
    }
    .right {
        flex: 2;
    }
    .realInfo {
        margin-bottom:5px;
    }
    .compareInfo {
        line-height:30px;
    }
}

</style>
