$(function () {

    var currentPage = 1; // 当前页
    var pageSize = 5; // 每页多少条
    // 1. 渲染页面
    render();
  
    function render() {
      $.ajax({
        type: "get",
        url: "/category/querySecondCategoryPaging",
        data: {
          page: currentPage,
          pageSize: pageSize
        },
        dataType: "json",
        success: function (info) {
          console.log(info);
          var htmlStr = template("secondTpl", info);
          $('tbody').html(htmlStr);
  
          // 初始化分页插件
          $('#paginator').bootstrapPaginator({
            // 版本号
            bootstrapMajorVersion: 3,
            // 当前页
            currentPage: info.page,
            // 总页数
            totalPages: Math.ceil(info.total / info.size),
            // 添加页码点击事件
            onPageClicked: function (a, b, c, page) {
              // 更新当前页
              currentPage = page;
              // 重新渲染
              render();
            }
          })
        }
      })
    }
  
  
    // 2. 点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function () {
      $('#addModal').modal("show");
  
      // 发送请求, 获取一级分类的全部数据
      // 通过写死 page 和 pageSize 模拟获取全部一级分类的接口
      $.ajax({
        type: "get",
        url: "/category/queryTopCategoryPaging",
        data: {
          page: 1,
          pageSize: 100,
        },
        dataType: "json",
        success: function (info) {
          console.log(info)
          var htmlStr = template("dropdownTpl", info);
          $('.dropdown-menu').html(htmlStr);
        }
      })
    });
  
  
    // 3. 给下拉列表的 a 添加点击事件(通过事件委托实现)
    $('.dropdown-menu').on("click", 'a', function () {
      // 获取文本值
      var txt = $(this).text();
      // 设置给按钮
      $('#dropdownText').text(txt);
  
      // 获取 id
      var id = $(this).data("id");
      // 设置给隐藏域
      $('[name="categoryId"]').val(id);
  
      // 调用updateStatus更新 
      $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
    });
  
    // 4. 配置文件上传插件, 让插件发送异步文件上传请求
    $('#fileupload').fileupload({
      dataType: "json",
      done: function (e, data) {
        //console.log( data );
        // 后台返回的对象
        //console.log( data.result ); 
  
        var picObj = data.result; 
        // 获取图片地址, 设置给 img src
        var picUrl = picObj.picAddr;
        $('#imgBox img').attr("src", picUrl);
  
        // 给隐藏域设置图片地址
        $('[name="brandLogo"]').val(picUrl);
  
        // 调用updateStatus更新 隐藏域 校验状态成 VALID
        $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
      }
    });
  
    // 5. 添加表单校验功能
    $('#form').bootstrapValidator({
      // 重置排除项, 都校验, 不排除
      excluded: [],
  
      // 配置校验图标
      feedbackIcons: {
          // 校验成功
        valid: 'glyphicon glyphicon-ok', 
        // 校验失败
        invalid: 'glyphicon glyphicon-remove', 
        // 校验中
        validating: 'glyphicon glyphicon-refresh' 
      },
  
      // 指定校验字段
      fields: {
        categoryId: {
          validators: {
            notEmpty: {
              message: "请选择一级分类"
            }
          }
        },
        brandName: {
          validators: {
            notEmpty: {
              message: "请输入二级分类名称"
            }
          }
        },
        brandLogo: {
          validators: {
            notEmpty: {
              message: "请上传图片"
            }
          }
        }
      }
    });

    //6.在校验成功的事件中，阻止表单默认提交，用ajax发送请求提交数据
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        $.ajax({
          type:"post",
          url:"/category/addSecondCategory",
          data:$('#form').serialize(),
          dataType:"json",
          success:function(info){
            // console.log(info)
            if(info.success){
              //成功
              //关闭模态框
              $('#addModal').modal("hide");
              //重新渲染页面
              currentPage=1;
              render();

              //重置表单数据,内容和状态
              $('#form').data("bootstrapValidator").resetForm(true);
              //button和img需要单独重置
              $('#dropdownText').text('请选择一级分类');
              $('#imgBox img').attr('src','./images/none.png')
            }
          }
        })
    })

  
  })