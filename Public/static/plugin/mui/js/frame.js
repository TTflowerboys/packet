$(function(){
	numSwitch=new Array(false,false);
    leftBar = $("#leftBar");
    var wheight = $(window).height();
    $('.ui-content').load('/help_security.shtml',function(){
		leftbardefaultheight=$('#ui_content_main').height()<$(window).height()?$(window).height():($('#ui_content_main').height()+70);
		$("#bigPage > div.left-bar-warp").css('height',leftbardefaultheight);
	});
    $('#leftBar').load('/default_menu.shtml');
    $('#bigPage').css('min-height',wheight);
    window._location = new Array();  
    $(document).on("submit",'form',function(){
        erryalocation(window._onLocation);
    })
    $(document).on("click",'a', function(){  
        if($(this).attr('target') != '_blank' && $(this).attr('dom') && $(this).attr('href'))
        {
            
            var url = $(this).attr("href");
            var dom = $(this).attr("dom");  
            numSwitch[1] = false;
            erryalocation(window._onLocation);
            
            loading(); 
            //$('.'+dom).load(url,function(){loadEnd()}) 
			if($(this).parents('div#ui_content_main').length>0  ||  $(this).hasClass('ui-topBarNva') ){
					wipeLeft();
			}
            $.get(url,function(data)
            {  
                if(data.status == 0){ 
                    alert(data.info); 
                }else{
                    try
                    {                            
                        $("."+dom).html(data); 
                        window._onLocation = url.replace('/',"");
						var tmp_height=$('#ui_content_main').height()<$(window).height()?$(window).height():($('#ui_content_main').height()+70);
						if(tmp_height>leftbardefaultheight){
							$("#bigPage > div.left-bar-warp").css('height',tmp_height);
						}else{
							$("#bigPage > div.left-bar-warp").css('height',leftbardefaultheight);
						}
                    }
                    catch(err) 
                    { 
                　　　　alert(err.message);
                　　}
                }  
                loadEnd();
            });
            return false;
        }   
    });
    $(document).on("click",'.alink', function(){   
            var url = $(this).attr("data-url");
            var dom = $(this).attr("data-dom"); 
            erryalocation(window._onLocation);
            loading();  
            $.get(url,function(data)
            {  
                if(data.status == 0){ 
                    alert(data.info); 
                }else{
                    try
                    {                            
                        $("."+dom).html(data); 
                        window._onLocation = url.replace('/',"");
						var tmp_height=$('#ui_content_main').height()<$(window).height()?$(window).height():($('#ui_content_main').height()+70);
						if(tmp_height>leftbardefaultheight){
							$("#bigPage > div.left-bar-warp").css('height',tmp_height);
						}else{
							$("#bigPage > div.left-bar-warp").css('height',leftbardefaultheight);
						}
                    }
                    catch(err) 
                    { 
                　　　　alert(err.message);
                　　}
                }  
                loadEnd();
            });
            return false; 
    });
    $(document).on("click",'.popMark', function(){ 
        $(this).remove();
    });
    $('.ui-topBarNva').click(function()
    {
        $('.ui-topBarNva').removeClass('on');
        $('.ui-topBarNva .highLight').remove();
        $(this).addClass('on');
        $(this).append("<div class='highLight l'></div><div class='highLight t'></div><div class='highLight r'></div>");

    });

    $('#flNva').click(function(){ 
        var data = numSwitch[0];  
        if(data) {
                wipeLeft();
		}
        else{
                wipeRight();
		}
    });
	$('#flNva').trigger('click');
	$("#bigPage").swipe( {
			//Generic swipe handler for all directions
			swipeLeft:function(event, direction, distance, duration, fingerCount) {
                    if (numSwitch[1] == true) 
                    { 
                        $(document).ready(function(){
                            $(".drp-popup").find(".drp-calendar-end").click();
                        })
                    }else
                    {
                          wipeLeft();
                    }
			},
			swipeRight:function(event, direction, distance, duration, fingerCount) {
                    if (numSwitch[1] == true) 
                    {
                        $(document).ready(function(){
                            $(".drp-popup").find(".drp-calendar-start").click();
                        })                            
                    }else
                    {
                          wipeRight();
                    }
			},	
			threshold:7				

	});		
    $("#leftBarMark").click(function(){
        if(numSwitch[0] == true)
        {
            wipeLeft();
        }
    })
     function wipeLeft()
    {     
         //$("body").css({"height":'auto',"overflow":"auto"}) 
         $("#leftBar").hide();
         $("#leftBarMark").hide(); 
         $("#bigPage").css({'margin-left':'0',"height":$(window).height()-120}).parent().css({"height":"auto","overflow-y":"auto"});
         numSwitch[0] = false
    }
    function wipeRight()
    {  
         $("#leftBarMark").show(); 
         $("#leftBar").show();
         //$("#bigPage > div.left-bar-warp").css({"height":$(window).height()+5});  
         $("#bigPage").css({'margin-left':'64.583%',"height":$(window).height()+115}).parent().css({"height":$(window).height()+5});  
         numSwitch[0] = true;
    }
    
}); 
function loading(){
    $('body').append('<div class="loadding"></div><div class="container"><div class="content"><div class="circle"></div><div class="circle1"></div></div></div>');
}
function loadEnd(){
    $('.loadding').remove();
    $('.container').remove();
}


function erryalocation(url)
{
    if(url){
        window._location.push(url);
  }else{
        $.get('/'+window._location.pop(),function(data)
            {  
                if(data.status == 0){ 
                    alert(data.info) 
                }else{
                    try
                    {                            
                        $(".ui-content").html(data); 
						var tmp_height=$('#ui_content_main').height()<$(window).height()?$(window).height():($('#ui_content_main').height()+70);
						if(tmp_height>leftbardefaultheight){
							$("#bigPage > div.left-bar-warp").css('height',tmp_height);
						}else{
							$("#bigPage > div.left-bar-warp").css('height',leftbardefaultheight);
						}
                    }
                    catch(err) 
                    { 
                　　　　alert(err.message);
                　　}
                }  
                loadEnd();
            });
    }
};
