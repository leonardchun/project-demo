define(["jquery", "bootstrap"], function() {
	var base = {};
	base.$scope = {};
	base.IE8 = function() {
		if(!$.support.opacity) {
			return true;
		} else {
			return false;
		}
	};
	base.IE = function() {
		if(!$.support.opacity && !$.support.style && window.XMLHttpRequest == undefined) {
			return 6;
		} else {
			if(!$.support.opacity && !$.support.style && window.window.XMLHttpRequest != undefined) {
				return 7;
			} else {
				if(!$.support.opacity) {
					return 8;
				} else {
					return 9;
				}
			}
		}
	}();
	base.isIE = function() {
		if(document.all) {
			return true;
		} else {
			return false;
		}
	}();
	
	base.setProperty = function(element, option) {
		if(option) {
			if(option.cls) {
				$(element).addClass(option.cls.replace(/,/g, " "));
			}
			if(option.style) {
				$(element).attr("style", option.style.replace(/,/g, ";"));
			}
			if(option.id) {
				$(element).attr("id", self.id);
			}
			if(option.name) {
				$(element).attr("name", self.name);
			}
		}

	};
	base.getRandom = function(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	};
	base.ajax = function(option, isConnect) {
		var self = {};
		
		isConnect = isConnect ? isConnect : true;
		
		if(option) {
			self.params = option.params ? option.params : {};
			self.url = option.url ? option.url : "";
			self.async = option.async ? option.async : true;
			self.type = option.type ? option.type : "post";
			self.dataType = option.dataType ? option.dataType : "json";
			self.success = option.success ? option.success : null;
			self.error = option.error ? option.error : null;
			self.beforeSend = option.beforeSend ? option.beforeSend : null;
			self.complete = option.complete ? option.complete : null;
			self.timeout = option.timeout ? option.timeout : -1;
			self.ajaxObj = null;
			self.isConnect = self.isConnect ? self.isConnect : true;
			self.contentType = option.contentType?option.contentType:"application/json; charset=utf-8";
			if(self.dataType == "text") {
				self.type = "get";
			}
			
			self.connect = function() {
				
				self.ajaxObj = $.ajax({
					type: self.type,
					async: self.async,
					url: self.url,
					
					contentType:self.contentType,
					data: function() {
						if(self.type.toLowerCase() == "post") {
							return JSON.stringify(self.params);
						} else {
							return self.params;
						}
					}(),
					dataType: self.dataType,
					timeout: self.timeout,
					success: function(data,textStatus,request) {
					
						if(self.success) {
							self.success(data,textStatus,request);
						}
						
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						if(self.error) {
							self.error();
						}
					},
					beforeSend: function(XMLHttpRequest) {
						if(self.beforeSend) {
							self.beforeSend(XMLHttpRequest);
						}
					},
					xhrFields: {
				           withCredentials: true
				    },
					complete: function(XMLHttpRequest, textStatus) {
						if(self.complete) {
							self.complete();

						}
					}
				});
				return self;
			};
			self.stop = function() {
				self.ajaxObj.abort();
			};
			self.run = function() {
				self.connect();
			};

			if(isConnect) {
				if(self.url) {
					self.connect();
				}

			}

			return self;
		}
	};
	base.ajax.load = function(option) {
		var self = base.ajax(option, false);
		self.dataType = "text";
		self.type = "get";
		self.errorText = option.errorText ? option.errorText : "资源加载出错,请联系管理员!";
		self.container = option.container ? option.container : null;

		self.error = function() {
			if(self.container) {
				base.bulletin(self.container, self.errorText);
			}
		};
		self.beforeSend = function() {
			if(self.container) {
				base.loading($(self.container));
			}
		};

		if(!self.url) {
			base.bulletin(self.container, self.errorText);
		} else {
			self.connect();
		}

		return self;
	};
	base.bulletin = function(container, text) {
		$(container).html("<div style='display:table;width:100%;height:100%;text-align:center;'><div class='theme-bulletin'>" + text + "</div></div>");
	};
	base.loading = function(container) {
		$(container).html("<div style='display:table;width:100%;height:100%;text-align:center;'>"+
							"<i class='fa fa-spinner fa-pulse fa-3x fa-fw' style='font-size:24px;text-align:center;display: table-cell;vertical-align: middle;width:24px;height:24px;color:#aaa'></i></div>");
	};
	/**模板引擎**/

	/**
	 * #len 判断长度
	 */

	base.template = function(option) {
		var self = {};
		self.data = option.data ? option.data : null;
		self.container = option.container ? option.container : null;
		self.templateId = option.templateId ? option.templateId : null;
		self.callback = option.callback ? option.callback : null;
		self.loading = option.loading ? option.loading : false;
		self.helper = option.helper ? option.helper : null;
		if(self.data && self.container && self.templateId) {
			if(self.loading) {
				base.loading(self.container);
			}
			require(["template"], function(template) {
				var myTemplate = template.compile($("#" + self.templateId).html());
				/**注册基本判断条件**/

				template.registerHelper("null", function(v1, options) {
					if(!v1 || v1 == "") {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});

				template.registerHelper("ne", function(v1, v2, options) {
					if(v1 != v2) {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});
				template.registerHelper("e", function(v1, v2, options) {
					if(v1 == v2) {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});
				template.registerHelper("g", function(v1, v2, options) {
					if(v1 > v2) {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});

				template.registerHelper("ge", function(v1, v2, options) {
					if(v1 >= v2) {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});
				template.registerHelper("le", function(v1, v2, options) {
					if(v1 <= v2) {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});
				template.registerHelper("l", function(v1, v2, options) {
					if(v1 < v2) {
						//满足添加继续执行
						return options.fn(this);
					} else {
						//不满足条件执行{{else}}部分
						return options.inverse(this);
					}
				});

				if(self.helper && self.helper.length > 0) {
					$(self.helper).each(function(i, o) {
						template.registerHelper(o.name, o.event);
					});
				}

				var html = myTemplate(self.data);
				$(self.container).html(html);
				if(self.callback) {
					self.callback(self);
				}
			});
		}
	};
	base.modal = function(option) {
		if(!option) {
			option = {};
		}
		var self = {};
		self.container = option.container ? option.container : $("body");
		self.modalId = option.id ? option.id : "m" + base.getRandom(1000, 9999);
		self.label = option.label ? option.label : "新窗口";
		//self.labelColor = option.labelColor?option.labelColor:"#222";
		self.background = option.background ? option.background : "#fff";
		self.modalLabelId = option.id + "label";
		self.style = option.style ? option.style : "";
		self.width = option.width ? option.width : null;
		self.visible = option.visible ? option.visible : false;
		self.center = option.center ? option.center : true;
		self.drag = option.drag ? option.drag : false;
		self.url = option.url ? option.url : null;
		self.height = option.height ? option.height : null;
		self.radius = option.radius ? option.radius : 5;
		self.contentStyle = option.contentStyle ? option.contentStyle : "";
		self.labelStyle = option.labelStyle ? option.labelStyle : "";
		self.modalEntity = {};
		self.modal = null;
		self.modalBody = null;
		self.modalDialog = null;
		self.modalContent = null;
		self.modalHeader = null;
		self.modalFooter = null;
		self.callback = option.callback?option.callback:null;
		self.customScroll = option.customScroll ? option.customScroll : true;
		self.context = option.context ? option.context : "";
		self.drag = option.drag ? option.drag : false;
		self.rebuilding = option.rebuilding ? option.rebuilding : false;

		self.create = function() {
			if($("#" + self.modalId).length > 0) {
				if(self.rebuilding) {
					$("#" + self.modalId).remove();
					self.createModal();
				} else {
					self.modal = $("#" + self.modalId);
					self.setModal();
					self.modalDialog = $("#" + self.modalId).find(".modal-dialog");
					self.setModalDialog();
					self.modalContent = $("#" + self.modalId).find(".modal-content");
					self.setModalContent();
					self.modalHeader = $("#" + self.modalId).find(".modal-header");
					self.setModalHeader();
					self.modalBody = $("#" + self.modalId).find(".modal-body");
					self.setModalBody();
					self.modalFooter = $("#" + self.modalId).find(".modal-footer");
					self.setModalFooter();

				}
			} else {
				self.createModal();

			}
			if(!self.visible) {
				self.show();
			}
		};

		self.createModal = function() {
			self.modal = document.createElement("div");
			$(self.container).append(self.modal);
			self.setModal();
			self.modalDialog = document.createElement("div");
			$(self.modal).append(self.modalDialog);
			self.setModalDialog();
			self.modalContent = document.createElement("div");
			$(self.modalDialog).append(self.modalContent);
			self.setModalContent();
			self.modalHeader = document.createElement("div");
			$(self.modalContent).append(self.modalHeader);
			self.setModalHeader();
			self.modalBody = document.createElement("div");
			$(self.modalContent).append(self.modalBody);
			self.setModalBody();
			self.modalFooter = document.createElement("div");
			$(self.modalContent).append(self.modalFooter);
			self.setModalFooter();
		};
		self.setModal = function() {
			$(self.modal).attr("id", self.modalId);
			$(self.modal).attr("class", "modal fade");

			$(self.modal).attr("role", "dialog");
			$(self.modal).attr("tabindex", "-1");
			$(self.modal).attr("aria-labelledby", self.modalId + "Label");
			if(self.visible) {
				$(self.modal).attr("aria-hidden", "true");
			} else {
				$(self.modal).attr("aria-hidden", "false");
			}
			if(self.cls) {
				$(self.modal).attr("class", option.cls.replace(/,/g, " "));
			}
			if(self.style) {
				$(self.modal).attr("style", option.style.replace(/,/g, ";"));
			}

		};
		self.setModalDialog = function() {
			$(self.modalDialog).attr("class", "modal-dialog");
			if(self.width) {
				$(self.modalDialog).css("width", self.width);
			}
			if(self.background) {
				$(self.modalDialog).css("background", self.background);
			}
			$(self.modalDialog).css("border-radius", self.radius);
		};
		self.setModalContent = function() {
			$(self.modalContent).attr("class", "modal-content");
			//$(self.modalContent).css("background-color","transparent");
			$(self.modalContent).css("border", "0");
			$(self.modalContent).css("border-radius", self.radius);
		};
		self.setModalHeader = function() {
			$(self.modalHeader).attr("class", "modal-header");

			if(self.drag) {
				require(["jqueryUI"],function(){
					$(self.modalDialog).draggable({
						handle: ".modal-header",
						cursor: 'move',
						refreshPositions: false
					});
					$(self.modalHeader).css("cursor","move");
				});
				
			}
			$(self.modalHeader).html("<button class='close' data-dismiss='modal' aria-hidden='true'><i class='fa fa-remove' style='font-weight:normal;font-size:16px;'></i></button><h4 class='modal-title'  id='" + self.modalId + "Label'>" + self.label + "</h4>");
			if(self.labelStyle){
				$(self.modalHeader).find("h4").attr("style", self.labelStyle.replace(/,/g, ";"));
			}
		};
		self.setModalBody = function() {
			$(self.modalBody).attr("class", "modal-body");
			if(self.height && self.height > 0) {
				$(self.modalBody).css("height", self.height);
				$(self.modalBody).css("overflow", "auto");
			}
			if(self.contentStyle){
				$(self.modalBody).attr("style", self.contentStyle.replace(/,/g, ";"));
			}

		};

		self.setModalFooter = function() {
			$(self.modalFooter).attr("class", "modal-footer");

			$(self.modalFooter).html("");
			if(option.buttons && option.buttons.length > 0) {
				$(option.buttons).each(function(i, o) {
					o.container = $(self.modalFooter);
					base.form.button(o);
				});
			}
			/*base.form.button({
				container: $(self.modalFooter),
				label: "关闭",
				cls:"btn btn-default",
				clickEvent: function() {
					self.hide();
				}
			});*/
		};

		self.show = function() {
			$(self.modal).on('show.bs.modal', function() {
				self.loadContext();
				if(self.showEvent) {
					self.showEvent();
				}
			});
			$(self.modal).on('shown.bs.modal', function() {
				
				if(self.shownEvent) {
					self.shownEvent();
				}
			});
			$(self.modal).on('hidden.bs.modal', function() {
				$(self.modal).remove();
			});
			$(self.modal).modal({
				show: true,
				center: self.center
			});

		};
		self.hide = function() {
			$(self.modal).on('hide.bs.modal', function() {
				if(self.hideEvent) {
					self.hideEvent();
				}
			})

			$(self.modal).on('hidden.bs.modal', function() {
				if(self.hiddenEvent) {
					self.hiddenEvent();
				}
				$(self.modal).remove();
			});
			$(self.modal).modal("hide");
		};

		self.loadContext = function(opt) {
			if(!opt){
				opt = option;
			}
			$(self.modalBody).html("");

			if(opt.context) {
				$(self.modalBody).html(opt.context);
				if(self.callback){
					self.callback(self);
				}
			} else if(opt.url) {
				base.ajax({
					url: opt.url,
					dataType: "text",
					success: function(text) {
						$(self.modalBody).html(text);
						if(self.callback){
							self.callback(self);
						}
						if(self.customScroll) {
							base.scroll({
								container:$(self.modalBody)
							});
						}

					},
					beforeSend: function() {
						base.loading(self.modalBody);
					}

				});
			}
		};
		self.create();
		return self;
	};

	base.glass = function(option) {
		if(base.isIE) {
			if(base.IE <= 8) {
				return;
			}
		}

		var self = {};
		self.radius = option.radius ? option.radius : 15;
		self.element = option.element ? option.element : null;
		self.canvas = null;
		self.img = option.img ? option.img : null;
		var tmpImg = new Image();
		$(tmpImg).attr("src", $(self.img).attr("src"));
		self.fixHeight = option.fixHeight ? option.fixHeight : 0;
		self.width = tmpImg.width ? tmpImg.width : $(self.element).width();
		self.height = tmpImg.height ? tmpImg.height : $(self.element).height();
		self.top = option.top ? option.top : $(self.element).offset().top;
		self.left = option.left ? option.left : $(self.element).offset().left;
		self.x = option.x ? option.x : 0;
		self.y = option.y ? option.y : 0;
		self.cls = option.cls ? option.cls : null;
		self.Mu = [
			512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
			454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
			482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
			437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
			497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
			320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
			446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
			329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
			505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
			399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
			324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
			268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
			451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
			385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
			332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
			289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
		];
		self.Sh = [
			9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
			17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
			19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
			20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
			21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
			21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
			22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
			22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
		];
		self.BlurStack = function() {
			this.r = 0;
			this.g = 0;
			this.b = 0;
			this.a = 0;
			this.next = null;
		};
		self.draw = function() {
			var w = $(self.element).width();
			var h = $(self.element).height();
			$(self.canvas).css("width", w);
			$(self.canvas).css("height", h);
			$(self.canvas).css("left", self.left);
			$(self.canvas).css("top", self.top);
			$(self.canvas).attr("width", w);
			$(self.canvas).attr("height", h);
			$(self.canvas).css("position", "absolute");
			if(self.cls) {
				$(self.canvas).addClass(self.cls);
			}
			var zix = 0;
			if($(self.element).css('z-index')) {
				zix = Number($(self.element).css('z-index').split("px")[0]);
			}
			$(self.canvas).css("zIndex", zix + 1);
			var context = self.canvas.getContext("2d");
			context.clearRect(0, 0, w, h);
			var fixh = 0;
			if($(window).height() < document.documentElement.scrollHeight) {
				fixh = h + Math.floor(window.screen.availHeight / self.height * h) + 10;
			} else {
				fixh = h + Math.floor(window.screen.availHeight / self.height * h);
			}
			var fixw = self.width;
			context.drawImage($(self.img)[0], self.left, self.top, fixw, fixh, self.x, self.y, w, h);
			self.stackBlurCanvasRGBA(0, 0, w, h);
		};
		self.create = function() {
			self.canvas = document.createElement("canvas");
			$(self.element).parent().append(self.canvas);
			self.draw();
		};
		self.stackBlurCanvasRGBA = function(top_x, top_y, width, height) {
			var context = self.canvas.getContext("2d");
			var imageData;

			try {
				try {
					imageData = context.getImageData(top_x, top_y, width, height);
				} catch(e) {
					try {
						netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
						imageData = context.getImageData(top_x, top_y, width, height);
					} catch(e) {
						
						throw new Error("unable to access local image data: " + e);
						return;
					}
				}
			} catch(e) {
				
				throw new Error("unable to access image data: " + e);
			}

			var pixels = imageData.data;

			var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
				r_out_sum, g_out_sum, b_out_sum, a_out_sum,
				r_in_sum, g_in_sum, b_in_sum, a_in_sum,
				pr, pg, pb, pa, rbs;

			var div = self.radius + self.radius + 1;
			var w4 = width << 2;
			var widthMinus1 = width - 1;
			var heightMinus1 = height - 1;
			var radiusPlus1 = self.radius + 1;
			var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

			var stackStart = new BlurStack();
			var stack = stackStart;
			for(i = 1; i < div; i++) {
				stack = stack.next = new BlurStack();
				if(i == radiusPlus1) var stackEnd = stack;
			}
			stack.next = stackStart;
			var stackIn = null;
			var stackOut = null;

			yw = yi = 0;

			var mul_sum = mul_table[self.radius];
			var shg_sum = shg_table[self.radius];

			for(y = 0; y < height; y++) {
				r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

				r_out_sum = radiusPlus1 * (pr = pixels[yi]);
				g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
				b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
				a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

				r_sum += sumFactor * pr;
				g_sum += sumFactor * pg;
				b_sum += sumFactor * pb;
				a_sum += sumFactor * pa;

				stack = stackStart;

				for(i = 0; i < radiusPlus1; i++) {
					stack.r = pr;
					stack.g = pg;
					stack.b = pb;
					stack.a = pa;
					stack = stack.next;
				}

				for(i = 1; i < radiusPlus1; i++) {
					p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
					r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
					g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
					b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;
					a_sum += (stack.a = (pa = pixels[p + 3])) * rbs;

					r_in_sum += pr;
					g_in_sum += pg;
					b_in_sum += pb;
					a_in_sum += pa;

					stack = stack.next;
				}

				stackIn = stackStart;
				stackOut = stackEnd;
				for(x = 0; x < width; x++) {
					pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
					if(pa != 0) {
						pa = 255 / pa;
						pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
						pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
						pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
					} else {
						pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
					}

					r_sum -= r_out_sum;
					g_sum -= g_out_sum;
					b_sum -= b_out_sum;
					a_sum -= a_out_sum;

					r_out_sum -= stackIn.r;
					g_out_sum -= stackIn.g;
					b_out_sum -= stackIn.b;
					a_out_sum -= stackIn.a;

					p = (yw + ((p = x + self.radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

					r_in_sum += (stackIn.r = pixels[p]);
					g_in_sum += (stackIn.g = pixels[p + 1]);
					b_in_sum += (stackIn.b = pixels[p + 2]);
					a_in_sum += (stackIn.a = pixels[p + 3]);

					r_sum += r_in_sum;
					g_sum += g_in_sum;
					b_sum += b_in_sum;
					a_sum += a_in_sum;

					stackIn = stackIn.next;

					r_out_sum += (pr = stackOut.r);
					g_out_sum += (pg = stackOut.g);
					b_out_sum += (pb = stackOut.b);
					a_out_sum += (pa = stackOut.a);

					r_in_sum -= pr;
					g_in_sum -= pg;
					b_in_sum -= pb;
					a_in_sum -= pa;

					stackOut = stackOut.next;

					yi += 4;
				}
				yw += width;
			}

			for(x = 0; x < width; x++) {
				g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

				yi = x << 2;
				r_out_sum = radiusPlus1 * (pr = pixels[yi]);
				g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
				b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
				a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

				r_sum += sumFactor * pr;
				g_sum += sumFactor * pg;
				b_sum += sumFactor * pb;
				a_sum += sumFactor * pa;

				stack = stackStart;

				for(i = 0; i < radiusPlus1; i++) {
					stack.r = pr;
					stack.g = pg;
					stack.b = pb;
					stack.a = pa;
					stack = stack.next;
				}

				yp = width;

				for(i = 1; i <= self.radius; i++) {
					yi = (yp + x) << 2;

					r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
					g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
					b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;
					a_sum += (stack.a = (pa = pixels[yi + 3])) * rbs;

					r_in_sum += pr;
					g_in_sum += pg;
					b_in_sum += pb;
					a_in_sum += pa;

					stack = stack.next;

					if(i < heightMinus1) {
						yp += width;
					}
				}

				yi = x;
				stackIn = stackStart;
				stackOut = stackEnd;
				for(y = 0; y < height; y++) {
					p = yi << 2;
					pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
					if(pa > 0) {
						pa = 255 / pa;
						pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
						pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
						pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
					} else {
						pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
					}

					r_sum -= r_out_sum;
					g_sum -= g_out_sum;
					b_sum -= b_out_sum;
					a_sum -= a_out_sum;

					r_out_sum -= stackIn.r;
					g_out_sum -= stackIn.g;
					b_out_sum -= stackIn.b;
					a_out_sum -= stackIn.a;

					p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

					r_sum += (r_in_sum += (stackIn.r = pixels[p]));
					g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
					b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));
					a_sum += (a_in_sum += (stackIn.a = pixels[p + 3]));

					stackIn = stackIn.next;

					r_out_sum += (pr = stackOut.r);
					g_out_sum += (pg = stackOut.g);
					b_out_sum += (pb = stackOut.b);
					a_out_sum += (pa = stackOut.a);

					r_in_sum -= pr;
					g_in_sum -= pg;
					b_in_sum -= pb;
					a_in_sum -= pa;

					stackOut = stackOut.next;

					yi += width;
				}
			}

			context.putImageData(imageData, top_x, top_y);
		}
		self.create();
		return self;
	};

	/**旋转的地图**/
	base.spreader = function(option) {
		var self = {};
		self.container = option.container ? option.container : null;
		self.data = option.data ? option.data : null;
		self.step = option.step ? option.step : 0;
		self.mapOption = option.mapOption ? option.mapOption : null;
		self.radius = option.radius ? option.radius : 0.05;
		self.offset = option.offset ? option.offset : 10;
		self.origin = option.origin ? option.origin : [0, 0];
		self.mapData = {
			"type": "FeatureCollection",
			"features": [],
			"UTF8Encoding": true
		};
		self.markLineData = [];
		self.markPointData = [];
		self.geoCoord = {};
		self.originId = null;
		self.element = null;
		self.isMain = option.isMain ? option.isMain : true;
		self.create = function() {
			if(self.data && self.data.length > 0) {
				if(self.isMain) {
					self.element = self.container;
				} else {
					self.element = document.createElement("div");
					$(self.container).append(self.element);
				}
				self.setData(self.data);

				self.draw();
			}
			return self;
		};

		self.draw = function() {
			if(self.mapOption) {
				var echartEntity = base.echartsOld({
					container: self.element,

					type: "map",
					style: "width:100%;height:100%",
					option: self.mapOption,
					mapData: self.mapData,
					mapName: "service",
					clickEvent: option.clickEvent ? option.clickEvent : null,
					hoverEvent: option.hoverEvent ? option.hoverEvent : null

				});
			}

		};
		self.getPosition = function(x, y, angle, radius) {
			if(!x || !y || !angle) {
				return [];
			}
			var radius = radius ? radius : self.radius;
			var x1 = (Number(x) + Math.sin(2 * Math.PI / 360 * angle) * radius);
			var y1 = (Number(y) + Math.cos(2 * Math.PI / 360 * angle) * radius);
			var cp = [x1, y1];
			return cp;
		};
		self.setData = function(data, parentData) {
			$(data).each(function(i, o) {
				var id = o.id
				var cp = [];
				var angle = 0;
				var radius = 0;
				if(parentData) {

					if(parentData.cp[0] == self.origin[0] && parentData.cp[1] == self.origin[1]) {
						angle = self.step > 0 ? (360 / self.step) * (i + 1) : (360 / data.length) * (i + 1);
						radius = self.radius;
					} else {
						var fw = parentData.angle;
						angle = fw / 1.5 + (10) * (i + 1);
						radius = self.radius;
					}
					cp = self.getPosition(parentData.cp[0], parentData.cp[1], angle, radius);
				} else {
					cp = self.origin;
				}
				if(self.originId) {
					self.originId = id;
				}
				self.geoCoord[o.name] = cp;
				if(parentData) {
					self.markLineData.push([{
						"name": o.name
					}, {
						"name": parentData.data.name,
						"value": o.value
					}]);
					self.markPointData.push({
						"name": o.name,
						"value": o.value
					});
				} else {
					self.markLineData.push([{
						"name": o.name
					}, {
						"name": self.data[0].name,
						"value": o.value
					}]);
				}

				var item = {
					"type": "Feature",
					"id": id,
					"properties": {
						"name": o.name,
						"cp": cp,
						"childNum": 1
					},
					"geometry": {
						"type": "Polygon",
						"coordinates": [
							"@@DB@DF@@@B@@@@@@@B@B@@@@@@@@@@@D@BAB@@@B@B@@@B@B@BA@@B@B@@BD@@F@B@@@B@@@@@B@B@B@@@B@@@@@@@FD@@CA@@AD@BC@@@A@EB@@CD@@AB@B@R@@@@@@@@@@@@ED@@@@@D@@@@@B@@E@@@BA@@A@@@A@@@A@@@@@@@@@@@A@@@CB@@@@@@@@@@AA@@@@@@@@AF@B@@@B@@@@@@@@@@@@@@AB@@BD@@@@@@@@@A@@@@B@@AB@@@@B@@@@@FBBA@CD@@EAA@@@A@@@@@@B@@@@@@@@@@@BB@@@@B@@@@@@@B@D@@@@@@@@@@@@AB@@@A@@@@A@A@@@@@@@@A@@@AA@@@A@@@A@A@@@@@AA@@A@@@E@@@@@@@A@C@@@@@@@@@@@E@@@@CB@@@@A@@@@@A@AA@@@@@@@@@BA@@@A@@A@@@BE@@IBE@G@C@C@@@@BC@A@@@C@C@A@C@A@A@@B@@@@BB@@@B@B@@@B@B@@@B@B@B@B@B@@@D@@CA@C@@AB@@@@@@@@C@@@A@@@EH@@AD@@@@@@@@AC@@C@@A@A@AB@@@@A@@@A@@AC@@ABG@A@@@@BE@C@A@@@@@AAAAA@@@A@C@@@@@@AA@@@@@@C@KBO@C@@@C@A@@@A@AAA@@@E@@@E@@CD@@@@@@A@@@@@C@@@@B@@AA@@C@@@@@@A@@@A@BGA@@@@@A@@A@@@@@@C@C@CB@@@@C@@@A@@@A@A@@@@@A@@@@@A@@AI@@@B@A@@B@B@B@@@@@@@B@@A@@@@A@@AB@BA@A@@@@@@DE@@@@@@B@@@BEA@@A@A@AAA@A@@@@@A@@B@@@@A@@@@@A@@@@@@@@@B@@B@@@@B@@@@@@@@@B@@D@@@DJ@B@D@@@@@H@NB@B@B@@@L@@@B@@@BAH@J@J@F@@@@@@A@@@A@@@@B@@@@@D@B@JG@@BB@@B@@@@@DA@@@@@@B@@@@B@AD@@@@@B@NJ@@B@@@@@@@@@@@@F@AJ@@@@C@AX@@@@@@AB@@A@@F@N@NMA@F@B"
						],
						"encodeOffsets": [
							[
								119181,
								40920
							]
						]
					}
				}
				self.mapData.features.push(item);
				if(o.items && o.items.length > 0) {
					var cpData = {
						"cp": cp,
						"data": o,
						"angle": angle
					};
					self.setData(o.items, cpData);
				}

			});
			self.mapOption.series[0].geoCoord = self.geoCoord;
			self.mapOption.series[0].markLine.data = self.markLineData;
			self.mapOption.series[0].markPoint.data = self.markPointData;
		};
		self.create();
		return self;
	};
	
	/**echarts组件**/
	base.echartsOld = function(option) {
		var self = {};
		self.container = null;
		self.dataOption = null;
		self.parentOption = option.parentOption;
		self.chart = null;
		self.data = null;
		self.echarts = null;
		self.theme = null;
		self.chartEle = null;
		option.seriesType = option.seriesType ? option.seriesType : "map";
		self.element = document.createElement("div");
		$(self.element).addClass("echarts-chart");

		if(option.show) {
			$(self.element).hide();
		} else {
			$(self.element).show();
		}

		$(option.container).append(self.element);
		base.setProperty(self.element, option);
		self.mapSelectFuc = function(chart) {
			if(option.seriesType == "map") {
				chart.on("mapselectchanged", function(param) {
					option.mapSelectedEvent(param, self);
				});
			} else {
				chart.on("click", function(param) {
					option.mapSelectedEvent(param, self);
				});
			}

		};
		self.clickFuc = function(chart) {
			require(["echartsConfig"], function(ecConfig) {
				chart.on("click", function(param) {

					option.clickEvent(param, self);
				});
			});

		};
		self.hoverFuc = function(chart) {
			require(["echartsConfig"], function(ecConfig) {
				chart.on("hover", function(param) {
					option.hoverEvent(param);
				});
			});
		};
		self.create = function() {
			if(option.option) {

				option.dataOption = option.option;

				if(option.setOptionDataEvent) {
					option.setOptionDataEvent(option);
				}
				if(option.type == "map") {

					require(["echarts2.0"], function() {

						if(option.mapData && option.mapName) {
							//self.mapName = option.mapName?option.mapName:"myMap";
							echarts.util.mapData.params.params[option.mapName] = {
								getGeoJson: function(callback) {
									if(typeof(option.mapData) == "string") {
										$.getJSON(option.mapData, function(data) {
											// 压缩后的地图数据必须使用 decode 函数转换
											callback(echarts.util.mapData.params.decode(data));
										});
									} else {
										callback(echarts.util.mapData.params.decode(option.mapData));
									}

								}
							};
							self.echarts = echarts;

							self.chart = self.echarts.init(self.element, self.theme);

							self.chartEle = self.chart.setOption(option.dataOption, true);

							$(window).on("resize", function() {
								self.reDraw();

							});
							if(option.mapSelectedEvent) {
								self.mapSelectFuc(self.chart);
							}
							if(option.clickEvent) {
								self.clickFuc(self.chart);
							}
							if(option.hoverEvent) {
								self.hoverFuc(self.chart);
							}

						} else {
							self.echarts = echarts;
							/*
							if(!option.dataOption.series[0].data||option.dataOption.series[0].data.length==0){
									$(self.container).attr("id",option.id);
									$(self.container).html("<div style='text-align:center;color:#fff;padding:15px 0 0 0;'>无数据</div>");
									return;
								}
							*/

							self.chart = self.echarts.init(self.element, self.theme);
							self.chartEle = self.chart.setOption(option.dataOption, true);

							$(window).on("resize", function() {
								self.reDraw();
							});
							if(option.mapSelectedCallback) {
								self.mapSelectFuc(self.chart);
							}
							if(option.clickCallback) {
								self.clickFuc(self.chart);
							}
							if(option.hoverCallback) {
								self.hoverFuc(self.chart);
							}
						}
					});
				} else {
					require(["echarts.min", option.theme], function(echarts, theme) {
						self.echarts = echarts;
						self.theme = theme;

						self.chart = self.echarts.init(self.element, self.theme);
						self.chartEle = self.chart.setOption(option.dataOption, true);

						$(window).on("resize", function() {
							self.reDraw();
						});
						if(option.mapSelectedCallback) {
							self.mapSelectFuc(self.chart);
						}
						if(option.clickCallback) {
							self.clickFuc(self.chart);
						}
						if(option.hoverCallback) {
							self.hoverFuc(self.chart);
						}
					});
				}

			}

		};

		self.setChartOption = function(chartOption) {
			option.dataOption = chartOption;
		};

		self.getChartOption = function() {
			return option.dataOption;
		};

		self.refresh = function(chartOption) {
			self.setChartOption(chartOption);
			self.chart.setOption(option.dataOption, true);
		};

		self.reDraw = function() {
			/*
			if(!option.dataOption.series[0].data||option.dataOption.series[0].data.length==0){
				$(self.container).attr("id",option.id);
				$(self.container).html("<div style='text-align:center;color:#fff;padding:15px 0 0 0;'>无数据</div>");
				return;
			}
			*/

			self.chart = self.echarts.init(self.element, self.theme);
			self.chart.setOption(option.dataOption, true);
			if(option.mapSelectedEvent) {
				self.mapSelectFuc(self.chart);
			}

		};
		self.create();
		return self;
	};

	/**轮播组件**/
	base.carousel = function(option) {
		var self = {};
		if(!option) {
			return;
		} else {

			self.container = $(option.container) ? $(option.container) : null;
			if(!option || !self.container) {
				return;
			}
			self.index = 0;
			self.data = option.data ? option.data : null;
			self.remoteData = option.remoteData ? option.remoteData : null;
			self.step = option.step ? option.step : 4;
			self.interval = option.interval ? option.interval : false;
			self.carouselBody = $(self.container).find(".carousel-inner");
		}

		self.setCarousel = function() {
			if(option.setCarouselEvent) {
				option.setCarouselEvent(self);
			}

		};
		self.slid = function() {
			if(option.slidEvent) {
				$(self.container).on("slid.bs.carousel", function() {
					option.slidEvent(self);
				});
			}
		};
		self.slide = function() {
			if(option.slideEvent) {
				$(self.container).on("slide.bs.carousel", function() {
					option.slideEvent(self);
				});
			}
		};
		self.next = function() {
			$(self.container).carousel('next');
		};
		self.prev = function() {
			$(self.container).carousel('prev');
		};
		self.drawCarousel = function() {
			if(option.slideEvent) {
				$(self.container).on("slide.bs.carousel", function() {
					option.slideEvent(self);
				});
			}

			if(self.data) {

				//self.setCarousel();
				$(self.container).carousel({
					interval: self.interval
				});
			}

		};
		self.create = function() {
			base.setProperty(self.carouselBody, option);
			self.slid();
			self.slide();
			self.drawCarousel();
			self.setCarousel();
			return self;
		};
		self.create();
		return self;
	};

	/**highCharts组件**/
	base.highCharts = function(option) {
		var self = {};
		self.container = option.container ? option.container : null;
		self.chartOption = option.chartOption ? option.chartOption : null;
		self.theme = option.theme ? option.theme : "dark";
		self.callback = option.callback?option.callback:null;
		self.element = null;
		self.isMain = option.isMain ? option.isMain : true;
		self.create = function() {
			if(self.container && self.chartOption) {
				if(self.isMain) {
					self.element = self.container;
				} else {
					self.element = document.createElement("div");
					$(self.container).append(self.element);
				}
				base.setProperty(self.element, option);
				if(self.callback){
					$(self.element).highcharts(self.chartOption,self.callback);
				}else{
					$(self.element).highcharts(self.chartOption);
				}
				
			}
			return self;
		}
		self.create();
		return self;
	};

	/**进度条**/
	base.progress = function(option) {
		var self = {};
		self.element = null;
		self.container = option.container ? option.container : null;
		self.data = option.data.replace("/g", "%");
		self.data = Number(self.data) ? Number(self.data) : 0;
		self.animate = option.animate ? option.animate : true;
		self.progressColor = option.progressColor ? option.progressColor : "#0298f7";
		self.bgColor = option.bgColor ? option.bgColor : "#111";
		self.radius = option.radius ? option.radius : 5;
		self.label = null;
		self.height = option.height ? option.height : 9;
		self.progress = null;
		self.labelColor = option.labelColor ? option.labelColor : "#fff";
		self.progressLine = null;
		self.timer = option.timer ? option.timer : 1000;
		self.create = function() {
			$(self.container).css("height", self.height);
			$(self.container).css("float", "left");
			$(self.container).html("");
			if(!option.label) {
				self.setLabel();
			} else {
				if(option.label.show || option.label.show == "undefined")
					self.setLabel();
			}

			self.setProgress();
			base.setProperty(self.element, option);
			return self;
		};
		self.setLabel = function() {
			self.label = document.createElement("div");
			$(self.label).addClass("progressLabel");
			$(self.label).css("text-align", "center");
			//$(self.label).css("padding-top","3px");
			$(self.label).css("position", "relative");
			$(self.label).css("height", self.height);
			$(self.label).css("z-index", 3);

			if(self.height > 9) {
				$(self.label).css("top", self.height - 9);
			} else {
				$(self.label).css("top", -(9 - self.height + 3));
			}

			$(self.label).css("color", self.labelColor);
			$(self.label).css("font-size", self.height);
			$(self.label).html(0 + "%");
			$(self.container).append(self.label);
		};
		self.progressGlass = null;
		self.setProgressGlass = function() {
			self.progressGlass = document.createElement("div");
			$(self.progressGlass).addClass("progressGlass");
			$(self.progressGlass).css("background-color", "rgba(255,255,255,0.35)");
			$(self.progressGlass).css("height", self.height * 0.4);
			$(self.progressGlass).css("position", "absolute");
			$(self.progressGlass).css("border-radius", self.radius);
			$(self.progressGlass).css("left", 2);
			$(self.progressGlass).css("right", 2);
			$(self.progressGlass).css("top", 1);
			$(self.progress).append(self.progressGlass);
		};
		self.setProgress = function() {
			self.progress = document.createElement("div");

			$(self.progress).css("border-radius", self.radius);
			$(self.progress).css("width", "100%");
			$(self.progress).css("position", "relative");
			$(self.progress).css("z-index", 1);
			$(self.progress).css("top", -6);
			//$(self.progress).css("border","1px solid rgba(0,255,255,0.4)");
			$(self.progress).css("background", self.bgColor);
			//$(self.progress).css("border","1px solid rgba(0,0,0,0.8)");
			$(self.progress).css("padding", 1);
			$(self.progress).css("height", self.height);
			//$(self.progress).css("color",option.progress.color?option.progress.color:["#0093ca"]);
			$(self.progress).css("font-size", "13px");
			$(self.progress).css("box-shadow", "0 0 5px rgba(0,0,0,0.7)");
			$(self.container).append(self.progress);

			if(!base.IE8()) {
				self.setProgressGlass();
			}
			self.setProgressLine();
		};
		self.clear = function() {
			$(self.progressLine).css("width", 0);
		};
		self.timeoutFuc = null;
		self.animate = function() {
			if(self.animate) {
				$(self.progressLine).css("width", 0);
				var i = 0;
				self.timeoutFuc = window.setInterval(function() {
					i++;
					$(self.label).html(i + "%");
					if(i >= self.data) {
						window.clearInterval(self.timeoutFuc);
					}
				}, self.timer / self.data)
				$(self.progressLine).animate({
						"width": $(self.progress).width() * (self.data / 100)
					},
					self.timer
				);
			} else {
				$(self.label).html(self.data + "%");
				$(self.progressLine).css("width", $(self.progress).width() * (self.data / 100));
			}
		};
		self.setProgressLine = function() {
			self.progressLine = document.createElement("div");
			$(self.progressLine).addClass("progressLine");
			$(self.progressLine).css("border-radius", self.radius);

			if(jQuery.isArray(self.progressColor)) {
				var d = null;
				var min = 0;
				var max = 0;
				$(self.progressColor).each(function(i, o) {
					if(o.split(":").length > 1) {
						min = max;
						max = o.split(":")[1];
					} else {
						min = max;
						max = Math.round(100 / self.progressColor.length * (i + 1));
					}
					if(self.data >= min && self.data < max) {
						d = o;
					}
				});
				if(d) {
					var color = d.split(":")[0];
					$(self.progressLine).css("background", color);
					$(self.progressLine).css("box-shadow", "0 0 15px " + color);
				}

			} else {
				$(self.progressLine).css("background", self.progressColor);
			}
			$(self.progressLine).css("padding", 0);
			$(self.progressLine).css("height", "100%");

			$(self.progress).append(self.progressLine);
			self.animate();
		};

		self.create();
		return self;
	};
	/**圆形进度条**/
	base.roundLoader = function(option) {

		var self = {};
		self.container = option.container ? option.container : null;
		self.time = option.time ? option.time : null;
		self.showPercentage = option.showPercentage ? option.showPercentage : false;
		self.element = null;
		self.value = self.value ? self.value : 0;
		self.create = function() {
			if(base.IE8()) {
				return;
			}
			if(option && self.container) {
				require(["radialIndicator"], function() {
					base.setProperty(self.element, option);
					self.set();
				});
			}
			return self;
		};
		self.set = function() {

			if(self.time) {

				window.setInterval(function() {
					if(self.value < 100) {
						self.value = self.value + 1;
					} else {
						self.value = 0;
						if(option.drawEvent) {
							option.drawEvent(self);
						}
					}
					self.draw();
				}, self.time / 100);
			} else {
				self.draw();
			}

		};
		self.draw = function() {

			$(self.container).html("");

			self.element = $(self.container).radialIndicator({
				radius: 12,
				showPercentage: self.showPercentage,
				displayNumber: false,
				barWidth: 2.5,
				roundCorner: true,
				barBgColor: "rgba(0,0,0,0)",
				barColor: "#20c6fc",
				shadowColor: "#20c6fc",
				shadowRadius: 5
			}).data("radialIndicator");
			self.element.value(self.value);
		};
		self.create();
		return self;
	};

	/**定制化滚动条**/
	base.scroll = function(option) {
		var self = {};
		self.container = option.container ? option.container : null;
		self.topEvent = option.topEvent ? option.topEvent : null;
		self.bottomEvent = option.bottomEvent ? option.bottomEvent : null;
		self.scrollEvent = option.scrollEvent ? option.scrollEvent : null;
		self.xScroll = option.xScroll ? option.xScroll : false;
		self.callback = option.callback?option.callback:null;
		self.scrollOption = {
			"mouseWheel": true
		};
		self.create = function() {
			require(["jqScrollbar"],function(){
				if(self.scrollEvent) {
					self.scrollOption.callbacks.onScroll = function() {
						self.scrollEvent(self);
					}
					}
					if(self.bottomEvent) {
						self.scrollOption.callbacks.onTotalScroll = function() {
							self.bottomEvent(self);
						}
					}
					if(self.topEvent) {
						self.scrollOption.callbacks.onTotalScrollBack = function() {
							self.topEvent(self);
						}
					}
					if(self.xScroll) {
						self.scrollOption.horizontalScroll = self.xScroll;
					}
					$(self.container).mCustomScrollbar(self.scrollOption);
					
					if(self.callback){
						self.callback(self);
					}
					return self;
				});
			
			return self;
		};
		self.destroy = function() {
			$(self.container).mCustomScrollbar("destroy");
		};
		self.disable = function() {
			$(self.container).mCustomScrollbar("disable");
		};
		self.create();
		return self;

	};
	/**表格**/
	base.grid = function(option) {
		var self = {};
		self.container = option.container ? option.container : null;
		self.table = null;
		self.ajaxType = option.ajaxType ? option.ajaxType : "get";
		self.header = null;
		self.body = null;
		self.footer = null;
		self.params = {};
		self.columns = null;
		self.gridOption = option.gridOption ? option.gridOption : null;
		self.pagination = option.pagination ? option.pagination : true;
		self.paginationContainer = null;
		self.paginationNumber = 5;
		self.url = option.url ? option.url : null;
		self.data = option.data ? option.data : null;
		self.pageSize = option.pageSize ? option.pageSize : 10;
		self.pageNumber = 1;
		self.callback = option.callback ? option.callback : null;
		self.total = 0;
		self.pageCount = 0;
		self.pageItemOption = {
			"first": {
				type: "first",
				title: "首页",
				number: 1,
				context: "<i class='fa fa-angle-double-left'></i>"
			},
			"previous": {
				type: "previous",
				title: "上一页",
				number: self.pageNumber - 1,
				context: "<i class='fa fa-angle-left'></i>"
			},
			"moreLeft": {
				type: "moreLeft",
				context: "..."
			},
			"moreRight": {
				type: "moreRight",
				context: "..."
			},
			"next": {
				type: "next",
				number: self.pageNumber - 1,
				title: "下一页",
				context: "<i class='fa fa-angle-right'></i>"
			},
			"last": {
				type: "last",
				number: self.pageCount,
				title: "末页",
				context: "<i class='fa fa-angle-double-right'></i>"
			},
			"jump": {
				type: "jump",
				context: "到第<input type='text' class='pageInput form-control'/>页<button style='margin-left:5px' class='btn btn-primary'>确定</button>"
			},
			"page": {
				number: null,
				type: "page",
				context: null,
				cls: "fb-page-item"
			}
		};
		self.create = function() {
			if(self.container) {
				self.drawTable();
			}
			return self;
		};

		self.drawTable = function() {
			if($(self.container).children("table").length == 0) {
				self.table = document.createElement("table");
				base.setProperty(self.table, self.gridOption.grid);
				$(self.container).append(self.table);
			} else {
				self.table = $(self.container).children("table")[0];
				base.setProperty(self.table, self.gridOption.grid);
			}
			self.drawHeader();
			self.drawBody();
			self.drawFooter();
			if(self.pagination){
				self.query({
					isPagination: true
				});
			}
			
		};
		self.drawSort = function(ele, data) {
			var s = "<div class='btn-group'><a class='dropdown-toggle' data-toggle='dropdown'><span>" + data.columnContext + "</span><i class='fa fa-sort-down'></i></a>" +
				"<ul class='dropdown-menu' role='menu'>" +
				"<li><a type='desc'>降序</a></li>" +
				"<li><a type='asc'>升序</a></li>" +
				"<li><a>正常</a></li>" +
				"</ul>";
			$(ele).html(s);
			$(ele).find(".dropdown-menu a").unbind("click").on("click", function() {
				switch($(this).attr("type")) {
					case "desc":
						self.params.sort = data.columnName + "_desc";
						break;

					case "asc":
						self.params.sort = data.columnName + "_asc";
						break;

					default:
						if(self.params.sort)
							delete self.params.sort;
						break;
				}
				self.pageNumber = 1;
				self.query({
					isPagination: true
				});
			});
		};
		self.drawHeader = function() {
			if($(self.container).children("thead").length == 0) {

				if(self.gridOption) {
					if(self.gridOption.columns && self.gridOption.columns.length > 0) {
						self.columns = self.gridOption.columns;
						self.header = document.createElement("thead");
						$(self.table).append(self.header);
						$(self.columns).each(function(i, o) {
							var tr = document.createElement("tr");
							$(self.header).append(tr);
							$(o).each(function(i1, o1) {
								var th = document.createElement("th");
								base.setProperty(th, o1);
								if(o1.sort) {
									self.drawSort(th, o1);
								} else {
									$(th).html(o1.columnContext);
								}
								$(tr).append(th);
							});
						});
					}
				}
			}
		};

		self.query = function(option) {
			$(self.body).html("");
			self.params.pageSize = self.pageSize;
			self.params.pageNumber = self.pageNumber;
			if(self.url) {
				base.ajax({
					url: self.url,
					params: self.params,
					type: self.ajaxType,
					success: function(data) {
						$(self.body).html("");
						var gridData = data.data;
						self.total = data.total;
						$(gridData).each(function(i, o) {
							var tr = document.createElement("tr");
							$(self.body).append(tr);
							$(self.columns[0]).each(function(i1, o1) {
								var td = document.createElement("td");
								if(self.gridOption.columnDefine[o1.columnName]) {
									var define = self.gridOption.columnDefine[o1.columnName];
									if(define.drawEvent) {
										define.drawEvent(o[o1.columnName], td);
									}
								} else {
									$(td).html(o[o1.columnName]);
								}

								$(tr).append(td);
							});
						});

						if(option) {
							if(option.isPagination) {
								self.drawPagination();
							}
						}
						if(self.callback) {
							self.callback();
						}
					},
					beforeSend: function() {
						$(self.body).html("<tr><td class='tb-loadContainer' style='height:200px' colspan='" + $(self.table)[0].rows.item(0).cells.length + "'></td></tr>");
						base.loading($(self.body).find(".tb-loadContainer"));
					}
				});
			}
		};
		self.drawBody = function() {
			$(self.table).remove("tbody");
			self.body = document.createElement("tbody");
			$(self.table).append(self.body);

		};
		self.drawFooter = function() {
			$(self.table).remove("tfoot");
			self.footer = document.createElement("tfoot");
			$(self.table).append(self.footer);
		};

		self.drawPagination = function() {
			if(!self.paginationContainer) {
				self.paginationContainer = document.createElement("ul");
				$(self.paginationContainer).addClass("fb-grid-pagination");
				$(self.container).append(self.paginationContainer);
			} else {
				$(self.paginationContainer).html("");
			}

			if(self.total % self.pageSize == 0) {
				self.pageCount = self.total / self.pageSize;
			} else {
				self.pageCount = Math.floor(self.total / self.pageSize) + 1;
			}

			self.drawPaginationItem();

		};
		self.setActive = function(ele) {
			$(self.paginationContainer).find(".active").removeClass("active");
			$(ele).addClass("active");
		};
		self.drawPaginationItem = function() {
			$(self.paginationContainer).find("li").remove();
			self.createPageItem("info");
			if(self.pageCount <= self.paginationNumber) { //分页总数<=页段数量
				for(var i = 1; i <= self.pageCount; i++) {
					self.createPageItem("page", i);
				}
			} else {
				if(self.pageNumber < self.paginationNumber) { //当前页<=页段数量
					for(var i = 1; i <= self.paginationNumber; i++) {
						self.createPageItem("page", i);
					}
					self.createPageItem("moreRight");
					self.createPageItem("next", self.pageNumber + 1);
					self.createPageItem("last", self.pageCount);
				} else if(self.pageNumber > (self.pageCount - self.paginationNumber)) {
					self.createPageItem("first", 1);
					self.createPageItem("previous", self.pageNumber - 1);
					self.createPageItem("moreLeft");
					for(var i = self.pageCount - self.paginationNumber; i <= self.pageCount; i++) {
						self.createPageItem("page", i);
					}
				} else {
					self.createPageItem("first", 1);
					self.createPageItem("previous", self.pageNumber - 1);
					self.createPageItem("moreLeft");

					for(var i = self.pageNumber - (Math.floor(self.paginationNumber / 2)); i <= self.pageNumber + (Math.floor(self.paginationNumber / 2)); i++) {
						self.createPageItem("page", i);
					}

					self.createPageItem("moreRight");
					self.createPageItem("next", self.pageNumber + 1);
					self.createPageItem("last", self.pageCount);
				}

			}
			self.createPageItem("jump");
		};
		self.createPageItem = function(type, number) {
			var item = document.createElement("li");
			$(self.paginationContainer).append(item);
			$(item).attr("type", type);
			switch(type) {
				case "info":
					$(item).html("<div style='letter-spacing:0.5px;padding:0 20px;font-size:13px;'>共" + self.pageCount + "页(" + self.total + "条记录)" + "" + "</div>");
					break;

				case "first":
					$(item).html("<i class='fa fa-angle-double-left'></i>");
					$(item).attr("title", "首页");
					$(item).on("click", function() {
						self.pageNumber = number;
						self.drawPaginationItem();
						self.query();
					});
					break;
				case "previous":
					$(item).html("<i class='fa fa-angle-left'></i>");
					$(item).attr("title", "上一页");
					$(item).on("click", function() {
						self.pageNumber = number;
						self.drawPaginationItem();
						self.query();
					});
					break;
				case "next":
					$(item).html("<i class='fa fa-angle-right'></i>");
					$(item).attr("title", "下一页");
					$(item).on("click", function() {
						self.pageNumber = number;
						self.drawPaginationItem();
						self.query();
					});
					break;
				case "last":
					$(item).html("<i class='fa fa-angle-double-right'></i>");
					$(item).attr("title", "末页");
					$(item).on("click", function() {
						self.pageNumber = number;
						self.drawPaginationItem();
						self.query();
					});
					break;

				case "page":
					$(item).addClass("fb-page-item");
					$(item).html(number);
					if(self.pageNumber == number) {
						$(item).addClass("active");
					}
					$(item).on("click", function() {
						self.pageNumber = number;
						self.drawPaginationItem();
						self.query();
					});
					break;
				case "moreLeft":
				case "moreRight":
					$(item).html("...");
					break;

				case "jump":
					$(item).html("到第<input type='number' class='pageInput form-control'/>页<button style='margin-left:5px' class='btn btn-primary'>确定</button>");
					$(item).find("button").on("click", function() {
						var num = $(item).find("input").val();
						if(num) {
							if(num < 1) {
								num = 1;
								$(item).find("input").val(num);
							} else if(num > self.pageCount) {
								num = self.pageCount;
							}
							self.pageNumber = num;
							self.query({
								isPagination: true
							});
						}
					});
					break;
			}

		};

		self.pageTo = function(pageNumber) {
			self.pageNumber = pageNumber;
			self.drawPaginationItem();
			self.query();
		};

		self.reset = function() {
			self.pageNumber = 1;
			self.pageSize = option.pageSize ? option.pageSize : self.pageSize;
			self.params = {};
			self.query({
				isPagination: true
			});
		};

		self.search = function(option) {
			self.pageNumber = 1;
			self.pageSize = option.pageSize ? option.pageSize : self.pageSize;
			if(option) {
				self.params = option.params ? option.params : self.params;
			}
			self.query({
				isPagination: true
			});
		};
		self.addRow = function(data,drawCallback){
			var row = document.createElement("tr");
			$(self.body).append(row);
			$(data).each(function(i,o){
				var column = document.createElement("td");
				column.html(o);
				$(row).append(column);
			});
			if(drawCallback){
				drawCallback(self);
			}
		};
		self.deleteRow = function(obj){
			$(obj).parents("tr").remove();
		};
		self.create();
		return self;
	};
	/**获取选中的checkbox或radio**/
	base.getCR = function(obj,hasValue){
		var cbs = null;
		var v = "";
		if((typeof(obj)).toLowerCase()=="string"){
			cbs =  $("input[name='"+obj+"']:checked");
			if(hasValue){
				$(cbs).each(function(i,o){
					if(i==($(cbs).length-1)){
						v+=$(o).val();
					}else{
						v+=$(o).val()+",";
					}
					
				});
				return v;
			}else{
				return cbs;
			}
			
		}else{
			cbs = $("input[name='"+$(obj).attr("name")+"']:checked");
			if(hasValue){
				$(cbs).each(function(i,o){
					if(i==($(cbs).length-1)){
						v+=$(o).val();
					}else{
						v+=$(o).val()+",";
					}
					
				});
			}else{
				return cbs;
			}
			
			
		}
/*		
		return $(obj).filter(":checked");*/
	};
	/**获取选中的checkbox或radio**/
	base.getChecks = function(name){
    	var cbs = $("input[name='"+name+"']");
    	var ary = [];
    	$(cbs).each(function(i,o){
    		if($(o).is(':checked')) {
    			ary.push($(o).val());
    		}
    	});
    	return ary;
	};
	
	/**设置选中checkbox或radio**/
	base.setChecks = function(data,name){
		var eles = $("input[name='"+name+"']");
		$(eles).each(function(i,o){
			$(o).prop("checked",false);
		});
		$(data).each(function(i,o){
			$(eles).filter("[value='"+o+"']").prop("checked",true);
		});
	};
	/**全选checkbox**/
	base.selectAll = function(e1, e2, callback) {
		$(e1).on("click", function() {
			if($(this).is(':checked')) {
				$(e2).prop("checked", true);
			} else {
				$(e2).prop("checked", false);
			}
			if(callback) {
				callback(e1, e2);
			}
		});
		
		$(e2).on("click",function(){
			if($(e2).filter(":checked").length==$(e2).length){
				$(e1).prop("checked",true);
			}else{
				$(e1).prop("checked",false);
			}
			if(callback) {
				callback(e1, e2);
			}
		});
	};
	base.clearLastCharacter = function(str){
		str=str.substring(0,str.length-1);
		return str;
	};

	base.formEntity = function() {
		var self = this;
		self.init = function(dataMap,form){
			var eles = $(form)[0].elements;
			for(var key in dataMap){
				var e =  $(form).find("[name='"+key+"']");
				var type = e.attr("type");
				if(type){
					type = type.toLowerCase();
				}
				
				switch(type){
					case "checkbox":
						base.setChecks(dataMap[key],e.attr("name"));
					break;
					
					case "radio":
						base.setChecks(dataMap[key],e.attr("name"));
					break;
					
					default:
						e.val(dataMap[key]);
					break;
				}
			}
		};
	};
	base.form = new base.formEntity();
	base.form.automatic = function(){
		
	};
	base.form.fileUpload = function(option){
		var self = {};
		self.url = option.url?option.url:null;
		self.success = option.success?option.success:null;
		self.error = option.error?option.error:null;
		self.id = option.id?option.id:null;
		self.params = option.params?option.params:null;
		self.create = function(){
			if(!self.url||!self.id){return;}
			require(["fileUpload"],function(){
				jQuery.ajaxFileUpload({ 
					url : self.url,
					secureuri : false,
					fileElementId : self.id,
					dataType : 'json',
					data:self.params,
					success : function(data, status){
						if(self.success){
							self.success(data,status);
						}
					},
					error:function(data, status,e){
						if(self.error){
							self.error(data,status,e);
						}
					}
				});
			});
		};
		self.create();
	};
	base.form.paramsToString = function(params){
		var s = "?";
		var i = 0;
		for(var key in params){
			if(i==0){
				s+=key+"="+params[key];
			}else{
				s+="&"+key+"="+params[key];
			}
			i++;
		}
		return s;
	};
	base.form.download = function(option){
		var self = {};
		self.url = option.url?option.url:null;
		self.params = option.url?option.params:null;
		self.download = function(){
			/*base.ajax({
				url:self.url,
				params:self.params,
				contentType:"application/force-download"
			});*/
			$.ajax({
				url:self.url+base.form.paramsToString(self.params),
				type:"post",
				data:self.params,
				dataType:"json",
				contentType:"application/json;charset=UTF-8",
				//contentType:"application/force-download",
				success:function(data){
					//alert(4444);
				}
			});
		/*	var xhr = base.xmlHttpRequest();
			console.log(xhr)
			xhr.onreadystatechange = function(){
				if(xhr.readState==4){
				        if(xmlhttp.status==200){
				           
				            var message=xmlhttp.responseText;   
				             
				          
				         }   
				 }  
			};
			xhr.open("post", self.url+base.form.paramsToString(self.params), true);
			xhr.responseType ="blob";
			console.log(xhr)
			xhr.send(null);*/
			/*require(["download"],function(){
				var url = self.url+base.form.paramsToString(self.params);
				$.fileDownload(url);
			});*/
		};
		self.download();
		return self;
	};
	
	/**获取form表单的参数**/
	base.form.getParams = function(form,isGet) {
		var params = null;
		if(isGet){
			params = "";
		}else{
			params = {};
		}
		var self = {};
		self.form = form?form:null;
		
		if(self.form){
			var eles = $(self.form)[0].elements;
			for(var i=0,j=eles.length;i<j;i++){
				var o = eles[i];
				
				//var name = $(o).attr("name") ? $(o).attr("name") : "element" + i;
				var name = $(o).attr("name");
				if(!name){continue;}
				if(o.tagName.toLowerCase() == "input"){
					if($(o).attr("type").toLowerCase() == "checkbox"||$(o).attr("type").toLowerCase() == "radio"){
						if(params[name]){
							continue;
						}else{
							var s = "";
							$(self.form).find("input[name='"+name+"']").each(function(i1,o1){
								if($(o1).is(':checked')) {
									s+=$(o1).val()+",";
								}
							});
							if(s!=""){
								s = base.clearLastCharacter(s);
								if(isGet){
									if(params==""){
										params+=name+"="+s;
									}else{
										params+="&"+name+"="+s;
									}
									
								}else{
									params[name] = s;
								}
								
							}
						}
					}else if($(o).attr("type").toLowerCase() == "button") {
						continue;
					}else{
						if($(o).val()){
							if(isGet){
								if(params==""){
									params +=name+"="+encodeURIComponent($(o).val());
								}else{
									params += "&"+name+"="+encodeURIComponent($(o).val());
								}
								
							}else{
								params[name] = $(o).val();
							}
							
						}
						
					}
				}else if(o.tagName.toLowerCase() == "select" && $(o).val() == "-1"){
					continue;
				}else if(o.tagName.toLowerCase() == "button") {
					continue;
				}else {
					if(isGet){
						if(params==""){
							params +=name+"="+encodeURIComponent($(o).val());
						}else{
							params += "&"+name+"="+encodeURIComponent($(o).val());
						}
						
					}else{
						params[name] = $(o).val();
					}
				}
			}
			
				
			
		}
		return params;
	};
	
	
	/**form表单校验**/
	base.form.validate = function(option) {
		var self = {};
		self.form = option.form?option.form:null;
		self.roles = option.roles?option.roles:null;
		self.promptType = option.promptType?option.promptType:"follow";
		self.checkAll = option.checkAll?option.checkAll:false;
		self.errorMsg = [];
		self.isPass = true;
		self.tipPosition = option.tipPosition?option.tipPosition:"bottom";
		self.passCallback = option.passCallback?option.passCallback:null;
		self.notPassCallback = option.notPassCallback?option.notPassCallback:null;
		self.error = function(role,errorText,obj){
			switch(self.promptType){
				case "top":
					if($(obj).attr("type")){
						if($(obj).attr("type").toLowerCase()=="checkbox"||$(obj).attr("type").toLowerCase()=="radio"){
							//$(obj).parent().addClass("errorStyle");
						}else{
							$(obj).addClass("errorStyle");
						}
					}else{
						$(obj).addClass("errorStyle");
					}
					
					
				break;
				
				case "tip":
					if($(obj).attr("type")){
						if($(obj).attr("type").toLowerCase()=="checkbox"||$(obj).attr("type").toLowerCase()=="radio"){
							$(obj).parent().attr("data-toggle","tooltip");
							$(obj).parent().attr("data-placement",self.tipPosition);
							$(obj).parent().attr("data-trigger","manual");
							$(obj).parent().attr("title",errorText);
							//$(obj).parent().addClass("errorStyle");
						}else{
							$(obj).attr("data-toggle","tooltip");
							$(obj).attr("data-placement",self.tipPosition);
							$(obj).attr("data-trigger","manual");
							$(obj).attr("title",errorText);
							$(obj).addClass("errorStyle");
						}
					}else{
						$(obj).attr("data-toggle","tooltip");
						$(obj).attr("data-placement",self.tipPosition);
						$(obj).attr("data-trigger","manual");
						$(obj).attr("title",errorText);
						$(obj).addClass("errorStyle");
					}
					
				break;
				
				case "follow":
					$(obj).parent().find(".ui-form-error").remove();
					$(obj).parent().append("<div class='ui-form-error' style='color:red;text-align:left;'>"+errorText+"</div>");
					if($(obj).attr("type")!="checkbox"&&$(obj).attr("type")!="radio"){
						$(obj).addClass("errorStyle");
					}
					
				break;
				
			}
			self.errorMsg.push(errorText+"<br>");
			return true;
		};
		self.verify = function(obj,role){
			var errorText = "";
			var hasError = false;
			var iname =  role.text?role.text:$(obj).attr("name");

			for(var key in role){
				switch(key){
					case "required"://是否必填
					
						if(role[key]){
							
							switch($(obj)[0].tagName.toLowerCase()){
								case "select":
								
									var val = $(obj).val();
									
									if(!val||val=="-1"){
										if(self.promptType=="tip"||self.promptType=="follow"){
											errorText = "必选项";
										}else{
											errorText = iname+"是必选项";
										}
										hasError = self.error(role,errorText,obj);
									}
								break;
								
								case "textarea":
									var val = $(obj).val();
									if(!val){
										if(self.promptType=="tip"||self.promptType=="follow"){
											errorText = "必填项";
										}else{
											errorText = iname+"是必填项";
										}
										hasError = self.error(role,errorText,obj);
									}
								break;
								
								case "input":
									switch($(obj).attr("type")){
										case "checkbox":
										case "radio":
										
											if(base.getChecks($(obj).attr("name")).length==0){
												if(self.promptType=="tip"||self.promptType=="follow"){
													errorText = "必选项";
												}else{
													errorText = iname+"是必选项";
												}
												
												hasError = self.error(role,errorText,obj);
											}
										break;
										
										
										
										default:
										
											var val = $(obj).val();
											if(!val){
												if(self.promptType=="tip"||self.promptType=="follow"){
													errorText = "必填项";
												}else{
													errorText = iname+"是必填项";
												}
												
												hasError = self.error(role,errorText,obj);
											}
										break;
									}
								break;
							}
						}
					break;
					
					case "int"://是否是整数
					case "float"://是否是小数
					case "number"://是否是数字
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						var ex = /^\d+$/;
						var ds = "整数";
						if(key=="float"){
							ex = /^\d+(\.\d+)?$/;
							ds = "小数";
						}else if(key=="number"){
							ds ="数字";
						}
						
						if(isNaN(Number(val))){
							if(self.promptType=="tip"){
								errorText = "必须是"+ds;
							}else{
								errorText = iname+"必须是"+ds;
							}
							hasError = self.error(role,errorText,obj);
						}else{
							
							if(!ex.test(val)&&key!="number"){
								if(self.promptType=="tip"){
									errorText = "必须是"+ds;
								}else{
									errorText = iname+"必须是"+ds;
								}
								hasError = self.error(role,errorText,obj);
							}else{
								switch((typeof(role[key])).toLowerCase()){
									case "number":
										
										if(Number(val)>role[key]){
											if(self.promptType=="tip"){
												errorText = "数字不能大于"+role[key];
											}else{
												errorText = iname+"数字不能大于"+role[key];
											}
											hasError = self.error(role,errorText,obj);
										}
									break;
									
									default:
										if(jQuery.isArray(role[key])&&role[key].length>=2){
											if(val<role[key][0]){
												if(self.promptType=="tip"){
													errorText = "不能小于"+role[key][0];
												}else{
													errorText = iname+"不能小于"+role[key][0];
												}
												hasError = self.error(role,errorText,obj);
											}else if(val>role[key][1]){
												if(self.promptType=="tip"){
													errorText = "不能大于"+role[key][1];
												}else{
													errorText = iname+"不能小于"+role[key][0];
												}
												hasError = self.error(role,errorText,obj);
											}
										}
									break;
								}
							}
						}
					break;
					
					
					case "length"://字符串长度
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(val.length>role[key]){
							if(self.promptType=="tip"){
								errorText = "不能超过"+role[key]+"个字符";
							}else{
								errorText = "不能超过"+role[key]+"个字符";
							}
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "identityCard"://身份证
						errorText = "身份证号不正确";
						var ex = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "en"://英文
						errorText = "必须是英文";
						var ex = /^[a-z]*|[A-Z]*$/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "ip"://ip地址
						errorText = "IP地址不正确";
						var ex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "money"://货币 
						var ex = /^\d+.?\d{0,2}$/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(isNaN(val)){
							errorText = "格式不正确";
							hasError = self.error(role,errorText,obj);
						}else{
							 val = Number(val);
							if(!ex.test(val)){
								if(self.promptType=="tip"){
									errorText = "格式不正确";
								}else{
									errorText = "格式不正确";
								}
								hasError = self.error(role,errorText,obj);
							}
						}
					break;
					
					case "mobile"://手机号
						errorText = "手机号码不正确";
						var ex = /^1\d{10}$/
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "telephone"://普通电话 
						errorText = "电话号码不正确";
						//var ex = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
						var ex = /^0\d{2,3}-?\d{7,8}$/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "email"://邮箱
						errorText = "邮箱地址不正确";
						var ex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "filter"://只允许字母、数字、下划线
						var ex = /^\w+$/;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							
							errorText = "只允许字母、数字、下划线";
							
							hasError = self.error(role,errorText,obj);
						}
					break;
					
					case "filterCN":
						var ex = /^[\u4E00-\u9FA5a-zA-Z0-9_]+$/; 
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							
							errorText = "不能包含特殊字符";
							
							hasError = self.error(role,errorText,obj);
						}
					break;
					/**以什么开头**/
					case "first":
						var fs = role[key];
						var l = fs.length;
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if (val.slice(0,l) != fs) {
							errorText = "必须以"+fs+"开头";
							hasError = self.error(role,errorText,obj);
						}

					break;
					
					/**网址**/
					case "website":
						var strRegex = "^[^\s]+"; 
						var ex = new RegExp(strRegex);
						var val = $(obj).val();
						if(!val||val==""){
							return;
						}
						if(!ex.test(val)){
							errorText = "网络地址不正确";
							hasError = self.error(role,errorText,obj);
						}
						
					break;
				}
			}
			return hasError;
		};
		self.init = function(){
			self.errorMsg = [];
			self.isPass = true;
			$(self.form).find(".alert").remove();
			$(self.form).find("[data-toggle='tooltip']").tooltip('destroy');
			$(self.form).find("[data-toggle='tooltip']").removeAttr("title");
			$(self.form).find("[data-toggle='tooltip']").removeAttr("data-toggle");
			$(".errorStyle").removeClass("errorStyle");
			$(".ui-form-error").remove();
			if($("#errorStyle").length==0){
				$("head").append("<style id='errorStyle'>.errorStyle{border:1px solid red;}</style>");
			}
		};
		self.scan = function(){
			self.init();
			if(self.form){
				if(self.roles){
					var i = 0;
					for(var name in self.roles){
						var role = self.roles[name];
						var obj = $(self.form).find("[name='"+name+"']");
						
						if(role&&obj.length>0){
							if(self.checkAll){
								self.verify(obj,role);
							}else{
								if(self.verify(obj,role)){
									break;
								}
							}
						}
						i++;
					}
				}else{
					var tmp = {};
					if($(self.form).length==0){return;}
					var eles = $(self.form)[0].elements;
					for(var i=0,j=eles.length;i<j;i++){
						var o =  $(eles[i]);
						var role = o.attr("role");
						if(role){
							var roleData = eval("("+role+")");
							var name = o.attr("name");
							
							if(self.checkAll){
								
								if(tmp[name]){
									continue;
								}else{
									self.verify(o,roleData);
									tmp[name] = true;
								}
							}else{
								
								if(tmp[name]){
									continue;
								}else{
									if(self.verify(o,roleData)){
										break;
									};
								}
							}
						}
					}
				}
				if(self.errorMsg.length>0){
					switch(self.promptType){
						case "tip":
							if(self.checkAll){
								$(self.form).find("[data-toggle='tooltip']").tooltip("show");
							}else{
								$(self.form).find("[data-toggle='tooltip']:eq(0)").tooltip("show");
							}
							
						break;
						
						case "top":
							var alertDialog = document.createElement("div");
							$(alertDialog).addClass("alert alert-danger");
							$(self.form).prepend(alertDialog);
							if(self.checkAll){
								$(self.errorMsg).each(function(i,o){
									$(alertDialog).append(i+1+"."+o);
								});
							}else{
								$(alertDialog).append(self.errorMsg[0]);
							}
						break;
					}
					self.isPass = false;
				}
			}else{
				self.isPass =false;
			}
			if(self.isPass){
				if(self.passCallback){
					self.passCallback(self);
				}
			}else{
				if(self.notPassCallback){
					self.notPassCallback(self);
				}
			}
			return self.isPass;
		};
		
		self.scan();
		return self.isPass;
	};
	/**form表单重置**/
	base.form.reset = function(form, callback) {
		if(form) {
			$(form)[0].reset();
			if(callback) {
				callback(form);
			}
		}
	};
	/**form表单组件-Button**/
	base.form.button = function(option) {
		var self = {};
		self.label = option.label ? option.label : "确定";
		self.disabled = option.disabled ? option.disabled : false;
		self.container = option.container ? option.container : $("body");
		self.element = null;
		self.clickEvent = option.clickEvent ? option.clickEvent : null;
		self.id = option.id ? option.id : null;
		self.cls = option.cls?option.cls:null;
		self.style = option.style?option.style:null;
		self.create = function() {
			self.element = document.createElement("button");
			$(self.element).html(self.label);
			if(self.cls) {
				$(self.element).addClass(option.cls.replace(/,/g, " "));
			} else {
				$(self.element).addClass("btn btn-primary");
			}
			if(self.style) {
				$(self.element).attr("style", option.style.replace(/,/g, ";"));
			}
			if(self.id) {
				$(self.element).attr("id", self.id);
			}
			if(self.disabled) {
				$(self.element).addClass("disabled");
			} else {
				if(self.clickEvent) {
					$(self.element).on("click", function() {
						self.clickEvent(self);
					});
				}
			}
			$(self.container).append(self.element);
		};
		self.create();
		return self;
	};
	/**日历控件**/
	base.form.date = function(option) {
		var self = {};
		self.dateOption= option.dateOption?option.dateOption:{};
		self.element = option.element?option.element:null;
		self.isTime = option.isTime?option.isTime:false;
		self.theme = option.theme?option.theme:"molv";
		self.create = function() {
			if($(self.element).length>0){
				require(["date"], function() {
					laydate.skin(self.theme);
					$(self.element).on("click",function(){
						if(self.isTime){
							self.dateOption.istime = true;
							self.dateOption.format = "YYYY-MM-DD hh:mm:ss";
						}
						laydate(self.dateOption);
					});
					return self;
				});
			}
		};
		self.create();
		return self;
	};
	/**联想模糊选择框**/
	base.form.autoSelect = function(option){
		var self = {};
		self.container = option.container?option.container:null;
		self.data = option.data?option.data:null;
		self.url = option.url?option.url:null;
		self.params = option.params?option.params:{};
		self.size = option.size?option.size:10;
		self.highLight = option.highLight?option.highLight:true;
		self.autoSelectObj = null;
		self.type = option.type?option.type:"get";
		self.ajaxSettings = option.ajaxSettings?option.ajaxSettings:{};
		self.dropContainer= option.dropContainer?option.dropContainer:null;
		self.clickCallback = option.clickCallback?option.clickCallback:null;
		self.width = option.width?option.width:"auto";
		self.create = function(){
			if(self.container){
				
				require(["autoSelect"],function(){
					if(self.data){//静态数据
						self.autoSelectObj = $(self.container).autoSelect({
						    lookup: self.data,
						    dropContainer:self.dropContainer,
						    clickCallback:self.clickCallback,
						    width:self.width,
						    onSelect: function (suggestion) {
						        //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
						    }
						});
					}else if(self.url){//动态远程数据
						
						self.autoSelectObj = $(self.container).autoSelect({
						    serviceUrl: self.url,
						    params:self.params,
						    type:self.type,
						    dropContainer:self.dropContainer,
						    ajaxSettings:self.ajaxSettings,
						    clickCallback:self.clickCallback,
						    width:self.width,
						    lookupFilter: function (suggestion, query, queryLowerCase) {
						    },
						    onSelect: function (suggestion) {
						        //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
						    }
						});
					}
				});
				
			}
			return self;
		};
		self.disable = function(){
			self.autocompleteObj.disable();
		};
		self.create();
		return self;
	};
	
	/**树形select组件**/
	base.form.treeSelect = function(option){
		var self = {};
		self.container = option.container?option.container:null;
		self.parentContainer = option.parentContainer?option.parentContainer:$("body");
		self.data = option.data?option.data:null;
		self.url = option.url?option.url:null;
		self.params = option.params?option.params:{};
		self.multi = option.multi?option.multi:false;
		self.treeContainer = null;
		self.type = option.type?option.type:"get";
		self.clickEvent = option.clickEvent?option.clickEvent:function(){};
		self.clickCallback = option.clickCallback?option.clickCallback:null;
		if(!self.multi){
			self.clickEvent = function(event,treeId,treeNode){
				$(self.container).val(treeNode.name);
				$(self.container).attr("tid",treeNode.id);
				self.hide();
				if(self.clickCallback){
					self.clickCallback(event,treeId,treeNode)
				}
			};
		}
		
		self.id = option.id?option.id:base.getRandom(1000,9999);
		self.setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			callback:{
				onClick:self.clickEvent
			}
		};
		self.create = function(){
			if($(self.container).length>0){
				$(self.container).on("click",function(e){
					if($(this).hasClass("active")){return;}
					self.createTree();
					$(this).addClass("active");
				});
				$(document).on("click",function(e){
					var ele = e.target;
					if($(ele).is($(self.container))){
						return;
					}
					if($(ele).parents("[type='treeSelect']").length>0){
						return;
					}
					if($(ele).hasClass("[type='treeSelect']").length>0){
						return;
					}
					self.hide(e);
				});
			}
			
		};
		self.createTree = function(){
			self.treeContainer = document.createElement("div");
			$(self.treeContainer).attr("type","treeSelect");
			$(self.treeContainer).attr("id",self.id);
			$(self.treeContainer).css("position","absolute");
			$(self.treeContainer).css("z-index","10000");
			if(self.cls||self.style){
				base.setProperty(self.element, option);
			}else{
				$(self.treeContainer).css("border","1px solid #109bdc");
				$(self.treeContainer).css("background-color","#fff");
				$(self.treeContainer).css("height",180);
				$(self.treeContainer).css("overflow","auto");
				$(self.treeContainer).css("box-shadow","0 0 5px #aaa");
			}
			
			$(self.treeContainer).addClass("ztree");
			//alert("left:"+$(self.container).offset().left+",top:"+$(self.container).offset().top)
			$(self.treeContainer).css("left",$(self.container).offset().left);
			$(self.treeContainer).css("top",$(self.container).offset().top+$(self.container).height());
			$("body").append(self.treeContainer);
			if(self.data){
				base.tree({
					container:$(self.treeContainer),
					data:self.data,
					setting:self.setting
				});
			}else{
				if(self.url){
					base.ajax({
						url:self.url,
						type:self.type,
						params:self.params,
						success:function(data){
							base.tree({
								container:$(self.treeContainer),
								data:data,
								setting:self.setting
							});
						}
					})
				}
			}
			
		};
		self.hide = function(event){
			
			$(self.container).removeClass("active");
			$(self.treeContainer).remove();
		};
		self.create();
		return self;
	};
	
	
	/**echarts封装**/
	base.echarts = function(option) {
		var self = {};
		self.container = option.container ? option.container : $("body");
		self.chartOption = option.chartOption ? option.chartOption : null;
		self.chart = null;
		self.echarts = option.echarts?option.echarts:null;
		self.drawCallback = option.drawCallback?option.drawCallback:null;
		self.create = function() {
			if(!self.echarts){return;}
			if(self.chartOption) {
					if(self.beforeEvent) {
						self.beforeEvent(self)();
					}
					self.chart = self.echarts.init($(self.container)[0]);
					if(self.chartOption.length>0){
						
						$(self.chartOption).each(function(i,o){
							self.chart.setOption(o);
						});
					}else{
						self.chart.setOption(self.chartOption);
					}
					if(self.drawCallback){
						self.drawCallback(self);
					}
					$(window).on("resize",function(){
						self.chart.resize();
					});
			
			}
			return self;
		};
		self.refresh = function(chartOption){
			self.chartOption = chartOption;
			self.chart.setOption(self.chartOption);
		};
		self.create();
		return self;
	};
	/**3d球组件**/
	base.earthRollMap = function(option) {
		var self = {};
		self.rippleImg = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiANCiJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPiAgICANCiAgICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSI1IiAgc3Ryb2tlPSJyZ2IoNCwxOTgsMjU0KSIgbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbD0icmdiYSgwLDAsMCwwKSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiI+DQogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9InhtbCIgIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjAiIHRvPSIyMCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZnJvbT0iMSIgdG89IjAiIGJlZ2luPSIwcyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+DQogICAgPC9jaXJjbGU+DQo8L3N2Zz4=";
		self.container = option.container ? option.container : $("body");
		self.data = option.data?option.data:null;
		self.mapOption = {
			backgroundColor: '#999',

			globe: {
				baseTexture: "/service/images/earth-specbetter.jpg",
				//heightTexture: "/service/images/earth-specbetter-height.jpg",
				displacementScale: 0,
				environment: "#000f1a",
				shading: 'color',
				//environment: 'rgba(0,0,0,0)',
				realisticMaterial: {
					roughness: 0.9
				},
				postEffect: {
					enable: false,
					bloom: {
						enable: true,
						bloomIntensity: 0.1
					}
				},
				depthOfField: {
					enable: true
				},
				FXAA: {
					enable: true
				},
				viewControl: {
					autoRotate:true,
					distance: 170,
					center: [0, 0, 0],
					beta: 130,
					alpha: 30,
					autoRotateAfterStill: 0.5
				}
			},
			series: self.data
		};

		self.create = function(){
			require(["echartsGl"], function() {
				var mapEntity = base.echarts({
					container: self.container,
					option: self.mapOption
				});
			});
		};
		self.create();
	};
	/**3d地图组件**/
	base.geoRollMap = function(option){
		var self = {};
		
		self.container = option.container ? option.container : $("body");
		self.data = option.data?option.data:null;
		self.mapEntity = null;
		self.pointsMapEntity = null;
		self.mapName = option.mapName?option.mapName:"world";
		self.mapOption = {
	        geo3D: {
	            map: self.mapName,
	            shading: 'color',
	            //environment: '/asset/get/s/data-1491837999815-H1_44Qtal.jpg',
	            regionHeight:6,
	            silent: true,
	            groundPlane: {
	                show: false
	            },
	            light: {
	                main: {
	                    intensity: 0
	                },
	                ambient: {
	                    intensity: 0
	                }
	            },
	            viewControl: {
	                distance: 50,
	                center:[116.405285,39.904989]
	            },
	
	            itemStyle: {
	                areaColor: '#111'
	            },
	
	            boxHeight: 0.5
	        },
	        series: self.data
	    };
		self.create = function(){
			require(["echarts"],function(echarts){
				base.ajax({
					type:"get",
					url:"/service/map/"+self.mapName+".json",
					success:function(data){
						echarts.registerMap(self.mapName, data);
						require(["echartsGl"],function(){
							self.mapEntity = base.echarts({
								container: self.container,
								option: [{
							        series: [{
							            type: 'map',
							            map: self.mapName
							        }]
							    },self.mapOption]
							});
						});
					}
				});
			});
		};
		self.create();
	};

	/**校验是否是boolean**/
	base.isBoolean = function(v){
		if(typeof(v).toLowerCase()=="boolean"){
			return true;
		}else{
			return false;
		}
	};
	/**加载页面**/
	base.loadPage = function(option){
		var self = {};
		self.url = option.url?option.url:null;
		self.container = option.container?option.container:null;
		self.params = option.params?option.params:null;
		self.callback = option.callback?option.callback:null;
		self.scrolls = option.scrolls?option.scrolls:null;
		self.load = function(){
			if(self.container&&self.url){
				base.ajax({
					type:"get",
					url:self.url,
					dataType:"text",
					params:self.params,
					success:function(data){
						$(self.container).html(data);
						if(self.callback){
							self.callback(self);
						}
						if(self.scrolls){
							$(self.scrolls.split(",")).each(function(i,o){
								if($(o).length>0){
									base.scroll({
										container:$(o)
									});
								}
							});
						}
					},
					beforeSend:function(){
						base.loading($(self.container));
					},
					error:function(){
						$(self.container).html("加载错误");
					}
				});
			}
		};
		self.load();
	};
	/**reqirejs加载**/
	base.require = function(res,callback){
		require([res],function(){
			if(callback){
				callback();
			}
		});
	};
	/**datatables表格**/
	base.datatables = function(option){
		var self = {};
		self.option = option.option?option.option:null;
		self.container = option.container?option.container:null;
		self.grid = null;
		self.filter = option.filter?option.filter:null;
		self.callback = option.callback?option.callback:null;
		self.language = {
	        "sProcessing": "处理中...",
	        "sLengthMenu": "显示 _MENU_ 条记录",
	        "sZeroRecords": "没有匹配结果",
	        "sInfo": "第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
	        "sInfoEmpty": "显示第 0 至 0 条记录，共 0 条",
	        "sInfoFiltered": "(由 _MAX_ 条记录过滤)",
	        "sInfoPostFix": "",
	        "sSearch": "搜索:",
	        "sUrl": "",
	        "sEmptyTable": "表中数据为空",
	        "sLoadingRecords": "载入中...",
	        "sInfoThousands": ",",
	        "oPaginate": {
	            "sFirst": "<i style='font-size:15px;' class='fa fa-angle-double-left'></i>",
	            "sPrevious": "<i style='font-size:15px;' class='fa fa-angle-left'></i>",
	            "sNext": "<i style='font-size:15px;' class='fa fa-angle-right'></i>",
	            "sLast": "<i style='font-size:15px;' class='fa fa-angle-double-right'></i>"
	        },
	        "oAria": {
	            "sSortAscending": ": 以升序排列此列",
	            "sSortDescending": ": 以降序排列此列"
	        }
		};
		self.create = function(){
			if(self.container && self.option){
				self.option.language = self.language;
				$.fn.dataTable.ext.errMode = 'none';
				if(self.filter){
					self.option.ajax.dataFilter = self.filter;
				}
				self.grid = $(self.container).DataTable(self.option);
			}
			
		};
		self.reload = function(){
			$(self.container).find("thead input[type='checkbox']").prop("checked", false);
			self.grid.ajax.reload();
		};
		self.addRow = function(data){
			self.grid.row.add(data).draw(false);
		};
		self.deleteRow = function(obj){
			
			$(self.container).find("tbody tr").removeClass('selected');
           	$(obj).parents("tr").addClass('selected');
			self.grid.row(".selected").remove().draw(false);
		};
		self.create();
		return self;
	};
	/**请求处理的提示框**/
	base.requestTip= function(option){
		var self = {};
		self.container = null;
		if(!option){
			option = {};
		}
		self.width = option.width?option.width:200;
		self.height = option.height?option.height:36;
		self.color = option.color?option.color:"#555";
		self.bg = option.bg?option.bg:"#f2f2f2";
		self.position = option.position?option.position:"top";
		
		self.waitWord = option.waitWord?option.waitWord:"正在提交...";
		self.successWord = option.successWord?option.successWord:"提交成功";
		self.errorWord = option.errorWord?option.errorWord:"提交错误";
		self.create = function(){
			self.container = document.createElement("div");
			$(self.container).css("position","absolute");
			$(self.container).css("z-index","2000");
			switch(self.position){
				case "top":
					$(self.container).css("top",5);
				break;
				
				case "center":
					
					$(self.container).css("top","50%");
					$(self.container).css("bottom","50%");
				break;
			}
			
			$(self.container).css("left","46%");
			//$(self.container).css("right","50%");
			$(self.container).css("text-align","center");
			$(self.container).css("border","1px solid #aaa");
			$(self.container).css("background",self.bg);
			$(self.container).css("width",self.width);
			$(self.container).css("height",self.height);
			$(self.container).css("margin","auto");
			$(self.container).css("display","none");
			$(self.container).css("overflow","auto");
			$(self.container).css("line-height",self.height-2+"px");
			//$(self.container).css("box-shadow","0 0 10px #bbb");
			$(self.container).css("border-radius",5);
			$("body").append(self.container);
		};
		self.wait = function(word){
			self.waitWord = word?word:self.waitWord;
			if(!self.container){
				self.create();
			}
			$(self.container).show();
			$(self.container).html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw' style='color:#aaa;margin-right:4px;font-size:14px;'></i>"+self.waitWord);
			$(self.container).fadeIn(100,function(){
				
			})
		};
		self.success = function(word){
			self.successWord = word?word:self.successWord;
			if(!self.container){
				self.create();
			}
			$(self.container).show();
			$(self.container).html("<i class='fa fa-check-circle' style='color:#01b617;margin-right:4px;font-size:18px;'></i>"+self.successWord);
			window.setTimeout(function(){
				$(self.container).fadeOut(function(){
					$(self.container).remove();
				});
				
			},3000)
		};
		self.error = function(word){
			self.errorWord = word?word:self.errorWord;
			if(!self.container){
				self.create();
			}
			$(self.container).html("<i class='fa fa-times-circle' style='color:red;margin-right:4px;font-size:18px;'></i>"+self.errorWord);
			$(self.container).show();
			window.setTimeout(function(){
				$(self.container).fadeOut(function(){
					$(self.container).remove();
				});
			},3000)
		};
		return self;
	};
	/**数组转map**/
	base.arrayToMap = function(data,pid,firstActive){
		var self = {};
		self.data = data?data:null;
		self.pid = pid?pid:null;
		self.map = {};
		if(self.data&&self.data.length>0){
			if(self.pid){
				var n= 0;
				self.transform = function(pid){
					var k =0;
					$(self.data).each(function(i,o){
						if(o.pid == pid){
							self.map[o.id] = o;
							if(pid==self.pid){
								n++;
							}
							k++;
							if(firstActive){
								if(k==1&&n==1){
									self.map[o.id].active = true;
								}
							}
							self.transform(o.id);
						}
						
					});
					
				}
				self.transform(self.pid);
			}
		}
		return self.map;
	};
	/**map转数组**/
	base.mapToArray = function(data,pid){
		var self = {};
		self.data = data?data:null;
		self.array = [];
		self.pid = pid?pid:null;
		if(self.data&&self.pid){
			self.thansform = function(pid,node){
				for(var key in self.data){
					var nodeData = self.data[key];
					if(nodeData.pid==pid){
						if(node){
							if(!node.items){
								node.items = [];
							}
							node.items.push(nodeData);
							self.thansform(nodeData.id,nodeData);
						}else{
							self.array.push(nodeData);
							self.thansform(nodeData.id,nodeData);
						}
						
					}
				}
			};
			self.thansform(pid);
		}
		
		return self.array;
	};
	/**提示框**/
	base.confirm = function(option){
		var self = {};
		self.label = option.label?option.label:"提示";
		self.text  = option.text?option.text:"是否删除?";
		self.confirmCallback = option.confirmCallback?option.confirmCallback:null;
		self.cancelCallback = option.cancelCallback?option.cancelCallback:null;
		self.width = 200;
		self.height = 30;
		self.create = function(){
			var modal = base.modal({
				label:self.label,
				
				context:"<div style='text-align:center;font-size:13px;'>"+self.text+"</div>",
				width:self.width,
				height:self.height,
				contentStyle:"overflow:hidden,padding:20px 0",
				labelStyle:"font-size:14px",
				buttons:[
					{"label":"确定","cls":"btn btn-info","clickEvent":function(){
						if(self.confirmCallback){
							self.confirmCallback();
						}
						modal.hide();
					}},
					{"label":"取消","cls":"btn btn-warning","clickEvent":function(){
						if(self.cancelCallback){
							self.cancelCallback();
						}
						modal.hide();
					}}
				]
			});
			
		};
		self.create();
		return self;
	};
	/**查询父级数据,data为有id与pid的map类型数据**/
	base.findParentToArray = function(data,id){
		var self = {};
		self.data = data?data:null;
		self.id = id?id:null;
		var ary = [];
		if(self.data&&self.id){
			self.find = function(id){
				if(self.data[id]){
					ary.push(self.data[id]);
					self.find(self.data[id].pid);
				}
			};
			self.find(self.id);
		}
		return ary.reverse();
	};
	/**tree组件**/
	base.tree = function(option){
		var self = {};
		self.container = option.container?option.container:null;
		self.setting = option.setting?option.setting:null;
		self.data = option.data?option.data:null;
		self.treeObj =  null;
		self.drawCallback = option.drawCallback?option.drawCallback:null;
		self.selectNodeId = option.selectNodeId?option.selectNodeId:null;
		self.selectNode = function(nodes,tree){
			$(nodes).each(function(i,o){
				if(o.id==self.selectNodeId){
					self.treeObj.selectNode(o);
					self.treeObj.setting.callback.onClick(null,o.tId,o);
					return false;
				}else{
					if(o.children&&o.children.length>0){
						self.selectNode(o.children);
					}
				}
			});
		};
		self.create = function(){
			$.fn.zTree.init(self.container, self.setting, self.data);
			if(self.drawCallback){
				self.treeObj = $.fn.zTree.getZTreeObj($(self.container).attr("id"));
				self.drawCallback(self.treeObj);
			}
			if(self.selectNodeId){
				self.treeObj = $.fn.zTree.getZTreeObj($(self.container).attr("id"));
				self.selectNode(self.treeObj.getNodes(),self.treeObj);
			}
		};
		
		self.create();
		return self;
		
	};
	
	base.steps = function(option){
		var self = {};
		self.data = option.data?option.data:null;
		self.container = option.container?option.container:null;
		self.width = 0;
		self.header = {};
		self.body = {};
		self.footer = {};
		self.buttonbar = null;
		self.animate = option.animate==false?false:true;
		self.tipSize = option.tipSize?option.tipSize:30;
		self.color = option.color?option.color:"#039bda";
		self.showNumber = option.showNumber==false?false:true;
		self.buttons = option.buttons?option.buttons:null;
		self.lineHeight = option.lineHeight?option.lineHeight:10;
		self.buttonGroupToggle = option.buttonGroupToggle?option.buttonGroupToggle:null;
		if(self.container){
			self.width = $(self.container).width();
		}
		self.currentStep = option.currentStep?option.currentStep:0;
		if(self.currentStep>self.data.length){
			self.currentStep = self.data.length;
		}
		self.create = function(){
			$(self.container).html("");
			if(self.data&&self.data.length>0){
				self.setHeader();
				self.setBody();
				self.setFooter();
			}
		};
		self.setHeader = function(isCreated){
			self.header.element = document.createElement("div");
			$(self.header.element).addClass("ui-steps-header");
			$(self.container).append(self.header.element);
			self.header.createStepbar = function(){
				self.header.stepbar = document.createElement("ul");
				$(self.header.stepbar).addClass("ui-steps-stepbar");
				$(self.header.element).append(self.header.stepbar);
				self.header.createItem = function(data,index){
					var item = document.createElement("li");
					$(self.header.stepbar).append(item);
					$(item).css("width",self.width/self.data.length);
					var label =  document.createElement("div");
					$(label).attr("type","label");
					$(label).html(data.label);
					$(item).append(label);
					var tip = document.createElement("div");
					$(tip).attr("type","tip");
					$(tip).css("width",self.tipSize);
					$(tip).css("height",self.tipSize);
					//$(tip).css("background-color",self.color);
					if(self.showNumber){
						$(tip).html(index+1);
					}
					$(tip).css("line-height",self.tipSize+"px");
					$(tip).css("font-size",self.tipSize/3*2);
					$(item).append(tip);
				};
				$(self.data).each(function(i,o){
					self.header.createItem(o,i);
				});
			};
			self.header.createLinebar = function(){
				self.header.linebar = document.createElement("div");
				$(self.header.linebar).addClass("ui-steps-linebar");
				$(self.header.linebar).css("width",self.width/self.data.length*(self.data.length-1));
				$(self.header.linebar).css("margin-left",self.width/self.data.length/2);
				$(self.header.linebar).css("margin-right",self.width/self.data.length/2);
				$(self.header.linebar).css("height",self.lineHeight);
				$(self.header.element).append(self.header.linebar);
				$(self.header.linebar).css("top",-self.tipSize+self.lineHeight);
				self.header.line = document.createElement("div");
				$(self.header.line).addClass("ui-steps-line");
				$(self.header.linebar).append(self.header.line);
			};
			
			self.header.step = function(isBack){
				var w = $(self.header.linebar).width()/(self.data.length-1)*self.currentStep;
				if(self.animate){
					$(self.header.line).animate({
						"width":w
					});
				}else{
					$(self.header.line).css("width",w);
				}
				$(self.header.stepbar).find("li").removeClass("active");
				$(self.header.stepbar).find("li").slice(0,self.currentStep+1).addClass("active");

			};
			self.header.back = function(){
				if(self.currentStep<=0){return;}
				self.currentStep = self.currentStep -1;
				self.header.step(true);
			};
			
			self.header.forward = function(){
				if(self.currentStep==(self.data.length-1)){return;}
				self.currentStep = self.currentStep +1;
				self.header.step(false);
			};
			
			self.header.createStepbar();
			self.header.createLinebar();
			self.header.step();
		};
		
		self.getStep = function(){
			return self.currentStep;
		};
		
		self.getStepCount = function(){
			return self.data.length;
		};
		
		self.toStep = function(step){
			if(step<0){step = 0;}
			if(step>(self.data.length-1)){step=self.data.length-1;}
			if(step == self.currentStep){return;}
			if(step<self.currentStep){
				self.currentStep = step;
				self.header.step();
				self.body.step();
				self.footer.check();
			}else{
				self.currentStep = step;
				self.header.step();
				self.body.step();
				self.footer.check();
			}
		};
		
		self.setBody = function(){
			self.body.element = document.createElement("div");
			$(self.body.element).addClass("ui-steps-body");
			$(self.container).append(self.body.element);
			self.body.createCarousel = function(){
				self.body.carouselbar = document.createElement("ul");
				$(self.body.carouselbar).addClass("ui-steps-carouselbar");
				$(self.body.element).append(self.body.carouselbar);
				$(self.body.carouselbar).css("width",$(self.container).width()*self.data.length);
				$(self.data).each(function(i,o){
					self.body.createCarouselItem(o,i);
				});
			};
			self.body.createCarouselItem = function(data,index){
				var item = document.createElement("li");
				$(self.body.carouselbar).append(item);
				$(item).html(data.content);
				$(item).css("width",$(self.container).width());
				if(index==self.currentStep){
					$(item).addClass("active");
				}
				if(data.contentToggle){
					$(item).html($(data.contentToggle).children().clone());
					$(data.contentToggle).remove();
				}
				if(data.contentUrl){
					base.loadPage({
						container:item,
						url:data.contentUrl,
						callback:o.callback?o.callback:null
					});
				}
				if(data.content){
					$(item).html(data.content);
				}
				if(data.callback){
					
					data.callback(self);
				}
			};
			self.body.step = function(isBack){
				var ml = -self.width*self.currentStep;
				if(self.animate){
					$(self.body.carouselbar).animate({
						"marginLeft":ml
					});
				}else{
					$(self.body.carouselbar).css("margin-left",ml);
				}
				$(self.body.carouselbar).children("li").removeClass("active");
				$(self.body.carouselbar).children("li:eq("+self.currentStep+")").addClass("active");
			};
			self.body.back = function(){
				if(self.currentStep<0){return;}
				self.body.step(true);
			};
			self.body.forward = function(){
				if(self.currentStep==self.data.length){return;}
				self.body.step(false);
			};
			self.body.createCarousel();
			self.body.step();
		};
		
		self.back = function(callback){
			if(callback){
				if(!callback(self)){
					return;
				};
			}
			self.header.back();
			self.body.back();
			self.footer.check();
		};
		
		self.forward = function(callback){
			if(callback){
				if(!callback(self)){
					return;
				};
			}
			self.header.forward();
			self.body.forward();
			self.footer.check();
		};
		
		self.setFooter = function(){
			if(self.buttonGroupToggle){
				self.footer.element = $(self.buttonGroupToggle);
			}else{
				self.footer.element = document.createElement("div");
				$(self.footer.element).addClass("ui-steps-footer");
				$(self.container).append(self.footer.element);
			}
			
			
			self.footer.createButton = function(){
				if(self.buttons&&self.buttons.length>0){
					$(self.buttons).each(function(i,o){
						
							var label = null;
							var type = o.type?" "+o.type:"";
							var cls = o.cls?o.cls:"btn btn-info"+type;
							var clickEvent = null;
							
							switch(o.type){
								case "back"://上一步
									label = o.label?o.label:"上一步";
									clickEvent = function(obj){
										var callback = o.callback?o.callback:null;
										self.back(callback);
									}
								break;
								
								case "forward"://下一步
									label = o.label?o.label:"下一步";
									clickEvent = function(obj){
										var callback = o.callback?o.callback:null;
										self.forward(callback);
									}
								break;
								
								case "confirm"://确定
									label = o.label?o.label:"确定";
									clickEvent = function(obj){
										if(o.callback){
											if(!o.callback(obj,self)){
												return;
											};
										}
									}
								break;
								
								default:
									label = o.label?o.label:null;
									clickEvent = function(obj){
										if(o.callback){
											if(!o.callback(obj,self)){
												return;
											};
										}
									}
								break;
							}
							base.form.button({
								container:self.footer.element,
								label:label,
								cls:cls,
								clickEvent:clickEvent
							});
					
						
					});
				}
				
			};
			self.footer.check = function(obj){
				var count = self.getStepCount();
				if(self.currentStep==0){//第一步
					$(self.footer.element).find(".back").addClass("disabled");
					$(self.footer.element).find(".back").hide();
					$(self.footer.element).find(".forward").removeClass("disabled");
					$(self.footer.element).find(".forward").show();
					$(self.footer.element).find(".confirm").addClass("disabled");
					$(self.footer.element).find(".confirm").hide();
				}else if(self.currentStep==(count-1)){//最后一步
					$(self.footer.element).find(".back").removeClass("disabled");
					$(self.footer.element).find(".back").show();
					$(self.footer.element).find(".forward").addClass("disabled");
					$(self.footer.element).find(".forward").hide();
					$(self.footer.element).find(".confirm").removeClass("disabled");
					$(self.footer.element).find(".confirm").show();
				}else{//其余
					$(self.footer.element).find(".back").removeClass("disabled");
					$(self.footer.element).find(".back").show();
					$(self.footer.element).find(".forward").removeClass("disabled");
					$(self.footer.element).find(".forward").show();
					$(self.footer.element).find(".confirm").addClass("disabled");
					$(self.footer.element).find(".confirm").hide();
				}
			};
			self.footer.createButton();
			self.footer.check();
		};
		self.create();
		return self;
	};
	base.pull = function(option){
		var self = {};
		self.container =  option.container?option.container:null;
		self.pull = null;
		self.width = option.width?option.width:7;
		self.height = option.height?option.height:50;
		self.bg = option.bg?option.bg:"#fff";
		self.show = option.show?option.show:true;
		self.callback = option.callback?option.callback:null;
		self.target = option.target?option.target:null;
		self.animate = option.animate?option.animate:true;
		
		self.create = function(){
			self.pull = document.createElement("i");
			$(self.pull).css("float","left");
			$(self.pull).css("width",self.width);
			$(self.pull).css("height",self.height);
			$(self.pull).css("background-color",self.bg);
			$(self.pull).css("position","absolute");
			$(self.pull).css("text-align","center");
			$(self.pull).css("cursor","pointer");
			$(self.pull).css("font-size","12px");
			$(self.pull).css("padding-top",self.height/4+2);
			$(self.pull).css("border-bottom","1px solid #bbb");
			$(self.pull).css("border-left","1px solid #bbb");
			$(self.pull).css("border-top","1px solid #bbb");
			//$(self.pull).css("box-shadow","0 0 1px #aaa inset");
			self.setPosition();
			$(self.pull).hover(function(){
				$(this).css("background-color","#eee");
			},function(){
				$(this).css("background-color",self.bg);
			});
			$(self.pull).css("z-index","1000");
			$(".ui-article").append(self.pull);
			self.toggle();
			$(self.pull).on("click",function(){
				self.show = !self.show;
				self.toggle();
			});
			$(window).on("resize",function(){
				self.setPosition();
			});
		};
		self.setPosition = function(){
			$(self.pull).css("top",$(self.container).height()/2 - self.height/2+"px");
			$(self.pull).css("left",10-self.width);
		};
		self.toggle = function(){
			if($(self.container).length>0){
				if(self.show){
					//$(self.pull).removeAttr("class");
					//$(self.pull).addClass("fa fa-arrow-circle-left");
					$(self.pull).html("<i class='fa fa-caret-left'></i>");
					if(self.target){
						if(self.animate){
							$(self.target).animate({"left":$(self.container).outerWidth()});
							//$(self.target).css("left",$(self.container).outerWidth());
						}else{
							$(self.target).css("left",$(self.container).outerWidth());
						}
						
					}
					$(self.container).show();
				}else{
					$(self.pull).html("<i class='fa fa-caret-right'></i>");
					//$(self.pull).removeAttr("class");
					//$(self.pull).addClass("fa fa-arrow-circle-right");
					if(self.target){
						if(self.animate){
							$(self.target).animate({"left":0});
						}else{
							$(self.target).css("left",0);
						}
						
					}
					$(self.container).hide();
				}
				if(self.callback){
					self.callback(self);
				}
			}
		};
		self.create();
		return self;
	};
	base.msg = function(option){
		var self = {};
		self.content = option.content?option.content:"";
		self.position = option.position?option.position:"rightBottom";
		self.label = option.label?option.label:"消息";
		self.create = function(){
			self.createHeader();
			self.crreateBody();
		};
		self.createHeader = function(){
			
		};
		self.crreateBody = function(){
			
		};
		self.create();
		return self;
	};
	base.getUrlParam = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     	var r = window.location.search.substr(1).match(reg);
     	if(r!=null)return  unescape(r[2]); return null;
	};
		
	base.cookie = function(option){
		var self = {};
		self.path = option.path?option.path:"/";
		self.name = option.name?option.name:null;
		self.value = option.value?option.value:null;
		self.days = option.days?option.days:null;
		self.option = {};
		if(self.days){
			self.option.expires = self.days;
		}
		if(self.path){
			self.option.path = self.path;
		}
		self.create = function(){
			if(!self.name){return;}
			self.setCookie();
		};
		self.setCookie = function(){
			$.cookie(self.name,self.value,self.option);
		};
		self.getCookie = function(name){
			$.cookie(self.name);
		};
		self.create();
	};
	base.treeTable = function(option){
		var self = {};
		self.setting = option.setting?option.setting:null;
		self.container = option.container?option.container:null;
		self.create = function(){
			require(["treeTable"],function(){
				$(self.container).removeClass("treetable");
				$(self.container).treetable(self.setting);
			});
		};
		self.create();
	};
	base.getDate = function(dateStr){
		if(!dateStr){
			dateStr = new Date().format("yyyy-MM-dd HH:mm:ss");
		}
		var yyyy = null;
		var MM = null;
		var dd = null;
		var HH = 0;
		var mm = 0;
		var ss = 0;
		var d = null;
		var time = null;
		
		var tmp = dateStr.split(" ");
		
		if(tmp.length>0){
			d = tmp[0].split("-");
			if(d[0]){
				yyyy = d[0];
			}
			if(d[1]){
				MM = d[1]-1;
			}
			if(d[2]){
				dd = d[2];
			}
		}
		if(tmp.length==2){
			time = tmp[1].split(":");
			if(time[0]){
				HH = time[0];
			}
			if(time[1]){
				mm = time[1];
			}
			if(time[2]){
				ss = time[2];
			}
		}
		//console.log(yyyy+" "+MM+" "+dd+" "+HH+" "+mm+" "+ss);
		return new Date(yyyy,MM,dd,HH,mm,ss);
	};
	/**日程组件**/
	base.schedule = function(option){
		var self = {};
		self.data = option.data?option.data:null;
		self.container =  option.container?option.container:$("body");
		self.dateDat = [];
		self.callback = option.callback?option.callback:null;
		self.option ={
			header: {
				left: 'prev,next,today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			buttonText:{
				today:'跳转到当天'
			},
			editable: true,
			events:null
		};
		self.create = function(){
			require(["schedule"],function(){
				self.analyzeData(self.data);
				console.log(self.dateDat)
				self.option.events = self.dateDat;
				$(self.container).fullCalendar(self.option);
				if(self.callback){
					self.callback(self);
				}
			});
		};
		self.analyzeData= function(){
			$(self.data).each(function(i,o){
				var d = {};
				for(var key in o){
					switch(key){
						case "start":
						case "end":
							d[key] = base.getDate(o[key]);
						break;
						
						default:
							d[key] = o[key];
						break;
					}
				}
				self.dateDat.push(d);
			});
		};
		self.create();
	};
	base.xmlHttpRequest = function(){
		var xmlHttp;
		   try{ // Firefox, Opera 8.0+, Safari
		    xmlHttp=new XMLHttpRequest();
		}
		catch (e){
		   try{// Internet Explorer
		 xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		  }
		catch (e){
		  try{
		     xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		      }
		      catch (e){}
		      }
		}
		
		return xmlHttp;
 
	};
	return base;
});