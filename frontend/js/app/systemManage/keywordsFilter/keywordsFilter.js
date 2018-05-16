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
			url:"../json/keywords/keyword.json",
			type:"get"
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			{ "data": "name","sWidth":"20%"},
			{ "data": "content","sWidth":"30%"},
			{ "data": "description","sWidth":"45%"}
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
			container:$("#keywords"),
			option:gridOption
			//filter:common.gridFilter
		});
	};
	//设置表格各个按钮操作
	var setGridButton = function(){
		$(".ui-grid-buttonbar .add").on("click",function(){
			gridAdd();
		})
		$(".ui-grid-buttonbar .delete").on("click",function(){
			if(!$(this).hasClass("disabled")){
				gridDelete();
			}
		})
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if(!$(this).hasClass("disabled")){
				gridModify();
			}
		})
	}
	//新建
	var gridAdd = function(){
		var modal = base.modal({
			label:"新建策略",
			width:500,
			height:200,
			url:"../html/systemManage/keywordsFilter/create.html",
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
										url:"../json/submitSuccess.json",
										params:params
									})
									modal.hide();
									common.search(grid);
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
		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			label:"修改",
			width:500,
			height:200,
			url:"../html/systemManage/keywordsFilter/modify.html",
			drag:true,
			buttons:[
				{
					"label":"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						base.form.validate({
							form:$("#form"),
							checkAll:true,
							passCallback:function(){
								var params = base.form.getParams($("#form"));
								if(params){
									common.submit({
										url:"../json/submitSuccess.json",
										params:params
									})
									modal.hide();
									common.search(grid);
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
	var gridDelete = function(){
		var params = {"ids":base.getCR("cb",true)};
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:"../json/submitSuccess.json",
					params:params,
					callback:function(){
						common.search(grid);
					}
				});
			}
		})
	}
	return {
		main:function(){
			setGrid();//画表格
			setGridButton();
		}
	}
})















/*define(["base","app/commonApp"],function(base,common){
	//表格
	var grid=null;
	var gridOption = {
		processing:true,
		//serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
			url:"../json/keywords/keyword.json",
			type:"get"
		},
		columns:[
			{"data":"id","sWidth":"5%"},
			{"data":"name","sWidth":"20%"},
			{"data":"content","sWidth":"30%"},
			{"data":"description","sWidth":"45%"}
		],
		columnDefs:[
			{
				"render":function(data,type,row,meta){
					return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/></div>";
				},
				"targets":0
			}
		],
		drawCallback:function(setting){
			base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
		}
	}
	//画表格
	var setGrid = function(){
		grid = base.datatables({
			container:$("#keyword"),
			option:gridOption
			//filter:common.gridFilter
		});
	};
	return {
		main:function(){
			setGrid();//画表格
		}
	}
})*/
