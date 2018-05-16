package com.haichun.project.modules.login.controller;

import com.haichun.project.constant.LoginConstants;
import com.haichun.project.modules.login.dto.LoginDTO;
import com.haichun.project.modules.login.dto.SessionDTO;
import com.haichun.project.modules.login.exception.InvalidCaptchaExceptionRest;
import com.haichun.project.modules.login.service.CaptchaService;
import com.haichun.project.modules.login.service.LoginService;
import com.haichun.project.utils.MD5Utils;
import com.haichun.project.utils.RandomValidateCodeUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * 文件名：LoginController.java
 * 描述：〈登录〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/15 23:44
 */
@Slf4j
@RestController
@RequestMapping("/api/login")
@Api(value = "登录服务", description = "登录服务")
public class LoginController {


    @Autowired
    private CaptchaService captchaService;

    @Autowired
    private LoginService loginService;


    /**
     * 普通登录
     *
     * @param login
     * @return
     */
    @RequestMapping(value = "/commonLogin", method = RequestMethod.POST)
    @ApiOperation(value = "用户登录", notes = "用户登录")
    public SessionDTO commonLogin(@RequestBody LoginDTO login) {
       if (captchaService.validate(login.getCaptcha())) {
            SessionDTO sessionDTO = loginService.login(login.getLoginName(), MD5Utils.encrypt(login.getPassword()));

            return sessionDTO;
        } else {
            throw new InvalidCaptchaExceptionRest();
        }
    }

    /**
     * 退出登录
     *
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ApiOperation(value = "退出登录", notes = "退出登录")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
       /* Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        sessionService.removeAttribute(LoginConstants.CURRENT_USER_KEY);*/
        return "login";
    }


    @RequestMapping(value = "/getLoginImageCode", method = RequestMethod.GET)
    @ApiOperation(value = "验证码生成", notes = "验证码生成")
    public void getLoginImageCode(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("image/jpeg");//设置响应类型，告知浏览器输出的是图片
        response.setHeader("Pragma", "No-cache");//设置响应头信息，告诉浏览器不要缓存此内容
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Set-Cookie", "name=value; HttpOnly");//设置HttpOnly属性,防止Xss攻击
        response.setDateHeader("Expire", 0);
        RandomValidateCodeUtil randomValidateCode = new RandomValidateCodeUtil();
        try {
            randomValidateCode.getRandomCode(request, response, LoginConstants.CAPTCHA_SESSION_KEY);//生成图片并通过response输出
        }
        catch (Exception e) {
            log.error(e.getMessage());
            throw new InvalidCaptchaExceptionRest();
        }
    }
}
