define(["base","app/commonApp"],function(base,common){
	
	return {
		main:function(){
			base.scroll({
				container:$(".ui-content")
			});
			base.ajax({
				url:"../json/schedule.json",
				type:"get",
				success:function(data){
					base.schedule({
						container:$("#schedule"),
						data:data,
						callback:function(){
							alert("日程安排成功！");
						}
					})
				}
			})
			
		}
	};
});