/**
 @Name：自动表单组件
 @Author：Jeff
 @License：LAYUI
 */

layui.define(['jquery', 'layer', 'form', 'laytpl', 'laydate'], function (exports) {
    var $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate;
    var laytpl = layui.laytpl;

    function _formVal(filter, object) {
        if (object) {
            form.val(filter, object);
        }
        else {
            return form.val(filter);
        }
    }

    function _openDiv(elem, title, area, formval, ismax) {
        var offset = 'auto';
        if (!area) {
            area = ['700px', '700px'];
        }
        if (area == 'auto') {
            area = '700px';
            offset = '80px;'
        }

        if (formval) {
            var filter = $(elem).find("form[class='layui-form']").attr("lay-filter");
            form.val(filter, formval);
        }

        var index = layer.open({
            type: 1,
            area: area,
            offset: offset,
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            closeBtn: 2,
            title: title,
            content: $(elem),
            btn: ['确定', '重置', '取消'],
            btnAlign: 'c',
            success: function (layero, index) {
                $(elem).removeClass("layui-hide");
                $(elem).addClass("layui-show");
            },
            end: function () {
                $(elem).removeClass("layui-show");
                $(elem).addClass("layui-hide");
            },
            btn1: function (index, layero) {
                layero.find("button[type='submit']").click();
            },
            btn2: function (index, layero) {
                layero.find("button[type='reset']").click();
                return false;
            }
        });

        if (ismax == true)
            layer.full(index);

        return index;
    }

    function _getformVal(elem) {
        var data = {};
        var f = $(elem).serializeArray();
        $.each(f, function () {
            var obj = $(elem).find("[name='" + this.name + "']");
            if (obj.attr("type") != 'checkbox')
                data[this.name] = this.value;
            else {
                var vals = [];
                obj.each(function () {
                    if ($(this).is(":checked")) {
                        vals.push($(this).val());
                    }
                });
                data[this.name] = vals;
            }
        });
        return data;
    }

    function _formSubmit(options, fun) {
        form.on('submit(' + options.form.filter + 'Btn)', function (data) {
            var formVal = _getformVal("#" + options.form.id);//data.field
            fun(formVal);
        });
    }

    function _laydateRender(elem) {
        $(elem).find(".laydate").each(function (i, d) {
            var rang = typeof ($(d).attr("range")) != "undefined";
            laydate.render({ elem: d, range: rang });
        });
        $(elem).find(".laytime").each(function (i, d) {
            var rang = typeof ($(d).attr("range")) != "undefined";
            laydate.render({ elem: d, type: 'time', range: rang });
        });
        $(elem).find(".laydatetime").each(function (i, d) {
            var rang = typeof ($(d).attr("range")) != "undefined";
            laydate.render({ elem: d, type: 'datetime', range: rang });
        });
        $(elem).find(".layyear").each(function (i, d) {
            var rang = typeof ($(d).attr("range")) != "undefined";
            laydate.render({ elem: d, type: 'year', range: rang });
        });
        $(elem).find(".laymonth").each(function (i, d) {
            var rang = typeof ($(d).attr("range")) != "undefined";
            laydate.render({ elem: d, type: 'month', range: rang });
        });
    }

    /** 外部访问 **/
    var autoform = {
        render: function (options) {
            if (!options.form) {
                layer.msg("AutoForm表单参数不能为空");
                return;
            }
            if (!options.form.id) {
                layer.msg("AutoForm表单参数id不能为空");
                return;
            }
            if (!options.form.filter) {
                options.form.filter = options.form.id;
            }

            if (!options.form.labelcss)
                options.form.labelcss = "width:120px !important;";
            else {
                if (options.form.labelcss.substring(options.form.labelcss.length - 1, 1) != ";")
                    options.form.labelcss += ";";
                options.form.labelcss = options.form.labelcss.replace(/;/g, " !important;");
            }
            if (!options.form.inputcss)
                options.form.inputcss = "width:400px !important;";
            else {
                if (options.form.inputcss.substring(options.form.inputcss.length - 1, 1) != ";")
                    options.form.inputcss += ";";
                options.form.inputcss = options.form.inputcss.replace(/;/g, " !important;");
            }

            //字段内模板渲染
            $.each(options.fields, function (i, item) {
                if (item.type == "tpl") {
                    $.ajax({
                        url: item.url,
                        type: "GET",
                        async: false,
                        success: function (html) {
                            if (item.tplid) {
                                item.content = $(html).filter("#" + item.tplid).html();
                            }
                            else {
                                item.content = html;
                            }
                            laytpl(item.content).render(item, function (renderhtml) {
                                item.content = renderhtml;
                            });
                        }
                    });
                }
            });

            //模板渲染
            var basedir = layui.cache.base;
            $.get(basedir + "/autoform/formTemplate.html?v=1", function (html) {
                var tt = $(html).filter("#autoFormTemplate").html();
                laytpl(tt).render(options, function (renderhtml) {
                    //装载模板
                    $(options.elem).html(renderhtml);
                    //日期控件渲染
                    _laydateRender(options.elem);
                    form.render();
                    //渲染完成后
                    if (options.renderComplete) options.renderComplete();
                });
            });

            //监听表单提交
            if (options.formSubmit) {
                _formSubmit(options, options.formSubmit);
            }

            return {
                config: options,
                submit: function (fun) {
                    if (fun) { if (fun() == false) return; }
                    $(options.elem).find("button[type='submit']").click();
                },
                reset: function (fun) {
                    $(options.elem).find("button[type='reset']").click();
                    if (fun) fun();
                },
                formVal: function (object) {
                    _formVal(options.form.filter, object);
                },
                formSubmit: function (fun) {
                    _formSubmit(options, fun);
                },
                openDiv: function (title, area, formVal) {
                    return _openDiv(options.elem, title, area, formVal);
                },
                openDivMax: function (title, area, formVal) {
                    return _openDiv(options.elem, title, area, formVal, true);
                }
            }
        },
        //触发提交
        submit: function (elem, fun) {
            if (fun) { if (fun() == false) return; }
            $(elem).find("button[type='submit']").click();
        },
        //触发重置
        reset: function (elem, fun) {
            $(elem).find("button[type='reset']").click();
            if (fun) fun();
        },
        //获取或者设置表单
        formVal: function (filter, object) {
            _formVal(filter, object);
        },
        //监听表单提交
        formSubmit: function (filter, fun) {
            form.on('submit(' + filter + 'Btn)', function (data) {
                fun(data);
            });
        },
        //弹出层
        openDiv: function (elem, title, area, formVal) {
            return _openDiv(elem, title, area, formVal);
        },
        //弹出层最大化
        openDivMax: function (elem, title, area, formVal) {
            return _openDiv(elem, title, area, formVal, true);
        }
    };

    exports('autoform', autoform);
});[]