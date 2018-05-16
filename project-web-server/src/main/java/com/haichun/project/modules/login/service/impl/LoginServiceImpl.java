package com.haichun.project.modules.login.service.impl;


import com.google.common.collect.Lists;
import com.haichun.project.modules.login.dto.LoginUserProfileDTO;
import com.haichun.project.modules.login.dto.SessionDTO;
import com.haichun.project.modules.login.exception.UserNotExistExceptionRest;
import com.haichun.project.modules.login.service.LoginService;
import com.haichun.project.modules.operator.domain.Operator;
import com.haichun.project.modules.operator.repository.OperatorRepository;
import com.haichun.project.modules.role.domain.Roles;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/*
 * 文件名：LoginServiceImpl
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：登录处理
 * 创建人： wanghaichun
 * 创建时间：2016-12-15 06:05 PM
 */
@Slf4j
@Service
public class LoginServiceImpl implements LoginService , UserDetailsService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private OperatorRepository operatorRepository;

    @Override
    public SessionDTO login(String loginName, String password) {

        Authentication authenticationToken = new UsernamePasswordAuthenticationToken(loginName, password);

        try {

            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Operator operator = this.operatorRepository.findOperatorByLoginName(loginName);

            LoginUserProfileDTO profileDTO = new LoginUserProfileDTO();
            BeanUtils.copyProperties(operator,profileDTO);

          /*  //1、账号被禁止
            if (sysUser.getState() == -1) {
                throw new UserForbiddenExceptionRest();
            }
            //2、账号被锁定
            String ip = request.getRemoteAddr();
            ValueOperations<Object, Object> valueOper = redisTemplate.opsForValue();
            Integer loginFaileTimes = (Integer) valueOper.get(ip + sysUser.getLoginName());
            if (loginFaileTimes != null) {
                SysDictionary sysDictionary = this.sysDictionaryService.findByDictKey(LoginConstants.PASSWORD_ATTEMPT_COUNT);
                if (Integer.parseInt(sysDictionary.getValue()) <= loginFaileTimes) {
                    throw new UserLockedExceptionRest();
                } else {
                    //删除锁定的缓存
                    redisTemplate.delete(ip + sysUser.getLoginName());
                }
            }

            //3、登录成功加入Session
            sessionService.setAttribute(LoginConstants.CURRENT_USER_KEY, profileDTO);
            return new SessionDTO(sessionService.getSessionId(), profileDTO);*/
            return new SessionDTO("88888888888888888", profileDTO);
        } catch (BadCredentialsException e) {
            throw new UserNotExistExceptionRest();
        }
      /*  throw  new UserNotExistExceptionRest();*/
     /*   SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setToken("88888888888888888");
        return sessionDTO;*/
    }


    /**
     * 〈登录失败处理类〉
     *
     * @return [返回类型说明]
     * @author wanghaichun
     * @create 2016/12/30 05:21 PM
     * @since FABLE_DSSG_V1.0.0
     **/
    public void loginFailed(String userName) {
        int loginFaileTimes = 1;
        String ip = request.getRemoteAddr();
       /* if (attempts != null) {
            SysDictionary sysDictionary = this.sysDictionaryService
                    .findByDictKey(LoginConstants.PASSWORD_ATTEMPT_COUNT);
            if (sysDictionary != null && Integer.parseInt(sysDictionary.getValue()) == attempts + 1) {
                SysDictionary sysDictionaryLock = this.sysDictionaryService.findByDictKey(LoginConstants.LOCK_TIME);
                //1、key 2、值 3、失效时间 4、时间单位
                valueOper.set(ip + userName, Integer.parseInt(sysDictionary.getValue()),
                        Integer.parseInt(sysDictionaryLock.getValue()), TimeUnit.MINUTES);
                throw new UserLockedExceptionRest();
            } else if (sysDictionary != null && Integer.parseInt(sysDictionary.getValue()) < attempts + 1) {
                throw new UserLockedExceptionRest();
            }
            loginFaileTimes = attempts + 1;
        }*/

    }

    /**
     * 〈登录成功处理类〉
     *
     * @return [返回类型说明]
     * @author wanghaichun
     * @create 2016/12/30 05:22 PM
     * @since FABLE_DSSG_V1.0.0
     **/
    public void loginSucceeded(String userName) {
        String ip = request.getRemoteAddr();
        //ValueOperations<Object, Object> valueOper = redisTemplate.opsForValue();
        //删除锁定的缓存
        //redisTemplate.delete(ip + userName);
        /*valueOper.set(ip + userName, 0, 1, TimeUnit.SECONDS);*/
        //this.sessionService.removeAttribute(LoginConstants.LOGIN_FAIL_TIMES);
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Operator operator = this.operatorRepository.findOperatorByLoginName(s);
        if (operator == null) {
            throw new UsernameNotFoundException("User name not found");
        }
        Set<Roles> sysRoles = new HashSet<Roles>();
        List<GrantedAuthority> authorities = Lists.newArrayList(new SimpleGrantedAuthority("ROLE_LOGIN"));
        authorities.addAll(sysRoles.stream().map(role -> new SimpleGrantedAuthority(role.getId().toString()))
                .collect(Collectors.toList()));
        return new User(operator.getLoginName(), operator.getPassword(),
                authorities);
    }
}

