define(["base","app/commonApp","date"],function(base,common){
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
				url:$.path+"/api/log/findSysOperationLog",
				type:"get",
				contentType:"application/json",
				data:function(d){
					return common.getParams(d,$("#search-form"));
				}
		},
		columns:[
			{ "data": "moduleName","sWidth":"17%"},
			{ "data": "operateName","sWidth":"18%"},
			{ "data": "operateUser","sWidth":"17%"},
			{ "data": "operateIp","sWidth":"18%"},
			{ "data": "operateTime","sWidth":"18%"},
			{ "data": "result","sWidth":"17%"}
		],
		columnDefs:[	
			{"render":function(data,type,row,meta){
                 return row.operateUser?row.operateUser:"--"; 
              }, 
               "targets":2
            },
			{"render":function(data,type,row,meta){
                 return row.result=="true"?"成功":"失败"; 
              }, 
               "targets":5
            }
        ],
        drawCallback:function(setting){
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
		/**设置时间控件**/
		base.form.date({
			element:$(".date"),
			isTime:true
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
	};
	
	var setContent = function(){
		base.scroll({
			container:$(".ui-gridbar")
		});
	};
	return {
		main:function(){
			setContent();
			/**当调用main方法后(1个APP只能有1个main方法)，开始执行下列操作**/
			setGrid();
			setGridButton();
			setSearch();
			setReset();
		}
	};
});