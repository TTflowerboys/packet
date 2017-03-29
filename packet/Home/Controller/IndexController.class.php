<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends CommandController {
	
    public function index(){
    	$msg = M('message');
        $data = array('uid'=>session('UserId'),'type'=>0,'status'=>0);
        $rsmsg = $msg->where($data)->find();
        $this->assign('rsmsg',$rsmsg); 
        $this->display();
    }

    public function logoutDo(){
        session('UserId',null);
        session('Username', null);
        $this->success('退出成功!', u('login/index'));
    }
}