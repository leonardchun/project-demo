define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var tree = null;
	var treeData = null;
	var treeKey = null;
	var treeClickEvent = function(event,treeId,treeNode){
		treeKey = treeNode;
		$(treeData).each(function(i,o){
			if(treeNode.id==o.id){
				$("#currentTreeId").val(o.id);
				if(!grid){
					setGrid();
				}else{
					common.search(grid);
				}
			}
		});
	};

	var setTreebar = function(){
		base.ajax({
			url:$.path+"/api/domain/findDomainResByEquipmentTree",
			type:"get",
			success:function(data){
				treeData = data.data;
				treeData.push({name:"全部单位",id:"0",pid:"-1"});
				tree = base.tree({
					container:$("#treebar"),
					setting:{
							data: {
								simpleData: {
									enable: true
								}
							},
							callback:{
								onClick:treeClickEvent
							}
					},
					data:common.mergeTreeData(treeData,"-1"),
					selectNodeId:"0"
				});
				
			},
			beforeSend:function(){
				base.loading($("#treebar"));
			}
		});
		base.scroll({
			container:$("#treeAside"),
			callback:function(){
				base.pull({
					container:$("#treeAside"),
					target:$("#rightPage")
				});
			}
		});
	};
	/**datatables表格配置项**/
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
				url:$.path+"/api/rescentercompany/findCenterCompanyByPageInfo",
				type:"get",
				contentType:"application/json",
				data:function(d){
//					var ids = treeKey.id==0?'':treeKey.id;
					return common.getParams(d,$("#search-form"))+"&pid="+treeKey.id;
				}
		},
		columns:[
			{ "data": "id","sWidth":"7%"},
			{ "data": "name","sWidth":"31%"},
			{ "data": "code","sWidth":"31%"},
			{ "data": "description","sWidth":"31%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+JSON.stringify(row)+"'/>"; 
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
	};
	/**画表格**/
	var setGrid = function(){
		grid = base.datatables({
			container:$("#example"),
			option:gridOption,
			filter:common.gridFilter
		});
	};
	/**查询**/
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
	
	
	/**设置表格各个按钮操作**/
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
			if($(this).hasClass("disabled")){
				return;
			}else{
				gridModify();
			}
		});
		$(".import").click(function(){
			$("#file").trigger("click");
		})
		/*导入*/
		$("#file").change(function(){
			var requestTip = base.requestTip();
			var url1=new FormData($('#uploadForm')[0])
			$.ajax({
			    url: $.path+'/api/rescentercompany/uploadCompanyData',
			    type: 'POST',
			    cache: false,
			    data: url1,
			    processData: false,
			    contentType: false,
			    success:function(d){
			    	requestTip.success(d.message);
			    }
			})
		})
		/*导出*/
		$(".export").click(function(){
			window.location.href = $.path+"/api/rescentercompany/exportCompanyData";
		})
	};
	
	/**修改**/
	var gridModify = function(){
		$("#button_type").val(1);
		var modal = base.modal({
			width:430,
			height:210,
			label:"修改",
			url:"../html/cdmaEvdoManage/unitManage_add.html",
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						/**1.先校验表单**/
						var pass = base.form.validate({
							form:$("#form"),
							checkAll:true
						});
						if(!pass){return;}
						/**2.保存**/
						var ids = base.getChecks("cb");
						var params = base.form.getParams($("#form"));
						params.id = ids[0];
						params.idex = "0";
						params.level = "0";
						params.pid = treeKey.id;
						if(params){
							common.submit({
								url:$.path+"/api/rescentercompany/updateResCenterCompany",
								params:params,
								type:"post",
								callback:function(){
									modal.hide();
									setTreebar();
								}
							})
						}
						/**3.关闭模态窗**/
						
						
						/**4.刷新表格**/
						
					}
				},
				{
					label:"重置",
					cls:"btn btn-warning",
					clickEvent:function(){
						common.reset($("#form"));
					}
				}
			],
			callback:function(){
				var params = JSON.parse($(".ui-grid .cb:checked").attr("cid"));
				base.form.init(params,$("#form"));
			}
		});
	};
	/**批量删除**/
	var gridDelete = function(){
		var params = base.getChecks("cb");
		if(params.length>1){
			base.requestTip().error("请选择一条数据！");
			return false;
		}
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/rescentercompany/deleteResCenterCompanyById?id="+params[0],
					callback:function(){
						setTreebar();
					}
				});
			}
		});
	};
	/**新建**/
	var gridAdd = function(){
		$("#button_type").val("");
		var modal = base.modal({
			width:430,
			height:210,
			label:"新建",
			url:"../html/cdmaEvdoManage/unitManage_add.html",
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						/**1.先校验表单**/
						var pass = base.form.validate({
							form:$("#form"),
							checkAll:true
						});
						if(!pass){return;}
						/**2.保存**/
						var params = base.form.getParams($("#form"));
						params.pid = treeKey.id;
						if(params){
							common.submit({
								url:$.path+"/api/rescentercompany/saveResCenterCompany",
								params:params,
								type:"post",
								callback:function(){
									modal.hide();
									setTreebar();
								}
							})
						}
						/**3.关闭模态窗**/
						
						
						/**4.刷新表格**/
						
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
		});
	};
	var setContent = function(){
		base.scroll({
			container:$(".ui-gridbar")
		});
	};
	return {
		main:function(){
			grid = null;
			setContent();
			setTreebar();
			//setGrid();
			setGridButton();
			//setSearch();
			setReset();
		}
	};
});