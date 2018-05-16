package com.haichun.project.exception;

import org.springframework.core.ErrorCoded;

/*
 * 文件名：ExceptionErrorCodeProvider.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/17 23:42
 */
public interface ExceptionErrorCodeProvider extends ErrorCoded {
	boolean support(Exception e);
}
