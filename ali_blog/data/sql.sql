CREATE DATABASE IF NOT EXISTS `ali_yidb` CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `ali_yidb`;

CREATE TABLE IF NOT EXISTS `t_user`(
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
    `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
    `sex`  enum('f','m') NOT NULL DEFAULT 'm' COMMENT '性别',
    `email` varchar(32) NOT NULL DEFAULT '' COMMENT '电子邮箱',
    `password` char(32) NOT NULL DEFAULT '' COMMENT '密码',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uni_name_email` (`name`,`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8 DEFAULT CHARSET=latin1;