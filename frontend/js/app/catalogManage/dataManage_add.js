define(["base"],function(base){
	function setContent(){
		/**设置时间控件**/
		base.form.date({
			element:$(".date"),
			isTime:true
		});
//		if($("#button_type").val()==1){
//			var params = $(".ui-grid .cb:checked").attr("cid");
//			params = JSON.parse(params);
//			$("#data_name").val(params.dataName);
//			$("#data_english_name").val(params.dataEnglishName);
//			$("#data_code").val(params.dataCode);
//			$("#data_classify").val(params.dataType);
//			$("#data_length").val(params.dataLength);
//		}
		/*搜索框下拉*/
		$.ajax({
			url:$.path+"/api/sysBussinessDictionary/findDictionaryByType",
			data:JSON.stringify({type: 3,name:"classify"}),
			type:"post",
			contentType:"application/json",
			success:function(d){
				$(d.data.classify).each(function(i,o){
					$("#data_classify").append("<option value='"+o.key+"'>"+o.label+"</option>")
				})
			}
		})
		$.ajax({
			url:$.path+"/api/sysCenterBussinessDictionary/findCenterDictionaryByType",
			data:JSON.stringify({type: 6,name:"dictionaryId"}),
			type:"post",
			contentType:"application/json",
			success:function(d){
				$(d.data.dictionaryId).each(function(i,o){
					$("#data_classify").append("<option value='"+o.key+"'>"+o.label+"</option>")
				})
			}	
		})
		/*显示隐藏表单元素*/
		$("#isDictionary").change(function(){changeForm();})
		$("#data_type").change(function(){changeForm1();})
		changeForm();changeForm1();
	}
	var changeForm = function(){
		var elemen = $(".user_dictionary[name='dictionaryId']");
		var role = elemen.attr("role")?elemen.attr("role"):elemen.attr("roles");
		if($("#isDictionary").val()=='1'){
			$(".user_dictionary").hide();
			elemen.removeAttr('role').attr('roles',role);
		}else{
			$(".user_dictionary").show();
			elemen.removeAttr('roles').attr('role',role)
		}
	}
	var changeForm1 = function(){
		var elemen = $(".data_length[name='dataLength']");
		var role = elemen.attr("role")?elemen.attr("role"):elemen.attr("roles");
		if($("#data_type").val()==3 || $("#data_type").val()==12){
			$(".data_length").show();
			elemen.removeAttr('roles').attr('role',role)
		}else{
			$(".data_length").hide();
			elemen.removeAttr('role').attr('roles',role);			
		}
	}
	return {
		main:function(){
			setContent();
		}
	};
});