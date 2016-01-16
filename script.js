var DEBUG = true;
//var DEBUG = false;

var input_name_n = 'input[name="n"]';
var input_name_k = 'input[name="k"]';
var input_name_direction = 'input[name="direction"]';
var idname_coin = "coin";
var id_setup = '#setup';
var id_random = '#random';
var id_start = '#start';
var id_quit = '#quit';
var id_anticlockwise = '#anticlockwise';
var id_clockwise = '#clockwise';
var id_field = '#field';
var id_coin = '#' + idname_coin;
var id_count= '#count';
var cls_coin = '.coin';
var clsname_heads = "heads";
var clsname_tails = "tails";
var clsname_up = "up";
var clsname_down = "down";
var cls_down = '.' + clsname_down;

var n, k;
var coinSize;
var trialCount = 0;

$(document).ready(function(){
	$(document).keyup(handleShortcutKey);
	$(id_setup).click(setup);
	$(id_random).click(random);
	
	// provide default value for n and k
	debugSetup();
});

/*
 *place coins with tails facing up
 *let user decide the side of each coin
 */
function setup(){
	commonSetup(clsname_tails);
	addBorder();
}

/*
 *randomly set the side of coins
 *user can set up manually after coins were placed
 */
function random(){
	commonSetup();
	addBorder();
}
/*

 *disable "Set up" and "Random" button, and "Start" button itself
 *enable "Quit" button
 *reset the number of click
 *start counting the number of click
 *display congraturation message when the game is done
 */
function start(){
	if(checkAllCoinsHeads()){
		alert("At least one coin's face-up side must be tails")
		return;
	}

	disableButton(id_setup);
	disableButton(id_random);
	disableButton(id_start);
	enableButton(id_quit);

	trialCount = 0;
	$(id_count).text(0);	// reset trial count
	$(cls_coin).off();
	$(cls_coin).click(flipCoins);
	$(cls_coin).click(checkGameEnds);
}

function quit(){
	enableButton(id_setup);
	enableButton(id_random);
	disableButton(id_quit);

	$(cls_coin).off();
	$(input_name_n).prop("disabled", false);
	$(input_name_k).prop("disabled", false);
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
			$(id_anticlockwise)
				.focus()
				.prop("checked", true);
			break;
		case 39:	// right arrow
			event.preventDefault();
			$(id_clockwise)
				.focus()
				.prop("checked", true);
			break;
		default:
			//do nothing
			break;
	}
}

function enableButton(button){
	$(button).prop("disabled", false);
	$(button).off();	// detach event handler first to avoid duplication
	$(button).click(getEvtHandlerForSelector(button));
}

function disableButton(button){
	$(button).prop("disabled", true);
	$(button).off();
}

function getEvtHandlerForSelector(selector){
	var evtHandler;
	switch(selector){
		case id_setup:
			evtHandler = setup;
			break;
		case id_random:
			evtHandler = random;
			break;
		case id_start:
			evtHandler = start;
			break;
		case id_quit:
			evtHandler = quit;
			break;
		default:
			var msg = "unknown selector: " + selector;
			alert(msg);
			throw msg;
			break;
	}
	return evtHandler;
}

/*
 *parameter is for "createCoins()" (optional)
 */
function commonSetup(coinSide){
	n = $(input_name_n).val();
	k = $(input_name_k).val();

	if(! validateInput()){
		return;
	}

	//empty out the field
	$(id_field).empty();

	//create as many coins as "n" and put them in the field
	var repeat = true;
	do{
		createCoins(n, coinSide);
		if(checkAllCoinsHeads()){
			$(id_field).empty();
			stub("repeated");
		}
		else{
			repeat = false;
		}
	}while(repeat);

	setCoinSize(n);
	adjustCoinsPosition(n);

	$(cls_coin).click(flipSingleCoin);

	$(input_name_n).prop("disabled", true);
	$(input_name_k).prop("disabled", true);
	enableButton(id_start);
}

/*
 *validate input 
 */
function validateInput(){
	valid = true;		// result of validation

	/*
	 *private function for validateInput
	 */
	function validateHighLowEmpty(targetInput, lowerLimit, upperLimit, msgSubject){
		var val = eval(msgSubject);
		console.log(msgSubject + ": " + val);
		
		try{
			if(val == "") throw "empty";
			if(val < lowerLimit) throw "too low";
			if(val > upperLimit) throw "too high";
		}
		catch(err){
			alert(msgSubject + " is " + err);
			$(targetInput).focus();
			$(targetInput).select();
			
			//rethrow the err for the caller to handle it
			throw err
		}
	}

	try{
		validateHighLowEmpty(input_name_n, 3, 20, "n");
		validateHighLowEmpty(input_name_k, 1, n * 2, "k");
	}
	catch(err){
		valid = false;
	}

	return valid;
}

