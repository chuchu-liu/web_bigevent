$(function () {
    initArtCatesList();
    // 获取文章列表
    function initArtCatesList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var tplHtml = template('tpl-table', res);
                $('tbody').html(tplHtml);
            }
        })
    }


    // 点击“添加类别”按钮弹出layer
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ["500px", '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 由于form-add是js动态添加的，所以不能直接使用form的id绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                layui.layer.close(indexAdd);
                initArtCatesList();
            }
        })
    })


    // 点击“编辑”弹出
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ["500px", '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        // console.log(id);

        // 请求数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 快速填充表单
                layui.form.val("form-edit", res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                layui.layer.close(indexEdit);
                initArtCatesList();
            }
        })
    })


    // 点击“删除”弹出
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前行的id
        var id = $(this).attr('data-id');
        // 弹出
        layer.confirm('确认删除？', {icon: 3, title: '提示'}, function (index) {
            // 点击确认，发请求删除数据
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message);
                    }
                    layui.layer.msg(res.message);
                    layer.close(index);
                    initArtCatesList();
                }
            })
        });
    })
})