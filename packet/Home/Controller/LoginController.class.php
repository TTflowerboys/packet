<?php
namespace Home\Controller;
use Think\Controller;
class LoginController extends Controller {
	
    public function index(){
        $this->display();
    }

    # 登录
    public function loginDo(){
        if( !IS_POST ) {E('页面不存在！');}
        $veriCode = trim(I('post.veriCode'));
        $username = trim(i('post.username'));
        $password = trim(i('post.password'));
        if (empty($username)) {$this->error('用户编号不能为空！');}
        if (empty($password)) {$this->error('密码不能为空！');}
        if (empty($veriCode)) {$this->error('验证码不能为空！');}elseif (!check_verify($veriCode)) {$this->error("验证码输入有误！");}

        $user = M('user');
        $rs = $user->where(array("username"=>$username))->find();
        if ($rs) {
            if ($rs['status'] == 2) {
              $this->error('用户编号激活失败,请联系管理员!');
            }
            if ($rs['password'] === md5($password)) {
                session('UserId', $rs['id']);
                session('Username', $rs['username']);
                $this->success('欢迎回来！',U('index/index'));
            }else{
                $this->error('ID编号或密码不正确！');
            }            
        }else{
            $this->error('用户编号或密码不正确！');
        }
    }

    #生成验证码
    public function verifyCode(){
      $config =    array(
          'fontSize'    =>    22,
          'fontttf'     =>    '4.ttf',
          'length'      =>    4,
          'imageH'      =>    42,
          'imageW'      =>    156,
          'useNoise'    =>    false,
          'useCurve'    =>    false
      );
      $Verify = new \Think\Verify($config);
      $Verify->entry();
    }

    //随机码
    public function randomkeys($length){
      $pattern = '1234567890ABCDEFGHIJKLOMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';    //字符池
      for($i=0; $i<$length; $i++){
         $key .= $pattern{mt_rand(0,35)};    //生成php随机数
      }
      return $key;
    }
}