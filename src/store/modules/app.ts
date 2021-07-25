import {VuexModule, Module, Mutation, Action} from 'vuex-module-decorators';
import {CloudInfo,ListInfo,ItemInfo} from '@/types/config'
@Module({
    name: 'app',
    namespaced: true
})
export default class Lists extends VuexModule {
    public account:string=''
    public cloudInfo: CloudInfo = {
        create_time: '',
        update_time: ''
    };
    public fileLists:string[]= []
    public lists:ListInfo= {}
    @Mutation
    public setUpdateTime(info: CloudInfo): void {
        this.cloudInfo = info;
    }
    @Mutation
    public setAccount(account: string): void {
        this.account = account;
    }
    @Mutation
    public updatePage(data:[]) {
        if(data.length){
            this.fileLists=data
        }
    }
    @Mutation
    public updateLists({v,k}:{v:ListInfo,k?:string}) {
        if(!k){
            this.lists=Object.assign(this.lists,v)
            return
        }
        let weekTime=`${new Date().getFullYear()}_${moment(k).week()}`;
        !this.fileLists.includes(weekTime) && this.fileLists.push(weekTime);
        if(this.lists[k]){
            this.lists=Object.assign(this.lists,{[k]:v})
        }else {
            this.lists=Object.assign({[k]:v},this.lists)
        }
    }
    
    @Action({commit: 'updateLists'})
    public async fetchLists(){
    
    }
}
