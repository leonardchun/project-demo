package com.haichun.project.modules.role.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/*
 * 文件名：SysRoles.java
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：
 * 创建人： 
 * 创建时间：
 */
@Entity
@Table(name = "ky_role")
@Data
public class Roles implements Serializable {

    private static final long serialVersionUID = -7023049238047727379L;

    /**
     * 唯一标识
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    /**
     * 角色名称
     */
    @Column(name = "name")
    private String name;

    /**
     * 描述
     */
    @Column(name = "description")
    private String description;

    /**
     * 状态
     */
    @Column(name = "state")
    private String state;

    /**
     * 创建时间
     */
    @Column(name = "create_date")
    private Date createDate;


}

