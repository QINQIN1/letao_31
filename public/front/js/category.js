$(function(){
    // 一进页面，发送请求，渲染左侧一级分类页面
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr=template("leftTpl",info);
            $('.lt_category_left ul').html(htmlStr);
            renderById(info.rows[0].id);
        }
    });

    // 给左侧所有的a添加点击事件(事件委托)
    $('.lt_category_left').on('click','a',function(){
        // 让自己高亮,排他
        $('.lt_category_left ul a').removeClass("current");
        $(this).addClass("current");
        var id=$(this).data('id');
        renderById(id);
    });

    //根据一级列表id，渲染二级列表数据
    function renderById(id){
        //发送ajax请求
        $.ajax({
            type:"get",
            url:"/category/querySecondCategory",
            data:{
                id:id
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("rightTpl",info);
                $('.lt_category_right ul').html(htmlStr);
            }
        })
    }
})