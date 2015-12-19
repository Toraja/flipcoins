var DEBUG = true;
var id_play = '#play';
var input_name_n = 'input[name="n"]';
var input_name_k = 'input[name="k"]';
var id_field = '#field';
var cls_coin = '.coin';


$(document).ready(function(){
	// debuggers
	debugSetup();

	//setup a game when "play" is pressed
	$(id_play).click(setup);

	//flip coins when a coin is clicked
	
stub(".ready is ok");
});


function setup(){
	//empty out the field
	$(id_field).empty();

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
	var sizeCoeff = (3 / 18).toFixed(3);		//coefficient for increase in size
	var coinSize = 5 - ((n - 3) * sizeCoeff)	//size changes depending on the num of coins
	
	//place coins in field as many as "n"
	$(id_field).append(createCoin("tails", 0));
	for(i = 1; i < n; i++){
		$(id_field).append(createCoin("", i));
	}
	//change coin size
	$(cls_coin).css({"height": coinSize + "vw"});
	$(cls_coin).css({"width": coinSize + "vw"});
		//coordinates for coins are calculated by sin and cos (radiant = degree / 180 * Math.PI, sin = opposite / hypotenuse, cos = adjacent / hypotenuse >>> 45% * sin or cos (for X or Y depends on which section in the circle it is for))
		//place coins along the circle
	
stub("setup is ok");
}


function createCoin(side, count){
	var heads = "heads";
	var tails = "tails";
	var coinDiv1 = '<div class="coin ';
	var coinDiv2 = '" id="coin';
	var coinDiv3 = '"></div>';
	var coinSide;
	if(!(side == "" || side == heads || side == tails)){
		alert("createCoin: invalid argumant");
	}

	//set the side of coin
	if(side == ""){
		if(Math.floor(Math.random() * 2) == 0){
			coinSide = heads;
		}
		else{
			coinSide = tails;
		}
	}
	else{
		coinSide = side;
	}

	return coinDiv1 + coinSide + coinDiv2 + (count + 1) + coinDiv3;
}

// for debug
function stub(msg){
	if(DEBUG){
		if(msg == ""){
			msg = "stub";
		}
		alert(msg);
	}
}

// default input for debug
function debugSetup(){
	var input_name_n = 'input[name="n"]';
	var input_name_k = 'input[name="k"]';

	$(input_name_n).val(5);
	$(input_name_k).val(3);
}
