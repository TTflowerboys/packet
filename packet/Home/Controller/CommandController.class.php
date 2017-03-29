<?php
namespace Home\Controller;
use Think\Controller;
class CommandController extends Controller {

    public function _initialize(){  
        # 会员信息
        # 系统设置
        $rsConfig = M('config')->where(array('id'=>1))->find();
        C('config', $rsConfig);

        $this->autoCheck();

        if (!session('UserId')) { $this->redirect('Home/Login/index'); }
        $rsuser = M('user')->where(array('id' => session('UserId'),'username' => session('Username')))->find();
        C('rsuser', $rsuser);
        $this->assign('userRank',C('rsuser.rank'));

    }

    //随机码
    public function randomkeys($length){
      $pattern = '1234567890ABCDEFGHIJKLOMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';    //字符池
      for($i=0; $i<$length; $i++){
         $key .= $pattern{mt_rand(0,35)};    //生成php随机数
      }
      return $key;
    }

    // 激活过期处理，打款过期处理
    // 系统自动运算
    public function autoCheck(){
        $user = M('user');
        $ppmx = M('ppmx');
        $tgmx = M('tgmx');
        
        $time = time();
        ############################
        # 未激活会员，超时激活处理 #
        ############################
        # A.1 更新会员状态（status=2），并更新接点人点位信息
        $find['status']=array('eq',0);
        $find['_string']='('.$time.'-expiretime)>0'; #这里非常巧妙
        $userlist = $user->where($find)->select();

        //$user->startTrans();
       
        foreach($userlist as $key=>$val){
            if($user->where(array('id'=>$val['id']))->setField(array('status'=>2))===false){
                $user->rollback();
                $this->error('未激活会员,超时处理失败!');
            }
            if($val['parent_where'] == 1){
                $userup['left']='';
            }elseif ($val['parent_where'] == 2) {
                $userup['right']='';
            } 
            if($user->where(array('id'=>$val['parentid']))->setField($userup)===false){
                $user->rollback();
                $this->error('未激活会员超时,更新接点人点位失败!');
            }
        }

        ##########################
        # 订单处理，过期修改状态 #
        ##########################
        # B.1 关闭所有付款订单
        $tglist = $tgmx->where($find)->select();
        foreach ($tglist as $key => $value) {
            if($tgmx->where(array('id'=>$val['id']))->setField(array('status'=>2))===false){
                $user->rollback();
                $this->error('超时付款订单,处理失败!');
            }
        }

        # B.2 关闭所有收款订单
        $pplist = $ppmx->where($find)->select();
        foreach ($pplist as $key => $value) {
            if($ppmx->where(array('id'=>$val['id']))->setField(array('status'=>2))===false){
                $user->rollback();
                $this->error('超时收款订单,处理失败!');
            }
        }


    }
}