<?php
namespace Home\Controller;
use Think\Controller;
class AdminController extends CommandController {

    public function edit(){
        $rs = M('admin')->where(array('id' => session('AdminId')))->find();
        $this->assign('rs',$rs);
        $this->display();
    }
    public function editDo(){
        if (!IS_POST) {E('请求页面不在');}
        $oldpassword = trim(I('post.oldpassword'));
        $password = trim(I('post.password'));
        $cpassword = trim(I('post.cpassword'));
        $user = M('admin');

        if (empty($oldpassword)) {$this->error('原密码不能为空');}
        if (empty($password)) {$this->error('新密码不能为空');}
        if (empty($cpassword)) {$this->error('确认密码不能为空');}
        if ($password !== $cpassword) {
            $this->error('两次新密码输入不一致！');
        }
        $rs = $user->where(array('id'=>session('AdminId')))->find();
        if ($rs['password'] !== md5($oldpassword)) {
            $this->error('原密码输入有误！');
        }
        $data['password'] = md5($password);
        if ($user->where(array('id'=>session('AdminId')))->save($data) === false) {
            $this->error('操作失败！');
        }
        $this->success('恭喜，密码修改成功！');
    }
}
