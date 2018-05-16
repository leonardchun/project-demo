define(["base","app/commonApp"],function(base,common){
	var treeClickEvent = function(event,treeId,treeNode){
		var self = true;
		if(treeNode.iseq){
			$("#listAdd li").each(function(i,o){
				if($(o).attr("cid") == treeNode.id){
					var requestTip = base.requestTip();
		                requestTip.error("请不要重复添加设备");
		                self = false;
				}
			})
			if(self){
				$("#listAdd").append('<li cid="'+treeNode.id+'">'+treeNode.name+'<i class="fa fa-close"></i></li>')			
			}
		}
		
	};
	var setModalTreebar = function(){
		base.ajax({
			url:$.path+"/api/domain/findDomainResByEquipmentTree",
			type:"get",
			success:function(data){
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
					data:common.mergeTreeData(data.data,"-1"),
				});
				
			},
			beforeSend:function(){
				base.loading($("#modalTreebar"));
			}
		});
		base.scroll({
			container:$("#treeModalAside")
		});
	};
	var setModalContent = function(){
		$("#listAdd").on("click","i",function(){
			$(this).parent().remove();
		})
	}
	return {
		main:function(){
			setModalTreebar();
			setModalContent();
		}
	};
});