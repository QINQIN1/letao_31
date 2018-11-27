//1 进度条的基本使用
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

$(function(){
    //2 公共的功能
    //左侧二级菜单
    $('.category').click(function(){
        $(this).next().stop().slideToggle();
    })
    //左侧侧边栏
    $('.icon_left').click(function(){
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
    })

    //3 退出功能
    // 点击右侧按钮，显示模态框
    $('.icon_right').click(function(){
        $('#logoutModal').modal("show")
    })
    //点击退出，完成退出功能
    $('#logoutBtn').click(function(){
        //发送ajax请求，销毁登录记录，退回到登录页面
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function(info){
                console.log(info);
                // 退出成功，跳转到登录页
                if(info.success){
                    location.href="login.html"
                }
            }
        })
    })
})