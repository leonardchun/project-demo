package com.haichun.project.modules.menu.service.impl;

import com.haichun.project.modules.menu.domain.SysMenu;
import com.haichun.project.modules.menu.dto.MenuTreeDTO;
import com.haichun.project.modules.menu.repository.MenuRepository;
import com.haichun.project.modules.menu.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/*
 * 文件名：MenuServiceImpl
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 23:39 .
 */
@Slf4j
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public List<MenuTreeDTO> findMenusList() {
        List<MenuTreeDTO> menuTreeDTOs = new ArrayList<MenuTreeDTO>();
        List<SysMenu> sysMenuList = this.menuRepository.findMenuByParentIdAndType(0l, "MENU");
        for (SysMenu sysMenu : sysMenuList) {
            MenuTreeDTO menuTreeDTO = new MenuTreeDTO();
            BeanUtils.copyProperties(sysMenu, menuTreeDTO);
            //查找子菜单
            List<SysMenu> childSysMenuList = this.menuRepository.findMenuByParentIdAndType(sysMenu.getId(), "MENU");
            List<MenuTreeDTO> childMenuTreeList = new ArrayList<MenuTreeDTO>();
            for (SysMenu childSysMenu : childSysMenuList) {
                MenuTreeDTO childMenuTreeDTO = new MenuTreeDTO();
                BeanUtils.copyProperties(childSysMenu, childMenuTreeDTO);
                childMenuTreeList.add(childMenuTreeDTO);
            }
            menuTreeDTO.setChildren(childMenuTreeList);
            menuTreeDTOs.add(menuTreeDTO);
        }
        return menuTreeDTOs;
    }

    @Override
    public Page<SysMenu> findMenusPage(String menuName,Pageable pageable) {
        return this.menuRepository.findAll(pageable);
    }
}