/*
 *create coins the id of which is 0 to n - 1
 *if "side" parameter is undefined, the side of coins are determined randomly
 */
function createCoins(number, side){
	var coinDiv1 = '<div class="coin" id="';
	var coinDiv2 = '"><div class="heads"></div><div class="tails"></div></div>';
	var coinSide = side; 
	var coinElement, thisCoinIDName;

	// determine the side of the rest of the coins
	for(i = 0; i < number; i++){
		//add a coin element to the field
		thisCoinIDName = idname_coin + i;
		thisCoinID = '#' + thisCoinIDName;
		coinElement = coinDiv1 + thisCoinIDName + coinDiv2;
		$(id_field).append(coinElement);

		if(side == undefined){
			if(Math.floor(Math.random() * 2) == 0){
				coinSide = clsname_heads;
			}
			else{
				coinSide = clsname_tails;
			}
		}

		if(coinSide == clsname_heads){
			$(thisCoinID).addClass(clsname_up);
		}
		else{
			$(thisCoinID).addClass(clsname_down);
		}
	}
}

/*
 *adjust the size of coins depending on the number of coins(n)
 *maximus size being 12.5% and minimum being 60% of the maximum
 */
function setCoinSize(number){
	var sizeCoeff = (0.4 / 17).toFixed(3);			//coefficient for decrease in size
	//coinSize = 5 - ((number - 3) * sizeCoeff)		//size changes depending on the num of coins
	//$(cls_coin).css({"height": coinSize + "vw", "width": coinSize + "vw"});
	coinSize = 12.5 * (1 - ((number - 3) * sizeCoeff))	//size changes depending on the num of coins
	$(cls_coin).css({"height": coinSize + "%", "width": coinSize + "%"});
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
		var coordX = 50/* - coinSize*/; 		// base value of css "left" property (center of the field)
		var coordY = 50/* - coinSize*/; 		// base value of css "bottom" property (center of the field)
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
 *make sure at least one coin's tail is facing up
 */
function checkAllCoinsHeads(){
	var result = false;
	if($(cls_down).size() == 0){
		result = true;
	}
	return result;
}

/*
 *flip a coin for setup a game
 */
function flipSingleCoin(event, selector){
	var obj;
	if(selector == undefined){
		selector = this;
	}

	$(selector).toggleClass(clsname_up);
	$(selector).toggleClass(clsname_down);
}
/*
 *flip coins as many as "k" from the clicked coin in the direction selected on radio button
 */
function flipCoins(){
	//check if radio button is selected
	if($(input_name_direction + ':checked').size() == 0){
		alert("check the direction");
		return;
	}

	k = $(input_name_k).val();
	
	//flip the clicked coin
	flipSingleCoin(null, this);
	//get this coin's id and the number in the id
	var thisCoinIDNum = this.id.replace("coin", "");
	var coinIDNumToFlip;
	var direction = $(input_name_direction + ":checked").attr('id');
	var index = 1;		//for which way to flip coin
	if(direction == "anticlockwise"){
		index = -1;
	}

	for(i = 1; i < k; i++){
		coinIDNumToFlip = (i * index + parseInt(thisCoinIDNum)) % n;
		if(coinIDNumToFlip < 0){
			coinIDNumToFlip += parseInt(n);
		}

		flipSingleCoin(null, '#coin' + coinIDNumToFlip);
	}
	$(id_count).text(++trialCount);
}

function checkGameEnds(){
	if(checkAllCoinsHeads()){
		setTimeout(function(){
			alert('Congrats!!\nYou completed the game.');
			quit();
		}, 500);
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
	if(DEBUG){
		$(input_name_n).val(16);
		$(input_name_k).val(3);
	}
}

function addBorder(){
	if(DEBUG){
		var rowNum = 10;
		var colNum = 10; 
		for(i = 0; i < rowNum; i++){
			$(id_field).append("<div class=\"row\"></div>");
		}
		for(i = 0; i < colNum; i++){
			$(".row").append("<div class=\"column\"></div>");
		}
	}
}
