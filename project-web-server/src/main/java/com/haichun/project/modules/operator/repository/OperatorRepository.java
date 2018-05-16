package com.haichun.project.modules.operator.repository;


import com.haichun.project.modules.operator.domain.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

/*
 * 文件名：UserRepository
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：〈操作员仓库〉
 * 创建人： wanghaichun
 * 创建时间：2017-08-18 01:19 PM
 */
public interface OperatorRepository extends JpaRepository<Operator, Long> {

    /**
     * 通登录名查询用户信息
     *
     * @param loginName
     * @return
     */
    Operator findOperatorByLoginName(String loginName);

}
