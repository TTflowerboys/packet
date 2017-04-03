<?php
namespace Home\Controller;
use Think\Controller;
class CommandController extends Controller {
    public function _initialize(){
		$rssys = M('config')->find();
		C('config', $rssys);
		$this->checkAccess();
		C('DEFAULT_THEME', $rsset['DEFAULT_THEME']);
	}

	public function checkAccess(){
		$admin = M('admin');
		$rs = $admin->where(array('id' => session('AdminId')))->find();
		$this->assign('rs', $rs);
		if (!$rs) {
			$this->redirect('Home/Login/index');
		}
	}
}
