$(function () {
    // 表单校验
    //用户名不能为空
    //2-6
    //密码不能为空
    //6-12位
    $('#form').bootstrapValidator({
        //配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            //用户名
            username:{
                //校验规则
                validators:{
                    //非空校验
                    notEmpty:{
                        message:"请输入用户名"
                    },
                    //长度验证
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必须是2-6位"
                    },
                    callback:{
                        message:"用户名不存在"
                    }
                }
            },

            // 密码
            password:{
                validators:{
                    notEmpty:{
                        message:"请输入密码"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    },
                    callback:{
                        message:"密码不存在"
                    }
                }
            }
        }
    });

    //校验成功后，会触发一个表单验证成功事件
    //默认会提交表单，提交完自动跳转
    //表单校验成功之后，默认的是表单提交，我们要阻止默认跳转，用ajax发送请求提交数据
//     // 表单提交成功，会触发success.form.bv事件
    $('#form').on('success.form.bv', function( e ) {
        // console.log(e)
        //阻止表单的自动提交
        e.preventDefault();
    // console.log( "默认的表单提交被阻止了, 通过ajax来提交" )
        
        // 发送ajax请求
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$('#form').serialize(),
            dataType:'json',
            success:function(info){
                console.log(info);
                if(info.error==1000){
                    // alert('用户名不存在');
                    //updateStatus
                    //参数 
                    // field字段名 
                    // status状态 
                    // NOT_VALIDATED未验证 VALIDATING验证中 INVALID验证失败 VALID 验证成功
                    $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback")
                    return;
                    
                }
                if(info.error==1001){
                    // alert('密码错误');
                    $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback")
                    return;
                }
                if(info.success){
                    //跳转
                    location.href="index.html";
                }
            }
        })
    });

    //3.重置功能 本身的reset按钮只能重置内容，需要重置状态
    $('[type="reset"]').click(function(){
        $('#form').data('bootstrapValidator').resetForm();
    })
})