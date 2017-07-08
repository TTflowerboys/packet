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
    public function web(){
        $this->assign('rs',C("config"));
        $this->display();
    }
    public function bank(){
        $this->assign('rs',C("config"));
        $this->display();
    }
    public function coin(){
        $rsCoin=explode(',', C("config.coin"));
        foreach ($rsCoin as $key => $value) {
            $a=explode(":",  $value);
            $rsCoin[$key]=$a;
        }

        $rsRank = explode(',', C("config.rankarr"));
        
        $this->assign('coin',$rsCoin);
        $this->assign('rank',$rsRank);
        $this->display();
    }

    public function webDo(){
        if( !IS_POST ) {E('页面不存在！');}
        $webname = trim(I('post.webname'));
        $domain = trim(I('post.domain'));
        $isclose = trim(I('post.isclose'));
        $closemsg = trim(I('post.closemsg'));
        $data['webname'] = $webname;
        $data['domain']  = $domain;
        $data['isclose'] = $isclose;
        $data['closemsg'] = $closemsg;
        $rs=M("config")->where(array("id"=>1))->save($data);
        if ($rs) { $this->success("保存成功！"); }
    }

    public function bankDo(){
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
        $rs=M("config")->where(array("id"=>1))->save($data);
        if ($rs) { $this->success("保存成功！"); }
    }

    public function saveDo(){
        //A级会员:1:1000:24:,B级会员:2-4-6-8:150-200-250-400:72,C级会员:4-6-8-10:150-200-250-400:72
        if( !IS_POST ) {E('页面不存在！');}
        # 系统设置        
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
        
        $data['fee'] = $fee;
        $data['ldarr']=$ldarr;
        $data['rankarr']=$rankarr;
        $rs=M("config")->where(array("id"=>1))->save($data);
        if ($rs) { $this->success("保存成功！"); }
    }

    public function coinDo(){
        if( !IS_POST ) {E('页面不存在！');}

        $coinTypeArr = I('post.coinTypeArr');
        $incomeArr = I('post.incomeArr');
        $payArr = I('post.payArr');

        $iconString = "";
        if(is_array($coinTypeArr)){
            foreach ($coinTypeArr as $key => $value) {
                $a=$value.":".$incomeArr[$key].":".$payArr[$key];
                if($iconString==''){
                    $iconString=$a;
                }else{
                    $iconString=$iconString.','.$a;
                }
            }
        }
        $data['coin'] = $iconString;
        $rs=M("config")->where(array("id"=>1))->save($data);
        if ($rs) { $this->success('保存成功！'); }
    }

}
