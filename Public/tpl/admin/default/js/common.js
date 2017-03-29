$(function(){
  // 复选框
  var checkall= $(".checkall"),checkBeauty = $(".J_checkBeauty"),checkLength = checkBeauty.length;
  checkBeauty.on("click",function(){
    if ($(this).hasClass("check_on")) {$(this).removeClass("check_on");$(this).closest("tr").removeClass("cur");}else{$(this).addClass("check_on");$(this).closest("tr").addClass("cur");}
    if ($(".check_on").length==checkLength) {
      checkall.parent().addClass("checkall_on");
      $("input[class='checkall']").prop('checked',"checked");
    }else{
      checkall.parent().removeClass("checkall_on");
      $("input[class='checkall']").prop('checked',"");
    }
  });
  checkall.click(function(){
    $("input[name='checkitem[]']").prop('checked',this.checked);
    if ($(this).prop('checked')==true) {
      $(this).parent().addClass("checkall_on");
      $("input[name='checkitem[]']").closest("tr").addClass("cur");
      $("input[name='checkitem[]']").parent().addClass("check_on");
    }else{
      $(this).parent().removeClass("checkall_on");
      $("input[name='checkitem[]']").closest("tr").removeClass("cur");
      $("input[name='checkitem[]']").parent().removeClass("check_on");
    };
  });
  // TAB选项卡
  var Tab = $(".J_tab"),TabNav = Tab.children(".nav-tabs"),TabContent = Tab.children(".tab-content");
  TabNav.on("click","li",function(){
    var $this = $(this),target = $this.data("target");
    $this.addClass("active").siblings().removeClass("active");
    TabContent.find(".tab-pane").hide();
    TabContent.find("#"+target).show();
  })

  // 表格变色
  $(".Table tbody").find("tr").hover(function(){
      $(this).addClass("hover");
  },function(){
    $(this).removeClass("hover");
  });
  // 删除操作
  $('.J_confirm-rst-url-btn').on("click",function () {
    var $this = $(this),$url = this.href,$info = $this.data('info');
    layer.confirm($info, {icon: 3}, function (index) {
        layer.close(index);
        $.get($url, function (data) {
            if (data.status==1) {
                layer.msg(data.info, {icon: 6}, function () {
                  $this.closest('tr').remove();
//                    window.location.href = data.url;
                });
            } else {
                layer.alert(data.info, {icon: 5}, function (index) {
                    layer.close(index);
                });
            }
        }, "json");
    });
    return false;
  });
  // 启用状态操作 ,http://www.rainfer.cn/Admin/Member/member_list.html(demo,123456)
  $(".J_open-btn").on("click",function () {
    var $this = $(this),$url = this.href,val = $this.data('id');
    $.post($url, {id: val}, function (data) {
      if (data.status==1) {
          state=$this.find('span').text();
          var a = '<span class="btn btn-minier btn-danger">已封号</span>';
          if(state=='已封号'){
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
  //
  $(".J_isjh-btn").on("click",function () {
    var $this = $(this),$url = this.href,val = $this.data('id');
    $.post($url, {id: val}, function (data) {
      if (data.status==1) {
          state=$this.find('span').text();
          var a = '<span class="t-red">未激活</span>';
          if(state=='未激活'){
            a = '<span class="t-green">已激活</span>';
          }
          $this.html(a);
          $this.closest('tr').remove();
          return false; 
      } else {
        layer.alert(data.info, {icon: 5});
      }
    }, "json");
    return false;
  });

// 公告审核
$(".J_status-btn").on("click",function () {
    var $this = $(this),$url = this.href,val = $this.data('id');
    $.post($url, {id: val}, function (data) {
      if (data.status==1) {
          state=$this.find('span').text();
          var a = '<span class="btn btn-minier btn-danger">审核中</span>';
          if(state=='审核中'){
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
  /*$(".J_open-btn").on("click",function () {
    var $this = $(this),$url = this.href,val = $this.data('id');
    $.post($url, {id: val}, function (data) {
      if (data.status==1) {
          state=$this.find('span').text();
          var a = '<span class="btn btn-minier btn-danger">已封号</span>';
          if(state=='已封号'){
            a = '<span class="btn btn-minier btn-success">已启用</span>';
          }
          $this.html(a);
          return false; 
      } else {
        layer.alert(data.info, {icon: 5});
      }
    }, "json");
    return false;
  });*/

  // http://www.rainfer.cn/public/yfcmf/yfcmf.js?1466784048 /* 多选删除操作 id="alldel" */http://www.rainfer.cn/Admin/Comment/comment_list.html
  // J_userAdd 添加会员
  $("#J_userAdd").on("click",function(){
    var realname = $("#realname").val(),pwd = $("#pwd").val(),cpwd = $("#cpwd").val(),pwd1 = $("#pwd").val(),cpwd1 = $("#cpwd").val(),
    mobile = $("#mobile").val(),tjuser = $("#tjuser").val();
    if(!realname){layer.msg('会员姓名不能为空！');$("#realname").focus();return false;}    
    if(!mobile){layer.msg('手机号不能为空！');$("#mobile").focus();return false;}    
    if(!pwd){layer.msg('密码不能为空！');$("#pwd").focus();return false;}
    if(pwd.length<6){layer.msg('密码不能少于6位！');$("#pwd").focus();return false;}
    if(!cpwd){layer.msg('密码不能为空！');$("#cpwd").focus();return false;}
    if (pwd !== cpwd) {layer.msg('两次密码输入不一致！');$("#cpwd").focus();return false;}
    if(!pwd1){layer.msg('交易密码不能为空！');$("#pwd1").focus();return false;}
    if(pwd1.length<6){layer.msg('交易密码不能少于6位！');$("#pwd1").focus();return false;}
    if(!cpwd1){layer.msg('交易密码不能为空！');$("#cpwd1").focus();return false;}
    if (pwd1 !== cpwd1) {layer.msg('两次交易密码输入不一致！');$("#cpwd1").focus();return false;}
  if (hasTui){if(!tjuser){layer.msg('推荐人不能为空！');$("#tjuser").focus();return false;}}
    if(realname  && mobile && pwd && cpwd && pwd1 && cpwd1){
      $.ajax({
        type : "POST",
        url: this.href,
        dataType : "json",
        data: {
          "realname":realname,
          "mobile":mobile,
          "password":pwd,
          "cpwd":cpwd,
          "paypassword":pwd1,
          "cpwd1":cpwd1,
          "tjuser":tjuser
        },
        cache: false,
        success: function(data) {              
          if (data!= null){     
            if (data.status==1){
              layer.msg(data.info, {"icon":1});window.location.href = data.url;return false;
            }else{
              layer.msg(data.info,{"icon":0});return false;
            }
          }
        }
      })
    }
    return false;
  });
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
/* 多选删除操作 */
$(function () {
    $('#J_alldel').ajaxForm({
        beforeSubmit: checkselectForm, // 此方法主要是提交前执行的方法，根据需要设置，一般是判断为空获取其他规则
        success: complete2, // 这是提交后的方法
        dataType: 'json'
    });
});
//多选表单检查
function checkselectForm() {
    var chk_value = [];
    $('input[check="navid"]:checked').each(function () {
        chk_value.push($(this).val());
    });
    if (!chk_value.length) {
        layer.alert('至少选择一个删除项', {icon: 5});
        return false;
    }
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
        $("#oldcheckpic").val("nopic");
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        $("#oldcheckpic").val("nopic");
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        $("#oldcheckpic").val("nopic");
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

/* 新闻多图删除 */
function delall(id, url) {
    $('#id' + id).hide();
    var str = $('#pic_oldlist').val();//最原始的完整路径
    var surl = url + ',';
    var pic_newold = str.replace(surl, "");
    $('#pic_oldlist').val(pic_newold);
}
})

function backpic(picurl) {
    $("#img0").attr("src", picurl);//还原修改前的图片
    $("input[name='file0']").val("");//清空文本框的值
    $("input[name='oldcheckpic']").val(picurl);//清空文本框的值
}

function loading(){
    $('body').append('<div class="loadding"></div><div class="loadBox"><div class="content"><div class="circle"></div><div class="circle1"></div></div></div>');
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
