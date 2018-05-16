define(["base","app/commonApp"],function(base,common){
	//表格参数
	var grid = null;
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{ 
				url:$.path+"/api/sysroles/findSysRolesByPage",
				type:"get",
				data:function(d){
					common.gridPageFliter(d);
					return {page:d.page,size:d.size}
//					return JSON.stringify(d); 
				} 
		},
		columns:[
			{ "data": "id","sWidth":"10%"},
			{ "data": "roleName","sWidth":"15%"},
			{ "data": "des","sWidth":"25%"},
      		{ "data": "menu","sWidth":"50%"}
		],
		columnDefs:[ 
           	{"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' ccode = '' cid='"+row.roleId+"'/></div>"; 
              }, 
               "targets":0 
	        },
	        {"render":function(data,type,row,meta){
            	var menu = row.name;
            	if(menu){
                 	return "<div title='"+menu+"'>"+menu+"</div>"
            	}else{ 
            		return ''
            	}
                 
              }, 
               "targets":1 
            },
            {"render":function(data,type,row,meta){
            	var menu = row.description;
            	if(menu){
            		if(menu.length>20){
                 	return "<div title='"+menu+"'>"+menu.substr(0,20)+"...</div>"
                 }else{
                 	return "<div title='"+menu+"'>"+menu+"</div>"
                 } 
            	}else{
            		return '--'
            	}
              }, 
               "targets":2 
            },
         {"render":function(data,type,row,meta){ 
            	var menu = row.menus;
            	if(menu){
            		if(menu.length>50){
                 	return "<div title='"+menu+"'>"+menu.substr(0,40)+"...</div>"
                 }else{
                 	return "<div title='"+menu+"'>"+menu+"</div>"
                 }
            	}else{
            		return '--'
            	}
                 
              }, 
               "targets":3 
            }
        ],
        drawCallback:function(setting){ 
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        }
	}
	//画表格
	var setGrid = function(){
		grid = base.datatables({
			container:$("#role"),
			option:gridOption,
			filter:common.gridFilter
		});
	};
	//设置表格各个按钮操作
	var setGridButton = function(){
		$(".ui-grid-buttonbar .add").on("click",function(){
			gridAdd();
		});
		$(".ui-grid-buttonbar .delete").on("click",function(){
			if($(this).hasClass("disabled")){
				return;
			}else{
				gridDelete();
			}
		});
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if(!$(this).hasClass("disabled")){
				if($(this).hasClass("setting")){ //含有setting时候说明是点击的配置菜单
					gridSetting();
				}else{
					gridModify();
				}
			}
		});
//		$(".ui-grid-buttonbar .setting").on("click",function(){
//			if($(this).hasClass("disabled")){
//				return;
//			}else{
//				gridSetting();
//			}
//		})
	}
	//新建
	var gridAdd = function(){
		var modal = base.modal({
			label:"新建",
			width:600,
			height:210,
			url:"../html/systemManage/roleOperation/create.html",
			drag:true,
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						base.form.validate({
							form:$("#form"),
							checkAll:true,
							passCallback:function(){
								var params = base.form.getParams($("#form"));
								if(params){
									common.submit({
										url:$.path+"/api/sysroles/saveSysRoles",
										params:params, 
										type:"post",
										callback:function(){
											common.search(grid);
										}
									})
									modal.hide();
//									common.search(grid);
								}
							}
						});
					}
				},
				{
					label:"重置",
					cls:"btn btn-warning",
					clickEvent:function(){
						common.reset($("#form"));
					} 
				}
			]
		}) 
	}
	//修改
	var gridModify = function(){
		var paramsId = {"id":$(".ui-grid .cb:checked").attr("cid")};
		
		var modal = base.modal({
			label:"修改",
			width:600,
			height:210,
			url:"../html/systemManage/roleOperation/modify.html",
			drag:true,
			callback:function(){
				base.ajax({
					url:$.path+"/api/sysroles/findSysRolesByIdInfo?id="+$(".ui-grid .cb:checked").attr("cid"),
					type:"get",
					success: function(data) {
						if(data.code =="0"){
							var formData = data.data;
							base.form.init(formData,$("#form"));
							$("#form").find("input[name='code']").attr("disabled",true)
						}
					},
					error:function(data){
//						console.log(data)
					}
				})
			},
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						base.form.validate({
							form:$("#form"),
							checkAll:true,
							passCallback:function(){
								var params = base.form.getParams($("#form"));
								if(params){
									var paramsA = $.extend(paramsId,params)
									common.submit({
										url:$.path+"/api/sysroles/updateSysRoles",
										params:paramsA,
										type:"post",
										callback:function(){
											common.search(grid);
										}
									})
									modal.hide();
								}
							}
						});
					}
				},
				{
					label:"重置",
					cls:"btn btn-warning",
					clickEvent:function(){
						common.reset($("#form"));
					}
				}
			]
		})}
	//删除
	var gridDelete = function(){ 
		var params = base.getChecks('cb');
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/sysroles/deleteSysRoles",
					params:params,
					type:"post",
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	}
	var gridSetting = function(){
		var paramsId = {"roleid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			label:"配置菜单",
			width:870,
			height:400,
			url:"../html/systemManage/roleOperation/setting.html",
			drag:true,
			callback:function(){
				base.ajax({
					url:$.path+"/api/sysmenus/findSysMenusAllList?roleId="+$(".ui-grid .cb:checked").attr("cid"),
					type:"get",
					success:function(data){
						if(data.code == "0"){
							if(data.data.roleName){
								$("#form").find("input[name='roleName']").val(data.data.roleName).attr("disabled",true)
							}
							var treeData = data.data.allMenu;
							var mymenu = data.data.myMenu
							tree = base.tree({
								container:$("#set-setting"),
								setting:{
									check:{
										enable:true,
										chkStyle: "checkbox",
										chkboxType:{ "Y" : "ps", "N" : "ps" }
									},
									view: {
										selectedMulti: false,
										showIcon :false,
//										dblClickExpand : false,
										showLine: false
									},
									callback: {
									},
									data:{
										simpleData: {
											enable: false,
											idKey: "key",
											pIdKey: "",
//											rootPId: 0
										},
										key:{
//											checked:"checked",
											children:"children",
											name:"label",
											title:"key",
//											url:"key"
										}
									}
								},
								data:treeData,
								selectNodeId:"1"
							});
							var treeObj = $.fn.zTree.getZTreeObj("set-setting"); 
								treeObj.expandAll(true); 
								
							for(var i=0;i<mymenu.length;i++){
								code = treeObj.getNodesByParamFuzzy("key", mymenu[i],null)[0];
								treeObj.checkNode(code,true,true);
							}

						}
					},
//					error:function(data){
//						console.log(data)
//					}
				})

			},
			buttons:[{
				label:"保存",
				cls:"btn btn-info",
				clickEvent:function(){
					base.form.validate({
						form:$("#form"),
						checkAll:true,
						passCallback:function(){
							var treeObj = $.fn.zTree.getZTreeObj("set-setting");
							var nodes = treeObj.getCheckedNodes(true);
							var selectArray = [];
							nodes.forEach(function(item){
								selectArray.push(item.key)
							})
							var paramsA = $.extend(paramsId,{menuids:selectArray});
							common.submit({
								url:$.path+"/api/sysroles/assignMenus",
								params:paramsA,
								type:"post",
								callback:function(){
									common.search(grid);
								}
							})
							modal.hide();
						}
					});
				}
			}]
		})
	}
	return{
		main:function(){
			setGrid();//画表格
			setGridButton();
		}
	}
})

