define(["base","app/commonApp"],function(base,common){
	var grid=null;
	var modalId = $(".modal").attr("id");
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
			url:"../json/checkJson/filePreview.json",
			type:"get"
		},
		columns:[
			{ "data": "id","sWidth":"10%"},
			{ "data": "fileName","sWidth":"50%"},
			{ "data": "fileType","sWidth":"20%"},
			{ "data": "fileSize","sWidth":"20%"}
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
		//modalId
		$.ajax({//api/subscribeResource/getSubscribeById
			url:$.path+"/api/subscribeResource/getSubscribeById?id=2df01e1bbecf44d39be9b74fc99",
			type:"get",
			success:function(result){
				//区分资源类型
				if(result.success=true && result.data){
					var resType = "";
					switch(data.resType){
						case "1": resType="DATA";break;
						case "2": resType="DOC";break;
						case "3": resType="API";break;
						default: resType="其他";break;
					}
					$.each(result,function(k,v){
						if(k='resType'){
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
	//获取数据转换
	//画表格		
	var setGrid = function(container,gridOption){
		grid = base.datatables({
			container:container,
			option:gridOption,
		});
		
	}
	return {
		main:function(){
			applyMsg();
			metaData();
			setGrid($("#dataMsg"),gridOption);////获取数据项信息
		}
	}
})
