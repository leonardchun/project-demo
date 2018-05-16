define(["base","app/commonApp"],function(base,common){
	var grid = null;
	var treeData = null;
	var treekey = null;
	var treeClickEvent = function(event,treeId,treeNode){
		treekey = treeNode;
		$(treeData).each(function(i,o){
			if(treeNode.id==o.id){
				if(!grid){
					setGrid();
				}else{
					common.search(grid);
				}
			}
		});
	};
	var setModalTreebar = function(){
		base.ajax({
			url:$.path+"/api/sysBussinessDictionary/findDictionaryTreeByType",
			type:"post",
			params:{name:"getMetaType",type:3},
			contentType:"application/json",
			success:function(data){
				data.data.push({id:"DICTIONARY-FIXE-LEVEL-ONE-000003",pid:-1,name:"全部"})
				treeData = data.data;
				tree = base.tree({
					container:$("#modalTreebar"),
					setting:{
							data: {
								simpleData: {
									enable: true
								}
							},
							callback:{
								onClick:treeClickEvent
							}
					},
					data:common.mergeTreeData(treeData,"-1"),
					selectNodeId:"DICTIONARY-FIXE-LEVEL-ONE-000003"
				});
				
			},
			beforeSend:function(){
				base.loading($("#modalTreebar"));
			}
		});
		base.scroll({
			container:$("#optTable")
		});
	};
	var gridOption = {
		processing:true,
		serverSide:true,
		searching:false,
		ordering:false,
		lengthChange:false,
		ajax:{
				url:$.path+"/api/resDataElement/findDataElementList",
				type:"post",
				contentType:"application/json",
				data:function(d){
					return JSON.stringify({id:treekey.id,nameOrCodeOrENameOrCompany:$("#codeNameC").val()});
				}
		},
		columns:[
			{"data": "id","sWidth":"3%"},
			{ "data": "name","sWidth":"16%"},
			{ "data": "englishName","sWidth":"18 %"},
			{ "data": "code","sWidth":"16%"},
			{ "data": "dataType","sWidth":"15%"},
			{ "data": "dataLength","sWidth":"16%"},
			{ "data": "submitCompany","sWidth":"16%"},
		],
		columnDefs:[ 
           {"render":function(data,type,row,meta){
                 return "<input type='checkbox' name='cbs' value='"+row.id+"' class='cbs' cid='"+JSON.stringify(row)+"'/>"; 
              }, 
               "targets":0 
          },
        ],
        drawCallback:function(setting){
	      	/**全选操作**/
        	base.selectAll($("#calls"),$(".cbs"),function(){
        		common.checkByGridButton($(".cbs"));
        	});
        }
	};
	/*画表格*/
	var setGrid = function(){
		grid = base.datatables({
			container:$("#optTable"),
			option:gridOption,
			filter:common.gridFilters
		});
	};
	/**查询**/
	var setSearch = function(){
		$("#search-opt").on("click",function(){
			common.search(grid);
		});
	};
	return {
		main:function(){
			grid = null;
			setModalTreebar();
			setSearch();
		}
	};
});