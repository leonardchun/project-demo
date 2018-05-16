define(["base","app/commonApp"],function(base,common){
	var grid = null;
	//发布资源
	var gridPublishRes = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
			url:$.path+"/api/apiResourceMonitor/myPublishResourceByPage",
			type:"get",
			contentType:"application/json",
			data:function(d){
				common.gridPageFliter(d);
				var params = base.form.getParams("#publishRes-form");
				var paramsA;
				if(params){
					paramsA = $.extend({page:d.page,size:d.size},params); 
				}
				return paramsA
			}
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			{ "data": "taskName","sWidth":"20%"},
			{ "data": "apiSource","sWidth":"10%"},
			{ "data": "state","sWidth":"10%"},
			{ "data": "requestTime","sWidth":"15%"},
			{ "data": "requestNumber","sWidth":"20%"},
			{ "data": "currentNumber","sWidth":"20%"}
		],
		columnDefs:[ 
			{"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' cAll = '"+JSON.stringify(row)+"' cid='"+row.roleId+"'/></div>"; 
              },
               "targets":0 
	        },
			{"render":function(data,type,row,meta){
				var menu = row.apiSource;
            	if(menu){
            		if(menu=="local"){
                 		return "<div title='"+menu+"'>本地数据源</div>"
	                }else if(menu =="file"){
	                 	return "<div title='"+menu+"'>文件</div>"
	                }else{
	                 	return "<div title='"+menu+"'>API</div>"
	                }
            	}else{ 
            		return "--"
            	}
              }, 
               "targets":2 
	        },
	        {"render":function(data,type,row,meta){
	        	var menu = row.state;
            	if(menu){
            		if(menu=="0"){
                 	return "<div title='"+menu+"'>启用</div>"
                 }else if(menu=="-1"){
                 	return "<div title='"+menu+"'>发布方暂停</div>"
                 }else{
                 	return "<div title='"+menu+"'>发布方暂停</div>"
                 }
            	}else{ 
            		return ''
            	}
              }, 
               "targets":3 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.requestTime){
	        		return "<div>"+row.requestTime+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":4 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.requestNumber){
	        		return "<div>"+row.requestNumber+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":5 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.currentNumber){
	        		return "<div>"+row.currentNumber+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":6 
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
			url:$.path+"/api/apiResourceMonitor/mySubscribeResourceByPage",
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
			{ "data": "apiSource","sWidth":"8%"},
			{ "data": "pubEquipmentName","sWidth":"8%"},
			{ "data": "state","sWidth":"9%"},
			{ "data": "requestTime","sWidth":"15%"},
			{ "data": "requestNumber","sWidth":"20%"},
			{ "data": "currentNumber","sWidth":"20%"}
		],
		columnDefs:[ 
			{"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' cAll = '"+JSON.stringify(row)+"' cid='"+row.roleId+"'/></div>"; 
              }, 
               "targets":0 
	        },
	        {"render":function(data,type,row,meta){
	        	var menu = row.apiSource;
            	if(menu){
            		if(menu=="local"){
                 		return "<div title='"+menu+"'>本地数据源</div>"
	                }else if(menu =="file"){
	                 	return "<div title='"+menu+"'>文件</div>"
	                }else{
	                 	return "<div title='"+menu+"'>API</div>"
	                }
            	}else{ 
            		return ''
            	}
//              return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' cAll = '"+JSON.stringify(row)+"' cid='"+row.roleId+"'/></div>"; 
              }, 
               "targets":2 
	        },
	        {"render":function(data,type,row,meta){
	        	var menu = row.state;
            	if(menu){
            		if(menu=="0"){
                 	return "<div title='"+menu+"'>启用</div>"
                 }else if(menu=="-1"){
                 	return "<div title='"+menu+"'>发布方暂停</div>"
                 }else{
                 	return "<div title='"+menu+"'>发布方暂停</div>"
                 }
            	}else{ 
            		return ''
            	}
//               return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.roleId+"' class='cb' cAll = '"+JSON.stringify(row)+"' cid='"+row.roleId+"'/></div>"; 
              }, 
               "targets":4 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.requestTime){
	        		return "<div>"+row.requestTime+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":5 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.requestNumber){
	        		return "<div>"+row.requestNumber+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":6 
	        },
	        {"render":function(data,type,row,meta){
	        	if(row.currentNumber){
	        		return "<div>"+row.currentNumber+"</div>";   
	        	}else{
	        		return "--"
	        	}
              }, 
               "targets":7 
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
		/**设置时间控件**/
		$("#search").on("click",function(){
			common.search(grid);
		});
		
	};
	/**重置**/
	var setReset = function(){
		$(".reset").off().on("click",function(){
			common.reset($(this).parents(".ui-searchbar").find("form"),grid);
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
	//				actionType:1,//1数据库2文件3api
					type:0
				} 
				//1发布2订阅
				if($(".ui-grid-linkGroup").find("li.active").attr("key")=="0"){
					params.actionType = 1;
				}else{
					params.actionType = 2;
				}
				common.submit({
					url:$.path+"/api/apiResourceMonitor/startStopService",
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
		//			actionType:1,
					type:-1
				}
				//1发布2订阅
				if($(".ui-grid-linkGroup").find("li.active").attr("key")=="0"){
					params.actionType = 1;
				}else{
					params.actionType = 2;
				}
				common.submit({
					url:$.path+"/api/apiResourceMonitor/startStopService",
					type:"post",
					params:params,
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
					//表格
					setGrid($("#publishRes"),gridPublishRes);
					$(".publishRes").show();
					$(".subscibeResWrapper").hide();
				break;
				case "1":
					//表单
					$("#publishRes-form").hide();
					$("#subscibeRes-form").show();
					//表格
					setGrid($("#subscibeRes"),gridSubscibeRes);
					$(".publishRes").hide();
					$(".subscibeResWrapper").show();
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
				}
			}
			
		});
	}
	return{
		main:function(){
			setGrid($("#publishRes"),gridPublishRes)
			setGridButton();
			setLinkGroup();
			setReset();
		}
	}
})
