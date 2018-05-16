/*
package com.haichun.project.modules.login.security;

import com.haichun.project.modules.login.service.impl.LoginServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

*/
/*
 * 文件名：AuthenticationSuccessEventListener.java
 * 描述：〈监听登录成功〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/16 0:12
 *//*

@Component
public class AuthenticationSuccessEventListener
		implements ApplicationListener<AuthenticationSuccessEvent> {
	@Autowired
	private LoginServiceImpl loginService;

	public void onApplicationEvent(AuthenticationSuccessEvent e) {
		UserDetails userDetails = (UserDetails) e.getAuthentication().getPrincipal();
		String account = userDetails.getUsername();
		loginService.loginSucceeded(account);
	}
}*/
