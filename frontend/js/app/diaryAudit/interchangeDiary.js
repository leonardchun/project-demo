define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var activeNum = null;
	/**datatables表格配置项**/
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
				url:$.path+"/api/exchangeLog/findExchangeLogPublish",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"));
				}
		},
		columns:[
			{ "data": "id","sWidth":"3%"},
			{ "data": "taskName","sWidth":"12%"},
			{ "data": "resTypeName","sWidth":"11%"},
			{ "data": "extractCount","sWidth":"11%"},
			{ "data": "loadCount","sWidth":"10%"},
			{ "data": "id","sWidth":"11%"},
			{ "data": "startTime","sWidth":"15%"},
			{ "data": "endTime","sWidth":"15%"},
			{ "data": "stateName","sWidth":"12%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/>"; 
              }, 
               "targets":0 
           },
          {"render":function(data,type,row,meta){
                 return "<a href='javascript:void(0)' cid='"+data+"' class='diary_detail'>详情</a>"; 
              }, 
               "targets":5 
           }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        	$(".diary_detail").click(function(){
        		diaryDetail(this);
        	})
        }
	};
	var gridOption1 = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		ajax:{
				url:$.path+"/api/exchangeLog/findExchangeLogSubscribe",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"));
				}
		},
		columns:[
			{ "data": "id","sWidth":"8%"},
			{ "data": "taskName","sWidth":"12%"},
			{ "data": "resTypeName","sWidth":"12%"},
			{ "data": "extractCount","sWidth":"12%"},
			{ "data": "loadCount","sWidth":"10%"},
			{ "data": "id","sWidth":"10%"},
			{ "data": "startTime","sWidth":"12%"},
			{ "data": "endTime","sWidth":"12%"},
			{ "data": "stateName","sWidth":"12%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/>"; 
              }, 
               "targets":0 
          },
          {"render":function(data,type,row,meta){
                 return "<a href='javascript:void(0)' cid='"+data+"' class='diary_detail1'>详情</a>"; 
              }, 
               "targets":5 
           }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball1"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        	$(".diary_detail1").click(function(){
        		diaryDetail(this);
        	})
        }
	};
	/**画表格**/
	var setGrid = function(para){
		if(!para){
			grid = base.datatables({
				container:$("#example"),
				option:gridOption,
				filter:common.gridFilter
			});
		}else{
			grid = base.datatables({
				container:$("#example1"),
				option:gridOption1,
				filter:common.gridFilter
			});
		}		
		/*导出*/
		$(".export").click(function(){
			var type = activeNum?2:1;
			var arr = base.getChecks("cb");
			var params = {type:type,ids:arr};
			window.location.href=$.path+"/api/exchangeLog/exportExcel?"+JSON.stringify(params);
		})
	};
	/**查询**/
	var setSearch = function(){
		/**设置时间控件**/
		base.form.date({
			element:$(".date"),
			isTime:true,
		});
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
		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			width:800,
			height:400,
			label:"修改",
			url:"../html/example/grid_modify.html",
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
								if(params){
									common.submit({
										url:"../json/submitSuccess.json",
										params:params
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
			]
		});
	};
	/**批量删除**/
	var gridDelete = function(){
		var params = {"ids":base.getCR("cb",true)};
		/**删除前先弹窗确认是否删除**/
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
		});
	};
	/**新建**/
	var gridAdd = function(){
		var modal = base.modal({
			width:800,
			height:400,
			label:"新建",
			url:"../html/example/grid_add.html",
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
	/*日志详情*/
	var diaryDetail = function(para){
		var modal = base.modal({
			width:800,
			height:270,
			label:"详情",
			url:"../html/diaryAudit/interchange_detail.html",
			callback:function(){
				$.ajax({
					type:"get",
					url:$.path+"/api/exchangeLog/findExchangeLogById?id="+$(para).attr("cid"),
					success:function(d){
						console.log(d)
						$("#form .taskName").text(d.data.taskName);
						$("#form .resTypeName").text(d.data.resTypeName);
						$("#form .extractCount").text(d.data.extractCount);
						$("#form .extractValue").text(d.data.extractValue);
						$("#form .loadCount").text(d.data.loadCount);
						$("#form .loadValue").text(d.data.loadValue);
						$("#start_date_detail").text(d.data.startTime);
						$("#end_date_detail").text(d.data.endTime);
					}
				})
			}
		});
	};
	var setLinkGroup = function(){
		$(".ui-grid-linkGroup li").on("click",function(){
			$(".ui-grid-linkGroup .active").removeClass("active");
			$(this).addClass("active");
			var key = $(this).attr("key");
			if(key != activeNum){
				grid = null;
			}
			activeNum =key
			if(activeNum){
				$("#publishResource").hide();
				$("#subscribeResource").show();
				if(!grid){
					setGrid(1);
				}else{
					common.search(grid);
				}
			}else{
				$("#subscribeResource").hide();
				$("#publishResource").show();
				if(!grid){
					setGrid();
				}else{
					common.search(grid);
				}
			}
		});
	};
	var setContent = function(){
		base.scroll({
			container:$(".ui-gridbar")
		});
	};
	return {
		main:function(){
			/**当调用main方法后(1个APP只能有1个main方法)，开始执行下列操作**/
			setContent();
			setGrid();
			setGridButton();
			setSearch();
			setReset();
			setLinkGroup();
		}
	};
});