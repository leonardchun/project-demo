package com.haichun.project.modules.login.service;

/*
 * 文件名：SessionService
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 17:12 .
 */
public interface SessionService {

    String getSessionId();

    <T> void setAttribute(String var1, T var2);

    <T> T getAttribute(String var1);

    void removeAttribute(String var1);

    void delete();

    <T> T getSession(String var1);
}
