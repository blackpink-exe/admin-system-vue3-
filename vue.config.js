module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'admin-system(vue3)'  // 注意这里要改成你的仓库名
        : '/'
}