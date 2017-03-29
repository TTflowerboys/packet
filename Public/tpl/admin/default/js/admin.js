$(function(){
  // 添加管理员
  $("#AdminAdd-btn").on("click",function(){
    var username = $("#username").val(),nicename = $("#nicename").val(),pwd = $("#pwd").val(),cpwd = $("#cpwd").val();
    if(!username){layer.msg('用户名不能为空！');$("#username").focus();return false;}
    if(!nicename){layer.msg('昵称不能为空！');$("#nicename").focus();return false;}
    if(!pwd){layer.msg('密码不能为空！');$("#pwd").focus();return false;}
    if(pwd.length<6){layer.msg('密码不能少于6位！');$("#pwd").focus();return false;}
    if(!cpwd){layer.msg('密码不能为空！');$("#cpwd").focus();return false;}
    if (pwd !== cpwd) {layer.msg('两次密码输入不一致！');$("#cpwd").focus();return false;}
    if(username && nicename && pwd && cpwd){
      $.ajax({
        type : "POST",
        url: this.href,
        dataType : "json",
        data: {
          "username":username,
          "nicename":nicename,
          "pwd":pwd,
          "cpwd":cpwd          
        },
        cache: false,
        success: function(data) {              
          if (data!= null){     
            if (data.status==1){
              layer.msg(data.info, {"icon":1},function(){window.location.href=data.url});return false;
            }else{
              layer.msg(data.info,{"icon":0});return false;
            }
          }
        }
      })
    }
    return false;
  });



  $("#AdminEdit-btn").on("click",function(){
    var username = $("#username").val(),nicename = $("#nicename").val(),pwd = $("#pwd").val(),cpwd = $("#cpwd").val(),id=$("#id").val();
    if(!username){layer.msg('用户名不能为空！');$("#username").focus();return false;}
    if(!nicename){layer.msg('昵称不能为空！');$("#nicename").focus();return false;}
    if (pwd !== cpwd) {layer.msg('两次密码输入不一致！');$("#cpwd").focus();return false;}
    if(username && nicename){
      $.ajax({
        type : "POST",
        url: this.href,
        dataType : "json",
        data: {
          "username":username,
          "nicename":nicename,
          "pwd":pwd,
          "cpwd":cpwd,
          "id":id         
        },
        cache: false,
        success: function(data) {              
          if (data!= null){     
            if (data.status==1){
              layer.msg(data.info, {"icon":1},function(){window.location.href=data.url});return false;
            }else{
              layer.msg(data.info,{"icon":0});return false;
            }
          }
        }
      })
    }
    return false;
  });
})