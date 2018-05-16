define(["base","app/commonApp"],function(base,common){
	//表格
	var grid = null;
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
//				url:"../json/apiApp/apiApp.json",
			url:$.path+"/api/app/findSysApp",
			type:"get",
			data:function(d){
				common.gridPageFliter(d);
				var params = base.form.getParams("#search-form");
				var paramsA;
				if(params){
					paramsA = $.extend({page:d.page,size:d.size},params); 
				}
				return paramsA
			}
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			{ "data": "appName","sWidth":"20%"},
			{ "data": "description","sWidth":"30%"},
			{ "data": "ipAddress","sWidth":"20%"},
			{ "data": "appCode","sWidth":"25%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/></div>"; 
              }, 
               "targets":0 
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
			container:$("#apiApp"),
			option:gridOption,
			filter:common.gridFilter
		});
	};
	//设置表格各个按钮操作
	var setGridButton = function(){
		$(".ui-grid-buttonbar .add").on("click",function(){
			gridAdd();
		})
		$(".ui-grid-buttonbar .delete").on("click",function(){
			if($(this).hasClass("disabled")){
				return;
			}else{
				gridDelete();
			}
		})
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if(!$(this).hasClass("disabled")){
				var key = $(this).attr("keyAtrr");
				switch(key){
					case "0": gridModify();break;
					case "1": gridView();break;
				}
			}
		})
	}
	
	//查询
	var setSearch = function(){
		$("#search").on("click",function(){
			common.search(grid);
		});
	};
	/**重置**/
	var setReset = function(){
		$("#reset").on("click",function(){
			common.reset($("#search-form"),grid);
		});
	};
	//新建
	var gridAdd = function(){
		var modal = base.modal({
			label:"新建",
			width:600,
			height:210,
			url:"../html/resourceManage/apiApp_add.html",
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
										url:$.path+"/api/app/addApp",
										params:params,
										callback:function(){
											common.search(grid);
										}
									})
									modal.hide();
								}
							}
						
						})
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
			url:"../html/resourceManage/apiApp_modify.html",
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
									var paramsA = $.extend(paramsId,params);
									common.submit({
										url:$.path+"/api/app/editApp",
										params:paramsA,
										callback:function(){
											common.search(grid);
										}
									})
									modal.hide();
								}
							}
						
						})
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
	//删除
	var gridDelete = function(){
//		var params = {"ids":base.getCR("cb",true)};
		var params = base.getChecks('cb');
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/app/deleteApp",
					params:params,
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	}
	var gridView = function(){ 
		var modal =base.modal({
			label:"查看",
			width:1000,
			height:500,
			url:"../html/resourceManage/apiApp_view.html",
			drag:true,
			customScroll:true,
			buttons:[
				{
					label:"取消",
					cls:"btn btn-info",
					clickEvent:function(){
						modal.hide();
					}
				}
			]
		})
	}
	return {
		main:function(){
			setGrid();
			setGridButton();
			setSearch();
			setReset();
		}
	}
})
