<?php
namespace Home\Controller;
use Think\Controller;
class SysController extends CommandController {

    public function index(){
        $rsRank=explode(',', C("config.ldarr"));
        foreach ($rsRank as $key => $value) {
            $a=explode(":",  $value);
            $rsRank[$key]=$a;
        }
        $this->assign('updateprice',explode('-', C('config.updateprice')));
        $this->assign('offerprice',explode('-', C('config.offerprice')));
        
        $this->assign('rank',$rsRank);
        $this->assign('rs',C("config"));
        $this->assign('banktype',C('config.banktype'));
        $this->display();
    }

    /*public function bank(){
        $bank = M('bank');
        # 分页
        $listcount = $bank->field('id')->count();
        $Page = new \Think\Page($listcount, 20);
        $list = $bank->order('id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('page', $Page->show());

        $rs = $bank->where(array('usertype'=>1))->order('isdefault DESC')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list',$rs);

        $this->display();
    }

    public function bankedit(){
        $id = trim(I('get.id'));
        if (!is_numeric($id)) { $this->error('操作有误！'); }
        $bank = M('bank');
        $rs = $bank->where(array('id'=>$id))->find();
        if (!$rs) { $this->error('操作有误！'); }
        $this->assign('rs',$rs);
        $this->display();
    }*/

    public function saveDo(){
        //A级会员:1:1000:24:,B级会员:2-4-6-8:150-200-250-400:72,C级会员:4-6-8-10:150-200-250-400:72
        if( !IS_POST ) {E('页面不存在！');}
        # 平台银行卡
        $realname = trim(I('post.realname'));
        $bindphone = trim(I('post.bindphone'));
        $banktype = trim(I('post.banktype'));
        $cardno = trim(I('post.cardno'));
        $bankaddress = trim(I('post.bankaddress'));
        if (!empty($bindphone) && !check_mobile($bindphone)) { $this->error('手机号输入不正确！'); }
        if (!empty($banktype) && !is_numeric($banktype)) { $this->error('请正确选择银行卡类型！'); }
        $data['realname'] = $realname;
        $data['bindphone'] = $bindphone;
        $data['banktype'] = $banktype;
        $data['cardno'] = $cardno;
        $data['bankaddress'] = $bankaddress;
        $data['addtime'] = time();

        # 系统设置
        $webname = trim(I('post.webname'));
        $domain = trim(I('post.domain'));
        $isclose = trim(I('post.isclose'));
        $fee = trim(I("post.fee"));
        $rankTypeArr=I("post.rankTypeArr");
        $ldLevelArr =I("post.ldLevelArr");
        $jjPriceArr =I("post.jjPriceArr");
        $upHourArr  =I("post.upHourArr");

        $ldarr="";
        $rankarr="";
        if(is_array($rankTypeArr)){
            foreach ($rankTypeArr as $key => $value) {
                $a=$value.":".$ldLevelArr[$key].":".$jjPriceArr[$key].":".$upHourArr[$key];
                if($ldarr==''){
                    $ldarr=$a;
                    $rankarr=$value;
                }else{
                    $ldarr=$ldarr.','.$a;
                    $rankarr=$rankarr.','.$value;
                }             
            }
        }        

        $offerpriceArr = I('post.offerprice');
        $updatepriceArr = I('post.updateprice');
        if(is_array($offerpriceArr)){
            $data['offerprice'] = implode('-',$offerpriceArr);
        }
        if(is_array($updatepriceArr)){
            $data['updateprice'] = implode('-',$updatepriceArr);
        }
        $data['webname'] = $webname;
        $data['domain']  = $domain;
        $data['isclose'] = $isclose;
        $data['fee'] = $fee;
        $data['ldarr']=$ldarr;
        $data['rankarr']=$rankarr;
        $rs=M("config")->where(array("id"=>1))->save($data);
        if ($rs) { $this->success("保存成功！"); }
    }

    /*public function bankAddDo(){
        if( !IS_POST ) {E('页面不存在！');}
        $realname = trim(I('post.realname'));
        $bindphone = trim(I('post.bindphone'));
        $banktype = trim(I('post.banktype'));
        $cardno = trim(I('post.cardno'));
        $bankaddress = trim(I('post.bankaddress'));
        $isdefault = trim(I('post.isdefault'));

        $bank = M('bank');

        if (!empty($bindphone) && !check_mobile($bindphone)) { $this->error('手机号输入不正确！'); }

        if (empty($banktype) || !is_numeric($banktype)) { $this->error('请正确选择银行卡类型！'); }
        if (empty($cardno)) { $this->error('请填写银行卡号'); }
        if (empty($bankaddress)) { $this->error('请填写开户行地址'); }

        if (!empty($isdefault)) {
        	if (!is_numeric($isdefault)) {
        		$this->error('操作有误！');
        	}
        	if($bank->where(array('usertype'=>1,'isdefault'=>1))->find()){
        		$this->error('提示：平台只能将一张银行卡设为默认收款！');
        	}        	
        }


        $hasCard = $bank->where(array('banktype'=>$banktype,'cardno'=>$cardno))->find();
        if ($hasCard) { $this->error('银行卡已经存在！'); }

        

        $data['realname'] = $realname;
        $data['bindphone'] = $bindphone;
        $data['banktype'] = $banktype;
        $data['cardno'] = $cardno;
        $data['bankaddress'] = $bankaddress;
        $data['isdefault'] = $isdefault;
        $data['usertype'] = 1;
        $data['addtime'] = time();

        if ($bank->add($data)) {
            $this->success('银行卡添加成功！');
        }else{
            $this->error('银行卡添加失败！');
        }
    }

    public function bankDelDo(){
        $id = trim(I('get.id'));
        $bank = M('bank');
        if (!is_numeric($id)) { $this->error('操作有误！'); }
        $rs = $bank->where(array('id'=>$id))->find();
        if ($rs) {
            $rs1 = $bank->where(array('id'=>$rs['id']))->delete();
            if ($rs1) {
                $this->success('银行卡信息删除成功！');
            }else{
              $this->error('银行卡信息删除失败！');
            }
        }else{
            $this->error('请求有误！');
        }
    }

    public function bankEditDo(){
        if( !IS_POST ) {E('页面不存在！');}
        $id = trim(I('post.id'));
        $realname = trim(I('post.realname'));
        $bindphone = trim(I('post.bindphone'));
        $cardno = trim(I('post.cardno'));
        $bankaddress = trim(I('post.bankaddress'));

        $bank = M('bank');

        if (!is_numeric($id)) { $this->erro('操作有误！'); }
        if (!empty($bindphone) && !check_mobile($bindphone)) { $this->error('手机号输入不正确！'); }
        if (empty($cardno)) { $this->error('请填写银行卡号'); }
        if (empty($bankaddress)) { $this->error('请填写开户行地址'); }
        $rs = $bank->where(array('id'=>$id))->find();
        if (!$rs) { $this->error('操作有误！'); }

        $where['cardno'] = array('NEQ',$rs['cardno']);
        if ($bank->where($where)->find()) { $this->error('银行卡已经存在！'); }

        $data['id'] = $rs['id'];
        $data['realname'] = $realname;
        $data['bindphone'] = $bindphone;
        $data['cardno'] = $cardno;
        $data['bankaddress'] = $bankaddress;
        $data['addtime'] = time();
        //die($bank->_sql());
        if ($bank->save($data)) {
            $this->success('恭喜，银行卡修改成功！',U('sys/bank'));
        }else{
            $this->error('糟糕，操作失败！');
        }
    }*/
}
