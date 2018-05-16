package com.haichun.project.modules.login.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * 文件名：SessionDTO.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/15 23:48
 */
@ApiModel("会话DTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionDTO {

	@ApiModelProperty("凭证")
	String token;

	@ApiModelProperty("用户")
	LoginUserProfileDTO loginUserProfileDTO;


}
