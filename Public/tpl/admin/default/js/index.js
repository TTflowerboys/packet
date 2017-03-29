$(function(){
  var pagestyle = function() {
    var iframe = $("#workspace");
    var h = $(window).height() - iframe.offset().top;
    var w = $(window).width() - iframe.offset().left;
    if(h < 300) h = 300;
    //if(w < 973) w = 973;
    if(w < 520) w = 520;
    iframe.height(h);
    iframe.width(w);
  }
  pagestyle();
  $(window).resize(pagestyle);
  /* mainMenu event */
  var mainTit = $(".mainTit").text();
  $(".main-menu").on("click","dt",function(){
    $(this).next("dd").slideToggle().siblings("dd").slideUp();
  })
  $(".main-menu").find("dd").on("click","a",function(){
    $(this).addClass("current").siblings().removeClass("current");
    $(this).parent().siblings("dd").children("a").removeClass("current");
    var ptxt = $(this).parent().prev().children("strong").text();
    var aTxt = $(this).text();
    $(".crumbs").html("<span>"+mainTit+"</span><span class='arrow'>&gt;</span><span>"+ptxt+"</span><span class='arrow'>&gt;</span><span>"+aTxt+"</span>");
  })
  /* J_logexit 退出 */
  $("#J_logexit").on("click",function(){
    layer.confirm('您确定要退出系统吗？', {btn: ['确定','取消']}, function(){
      $.post(logexitUrl, function(data) {
        layer.msg('恭喜您，已成功退出！', {icon: 1},function(){window.location.href=loginUrl;});
      });      
    });
  })
  

})