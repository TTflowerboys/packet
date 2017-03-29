$(function(){
  var order = {
    Ajax : function(p){
      p?p:1;
      $.post(orderDataUrl,{page:p},function(data){
        ulHtml(data);
      },"json");
    }
  }

  $("#orderListPage").createPage({
      pageCount:pageCount,
      current:1,
      backFn:function(p){
        order.Ajax(p);          
      }
  });
  order.Ajax(1);

})

// 倒计时
$(function(){
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
      $this.html('<b>'+ hour+'</b> 时 <b>'+minute+' </b>分 <b>'+second+'</b> 秒 ');
      intDiff--;
      }, 1000);
  })

})




function ulHtml(data) {
    var DOM = "",DOMheader = "";
    $(data).each(function (i, va) {
        var Action = "";
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
            Action = '<a class="J_order_btn" href="javascript:;" onclick="orderAction(\''+cancelxyUrl+'\','+va.id+',\'你确定要取消吗?\')" style="float:right;">取消</a>';
          }else if(va.no.substring(0,2) == 'TG'){
            Action = '<a class="J_order_btn" href="javascript:;" onclick="orderAction(\''+cancelUrl+'\','+va.id+',\'你确定要取消吗?\')" style="float:right;">取消</a>';
          }
        }else if(va.status1 == 1 && va.no.substring(0,2) == 'TG'){
            if (va.status3 == 1) {
                Action = '<a href="javascript:;"  style="float:right;">已出局</a>';
            }else{
                Action = '<a href="javascript:;" onclick="orderAction(\''+outUrl+'\','+va.id+',\'你确定要出局吗?\')" style="float:right;">出局</a>';
            }
        }

        DOM += Action;

        DOM += '</div></div>';
    });
    $("#orderList").html(DOM);

};


// JS格式状态
var orderStatus = ['等待匹配','部分匹配','全部匹配','已撤消'];
function status($k){
  return orderStatus[$k];
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