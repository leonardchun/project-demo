package com.haichun.project.modules.menu.service;

import com.haichun.project.modules.menu.domain.SysMenu;
import com.haichun.project.modules.menu.dto.MenuTreeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/*
 * 文件名：MenuService
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 23:39 .
 */
public interface MenuService {

    List<MenuTreeDTO> findMenusList();

    Page<SysMenu> findMenusPage(String menuName,Pageable pageable);
}
