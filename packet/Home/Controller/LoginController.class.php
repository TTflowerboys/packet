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

        $user = D('user');
        $rs = $user->where(array("username"=>$username))->find();
        if ($rs) {
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

    # 会员注册
    public function registDo(){
      if( !IS_POST ) {E('页面不存在！');}
      $veriCode = trim(I('post.veriCode'));
      $username = trim(i('post.username'));
      $phone = trim(i('post.phone'));
      $paycard = trim(i('post.paycard'));
      
      if (empty($username)) {$this->error('姓名不能为空！');}
      if (empty($phone)) {$this->error('手机号不能为空！');}
      if (empty($paycard)) {$this->error('农行卡号不能为空！');}
      if (empty($veriCode)) {$this->error('验证码不能为空！');}elseif (!check_verify($veriCode)) {$this->error("验证码输入有误！");}
      if (!check_mobile($phone)) {
          $this->error('手机号格式不正确！');
      }
      $user_real = D('user_real');
      $user = D('user');
      $message = D('message');
      $rs_real = $user_real->where(array('phone'=>$phone))->find();
      if ($rs_real) {
          $this->error('手机号已经被注册，请更换！');
      }
      
      $data['username']=$username;
      $data['phone']=$phone;
      $data['paycard']=$paycard;
      $data['addtime']=time();
      $data['ip']=get_client_ip();
      
      $user->startTrans();
      $rs = $user_real->add($data);
      if ($rs) {
        $rs2 = $user_real->where(array('id'=>$rs))->find();
        # 生成新ID和密码
        $codekey=date('ymd',time()).$rs2['id'].$this->randomkeys(3);
        $usercode = 'HB'.$codekey;
        while($user->where(array('usercode'=>$tgno))->find()){
            $codekey=date('ymd',time()).$rs2['id'].$this->randomkeys(3);
            $usercode='HB'.$codekey;
        }
        $data = array(
            'username' => $rs2['username'],
            'phone' => $rs2['phone'],
            'paycard' => $rs2['paycard'],
            'usercode' => $usercode,
            'password' => md5('123456'),
            'addtime'  => time(),
            'status'   => 0,
            'ip' => get_client_ip()
        );

        $userrs = $user->add($data);
        if ($userrs) {
          $userrs2 = $user->where(array('id'=>$userrs))->find();
          $data = array(
            'touserid' => $userrs2['id'],
            'touser' => $userrs2['usercode'],
            'from' => '平台',
            'message' => '您没有上级，暂时没有红包消息！',
            'addtime' => time()
          );
          if ($message->add($data)) {
            $user->commit();
            session('UserId', $userrs2['id']);
            session('Usercode', $userrs2['usercode']);
            $this->success('会员注册成功！',U('index/index'));
          }else{
            $user->rollback();
            $this->error('会员注册失败！');
          }        
        }      
      }else{
        $user->rollback();
        $this->error('会员注册失败！');
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