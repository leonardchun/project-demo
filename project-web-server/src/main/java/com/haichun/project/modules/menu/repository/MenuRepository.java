package com.haichun.project.modules.menu.repository;


import com.haichun.project.modules.menu.domain.SysMenu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
 * 文件名：MenuRepository.java
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 23:38
 */
public interface MenuRepository extends JpaRepository<SysMenu, Long> {

    /**
     * 通过菜单类型查找菜单
     * @param type
     * @return
     */
    List<SysMenu> findMenuByType(String type);

    /**
     * 通过父ID和菜单类型查找子集
     * @param pId
     * @param type
     * @return
     */
    List<SysMenu> findMenuByParentIdAndType(Long pId, String type);

  /*  @Query("select t.name from ky_menu t  where t.name=?1")
    Page<SysMenu> findMenusPage(String menuName, Pageable pageable);*/

    /**
     *
     * @param pageable
     * @return
     */
   /* @Query(value="select t.* from ky_menu t ",nativeQuery=true)
    Page<SysMenu> findMenusPage(Pageable pageable);*/

}
