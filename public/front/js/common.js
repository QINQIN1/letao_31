//区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
    deceleration:0.0005,
    indicators:false
})
// 轮播图初始化
//获得slide插件对象
var gallery=mui('.mui-slider');
gallery.slider({
    interval:4000
})