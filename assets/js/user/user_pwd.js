$(function () {
    var form = layui.form;

    // 自定义密码校验规则
    form.verify({
        // 密码必须是6-12位
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码和旧密码必须不一样
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        // 确认密码和新密码必须一致
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    });

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('提交失败');
                }
                layui.layer.msg(res.message);
                // 重置表单
                $('.layui-form')[0].reset();
                
            }
        })
    })
})