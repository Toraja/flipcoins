$(document).ready(function(){
	var id_play = '#play';

	//setup a game when "play" is pressed
	$(id_play).click(setup);

	//flip coins when a coin is clicked
});

function setup(){
	var input_name_n = 'input[name="n"]';
	var input_name_k = 'input[name="k"]';
	//get value of n and k
	var n = $(input_name_n).val();
	var k = $(input_name_k).val();

	//validate n (not empty, 3 <= n <= 20)
	try{
		if(n == "") throw "empty";
		if(n < 3) throw "too low";
		if(n > 20) throw "too high";
	}
	catch(err){
		alert("n is " + err);
		//clear textbox n
		$(input_name_n).val("");
		//focus textbox n
		$(input_name_n).focus();
		
		return;
	}

	//validate k (not empty, 1 <= k <= n*2)
	try{
		if(k == "") throw "empty";
		if(k < 1) throw "too low";
		if(k > n * 2) throw "too high";
	}
	catch(err){
		alert("k is " + err);
		//clear textbox k
		$(input_name_k).val("");
		//focus textbox k
		$(input_name_k).focus();
		
		return;
	}

	//place coins
	var coin = "<div class=\"coin\"></div>"
		//place coins along the circle
		//the size of coins changes depending on the number of coins?
		//coordinates for coins are calculated by sin and cos (radiant = degree / 180 * Math.PI, sin = opposite / hypotenuse, cos = adjacent / hypotenuse >>> 45% * sin or cos (for X or Y depends on which section in the circle it is for))
}
