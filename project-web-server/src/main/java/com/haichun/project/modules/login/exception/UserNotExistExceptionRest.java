package com.haichun.project.modules.login.exception;

/*
 * 文件名：UserNotExistException.java
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：用户不存在异常类
 * 创建人： wanghaichun
 * 创建时间：2016/12/14 01:23 PM
 */

import com.haichun.project.exception.ApiException;

public class UserNotExistExceptionRest extends ApiException {
	@Override
	public String getErrorCode() {
		return "10001";
	}
}
