/*
package com.haichun.project.modules.login.security;

import com.haichun.project.modules.login.service.impl.LoginServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

*/
/*
 * 文件名：AuthenticationFailureListener.java
 * 描述：〈监听登录失败〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/16 0:12
 *//*

@Component
public class AuthenticationFailureListener
		implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {
	@Autowired
	private LoginServiceImpl loginService;

	public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent e) {
		String account = e.getAuthentication().getPrincipal().toString();
		loginService.loginFailed(account);
	}
}*/
