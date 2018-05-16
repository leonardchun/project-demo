define(["base","app/commonApp"],function(base,common){
	var grid = null;
	//发布资源
//	$.path = "http://192.168.230.5:7000";
	var gridPublishRes = { 
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
			url:$.path+"/api/resourcemonitor/findPublishResourceByPage",
			type:"get",
			contentType:"application/json",
			data:function(d){
				common.gridPageFliter(d);
				
				var params = base.form.getParams($("#publishRes-form"));
				var paramsA;
				if(params){
					paramsA = $.extend({page:d.page,size:d.size},params); 
				}
				return paramsA; 
			}
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			{ "data": "taskName","sWidth":"25%"},
			{ "data": "resTypeName","sWidth":"20%"},
			{ "data": "stateName","sWidth":"25%"},
			{ "data": "nextTime","sWidth":"25%"}
		],
		columnDefs:[ 
			{"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' cAll = '"+JSON.stringify(row)+"' cid='"+row.roleId+"'/></div>"; 
              }, 
               "targets":0 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.taskName){
	        		return "<div>"+row.taskName+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":1 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.resTypeName){
	        		return "<div>"+row.resTypeName+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":2 
	        },
	        {"render":function(data,type,row,meta){
				if(row.stateName){
	        		return "<div>"+row.stateName+"</div>";   
	        	}else{
	        		return "--"
	        	}
	          },
               "targets":3 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.nextTime){
	        		return "<div>"+row.nextTime+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":4 
	        }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        }
	};
	//订阅资源 
	var gridSubscibeRes = { 
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		ajax:{
			url:$.path+"/api/resourcemonitor/findSubscribeResourceByPage",
			type:"get",
			contentType:"application/json",
			data:function(d){
				common.gridPageFliter(d);
				var params = base.form.getParams($("#subscibeRes-form"));
				var paramsA ;
				if(params){
					paramsA = $.extend({page:d.page,size:d.size},params); 
				}
				return paramsA; 
			}
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			{ "data": "taskName","sWidth":"20%"},
			{ "data": "resTypeName","sWidth":"15%"},
			{ "data": "pubEquipmentName","sWidth":"20%"},
			{ "data": "stateName","sWidth":"20%"},
			{ "data": "nextTime","sWidth":"20%"}
		],
		columnDefs:[ 
			{"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' cAll = '"+JSON.stringify(row)+"' cid='"+row.roleId+"'/></div>"; 
              }, 
               "targets":0 
	       },
	       {"render":function(data,type,row,meta){
	        	if(row.taskName){
	        		return "<div>"+row.taskName+"</div>"; 
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":1 
	       },
	       {"render":function(data,type,row,meta){
	        	if(row.resTypeName){
	        		return "<div>"+row.resTypeName+"</div>";  
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":2 
	       },
	       {"render":function(data,type,row,meta){
	        	if(row.pubEquipmentName){
	        		return "<div>"+row.pubEquipmentName+"</div>";  
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":3 
	       },
	       {"render":function(data,type,row,meta){
	        	if(row.stateName){
	        		return "<div>"+row.stateName+"</div>";  
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":4 
	       },
	       {"render":function(data,type,row,meta){
	        	if(row.nextTime){
	        		return "<div>"+row.nextTime+"</div>";  
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":5 
	       }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        }
	}
	/**画表格**/
	var setGrid = function(that,gridOption){
		grid = base.datatables({
			container:that,
			option:gridOption,
			filter:common.gridFilter
			
		});
	};
	/**查询**/
	var setSearch = function(){
		$(".search").on("click",function(){
			common.search(grid);
		});
	};
	/**重置**/
	var setReset = function(){
		$(".reset").off().on("click",function(){
			common.reset($(this).parents(".ui-searchbar").find("form:visible"),grid);
		});
	};
	/**启用**/
	var gridStart = function(){
		
		base.confirm({
			label:"启用",
			text:"<div style='text-align:center;font-size:13px;'>确定启用?</div>",
			confirmCallback:function(){
				var cAll = $(".ui-grid .cb:checked").attr("cAll");
				var paramsAll = JSON.parse(cAll);
				
				var params = {
					id:paramsAll.id,
					pubEquipmentId:paramsAll.pubEquipmentId,
					actionType:1,//1发布2订阅
					subEquipmentId:paramsAll.subEquipmentId,
					type:0
				} 
				//1发布2订阅
				if($(".ui-grid-linkGroup").find("li.active").attr("key")=="0"){
					params.actionType = 1;
				}else{
					params.actionType = 2;
				}
				common.submit({
					url:$.path+"/api/resourcemonitor/startStopTask",
					params:params,
					type:"post",
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	};
	/**暂停**/
	var gridStop = function(){
		
		base.confirm({
			label:"暂停",
			text:"<div style='text-align:center;font-size:13px;'>确定暂停?</div>",
			confirmCallback:function(){
				
				var cAll = $(".ui-grid .cb:checked").attr("cAll");
				var paramsAll = JSON.parse(cAll);
				
				var params = {
					id:paramsAll.id,
					pubEquipmentId:paramsAll.pubEquipmentId,
					actionType:1,//1发布2订阅
					subEquipmentId:paramsAll.subEquipmentId,
					type:-1
				}
				//1发布2订阅
				if($(".ui-grid-linkGroup").find("li.active").attr("key")=="0"){
					params.actionType = 1;
				}else{
					params.actionType = 2;
				}
				common.submit({
					url:$.path+"/api/resourcemonitor/startStopTask",
					type:"post",
					params:params,
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	};
	/**调度**/
	var gridDispath = function(){
		
		base.confirm({
			label:"调度",
			text:"<div style='text-align:center;font-size:13px;'>确定调度?</div>",
			confirmCallback:function(){
				var cAll = $(".ui-grid .cb:checked").attr("cAll");
				var paramsAll = JSON.parse(cAll);
				
				var params = {
					id:paramsAll.id,
					pubEquipmentId:paramsAll.pubEquipmentId,
					resourceType:2, //1发布2订阅
					subEquipmentId:paramsAll.subEquipmentId
				}
				common.submit({
					url:$.path+"/api/resourcemonitor/dispatchTask",
					params:params,
					type:"post",
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	};
	var setLinkGroup = function(){
		$(".ui-grid-linkGroup li").on("click",function(){
			$(".ui-grid-linkGroup .active").removeClass("active");
			$(this).addClass("active");
			//key为0subscibeResWrapper，key为1publishRes
			var key = $(this).attr("key");  
			switch(key){
				case "0":
					//表单
					$("#publishRes-form").show();
					$("#subscibeRes-form").hide();
					//调度
					$(".dispatch").parent().hide();
					//表格
					$(".publishRes").show();
					$(".subscibeResWrapper").hide();
					setGrid($("#publishRes"),gridPublishRes);
				break;
				case "1":
					
					//表单
					$("#publishRes-form").hide();
					$("#subscibeRes-form").show();
					//调度
					$(".dispatch").parent().show();
					
					//表格
					$(".publishRes").hide();
					$(".subscibeResWrapper").show();
					setGrid($("#subscibeRes"),gridSubscibeRes);
				break;
			}
			//common.search(grid);
		});
	};
	
	
	//设置表格各个按钮操作
	var setGridButton = function(){
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if(!$(this).hasClass("disabled")){
				var key = $(this).attr("keyAtrr");
				switch(key){
					case "0": gridStart();break;
					case "1": gridStop();break;
					case "2": gridDispath();break;
				}
			}
			
		});
	}
	
	return{
		main:function(){
			setGrid($("#publishRes"),gridPublishRes)
			setLinkGroup();
			setSearch();//查询
			setReset();//重置
			setGridButton()//按钮点击
		}
	}
})
