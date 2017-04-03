/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : packet

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-03-22 23:45:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for pk_admin
-- ----------------------------
DROP TABLE IF EXISTS `pk_admin`;
CREATE TABLE `pk_admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `nicename` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `addtime` int(10) DEFAULT NULL,
  `lasttime` int(10) DEFAULT NULL,
  `logintime` int(10) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL COMMENT '当前IP',
  `lastip` varchar(20) DEFAULT NULL COMMENT '上次IP',
  `isstop` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pk_admin
-- ----------------------------
INSERT INTO `pk_admin` VALUES ('1', 'admin', null, '7fef6171469e80d32c0559f88b377245', null, '1488114037', '1489223271', '127.0.0.1', '127.0.0.1', null);

-- ----------------------------
-- Table structure for pk_config
-- ----------------------------
DROP TABLE IF EXISTS `pk_config`;
CREATE TABLE `pk_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `webname` varchar(255) DEFAULT NULL COMMENT '网址名称',
  `domain` varchar(255) DEFAULT NULL COMMENT '域名',
  `rankarr` text COMMENT '会员级别设置',
  `ldarr` varchar(255) DEFAULT NULL,
  `fee` double(12,2) DEFAULT NULL COMMENT '服务费',
  `offerprice` varchar(255) DEFAULT NULL COMMENT '报单金额',
  `updateprice` varchar(255) DEFAULT NULL COMMENT '升级金额',
  `realname` varchar(255) DEFAULT NULL COMMENT '开户人信息',
  `bindphone` varchar(11) DEFAULT NULL COMMENT '绑定手机号',
  `cardno` varchar(255) DEFAULT NULL COMMENT '银行卡号',
  `bankaddress` varchar(255) DEFAULT NULL COMMENT '开户行地址',
  `banktype` tinyint(2) DEFAULT '1' COMMENT '银行卡类型(1，中国农业银行)',
  `addtime` int(10) DEFAULT NULL COMMENT '银行卡修改时间',
  `isclose` tinyint(2) DEFAULT '0' COMMENT '关闭网站（0,打开；1,闭关）',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pk_config
-- ----------------------------
INSERT INTO `pk_config` VALUES ('1', '前程ABC/FUTURE-ABC', 'www.FUTURE-ABC.com', 'A级会员,B级会员,C级会员', 'A级会员:2:10:24,B级会员:2-4-6-8:2-2-2-4:72,C级会员:4-6-8-10:2-2-2-4:72', '80.00', '2000-10000-20000-50000', '1000-5000-10000-50000', '平台银行卡', '13007120000', '66666', '北京市延庆区军都山关沟古道北口', '1', '1489500349', '0');

-- ----------------------------
-- Table structure for pk_message
-- ----------------------------
DROP TABLE IF EXISTS `pk_message`;
CREATE TABLE `pk_message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) DEFAULT NULL COMMENT '接收信息方id',
  `tgid` int(10) DEFAULT NULL COMMENT '付款订单ID',
  `username` varchar(255) DEFAULT NULL COMMENT '接收信息方账号',
  `type` tinyint(2) DEFAULT NULL COMMENT '类型（0,平台TO会员）',
  `message` text COMMENT '信息内容',
  `status` tinyint(2) DEFAULT '0',
  `addtime` int(10) DEFAULT NULL COMMENT '时间',
  `expiretime` int(10) DEFAULT NULL COMMENT '过期时间',
  `comfirmtime` int(10) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `price` double(10,2) DEFAULT '0.00',
  `price1` double(10,2) DEFAULT '0.00',
  `price2` double(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pk_message
-- ----------------------------

-- ----------------------------
-- Table structure for pk_ppmx
-- ----------------------------
DROP TABLE IF EXISTS `pk_ppmx`;
CREATE TABLE `pk_ppmx` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tgno` varchar(20) DEFAULT NULL,
  `tgid` int(10) DEFAULT NULL COMMENT '付款ID',
  `tguid` int(10) DEFAULT NULL,
  `tguser` varchar(20) DEFAULT NULL,
  `xyuid` int(10) DEFAULT NULL COMMENT '收款方(0,表示平台)',
  `xyuser` varchar(20) DEFAULT NULL,
  `price` double(12,2) DEFAULT '0.00' COMMENT '收款金额',
  `price1` double(12,2) DEFAULT NULL,
  `price2` double(12,2) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '0',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `addtime` int(10) DEFAULT NULL COMMENT '生成时间',
  `expiretime` int(10) DEFAULT NULL COMMENT '过期时间',
  `comfirmtime` int(10) DEFAULT NULL COMMENT '确认收款时间',
  `xycardno` varchar(255) DEFAULT NULL COMMENT '收款人-银行卡',
  `xycarduser` varchar(255) DEFAULT NULL COMMENT '收款人-银行卡开户姓名',
  `xybankaddress` varchar(255) DEFAULT NULL COMMENT '收款人-银行卡地址',
  `xycardphone` varchar(11) DEFAULT NULL COMMENT '收款人-银行卡绑定电话',
  `xybanktype` varchar(255) DEFAULT NULL COMMENT '银行卡类型',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pk_ppmx
