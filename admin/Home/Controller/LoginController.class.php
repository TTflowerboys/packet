<?php
namespace Home\Controller;
use Think\Controller;
class LoginController extends Controller {
    public function index(){
        $this->display();
    }

    // 管理员登录
    public function loginCheckDo(){
      if( !IS_POST ) {E('页面不存在！');}
        $username = I('post.username');
        $password = I('post.password');
        $veriCode = I('post.veriCode');
        if (empty($username)) {$this->error('用户名不能为空！');}
        if (empty($password)) {$this->error('密码不能为空！');}
        if (empty($veriCode)) {$this->error('验证码不能为空！');}elseif (!check_verify($veriCode)) {$this->error("验证码输入有误！");}
        // 检测用户名和密码
        $admin = M('admin');
        $rs = $admin->where(array('username'=>$username))->find();
        if ($rs) {
          if ($rs['password'] === md5($password)) {
            session('AdminId', $rs['id']);
            session('AdminUser', $rs['username']);
            $data = array(
              'id' => $rs['id'],
              'logintime' => time(),
              'ip' => get_client_ip(),
              'lastip'=>$rs['ip'],
              'lasttime'=>$rs['logintime']              
            );
            $admin->save($data);
            $this->success('欢迎回來！',U('index/index'),'1');
          }else{
            $this->error('密码输入有误！');
          }
        }else{
          $this->error('用户名不存在！');
        }        
    }

    // 生成验证码
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
}