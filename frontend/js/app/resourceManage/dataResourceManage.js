define(["base","app/commonApp"],function(base,common){
	var grid = null;
	/**datatables表格配置项**/
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
				url:$.path+"/api/localresdatasource/findResPageByNameOrTypeInfo",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"));
				}
		},
		columns:[
			{ "data": "id","sWidth":"8%"},
			{ "data": "name","sWidth":"12%"},
			{ "data": "ip","sWidth":"20%"},
			{ "data": "port","sWidth":"20%"},
			{ "data": "type","sWidth":"20%"},
			{ "data": "id","sWidth":"20%"},
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+JSON.stringify(row)+"'/>"; 
              }, 
               "targets":0 
           },
           {"render":function(data,type,row,meta){
           		switch(row.type){
          			case '1':
          				return "数据库";
          				break;
          			case '2':
          				return "文件";
          				break;
          			case '3':
          				return "API";
          				break;
          		}
              }, 
               "targets":4 
           },
            {"render":function(data,type,row,meta){
                 return "<div class='fa fa-search' title='查看' cid='"+JSON.stringify(row)+"'><div>"; 
              }, 
               "targets":5 
            } 
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        	/*查看详情*/
        	$(".fa-search[title]").click(function(){
        		var self=$(this)
				var modal = base.modal({
					width:800,
					height:250,
					label:"详情",
					url:"../html/resourceManage/dataResourceManage_details.html",
					buttons:[
						{
							label:"关闭",
							cls:"btn btn-warning",
							clickEvent:function(){
								modal.hide();;
							}
						}
					],
					callback:function(){
						var values = JSON.parse(self.attr('cid'));
						switch(values.type){
							case '1':
								$("#form .file-box").hide();
								$("#form .database-box").show();
								$("#form .type").text("数据库");
								break;
							case '2':
								$("#form .file-box").show();
								$("#form .database-box").hide();
								$("#form .type").text("文件");
								break;
						}
						$("#form .name").text(values.name);
						$("#form .password").text(values.password);
						$("#form .username").text(values.username);
						$("#form .port").text(values.port);
						$("#form .ip").text(values.ip);
						$("#form .dbType").text(values.dbType);
						$("#form .dbInstanceName").text(values.dbInstanceName);
						switch(values.ftpType){
							case '1':
								$("#form .ftpType").text("FTP");
								break;
							case '2':
								$("#form .ftpType").text("SMB");
								break;
						};
						switch(values.unicode){
							case '1':
								$("#form .unicode").text("GBK");
								break;
							case '2':
								$("#form .unicode").text("UTF-8");
								break;
							case '3':
								$("#form .unicode").text("GB2312");
								break;
						};
						$("#form .ftpAddress").text(values.ftpAddress);
					}
				});
        	})
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
	};
	
	/**修改**/
	var gridModify = function(){
		$("#button_type").val("1");
		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			width:800,
			height:300,
			label:"修改",
			url:"../html/resourceManage/dataResourceManage_add.html",
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						/**方式一**/
						
							/*
							var pass = base.form.validate({
								form:$("#form"),
								checkAll:true
							});
							if(!pass){return;}
							var params = base.form.getParams($("#form"));
							if(params){
								common.submit({
									url:"../json/submitSuccess.json",
									params:params
								})
							}
							modal.hide();
							common.search(grid);
							*/
						
						/**方式二**/
						
						base.form.validate({
							form:$("#form"),
							checkAll:true,
							passCallback:function(){
								var params = base.form.getParams($("#form"));
								params.id = $(".ui-grid .cb:checked").val();
								if(params){
									common.submit({
										url:$.path+"/api/localresdatasource/updateResDataSource",
										params:params,
										type:"post"
									})
									modal.hide();
									common.search(grid);
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
			base.requestTip().error("只能选择一条数据")
			return false;
		}
		$.ajax({
			url:$.path+"/api/localresdatasource/checkResDataSourceUse",
			type:"post",
			data:JSON.stringify({id:params[0]}),
			contentType:"application/json",
			success:function(d){
				if(!d.data){
					base.requestTip().error("该项已被使用")
					return false;
				}
			}
		})
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/localresdatasource/deleteResDataSourceById",
					params:{id:params[0]},
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	};
	/**新建**/
	var gridAdd = function(){
		$("#button_type").val("");
		var modal = base.modal({
			width:800,
			height:350,
			label:"新建",
			url:"../html/resourceManage/dataResourceManage_add.html",
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
										url:$.path+"/api/localresdatasource/saveResDataSource",
										params:params,
										type:'post'
									})
									
								}
								
								common.search(grid);
								
								modal.hide();
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
		});
	}
	var setContent = function(){
		base.scroll({
			container:$(".ui-gridbar")
		});
	};
	return {
		main:function(){
			setContent();
			
			setGrid();
			setGridButton();
			setSearch();
			setReset();
		}
	};
});