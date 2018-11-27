// 一进页面，判断是否登录过，如果没有登录过，拦截到登录页
$.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function(info){
        console.log(info);
        if(info.error==400){
            location.href="login.html"
        }
        if(info.success){
            console.log('当前用户已登录')
        }
    }
})