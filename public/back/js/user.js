$(function () {
    //标记当前页
    var currentPage=1;
    //每页的条数
    var pageSize=5;
    //当前用户id
    var currentId;
    // 修改状态id
    var isDelete;    
    // 一进页面发送ajax请求，请求数据渲染页面
    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info)
                var htmlStr = template("userTpl", info);
                $('tbody').html(htmlStr);
                // 在ajax请求回来后, 根据最新的数据, 进行初始化分页插件
                $('#paginator').bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total/info.size),
                    onPageClicked: function (a, b, c, page) {
                        // console.log(page)
                        
                        // 更新当前页
                        currentPage=page;
                        // 重新渲染页面
                        render();
                    }
                })
            }
        });
    }
    // 给所有按钮，添加点击事件，通过事件委托
    $('tbody').on('click','.btn',function(){
        //显示模态框
        $('#userModal').modal("show");
        currentId=$(this).parent().data("id");
        isDelete=$(this).hasClass('btn-danger')?0:1;
    })
    // 模态框确认按钮被点击 发送ajax请求
    $('#confirmBtn').click(function(){
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:currentId,
                isDelete:isDelete
            },
            dataType:"json",
            success:function(info){
                console.log(info)
              if(info.success){
                  $('#userModal').modal('hide');
                //   重新渲染页面
                render();
              }
            }
        })
    })


})