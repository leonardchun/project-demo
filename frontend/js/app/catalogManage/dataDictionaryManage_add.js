define(["base"],function(base){
	/**设置上传组件**/
	var setUpload = function(){
		$("#imageBtn").on("click",function(){
			$("#image").click();
		});
		$("#image").on("change",function(){
			$("#fileName").html($(this).val());
		});
		$("#image").change(function(){
			var url1=new FormData($('#form')[0])
			$.ajax({
			    url:$.path+'/api/fileUpload/uploadFile',
			    type: 'POST',
			    cache: false,
			    data: url1,
			    processData: false,
			    contentType: false,
			    success:function(d){
			    	$("#imageUrl").val(JSON.parse(d).filesId[0]);
			    }
			})
		})
	};
	return {
		main:function(){
			if($("#button_type").val()==1){
				var params = $(".ui-grid .cb:checked").val();
				$.ajax({
					url:$.path+"/api/sysCenterBussinessDictionary/getDictionary",
					type:"get",
					data:{id:params},
					success:function(d){
						$("#dictionarySum").val(d.data.name);
						$("#code").val(d.data.code);
						$("#remark").val(d.data.description);
						$("#fileName").text(d.data.imageName)
					}
				})				
			}
			setUpload();
		}
	};
});