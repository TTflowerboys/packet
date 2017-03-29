var $main = $cloud = mainwidth = null;
var offset1 = 450,offset2 = 0,offsetbg = 0;
    
$(function(){
    $main = $("#mainBody");
    $body = $("body");
    $cloud1 = $("#cloud1");
    $cloud2 = $("#cloud2");
    mainwidth = $main.outerWidth();
var c = $("#media"), d = $("#audio_btn"), e = $("#yinfu");
    c.on("canplay",function() {c.get(0).play()}).on("play",function() {d.removeClass("off"), e.addClass("rotate")}).on("pause",function() {d.addClass("off"), e.removeClass("rotate")});
    d.click(function(a) {a.stopPropagation(),$(this).hasClass("off") ? (c.get(0).play()) : c.get(0).pause()})
});
/// 飘动
setInterval(function flutter() {
    if (offset1 >= mainwidth) {
        offset1 =  -580;
    }

    if (offset2 >= mainwidth) {
   offset2 =  -580;
    }

    offset1 += 1.1;
offset2 += 1;
    $cloud1.css("background-position", offset1 + "px 100px")

$cloud2.css("background-position", offset2 + "px 460px")
}, 70);
  
  
setInterval(function bg() {
    if (offsetbg >= mainwidth) {offsetbg =  -580;}
    offsetbg += 0.9;
    $body.css("background-position", -offsetbg + "px 0")
}, 90 );




  