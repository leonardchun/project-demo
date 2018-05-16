package com.haichun.project.modules.login.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/*
 * 文件名：LoginDTO.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/16 0:24
 */
@ApiModel("登录对象")
@Data
public class LoginDTO {

	@ApiModelProperty("登录名")
	String loginName;

	@ApiModelProperty("密码")
	String password;

	@ApiModelProperty("验证码")
	String captcha;
}
