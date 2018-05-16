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
				url:$.path+"/api/resCenterDataElement/findCenterDataElementPage",	
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"));
				}
		},	
		columns:[
			{ "data": "id","sWidth":"3%"},
			{ "data": "name","sWidth":"13%"},
			{ "data": "englishName","sWidth":"13%"},
			{ "data": "code","sWidth":"14%"},
			{ "data": "classifyName","sWidth":"14%"},
			{ "data": "dataType","sWidth":"11%"},
			{ "data": "dataLength","sWidth":"11%"},
			{ "data": "isDictionary","sWidth":"11%"},
			{ "data": "dictionaryName","sWidth":"10%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+JSON.stringify(row)+"'/>"; 
              }, 
               "targets":0 
            },
            {"render":function(data,type,row,meta){
                 return "<a href='#' cid='"+JSON.stringify(row)+"' class='data_detail'>"+row.name+"</a>"; 
              }, 
               "targets":1 
          	},
            {"render":function(data,type,row,meta){
            	 var n = row.dataType; 
            	 if(n==3){
            	 	return "数字"
            	 }
            	 else if(n == 4){
            	 	return "整型";
            	 }
            	 else if(n == 12){
            	 	return "文本";
            	 }
            	 else if(n == 91){
            	 	return "日期";
            	 }
            	 else if(n == 93){
            	 	return "时间";
            	 }
              }, 
               "targets":5 
            },
            {"render":function(data,type,row,meta){
            	 var n = row.dataLength; 
            	 if(n == null || n == ""){
            	 	return "--"
            	 }else{
            	 	return n;
            	 }
              }, 
               "targets":6 
            },
            {"render":function(data,type,row,meta){
            	 var n = row.isDictionary; 
            	 return n?"否":"是";
            	 
              }, 
               "targets":7 
            },
            {"render":function(data,type,row,meta){
            	 var n = row.dictionaryName; 
            	 if(n == null || n == ""){
            	 	return "--"
            	 }else{
            	 	return n;
            	 }
            	 
              }, 
               "targets":8 
            }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        	//数据元名称详情
			$(".data_detail").on("click",function(){
				dataDetail(this);
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
		$(".export").click(function(){
			window.location.href=$.path+"/api/resCenterDataElement/downloadDataElement";
		})
	};
	
	/**修改**/
	var gridModify = function(){
//		$("#button_type").val("1");
		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			width:800,
			height:400,
			label:"修改",
			url:"../html/catalogManage/dataManage_add.html",
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
										url:$.path+"/api/resCenterDataElement/updateCenterDataElement",
										params:params,
										type:'post'
									})
									modal.hide();
									common.search(grid);
									common.initButtonbar($(".ui-grid-buttonbar"));
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
				$("#form select[name='classify']").attr("disabled","disabled");
				$("#form select[name='isDictionary']").attr('disabled','disabled');
				$("#form select[name='dictionaryId']").attr('disabled','disabled');
			}
		});
	};
	/**批量删除**/
	var gridDelete = function(){
		var params = base.getChecks("cb");
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/resCenterDataElement/deleteCenterDataElement",
					params:params,
					type:"post",
					callback:function(){
						common.search(grid);
					}
				});
			}
		});
	};
	/**新建**/
	var gridAdd = function(){
		$("#button_type").val();
		var modal = base.modal({
			width:800,
			height:400,
			label:"新建",
			url:"../html/catalogManage/dataManage_add.html",
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
										url:$.path+"/api/resCenterDataElement/saveCenterDataElement",
										params:params,
										type:"post"
									})
									common.search(grid);
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
		});
	}
	/*详情*/
	var dataDetail = function(para){
		var modal = base.modal({
			width:800,
			height:400,
			label:"详情",
			url:"../html/catalogManage/dataManage_detail.html",
			buttons:[
				{
					label:"关闭",
					cls:"btn btn-info",
					clickEvent:function(){
						modal.hide();
					}
				}
			],
			callback:function(){
				var params = JSON.parse($(para).attr("cid"));
				switch(params.isDictionary){
					case '1':
						$("#form .dictionaryName").hide();
						$("#isDictionary1").text("否");
						break;
					case '0':
						$("#form .dictionaryName").show();
						$("#isDictionary1").text("是");
						break;
				}
				switch(params.dataType){
					case '3':
						$("#dataType").text("数字");
						$("#form .dataLength").show();
						break;
					case '4':
						$("#dataType").text("整型");
						$("#form .dataLength").hide();
						break;
					case '12':
						$("#dataType").text("文本");
						$("#form .dataLength").show();
						break;
					case '91':
						$("#dataType").text("日期");
						$("#form .dataLength").hide();
						break;
					case '93':
						$("#dataType").text("时间");
						$("#form .dataLength").hide();
						break;
				}
				$("#form .versionNumber").text(params.versionNumber);
				$("#form #data_name").text(params.name);
				$("#form #englishName").text(params.englishName);
				$("#form #data_code").text(params.code);
				$("#form #classifyName").text(params.classifyName);
				$("#form #updateDate").text(params.updateDate);
				$("#form #valueScope").text(params.valueScope?params.valueScope:'');
				$("#form #submitCompany").text(params.submitCompany);
				$("#form #submitUser").text(params.submitUser);
				$("#form #versionDate").text(params.versionDate?params.versionDate:'');
				$("#form #dataLength").text(params.dataLength);
			}
		});
	}
	var setContent = function(){
		/*滚动条*/
		base.scroll({
			container:$(".ui-gridbar")
		});
		/*搜索框下拉*/
		$.ajax({
			url:$.path+"/api/sysBussinessDictionary/findDictionaryByType",
			data:JSON.stringify({type: 3,name:"classify"}),
			type:"post",
			contentType:"application/json",
			success:function(d){
				$(d.data.classify).each(function(i,o){
					$("select[name='classify']").append("<option value='"+o.key+"'>"+o.label+"</option>")
				})
			}
		})
		/*文件上传*/
		$("#file").change(function(){
			var requestTip = base.requestTip();
			var url1=new FormData($('#uploadForm')[0])
			$.ajax({
			    url: $.path+'/api/resCenterDataElement/uploadDataElement',
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
			/**当调用main方法后(1个APP只能有1个main方法)，开始执行下列操作**/
			setGrid();
			setGridButton();
			setSearch();
			setReset();
			setContent();
		}
	};
});