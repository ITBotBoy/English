<template>
    <div class="item">
        <el-form :size="size" :inline="true" :model="validateForm" ref="validateForm" label-width="0">
            <el-form-item
                prop="en"
                :rules="[
                  { required: true, message: '请输入英语', trigger: 'blur' },
                ]"
            >
                <el-input :type="type?'textarea':'text'" v-model="validateForm.en" placeholder="英语"></el-input>
            </el-form-item>
            <el-form-item
                prop="zh"
                :rules="[
                  { required: true, message: '请输入汉语', trigger: 'blur' },
                ]"
            >
                <el-input :type="type?'textarea':'text'" v-model="validateForm.zh" placeholder="汉语"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit" class="iconfont icon-tijiao" type="primary"></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
@Options({
    props:['type'],
    data() {
        return {
            create_time:'',
            size:'large',
            validateForm: {
                en: '',
                zh: ''
            }
        }
    },
    created() {
        moment().format("YYYY-MM-DD");
    },
    methods:{
        onSubmit() {
            this.$refs.validateForm.validate((valid:boolean) => {
                if (valid) {
                    this.$emit('submit',this.validateForm)
                    this.$refs.validateForm.resetFields()
                }
            })
        }
    }
})
export default class Item extends Vue {
}
</script>

<style scoped lang="scss">
.item {
    display: flex;
    .el-form {
        width:100%;
        max-width: 1000px;
        display:flex;
        flex-wrap: nowrap;
        margin: 0 auto;
        ::v-deep .el-form-item__content {
            height:100%;
            .el-button {
                height: inherit;
            }
        }
        ::v-deep .el-form-item.is-required {
            flex: 1;
            .el-form-item__content {
                width:100%;
            }
        }
    }
}

</style>
