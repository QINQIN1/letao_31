//进度条的基本使用
//NProgress.start() 开启进度条
//NProgress.done()关闭进度条

//需求 第一个ajax发送请求时 开启进度条
//所有的ajax请求发送完成后，关闭进度条
$(document).ajaxStart(function(){
    //开启进度条
    NProgress.start();
})
$(document).ajaxStop(function(){
    //关闭进度条
    setTimeout(function(){

        NProgress.done();
    },500)
})