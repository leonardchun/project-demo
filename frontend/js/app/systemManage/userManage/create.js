define(["base","app/commonApp"],function(base,common){
	//获取用户角色
	var getUserRole = function(){
		$.ajax({
			type:"get",
			url:$.path+"/api/sysroles/findRoleList",
			success:function(data){
				base.template({
					container:$(".userRole"),
					templateId:"userRole-tpl",
					data:data.data
				})
			}
		})
	}
	return {
		main:function(){
			getUserRole();
		}
	}
})
