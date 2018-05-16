package com.haichun.project;

import com.haichun.project.modules.login.service.SessionService;
import com.haichun.project.modules.login.service.impl.CookieHeaderHttpSessionStrategy;
import com.haichun.project.modules.login.service.impl.SessionServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.http.HttpSessionStrategy;

/*
 * 文件名：SessionConfig
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/15 1:12 .
 */
@Configuration
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 30*1)
public class SessionConfig {

    public SessionConfig() {
    }

    @Bean
    public HttpSessionStrategy httpSessionStrategy() {
        return new CookieHeaderHttpSessionStrategy();
    }

    @Bean
    public SessionService sessionService() {
        return new SessionServiceImpl();
    }
}
