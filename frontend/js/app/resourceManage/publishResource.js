define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var getButton = function(status,id,sign){
		var s = "";
		switch(status){
			
			case "3"://待发布
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button rid='"+id+"' type='subscribe' data-sign='"+sign+"' class='btn btn-warning check blockCenter'>发布</button><button class='btn btn-link blockCenter disabled'>撤销</button>"+
					"</div><button class='btn btn-link blockCenter disabled' >删除</button></div>"	
			break;
			
			case "5"://已发布
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button rid='"+id+"' type='subscribe' class='btn btn-warning check blockCenter'>修改</button><button class='btn btn-link blockCenter color-59b0fc'>撤销</button>"+
				    "<button class='btn btn-link disabled blockCenter'>删除</button><button class='btn btn-link disabled blockCenter'>发布</button></div>";
			break;
			
			case "6"://已撤销
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button class='btn btn-warning delect blockCenter'>删除</button><button class='btn btn-link blockCenter disabled'>撤销</button>"+
				    "<button class='btn btn-link blockCenter disabled'>发布</button></div>";
			break;
		}
		return s;
	};
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		pagingType: "full_numbers",
		ajax:{
				url:$.path+"/api/resource/findResResourceByPage",
				type:"get",
				contentType:"application/json",
				data:function(d){
					common.gridPageFliter(d);
					/**base库专门获取表单参数的方法**/
					var params = base.form.getParams($("#search-form"));
					var paramsA ;
					if(params){
						paramsA = $.extend({page:d.page,size:d.size},params); 
					}
					return paramsA; 
				}
		},
		columns:[
			{ "data": "data","sWidth":"100%"}
		],
		
		columnDefs:[ 
           {
				"render":function(data,type,row,meta){
//					var row = row.data;
//					var starCont = common.getStar(row.star);
					var buttons = getButton(row.state,row.id,row.resType);
//					var stars = ""; 
					var sign ="";
					var liContent = row.content;
					//row.star 星星
//					for(var i=1;i<=5;i++){
//						if(i<=row.star){
//							stars+="<i class='fa fa-star color-ff9b02'></i>";
//						}else{
//							stars+="<i class='fa fa-star'></i>";
//						}
//					}
					//sign type
					switch(row.resType){
						case "1": sign = "<span class='sign color-1e88e5'>"+row.resTypeName+"</span>";break;
						case "2": sign = "<span class='sign color-fe245c'>"+row.resTypeName+"</span>";break;
						case "3": sign = "<span class='sign color-f2c65d'>"+row.resTypeName+"</span>";break;
						case "其他": sign = "<span class='sign color-68baff'>"+row.resTypeName+"</span>";break;
					}
					if(row.abstracts.length>150){
						liContent = row.abstracts.substr(0,150)+"...";
					}else{
						liContent = row.abstracts;
					}
					//按钮
					var content = "<div class='ui-blockGrid-item'>"+
						"<ul>"+
							"<li type='photo' style='float:left;width:12%'>"+
								//"<div class='sign-box'><div style='background-color: #58dddb;border-color: #39cadb;'>data</div></div>"+
//								"<img src='"+row.pictureUrl+"'/>"+
								"<img src='../images/user_default.png'/>"+
//								"<div class='sign-box'>"+stars+"</div>"+
							"</li>"+
							"<li type='info' style='float:left;width:59%'>"+
								"<ul class='ui-blockGrid-content'>"+ //"<span class='ui-datetime'>（"+row.datetime+"）</span>"+
									"<li type='title'><a target='_blank' href='"+$.path+"/dssg-portal/index.html#/detail?type="+row.resType+"&id="+row.id+"'>"+row.resName+sign+"</a></li>"+
									"<li class='content'>"+liContent+"</li>"+
									"<li style='clear:both;padding-left:22px'>"+
										"<div class='classify'>"+row.subjectCarategoryName+"</div>"+
										"<div class='classify'>"+row.industryCategoryName+"</div>"+
									"</li>"+
								"</ul>"+
							"</li>"+
							"<li style='float:left;width:9%'>"+
								"<ul class='ui-blockGrid-content column-normal'>"+
									"<li type='title' class='color-777'>提供单位</li>"+
									"<li type='content'>"+row.companyName+"</li>"+
								"</ul>"+
							"</li>"+
							"<li style='float:left;width:9%'>"+
								"<ul class='ui-blockGrid-content column-normal'>"+
									"<li type='title' class='color-777'>申请状态</li>"+
									"<li type='content'>"+row.stateName+"</li>"+
								"</ul>"+
							"</li>"+
							"<li type='buttons' style='float:left;width:11%'>"+
								buttons+
							"<div class='ui-datetime'>"+row.createTime+"</div></li>"+
							
						"</ul>"+
					"</div>";
					return content; 
              	}, 
				"targets":0 
            } 
        ],
        drawCallback:function(setting){
        	//点击审批
        	doCheck();
        	//删除
        	doDele()
        	//撤销
        	doRevoke();
        }
	};
	//点击审批之后弹出步骤
	function doCheck(){ 
		
		$(".check").off().on("click",function(){
			debugger
			var url="";
			var sign = $(this).parent().attr("data-sign");
			//var rid = $(this).attr("rid");
			switch(sign){
				case "1":url="../html/resourceManage/publishResource/publishResource_publish_db.html";break;
				case "2":url="../html/resourceManage/publishResource/publishResource_publish_doc.html";break;
				case "3":url="../html/resourceManage/publishResource/publishResource_publish_api.html";break;
				case "其他":return;break;
			}
			modal = base.modal({
				label:"资源发布",
				width:1000,
				height:500,
				modalId:$(this).attr("rid"),
				url:url,
				drag:true,
				callback:function(){
					setSteps(sign);
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
								case 3:
									return true;
								case 4:
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
						var params = {}
						switch(sign){
							case "DATA":
							;
							break;
							case "DOC": //如果是doc只需要保存审批结果和审批意见
							params = {"applyResult":$(".doc .applyResult").val(),"applyopinion":$(".applyopinion").val()}
							break;
							case "API":
							;
							break;
						}
						
						
						/**校验最后一步的表单**/
						//var isPass = base.form.validate({form:$("#form4"),checkAll:true});
						/**提交表单**/
						
						/**刷新父层列表**/
						common.search(grid);
						modal.hide();
					}
				}
				]
			})
		})
	}
		//设置步骤插件
	var setSteps = function(sign){
		var data=[];
		switch(sign){
			case "DATA":
			data =[
				{"label":"选择数据源","contentToggle":"#content1"},
				{"label":"关联数据表","contentToggle":"#content2"},
				{"label":"数据项转换","contentToggle":"#content3"},
				{"label":"配置更新","contentToggle":"#content4"},
				{"label":"发布预览","contentToggle":"#content5"}
			];
			break;
			case "DOC":
			data =[
				{"label":"选择数据源","contentToggle":"#content1"},
				{"label":"选择文件","contentToggle":"#content2"},
				{"label":"发布预览","contentToggle":"#content3"}
			];
			break;
			case "API":
			data =[
				{"label":"选择数据源","contentToggle":"#content1"},
				{"label":"关联数据表","contentToggle":"#content2"},
				{"label":"输入参数","contentToggle":"#content3"},
				{"label":"输出参数","contentToggle":"#content4"},
				{"label":"接口方式","contentToggle":"#content5"},
				{"label":"发布预览","contentToggle":"#content6"}
			];
			break;
			//case "其他":return;break;
		}
		steps = base.steps({
			container:$("#ui-steps"),
			data:data,
			buttonGroupToggle:modal.modalFooter
		})
		
	}
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
	
	//发布目录
	var publishingList= function(){

		$.ajax({
			type:"get",
			url:$.path+"/api/catalog/findDomainResCataLogInfo?name=catalogId&type=1",
			success:function(data){
				base.template({
					container:$(".catalogId"),
					templateId:"catalogId-tpl",
					data:data.data
				})
			}
		})
	}
	
	//点击删除
	function doDele(){
		$(".delect").off().on("click",function(){ 
			var params = {id:$(this).parent().attr("rid")};
			base.confirm({
				label:"删除",
				text:"<div style='text-align:center;font-size:13px;'>确定删除?</div>",
				confirmCallback:function(){
					common.submit({
						url:$.path+"/api/resCatalog/deleteResourceById",
						params:params,
						type:"get",
						callback:function(){
							common.search(grid);
						}
					});
				}
			})
		})
	}
	
	//点击撤销
	function doRevoke(){
		$(".revoke").off().on("click",function(){
			var resType = $(this).parent().attr("data-sign");
			var params = {resourceId:$(this).parent().attr("rid"),resType:resType};
			base.confirm({
				label:"撤销",
				text:"<div style='text-align:center;font-size:13px;'>确定撤销?</div>",
				confirmCallback:function(){
					common.submit({
						url:$.path+"/api/resource/revokePublication",
						params:params,
						type:"get",
						callback:function(){
							common.search(grid);
						}
					});
				}
			})
		})
	}
	
	var setLinkGroup = function(){
		$(".ui-grid-linkGroup li").on("click",function(){
			$(".ui-grid-linkGroup .active").removeClass("active");
			$(this).addClass("active");
			var key = $(this).attr("key");
			$("#status").val(key);
			common.search(grid);
		});
	};
	
	var setContent = function(){
		base.scroll({
			container:$(".ui-gridbar")
		});
	};
	return {
		main:function(){
			setContent();
			setGrid();
			setLinkGroup();
			setSearch();
			setReset();
			publishingList()
		}
	};
});