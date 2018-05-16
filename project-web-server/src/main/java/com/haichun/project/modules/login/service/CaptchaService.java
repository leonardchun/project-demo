package com.haichun.project.modules.login.service;

/**
 * 验证码服务.
 *
 * @author stormning on 2016/11/7.
 */
public interface CaptchaService {

	/**
	 * 验证码校验
	 *
	 * @param captcha
	 * @return
	 */
	boolean validate(String captcha);
}
