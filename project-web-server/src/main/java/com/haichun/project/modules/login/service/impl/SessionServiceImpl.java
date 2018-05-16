package com.haichun.project.modules.login.service.impl;

import com.haichun.project.modules.login.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.session.Session;
import org.springframework.session.SessionRepository;
import org.springframework.util.Assert;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

/*
 * 文件名：SessionServiceImpl
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 17:13 .
 */
public class SessionServiceImpl implements SessionService {
    @Autowired
    @Lazy
    private SessionRepository sessionRepository;

    public SessionServiceImpl() {
    }

    public String getSessionId() {
        return this.getCurrentRequestAttributes().getSessionId();
    }

    public <T> void setAttribute(String key, T attr) {
        Session session = this.getCurrentSession();
        if(session != null) {
            session.setAttribute(key, attr);
            this.sessionRepository.save(session);
        }

    }

    public <T> T getAttribute(String key) {
        Session session = this.getCurrentSession();
        return session != null?session.getAttribute(key):null;
    }

    public void removeAttribute(String key) {
        Session session = this.getCurrentSession();
        if(session != null) {
            session.removeAttribute(key);
            this.sessionRepository.save(session);
        }

    }

    public void delete() {
        this.sessionRepository.delete(this.getSessionId());
    }

    public <T> T getSession(String key) {
        Session session = this.getCurrentSession();
        if(session != null) {
            return session.getAttribute(key);
        } else {

            System.out.println("SessionTimeOutExceptionRest");
            return null;
            //throw new SessionTimeOutExceptionRest();
        }
    }

    private Session getCurrentSession() {
        return this.sessionRepository.getSession(this.getSessionId());
    }

    private RequestAttributes getCurrentRequestAttributes() {
        RequestAttributes attributes = RequestContextHolder.currentRequestAttributes();
        Assert.notNull(attributes, "RequestAttributes must not be null");
        return attributes;
    }
}
