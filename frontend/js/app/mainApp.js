define(["base","app/commonApp"],function(base,common){
	var menuArrayData = null;
	var menuMapData = null;
	/**加载左侧菜单**/ 
	
	var setMenu = function(){
		
		var showHelper =  function(v1, v2, options) {
			if(v1==false) {
				return "none";
			}else{
				return "block";
			}
		};
		base.ajax({
			url:"../json/menu2.json",
			type:"get",
			success:function(data,status,request){
				
				menuMapData = base.arrayToMap(data,"root",true);
				menuArrayData = base.mapToArray(menuMapData,"root");
				base.template({
					container:$(".ui-menu"),
					templateId:"menu-tpl",
					data:menuArrayData,
					helper:[{"name":"show","event":showHelper}],
					callback:function(){
						base.scroll({
							container:$(".ui-menubar")
						});
						$('#menubar .panel-collapse').on('hide.bs.collapse', function (o) {
							$(o.target).parent().find(".panel-title a i:eq(1)").attr("class","fa fa-angle-down");
						});
						$('#menubar .panel-collapse').on('show.bs.collapse', function (o) {
							$(o.target).parent().find(".panel-title a i:eq(1)").attr("class","fa fa-angle-up");
						});
						$("#menubar .panel-body li").on("click",function(){
							$("#menubar .panel-body li").removeClass("active");
							$(this).addClass("active");
							loadPage($(this).attr("mid"));
						});
						loadPage("1-1");
						toMessage();
					}
				});
			},
			beforeSend:function(req){
				common.getUserSession(req);
			}
		});
	};
	/**加载菜单对应的页面**/
	var loadPage = function(mid){
		if(chartInterval){
			window.clearInterval(chartInterval);
		}
		if(chartInterval2){
			window.clearInterval(chartInterval2);
		}
		var data = menuMapData[mid]?menuMapData[mid]:null;
		if(data){
			base.loadPage({
				container:$(".ui-article"),
				url:data.url?data.url:"",
				//scrolls:".ui-content,.ui-gridbar",
				callback:function(){
					common.setLocation(menuMapData,data.id);
				}
			});
		}
	};
	/**设置导航菜单**/
	var setNavbar = function(){
		var self = {};
		self.search = function(){
			base.ajax({
				url:"",
				success:function(){
					
				}
			})
		};
		self.setSearch = function(){
			$("#searchInput").on("keydown",function(event){
				if(event.keyCode==13){
					if($(this).val()!=""){
						self.search();
					}
				}
			});
			$("#searchIcon").on("click",function(){
				self.search();
			});
		};
		self.setSearch();
	};
	//点击消息
	function toMessage(){
		$(".dropdown-menu li").off().on("click",function(){
			$("#menubar .panel-collapse").removeClass("in");
			$(".panel-default #collapse6").addClass("in");
			$("a[href='#collapse6'] i:eq(1)").attr("class","fa fa-angle-up");
			$("#menubar .panel-body li").removeClass("active");
			$("#menubar .panel-body li[mid='5-5']").addClass("active");
			loadPage($("#menubar .panel-body li[mid='5-5']").attr("mid"));
		})
	};
	
	return {
		main:function(){
			//setNavbar();
			setMenu();
		},
		loadPage:function(id){
			loadPage(id);
		}
	};
});