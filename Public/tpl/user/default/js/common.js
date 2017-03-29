
/********** 所有ajaxForm提交 ************/
/* 通用表单不带检查操作，失败不跳转 */
$(function () {
    $('.ajaxForm').ajaxForm({
        success: complete2, // 这是提交后的方法
        dataType: 'json'
    });
});
/* 通用表单不带检查操作，失败跳转 */
$(function () {
    $('.ajaxForm2').ajaxForm({
        success: complete, // 这是提交后的方法
        dataType: 'json'
    });
});
/* 通用含验证码表单不带检查操作，失败不跳转 */
$(function () {
    $('.ajaxForm3').ajaxForm({
        success: complete3, // 这是提交后的方法
        dataType: 'json'
    });
});
/* 多选删除操作 */
$(function () {
    $('#alldel').ajaxForm({
        beforeSubmit: checkselectForm, // 此方法主要是提交前执行的方法，根据需要设置，一般是判断为空获取其他规则
        success: complete2, // 这是提交后的方法
        dataType: 'json'
    });
});

$(function () {
    // 手机验证码
    $('#getsmscode').on('click',function(e){
    	e.preventDefault();
        var flag = true,url = $(this).attr('href');
        var value = $.trim($("#mobile").val());
		var vCode = $.trim($("#veriCode").val());
        if(/^1[3|4|5|7|8][0-9]{9}$/.test(value)==false){
            flag = false;
            layer.msg('请输入正确的手机号', {icon: 5});
            $("#mobile").focus();return false;
        }
        if(/^\w{4}$/.test(vCode)==false){
            flag = false;
            layer.msg('请输入正确的验证码', {icon: 5});
            $("#veriCode").focus();return false;
        }
		
        if(flag){
        	$.getJSON(url,{mobile:value,veriCode:vCode},
    			function(data){
    				 layer.alert(data.info, {icon: 5});return false;
    			}
    		);
        };
    });
    // 表格显示/隐藏
    $('.J_panel').on("click",function(event) {
        event.preventDefault();
        var hpanel = $(this).closest('.hpanel');
        var icon = $(this).find('i:first');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
        body.stop().slideToggle(300);
        footer.stop().slideToggle(200);
        icon.toggleClass('icon-arrowT').toggleClass('icon-arrowB');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        //
        $('.dropdown-toggle').dropdown()
    });

// 启用状态操作 ,http://www.rainfer.cn/Admin/Member/member_list.html(demo,123456)
  $(".J_open-btn").on("click",function () {
    var $this = $(this),$url = this.href,val = $this.data('id');
    $.post($url, {id: val}, function (data) {
      if (data.status==1) {
          state=$this.find('span').text();
          var a = '<span class="btn btn-minier btn-danger">已停用</span>';
          if(state=='已停用'){
            a = '<span class="btn btn-minier btn-success">已启用</span>';
          }
          $this.html(a);
          return false; 
      } else {
        layer.alert(data.info, {icon: 5});
      }
    }, "json");
    return false;
  });
})
/*
*****************
* 单图/多图操作 *
*****************
*/
/* 单图上传 */
$("#file0").on('change',function () {
    var objUrl = getObjectURL(this.files[0]);
    if (objUrl) {
        $("#img0").attr("src", objUrl);
    }
});
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        $("#oldcheckpic").val("default");
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        $("#oldcheckpic").val("default");
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        $("#oldcheckpic").val("default");
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

//失败跳转
function complete(data) {
    if (data.status == 1) {
        layer.alert(data.info, {icon: 6}, function (index) {
            layer.close(index);
            window.location.href = data.url;
        });
    } else {
        layer.alert(data.info, {icon: 5}, function (index) {
            layer.close(index);
            window.location.href = data.url;
        });
        return false;
    }
}
//失败不跳转
function complete2(data) {
    if (data.status == 1) {
        layer.alert(data.info, {icon: 6}, function (index) {
            layer.close(index);
            window.location.href = data.url;
        });
    } else {
        layer.alert(data.info, {icon: 5}, function (index) {
            layer.close(index);
        });
    }
}
//失败不跳转,验证码刷新
function complete3(data) {
    if (data.status == 1) {
        window.location.href = data.url;
    } else {
        $("#veriCode").val('');
        $("#verify_img").click();
        layer.msg(data.info);
    }
}
//userform表单检查
function checkuserForm() {
    if (!$("#mobile").val().match(/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
        layer.msg('电话号码格式不正确', {icon: 5}, function (index) {
            layer.close(index);
            $('#mobile').focus();
        });
        return false;
    }
}
//多选表单检查
function checkselectForm() {
    var chk_value = [];
    $('input[id="navid"]:checked').each(function () {
        chk_value.push($(this).val());
    });

    if (!chk_value.length) {
        layer.alert('至少选择一个删除项', {icon: 5});
        return false;
    }
}

// 退出
function loginout(url){
    layer.confirm('您确定要退出系统吗？', {btn: ['确定','取消']}, function(){
      $.post(url, function(data) {
        layer.msg(data.info, {icon: 1},function(){window.location.href=data.url;});
      });      
    });
}
function loading(){
    $('body').append('<div class="loadding"></div><div class="loadBox"><div class="loadBoxCont"><div class="circle"></div><div class="circle1"></div></div></div>');
}
function loadEnd(){
    $('.loadding').remove();
    $('.loadBox').remove();
}
// 弹出
function winopen(title, url, width) {
    loading();
    $.post(url, {}, function(str){
      layer.open({
        type: 1,
        title: title,
        area: width,
        content: str
      });loadEnd();
    });
}


// 订单操作（取消、出局）
function orderAction(url,id,info) {
  var $url = url,val = id,$info = info;
  layer.confirm($info, {icon: 3}, function (index) {
    layer.close(index);
    $.post($url, {id: val}, function (data) {
        if (data.status==1) {
            layer.msg(data.info, {icon: 1},function(){
                window.location.href = data.url;
            });
        } else {
            layer.alert(data.info, {icon: 5});
        }
    }, "json");
  });
  return false;
};
