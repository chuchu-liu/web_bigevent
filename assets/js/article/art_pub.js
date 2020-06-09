$(function () {
    var form = layui.form;


    // 初始化文章分类
    initArticleCate();

    function initArticleCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                // 动态插入的option没有被layui的js文件监听到，所有没有重新渲染页面
                // 手动通知layui重新渲染表单的UI结构
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    })

    //
    $('#file').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    var art_state = '已发布';
    $('#btn-save2').on('click', function (e) {
        art_state = '草稿';
    })


    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //  基于form创建FormData对象
        var fd = new FormData($('#form-pub')[0]);
        // 向fd对象中添加内容
        fd.append('state', art_state);
        // fd.forEach(function(v,k){
        //     console.log(k,v);

        // })

        // 将裁剪后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd);
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 向服务器提交FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！');
                }
                layer.msg('发表文章成功！')
                //文章发布成功后跳转到文章列表页面
                location.href = '../article/art_list.html';
            }
        })
    }
})