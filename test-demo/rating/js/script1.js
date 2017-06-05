$(function(){

	var rating = (function(){
		var init = function(el,num){
			var $rating = $(el);
				$item = $rating.find(".rating-item");

			//事件绑定
			// $item.on("mouseover",function(){
			// 	lightOn($(this).index()+1);
			// }).on("click",function(){
			// 	if(num == 1){
			// 		num = 0;
			// 	}else{
			// 		num = $(this).index()+1;
			// 	}
			// 	lightOn(num);
			// });
			// $rating.on("mouseout",function(){
			// 	lightOn(num);
			// });

			// 事件委托，将子元素的事件委托给它的父元素处理
			$rating.on("mouseover",'.rating-item',function(){
				lightOn($item,$(this).index()+1);
			}).on("click",'.rating-item',function(){
				if(num == 1){
					num = 0;
				}else{
					num = $(this).index()+1;
				}
				lightOn($item,num);
			}).on("mouseout",function(){
				lightOn($item,num);
			});

			lightOn($item,num);
		}
		
		// 点亮
		var lightOn = function($item,c){
			$item.each(function(index,itemDom){
				if(index < c){
					$(this).css('background-position','0 -40px');
				}else{
					$(this).css('background-position','0 0');
				}
			});
		}
		
		// 封装成jQuery 插件
		$.fn.extend({
			rating:function(num){
				return this.each(function(){
					init(this,num);
				});
			}
		});

		return {
			init:init
		}
	})();

	// rating.init('#rating',2);

	

	$('#rating').rating(3);
});