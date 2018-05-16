define(["base","app/commonApp","cookies"],function(base,common){
	var grid = null;
	var tree = null;
	var treeData = null;
	var treeKey = null;
	var levelNum = null;
	var dataObject = {};
//	var fileObject = {};
//	var apiObject = {};
	var tableObject = [];
	var treeClickEvent = function(event,treeId,treeNode){
		treeKey = treeNode;
		if(levelNum != treeNode.level){
			grid = null;
		}
		levelNum = treeNode.level;
		
		if(treeNode.level==1){
			$("#parent_menu").show();
			$("#child_menu").hide();
			$(treeData).each(function(i,o){
				if(treeNode.id==o.id){
					if(!grid){
						setGrid(1);
					}else{
						common.search(grid);
					}
				}
			});
		}else{
			$("#parent_menu").hide();
			$("#child_menu").show();
			$(treeData).each(function(i,o){
			if(treeNode.id==o.id){
					if(!grid){
						setGrid();
					}else{
						common.search(grid);
					}
				}
			});
			
		}
		
	};
	//点击树的搜索
	function clickTreeSearch(){
		$(".input-group-addon").on("click",function(){
			var resName = $(".search-box input").val()
		})
	}
//	禁止根节点选中
	function zTreeBeforeClick(treeId,treeNode){
        if(treeNode.id == 0){
            return false;
        }
   }
	var setTreebar = function(){
		base.ajax({
			url:$.path+"/api/catalog/findResourceCatalogTree",
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
								onClick:treeClickEvent,
								beforeClick: zTreeBeforeClick,
							}
					},
					data:common.mergeTreeData(data.data,"-1"),
					selectNodeId:"feb08c1bac3f4e7593751bc4fa1589f3"
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
				url:$.path+"/api/catalog/findCatalogList",
				type:"get",
				contentType:"application/json",
				data:function(d){
//					console.log(common.getPostParams(d))
					return {id:treeKey.id};
				}	
		},
		columns:[
			{"data": "id","sWidth":"8%"},
			{ "data": "name","sWidth":"15%"},
			{ "data": "code","sWidth":"15%"},
			{ "data": "ename","sWidth":"16%"},
			{ "data": "auditorUserName","sWidth":"16%"},
			{ "data": "telphone","sWidth":"15%"},
			{ "data": "auditorCompany","sWidth":"15%"}
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
	var gridOption1 = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		ajax:{
				url:$.path+"/api/resCatalog/getResCatalogListByCatalogId",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return {id:treeKey.id};
				}
		},
		columns:[
			{"data": "id","sWidth":"8%"},
			{ "data": "resName","sWidth":"19%"},
			{ "data": "resType","sWidth":"18%"},
			{ "data": "equipmentName","sWidth":"19%"},
			{ "data": "companyName","sWidth":"19%"},
			{ "data": "stateName","sWidth":"18%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+JSON.stringify(row)+"'/>"; 
              }, 
               "targets":0 
          },
          {"render":function(data,type,row,meta){
          		switch(row.resType){
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
               "targets":2 
          }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball1"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        }
	};
	/**画表格**/
	var setGrid = function(para){
		if(para == 1){
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
		//key 1修改 2查看流程3提交
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if($(this).hasClass("disabled")){
				return;
			}else{
				var key = $(this).attr("key");
				switch(key){
					case "1":
						gridModify();
					break;
					case "2":
						flowsheet();
					break;
					case "3":
						dataSubmit();
					break;
				}
			}
		});
		//编目
		$(".ui-grid-buttonbar #catalog").on("click",function(){
			catalogData();
		});
		$(".import").click(function(){
			$("#file").trigger("click");
		})
		/*导出*/
		$(".export").click(function(){
			var url = levelNum==1?"/api/catalog/downloadCatalog?resDomainId="+treeKey.id:"/api/resCatalog/downloadResCatalog?catalogId="+treeKey.id;
			window.location.href=$.path+url;
		})
		/*导入*/
		/*文件上传*/
		$("#file").change(function(){
			var requestTip = base.requestTip();
			var url1=new FormData($('#uploadForm')[0])
			var userCookie = JSON.parse($.cookie("dssgUserInfo"));
			var userId = userCookie.loginUserProfileDTO.id;
			var userName = userCookie.loginUserProfileDTO.loginName;
			$.ajax({
			    url: $.path+"/api/catalog/uploadCatalog?userId="+userId+"&userName="+userName+"&resDomainId="+treeKey.id,
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
	
	/**修改**/
	var gridModify = function(){
		$("#button_type").val("1");
		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			width:800,
			height:250,
			label:"修改",
			url:"../html/catalogManage/catalogManage_add.html",
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
						params.resDomainId = treeKey.id;
						params.auditorEquipmentId = $("#hy").attr("tid");
						params.id = $(".ui-grid .cb:checked").val();;
						if(params){
							common.submit({
								url:$.path+"/api/catalog/updateCatalogInfo",
								params:params,
								type:"post",
								callback:function(){
									setTreebar();
								}
							})
						}
						/**3.关闭模态窗**/
						modal.hide();
						
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
				$("#hy").val(params.ename).attr("tid",params.auditorEquipmentId)
				$.ajax({
					url:$.path+"/api/catalog/findDomainResByDomainIdEquipmentTree?domainId="+treeKey.id,
					type:"get",
					success:function(d){
						var treeSelectObj = base.form.treeSelect({
							container:$("#hy"),
							data:d.data
						});
					}
				})
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
					url:$.path+"/api/catalog/deleteCatalogById",
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
	/*提交*/
	var dataSubmit = function(){
		/**提交前先弹窗确认是否提交**/
		var params = {"ids":base.getCR("cb",true)};
		base.confirm({
			label:"提交",
			context:"确认是否提交",
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
		$("#button_type").val("");
		var modal = base.modal({
			width:800,
			height:250,
			label:"新建",
			url:"../html/catalogManage/catalogManage_add.html",
			buttons:[
				{
					label:"保存",
					cls:"btn btn-info",
					clickEvent:function(){
						console.log(JSON.parse($.cookie("dssgUserInfo")))
						/**1.先校验表单**/
						var pass = base.form.validate({
							form:$("#form"),
							checkAll:true
						});
						if(!pass){return;}
						/**2.保存**/
						var params = base.form.getParams($("#form"));
						params.resDomainId = treeKey.id;
						params.auditorEquipmentId = $("#hy").attr("tid");
						if(params){
							common.submit({
								url:$.path+"/api/catalog/saveCatalogInfo",
								params:params,
								type:"post",
								callback:function(){
									setTreebar();
									common.search(grid);
								}
							})
						}
						
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
			],
			callback:function(){
				$.ajax({
					url:$.path+"/api/catalog/findDomainResByDomainIdEquipmentTree?domainId="+treeKey.id,
					type:"get",
					success:function(d){
						var treeSelectObj = base.form.treeSelect({
							container:$("#hy"),
							data:d.data,
							multi:true,
							clickEvent:function(event,treeId,treeNode){
								if(treeNode.disabled){
									return false;
								}
								$("#hy").val(treeNode.name);
								$("#hy").attr("tid",treeNode.id);
								treeSelectObj.hide();
							}
						});
					}
				})
			}
		});
	};
	/*查看流程*/
	var flowsheet = function(){
		modal = base.modal({
			width:900,
			height:450,
			label:"编目",
			url:"../html/catalogManage/catalogManage_flow_step.html",
			callback:function(){
				setSteps1();
			},
			buttons:[
				{
					label:"关闭",
					id:"step_back",
					cls:"btn btn-info back",
					style:"display:none",
					clickEvent:function(obj){
						modal.hide();
					}
				}
			]
		});
	}
	/*编目数据库类型*/
	var catalogData = function(){
		modal = base.modal({
			width:1100,
			height:500,
			label:"编目",
			url:"../html/catalogManage/catalogManage_database_step.html",
			callback:function(){
				setSteps();
				$("#resType").change(function(){
					modal.hide();
					stepTypeChange();
				})
			},
			buttons:[
				{
					label:"上一步",
					id:"step_back",
					cls:"btn btn-info back",
					style:"display:none",
					clickEvent:function(obj){
						steps.back();
					}
				},
				{
					label:"下一步",
					id:"step_forward",
					cls:"btn btn-info forward",
					style:"display:none",
					clickEvent:function(){
						steps.forward(function(){
							var step = steps.getStep();
							
							switch(step){
								case 0:
									var isPass = base.form.validate({form:$("#form1"),checkAll:true});
									return isPass;
								break;
								
								case 1:
									var isPass = base.form.validate({form:$("#form2"),checkAll:true});
									if(isPass){
										dataObject = $.extend(base.form.getParams($("#form1")),base.form.getParams($("#form2")))
										dataObject.themeName=$("#themeName").val();
										dataObject.themeType=$("#themeName").attr("tid");
										dataObject.industryTypeName=$("#industryTypeName").val();
										dataObject.industryType=$("#industryTypeName").attr("tid");
										dataObject.catalogId = treeKey.id;
									}
									return isPass;
								break;
								
								case 2:
									var dbJson = [];
									$("#step_table tbody tr").each(function(i,o){
										var obj={};
										obj.name=$(o).find(".name").val();
										obj.ename="res_"+$(o).find(".ename").val();
										obj.code=$(o).find(".code").val();
										obj.type=$(o).find(".dataType").val();
										obj.length=$(o).find(".dataLength").val();
										if($(o).find(".optData").val()!=0 || $(o).find(".optData").val()!=1){
											obj.dataCode=$(o).find(".optData").val();
											obj.isData=true;
										}else{obj.isData=false;}
										if($(o).find(".primary").hasClass("active")){
											obj.pk=true;
										}else{obj.pk=false;}
										dbJson.push(obj);
									})
									dataObject.dbJson=dbJson;
									console.log(dataObject)
									return true;
								break;
								
							}
						});
					}
				},
				{
					label:"保存",
					id:"step_confirm",
					cls:"btn btn-info confirm",
					style:"display:none",
					clickEvent:function(){
						base.ajax({
							url:$.path+"/api/resCatalog/saveResourceCatalog",
							type:"post",
							params:dataObject,
							success:function(data){			
								common.search(grid);
								modal.hide();
							}
						});
					}
				},
				{
					label:"保存并提交",
					id:"step_confirm",
					cls:"btn btn-info confirm",
					style:"display:none",
					clickEvent:function(){
						base.ajax({
							url:$.path+"/api/resCatalog/saveReferResourceCatalog",
							type:"post",
							params:dataObject,
							success:function(data){			
								common.search(grid);
								modal.hide();
							}
						});
					}
				}
			]
		});
	}
	/*编目文件类型*/
	var catalogFile = function(){
		modal = base.modal({
			width:1100,
			height:500,
			label:"编目",
			url:"../html/catalogManage/catalogManage_file_step.html",
			callback:function(){
				setStepsFile();
				$("#resType").change(function(){
					modal.hide();
					stepTypeChange();
				})
			},
			buttons:[
				{
					label:"上一步",
					id:"step_back",
					cls:"btn btn-info back",
					style:"display:none",
					clickEvent:function(obj){
						steps.back();
					}
				},
				{
					label:"下一步",
					id:"step_forward",
					cls:"btn btn-info forward",
					style:"display:none",
					clickEvent:function(){
						steps.forward(function(){
							var step = steps.getStep();
							switch(step){
								case 0:
									var isPass = base.form.validate({form:$("#form1"),checkAll:true});
									return isPass;
								break;
								
								case 1:
									var isPass = base.form.validate({form:$("#form2"),checkAll:true});
									if(isPass){
										dataObject = $.extend(base.form.getParams($("#form1")),base.form.getParams($("#form2")))
										dataObject.themeName=$("#themeName").val();
										dataObject.themeType=$("#themeName").attr("tid");
										dataObject.industryTypeName=$("#industryTypeName").val();
										dataObject.industryType=$("#industryTypeName").attr("tid");
										dataObject.catalogId = treeKey.id;
									}
									return isPass;
								break;
								
								case 2:
									return true;
								break;
								
							}
						});
					}
				},
				{
					label:"保存",
					id:"step_confirm",
					cls:"btn btn-info confirm",
					style:"display:none",
					clickEvent:function(){
						base.ajax({
							url:$.path+"/api/resCatalog/saveResourceCatalog",
							type:"post",
							params:dataObject,
							success:function(data){			
								common.search(grid);
								modal.hide();
							}
						});
					}
				},
				{
					label:"保存并提交",
					id:"step_confirm",
					cls:"btn btn-info confirm",
					style:"display:none",
					clickEvent:function(){
						base.ajax({
							url:$.path+"/api/resCatalog/saveReferResourceCatalog",
							type:"post",
							params:dataObject,
							success:function(data){			
								common.search(grid);
								modal.hide();
							}
						});
					}
				}
			]
		});
	}
	/*编目api*/
	var catalogApi = function(){
		modal = base.modal({
			width:1100,
			height:500,
			label:"编目",
			url:"../html/catalogManage/catalogManage_api_step.html",
			callback:function(){
				setStepsApi();
				$("#resType").change(function(){
					modal.hide();
					stepTypeChange();
				})
			},
			buttons:[
				{
					label:"上一步",
					id:"step_back",
					cls:"btn btn-info back",
					style:"display:none",
					clickEvent:function(obj){
						steps.back();
					}
				},
				{
					label:"下一步",
					id:"step_forward",
					cls:"btn btn-info forward",
					style:"display:none",
					clickEvent:function(){
						steps.forward(function(){
							var step = steps.getStep();
							switch(step){
								case 0:
									var isPass = base.form.validate({form:$("#form1"),checkAll:true});
									return isPass;
								break;
								
								case 1:
									var isPass = base.form.validate({form:$("#form2"),checkAll:true});
									return isPass;
								break;
								
								case 2:
									return true;
								break;
								
							}
						});
					}
				},
				{
					label:"保存",
					id:"step_confirm",
					cls:"btn btn-info confirm",
					style:"display:none",
					clickEvent:function(){
							/**校验最后一步的表单**/
						var isPass = base.form.validate({form:$("#form4"),checkAll:true});
						/**提交表单**/
						
						/**刷新父层列表**/
						common.search(grid);
						modal.hide();
					}
				}
			]
		});
	}
	var stepTypeChange = function(){
		switch ($("#resType").val()){
			case '1':
				catalogData()
				break;
			case '2':
				catalogFile();
				break;
			case '3':
				catalogApi();
				break;
		}
	}
	/**设置第三部的表格**/
	var setStepGrid = function(){
		var that = {};
		that.grid = null;
		that.count = 0;
		that.gridContainer = $("#step_table");
		that.gridOption =  {
			processing:true,
			serverSide:false,
			searching:false,
			ordering:false,
			lengthChange:false,
			bPaginate:false,
			bInfo:false,
			drawCallback:function(){
				that.gridContainer.find("tbody .delete").unbind("click").on("click",function(){
					var delCount = $(this).parents("tbody").find("tr").index($(this).parents("tr"));
					tableObject.delete(delCount);
					that.grid.deleteRow(this);
				});
			}
		};
		
		that.init = function(){
			
			that.grid = base.datatables({
				container:that.gridContainer,
				option:that.gridOption
			});
			
			that.setAddRow();
			//that.setDeleteRow(); 
			that.grid.addRow(that.getRowData());
		};
		that.setAddRow = function(){
			$('#addRow').on('click', function(){
				that.grid.addRow(that.getRowData());
			});
		};
		that.setDeleteRow = function(){
			that.gridContainer.find("tbody").on("click",".delete",function(){
				that.grid.deleteRow(this);
			});
		};
		that.getRowData = function(){
	        var data = [
	            "<input type='text' name='name"+that.count+"' class='form-control name'/>",
	            "<input type='text' name='name"+that.count+"' class='form-control ename'/>",
	            "<input type='text' name='name"+that.count+"' class='form-control code'/>",
	            "<select class='form-control dataType'><option value='12'>文本</option><option value='91'>日期</option><option value='3'>数字</option><option value='93'>时间</option><option value='4'>整型</option></select>",
	            "<input type='text' name='name"+that.count+"' class='form-control dataLength'/>",
	            "<select class='form-control optData'><option value='0'>默认填写</option><option value='1'>选择数据源</option></select>",
	            "<div style='text-align:center'><button class='btn btn-link delete' title='删除'><i class='fa fa-trash-o'></i></button><button class='btn btn-link primary' title='主键'><i class='fa fa-key'></i></button></div>"
	        ];
	        that.count++;
	        return data;
		};
		that.setKeyActive = function(){
			that.gridContainer.find("tbody").on("click",".primary",function(){
				$(this).toggleClass("active");
			});
		}
		that.setOptData = function(){
			$("#step_table").on("change",".optData",function(){
				var self=this
				var trCount = $(this).parents("tbody").find("tr").index($(this).parents("tr"));
				if($(this).val()==1){
					modal = base.modal({
						width:1100,
						height:600,
						label:"选择数据元",
						url:"../html/catalogManage/optData.html",
						buttons:[
							{
								label:"确定",
								cls:"btn btn-info back",
								clickEvent:function(obj){
									var params = base.getChecks("cbs");
									if(params.length != 1){
										base.requestTip().error("请选择一条数据！");
										return false;
									}
									var params =JSON.parse($(".ui-grid .cbs:checked").attr("cid"));
									console.log(params)
									tableObject.push(params);
									var obj = ''+
									'<td>'+
									  '<input type="text" class="form-control name" value="'+params.name+'"></td>'+
									'<td>'+
									  '<input type="text" class="form-control ename" value="'+params.englishName+'"></td>'+
									'<td>'+
									  '<input type="text" class="form-control code" value="'+params.code+'"></td>'+
									'<td><select class="form-control dataType"><option value="'+params.dataType+'">'+common.typeSelect(params.dataType)+'</option></select></td>'+
									'<td>'+
									  '<input type="text" class="form-control dataLength" value="'+params.dataLength+'"></td>'+
									'<td>'+
									  '<select class="form-control optData">'+
									    '<option value="'+params.code+'">'+params.code+'</option>'+
									    '<option value="0">默认填写</option>'+
									    '<option value="1">选择数据源</option></select>'+
									'</td>'+
									'<td>'+
									  '<div style="text-align:center">'+
									    '<button class="btn btn-link delete" title="删除">'+
									      '<i class="fa fa-trash-o"></i>'+
									    '</button>'+
									    '<button class="btn btn-link primary" title="主键">'+
									      '<i class="fa fa-key"></i>'+
									    '</button>'+
									  '</div>'+
									'</td>'
									$("#step_table tbody tr:eq("+trCount+")").empty().append(obj);
									that.setDeleteRow();
									modal.hide();
								}
							},
							{
								label:"关闭",
								cls:"btn btn-info back",
								clickEvent:function(obj){
									modal.hide();
								}
							}
						],
						callback:function(){
						},
					});
				}else if($(this).val()==0){
						var obj = ''+
							'<td>'+
							  '<input type="text" class="form-control name" value="'+tableObject[trCount].name+'"></td>'+
							'<td>'+
							  '<input type="text" class="form-control ename" value="'+tableObject[trCount].englishName+'"></td>'+
							'<td>'+
							  '<input type="text" class="form-control code" value="'+tableObject[trCount].code+'"></td>'+
							'<td><select class="form-control dataType"><option value="91">日期</option><option value="12">文本</option><option value="3">数字</option><option value="93">时间</option><option value="4">整型</option></select></td>'+
							'<td>'+
							  '<input type="text" class="form-control dataLength" value="'+tableObject[trCount].dataLength+'"></td>'+
							'<td>'+
							  '<select class="form-control optData">'+
							    '<option value="0">默认填写</option>'+
							    '<option value="1">选择数据源</option></select>'+
							'</td>'+
							'<td>'+
							  '<div style="text-align:center">'+
							    '<button class="btn btn-link delete" title="删除">'+
							      '<i class="fa fa-trash-o"></i>'+
							    '</button>'+
							    '<button class="btn btn-link primary" title="主键">'+
							      '<i class="fa fa-key"></i>'+
							    '</button>'+
							  '</div>'+
							'</td>'
							$("#step_table tbody tr:eq("+trCount+")").empty().append(obj);
							$("#step_table tbody tr:eq("+trCount+")").find(".dataType").val(tableObject[trCount].dataType);
				}
			})
		};
		that.init();
		that.setOptData();
		that.setKeyActive();
	};
	/**设置上传和树input**/
	var setUpload = function(){
		$.ajax({
			url:$.path+"/api/sysBussinessDictionary/findDictionaryTreeByType",
			type:"post",
			data:JSON.stringify({name:"themeType",type:1}),
			contentType:"application/json",
			success:function(d){
				base.form.treeSelect({
					container:$("#themeName"),
					data:d.data,
				});
			}
		})
		$.ajax({
			url:$.path+"/api/sysBussinessDictionary/findDictionaryTreeByType",
			type:"post",
			data:JSON.stringify({name:"industryType",type:2}),
			contentType:"application/json",
			success:function(d){
				base.form.treeSelect({
					container:$("#industryTypeName"),
					data:d.data,
				});
			}
		})
		$("#imageBtn").on("click",function(){
			$("#file1").trigger("click");
		});
		$("#file1").on("change",function(){
			$("#fileName").html($(this).val());
			var requestTip = base.requestTip();
			var url1=new FormData($('#uploadForm1')[0])
			$.ajax({
			    url: $.path+'/api/fileUpload/uploadFile',
			    type: 'POST',
			    cache: false,
			    data: url1,
			    processData: false,
			    contentType: false,
			    success:function(d){
			    	requestTip.success(d.message);
			    	var fileid = JSON.parse(d).filesId[0];
			    	$("#attachmentId").val(fileid)
			    }
			})
		});
	};
	var setContent = function(){
		base.scroll({
			container:$(".ui-gridbar")
		});
	};
	/**设置数据库步骤插件**/
	var setSteps = function(){
		steps = base.steps({
			container:$(".ui-steps"),
			data:[
				{"label":"编写项目申请","contentToggle":"#content1"},
				{"label":"填写元数据","contentToggle":"#content2","callback":function(){setUpload();}},
				{"label":"编辑数据项","contentToggle":"#content3","callback":function(){setStepGrid();}},
				{"label":"编目预览","contentToggle":"#content4"}
			],
			buttonGroupToggle:modal.modalFooter
		});
	};
	/*设置查看流程步骤*/
	var setSteps1 = function(){
		steps = base.steps({
			container:$("#ui-steps"),
			data:[
				{"label":"编写项目申请","contentToggle":"#content1"},
				{"label":"填写元数据","contentToggle":"#content2","callback":function(){}},
				{"label":"编辑数据项","contentToggle":"#content3","callback":function(){}},
				{"label":"编目预览","contentToggle":"#content4"}
			],
			buttonGroupToggle:modal.modalFooter,
			currentStep:2/**初始化在第几步,默认是0**/
		});
	};
	/*设置文件步骤*/
	var setStepsFile = function(){
		steps = base.steps({
			container:$(".ui-steps"),
			data:[
				{"label":"编写项目申请","contentToggle":"#content1"},
				{"label":"填写元数据","contentToggle":"#content2","callback":function(){setUpload();}},
				{"label":"编目预览","contentToggle":"#content3","callback":function(){}},
			],
			buttonGroupToggle:modal.modalFooter,
		});
	}
	/*设置api步骤插件*/
	var setStepsApi = function(){
		steps = base.steps({
			container:$(".ui-steps"),
			data:[
				{"label":"填写编目申请","contentToggle":"#content1"},
				{"label":"填写元数据","contentToggle":"#content2","callback":function(){setUpload();}},
				{"label":"输入参数配置","contentToggle":"#content3","callback":function(){}},
				{"label":"输出参数配置","contentToggle":"#content2","callback":function(){}},
				{"label":"编目预览","contentToggle":"#content3","callback":function(){}},
			],
			buttonGroupToggle:modal.modalFooter,
		});
	}
	
	return {
		main:function(){
			grid = null;
			setContent();
			setTreebar();
			setGridButton();
			setSearch();
			setReset();
			clickTreeSearch();
		}
	};
});