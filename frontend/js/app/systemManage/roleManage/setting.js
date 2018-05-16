define(["base","app/commonApp"],function(base,common){
	//获取配置的菜单
	function getSetting(){
		var setArr=[];
		base.ajax({
			url:"../json/menu2.json",
			type:"get",
			async:false,
			success:function(data){
				menuMapData = base.arrayToMap(data,"root",true);
				menuArrayData = base.mapToArray(menuMapData,"root");
				base.template({
					container:$(".ui-set"),
					templateId:"set-tpl",
					data:menuArrayData,
					callback:function(){
						console.log("ddd")
					}
				})
			}
		})
	}
	return{
		main:function(){
			getSetting()
		}
	}
	
})
