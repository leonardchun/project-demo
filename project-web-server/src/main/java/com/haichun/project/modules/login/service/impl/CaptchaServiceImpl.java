package com.haichun.project.modules.login.service.impl;

import com.haichun.project.constant.LoginConstants;
import com.haichun.project.modules.login.service.CaptchaService;
import com.haichun.project.modules.login.service.SessionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/*
 * 文件名：CaptchaServiceImpl.java
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：验证码验证
 * 创建人： wanghaichun
 * 创建时间：2016/12/14 12:47 PM
 */
@Slf4j
@Service
public class CaptchaServiceImpl implements CaptchaService {
    @Autowired
    private SessionService sessionService;

    @Override
    public boolean validate(String captcha) {
        String oldCaptcha = sessionService.getAttribute(LoginConstants.CAPTCHA_SESSION_KEY);
        System.out.println("***********获取SESSION中的验证码为：" + oldCaptcha + "*************");
        if (oldCaptcha==null){
            return false;
        }
        return StringUtils.equalsIgnoreCase(captcha, oldCaptcha);
    }
}
