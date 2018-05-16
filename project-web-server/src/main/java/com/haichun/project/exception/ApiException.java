package com.haichun.project.exception;

import org.springframework.core.ErrorCoded;

/*
 * 文件名：ApiException.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/17 23:42
 */
public abstract class ApiException extends RuntimeException implements ErrorCoded {

	public static final String DEFAULT_ERROR_CODE = "serverEx";

	private Object[] args;

	public ApiException(Object... args) {
		this.args = args;
	}

	public Object[] getArgs() {
		return args;
	}

	@Override
	public String getMessage() {
		String customMessage = getCustomMessage();
		return customMessage == null ? super.getMessage() : customMessage;
	}

	protected String getCustomMessage() {
		return null;
	}
}
