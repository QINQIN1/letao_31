$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var picArr = [];

    //1.一进入页面，发送ajax请求数据，渲染页面
    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info)
                var htmlStr = template("productTpl", info);
                $('tbody').html(htmlStr);

                // 分页初始化
                $('#paginator').bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        //更新当前页
                        currentPage = page;
                        //重新渲染页面
                        render();
                    }
                })
            }
        })
    }

    //2.点击添加按钮，显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal("show");
        // 发送ajax请求,请求所有的二级分类列表
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("dropdownTpl", info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    })
    //3.给下拉列表a注册点击事件,用事件委托
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取文本，赋值给按钮
        var txt = $(this).text();
        $('#dropdownText').text(txt);

        // 获取id 赋值给隐藏域
        var id = $(this).data('id');
        $('[name="brandId"]').val(id);

        //将隐藏域的校验状态更新
        $('#form').data('bootstrapValidator').updateStatus("brandId","VALID");

    })

    //4.配置文件上传插件
    $('#fileupload').fileupload({
        // 返回的数据类型
        dataType: "json",
        done: function (e, data) {
            console.log(data.result);
            var picObj = data.result;
            //将上传的图片地址放在数组的最前面
            picArr.unshift(picObj);
            // 图片地址
            var picUrl = picObj.picAddr;
            $('#imgBox').prepend('<img src=" ' + picUrl + ' "style="width:100px;">');

            // 如果超过三张，把最后一张图片移除
            if (picArr.length > 3) {
                // 删除数组最后一项
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }
            // 如果文件上传满了 3张, 当前picStatus的校验状态, 更新成 VALID
            if (picArr.length === 3) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }
        }
    });

    //5.添加表单校验
    $('#form').bootstrapValidator({
        excluded:[],
        // 配置校验图标
        feedbackIcon:{
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',   // 校验失败
            validating: 'glyphicon glyphicon-refresh'  // 校验中
        },
        //配置校验字段
        fields:{
            brandId: {
                validators: {
                  notEmpty: {
                    message: "请选择二级分类"
                  }
                }
              },
              proName: {
                validators: {
                  notEmpty: {
                    message: "请输入商品名称"
                  }
                }
              },
              proDesc: {
                validators: {
                  notEmpty: {
                    message: "请输入商品描述"
                  }
                }
              },
              num: {
                validators: {
                  notEmpty: {
                    message: "请输入商品库存"
                  },
                  //正则校验
                  // \d  0-9
                  // ?   0次或1次
                  // +   1次或多次
                  // *   0次或多次
                  // {n,m}  出现n次到m次
                  // {n}  出现n次
                  regexp: {
                    regexp: /^[1-9]\d*$/,
                    message: '商品库存格式, 必须是非零开头的数字'
                  }
                }
              },
              size: {
                validators: {
                  notEmpty: {
                    message: "请输入商品尺码"
                  },
                  //正则校验
                  regexp: {
                    regexp: /^\d{2}-\d{2}$/,
                    message: '尺码格式, 必须是 xx-xx格式, xx为两位数字, 例如 36-44'
                  }
                }
              },
              oldPrice: {
                validators: {
                  notEmpty: {
                    message: "请输入商品原价"
                  }
                }
              },
              price: {
                validators: {
                  notEmpty: {
                    message: "请输入商品现价"
                  }
                }
              },
              picStatus: {
                validators: {
                  notEmpty: {
                    message: "请上传3张图片"
                  }
                }
              }
        }
        

    })

    //6.表单校验成功，阻止表单默认会自动提交，通过ajax请求发送数据
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        // 获取表单元素的所有数据
        var paramsStr=$('#form').serialize();
        
        //还需要拼接上传图片的地址
        paramsStr+="&picName1="+picArr[0].picName+"&picAddr1=" + picArr[0].picAddr;
        paramsStr+="&picName2="+picArr[1].picName+"&picAddr2=" + picArr[1].picAddr;
        paramsStr+="&picName3="+picArr[2].picName+"&picAddr3=" + picArr[2].picAddr;
        console.log(paramsStr);
        $.ajax({
           type:"post",
           url:"/product/addProduct",
            data:paramsStr,
            dataType:"json",
            success:function(info){
                // console.log(info)
                if(info.success){
                    //关闭模态框
                    $('#addModal').modal('hide');
                    //重新渲染第一页
                    currentPage=1;
                    render();
                    //重置表单内容和状态
                    $('#form').data('bootstrapValidator').resetForm(true);
                    //重置按钮和图片
                    $('#dropdownText').text('请选择二级分类');
                    $('#imgBox img').remove();
                    picArr=[];
                }
            }
        })
    })



})