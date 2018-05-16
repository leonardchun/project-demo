define(["base","app/commonApp","select2"],function(base,common,select2){
	
	//提交
	var ntpSubmit = function(){ 
		$(".search").on("click",function(){
//			var params = {address:$(".select2").val()};
			common.submit({
				url:$.path+"/api/syselocalquipment/synNtpServerTime?address=ntp2.aliyun.com",
//				url:"http://192.168.230.251:8081/api/syselocalquipment/synNtpServerTime?address=输入参数如输入:(ntp2.aliyun.com)" 
				type:"get",
//				params:params,
				callback:function(data){
					console.log("//////////////////")
					console.log(data)
//					ntpSynTime()
//					select2Input()
				}
			});
		});
	};

	//查询最后同步成功的时间
	var ntpSynTime = function(){ 
		base.ajax({
			url:$.path+"/api/syselocalquipment/getSynNtpServlerTime ",
			type:"get",
			success:function(data){
				if(!data.data || JSON.stringify(data.data) =="{}"){
					$(".sbtb").html("本设备未与任何设备进行同步");
					$(".tbsj").find('span').html("本设备未与任何设备进行同步");
				}else{
					$(".sbtb").find('span').html("20.125.20.21");
					$(".tbsj").find('span').html('2017-08-01 12:00:00');
				}
			}
		})

	};
	//渲染下拉框内容的地方
	var select2Input = function(){
		base.ajax({
			url:$.path+"/api/syselocalquipment/getSynNtpGroupListInfo",
//			url:"http://192.168.230.251:8081/api/syselocalquipment/getSynNtpGroupListInfo",
			type:"get",
			success:function(data){
//				if(data.code !="0") return ;
//				if(data.data.length>0){
//					var option;
//					for(var i=0;i<data.data.length;i++){
//						option += "<option>"+data.value+"</option>"
//					}
//					$("#NTP-form").append(option)
//				}
//				console.log(data)
			}
		})
		
	}
	return{
		main:function(){
			if($(".select2")){
				$(".select2").select2();
			}
			ntpSubmit();
			ntpSynTime();
			select2Input();
		}
	}
})