define(["base","app/commonApp"],function(base,common){
	var loading = function(){
//		if($("#button_type").val()==1){
//			var params = $(".ui-grid .cb:checked").attr("cid");
//		    params = JSON.parse(params);
//			$("#data_type").val(params.dataType);
//			$(".ip_address").val(params.IPAddress);
//			$(".port").val(params.port);
//			$("#data_name").val(params.dataName)
//		}
	}
	var setModule = function(){
		$("#type").change(function(){
			changeModule($(this).val())
		})
		changeModule($("#type").val())
	}
	var changeModule=function(para){
		$("#form .tbody").empty();
		if(para==1){
			$("#form .tbody").append('<tr>'+
							'<td class="title" style="width:20%"><span class="required"></span>数据库类型</td>'+
							'<td>'+
								'<select class="form-control" name="dbType" role="{required:true}">'+
							    	'<option value="Oracle">Oracle</option>'+
							    	'<option value="MySQL">MySQL</option>'+
							    	'<option value="SQLServer">SQLServer</option>'+
							    '</select>'+
							'</td>'+
							'<td class="title" style="width:20%"><span class="required"></span>数据库实例名称</td>'+
							'<td>'+
								'<input type="text" name="dbInstanceName" class="form-control" placeholder="请输入数据库实例名称" role="{required:true}"/>'+
							'</td>'+
						'</tr>')
							
		}else{
			$("#form .tbody").append('<tr>'+
				'<td class="title" style="width:20%"><span class="required"></span>传输协议</td>'+
				'<td>'+
					'<select class="form-control" name="ftpType" role="{required:true}">'+
			    	'<option value="1">FTP</option>'+
			    	'<option value="2">SMB</option>'+
			    '</select>'+
				'</td>'+
				'<td class="title" style="width:20%"><span class="required"></span>文件服务器编码</td>'+
				'<td>'+
					'<select class="form-control" name="unicode" role="{required:true}">'+
			    	'<option value="1">GBK</option>'+
			    	'<option value="2">UTF-8</option>'+
			    	'<option value="3">GB2312</option>'+
			    '</select>'+
				'</td>'+
			'</tr>'+
			'<tr>'+
				'<td class="title" style="width:20%"><span class="required"></span>文件路径</td>'+
				'<td>'+
					'<input type="text" name="ftpAddress" class="form-control" placeholder="请输入文件路径" role="{required:true}" value="/"/>'+
				'</td>'+
			'</tr>')
		}
	}
	return {
		main:function(){
			loading();
			setModule();
		}
	};
});