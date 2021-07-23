const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    publicPath:'/english/',
    outputDir:'english',
    productionSourceMap:false,
    configureWebpack: config => {
        // process.env.NODE_ENV === 'production' && config.plugins.push(new BundleAnalyzerPlugin());
    },
    chainWebpack: config => {
        // process.env.NODE_ENV === 'production' &&
        config.externals({
            'vue-router': 'VueRouter',
            'vue': 'Vue',
            'vuex':'Vuex',
            'vuex-persistedstate':'createPersistedState',
            "vuedraggable": "vuedraggable",
            'element-plus': 'ElementPlus'
        } || {})
    },
    devServer: {
        hot: true,
        compress: true,
        disableHostCheck: true, //webpack4.0 开启热更新
    }
}
