define(["base","app/commonApp","fileinput","fileinputZh"],function(base,common,fileinput){
	function _authorization(){
		$(".authorization-msg").hide();
		var html = "<form enctype='multipart/form-data'>"+
			       // "<input id='kv-explorer' type='file' multiple>"+
			        "<input id='file-0d' class='file' type='file'>"+
			        //"<input id='file-0a' class='file' type='file' multiple data-min-file-count='1'>"+
					"</form>";
		//点击授权弹框
		$(".authorization").off().on("click",function(){
			var modal = base.modal({
				width:950,
				height:510,
				label:"关于授权",
				url:"../html/authorization.html",
				drag:true,
				callback:function(){
					$(".upload-file").html(html);
					$("#file-0d").fileinput({
						language:'zh',
						showUpload: true,
						browseIcon:'',
						removeIcon:'',
						uploadIcon:'',
						showPreview :true,
						dropZoneEnabled: false,
						showPreview :false,
						cancelIcon:'',
						uploadUrl:$.path+"/testDemo/fileupload/upload.do", //上传的地址
        				//showCaption: false,
        				//allowedFileExtensions: ['jpg', 'png', 'gif']
					}).on("fileuploaded", function (event, data, previewId, index){
                 			//上传成功之后，显示 
		                 	$(".img-box img").attr("src","../images/authorization.jpg");
		                 	$(".authorization-msg").show();
					});
				},
				buttons:[
					{
						label:"保存",
						cls:"btn btn-info",
						clickEvent:function(){
							
						}
					},
					{
						label:"重置",
						cls:"btn btn-warning",
						clickEvent:function(){
							common.reset($("#form"));
					}
					}
				]
			})
		})
	}
	return {
		main:function(){
			_authorization();
		}
	}
})
