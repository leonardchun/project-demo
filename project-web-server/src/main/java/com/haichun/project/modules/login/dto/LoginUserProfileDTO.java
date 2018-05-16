package com.haichun.project.modules.login.dto;

import com.haichun.project.modules.role.domain.Roles;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

/*
 * 文件名：LoginUserProfileDTO.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/15 23:48
 */
@ApiModel("用户基本信息")
@Data
public class LoginUserProfileDTO implements Serializable{
	@ApiModelProperty("主键")
	String id;

	@ApiModelProperty("登录名")
	String loginName;

	@ApiModelProperty("姓名")
	String displayName;

	@ApiModelProperty("用户")
	Integer state;

	@ApiModelProperty("角色")
	Roles roleId;
}
