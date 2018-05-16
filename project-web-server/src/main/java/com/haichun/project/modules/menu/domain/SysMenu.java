package com.haichun.project.modules.menu.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/*
 * 文件名：SysMenu.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 22:25
 */
@Data
@Entity
@Table(name = "ky_menu")
public class SysMenu implements Serializable{
	
	private static final long serialVersionUID = -6676205725835460722L;

	/**
	 * 唯一标识
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;

	/**
	 * 菜单名称
	 */
	@Column(name = "name")
    private String name;

    /**
	 * 父菜单id
	 */
	@Column(name = "parentId")
    private Long parentId;

    /**
	 * 菜单位置序号
	 */
	@Column(name = "orderNo")
    private Integer orderNo;

    /**
	 * 路径
	 */
	@Column(name = "path")
    private String path;
    
    /**
	 * 图标
	 */
	@Column(name = "icon")
    private String icon;

    /**
	 * 类型 ：  1、菜单  2、按钮
	 */
	@Column(name = "type")
    private String type;

    /**
	 * 描述
	 */
	@Column(name = "description")
    private String description;

    /**
	 * 创建时间
	 */
	@Column(name = "create_date")
    private Date createDate;

}