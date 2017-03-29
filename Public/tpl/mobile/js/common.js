
/********** 所有ajaxForm提交 ************/
/* 通用表单不带检查操作，失败不跳转 */
$(function () {
    $('.ajaxForm').ajaxForm({
        //beforeSubmit:loading,
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
            //window.location.href = data.url;
        });
    } else {
        layer.alert(data.info, {icon: 5}, function (index) {
            layer.close(index);
            //window.location.href = data.url;
        });
        return false;
    }
}
//失败不跳转
function complete2(data) {
    if (data.status == 1) {
        layer.alert(data.info, {icon: 6}, function (index) {
            layer.close(index);
            //window.location.href = data.url;
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
    $('body').append('<div class="loadding"></div><div class="loadBox"><div class="content"><div class="circle"></div><div class="circle1"></div></div></div>');
}
function loadEnd(){
    $('.loadding').remove();
    $('.loadBox').remove();
}
// 弹出
function winopen(title, url) {
    loading();
    $.post(url, {}, function(str){
      layer.open({
        type: 1,
        title: title,
        content: str
      });
      loadEnd();
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


/* 互助中心 */
var tpl = {
    tg : function(data){      
        if (data.length!=0) {
          var DOM = "";
          $(data).each(function (i, va) {
            var Action = "";
            if (va.status1 == 0 && va.status == 0) {
              Action = '<a class="J_order_btn" href="javascript:;" onclick="orderAction(\''+cancelUrl+'\','+va.id+',\'你确定要取消吗?\')" style="float:right;">取消</a>';
            }else if(va.status1 == 1){
              if (va.status3==1) {
                Action = '<a href="javascript:;" style="float:right;">已出局</a>';
              }else{
                Action = '<a href="javascript:;" onclick="orderAction(\''+outUrl+'\','+va.id+',\'你确定要出局吗?\')" style="float:right;">出局</a>';
              }
            }
            DOM += '<div class="listItems"><h2 class="type"><span class="t-green">提供帮助：</span><span class="en">'+va.no+'</span></h2>';
            DOM += '<div class="desc"><p>提供金额：<b class="t-red">'+va.price2+'</b> 元</p><p>获得利息：<b class="t-green">'+va.lxprice+'</b> 元</p><p>剩余金额：'+va.price+' 元</p>';
            DOM += '<p>订单日期：<span>';
            DOM += date("Y-m-d H:i:s",va.addtime)+'</span></p></div><div class="meta">状态：<b>';
            DOM += (va.status1==1?'已完成':status(va.status))+'</b><span style="padding-right: 0;">';
            DOM += Action;
            DOM += '</span></div></div>';
          });
          $("#orderList").html(DOM);
        }else{
          $("#orderList").html(emptyData);
        }
        
    },
    xy : function(data){
      if (data.length!=0) {
        var DOM = "";
        $(data).each(function (i, va) {
          var Action = "";
          if (va.status1 == 0 && va.status == 0) {
            Action = '<a class="J_order_btn" href="javascript:;" onclick="orderAction(\''+cancelxyUrl+'\','+va.id+',\'你确定要取消吗?\')" style="float:right;">取消</a>';
          }
          DOM += '<div class="listItems xyListItems"><h2 class="type"><span class="t-green">得到帮助：</span><span class="en">'+va.no+'</span></h2>';
          DOM += '<div class="desc"><p>提供金额：<b class="t-red">'+va.price2+'</b> 元</p><p>提现类型：<span class="t-green">'+xytype(va.type)+'提现</span></p><p>剩余金额：'+va.price+' 元</p>';
          DOM += '<p>订单日期：<span>';
          DOM += date("Y-m-d H:i:s",va.addtime)+'</span></p></div><div class="meta">状态：<b>';
          DOM += (va.status1==1?'已完成':status(va.status))+'</b><span style="padding-right: 0;">'
          DOM += Action+'</span></div></div>';
        });
        $("#orderList").html(DOM);
      }else{
        $("#orderList").html(emptyData);
      }
    },
    pp : function(data){
      if (data.length!=0) {
        var DOM = "",xyDOM = "",tgDOM = "",yfDOM = "";
        $(data).each(function (i, va) {
          if (va.xyuid == UserId) {
            var Status = "";
            var skTime = parseInt(va.addtime)+parseInt(fhHour)*3600-parseInt(serverTime), //对方打款（我方收款）
                dkTime = parseInt(va.paytime)+parseInt(fhHour)*3600-parseInt(serverTime); //对方收款（我方打款）
            if (va.status == 0) {
                if (skTime > 0) {
                    Status = '收款倒计时：<span class="timer" data-endtime="'+skTime+'"><b>0</b>时<b>00</b>分<b>00</b>秒</span>';
                }else{
                    Status = '对方打款超时';
                }
            }else if(va.status == 1){
                if (dkTime>0) {
                    Status = '确认打款倒计时：<span class="timer" data-endtime="'+dkTime+'"><b>0</b>时<b>00</b>分<b>00</b>秒</span>';
                }else{
                    Status = '确认打款超时';
                }
            }else{
                status(va.status);
            }
            DOM += '<div class="listItems xyPpListItems">';
            DOM += '<div class="desc">';
            DOM += '<a class="J_pop" href="javascript:;" onclick="winopen(\'得到帮助交易明细\',\''+payxymxUrl+'\/id\/'+va.id+tpTplsuffix+'\')"><i class="icon-search2"></i></a>';
            DOM += '<p>订单编号：<span class="en">'+va.xyno+'</span></p>'
            DOM += '<p>帮助金额：<b class="t-red">'+va.tgprice+'</b> 元</p>';
            DOM += '<p>帮助类型：<span class="t-green">'+(va.ptype===null?'提供帮助':xytype(va.ptype)+'提现')+'</span></p>';
            DOM += '<p>匹配日期：<span>'+date("Y-m-d H:i",va.addtime)+'</span></p>';
            DOM += '</div>';
            DOM += '<div class="meta">';
            DOM += (va.status1==1)?'状态：已完成':Status;
            DOM += '</div></div>';
          }else if(va.tguid == UserId){
            var Status = "";
            var skTime = parseInt(va.addtime)+parseInt(fhHour)*3600-parseInt(serverTime), //对方打款（我方收款）
                dkTime = parseInt(va.paytime)+parseInt(fhHour)*3600-parseInt(serverTime); //对方收款（我方打款）
            if (va.status == 0) {
                if (skTime > 0) {
                    Status = '打款倒计时：<span class="timer" data-endtime="'+skTime+'"><b>0</b>时<b>00</b>分<b>00</b>秒</span>';
                }else{
                    Status = '打款超时';
                }
            }else if(va.status == 1){
                if (dkTime>0) {
                    Status = '确认收款倒计时：<span class="timer" data-endtime="'+dkTime+'"><b>0</b>时<b>00</b>分<b>00</b>秒</span>';
                }else{
                    Status = '对方确认收款超时';
                }
            }else{
                status(va.status);
            }

            DOM += '<div class="listItems tgPpListItems">';
            DOM += '<div class="desc">';
            DOM += '<a class="J_pop" href="javascript:;" onclick="winopen(\'提供帮助交易明细\',\''+paytgmxUrl+'\/id\/'+va.id+tpTplsuffix+'\')"><i class="icon-search2"></i></a>';
            DOM += '<p>订单编号：<span class="en">'+va.tgno+'</span></p>'
            DOM += '<p>帮助金额：<b class="t-red">'+va.xyprice+'</b> 元</p>';
            DOM += '<p>帮助类型：<span class="t-green">'+(va.ptype===null?'提供帮助':xytype(va.ptype)+'提现')+'</span></p>';
            DOM += '<p>匹配日期：<span>'+date("Y-m-d H:i",va.addtime)+'</span></p>';
            DOM += '</div>';
            DOM += '<div class="meta">';
            DOM += (va.status1==1)?'状态：已完成':Status;
            DOM += (va.isyf == 1)?'<i class="icon-yufu"></i>':'';
            DOM += '</div></div>';
          }          
        });
        $("#orderList").html(DOM);



      }else{
        $("#orderList").html(emptyData);
      }
    },
    team : function(data){
      if (data.length!=0) {
        var DOM = "";
        $(data).each(function (i, va) {
            DOM += '<div class="listItems teamListItems">';
            DOM += '<div class="desc">';
            DOM += '<p>会员名：<span class="t-green">'+va.realname+'</span>（<span class="t-orange">'+rank(va.rank)+'</span>）</p>';
            DOM += '<p>手机号：<span class="t-red">'+va.mobile+'</span></p>';
            DOM += '<p>注册日期：<span>'+date("Y-m-d H:i",va.addtime)+'</span></p>';
            DOM += '</div><div class="meta">直推<b>'+va.tjnum+'</b>人，团队<b>'+va.tdnum+'</b>人，总业绩 <b>'+va.ldprice+'</b>元</div>';
            DOM += '</div>';
        });
        $("#orderList").html(DOM);
      }else{
        $("#orderList").html(emptyData);
      }
    },
    finance : function(data){
        if (data.length!=0) {
            var DOM = "";
            $(data).each(function (i, va) {
                DOM += '<div class="listItems financeListItems">';
                DOM += '<div class="desc">';
                DOM += '<p>财务类型：<span class="t-green">'+xytype(va.ptype)+'</span><i class="icon-exchange t-blue"></i><span class="t-red">'+va.price+'</span></p>';
                DOM += '</div>';
                DOM += '<div class="meta"><strong>备注</strong>：'+date("Y-m-d H:i",va.addtime)+'，'+va.msg+'</div>';
                DOM += '</div>';
            });
            $("#orderList").html(DOM);
          }else{
            $("#orderList").html(emptyData);
          }
    }
  }
  var order = {
     TgAjax : function(url,p){p?p:1;$.post(url,{page:p},function(data){  tpl.tg(data);},"json")},
     XyAjax : function(url,p){p?p:1;$.post(url,{page:p},function(data){  tpl.xy(data);},"json")},
     PpAjax : function(url,p){p?p:1;$.post(url,{page:p},function(data){  tpl.pp(data);DJS();},"json")},
   TeamAjax : function(url,p){p?p:1;$.post(url,{page:p},function(data){  tpl.team(data);},"json")},
FinanceAjax : function(url,p){p?p:1;$.post(url,{page:p},function(data){  tpl.finance(data);},"json")}

  }

/* 提供订单、提现订单 - 混合模式 */
function ulHtml(data) {
    var DOM = "",DOMheader = "",Action = "";
    $(data).each(function (i, va) {
        DOM += '<div class="orderItmes">';
        if(va.no.substring(0,2) == 'XY'){
          DOMheader = '<div class="orderHd alert-danger"><strong>得到帮助</strong><br><span class="order_out_id">'+va.no+'</span><i class="icon-jieshou" title="得到帮助"></i></div>';
        }else{
          DOMheader = '<div class="orderHd alert-info"><strong>提供帮助</strong><br><span class="order_out_id">'+va.no+'</span><i class="icon-tigong" title="提供帮助"></i></div>';
        }

        DOM += DOMheader;

        DOM += '<div class="orderBd"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金&nbsp;&nbsp;&nbsp;额</span>：&nbsp;&nbsp;<span><strong class="t-red">'+va.price2+'</strong></span><span class="order_out_currency">CNY</span><br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;参加者</span>：&nbsp;&nbsp;<span>'+va.username+'</span><br><span>未匹配金额</span>：&nbsp;&nbsp;<span>'+va.price+'</span><br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;期</span>：&nbsp;&nbsp;<span>'+date("Y-m-d H:i:s",va.addtime)+'</span><br><span>&nbsp;&nbsp;&nbsp;订单状态</span>：&nbsp;&nbsp;<span>'+(va.status1==1?'已完成':status(va.status))+'</span>';
        if (va.status1 == 0 && va.status == 0) {
          if (va.no.substring(0,2) == 'XY') {
            Action = '<a class="J_order_btn" href="javascript:;" onclick="orderAction(\'<{:U(\"bussiness/cancelxyDo\")}>\','+va.id+',\'你确定要取消吗?\')" style="float:right;">取消</a>';
          }else if(va.no.substring(0,2) == 'TG'){
            Action = '<a class="J_order_btn" href="javascript:;" onclick="orderAction(\'<{:U(\"bussiness/cancelDo\")}>\','+va.id+',\'你确定要取消吗?\')" style="float:right;">取消</a>';
          }
        }else if(va.status1 == 1 && va.no.substring(0,2) == 'TG' && va.status3 != 1){
          Action = '<a href="javascript:;" onclick="orderAction(\'<{:U(\"bussiness/outDo\")}>\','+va.id+',\'你确定要出局吗?\')"  style="float:right;">出局</a>';
        }else{
          Action = "";
        }

        DOM += Action;

        DOM += '</div></div>';
    });
    $("#orderList").html(DOM);

};


// JS格式状态
function status($k){  return orderStatus[$k]; }
// 提现类型
function xytype($k){  return xyType[$k]; }
// 匹配状态
function ppStatus($k){  return ppStatus[$k]; }
// 会员级别
function rank($k){ return rankType[$k]; }



// 异步加载
/*  $(function(){
$('.mui-content').load(mainPage);
  numSwitch=new Array(false,false);
$(document).on("click",'a', function(e){      
  if($(this).attr('target') != '_blank' && $(this).attr('dom') && $(this).attr('href')){
    e.preventDefault();
    var url = $(this).attr("href"),dom = $(this).attr("dom");        
    loading();
    $.get(url,function(data){ $("."+dom).html(data); loadEnd(); });
    return false;
  }
});

$('.tt-tab-item').on('click',function(){
  $('.tt-tab-item').removeClass('tt-tab-active');
  $(this).addClass('tt-tab-active');
});

});*/





// 倒计时
function DJS(){
    $(".timer").each(function(){
    var $this = $(this);
    var intDiff = parseInt($this.data('endtime'));
    window.setInterval(function(){
      var day=0,
        hour=0,
        minute=0,
        second=0;//时间默认值    
      if(intDiff > 0){
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      $this.html('<b>'+ hour+'</b>时<b>'+minute+'</b>分<b>'+second+'</b>秒');
      intDiff--;
      }, 1000);
  })
}

// JS格式化时间戳函数
function date(format, timestamp){ 
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
    var pad = function(n, c){
        if((n = n + "").length < c){
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
    var f = {
        // Day
        d: function(){return pad(f.j(), 2)},
        D: function(){return f.l().substr(0,3)},
        j: function(){return jsdate.getDate()},
        l: function(){return txt_weekdays[f.w()]},
        N: function(){return f.w() + 1},
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},
        w: function(){return jsdate.getDay()},
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},
       
        // Week
        W: function(){
            var a = f.z(), b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                return 1;
            } else{
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime()/1000));
                } else{
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },
       
        // Month
        F: function(){return txt_months[f.n()]},
        m: function(){return pad(f.n(), 2)},
        M: function(){return f.F().substr(0,3)},
        n: function(){return jsdate.getMonth() + 1},
        t: function(){
            var n;
            if( (n = jsdate.getMonth() + 1) == 2 ){
                return 28 + f.L();
            } else{
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                    return 31;
                } else{
                    return 30;
                }
            }
        },
       
        // Year
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
        Y: function(){return jsdate.getFullYear()},
        y: function(){return (jsdate.getFullYear() + "").slice(2)},
       
        // Time
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
        A: function(){return f.a().toUpperCase()},
        B: function(){
            // peter paul koch:
            var off = (jsdate.getTimezoneOffset() + 60)*60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds/86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00"+beat;
            if ((String(beat)).length == 2) beat = "0"+beat;
            return beat;
        },
        g: function(){return jsdate.getHours() % 12 || 12},
        G: function(){return jsdate.getHours()},
        h: function(){return pad(f.g(), 2)},
        H: function(){return pad(jsdate.getHours(), 2)},
        i: function(){return pad(jsdate.getMinutes(), 2)},
        s: function(){return pad(jsdate.getSeconds(), 2)},
        //u not supported yet
       
        // Timezone
        //e not supported yet
        //I not supported yet
        O: function(){
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
            return t;
        },
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
        //T not supported yet
        //Z not supported yet
       
        // Full Date/Time
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
        //r not supported yet
        U: function(){return Math.round(jsdate.getTime()/1000)}
    };
       
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
        if( t!=s ){
            // escaped
            ret = s;
        } else if( f[s] ){
            // a date function exists
            ret = f[s]();
        } else{
            // nothing special
            ret = s;
        }
        return ret;
    });
}   