-- ----------------------------

-- ----------------------------
-- Table structure for pk_tgmx
-- ----------------------------
DROP TABLE IF EXISTS `pk_tgmx`;
CREATE TABLE `pk_tgmx` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) DEFAULT NULL COMMENT '提供人ID',
  `username` varchar(255) DEFAULT NULL,
  `no` varchar(20) DEFAULT NULL COMMENT '订单号',
  `price` double(12,2) DEFAULT '0.00' COMMENT '付款总金额（price1 + price2）',
  `price1` double(12,2) DEFAULT '0.00' COMMENT '实付金额（price - price2）',
  `price2` double(12,2) DEFAULT '0.00' COMMENT '未付金额(price - price1)',
  `status` tinyint(2) DEFAULT '0' COMMENT '付款状态（0,等待付款；1,完成付款；2,付款失败）',
  `remark` varchar(255) DEFAULT NULL,
  `type` tinyint(2) DEFAULT '0' COMMENT '0-激活订单；1-升级订单',
  `addtime` int(10) DEFAULT NULL COMMENT '订单生成时间',
  `comfirmtime` int(10) DEFAULT NULL COMMENT '完成时间',
  `expiretime` int(10) DEFAULT NULL COMMENT '订单过期时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pk_tgmx
-- ----------------------------

-- ----------------------------
-- Table structure for pk_user
-- ----------------------------
DROP TABLE IF EXISTS `pk_user`;
CREATE TABLE `pk_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  `realname` varchar(20) DEFAULT NULL COMMENT '开户人姓名',
  `banktype` varchar(255) DEFAULT NULL COMMENT '银行卡类型',
  `cardno` varchar(255) DEFAULT NULL COMMENT '银行卡',
  `bankaddress` varchar(255) DEFAULT NULL COMMENT '银行卡地址',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `rank` tinyint(2) unsigned DEFAULT '0' COMMENT '级别',
  `status` tinyint(2) DEFAULT '0' COMMENT '账号状态（0,未激活；1,已激活；2,激活失败;3,超时升级）',
  `addtime` int(10) DEFAULT NULL COMMENT '生成时间',
  `logintime` int(10) DEFAULT NULL COMMENT '登录时间',
  `lasttime` int(10) DEFAULT NULL COMMENT '上次登录时间',
  `jhtime` int(10) DEFAULT NULL COMMENT '激活时间',
  `expiretime` int(10) DEFAULT NULL COMMENT '过期时间',
  `ip` varchar(20) DEFAULT NULL COMMENT '登录IP',
  `lastip` varchar(20) DEFAULT NULL COMMENT '上次登录IP',
  `tjid` int(10) DEFAULT '0' COMMENT '推荐人id',
  `tjuser` varchar(20) DEFAULT NULL COMMENT '推荐人账号',
  `tjnum` int(10) unsigned DEFAULT '0' COMMENT '我推荐的总人数',
  `parentid` int(10) unsigned DEFAULT '0' COMMENT '位置（接点人ID）',
  `parentuser` varchar(255) DEFAULT NULL,
  `parent_where` tinyint(2) DEFAULT NULL COMMENT '点位（1,左；2,右）',
  `floor` int(10) DEFAULT NULL COMMENT '层数',
  `left` int(11) DEFAULT NULL COMMENT '左区ID',
  `right` int(11) DEFAULT NULL COMMENT '右区ID',
  `ldstr` varchar(255) DEFAULT NULL COMMENT '领导',
  `substatus` tinyint(2) DEFAULT '0' COMMENT '下级会员激活状态（0,未激活；1,一个激活；2,两激活）',
  `upgrade` tinyint(2) unsigned DEFAULT '0' COMMENT '更新（0,正常；1,正在更新中）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pk_user
-- ----------------------------
INSERT INTO `pk_user` VALUES ('1', 'A000001', 'e10adc3949ba59abbe56e057f20f883e', 'A000001', '1', '00000000000000001', 'A000001开户行地址', '', '0', '1', null, null, null, null, null, null, null, '0', null, '1', '0', null, null, null, null, null, null, '0', '0');
