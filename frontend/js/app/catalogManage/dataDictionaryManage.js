define(["base","app/commonApp","cookies"],function(base,common){
	var grid = null;
	var tree = null;
	var treeData = null;
	var treeStyle=null;
	var treeKey=null;
	var treeClickEvent = function(event,treeId,treeNode){
		treeNode.isParent?treeStyle=1:treeStyle='';
		treeKey=treeNode;
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
			url:$.path+"/api/sysCenterBussinessDictionary/findSysCenterBussinessDictTree",
			type:"get",
			success:function(data){
				treeData = data.data;
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
					data:common.mergeTreeData(data.data,'-1'),
					selectNodeId:"DICTIONARY-FIXE-LEVEL-ONE-000000"
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
				url:$.path+"/api/sysCenterBussinessDictionary/findSysCenterBussinessDictionaryDetailList",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"))+"&id="+treeKey.id;
				}
		},
		columns:[
			{ "data": "id","sWidth":"8%","type":"checkbox"},
			{ "data": "name","sWidth":"32%"},
			{ "data": "code","sWidth":"30%"},
			{ "data": "description","sWidth":"30%"},
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid=''/>"; 
              }, 
               "targets":0 
            } 
        ],
        fnCreatedRow: function(nRow, aData, iDataIndex) {
        	$(nRow).attr("data-tt-id",aData.id);
        	$(nRow).attr("data-tt-parent-id",aData.pid);
        	$(nRow).attr("rootRow",iDataIndex);
        },
        drawCallback:function(setting){
        	common.treeTable(setting);
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
				var params = $(".ui-grid .cb:checked").val();
				if(params=='DICTIONARY-FIXE-LEVEL-ONE-000001' || params == "DICTIONARY-FIXE-LEVEL-ONE-000002" || params == "DICTIONARY-FIXE-LEVEL-ONE-000003")
				{
					base.requestTip().error("固定字典不能删除");
					return;
				}
				gridDelete();
			}
		});
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if($(this).hasClass("disabled")){
				return;
			}else{
				var params = $(".ui-grid .cb:checked").val();
				if(params=='DICTIONARY-FIXE-LEVEL-ONE-000001' || params == "DICTIONARY-FIXE-LEVEL-ONE-000002" || params == "DICTIONARY-FIXE-LEVEL-ONE-000003")
				{
					base.requestTip().error("固定字典不能编辑");
					return;
				}
				gridModify();
			}
		});
		$(".import").click(function(){
			$("#file").trigger("click");
		})
		/*导出*/
		$(".export").click(function(){
			window.location.href=$.path+"/api/sysCenterBussinessDictionary/downloadDicts";
		})
	};
	
	/**修改**/
	var gridModify = function(){
		$("#button_type").val("1");
		var uri = treeStyle?"dataDictionaryManage_add":"dataDictionaryManage1_add"
//		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var ids = $(".ui-grid .cb:checked").val();
		var modal = base.modal({
			width:430,
			height:270,
			label:"修改",
			url:"../html/catalogManage/"+uri+".html",
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
						params.pid=treeKey.id;
						params.level=treeKey.level+1;
						params.id=ids;
						if(params){
							common.submit({
								url:$.path+"/api/sysCenterBussinessDictionary/updateDetailedDictionary",
								params:params,
								type:'post'
							})
						}
						
						/**4.刷新表格**/
						common.search(grid);
						
						/**3.关闭模态窗**/
						modal.hide();
						
						
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
	/**批量删除**/
	var gridDelete = function(){
		var params = base.getChecks("cb");
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/sysCenterBussinessDictionary/deleteDetailedDictionary",
					params:params,
					type:"post",
					callback:function(){
						common.search(grid);
						setTreebar();
					}
				});
			}
		});
	};
	/**新建**/
	var gridAdd = function(){
		$("#button_type").val("");
		var uri = treeStyle?"dataDictionaryManage_add":"dataDictionaryManage1_add"
		var modal = base.modal({
			width:430,
			height:270,
			label:"新建",
			url:"../html/catalogManage/"+uri+".html",
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						/**1.先校验表单**/
						var pass = base.form.validate({
							form:$(".ui-form"),
							checkAll:true
						});
						if(!pass){return;}
						/**2.保存**/
						var params = base.form.getParams($("#form"));
						params.pid=treeKey.id;
						params.level=treeKey.level+1;
						if(params){
							common.submit({
								url:$.path+"/api/sysCenterBussinessDictionary/saveDetailedDictionary",
								params:params,
								type:"post"
							})
						}
						/*刷新树菜单*/
						setTreebar();
						/**4.刷新表格**/
						common.search(grid);
						
						/**3.关闭模态窗**/
						modal.hide();
						
						
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
		/*文件上传*/
		$("#file").change(function(){
			var requestTip = base.requestTip();
			var url1=new FormData($('#uploadForm')[0])
			$.ajax({
			    url: $.path+'/api/sysCenterBussinessDictionary/uploadDictsIn',
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
	};
	return {
		main:function(){
			/*每次加载清数据*/
			grid=null;
			
			setContent();
			setTreebar();
			//setGrid();
			setGridButton();
			setSearch();
			setReset();
		}
	};
});