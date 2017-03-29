<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends CommandController {
    public function index(){
        $this->display();
    }
    public function welcome(){
    	$this->display();
    }
}
