$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage


    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 定义一个请求参数对象
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态，可选值有：已发布、草稿
    }


    initTable();
    initArticleCate();
    // 初始化文章列表
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                // console.log(htmlStr);
                
                $('tbody').html(htmlStr);
                // 列表数据渲染完成后，渲染分页
                renderPage(res.total);
            }
        })
    }


    // 初始化文章分类
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


    // 监听筛选表单提交事件
    $('#form-search').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 获取文章分类的Id和文章的发布状态
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 将分类Id和发布状态添加到请求参数对象q中
        q.cate_id = cate_id;
        q.state = state;
        // 重新初始化文章列表
        initTable();
    })


    // 定义渲染分页的方法
    function renderPage(n) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', // 分页容器的ID，不用加 # 号
            count: n, // 数据总数
            limit: q.pagesize, // 每页显示条数
            curr: q.pagenum, // 默认显示页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 条目选项区域的可选值
            jump: function (obj, first) { // 分页切换或调用 laypage.render（）函数会触发jump，将最新的页码之赋值给查询参数对象q
                // obj中包含当前分页的所有选项值
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 如果调用form.render（）函数触发jump，则first为true，点击分页触发jump则first为underfined
                if (!first) {
                    // 只有点击分页触发的jump才执行initTable（）
                    initTable();
                }
            }
        });
    }


    // 
    $('tbody').on('click', '.btn-delete', function () {
        // 获取页面上删除按钮的个数
        var len = $('.btn-delete').length;

        var id = $(this).attr('data-id');

        layer.confirm('确认删除？', {icon: 3, title: '提示'}, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！');
                    if (len === 1) {
                        // 页码最小值必须是1
                        q.pagenum = q.pagenum = 1 ? 1 : q.pagenum - 1;
                    }
                    // 删除完成后，判断当前页码是否有数据，如果没有则让页码值减一再渲染页面
                    initTable();
                    layer.close(index);
                }
            })
        });
    })

})