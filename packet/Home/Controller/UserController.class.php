<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends CommandController {
    
    public function index(){
        $user = M('user');
        $rs = $user->where(array('id'=>session('UserId')))->find();
        $this->assign('rs',$rs);
        $this->display();
    }

    public function team(){
        # treeType
        $uid = session('UserId');
        $tree = $this->dis_thistree($uid).$this->dis_Parent($uid);
        $this->assign('tree',$tree);
        $this->display();
    }

    public function changepwd(){
        $user = M('user');
        $rs = $user->where(array('id'=>session('UserId')))->find();
        $this->assign('rs',$rs);
        $this->display();
    }

    public function purse(){
        $this->display();
    }

    public function reg(){
        $user = M('user');

        $ParentId = i('get.ParentId');
        if (is_numeric($ParentId) && $ParentId>0) {
            $rsParent = $user->where(array('id' => $ParentId))->find();
            if ($rsParent) {
                $parentuser = $rsParent['username'];
            }else{
                $this->error('页面不存在！',U('user/team'));
            }
        }
        $parent_where = trim(I('get.ParentWhere'));
        $startSymbol = getSymbol($rsParent['type'] ? $rsParent['type'] : 0);
        $randno =$startSymbol.$this->randCode(6);
        while($user->where(array('username'=>$randno))->find()){
            $randno =$startSymbol.$this->randCode(6);
        }
        $this->assign('username',$randno);
        $this->assign('where',$parent_where);
        $this->assign('parentuser', $parentuser);
        $this->assign('tjid',session('UserId'));
        $this->assign('tjuser',session('Username'));
        $this->display();
    }

    public function regDo(){
        if( !IS_POST ) {E('页面不存在！');}
        $parentuser = trim(I('post.parentuser'));
        $username = trim(I('post.username'));
        $password = trim(I('post.password'));
        $phone = trim(I('post.phone'));
        $banktype = trim(I('post.banktype'));
        $cardno = trim(I('post.cardno'));
        $realname = trim(I('post.realname'));
        $parent_where = trim(I('post.parent_where'));
        $tjid = trim(I('post.tjid'));
        $tjuser = trim(I('post.tjuser'));
        #$veriCode = trim(I('post.veriCode'));

        $user = M('user');

        if (empty($parentuser)) {$this->error('接点人用户编号不能为空！');}
        if (empty($username)) {$this->error('新会员用户编号不能为空！');}
        if (empty($password)) {$this->error('登录密码不能为空！');}
        if (empty($phone) || !check_mobile($phone)) {
            $this->error('手机号输入不正确！');
        }
        if (empty($cardno)) {$this->error('银行帐号不能为空！');}
        if (empty($realname)) {$this->error('开户姓名不能为空！');}

        #if (empty($veriCode)) {$this->error('验证码不能为空！');}elseif (!check_verify($veriCode)) {$this->error("验证码输入有误！");}

        # 会员点位
        $whereArr = array('1','2');
        if (empty($parent_where) || !is_numeric($parent_where) || !in_array($parent_where, $whereArr)) { $this->error('请选择会员点位！'); }     
        # 会员名是否唯一
        if ($user->where(array('username' => strtoupper($username)))->find()) {
            $this->error('新会员用户编号已存在！');
        }
        # 接点人,是否存在
        $rsparent = $user->where(array('username' => strtoupper($parentuser)))->find();
        if (!$rsparent) {
            $this->error('接点人不存在！');
        }
        # 接点人，是否激活
        $rsparent1 = $user->where(array('id' => $rsparent['id'], 'status' => array('not in','0,2')))->find();
        if (!$rsparent1) {
            $this->error('接点人未激活，暂时不能注册，请稍后再试！');
        }
        # 接点人，点位['左区','右区']
        # 1. 点位已满
        if (!empty($rsparent1['left']) && !empty($rsparent1['right'])) {
            $this->error('接点人点位已满！');
        }
        # 2. 左区
        if (($parent_where === '1') && !empty($rsparent1['left'])) {
            $this->error('接点人左区已满！');
        }
        # 3. 右区
        if (($parent_where === '2') && !empty($rsparent1['right'])) {
            $this->error('接点人右区已满！');
        }
        # 4.接点人领导关系
        if($rsparent1['ldstr']){
            $data['ldstr']=$rsparent1['ldstr'].','.$rsparent1['id'];
        }else{
            $data['ldstr'] = $rsparent1['id'];
        }

        # 层数
        if (is_numeric($rsparent1['floor'])) {
            $data['floor'] = $rsparent1['floor']+1;
        }else{
            $data['floor'] = 1;
        }

        # 处理推荐人信息
        $data['tjid']=$tjid ;
        $data['tjuser']=$tjuser;


        $time = time();
        # 注册会员
        $data['username']=$username;
        $data['password']=md5($password);
        $data['phone'] = $phone;
        $data['cardno'] = $cardno;
        $data['realname'] = $realname;
        $data['banktype']= $banktype;
        $data['status']=0;
        $data['tjnum']=0;
        $data['rank']=0;
        $data['parent_where'] = $parent_where;
        $data['parentid'] = $rsparent1['id'];
        $data['parentuser'] = $rsparent1['username'];
        $data['type'] = $rsparent1['type'];
        $ppData['addtime'] = $tgData['addtime'] = $data['addtime'] = $time;
        $ppData['expiretime'] = $tgData['expiretime'] = $data['expiretime'] = $time + 60 * 60 * getLdInfo(0,3);

        $user->startTrans();

        $rs = $user->add($data);
        if ($rs === false) {
            $user->rollback();
            $this->error('注册会员失败！');
        }
        # 更新推荐人-人数
        if($user->where(array('id'=>$rstj['id']))->save(array('tjnum'=>array('exp','tjnum+1'))) === false){
            $user->rollback();
            $this->error('更新推荐人数失败');
        }
        # 更新接点人，点位
        if($parent_where === '1' && $user->where(array('id'=>$rsparent1['id']))->save(array('left'=>$rs)) === false){
            $user->rollback();
            $this->error('更新接点人点位失败！');
        }
        if ($parent_where === '2' && $user->where(array('id'=>$rsparent1['id']))->save(array('right'=>$rs)) === false) {
            $user->rollback();
            $this->error('更新接点人点位失败！');
        }

        #################
        # 开始算钱啦:-) #
        #################
        $rs1 = $user->where(array('id'=>$rs))->find();
        # 付款订单-生成
        $tgmx = M('tgmx');
        # 1. 生成提供订单
        $tgkey=date('ymd',time()).$rs.$this->randCode(3);
        $tgno='TG'.$tgkey;
        while($tgmx->where(array('no'=>$tgno))->find()){
          $tgkey=date('ymd',time()).$rs.$this->randCode(3);
          $tgno='TG'.$tgkey;
        }

        $fee = C('config.fee')>0 ? C('config.fee') : 0;

        $totlePrice = getTotlePrice($rs1['type']);
        $tgData['no'] = $tgno;
        $tgData['uid'] = $rs1['id'];
        $tgData['username'] = $rs1['username'];
        $tgData['price'] = $tgData['price2'] = $totlePrice + $fee;
        $ppData['price1'] = $tgData['price1'] = 0;
        $ppData['status'] = $tgData['status'] = 0;
        $tgData['remark'] = '会员【<b class="t-green">'.$rs1['username'].'</b>】，'.C('wenanArr.jh');        
        $tgData['type'] = 0; #订单类型分为两种（方便处理新会员和老会员）：0-激活；1-升级

        ## 生成激活红包 ##
        $tgid = $tgmx->add($tgData);
        if ($tgid === false) {
            $user->rollback();
            $this->error('生成'.C('wenanArr.jh').'订单失败！');
        }

        # 收款订单-生成
        $ppmx = M('ppmx');
        $tgrs = $tgmx->where(array('id'=>$tgid))->find();
        # 打款人信息
        $ppData['tgid'] = $tgrs['id'];
        $ppData['tgno'] = $tgrs['no'];
        $ppData['tguid'] = $tgrs['uid'];
        $ppData['tguser'] = $tgrs['username'];
        # 1. 平台收款信息
        $ppData['xycardno'] = C('config.cardno');
        $ppData['xybanktype'] = C('config.banktype');
        $ppData['xycarduser'] = C('config.realname');
        $ppData['xybankaddress'] = C('config.bankaddress');
        $ppData['xycardphone'] = C('config.bindphone');
        $ppData['xyuid'] = 0; // 0,代表收款方为平台
        $ppData['xyuser'] = '';
        # 2. 平台收服务费
        if ($fee>0) {
            $ppData['price'] = $ppData['price2'] = $fee;
            $ppData['remark'] = '会员【<b class="t-green">'.$tgrs['username'].'</b>】，帐户激活<code>'.C('wenanArr.fee').'</code>';
            if ($ppmx->add($ppData) === false) {
                $user->rollback();
                $this->$this->error('生成'.C('wenanArr.jh').'订单失败！');
            }
        }

        # 收款人信息
        # A.根据后台设置的层数，匹配出收款人信息
        $remark = '会员【<b class="t-green">'.$tgrs['username'].'</b>】，'.C('wenanArr.jh').'<code>'.getLdInfo(0,0).'</code>';
        $descLdArr =  arrOrderByKey($rs1['ldstr']); // 打款人领导,倒序
        $ldArrSize = count($descLdArr);
        $getLdArr = explode('-',getLdInfo(0,1)); // 后台设置的领导层
        $incomeIdArr = array();                    // 返回匹配出的领导ID数组
        foreach ($getLdArr as $key => $value) {
            if ($value<=$ldArrSize) {
                array_push($incomeIdArr,$descLdArr[$value-1]);
            }
        }
        $incomeIdArrSize = count($incomeIdArr);
        if ($incomeIdArrSize) {
            # B.在数据库中查找匹配的领导，并分别给他们打款
            $find['id'] = array('in', $incomeIdArr);
            $find['rank'] = array('egt',0);
            $find['istop'] = 0; # 不处理顶层会员
            $list = $user->where($find)->select();
            $realLdIdArr = array(); # 把同时满足'层数'和'级别'的领导id找出来
            foreach ($list as $key => $value) {
                array_push($realLdIdArr,$value['id']);
            }
            $intersectArr = array_intersect($incomeIdArr, $realLdIdArr);

            # B.B 给匹配出来的收款人打款
            $percentStr = getLdInfo(0,2);
            $percentArr = explode('-', $percentStr);
            $hasPayPrice = 0;
            foreach ($list as $key => $val) {
                $k = array_search($val['id'], $intersectArr);
                $ppData['xyuid'] = $val['id'];
                $ppData['xyuser'] = $val['username'];
                $ppData['price'] = $ppData['price2'] = getPercent($k,$percentStr) * $totlePrice;
                $ppData['remark'] = $remark;
                $ppData['xycardno'] = $val['cardno'];
                $ppData['xybanktype'] = $val['banktype'];
                $ppData['xycarduser'] = $val['realname'];
                $ppData['xybankaddress'] = $val['bankaddress'];
                $ppData['xycardphone'] = $val['phone'];

                if ($ppmx->add($ppData) === false) {
                    $user->rollback();
                    $this->error('生成收款订单失败！');
                }
                $hasPayPrice = $hasPayPrice + getPercent($k,$percentStr) * $totlePrice;
            }
            # B.C 未分完的钱，全部打给平台
            $surplusPrice = $totlePrice - $hasPayPrice;
            if ($surplusPrice>0) {
                $ppData['xyuid'] = 0;
                $ppData['xyuser'] = '';
                $ppData['xycardno'] = C('config.cardno');
                $ppData['xybanktype'] = C('config.banktype');
                $ppData['xycarduser'] = C('config.realname');
                $ppData['xybankaddress'] = C('config.bankaddress');
                $ppData['xycardphone'] = C('config.bindphone');
                $ppData['price'] = $ppData['price2'] = $surplusPrice;
                $ppData['remark'] = $remark;
                if ($ppmx->add($ppData) === false) {
                    $user->rollback();
                    $this->error('生成收款订单失败！');
                }
            }
            
        }else{
            # 如果没有领导，则直接将钱全部打给平台[即，·接点人·为最顶层的人]
            $ppData['price'] = $ppData['price2'] = $totlePrice;
            $ppData['remark'] = $remark;
            if ($ppmx->add($ppData) === false) {
                $user->rollback();
                $this->error('生成收款订单失败！');
            }
        }

        # 发送信息
        $message = M('message');
        $rs1 = $user->where(array('id'=>$rs))->find();
        $expireTime = $rs1["addtime"] + 60 * 60 * getLdInfo(0,3);
        $payment = '';
        $msgData = array(
            'uid' => $rs1['id'],
            'username'=>$rs1['username'],
            'expiretime'=>$expireTime,
            'message'=>'请在 <b class="t-red">'.C("registTime").'小时</b>内(<code>'.date("Y-m-d H:i",$expireTime).'</code>前)激活账户，否则账号将被取消！',
            'status'=> 0,
            'type' => 0,
            'remark' => '会员【'.$tgrs['username'].'】账号激活',
            'tgid' => $tgrs['id'],
            'price'=> $totlePrice+$fee,
            'price1'=>0,
            'price2'=>$totlePrice+$fee,
            'addtime'=>$time
        );

        if ($message->add($msgData) === false) {
            $user->rollback();
            $this->error('发送信息失败！');
        }

        $user->commit();
        $this->success('会员注册成功', u('user/team'));
    }

    public function saveDo(){
        if (!IS_POST) {E('请求页面不在');}
        $realname = trim(I('post.realname'));
        $phone = trim(I('post.phone'));
        $banktype = trim(I('post.banktype'));
        $cardno = trim(I('post.cardno'));
        $bankaddress = trim(I('post.bankaddress'));
        
        $user = M('user');

        if (!empty($phone) && !check_mobile($phone)) { $this->error('手机号输入不正确！'); }
        $rs = $user->where(array('id'=>session('UserId')))->find();
        if (!$rs) { $this->error('操作有误！'); }
        $data['realname'] = $realname;
        $data['phone'] = $phone;
        $data['banktype'] = $banktype;
        $data['cardno'] = $cardno;
        $data['bankaddress'] = $bankaddress;
        if ($user->where(array('id'=>$rs['id']))->save($data)===fasle) {
            $this->error('操作失败！');
        }
        $this->success('保存成功！');
    }

    public function changepwdDo(){
        if (!IS_POST) {E('请求页面不在');}
        $oldpassword = trim(I('post.oldpassword'));
        $password = trim(I('post.password'));
        $cpassword = trim(I('post.cpassword'));
        $user = M('user');

        if (empty($oldpassword)) {$this->error('原密码不能为空');}
        if (empty($password)) {$this->error('新密码不能为空');}
        if (empty($cpassword)) {$this->error('确认密码不能为空');}
        if ($password !== $cpassword) {
            $this->error('两次新密码输入不一致！');
        }
        $rs = $user->where(array('id'=>session('UserId')))->find();
        if ($rs['password'] !== md5($oldpassword)) {
            $this->error('原密码输入有误！');
        }
        $data['password'] = md5($password);
        if ($user->where(array('id'=>session('UserId')))->save($data) === false) {
            $this->error('操作失败！');
        }
        $this->success('恭喜，密码修改成功！');

    }

    public function teamDo(){
        if (!IS_POST) {E('请求页面不在');}
        $uid = trim(I('post.uid'));
        if (empty($uid)) {
            $this->error('请求有误！');
        }
        set_time_limit(100);
        $this->success($this->dis_Parent($uid));
    }

    # 注册新会员
    public function dis_thistree_blank( $parent_id, $parent_where ){
        $blank = '<li title="注册新会员"><a class="blank" href="'.U('user/reg',array('ParentId'=>$parent_id,'ParentWhere'=>$parent_where)).'"><span>注册会员</span></a></li>';
        return $blank;
    }
    # 当前账户
    public function dis_thistree($see_num){
        $user = M('user');
        $see_num = is_null($see_num) ? session('UserId') : $see_num;
        $rs = $user->where(array('id'=>$see_num))->find();
        $isUp = $rs['upgrade'];
        switch ($rs['status']) {
            case 0:
                $status_class = 'status-0';
                break;
            case 1:
                switch ($rs['rank']) {
                    case 0:
                        $status_class = $isUp ? 'user-type-up' : 'user-type-1';
                        break;
                    case 1:
                        $status_class = $isUp ? 'user-type-up' : 'user-type-2';
                        break;
                    case 2:
                        $status_class = $isUp ? 'user-type-up' : 'user-type-3';
                        break;
                }
                break;
            case 3: #超时升级
                $status_class = 'status-2';
                break;
        }

        $dis_thistree = '<a class="'.$status_class.'" href="javascript:;" data-id="'.$see_num.'" onclick="show_sun('.$see_num.')" title="会员账号：'.$rs['username'].'
会员状态：'.getUserStatus($rs['status']).'
会员级别：'.getRank($rs['rank']).'
会员点位：'.userAreaArr($rs['parent_where']).'
注册时间：'.date("Y-m-d H:i",$rs['addtime']).'
        "><span>'.$rs['username'].'</span></a>';
        return $dis_thistree;
    }
    # 显示下级
    function dis_Parent($tree_num,$tree_type){
        $user = M('user');
        $tree_type = is_numeric($tree_type) ? $tree_type : C('treeType');
        $tree_num = 0+$tree_num;
        $find['status'] = array('in',array(0,1,3));
        $find['parentid'] = array('eq',$tree_num);
        $rs = $user->where($find)->order('parent_where asc')->select();
        $rs2 = $user->where(array('id'=>$tree_num))->find();

        $loop_i = 1;
        $dis_Parent = '<ul>';
        $total = count($rs);
        if ($total) {
            if ($total === 1) {
                $rsID = $rs[0];
                if ($rs2['left']) {
                    $dis_Parent .= '<li>'.$this->dis_thistree($rsID['id']).'<span  id="cur_id_'.$rsID['id'].'"></span></li>';
                    for ($i=$loop_i+1; $i < $tree_type+1; $i++) { 
                        $dis_Parent .= $this->dis_thistree_blank($tree_num,$i);
                    }
                }else if ($rs2['right']) {
                    for ($i=$loop_i; $i < $tree_type; $i++) { 
                        $dis_Parent .= $this->dis_thistree_blank($tree_num,$i);
                    }
                    $dis_Parent .= '<li>'.$this->dis_thistree($rsID['id']).'<span  id="cur_id_'.$rsID['id'].'"></span></li>';
                }
            }else if ($total === $tree_type) {
                foreach ($rs as $key => $val) {
                    $dis_Parent .= '<li>'.$this->dis_thistree($val['id']).'<span  id="cur_id_'.$val['id'].'"></span></li>';
                }
            }
        }else{
            for ($v=$loop_i; $v < $tree_type+1; $v++) {
                $dis_Parent .= $this->dis_thistree_blank($tree_num,$v);
            }
        }
        $dis_Parent = $dis_Parent.'</ul>';
        return $dis_Parent;

        
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