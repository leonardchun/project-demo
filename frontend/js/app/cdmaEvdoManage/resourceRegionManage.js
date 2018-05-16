define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var tree = null;
	var treeData = null;
	var treeKey = null;
	var treeIds = null;
	var treeClickEvent = function(event,treeId,treeNode){
		treeKey = treeNode;
		if(treeIds != treeNode.level){
			grid = null;
		}
		treeIds = treeNode.level;
		if(treeIds==0){
			$("#parent_menu").show();
			$("#child_menu").hide();
			$(treeData).each(function(i,o){
				if(treeNode.id==o.id){
					$("#currentTreeId").val(o.id);
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
					$("#currentTreeId").val(o.id);
					if(!grid){
						setGrid();
					}else{
						common.search(grid);
					}
				}
			});
		}
	};
	var zTreeBeforeClick = function(treeId,treeNode){
		if(treeNode.level>1){
			return false;
		}
	}
	var setTreebar = function(){
		base.ajax({
			url:$.path+"/api/domain/findDomainResTree",
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
								beforeClick: zTreeBeforeClick
							}
					},
					data:common.mergeTreeData(data.data,"-1"),
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
				url:$.path+"/api/domain/findDomainResourceByPidListTableInfo",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"));
				}
		},
		columns:[
			{ "data": "id","sWidth":"8%"},
			{ "data": "name","sWidth":"18%"},
			{ "data": "equipmentName","sWidth":"20%"},
			{ "data": "contacts","sWidth":"18%"},
			{ "data": "telphone","sWidth":"18%"},
			{ "data": "company","sWidth":"18%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+JSON.stringify(row)+"'/>"; 
              }, 
               "targets":0 
           },
           {"render":function(data,type,row,meta){
                 return "<a href='javascript:void(0);' class='resourceDetail' cid='"+row.id+"'>"+row.name+"</a>" 
              }, 
               "targets":1 
           }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        	$(".resourceDetail").click(function(){
        		resourceDetail(this);
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
				url:$.path+"/api/domain/findDomainEquipmentByListTableInfo",
				type:"get",
				contentType:"application/json",
				data:function(d){	
					return common.getParams(d,$("#search-form"))+"&id="+treeKey.id;
				}
		},
		columns:[
			{ "data": "id","sWidth":"8%"},
			{ "data": "equipmentName","sWidth":"18%"},
			{ "data": "equipentIp","sWidth":"20%"},
			{ "data": "equipmentRole","sWidth":"18%"},
			{ "data": "company","sWidth":"18%"},
			{ "data": "equipmentStatus","sWidth":"18%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/>"; 
              }, 
               "targets":0 
           },
           {"render":function(data,type,row,meta){
                 return "<a href='javascript:void(0);' class='equipmentDetail' cid='"+row.equipmentId+"'>"+row.equipmentName+"</a>" 
              }, 
               "targets":1 
           },
           {"render":function(data,type,row,meta){
                  switch(row.equipmentRole){
                  	 case '0':
                  	 	return "接入节点";
                  	 	break;
                  	 case '1':
                  	 	return "管理节点";
                  	 	break;
                  }
              }, 
               "targets":3 
           },
           {"render":function(data,type,row,meta){
                  switch(data){
                  	 case '1':
                  	 	return "已加入";
                  	 	break;
                  	 default:
                  	 	return "--";
                  }
              }, 
               "targets":5 
           }
        ],
        drawCallback:function(setting){
        	/**全选操作**/
        	base.selectAll($("#cball1"),$(".cb"),function(){
        		common.checkByGridButton($(".cb"));
        	});
        	$(".equipmentDetail").click(function(){
        		equipmentDetail(this);
        	})
        }
	};
	/**画表格**/
	var setGrid = function(para){
		if(para){
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
		$(".ui-grid-buttonbar .modify").on("click",function(){
			var ids = base.getChecks("cb")
			if($(this).hasClass("disabled")){
				return;
			}else{
				$.ajax({
					type:"get",
					url:$.path+"/api/domain/findThisDomainIsCurrentInfo?domainId="+ids[0],
					success:function(d){
						if(!d.data){
							base.requestTip().error("没权限操作！")
						}else{
							gridModify();
						}
					}
				});
			}
		});
		$(".ui-grid-buttonbar .quit").on("click",function(){
			quitEquipment();
		})
		$(".ui-grid-buttonbar #maintenance").on("click",function(){
			$.ajax({
				type:"get",
				url:$.path+"/api/domain/findThisDomainIsCurrentInfo?domainId="+treeKey.id,
				success:function(d){
					if(!d.data){
						base.requestTip().error("没权限操作！")
					}else{
						maintenanceEquipment();
					}
				}
			});
		})
		
	};
	
	/**修改**/
	var gridModify = function(){
		$("#button_type").val(1);
		var modal = base.modal({
			width:420,
			height:210,
			label:"修改",
			url:"../html/cdmaEvdoManage/resourceRegionManage_add.html",
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
						var ids = $(".ui-grid .cb:checked").val();;
						var params = base.form.getParams($("#form"));
						params.id = ids;
						if(params){
							common.submit({
								url:$.path+"/api/domain/updateDomainResource",
								params:params,
								type:"post",
								callback:function(){
									common.search(grid);
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
				var params =JSON.parse($(".ui-grid .cb:checked").attr("cid"));
				base.form.init(params,$("#form"))
			}
		});
	};
	/**批量删除**/
	var gridDelete = function(){
		var params = base.getChecks("cb");
		if(params.length>1){
			base.requestTip().error("请选择一条数据")
			return false;
		}
		/**删除前先弹窗确认是否删除**/
		base.confirm({
			confirmCallback:function(){
				common.submit({
					url:$.path+"/api/domain/deleteDomainResource",
					params:{domainId:params[0]},
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
			width:420,
			height:210,
			label:"新建",
			url:"../html/cdmaEvdoManage/resourceRegionManage_add.html",
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
						if(params){
							common.submit({
								url:$.path+"/api/domain/saveDomainResource",
								params:params,
								type:"post",
								callback:function(){
									setTreebar();
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
			]
		});
	};
	/*资源域名称详情*/
	var resourceDetail = function(para){
		var modal = base.modal({
			width:800,
			height:300,
			label:"详情",
			url:"../html/cdmaEvdoManage/resourceRegionNameDetail.html",
			buttons:[
				{
					label:"关闭",
					cls:"btn btn-info",
					clickEvent:function(){	
						/**3.关闭模态窗**/
						modal.hide();
					}
				}
			],
			callback:function(){
				$.ajax({
					type:"get",
					url:$.path+"/api/domain/findDomainInnerDetailByIdInfo?id="+$(para).attr("cid"),
					async:true,
					success:function(d){
						$("#form .name").text(d.data.name);
						$("#form .equipmentName").text(d.data.equipmentName);
						$("#form .company").text(d.data.company);
						$("#form .contacts").text(d.data.contacts);
						$("#form .telphone").text(d.data.telphone);
						$("#form .createTime").text(d.data.createTime);
						$("#form .nodenum").text(d.data.nodenum);
						$("#form .dbnum").text(d.data.dbnum?d.data.dbnum:0);
						$("#form .resnum").text(d.data.resnum?d.data.resnum:0);
						$("#form .filenum").text(d.data.filenum?d.data.filenum:0);
						$("#form .apinum").text(d.data.apinum?d.data.apinum:0);
					}
				});
			}
		});
	}
	/*设备名称详情*/
	var equipmentDetail = function(para){
		var modal = base.modal({
			width:800,
			height:330,
			label:"详情",
			url:"../html/cdmaEvdoManage/equipmentNameDetail.html",
			buttons:[
				{
					label:"关闭",
					cls:"btn btn-info",
					clickEvent:function(){	
						/**3.关闭模态窗**/
						modal.hide();
					}
				}
			],
			callback:function(){
				var params = $(para).attr("cid");
				$.ajax({
					url:$.path+"/api/domain/findDomainEquipmentInnerDetailByIdInfo",
					type:"post",
					data:JSON.stringify({equipmentId:params,id:treeKey.id}),
					contentType:"application/json",
					success:function(d){
						$("#form .name").text(d.data.name);
						$("#form .publicIp").text(d.data.publicIp);
						$("#form .company").text(d.data.company);
						$("#form .contacts").text(d.data.contacts);
						$("#form .telphone").text(d.data.telphone);
						$("#form .resnum").text(d.data.resnum);
						$("#form .createTime").text(d.data.createTime);
						$("#form .dbnum").text(d.data.dbnum);
						$("#form .apinum").text(d.data.apinum);
						$("#form .filenum").text(d.data.filenum);
					}
				})
			}
		});
	}
	/*退出设备*/
	var quitEquipment = function(){
		var status = true;
		var params = base.getChecks("cb");
		if(params.length>1){
			base.requestTip().error("请选择一条数据")
			return false;
		} 
		$.ajax({
			url:$.path+"/api/domain/findThisDomainIsCurrentInfo?domainId="+params[0],
			type:"get",
			async:false,
			success:function(d){
				if(!d.data){
					status = false;
					base.requestTip().error("没权限操作！");
				}
			}
		})
		$.ajax({
			url:$.path+"/api/domain/findEquipmentIsDomainInnerInfo?domainId="+params[0],
			type:"get",
			async:false,
			success:function(d){
				if(!d.data){
					status = false;
					base.requestTip().error("设备不在该资源域无需退出");
				}
			}
		})
		if(status){
			base.confirm({
				confirmCallback:function(){
					common.submit({
						url:$.path+"/api/domain/quitResourceDomainInfo",
						params:{domainId:params[0]},
						callback:function(){
							setTreebar();
						}
					});
				},
				label:"警告信息",
				context:"是否解散该域？"
			});
		}		
	}
	/*维护设备*/
	var maintenanceEquipment = function(para){
		var modal = base.modal({
			width:800,
			height:400,
			label:"维护设备",
			url:"../html/cdmaEvdoManage/maintenanceEquipment.html",
			buttons:[
				{
					label:"确定",
					cls:"btn btn-info",
					clickEvent:function(){	
						var ids = [];
						$("#listAdd li").each(function(i,o){
							ids.push($(o).attr("cid"))
						})
						ids = ids.join(",")
						var params = {newListId:ids,domainId:treeKey.id}
						base.confirm({
							confirmCallback:function(){
								common.submit({
									url:$.path+"/api/domain/newEquipmentDomainInfo",
									params:params,
									callback:function(){
										modal.hide();
										setTreebar();
									}
								});
							},
							lable:"告警信息",
							context:"是否确定邀请"
						});
					}
				},
				{
					label:"关闭",
					cls:"btn btn-info",
					clickEvent:function(){	
						/**3.关闭模态窗**/
						modal.hide();
					}
				}
			],
			callback:function(){
			}
		});
	}
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