package com.haichun.project.modules.operator.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/*
 * 文件名：Operator.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/17 23:59
 */
@Data
@Entity
@Table(name = "ky_operator")
public class Operator implements Serializable{
    
	private static final long serialVersionUID = 5878346523817937032L;

	/**
	 * 唯一标识
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;

	/**
	 * 邮箱
	 */
	@Column(name = "email")
    private String email;

    /**
	 * 用户登录名
	 */
	@Column(name = "login_name")
    private String loginName;

    /**
	 * 用户昵称
	 */
	@Column(name = "display_name")
    private String displayName;

    /**
	 * 用户状态
	 */
	@Column(name = "state")
    private String state;
    
    /**
	 * 密码
	 */
	@Column(name = "password")
    private String password;

    /**
	 * cityId
	 */
	@Column(name = "city")
    private Long city;
    
    /**
	 * 所属城市名称
	 *
	 */
	@Column(name = "city_name")
    private String cityName;

    /**
	 * 创建时间
	 */
	@Column(name = "create_date")
    private Date createDate;
    
    /**
	 * 角色名称
	 */
	@Column(name = "role_name")
    private String roleName;
    
    /**
	 * 角色id
	 */
	@Column(name = "role_id")
    private Long roleId;
    
    /**
	 * 区域
	 */
	@Column(name = "area_name")
    private String areaName;

    /**
     * 父级 id
     * @return
     */
	@Column(name = "parent_id")
    private Long parentId;
}