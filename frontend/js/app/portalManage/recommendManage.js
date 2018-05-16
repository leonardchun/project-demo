define(["base","app/commonApp"],function(base,common){
	//表格参数
	var grid = null;
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
				url:$.path+"/api/portal/resource/findResResourceByPage",
				type:"get",
				contentType:"application/json",
				data:function(d){
					common.gridPageFliter(d);
//					/**base库专门获取表单参数的方法**/
					var params = base.form.getParams($("#search-form"));
					var objectA;
					if($.cookie("dssgUserInfo")){
						var tokenAll = $.cookie("dssgUserInfo");
						var equipment = JSON.parse(tokenAll).loginUserProfileDTO.currentEquipment.token;
					}
					if(params){
						objectA = $.extend({equipment:equipment?equipment:"0",page:d.page,size:d.size},params);
					}
					return JSON.stringify(objectA) 
					
				}
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			/*{ "data": "id","sWidth":"8%"},*/
			{ "data": "resName","sWidth":"15%"},
			{ "data": "resCode","sWidth":"15%"},
			{ "data": "themeName","sWidth":"14%"},
			{ "data": "industryTypeName","sWidth":"14%"},
			{ "data": "resTypeName","sWidth":"14%"},
			{ "data": "publishDept","sWidth":"11%"},
			{ "data": "hot","sWidth":"10%"}
		],
		columnDefs:[ 
	        {"render":function(data,type,row,meta){
	        	
	               return "<div class='checkboxWrapper'><input type='checkbox' name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/></div>"; 
	              }, 
	               "targets":0 
	        },
            {"render":function(data,type,row,meta){
            	if(row.resName){
	            	var resName="";
		            if(row.resName.length>10){
		             	resName = row.resName.substr(0,10)+"..."
		            }else{
		            	resName = row.resName;
		            }
	                return "<div title='"+row.resName+"'>"+resName+"</div>";
               }else{
               	  return "--"
               }
            }, 
               "targets":1
            },
            {"render":function(data,type,row,meta){
            	if(row.resCode){
	            	var resCode="";
		            if(row.resCode.length>10){
		             	resCode = row.resCode.substr(0,10)+"..."
		            }else{
		            	resCode = row.resCode;
		            }
	                return "<div class='handCursor' title='"+row.resCode+"'>"+resCode+"</div>";
               }else{
               	 return "--"
               }
            }, 
               "targets":2
            },
            {"render":function(data,type,row,meta){
            	if(row.themeName){
            		var themeName="";
		            if(row.themeName.length>10){
		             	themeName = row.themeName.substr(0,10)+"..."
		            }else{
		            	themeName = row.themeName;
		            }
	                return "<div class='handCursor' title='"+row.themeName+"'>"+themeName+"</div>";
               }else{
               		return "--"
               }
            }, 
               "targets":3
            },
            {"render":function(data,type,row,meta){
            	if(row.publishDept){
	            	var industryTypeName="";
		            if(row.industryTypeName.length>10){
		             	industryTypeName = row.industryTypeName.substr(0,10)+"..."
		            }else{
		            	industryTypeName = row.industryTypeName;
		            }
	                return "<div class='handCursor' title='"+row.industryTypeName+"'>"+industryTypeName+"</div>";
              	}else{
               		return "--"
               	}
            }, 
               "targets":4
            },
            {"render":function(data,type,row,meta){
            	if(row.publishDept){
	            	var publishDept="";
		            if(row.publishDept.length>10){
		             	publishDept = row.publishDept.substr(0,10)+"..."
		            }else{
		            	publishDept = row.publishDept;
		            }
	                return "<div class='handCursor' title='"+row.publishDept+"'>"+publishDept+"</div>" ;
               	}else{
               		return "--"
               	}
            }, 
               "targets":6
            },
            {"render":function(data,type,row,meta){
            	switch(row.hot){
            		case "0":return "否";break;
            		case "1":return "是";break;
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
	//画表格
	var setGrid = function(){
		grid = base.datatables({
			container:$("#hot"),
			option:gridOption,
			filter:common.gridFilter
		});
	};
	//公共渲染select框
	function getSelectCommon(data){
		var options = "<option value='-1'>*请选择*</option>";
		$.each(data.data,function(k,v){
			options += "<option value='"+v.id+"'>"+v.text+"</option>"
		})
		return options;
	}
	//获取资源类型
	function getResType(){
		base.ajax({
			url:$.base+"/json/resType.json",
			type:"get",
			success:function(data){
				$("#resType").html(getSelectCommon(data))
			}
		})
	}
	//获取主题分类
	function getThemes(){
		base.ajax({
//			url:$.base+"/json/themeType.json",
			url:$.path+"/api/sysBussinessDictionary/findDictionaryByType",
			data:{name:"themeType",type:1},
			type:"post",
			success:function(data){
			
				if (JSON.stringify(data.data) == "{}") {
					var options = "<option value='-1'>*请选择*</option>";
					$("#themePanels").html(options)
				} else{
					var options = "<option value='-1'>*请选择*</option>";
					var themeType = data.data.themeType;
					$.each(themeType,function(k,v){
						options += "<option value='"+v.id+"'>"+v.label+"</option>"
					})
					$("#themePanels").html(options)
				}
				
			}
		})
	}
	//获取热门推荐
	function getHot(){
		base.ajax({
			url:$.base+"/json/popularRecommend.json",
			type:"get",
			success:function(data){
				$("#popularRecommend").html(getSelectCommon(data))
			}
		})
	}
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
	/**修改推荐设置**/
	var hotModify = function(){
		var params = {"cid":$(".ui-grid .cb:checked").attr("cid")};
		var modal = base.modal({
			width:600,
			height:100,
			label:"推荐设置",
			url:"../html/portalManage/modify.html",
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
										url:"/api/portal/resource/updateResource",
										params:params,
										type:"post",
										callback:function(){
											common.search(grid);
										}
									})
									modal.hide();
//									common.search(grid);
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
		})
	}
	//设置表格各个按钮的操作
	var setGridButton = function(){
		$(".ui-grid-buttonbar .modify").on("click",function(){
			if($(this).hasClass("disabled")){
				return;
			}else{
				hotModify();
			}
		});
	}
	return{
		main:function(){
			setGrid();//画表格
			getResType();//获取资源类型
			getThemes();//获取主题分类
			getHot();//获取热门推荐
			setSearch();//查询
			setReset();//重置
			setGridButton();
		}
	}
})
