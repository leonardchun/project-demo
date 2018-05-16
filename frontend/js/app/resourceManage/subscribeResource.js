define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var getButton = function(status,id,sign){
		var s = "";
		//根据状态判断显示的按钮 1待审核-审批 2已审核-评论、撤销 3已拒绝-删除 4已撤销-删除 5已失效-删除
//		buttons += "<button class='btn btn-warning comment'>评论</button>"+
//								"<div class='revoke color-59b0fc'>撤销</div><div class='cancel color-59b0fc'>删除</div>"+
//								"<div class='ui-datetime'>"+row.datetime+"</div>"
		switch(status){
			case "1"://待审核
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button class='btn btn-link blockCenter disabled'>撤销</button><button class='btn btn-link blockCenter disabled'>评价</button>"+
					"<button class='btn btn-link blockCenter disabled' >删除</button></div>"	
			break;
			
			case "2"://已审核
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button class='revoke btn blockCenter btn-warning'>撤销</button><button class='btn btn-link blockCenter doComment color-59b0fc'>评价</button>"+
					"<button class='btn btn-link blockCenter disabled'>删除</button></div>";
			break;
			
			case "3"://已拒绝
				s =	"<div rid='"+id+"' data-sign='"+sign+"'><button class='btn btn-warning delect'>删除</button><button class='btn btn-link blockCenter disabled'>撤销</button>"+
				    "<button class='btn btn-link blockCenter disabled'>评论</button></div>";
			break;
			
			case "4"://已撤销
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button class='btn btn-warning delect'>删除</button><button class='btn btn-link blockCenter disabled'>撤销</button>"+
				    "<button class='btn btn-link blockCenter disabled'>评论</button></div>";
			break;
			case "5"://已失效
				s = "<div rid='"+id+"' data-sign='"+sign+"'><button class='btn btn-warning delect'>删除</button><button class='btn btn-link blockCenter disabled'>撤销</button>"+
				    "<button class='btn btn-link blockCenter disabled'>评论</button></div>";
					
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
			url:$.path+"/api/subscribeResource/findMySubscribeResourcePage",
			type:"get",
			data:function(d){
				/**base库专门获取表单参数的方法**/
				common.gridPageFliter(d);
				var params = base.form.getParams($("#search-form"));
				if(params.state == "0"){
					delete params["state"];
				}
				if(params){
					var paramaA = $.extend({page:d.page,size:d.size},params); 
				}
				return paramaA; 
			}
		},
		columns:[
			{ "data": "data","sWidth":"100%"}
		],
		
		columnDefs:[ 
           {
				"render":function(data,type,row,meta){
//					var starCont = common.getStar(row.star);
					var buttons = getButton(row.state,row.id,row.resType);
					var sign ="";
					var liContent = row.content;
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
//					var apiApplication = row.resType == 3?"<li>"+row.xxx+"</li>":'';//api时显示申请应用的名称
					var content = "<div class='ui-blockGrid-item'>"+
						"<ul>"+
							"<li type='photo' style='float:left;width:12%'>"+
								//"<div class='sign-box'><div style='background-color: #58dddb;border-color: #39cadb;'>data</div></div>"+
//								"<img src='"+row.subjectPictureUrl+"'/>"+
								"<img src='../images/user_default.png'/>"+
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
									"<li type='content'>"+row.publishDept+"</li>"+
//									apiApplication+
									"<li class='viewApplication' cid='"+row.id+"' style='cursor:pointer;color:#59b0fc' type='viewApplication'>查看申请</li>"+
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
							"<div class='ui-datetime'>"+row.applyTime+"</div></li>"+
						"</ul>"+
					"</div>";
					return content; 
              	}, 
				"targets":0 
            } 
        ],
        drawCallback:function(setting){
        	//点击审批
//      	doCheck();
        	//点击删除
        	doDele()
        	//点击撤销
        	revoke()
        	//点击评论
        	doComment();
        	//点击查看申请
        	viewApplication();
        }
	};
	
	
	//点击审批之后弹出步骤
