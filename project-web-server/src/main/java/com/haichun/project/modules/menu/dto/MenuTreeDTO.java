package com.haichun.project.modules.menu.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/*
 * 文件名：SysMenu.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 22:25
 */
@Data
@ApiModel("菜单树结构")
public class MenuTreeDTO implements Serializable{
	
	private static final long serialVersionUID = -6676205725835460722L;

	@ApiModelProperty("ID")
	private Long id;

	@ApiModelProperty("父菜单id")
	private Long parentId;

	@ApiModelProperty("菜单名称")
    private String name;

	@ApiModelProperty("路径")
    private String path;

	@ApiModelProperty("图标")
    private String icon;

	@ApiModelProperty("子节点")
	private List<MenuTreeDTO> children;

}