$(function () {
    var form = layui.form;
    // 通过layui自定义表单验证
    form.verify({
        nickname: function (value) { // value为使用这个规则的表单的值
            if (value.length > 6) {
                return '昵称必须在1~6个字符'
            }
        }
    })

    // 点击“基本资料”时，获取用户信息，并渲染到页面
    initUserInfo();

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！')
                }
                // 使用layui的form.val('表单的lay-filter值',{数据对象})快速给表单复制
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 点击“取消”
    $('#btnReset').on('click',function (e) {
        // 住址表单默认重置行为（清空所有表单内容）
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit',function (e) {
        e.preventDefault();
        $.ajax({
            method:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户基本信息失败！')
                }
                // initUserInfo();
                layer.msg('修改用户基本信息成功！');
                // 在iframe页面调用父页面的方法
                window.parent.getUserInfo();
                
            }
        })
    })
})