$(function () {
    getUserInfo();

    // 退出功能 
    $('#btnLogout').on('click', function () {
        layui.layer.confirm('确定退出登录？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 点击确定执行此处代码
            // 1、清空localstorage内的token
            localStorage.removeItem('token');
            // 2、回到登陆页面
            location.href = 'http://127.0.0.1:5500/10.%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html';
            layer.close(index);
        });
    })
    

})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        // 必须导入baseAPIs.js才能直接使用接口
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            // 渲染用户头像
            renderAvantar(res.data);
        },
        // 无论请求成功或者失败都会调用complete函数
        /* complete:function(res){
            console.log(res);
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1、强制清空localstrorage的token
                localStorage.removeItem('token');
                // 2、强制跳转到登录页面
                location.href = 'http://127.0.0.1:5500/10.%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html';
            }
        } */
    })
}

// 渲染用户头像函数
function renderAvantar(user) {
    // 优先显示昵称，如果没有就显示用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 判断是否有头像图片，有就优先显示
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 如果没有头像图片，显示文本头像
        $('.layui-nav-img').hide();
        // 获取第一个字符，如果是英文字母，则转为大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}