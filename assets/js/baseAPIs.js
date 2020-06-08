// 每次调用$.get()  $.post()或$.ajax()的时候，都会先调用ajaxPrefilter这个函数

$.ajaxPrefilter(function (options) { // option即为配置对象
    // console.log(options.url);
    // 在发起ajax请求之前统一拼接地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 统一为有权限的接口设置请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete函数
    options.complete = function(res){
        // console.log(res);
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空localstrorage的token
            localStorage.removeItem('token');
            // 2、强制跳转到登录页面
            location.href = 'http://127.0.0.1:5500/10.%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html';
        }
    }
})