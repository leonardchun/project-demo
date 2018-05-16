package com.haichun.project;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

/*
 * 文件名：WebSecurityConfig
 * 描述：〈WebSecurity 权限配置类 〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/15 1:09 .
 */
@Configuration
@EnableRedisHttpSession(
        redisNamespace = "${spring.application.name:}",
        maxInactiveIntervalInSeconds = 1800
)
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true
)
@EnableWebSecurity
@EnableConfigurationProperties({WebProperties.class})
public class WebSecurityConfig extends WebSecurityConfigurerAdapter  implements InitializingBean {

    @Autowired
    private WebProperties webProperties;
    @Autowired(
            required = false
    )
    private UserDetailsService userDetailsService;
    private String[] excludeUrls;
    private boolean permitAll = true;

    public WebSecurityConfig() {
    }

    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        if(this.userDetailsService != null) {
            auth.userDetailsService(this.userDetailsService);
        }

    }

    protected void configure(HttpSecurity http) throws Exception {
        ExpressionUrlAuthorizationConfigurer.ExpressionInterceptUrlRegistry registry = http.authorizeRequests();
        if(this.permitAll) {
            ((ExpressionUrlAuthorizationConfigurer.AuthorizedUrl)registry.anyRequest()).permitAll();
        } else {
            ((ExpressionUrlAuthorizationConfigurer.AuthorizedUrl)registry.anyRequest()).authenticated();
        }

        ((HttpSecurity)registry.and()).csrf().disable();
        http.headers().frameOptions().disable();
    }

    public void configure(WebSecurity web) throws Exception {
        if(this.excludeUrls != null && this.excludeUrls.length > 0) {
            web.ignoring().antMatchers(this.excludeUrls);
        }

    }

    public void afterPropertiesSet() throws Exception {
        this.excludeUrls = this.webProperties.getAuthenticated().getExcludeUrls();
        this.permitAll = this.excludeUrls == null || this.excludeUrls.length == 0;
    }
}
