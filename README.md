# layui.autoform

#### 介绍
LayUI的自动表单

#### 软件架构
基于LayUI模块化组件

#### 安装教程

```
layui.config({
    base: '/js/', //拓展模块的根目录
})
.extend({
    autoform: '/autoform/autoform'
});
```


#### 使用说明

```
<!--表单层-->
<div id="addeditDiv" class="layui-hide"></div>

layui.use('autoform', function () {
    //表单渲染示例
    var formobj = autoform.render({
        elem: '#addeditDiv', //要渲染的层Id
        form: { id: 'addeditForm', filter: 'addeditForm' }, //id即表单form的Id，filter即lay-filter，filter不填则于id一致
        //其他form默认参数：showButton:false,labelcss:'',inputcss:'', showButton是否显示“确定”、“重置”按钮，labelcss标题列的宽度样式，inputcss表单元素列的宽度样式
        fields: [
            { field: 'Id', title: 'Id', type: 'hide' },
            { field: 'FacCode', title: '厂商编号', type: 'text', comment: '后台自动生成', readonly: true },
            { field: 'FacName', title: '厂商名称', type: 'text', verify: true },
            { field: 'FacShortName', title: '厂商简称', type: 'text' },
            { field: 'OrgCode', title: '组织机构代码', type: 'text' },
            { field: 'FacType', title: '厂商类型', type: 'checkbox', option: { "生产商": 0, "供应商": 1, "维修商": 2 }, verify: true, skin: "primary" },
            { title: '我是分割线', type: 'hr' },
            { field: 'YwLinkMan', title: '业务联系人', type: 'text' },
            { field: 'YwLinkPhone', title: '业务联系人电话', type: 'text' },
            { field: 'JsLinkMan', title: '技术联系人', type: 'text' },
            { field: 'JsLinkPhone', title: '技术联系人电话', type: 'text' },
            { field: 'Area', title: '所属地区', type: 'select', option: { "": "", "北京": 0, "上海": 1, "广州": 2 }, verify: false },
            { title: '我是分割线2', type: 'hr' },
            { field: 'Email', title: '电子邮箱', type: 'text' },
            { field: 'Fax', title: '传真', type: 'text' },
            { field: 'LinkAddress', title: '联系地址', type: 'text' },
            { field: 'CreateDate', title: '创建日期', type: 'laydate' },
            { field: 'Status', title: '启用状态', type: 'radio', option: { "启用": 1, "停用": 2 } },
            { field: 'Remark', title: '备注', type: 'textarea', comment: '备注' },
            { field: 'testhtml', title: '测试html', type: 'html', html: '<select name="city" id="city" lay-verify="required"><option value=""><option value="0">北京</option></option></select>' },
        ],
        renderComplete: function () {
            //表单渲染完成后方法，可以对表单元素重新赋值
        },
        formSubmit: function (formVal) {
            //表单提交方法，formVal是表单提交的数据
            $.ajax({
                url: 'addediturl',
                data: formVal,
                async: true,
                type: "POST",
                success: function (item) {
                    if (item.IsSuccessed) {
                        layer.msg("执行成功!", { icon: 1, time: 2000 });
                        layer.closeAll('page');
                    }
                    else
                        layer.msg("执行失败：" + item.Message, { icon: 2, time: 4000 });                
                }
            });
        }
    });

    formobj.submit(fun); //触发提交表单，用于其他地方触发提交，fun方法是提交前方法，fun返回false则禁止提交
    formobj.reset(fun); //触发重置表单，fun方法是重置后方法，用于重置后设置某个控件的默认值
    formobj.formVal(formVals); //设置表单值，formVals是表单的值集合
    formobj.formSubmit(formVals); //重置表单提交方法
    formobj.openDiv(title, area, formVal); //把表单已弹出层的方式显示出来，title层标题，area层的宽高，可以不填或设置为null（默认['700px', '700px']），设置为'auto'则高度自动适用，formVal为表单的值，不填或为null，则弹出空表单
    formobj.openDivMax(title, area, formVal); //与上面的openDiv方法一致，不同的是弹出层会自动最大化

});
```
#### 效果图
![输入图片说明](https://images.gitee.com/uploads/images/2020/0613/175444_fd4b06c1_727020.png "效果图1")
![输入图片说明](https://images.gitee.com/uploads/images/2020/0613/175458_40221942_727020.png "效果图2")

#### 码云特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5.  码云官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
