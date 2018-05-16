define(["base","app/commonApp"],function(base,common){
	//表格参数
	var grid=null;
	var gridOption ={
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
			url:$.path+"/api/sysmessage/findSysMessage",
			type:"get",
			data:function(d){
				common.gridPageFliter(d);
				var params = base.form.getParams($("#search-form"));
				var paramsA;
				if(params){
					paramsA = $.extend({page:d.page,size:d.size},params); 
				}
				return paramsA; 
			}
		},
		columns:[
			{ "data": "id","sWidth":"10%"},
			{ "data": "content","sWidth":"50%"},
      		{ "data": "createTime","sWidth":"40%"}
		],
		columnDefs:[
			{"render":function(data,type,row,meta){
                 return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/></div>"; 
              }, 
               "targets":0 
	      },{"render":function(data,type,row,meta){
	      		var menu = row.type;
	      		if(row.state == "1"){//未读
	      			if(menu=="4"){
	      				return "<div title='"+row.content+"'><b>【待办事项】&nbsp;"+row.content+"</b></div>"
		      		}else if(menu=="2"){
		      			return "<div title='"+row.content+"'><b>【系统消息】&nbsp;"+row.content+"</b></div>"
		      		}else{
		      			return "<div title='"+row.content+"'><b>【告警消息】&nbsp;"+row.content+"</b></div>"
		      		}
	      		}else{
	      			if(menu=="4"){//已读
		      			return "<div title='"+row.content+"'>【待办事项】&nbsp;"+row.content+"</div>"
		      		}else if(menu=="2"){
		      			return "<div title='"+row.content+"'>【系统消息】&nbsp;"+row.content+"</div>"
		      		}else{
		      			return "<div title='"+row.content+"'>【告警消息】&nbsp;"+row.content+"</div>"
		      		}
	      		}
              }, 
               "targets":1 
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
			container:$("#msg"),
			option:gridOption,
			filter:common.gridFilter
		})
	}
	//设置表格各个按钮操作
	var setGridButton = function(){
		$(".ui-grid-buttonbar button").on("click",function(){
			if(!$(this).hasClass("disabled")){
				if($(this).hasClass("read")){ //含有read的话则表明点击的标记已读
					gridRead();
				}else{ //点击的是删除
					gridDelete();	 
				}
			}
		})
	}
	//查询
	var setSearch = function(){
		/**设置时间控件**/
		$("#search").on("click",function(){
			common.search(grid);
		});
		
	};
	//重置
	var setReset = function(){
		$("#reset").off().on("click",function(){
			common.reset($(this).parents(".ui-searchbar").find("form"),grid);
		});
	};
	//删除
	var gridDelete = function(){
		var params = base.getChecks('cb');
		base.confirm({
			label:"删除",
			text:"<div style='text-align:center;font-size:13px;'>确定删除?</div>",
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/sysmessage/deleteSysMessage",
					params:params,
					type:"post",
					callback:function(){
						common.search(grid);
					}
				});
			}
			
		})
	}
	//标记未读为已读
	var gridRead = function(){
		var params = base.getChecks('cb');
		
		common.submit({
			url:$.path+"/api/sysmessage/updateSysMessageIsRead",
			params:params,
			type:"post",
			callback:function(){
				common.search(grid);
			}
		});
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
