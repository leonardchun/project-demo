define(["base","app/commonApp"],function(base,common){
	var grid0=null, grid1=null, grid2=null, grid3=null, grid4=null;
	var modalId = $(".modal").attr("id");
	var requestParams = "";//请求参数
	//获取订阅申请信息
	var applyMsg = function(){
		var modalId = "f37acc0df62e41b7996f05094d933789"
		$.ajax({
			url:$.path+"/api/subscribeResource/getSubscribeById?id="+modalId,
			type:"get",
			async:false,
			success:function(result){
				//区分资源类型
				if(result.success=true && result.data){
					var resType = "";
					switch(result.data.resType){
						case "1": resType="DATA";break;
						case "2": resType="DOC";break;
						case "3": resType="API";break;
						default: resType="其他";break;
					}
					$.each(result.data,function(k,v){
						if(k=='resType'){
							$("#applyMsg .resType").html(resType)
						}else{
							$("#applyMsg ."+k).html(v)	
						}
						
					})
				}
				
			}
		})
	}
	//获取元数据信息
	function metaData(){
		var modalId = "f37acc0df62e41b7996f05094d933789"
		$.ajax({
			url:$.path+"/api/resCatalog/findResourceByID?id="+modalId,
			type:"get",
			success:function(result){
				if(result && result.data){
					if(null!=result.data.filePath){//图片
						$(".ui-page-headingImage").attr("src",result.data.filePath)
					}
					$(".ui-page-title .resName").html(result.data.resName);
					$.each(result.data,function(k,v){
						//资源类型
						var resType = "",resLevel="";
						$("#resMsg ."+k).html(v);
						if(k=="resType"){
							switch(v){
								case "1":resType = "DATA";break;
								case "2":resType = "DOC";break;
								case "3":resType = "API";break;
								case "4":resType = "其他";break;
							}
							$("#resMsg .resType").html(resType);
						}
						//资源登记
						if(k=="resLevel"){
							switch(v){
								case "1":resLevel="部分共享";break;
								case "2":resLevel="全部共享";break;
							}
							$("#resMsg .resLevel").html(resLevel);
						}
					})
				}
			}
		})
	}
	//请求参数和返回参数公用的渲染表格方法
	function paramTable(){
		var modalId = "f37acc0df62e41b7996f05094d933789";
		$.ajax({
			url:$.path+"/api/resCatalog/findResourceByID?id="+modalId,
			type:"get",
			success:function(result){
				if(result.data && result.data.apiJson){
					var apiJson = JSON.parse(result.data.apiJson);
					var requestTds = "",responseTds = "";
					$.each(apiJson.requestParams,function(index,item){
						var mandatory= "";
						if(item.mandatory=="0"){
							mandatory = "否";
						}else{
							mandatory = "是";
						}
						requestTds += "<td>"+item.name+"</td><td>"+item.type+"</td>"+
								"<td>"+mandatory+"</td><td>"+item.desc+"</td>"
					})
					$.each(apiJson.responseStruct,function(index,item){
						var notNull= "";
						if(item.notNull=="0"){
							notNull = "否";
						}else{
							notNull = "是";
						}
						responseTds += "<td>"+item.name+"</td><td>"+item.type+"</td>"+
								"<td>"+notNull+"</td><td>"+item.desc+"</td>"
					})
					$("#requestParams tbody").html("<tr>"+requestTds+"</tr>");
					$("#responseParams tbody").html("<tr>"+responseTds+"</tr>");
				}
			}
		})
	}
	//参数名称 - 入参处理策略
	function paramNames(){
		var options = "";
		var modalId = "f37acc0df62e41b7996f05094d933789";
		$.ajax({
			url:$.path+"/api/resCatalog/findResourceByID?id="+modalId,
			type:"get",
			async:false,
			success:function(result){
				if(result.data && result.data.length>0){
					var apiJson = JSON.parse(result.data.apiJson);
					if(apiJson.requestParams && apiJson.requestParams.length>0){
						debugger
						$.each(apiJson.requestParams,function(index,item){
							options += "<option value='"+item.type+"'>"+item.name+"</option>";
						})
					}
				}
			}
		})
		return options;
	}
	//获取数据项名称
	function getDataItemName(id){
		var options = "";
		$.ajax({
			url:"../json/checkJson/dataMsg.json",
			type:"get",
			async:false,
			success:function(result){
				if(result.data && result.data.length>0){
					$.each(result.data,function(index,item){
						if(item.id == id){
							options += "<option value='"+item.id+"' selected>"+item.name+"</option>"
						}else{
							options += "<option value='"+item.id+"'>"+item.name+"</option>"
						}
					})
				}
				
			}
		})
		return options;
	}
	//获取策略
	function getStrategy(id){
		var options = "";
		$.ajax({
			url:"../json/keywords/keyword.json",
			type:"get",
			async:false,
			success:function(result){
				if(result.data && result.data.length>0){
					$.each(result.data,function(index,item){
						if(item.id == id){
							options += "<option value='"+item.id+"' selected content='"+item.content+"'>"+item.name+"</option>"
						}else{
							options += "<option value='"+item.id+"' content='"+item.content+"'>"+item.name+"</option>"
						}
					})
				}
			}
		})
		return options;
	}
	//获取比较符
	function compareSymbol(id){
        var options = "";
        $.ajax({
            url:"../json/checkJson/compareSymbol.json",
            type:"get",
            async:false,
            success:function(result){
                if(result && result.length>0){
                    $.each(result,function(index,item){
                        if(item.id == id){
                            options += "<option value='"+item.id+"' selected  compareValue='"+item.compareValue+"'>"+item.name+"</option>"
                        }else{
                            options += "<option value='"+item.id+"' compareValue='"+item.content+"'>"+item.name+"</option>"
                        }
                    })
                }
            }
		})
		return options;
	}
	//获取敏感词过滤-content3
	var gridOptionP0 = {
		processing:true,
		serverSide:false,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		data:[],
		columns:[
			{"data":"columnName","sWidth":"20%"},
			{"data":"columnType","sWidth":"20%"},
			{"data":"strategyName","sWidth":"20%"},
			{"data":"strategyContent","sWidth":"20%"},
			{"data":"operate","sWidth":"20%"}
		],
		columnDefs:[
			{
				"render":function(data,type,row,meta){
					//获取参数名称
					return "<select class='form-control'>"+paramNames()+"</select>"
				},
				 "targets":0 
			},
//			{
//				"render":function(data,type,row,meta){
//					//获取参数类型
//					return "<select class='form-control'>"+getDataItemName(row.dataName)+"</select>"
//				},
//				 "targets":1 
//			},
			{
				"render":function(data,type,row,meta){
					//获取策略
					return "<select class='form-control strategy'>"+getStrategy(row.strategyName)+"<option value='-1' class='createStrategy'>新建一个策略</option></select>"
				},
				 "targets":2
			},
			{
				"render":function(data,type,row,meta){
					return "<button class='btn btn-link delete del1'><i class='fa fa-trash-o'></i></button>"
				},
				"targets":4
			}
		],
		drawCallback:function(setting){
			//改变策略
			$(".strategy").off().on("change",function(){
				if($(this).val()!=-1){
						var content = $(this).fsind("option:selected").attr("content");
						$(this).parent("td").next().html(content)
					}else{
						//新建一个策略
						createStrategy();
					}
				})
			//新增
			addRow();
			//删除
			deleteRow();
		}
	}
	//获取敏感词过滤
	var gridOptionP1 = {
		processing:true,
		serverSide:false,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
//		ajax:{
//			url:"../json/checkJson/sensitiveWordFilter.json",
//			type:"get"
//		},
		data:[],
		columns:[
			{"data":"resName","sWidth":"14%"},
			{"data":"dataName","sWidth":"14%"},
			{"data":"dataType","sWidth":"14%"},
			{"data":"fieldName","sWidth":"14%"},
			{"data":"strategyName","sWidth":"14%"},
			{"data":"content","sWidth":"20%"},
			{"data":"operate","sWidth":"10%"}
		],
		columnDefs:[
			{
				"render":function(data,type,row,meta){
					//获取数据项
					return "<select class='form-control'>"+getDataItemName(row.dataName)+"</select>"
				},
				 "targets":1 
			},
			{
				"render":function(data,type,row,meta){
					//获取策略
					return "<select class='form-control strategy'>"+getStrategy(row.strategyName)+"<option value='-1' class='createStrategy'>新建一个策略</option></select>"
				},
				 "targets":4 
			},
			{
				"render":function(data,type,row,meta){
					return "<button class='btn btn-link delete del1'><i class='fa fa-trash-o'></i></button>"
				},
				"targets":6
			}
		],
		drawCallback:function(setting){
			//改变策略
			$(".strategy").off().on("change",function(){
				if($(this).val()!=-1){
						var content = $(this).find("option:selected").attr("content");
						$(this).parent("td").next().html(content)
					}else{
						//新建一个策略
						createStrategy();
					}
				})
			//新增
			addRow();
			//删除
			deleteRow();
		}
	}
	//获取数据过滤
	var gridOptionP2 = {
		processing:true,
		serverSide:false,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		ajax:{
			url:"../json/checkJson/dataFilter.json",
			type:"get"
		},
		columns:[
			{"data":"resName","sWidth":"15%"},
			{"data":"dataName","sWidth":"15%"},
			{"data":"dataType","sWidth":"15%"},
			{"data":"fieldName","sWidth":"15%"},
			{"data":"compare","sWidth":"10%"},
			{"data":"compareValue","sWidth":"20%"},
			{"data":"operate","sWidth":"10%"}
		],
        columnDefs:[
            {
                "render":function(data,type,row,meta){
                    //获取数据项
                    return "<select class='form-control dataItem'>"+getDataItemName(row.dataName)+"</select>"
                },
                "targets":1
            },
            {
                "render":function(data,type,row,meta){
                    //获取比较符
                    return "<select class='form-control compare'>"+compareSymbol(row.compare)+"</select>"
                },
                "targets":4
            },
            {
                "render":function(data,type,row,meta){
                
                    //填写比较值
                    if(row.compareValue!=undefined){
                    	return "<input type='text' class='form-control' value='"+row.compareValue+"'>"
                    }else{
                    	return "<input type='text' class='form-control' value=''>"
                    }
                },
                "targets":5
            },
            {
                "render":function(data,type,row,meta){
                    return "<button class='btn btn-link delete del2'><i class='fa fa-trash-o'></i></button>"
                },
                "targets":6
            }
        ],
        drawCallback:function(setting){
			$("#data_filter .dataItem").off().on("click",function () {
				//修改数据项的时候更改比较符和比较值
            });
            $(".compare").off().on("change",function(){
            	//修改比较符的时候更改比较值
                if($(this).val()!=-1){
                    var compareValue = $(this).find("option:selected").attr("compareValue");
                    $(this).parent("td").next().html(compareValue)
                }
            })
            //新增
			addRow();
			//删除
			deleteRow();
        }
	}
	//获取数据脱敏
	var gridOptionP3 = {
		processing:true,
		serverSide:false,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		ajax:{
			url:"../json/checkJson/dataDesensitization.json",
			type:"get"
		},
		columns:[
			{"data":"resName","sWidth":"16%"},
			{"data":"dataName","sWidth":"16%"},
			{"data":"dataType","sWidth":"16%"},
			{"data":"fieldName","sWidth":"16%"},
			{"data":"showRule","sWidth":"25%"},
			{"data":"operate","sWidth":"11%"}
		],
        columnDefs:[
            {
                "render":function(data,type,row,meta){
                    //获取数据项
                    return "<select class='form-control'>"+getDataItemName(row.dataName)+"</select>"
                },
                "targets":1
            },
            {
                "render":function(data,type,row,meta){
					return "<span style='display:inline-block;margin-right:7px'><select class='form-control'><option value='1'>隐藏</option><option value='2'>保留</option></select></span>"+
							"<span style='display:inline-block;width:50px;position:relative;top:-1px'><input type='text' class='form-control'></span><span style='margin:0 5px'>到</span>"+
                        	"<span style='display:inline-block;width:50px;position:relative;top:-1px'><input type='text' class='form-control'></span><span style='margin:0 5px'>位</span>"
                },
                "targets":4
            },
            {
                "render":function(data,type,row,meta){
                    return "<button class='btn btn-link delete del3'><i class='fa fa-trash-o'></i></button>"
                },
                "targets":5
            }
		],
        drawCallback:function(setting){
			//新增
			addRow();
			//删除
			deleteRow();
		}
		
	}
	//获取数据转换
	var gridOptionP4 = {
		processing:true,
		serverSide:false,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		ajax:{
			url:"../json/checkJson/dataTransform.json",
			type:"get"
		},
		columns:[
			{"data":"resName","sWidth":"15%"},
			{"data":"dataName","sWidth":"15%"},
			{"data":"dataType","sWidth":"15%"},
			{"data":"fieldName","sWidth":"15%"},
			{"data":"content","sWidth":"15%"},
			{"data":"replace","sWidth":"15%"},
			{"data":"operate","sWidth":"10%"}
		],
		columnDefs:[
            {
                "render":function(data,type,row,meta){
                    //获取数据项
                    return "<select class='form-control dataItem'>"+getDataItemName(row.dataName)+"</select>"
                },
                "targets":1
            },
            {
                "render":function(data,type,row,meta){
                    //获取比较符
                    return "<input type='text' class='form-control'>"
                },
                "targets":4
            },
            {
                "render":function(data,type,row,meta){
                    //获取比较符
                    return "<input type='text' class='form-control'>"
                },
                "targets":5
            },
            {
                "render":function(data,type,row,meta){
                    return "<button class='btn btn-link delete del4'><i class='fa fa-trash-o'></i></button>"
                },
                "targets":6
            }
        ],
        drawCallback:function(setting){
        	//新增
			addRow();
			//删除
			deleteRow();
        }
	}
	//画表格		
	var setGrid = function(container,gridOption,num){
		var parent;
		parent = base.datatables({
			container:container,
			option:gridOption,
		});
		switch(num){
			//case 0:grid = parent;break;
			case 1:grid0 = parent;break;
			case 2:grid1 = parent;break;
			case 3:grid2 = parent;break;
			case 4:grid3 = parent;break;
			case 5:grid4 = parent;break;
		}
		
	}
	//新建策略
	var createStrategy=function(){
		var modal = base.modal({
			label:"新建策略",
			width:500,
			height:200,
			url:"../html/systemManage/keywordsFilter/create.html",
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
								grid3.reload();
							}
						})
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
	//点击新增一行
	function addRow(){
		$(".add").off().on("click",function(){
			var key = $(this).attr("data-key");
			var data1 = [
                {"resName":"1"},{"dataName":"11"},{"dataType":"1"},{"fieldName":"1"},
                {"strategyName":"1"},{"content":"1"},{"operate":"1"}
			]
			var data2 = [
				{"resName":"1"},{"dataName":"11"},{"dataType":"1"},{"fieldName":"1"},
                {"strategyName":"1"},{"content":"1"},{"operate":"1"}
			]
			var data3 = [
				{"resName":"1"},{"dataName":"11"},{"dataType":"1"},{"fieldName":"1"},
                {"strategyName":"1"},{"content":"1"},{"operate":"1"}
			]
			var data4 = [
				{"resName":"1"},{"dataName":"11"},{"dataType":"1"},{"fieldName":"1"},
                {"strategyName":"1"},{"content":"1"},{"operate":"1"}
			]
			switch(key){
				case "0":
				grid0.addRow(data1);break;
				case "1":
				grid1.addRow(data1);break;
				case "2":
				grid2.addRow(data1);break;
				case "3":
				grid3.addRow(data1);break;
				case "4":
				grid4.addRow(data1);break;
			}
		})
	}
	//点击删除一行
	function deleteRow(){
		$(".delete").off().on("click",function(){
			if($(this).hasClass("del1")){
				if($(this).parents("table").hasClass("sensitive_word_filter")){
					grid0.deleteRow(this)
				}else{
					grid1.deleteRow(this)
				}
			}else if($(this).hasClass("del2")){
				grid2.deleteRow(this)
			}else if($(this).hasClass("del3")){
				grid3.deleteRow(this)
			}else{
				grid4.deleteRow(this)
			}
		})
	}

	return {
		main:function(){
			applyMsg();
			metaData();
			paramTable()//获取请求参数表格和返回参数的表格
			//setGrid($("#dataMsg"),gridOption,0);////获取数据项信息
			setGrid($("#sensitive_word_filter"),gridOptionP0,1);////敏感词过滤
			setGrid($("#sensitive_word_filter_1"),gridOptionP1,2);////敏感词过滤
			setGrid($("#data_filter"),gridOptionP2,3);////数据过滤
			setGrid($("#data_desensitization"),gridOptionP3,4);////数据脱敏
			setGrid($("#data_transform"),gridOptionP4,5);////数据转换
		}
	}
})
