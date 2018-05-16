define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var getButton = function(status,id,sign){
		var s = "";
		//根据状态判断显示的按钮 1待审核-审批 2已审核-评论、撤销 3已拒绝-删除 4已撤销-删除 5已失效-删除
//		buttons += "<button class='btn btn-warning comment'>评论</button>"+
//								"<div class='undo color-59b0fc'>撤销</div><div class='cancel color-59b0fc'>删除</div>"+
//								"<div class='ui-datetime'>"+row.datetime+"</div>"
		switch(status){
			case 1://待审核
				s = "<div class='occupied'>撤销</div><button rid='"+id+"' type='subscribe' data-sign='"+sign+"' class='btn btn-warning check'>审批</button>"+
					"<div class='occupied'>删除</div>"	
			break;
			
			case 2://已审核
				s = "<button rid='"+id+"' type='subscribe' class='btn btn-warning'>评论</button>"+
					"<div class='undo color-59b0fc'>撤销</div><div class='cancel color-59b0fc'>删除</div>";
			break;
			
			case 3://已拒绝
				s =	"<div class='occupied'>撤销</div><div class='cancel color-59b0fc'>删除</div>"+
				    "<button class='occupied'>评论</button>";
			break;
			
			case 4://已撤销
				s = "<div class='occupied'>撤销</div><div class='cancel color-59b0fc'>删除</div>"+
				    "<button class='occupied'>评论</button>";
			break;
			case 5://已失效
				s = "<div class='occupied'>撤销</div><div class='cancel color-59b0fc'>删除</div>"+
				    "<button class='occupied'>评论</button>";
					
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
				url:"../json/resourceManage/subscribeResource.json",
				type:"get",
				contentType:"application/json",
				data:function(d){
					/**base库专门获取表单参数的方法**/
					var params = base.form.getParams($("#search-form"));
					/**传统jquery的序列化**/
					//var params = $("#form").serialize();
					if(params){
						$.extend(d,params); 
					}
					return JSON.stringify(d); 
				}
		},
		columns:[
			{ "data": "data","sWidth":"100%"}
		],
		
		columnDefs:[ 
           {
				"render":function(data,type,row,meta){
					var row = row.data;
					var starCont = common.getStar(row.star);
					var buttons = getButton(row.status,row.id,row.sign); //getButton(row.status,row.id);
					var stars = ""; 
					var sign ="";
					var liContent = row.content;
					//row.star 星星
					for(var i=1;i<=5;i++){
						if(i<=row.star){
							stars+="<i class='fa fa-star color-ff9b02'></i>";
						}else{
							stars+="<i class='fa fa-star'></i>";
						}
					}
					//sign type
					switch(row.sign){
						case "DATA": sign = "<span class='sign color-1e88e5'>"+row.sign+"</span>";break;
						case "DOC": sign = "<span class='sign color-fe245c'>"+row.sign+"</span>";break;
						case "API": sign = "<span class='sign color-f2c65d'>"+row.sign+"</span>";break;
						case "其他": sign = "<span class='sign color-68baff'>"+row.sign+"</span>";break;
					}
					if(row.content.length>150){
						liContent = row.content.substr(0,150)+"...";
					}else{
						liContent = row.content;
					}
					var content = "<div class='ui-blockGrid-item'>"+
						"<ul>"+
							"<li type='photo' style='float:left;width:12%'>"+
								//"<div class='sign-box'><div style='background-color: #58dddb;border-color: #39cadb;'>data</div></div>"+
								"<img src='"+row.photo+"'/>"+
								"<div class='sign-box'>"+stars+"</div>"+
							"</li>"+
							"<li type='info' style='float:left;width:59%'>"+
								"<ul class='ui-blockGrid-content'>"+ //"<span class='ui-datetime'>（"+row.datetime+"）</span>"+
									"<li type='title'><a target='_blank' href='resourceManage/resource_detail.html?id="+row.id+"'>"+row.title+sign+"</a></li>"+
									"<li class='content'>"+liContent+"</li>"+
									"<li style='clear:both;padding-left:22px'>"+
										"<div class='classify'>"+row.themeClassify+"</div>"+
										"<div class='classify'>"+row.vacationClassify+"</div>"+
									"</li>"+
								"</ul>"+
							"</li>"+
							"<li style='float:left;width:9%'>"+
								"<ul class='ui-blockGrid-content column-normal'>"+
									"<li type='title' class='color-777'>提供单位</li>"+
									"<li type='content'>"+row.provideUnit+"</li>"+
								"</ul>"+
							"</li>"+
							"<li style='float:left;width:9%'>"+
								"<ul class='ui-blockGrid-content column-normal'>"+
									"<li type='title' class='color-777'>申请状态</li>"+
									"<li type='content'>"+row.applicationStatus+"</li>"+
								"</ul>"+
							"</li>"+
							"<li type='buttons' style='float:left;width:11%'>"+
								buttons+
							"</li>"+
						"</ul>"+
					"</div>";
					return content; 			
              	}, 
				"targets":0 
            } 
        ],
        drawCallback:function(setting){
        	doPublish();//点击审批
        	$(".see-application").click(function(){
        		catalog();
        	})
        }
	};
	//点击审批之后弹出步骤
	function doPublish(){
		$(".check").off().on("click",function(){
			var url="";
			var sign = $(this).attr("data-sign");
			//var rid = $(this).attr("rid");
			switch(sign){
				case "DATA":url="../html/resourceManage/subscribeResource_check_db.html";break;
				case "DOC":url="../html/resourceManage/subscribeResource_check_doc.html";break;
				case "API":url="../html/resourceManage/subscribeResource_check_api.html";break;
				case "其他":return;break;
			}
			modal = base.modal({
				label:"资源订阅审批",
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
	var setGrid = function(){
		grid = base.datatables({
			container:$("#example"),
			option:gridOption
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
	/*查看申请*/
	var catalog = function(){
		modal = base.modal({
			width:900,
			height:450,
			label:"查看",
			url:"../html/resourceManage/subscribeExamine_step.html",
			callback:function(){
				setSteps();
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
	//设置步骤插件
	var setSteps = function(sign){
		var data=[];
		switch(sign){
			case "DATA":
			data =[
				{"label":"查看请求方信息","contentToggle":"#content1"},
				{"label":"查看元数据信息","contentToggle":"#content2"},
				{"label":"数据处理策略","contentToggle":"#content3"},
				{"label":"填写审批意见","contentToggle":"#content4"}
			];
			break;
			case "DOC":
			data =[
				{"label":"查看请求方信息","contentToggle":"#content1"},
				{"label":"查看元数据信息","contentToggle":"#content2"},
				{"label":"填写审批意见","contentToggle":"#content3"}
			];
			break;
			case "API":
			data =[
				{"label":"查看请求方信息","contentToggle":"#content1"},
				{"label":"查看元数据信息","contentToggle":"#content2"},
				{"label":"入参处理策略","contentToggle":"#content3"},
				{"label":"出参处理策略","contentToggle":"#content4"},
				{"label":"服务控制策略","contentToggle":"#content5"},
				{"label":"填写审批意见","contentToggle":"#content6"}
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
		}
	};
});