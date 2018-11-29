$(function(){
    var currentPage=1;
    var pageSize=5;

    //一进入页面，先渲染页面
    render();
    function render(){
        //发送ajax请求
        $.ajax({
           type:"get",
           url:"/category/queryTopCategoryPaging",
           data:{
               page:currentPage,
                pageSize:pageSize
           },
           dataType:"json",
           success:function(info){
               console.log(info)
            var htmlStr=template("firstTpl",info);
            $('tbody').html(htmlStr);

            //进行分页初始化
            $("#paginator").bootstrapPaginator({
                // 指定版本号
                bootstrapMajorVersion:3,
                currentPage:info.page,
                totalPages:Math.ceil(info.total/info.size),
                onPageClicked:function(a,b,c,page){
                    console.log(page);
                    // 更新当前页
                    currentPage=page;
                    //重新渲染页面
                    render();
                }
            })


           }
        });
    }

    //点击按钮显示


})