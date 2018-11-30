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

    //点击按钮显示添加模态框
    $('#addBtn').click(function(){
        $('#addModal').modal("show");
    })
    //进行表单校验
    $('#form').bootstrapValidator({
        //校验图标
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok', 
            invalid:'glyphicon glyphicon-remove', 
            validating:'glyphicon glyphicon-refresh', 
        },
        fields: {    // input框中需要配置 name
            categoryName: {
              validators: {
                notEmpty: {
                  message: "请输入一级分类名称"
                }
              }
            }
          }
        });
    //注册表单校验事件，阻止表单默认提交，表单校验成功，通过ajax发送请求提交
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
   
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function( info ) {
              console.log( info );
              if ( info.success ) {
                // 关闭模态框
                $('#addModal').modal("hide");
                // 重新渲染页面, 渲染第一页
                currentPage = 1;
                render();
      
                // 重置表单的内容 和 状态
                // resetForm( true ); 表示内容和状态都重置
                // resetForm();   表示只重置状态
                $('#form').data("bootstrapValidator").resetForm(true)
              }
            }
          })
    })


})