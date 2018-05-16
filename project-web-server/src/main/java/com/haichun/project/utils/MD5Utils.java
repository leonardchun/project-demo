package com.haichun.project.utils;


import org.apache.commons.codec.digest.DigestUtils;

/*
 * 文件名：MD5Utils.java
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述： MD5加解密工具类
 * 创建人： wanghaichun
 * 创建时间：2016/12/13 07:27 PM
 */
public class MD5Utils {
    public static String encrypt(String text) {
        return DigestUtils.md5Hex(text);
    }
}
