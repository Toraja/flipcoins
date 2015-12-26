var DEBUG = true;
var input_name_n = 'input[name="n"]';
var input_name_k = 'input[name="k"]';
var id_play = '#play';
var id_field = '#field';
var id_coin = '#coin';
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

	// ***** input validation *****
	//validate n (not empty, 3 <= n <= 20)
	if(! validateInput(input_name_n, 3, 20, "n")){
		return;
	}

	//validate k (not empty, 1 <= k <= n*2)
	if(! validateInput(input_name_k, 1, eval("n * 2"), "k")){
		return;
	}

	// ***** place coins *****
	// consider the field as "plane" in mathematics
	// the origin of the plane is the center of the field
	
	//create as many coins as "n" and put them in the field
	createCoins(n);

	//set coin size
	var sizeCoeff = (3 / 18).toFixed(3);		//coefficient for increase in size
	var coinSize = 5 - ((n - 3) * sizeCoeff)	//size changes depending on the num of coins
	$(cls_coin).css({"height": coinSize + "vw", "width": coinSize + "vw"});

	//adjusc coin position
	//calculate coordinates for each coins
	var radius = 42;		// radius of the circle of coins (percentage of the length of a side of field)
	var centralAngle = Math.floor(360 / n);	// central angle of n-gon

	for(i = 0; i < n; i++){
		var coordX = 50; 		// base value of css "left" property (center of the field)
		var coordY = 50; 		// base value of css "bottom" property (center of the field)
		var id_coin_n = id_coin + i;		// id of each coin, the top being "coin0" and incremented by 1 clockwise
		var currentAngle = centralAngle * i;		// angle between the top apex and n(i)th apex
		var apexRegion = Math.floor(currentAngle / 90);		// region where apex is located
		var coordinateAngle = currentAngle % 90;		// angle between n(i)th apex and coodinate axis
		var radian = Math.PI * (coordinateAngle / 180);
		var opposite = radius * Math.sin(radian);
		var adjacent = radius * Math.cos(radian);

		switch(apexRegion){
			case 0:
				coordX += opposite;
				coordY += adjacent;
				break;
			case 1:
				coordX += adjacent;
				coordY += (opposite * -1);
				break;
			case 2:
				coordX += (opposite * -1);
				coordY += (adjacent * -1);
				break;
			case 3:
				coordX += (adjacent * -1);
				coordY += opposite;
				break;
			default:
				//TODO error handling
				alert("error");
				break;
		}

		coordX = coordX + "%";
		coordY = coordY + "%";

		$(id_coin_n).css({"left": coordX, "bottom": coordY});
	}
	
stub("setup is ok");
}


/*
 *validate input 
 */
function validateInput(targetInput, lowerLimit, upperLimit, msgSubject){
	var val = $(targetInput).val();
	var valid = true;

	try{
		if(val == "") throw "empty";
		if(val < lowerLimit) throw "too low";
		if(val > upperLimit) throw "too high";
	}
	catch(err){
		alert(msgSubject + " is " + err);
		//clear invalid textbox
		$(targetInput).val("");
		//focus invalid textbox
		$(targetInput).focus();
		
		valid = false;
	}

	return valid;
}

/*
 *create coins the id of which is 0 to n - 1
 */
function createCoins(number){
	var heads = "heads";
	var tails = "tails";
	var coinDiv1 = '<div class="coin ';
	var coinDiv2 = '" id="coin';
	var coinDiv3 = '"></div>';
	var coinSide, coinElement;

	// create the first coin element with "tails"
	coinElement = coinDiv1 + tails + coinDiv2 + "0" + coinDiv3;
	$(id_field).append(coinElement);

	// determine the side of the rest of the coins
	for(i = 1; i < number; i++){
		if(Math.floor(Math.random() * 2) == 0){
			coinSide = heads;
		}
		else{
			coinSide = tails;
		}

		coinElement = coinDiv1 + coinSide + coinDiv2 + i + coinDiv3;
		$(id_field).append(coinElement);
	}
}

/*
 *for debug
 *this popup the argument or line number by default
 */
function stub(msg){
	if(DEBUG){
		if(msg == ""){
			var stackMsg = new Error().stack.split("\n");
			//var linenum = stackMsg[2].match(/:\d+:/).match(/\d+/);
			var linenum = stackMsg[2].match(/:\d+:/)[0].match(/\d+/);
			msg = "line: " + linenum;
		}
		alert(msg);
	}
}

/*
 *default input for debug
 */
function debugSetup(){
	var input_name_n = 'input[name="n"]';
	var input_name_k = 'input[name="k"]';

	$(input_name_n).val(6);
	$(input_name_k).val(3);
}
