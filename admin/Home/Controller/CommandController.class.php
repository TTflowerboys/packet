<?php
namespace Home\Controller;
use Think\Controller;
class CommandController extends Controller {
    public function _initialize(){
		$config = M('config');
		$rssys = $config->find();
		C('config', $rssys);
		$this->checkAccess();
		C('DEFAULT_THEME', $rsset['DEFAULT_THEME']);
		# 平台收款账号
        /*$rsPlatBank = M('bank')->where(array('usertype'=>1,'isdefault'=>0))->find();
        if ($rsPlatBank) {
        	$this->error('平台未正确设置银行账户，将导致资金异常！');
        }
        C('platBank',$rsPlatBank);*/
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
