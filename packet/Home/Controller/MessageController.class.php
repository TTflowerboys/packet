<?php
namespace Home\Controller;
use Think\Controller;
class MessageController extends CommandController {
    
    public function index(){
    	$message = M('message');
    	$rs = $message->where(array('uid'=>session('UserId'),'status'=>0))->find();
    	$this->assign('rs',$rs);
      $this->display();
    }


    //随机码
    public function randCode($length){
      $pattern = '1234567890';    //字符池
      for($i=0; $i<$length; $i++){
         $key .= $pattern{mt_rand(0,9)};    //生成php随机数
      }
      return $key;
    }
}