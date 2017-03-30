<?php
namespace Home\Controller;
use Think\Controller;
class BusinessController extends CommandController {
    public function index(){
        $ppmx = M('ppmx');
        $data['xyuid'] = 0;
        $data['status'] = array('in',array(0,1));
        $listcount = $ppmx->where($data)->field('id')->count();
        $Page = new \Think\Page($listcount, 15);
        $rs = $ppmx->where($data)->order('status,expiretime DESC')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('page', $Page->show());
        $this->assign('rs',$rs);

        $this->display();
    }
    public function pay(){
        $tgmx = M('tgmx');
        $listcount = $tgmx->field('id')->count();
        $Page = new \Think\Page($listcount, 15);
        $rs = $tgmx->order('status,expiretime DESC')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('page', $Page->show());
        $this->assign('rs',$rs);

        $this->display();
    }
    public function income(){
        $ppmx = M('ppmx');
        $data['xyuid'] = array('neq',0);
        $data['status'] = array('in',array(0,1));
        $listcount = $ppmx->where($data)->field('id')->count();
        $Page = new \Think\Page($listcount, 15);
        $rs = $ppmx->order('status,expiretime DESC')->where($data)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('page', $Page->show());
        $this->assign('rs',$rs);
        $this->display();
    }
    public function tgDetails(){
        if (!IS_POST) {E('页面不存在！');}
        $id = trim(I('get.id'));
        $tgmx = M('tgmx');
        $ppmx = M('ppmx');
        $rs = $tgmx->where(array('id'=>$id))->find();
        if (!$rs) {$this->show(C('pageErr'));exit();}
        $list = $ppmx->where(array('tgid'=>$rs['id'],'tguid'=>$rs['uid'],'tgno'=>$rs['no']))->order('status')->select();
        $this->assign('list',$list);

        $this->display();
    }

    public function comfirmDo(){
        //if (!IS_POST) {E('页面不存在！');}
        $id = trim(I('get.id'));
        $user = M('user');
        $ppmx = M('ppmx');
        $tgmx = M('tgmx');
        $message = M('message');
        $time = time();
        if (empty($id) || !is_numeric($id)) { $this->error('参数不合法，请稍后再试！'); }
        $rs = $ppmx->where(array('id'=>$id,'status'=>0))->find();
        if (!$rs) {$this->error('订单不存在，请稍后再试！');}
        # 订单是否过期
        if ($rs['expiretime']<$time) {$this->error('订单已经过期，操作无效！');}
        
        $user->startTrans();

        $price = $rs['price'];
        # 更新收款订单
        $data['price1'] = array('exp','price1+'.$price);
        $data['price2'] = array('exp','price2-'.$price);
        $data['comfirmtime'] = $time;
        if ($rs['price2'] - $price <= 0) {
            $data['comfirmtime'] = $time;
            $data['status'] = 1;
        }
        if ($ppmx->where(array('id'=>$rs['id']))->save($data) === false) {
            $user->rollback();
            $this->error('更新订单失败！');
        }

        # 更新付款订单
        $tgrs = $tgmx->where(array('id'=>$rs['tgid'],'status'=>0))->find();
        if (!$tgrs) {$this->error('查找付款订单失败，请稍后再试！');}
        $tgData['price1'] = array('exp','price1+'.$price);
        $tgData['price2'] = array('exp','price2-'.$price);        
        if ($tgrs['price2'] - $price<=0) {
            $tgData['comfirmtime'] = $time;
            $tgData['status'] = 1;
        }
        if ($tgmx->where(array('id'=>$tgrs['id']))->save($tgData) === false) {
            $user->rollback();
            $this->error('更新付款订单失败，请稍后再试！');
        }
        # 更新消息
        if ($message->where(array('id'=>$tgrs['id']))->save($tgData) === false) {
            $user->rollback();
            $this->error('更新消息失败！');
        }
        
        # 只有当订单在有效期内全部确认收款后，才能更新会员
        # A.如果是未激活(status=0)的会员，则激活;
        # 2.并更新上级substatus(substatus+1)
        # 3.上级更新后，如果上级substatus==2，则更新上级的上级
        # 3.2 上级的上级rank+1（如果rank>=2,则不继续升级），并生成打款订单.
        # B.如果是已激活会员(status=1)，则rank+1
        $upTgrs = $tgmx->where(array('id'=>$tgrs['id'],'status'=>1))->find();
        if ($upTgrs) {
            $userrs = $user->where(array('id'=>$upTgrs['uid']))->find();
            if (!$userrs) { 
                $this->error('会员不存在，请稍后再试！'); 
            }else{
                $userStatus = $userrs['status'];
                switch ($userStatus) {
                    case 0:
                        #A.如果是未激活(status=0)的会员，则激活;
                        if ($user->where(array('id'=>$userrs['id']))->save(array('status'=>1,'jhtime'=>$time)) === false) {
                            $user->rollback();
                            $this->error('更新会员失败！');
                        }
                        # A.1 更新上级substatus
                        if ($user->where(array('id'=>$userrs['parentid']))->save(array('substatus'=>array('exp','substatus+1'))) === false) {
                            $user->rollback();
                            $this->error('更新会员失败！');
                        }
                        # A.2 如果上级substatus==2，则表示上级的直属下级激活，此时应该提醒上级的上级升级
                        $pRs = $user->where(array('id'=>$userrs['parentid']))->find();
                        if ($pRs && ($pRs['substatus'] == 2)) {
                            $ppRs = $user->where(array('id'=>$pRs['parentid']))->find();
                            if ($ppRs) { #上级的上级，这种情况发生在顶层下面的会员升级
                                # TODO 72hour 未确定收款时又满足条件要升级
                                #[为了防止72小时内重复升级，通过累加upgrade，可以达到连续升级的目的]
                                if ($user->where(array('id'=>$ppRs['id']))->save(array('upgrade'=>array('exp','upgrade+1'))) === false) {
                                    $user->rollback();
                                    $this->error('更新会员失败！');
                                }
                                # 生成订单[一级一级升]
                                if ($ppRs['upgrade']<1) {
                                    $this->financeDo($ppRs['id']);
                                }
                            }
                            
                        }
                        break;
                    case 1:
                        #B.如果是已激活(status=1)的会员，则升级;
                        $upUserDate['rank'] = array('exp','rank+1');                        
                        $upUserDate['upgrade'] = array('exp','upgrade-1');
                        if ($user->where(array('id'=>$userrs['id']))->save($upUserDate) === false) {
                            $user->rollback();
                            $this->error('更新会员失败！');
                        }
                        #B.2.升级成功后，如果它已经满足另一个升级条件，则生成新的订单
                        if ($userrs['upgrade']>1) {
                            $this->financeDo($userrs['id']);
                        }
                        break;
                    default:
                        $this->error('未知错误，请稍后再试！');
                        break;
                }

            }
            
        }

        $user->commit();
        $this->success('操作成功！');
    }

