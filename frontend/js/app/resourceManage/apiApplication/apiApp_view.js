define(["base","app/commonApp"],function(base,common){
	//表格
	var grid = null;
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		paging:false,
		info:false,
		pagingType: "full_numbers",
		ajax:{
			url:"../json/resourceManage/viewResDetail.json",
			type:"get"
		},
		columns:[
			{ "data": "name","sWidth":"15%"},
			{ "data": "source","sWidth":"15%"},
			{ "data": "applicationTime","sWidth":"15%"},
			{ "data": "reqPeriod","sWidth":"15%"},
			{ "data": "maxRequest","sWidth":"15%"},
			{ "data": "maxBank","sWidth":"15%"},
			{ "data": "status","sWidth":"10%"}
		],
		columnDefs:[],
		drawCallback:function(setting){
			
		}
	}
	//画表格
	var setGrid = function(){
		grid = base.datatables({
			container:$("#viewTable"),
			option:gridOption //,
			//filter:common.gridFilter
		});
	};
	return {
		main:function(){
			setGrid();
		}
	}
})
