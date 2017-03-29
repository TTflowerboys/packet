<?php
namespace Home\Model;
class UserModel extends \Think\Model
{
	protected $_auto = array(
		array('password', 'md5', 3, 'function'),
		array('addtime', 'time', 1, 'function')
	);
	protected $_validate = array(
		array('username', 'require', '姓名不能为空'),
		//array('username','','帐号名称已经存在！',0,'unique',1),
		array('phone', 'require', '请输入手机号'),
		array('phone', 'checkmobile', '手机号格式输入有误', 0, 'callback', 1),
		array('phone', 'checkmobilecount', '手机号已经存在！', 0, 'callback', 1),
		#array('cpassword', 'password', '确认登陆密码不正确', 0, 'confirm'),
	);
	protected function checkmobilecount($mobile){
		$users = m('user_real');
		$rs = $users->where(array('phone' => $mobile))->count();
		if ($rs<1) {
			return true;
		}else {
			return false;
		}
	}
	protected function checkusername($username){
		$userpreg = '/^[0-9a-zA-Z]{6,12}$/';
		if (!preg_match($userpreg, $username)) {
			return false;
		}else {
			return true;
		}
	}
	protected function checktjuser($tjuser){
		$users = m('user');
		if(($users->field('id')->count())>0){
			$rs = $users->where(array('username' => $tjuser))->find();
			if ($rs) {
				return true;
			}else {
				return fase;
			}
		}else{
			return true;
		}
	}
	protected function checkmobile($mobile){
		$mobilepreg = '/^1[3|4|5|7|8][0-9]{9}$/';
		if (!preg_match($mobilepreg, $mobile)) {
			return false;
		}else {
			return true;
		}
	}
	protected function checkemail($email){
		$emailpreg = '/^(?:\\w+\\.?)*\\w+@(?:\\w+\\.)+\\w+$/';
		if (!preg_match($emailpreg, $email)) {
			return false;
		}else{
			return true;
		}
	}
}

?>
