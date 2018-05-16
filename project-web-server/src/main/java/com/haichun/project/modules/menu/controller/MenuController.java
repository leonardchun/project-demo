package com.haichun.project.modules.menu.controller;

import com.haichun.project.modules.menu.domain.SysMenu;
import com.haichun.project.modules.menu.dto.MenuTreeDTO;
import com.haichun.project.modules.menu.service.MenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/*
 * 文件名：MenuController
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 23:53 .
 */
@RestController
@RequestMapping("/api/home")
@Api(value = "菜单管理", description = "菜单管理")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @RequestMapping(value = "/findMenusList", method = RequestMethod.GET)
    @ApiOperation(value = "获取菜单LIST", notes = "获取菜单LIST")
    public List<MenuTreeDTO> findMenusList(){
        return this.menuService.findMenusList();
    }

    @RequestMapping(value = "/findMenusPage", method = RequestMethod.GET)
    @ApiOperation(value = "分页查询菜单", notes = "分页查询菜单")
    public Page<SysMenu> findMenusPage(String menuName ,Pageable pageable) {
        return this.menuService.findMenusPage(menuName,pageable);
    }
}
