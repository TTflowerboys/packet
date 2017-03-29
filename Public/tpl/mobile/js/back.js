mui.init();
var first = null;
mui.back = function() {
    if (showMenu) {
        //TOTO 主界面的返回家以后再做处理
        //closeMenu();
    } else {
        //首次按键，提示‘再按一次退出应用’
        if (!first) {
            first = new Date().getTime();
            mui.toast('再按一次退出应用');
            setTimeout(function() {
                first = null;
            }, 1000);
        } else {
            if (new Date().getTime() - first < 1000) {
                plus.runtime.quit();
            }
        }
    }
};
