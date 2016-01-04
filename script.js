var DEBUG = true;

var input_name_n = 'input[name="n"]';
var input_name_k = 'input[name="k"]';
var id_setup = '#setup';
var id_random = '#random';
var id_start = '#start';
var id_quit = '#quit';
var id_left = '#left';
var id_right = '#right';
var id_field = '#field';
var id_coin = '#coin';
var cls_coin = '.coin';


$(document).ready(function(){
	// debuggers
	debugSetup();

	$(document).keyup(handleShortcutKey);

	//let user setup a game when "Set up" is pressed
	$(id_setup).click(setup);

	//randomly setup a game when "Random" is pressed
	$(id_random).click(random);

	//start a game
	
	//flip coins when a coin is clicked
	
stub(".ready is ok");
});

/*
 *place coins with tails facing up
 *let user decide the side of each coin
 */
function setup(){
	//empty out the field
	$(id_field).empty();

	//get value of n and k
	var n = $(input_name_n).val();
	//var k = $(input_name_k).val();

	//create as many coins as "n" and put them in the field
	createCoins(n, "tails");

	//set coin size
	setCoinSize(n);

	//place coins nicely
	adjustCoinsPosition(n);

stub("setup is ok");
}

/*
 *randomly set the side of coins
 *user can set up manually after coins were placed
 *disable "Set up" button TODO
 */
function random(){
	//empty out the field
	$(id_field).empty();

	//get value of n and k
	var n = $(input_name_n).val();
	//var k = $(input_name_k).val();

	//create as many coins as "n" and put them in the field
	createCoins(n);

	//set coin size
	setCoinSize(n);

	//place coins nicely
	adjustCoinsPosition(n);

stub("random is ok");
}
/*

 *disable "Set up" and "Random" button, and "Start" button itself
 *enable "Quit" button
 *reset the number of click
 *start counting the number of click
 *display congraturation message when the game is done?
 */
function start(){
	
}

function quit(){

}


/*
 *validate input 
 */
function validateInput(){

	/*
	 *private function for validateInput
	 */
	function validateHighLowEmpty(targetInput, lowerLimit, upperLimit, msgSubject){
		var val = $(targetInput).val();
		
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
			
			//rethrow the err for the caller to handle it
			throw err
		}
	}

	// ***** input validation *****
	//validate n (not empty, 3 <= n <= 20)
	if(! validateInput(input_name_n, 3, 20, "n")){
		return valid;
	}

	//validate k (not empty, 1 <= k <= n*2)
	if(! validateInput(input_name_k, 1, eval("n * 2"), "k")){
		return valid;
	}

	return valid;
}

/*
 *create coins the id of which is 0 to n - 1
 *the side of the first coin (coin0) is always tails
 *if "side" parameter is undefined, the side of coins are determined randomly
 */
function createCoins(number, side){
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
		if(side == undefined){
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

		coinElement = coinDiv1 + coinSide + coinDiv2 + i + coinDiv3;
		$(id_field).append(coinElement);
	}
}

/*
 *adjust the size of coins depending on the number of coins(n)
 */
function setCoinSize(number){
	var sizeCoeff = (3 / 18).toFixed(3);			//coefficient for increase in size
	var coinSize = 5 - ((number - 3) * sizeCoeff)	//size changes depending on the num of coins
	$(cls_coin).css({"height": coinSize + "vw", "width": coinSize + "vw"});
}

/*
 *place coins nicely (on each apex of n-gon)
 *consider the field as "plane" in mathematics
 *the origin of the plane is the center of the field
 */
function adjustCoinsPosition(number){
	//calculate coordinates for each coins
	var radius = 42;		// radius of the circle of coins (percentage of the length of a side of field)
	var centralAngle = Math.floor(360 / number);	// central angle of n-gon

	for(i = 0; i < number; i++){
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

}

/*
 *handle user keypress
 */
function handleShortcutKey(event){
	switch(event.which){
		case 78:	// n
			event.preventDefault();
			$(input_name_n).focus();
			break;
		case 75:	// k
			event.preventDefault();
			$(input_name_k).focus();
			break;
		case 85:	// u
			event.preventDefault();
			$(id_setup)
				.focus()
				.click();
			break;
		case 82:	// r
			event.preventDefault();
			$(id_random)
				.focus()
				.click();
			break;
		case 83:	// s
			event.preventDefault();
			$(id_start)
				.focus()
				.click();
			break;
		case 81:	// q
			event.preventDefault();
			$(id_quit)
				.focus()
				.click();
			break;
		case 37:	// left arrow
			event.preventDefault();
			$(id_left)
				.focus()
				.prop("checked", true);
			break;
		case 39:	// right arrow
			event.preventDefault();
			$(id_right)
				.focus()
				.prop("checked", true);
			break;
		default:
			break;
	}
}

/*
 *for debug
 *this popup the argument or line number if no argument is supplied
 */
function stub(msg){
	if(DEBUG){
		if(msg == undefined){
			var stackMsg = new Error().stack.split("\n");
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