//	function doCheck(){ 
//		
//		$(".check").off().on("click",function(){
//			
//			var url="";
//			var sign = $(this).attr("data-sign");
//			//var rid = $(this).attr("rid");
//			switch(sign){
//				case "DATA":url="../html/resourceManage/subscribeResource_check_db.html";break;
//				case "DOC":url="../html/resourceManage/subscribeResource_check_doc.html";break;
//				case "API":url="../html/resourceManage/subscribeResource_check_api.html";break;
//				case "其他":return;break;
//			}
//			modal = base.modal({
//				label:"资源订阅审批",
//				width:1000,
//				height:500,
//				modalId:$(this).attr("rid"),
//				url:url,
//				drag:true,
//				callback:function(){
//					setSteps(sign);
//				},
//				buttons:[
//						{
//							label:"上一步",
//							id:"step_back",
//							cls:"btn btn-info back",
//							style:"display:none",
//							clickEvent:function(obj){
//								steps.back();
//							}
//						},
//					{
//					label:"下一步",
//					id:"step_forward",
//					cls:"btn btn-info forward",
//					style:"display:none",
//					clickEvent:function(){
//						steps.forward(function(){
//							var step = steps.getStep();
//							switch(step){
//								case 0:
//									var isPass = base.form.validate({form:$("#form1"),checkAll:true});
//									return isPass;
//								break;
//								
//								case 1:
//									var isPass = base.form.validate({form:$("#form2"),checkAll:true});
//									return isPass;
//								break;
//								
//								case 2:
//									return true;
//								case 3:
//									return true;
//								case 4:
//									return true;
//								break;
//								
//							}
//						});
//					}
//				},
//				{
//					label:"保存",
//					id:"step_confirm",
//					cls:"btn btn-info confirm",
//					style:"display:none",
//					clickEvent:function(){
//						var params = {}
//						switch(sign){
//							case "DATA":
//							;
//							break;
//							case "DOC": //如果是doc只需要保存审批结果和审批意见
//							params = {"applyResult":$(".doc .applyResult").val(),"applyopinion":$(".applyopinion").val()}
//							break;
//							case "API":
//							;
//							break;
//						}
//						
//						
//						/**校验最后一步的表单**/
//						//var isPass = base.form.validate({form:$("#form4"),checkAll:true});
//						/**提交表单**/
//						
//						/**刷新父层列表**/
//						common.search(grid);
//						modal.hide();
//					}
//				}
//				]
//			})
//		})
//	}
	//点击删除
	function doDele(){
		$(".delect").off().on("click",function(){
			var params = {id:$(this).parent().attr("rid")};
			base.confirm({
				label:"删除",
				text:"<div style='text-align:center;font-size:13px;'>确定删除?</div>",
				confirmCallback:function(){
					common.submit({
						url:$.path+"/api/subscribeResource/deleteSubscribe",
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
	function revoke(){
		$(".revoke").off().on("click",function(){
			var resType = $(this).parent().attr("data-sign");
//			var resType;
//			if(sign == "DATA"){resType=1}else if(sign =="DOC"){resType=2}else{resType=3}
			var params = {subscribeId:$(this).parent().attr("rid"),resType:resType};
			base.confirm({
				label:"撤销",
				text:"<div style='text-align:center;font-size:13px;'>确定撤销?</div>",
				confirmCallback:function(){
					common.submit({
						url:$.path+"/api/subscribeResource/revokeSubscribe",
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
	//评论
	var doComment = function(){
		$(".doComment").off().on("click",function(){
//			alert("jjjjj")
		})
	}
	//点击查看
	var setSteps1 = function(state,resType){
		if(state =="1"){
			state = "1"
		}else{
			state="2"
		}
		$(".cont").removeClass("hidden").addClass("hidden");
		$("#content"+state).removeClass("hidden");
		if(resType == "3"){
			$(".apiformExample").show();
		}else{
			$(".formExample").show();
		}

		var steps = base.steps({
			container:$("#ui-steps"),
			data:[
				{"label":"申请订阅","contentToggle":"#content0"},
				{"label":"订阅审批","contentToggle":"#content1"},
				{"label":"完成订阅","contentToggle":"#content2"}
			],
			buttons:[],
			currentStep:parseInt(state),/**初始化在第几步,默认是0**/
		});
	};
	
	var viewApplication = function(){
		$(".viewApplication").off().on("click",function(){
			var params = {'id':$(this).attr("cid")};
			var modal = base.modal({
				width:1000,
				height:460,
				label:"订阅流程信息",
				url:"../html/resourceManage/checkApplication.html",
				callback:function(){
					base.ajax({
						url:$.path+"/api/subscribeReview/subscriptionApprovalProcessView",
						type:"post",
						params:params,
						success: function(data) {
							if(data.code =="0"){
								var data = data.data[0];
								setSteps1(data.state,data.resType);
								for(var k in data){
									if(data.resType == "3"){
										var dom = $(".apiformExample");
									}else{
										var dom = $(".formExample");
									}
									if(data[k]){
										if(k=="resType"){
											var value = data[k]=="1"?"数据库":data[k]=="2"?"文件":"API"
											dom.find("."+k).html(value);
										}else if(k == "model"){
											var value = data[k]=="1"?"完全":data[k]=="2"?"映射":"";
											dom.find("."+k).html(value);
										}else{
											dom.find("."+k).html(data[k]);
										}
									}else{
										dom.find("."+k).html('--');
									}
								}
							}
						},
						error:function(data){
	//						console.log(data)
						}
					})
				},
				buttons:[
				{
					label:"返回",
					cls:"btn btn-info",
					clickEvent:function(){
						modal.hide();
					}
				}]
			})
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
	
	var searchCataLogInfo = function(){

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
//		//设置步骤插件
//	var setSteps = function(sign){
//		var data=[];
//		switch(sign){
//			case "DATE":
//			data =[
//				{"label":"查看请求方信息","contentToggle":"#content1"},
//				{"label":"查看元数据信息","contentToggle":"#content2"},
//				{"label":"数据处理策略","contentToggle":"#content3"},
//				{"label":"填写审批意见","contentToggle":"#content4"}
//			];
//			break;
//			case "DOC":
//			data =[
//				{"label":"查看请求方信息","contentToggle":"#content1"},
//				{"label":"查看元数据信息","contentToggle":"#content2"},
//				{"label":"填写审批意见","contentToggle":"#content3"}
//			];
//			break;
//			case "API":
//			data =[
//				{"label":"查看请求方信息","contentToggle":"#content1"},
//				{"label":"查看元数据信息","contentToggle":"#content2"},
//				{"label":"入参处理策略","contentToggle":"#content3"},
//				{"label":"出参处理策略","contentToggle":"#content4"},
//				{"label":"服务控制策略","contentToggle":"#content5"},
//				{"label":"填写审批意见","contentToggle":"#content6"}
//			];
//			break;
//			//case "其他":return;break;
//		}
//		steps = base.steps({
//			container:$("#ui-steps"),
//			data:data,
//			buttonGroupToggle:modal.modalFooter
//		})
//		
//	}
	return {
		main:function(){
			searchCataLogInfo();
			setContent();
			setGrid();
			setLinkGroup();
			setSearch();
			setReset();
		}
	};
});