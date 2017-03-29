$(function(){
  // 登录图片变化
  var loginImgArr = {
  	"before":"http://static.flowerboys.cn/loginGif/beforelogin.gif",
  	"username":"http://static.flowerboys.cn/loginGif/username.gif",
  	"pwd":"http://static.flowerboys.cn/loginGif/password.gif"
  }
  var loginImg = $("#login-img"),
    fLogin = $("#fLogin").children(".fLogin-text");
	fLogin.on("focus",function(){
      if ("username" == this.id) {
        loginImg.attr("src",loginImgArr.username);
	  }else{
        loginImg.attr("src",loginImgArr.pwd);
      }
    });
  fLogin.on("blur",function(){loginImg.attr("src",loginImgArr.before);});
  
  // 验证码
  $(".verify-btn").on("click",function(){
    $(".verify-pic").attr("src",veriCodeUrl);
  });
  
  // 登录操作
  $("#signin-btn").on("click",function(){
  	var username = $("#username").val(),password = $("#password").val(),veriCode = $("#veriCode").val();
  	if(!username){layer.msg('用户名不能为空！');$("#username").focus();return false;}
  	if(!password){layer.msg('密码不能为空！');$("#password").focus();return false;}
  	if(!veriCode){layer.msg('验证码不能为空！');$("#veriCode").focus();$(".verify-btn").click();return false;}

  	if(username && password && veriCode){
      $.ajax({
        type : "POST",
        url: this.href,
        dataType : "json",
        data: {
          "username":username,
          "password":password,
          "veriCode":veriCode          
        },
        cache: false,
        success: function(data) {              
          if (data!= null){			
			      if (data.status==1){
              layer.msg(data.info, {icon: 1},function(){
              	window.location.href=data.url;
              });return false;
            }else{
              layer.msg(data.info,{icon:0});$("#veriCode").val('');$(".verify-btn").click();return false;
            }
          }
        }
      })
  	}
    return false;
  });
  

})