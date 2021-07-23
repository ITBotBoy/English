<template>
    <router-view></router-view>
</template>

<script lang="ts">

import Item from './components/Item.vue';

export default ({
    components: {
        Item,
    },
})
</script>
<style>
body {
    margin: 0;
}
.el-dialog {
    max-width: 900px;
}
.el-message-box {
    width: 250px!important;
}
.el-button.iconfont {
    font-size: 14px!important;
}
</style>
<style lang="scss">
.wrapper {
    max-width:1200px;
    margin:0 auto !important;
    background-color:#f9f9f9;
    overflow: hidden;
}
</style>
