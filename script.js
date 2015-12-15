$(document).ready(function(){
	var id_play = '#play';

	//when "play is pressed"
	$(id_play).click(setup);
});

function setup(){
	var input_name_n = 'input[name="n"]';
	var input_name_k = 'input[name="k"]';
	//get value of n and k
	var n = $(input_name_n).val();
	var k = $(input_name_k).val();

	//validate n and k

	//place coins
	var coin = "<div class=\"coin\"></div>"
		//place coins along the circle
		//the size of coins changes depending on the number of coins?
		//coordinates for coins are calculated by sin and cos (radiant = degree / 180 * Math.PI, sin = opposite / hypotenuse, cos = adjacent / hypotenuse >>> 45% * sin or cos (for X or Y depends on which section in the circle it is for))
}