    ##############
    #  财务结算  #
    ##############
    public function financeDo($uid){
        $user = M('user');
        $tgmx = M('tgmx');
        $ppmx = M('ppmx');
        $message = M('message');
        $time = time();
        $ppRs = $user->where(array('id'=>$uid))->find();
        if (!$ppRs) {$this->error('会员不存在，请稍后再试！');}
        
        #################
        # 开始算钱啦:-) #
        #################
                
        # 付款订单-生成
        # 1. 生成付款订单号
        $tgkey=date('ymd',time()).$ppRs['id'].$this->randCode(3);
        $tgno='TG'.$tgkey;
        while($tgmx->where(array('no'=>$tgno))->find()){
          $tgkey=date('ymd',time()).$ppRs['id'].$this->randCode(3);
          $tgno='TG'.$tgkey;
        }
        # 2. 金额
        $ldarr= explode(',',C('config.ldarr'));
        foreach ($ldarr as $key => $value) {
            $ldarr[$key]= explode(':', $value);
        }
        # 3. 新订单生成时间

        // $ldarr[0] => Array([0] => A级会员,[1] => 2,[2] => 1000,[3] => 24)
        $upUserRank = $ppRs['rank']+1;
        $setUserRank = $ldarr[$upUserRank][0];
        $priceStr = $ldarr[$upUserRank][2];
        $expireHour = $ldarr[$upUserRank][3];
        $expireTime = $time+60*60*$expireHour;
        $totlePrice = countPrice($priceStr);
        $upTgData['no'] = $tgno;
        $upTgData['uid'] = $ppRs['id'];
        $upTgData['username'] = $ppRs['username'];
        $upTgData['price'] = $upTgData['price2'] = $totlePrice;
        $upTgData['type'] = 1;
        $upPpData['price1'] = $upTgData['price1'] = 0;
        $upPpData['status'] = $upTgData['status'] = 0;
        $upPpData['remark'] = $upTgData['remark'] = "会员【<b class='t-green'>".$ppRs['username']."</b>】，".C('wenanArr.up')."<code>".$setUserRank."</code>";
        $upPpData['addtime'] = $upTgData['addtime']= $time;
        $upPpData['expiretime'] = $upTgData['expiretime'] = $expireTime;

        ## 生成付款红包 ##
        $uptgid = $tgmx->add($upTgData);
        if ($uptgid === false) {
            $user->rollback();
            $this->error('生成'.C('wenanArr.up').'订单失败！');
        }
        $upTgRs = $tgmx->where(array('id'=>$uptgid))->find();
        # 发送信息
        $upMsgData = array(
            'uid' => $ppRs['id'],
            'username'=>$ppRs['username'],
            'expiretime'=>$expireTime,
            'message'=>'请在 <b class="t-red">'.$expireHour.'小时</b>内(<code>'.date("Y-m-d H:i",$expireTime).'</code>前)'.C("wenanArr.up").'为<code>'.$setUserRank.'</code>，否则账号将被冻结！',
            'status'=> 0,
            'type' => 0,
            'remark' => "会员【<b class='t-green'>".$ppRs['username']."</b>】，".C('wenanArr.up'),
            'tgid' => $upTgRs['id'],
            'price'=> $totlePrice,
            'price1'=>0,
            'price2'=>$totlePrice,
            'addtime'=>$time
        );

        if ($message->add($upMsgData) === false) {
            $user->rollback();
            $this->error('发送信息失败！');
        }                    

        # 收款订单-生成                    
        # 打款人信息
        $upPpData['tgid'] = $upTgRs['id'];
        $upPpData['tgno'] = $upTgRs['no'];
        $upPpData['tguid'] = $upTgRs['uid'];
        $upPpData['tguser'] = $upTgRs['username'];
        # 收款人信息
        # A.根据后台设置的层数，匹配出收款人信息
        
        $descLdArr =  arrOrderByKey($ppRs['ldstr']); // 打款人领导,倒序
        $ldArrSize = count($descLdArr);
        $getLdArr = explode('-',$ldarr[$upUserRank][1]); // 后台设置的领导层
        # A.1 找出所有满足层数的领导，即：$incomeIdArr
        $incomeIdArr = array();                    // 返回匹配出的领导ID数组
        foreach ($getLdArr as $key => $value) {
            if ($value<=$ldArrSize) {
                array_push($incomeIdArr,$descLdArr[$value-1]);
            }
        }

        if (count($incomeIdArr)>0) {
            # A.2 找出所有满足 '层数'和'级别'的领导                 
            $find['id'] = array('in', $incomeIdArr);
            $find['rank'] = array('egt',$upUserRank);
            $list = $user->where($find)->select();
            $realLdIdArr = array(); # 把同时满足'层数'和'级别'的领导id找出来
            foreach ($list as $key => $value) {
                array_push($realLdIdArr,$value['id']);
            }
            $intersectArr = array_intersect($incomeIdArr, $realLdIdArr);
            #print_r($intersectArr);

            # B. 给匹配出来领导打款
            $priceArr = explode('-', $priceStr);
            $hasPayPrice = 0;
            foreach ($list as $key => $val) {
                $k = array_search($val['id'], $intersectArr);
                $upPpData['xyuid'] = $val['id'];
                $upPpData['xyuser'] = $val['username'];
                $upPpData['price'] = $upPpData['price2'] = $priceArr[$k];
                $upPpData['xycardno'] = $val['cardno'];
                $upPpData['xybanktype'] = $val['banktype'];
                $upPpData['xycarduser'] = $val['realname'];
                $upPpData['xybankaddress'] = $val['bankaddress'];
                $upPpData['xycardphone'] = $val['bindphone'];

                if ($ppmx->add($upPpData) === false) {
                    $user->rollback();
                    $this->error('生成收款订单失败！');
                }
                $hasPayPrice = $hasPayPrice + $priceArr[$k];
            }
            # B.1 未分完的钱，全部打给平台
            $surplusPrice = $totlePrice - $hasPayPrice;
            if ($surplusPrice>0) {
                $upPpData['xyuid'] = 0;
                $upPpData['xyuser'] = '';
                $upPpData['xycardno'] = C('config.cardno');
                $upPpData['xybanktype'] = C('config.banktype');
                $upPpData['xycarduser'] = C('config.realname');
                $upPpData['xybankaddress'] = C('config.bankaddress');
                $upPpData['xycardphone'] = C('config.bindphone');
                $upPpData['price'] = $upPpData['price2'] = $surplusPrice;
                if ($ppmx->add($upPpData) === false) {
                    $user->rollback();
                    $this->error('生成收款订单失败！');
                }
            }
        }else{
            # 如果没有领导，则直接将钱全部打给平台
            $upPpData['xycardno'] = C('config.cardno');
            $upPpData['xybanktype'] = C('config.banktype');
            $upPpData['xycarduser'] = C('config.realname');
            $upPpData['xybankaddress'] = C('config.bankaddress');
            $upPpData['xycardphone'] = C('config.bindphone');
            $upPpData['xyuid'] = 0; // 0,代表收款方为平台
            $upPpData['xyuser'] = '';
            $upPpData['price'] = $upPpData['price2'] = $totlePrice;
            if ($ppmx->add($upPpData) === false) {
                $user->rollback();
                $this->error('生成收款订单失败！');
            }
        }
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
