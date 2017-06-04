$(function(){

	var num = 0,
	    $rating = $("#rating");
		$item = $("#rating").find(".rating-item");
	// 点亮
	var lightOn = function(c){
		$item.each(function(index,itemDom){
			if(index < c){
				$(this).css('background-position','0 -40px');
			}else{
				$(this).css('background-position','0 0');
			}
		});
	}
	
	//事件绑定
	$item.on("mouseover",function(){
		lightOn($(this).index()+1);
	}).on("click",function(){
		if(num == 1){
			num = 0;
		}else{
			num = $(this).index()+1;
		}
		lightOn(num);
	});
	$rating.on("mouseout",function(){
		lightOn(num);
	});
});