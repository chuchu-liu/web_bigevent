$(function () {
    // 获取元素，实现点击显示隐藏功能
    // 点击“去注册账号”，隐藏登录显示注册
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击“去登录”，隐藏注册显示登录
    $('#link-login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 自定义layui校验规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        // 自定义一个名为pwd的验证规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value, item) { //value：使用规则的输入框的值、item：表单的DOM对象
            // 获取密码框的值
            var pwd = $('.reg-box [name=password]').val();
            if (pwd != value) {
                return '两次密码不一致';
            }
        }
    })


    // 监听表单的提交行为 实现注册功能
    $('#form-reg').on('submit', function (e) {
        e.preventDefault();
        // 发起Ajax的post请求
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // layer作为layui 模块化使用时需要先导入layer模块layer = layui.layer
                layer.msg('注册成功');
                // 注册成功后模拟点击“去登录”
                $('#link-login').click();
            }
        })
    })


    $('#form-login').submit(function (e) {
        e.preventDefault();
        // 发起Ajax的post请求
        $.ajax({
            method: 'post',
            url: '/api/login',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                // console.log(res.token);
                // res.token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA5LCJ1c2VybmFtZSI6ImJiIiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwidXNlcl9waWMiOiIiLCJpYXQiOjE1OTEyNTY0MjMsImV4cCI6MTU5MTI5MjQyM30.mcuqZX42nJ131l0SMTSE9DOMcimeSS_RWPFkczMge78
                // 将登录成功获取的token存到localStorage中
                localStorage.setItem('token',res.token);
                // 登陆成功跳转到后台主页
                location.href = 'index.html'
            }
        })
    })
})