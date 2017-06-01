(function($){
	function PreLoad(imgs,options){
		this.imags = (typeof imgs === "string") ? [imgs] : imgs;
		this.opts = $.extend({},PreLoad.DEFAULTS,options);
		this._unordered();
	}
	PreLoad.DEFAULTS = {
		each:null,
		all:null
	}

	PreLoad.prototype._unordered = function(){
		var imgs = this.imags;
		var count = 0;
		var len = imgs.length;
		var opts = this.opts;

		$.each(imgs,function(i,src){
			var imgObj = new Image();
			

			$(imgObj).on("load error",function(){
				opts.each && opts.each(count);
				
				if(count >= len-1){
					opts.all && opts.all();
				}
				count++;
			});

			imgObj.src = src;
		});
	}

	$.extend({
		preload:function(imgs,options){
			new PreLoad(imgs,options)
		}
	});
})(jQuery);