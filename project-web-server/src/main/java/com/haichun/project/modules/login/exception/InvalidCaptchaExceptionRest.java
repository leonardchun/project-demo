package com.haichun.project.modules.login.exception;

import com.haichun.project.exception.ApiException;

/*
 * 文件名：InvalidCaptchaException.java
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：验证码异常类
 * 创建人： wanghaichun
 * 创建时间：2016/12/14 01:22 PM
 */
public class InvalidCaptchaExceptionRest extends ApiException {

	@Override
	public String getErrorCode() {
		return "10002";
	}
}
