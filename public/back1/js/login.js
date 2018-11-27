$(function(){
   //1,进行表单验证
   // 用户名不能为空 2-6位
   //密码不能为空 6-12位
   $("#form").bootstrapValidator({
    //    配置图标
    feedbackIcons:{
        // 校验成功
        valid: 'glyphicon glyphicon-ok',
        //校验失败
        invalid:'glyphicon glyphicon-remove',
        // 校验中
        validating:'glyphicon glyphicon-refresh'
    },
    // 配置校验字段 input里面的name值
    fields:{
        //用户名
        username:{
            //校验规则
            validators:{
                //非空
                notEmpty:{
                    message:"请输入用户名"
                },
                //验证长度
                stringLength:{
                    min:2,
                    max:6,
                    message:"用户名长度必须是2-6位"
                }
            }
        },

        password:{
            validators:{
                notEmpty:{
                    message:"请输入密码"
                },
                stringLength:{
                    min:6,
                    max:12,
                    message:"密码长度必须是6-12位"
                }
            }
        }

    }
   });

   //验证成功后会触发一个事件 表单验证成功事件 success.form.bv
   //表单默认是会自动提交
   //我们要阻止自动提交，用ajax发送请求提交数据
   //要在成功的事件中，用ajax提交
   $('#form').on('success.form.bv',function(e){
       e.preventDefault();

       $.ajax({
           type:"post",
           url:"/employee/employeeLogin",
           data:$('#form').serialize(),
           dataType:"json",
            success:function(info){
                console.log(info);
                if(info.error==1000){
                    alert('用户名不存在');
                    return;
                }
                if(info.error==1001){
                    alert('密码不存在');
                    return;
                }
                if(info.success){
                    location.href="index.html"
                }
            }
       })
   });

   //重置功能 reset只能重置内容 不能重置一些额外的状态
    //resetForm() 只重置状态
    // resetForm(true) 重置内容和状态
   $('[type="reset"]').click(function(){
       $('#form').data("bootstrapValidator").resetForm();
   })
})