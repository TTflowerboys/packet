<?php
$array1 = array(
    # 数据库配置
    'DB_TYPE'=>'mysql',
	'DB_HOST'=>'127.0.0.1',
	'DB_USER'=>'root',
	'DB_PWD'=>'root',
	'DB_NAME'=>'packet',
	'DB_PORT'=>'',
	'DB_PREFIX'=>'pk_',

	//'配置项'=>'配置值'
	'DEFAULT_THEME' => 'default',
	#模版的配置
	'TMPL_L_DELIM'  => '<{',
	'TMPL_R_DELIM'  => '}>',
	
	#添加输出替换
	'TMPL_PARSE_STRING' =>  array(
        '__STATIC__'    =>  __ROOT__.'/static'
    ),

    'userRankArr' => array(
    	0 => 'A级会员',
    	1 => 'B级会员',
    	2 => 'C级会员'
    ),
    'userStatusArr' => array(
    	0 => '未激活',
    	1 => '正常',
    	2 => '激活失败',
        3 => '超时升级'
    ),
    'userAreaArr' => array(
    	1 => '左区',
    	2 => '右区'
    ),
    'bankType' => array(
        1 => '中国农业银行'
    ),
    'orderStatus' => array(
        0 => '等待付款',
        1 => '订单完成',
        2 => '交易失败'
    ),
    'wenanArr' => array(
        'jh'=>'激活帐户',
        'fee'=>'服务费',
        'up'=>'帐户升级',
        'platform'=>'系统'
    ),
    # 系谱图轨数
    'treeType' => 2,
    'registTime'=> 24,
    'empty'=>'<div class="empty"><i class="icon-lost"></i>没有相关信息</div>',
    'pageErr' => '<div class="popCont"><div class="msg"><div class="msgHd"><i class="icon-lost"></i>糟糕，网页开小差了。。。</div><p class="msgBd">（你的访问有误，请稍后再试！）</p></div></div>'
);