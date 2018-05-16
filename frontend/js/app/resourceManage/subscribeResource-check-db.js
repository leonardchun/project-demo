define(["base","app/commonApp"],function(base,common){
	//获取数据项信息
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		ajax:{
			url:"../json/checkJson/dataMsg.json",
			type:"get"
		},
		columns:[
			{ "data": "id","sWidth":"5%"},
			{ "data": "name","sWidth":"15%"},
			{ "data": "englishName","sWidth":"20%"},
			{ "data": "code","sWidth":"15%"},
			{ "data": "type","sWidth":"15%"},
			{ "data": "length","sWidth":"15%"},
			{ "data": "sign","sWidth":"15%"}
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' disabled checked name='cb' value='"+row.id+"' class='cb' cid='"+row.id+"'/>"; 
              }, 
               "targets":0 
            }
        ],
	}
	//获取订阅申请信息
	var applyMsg = function(){
		$.ajax({
			url:"../json/checkJson/reqMsg.json",
			type:"get",
			success:function(result){
				$.each(result,function(k,v){
					$("#applyMsg ."+k).html(v)
				})
			}
		})
	}
	//获取元数据信息
	function metaData(){
		$.ajax({
			url:"../json/checkJson/metaDataMsg.json",
			type:"get",
			success:function(result){
				$.each(result,function(k,v){
					$("#resMsg ."+k).html(v)
				})
			}
		})
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
	//获取敏感词过滤
	var gridOptionP1 = {
		processing:true,
		serverSide:false,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		ajax:{
			url:"../json/checkJson/sensitiveWordFilter.json",
			type:"get"
		},
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
			case 0:grid = parent;break;
			case 1:grid1 = parent;break;
			case 2:grid2 = parent;break;
			case 3:grid3 = parent;break;
			case 4:grid4 = parent;break;
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
				grid1.deleteRow(this)
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
			setGrid($("#dataMsg"),gridOption,0);////获取数据项信息
			setGrid($("#sensitive_word_filter"),gridOptionP1,1);////敏感词过滤
			setGrid($("#data_filter"),gridOptionP2,2);////数据过滤
			setGrid($("#data_desensitization"),gridOptionP3,3);////数据脱敏
			setGrid($("#data_transform"),gridOptionP4,4);////数据转换
		}
	}
})
