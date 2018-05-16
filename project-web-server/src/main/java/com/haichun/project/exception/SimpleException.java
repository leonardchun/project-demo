package com.haichun.project.exception;

/*
 * 文件名：SimpleException.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/17 23:22
 */
public class SimpleException extends ApiException {

	private final String message;

	public SimpleException(String message) {
		this.message = message;
	}

	@Override
	public String getErrorCode() {
		return null;
	}

	@Override
	protected String getCustomMessage() {
		return message;
	}
}
