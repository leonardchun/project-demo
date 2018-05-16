package com.haichun.project.modules.login.service;

import com.haichun.project.modules.login.dto.SessionDTO;

/*
 * 文件名：LoginService.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/15 23:46
 */
public interface LoginService {
	/**
	 * 登录验证
	 * @param loginName 用戶名
	 * @param password 密碼
	 * @return
	 */
	SessionDTO login(String loginName, String password);
}
