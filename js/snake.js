var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys = new Array([]);
var food = [ //I put this in an array in case I decide to have multiple apples on screen or multiple types of apples
	{
		"x":15,
		"y":15
	}
];

var snake = new Object({});
snake.allowedWhen = 1; //When snake.allowedCount reaches this number, the snake will move once
snake.allowedCount = 0;
snake.direction = "right";
snake.points = 0;
snake.startLength = 6;
snake.body = [
	{
		"x": 6,
		"y": 0
	},
	{
		"x": 5,
		"y": 0
	},
	{
		"x": 4,
		"y": 0
	},
	{
		"x": 3,
		"y": 0
	},
	{
		"x": 2,
		"y": 0
	},
	{
		"x": 1,
		"y": 0
	}
];

var boardX = 1;
var boardY = 0;
var board = [];

var opacity = 1;

var Interval;

var graphicalDecay = false;
var rotCount = 0;

for (var load = 0;load < (40*40);load++){ //Generates board in board array
	if (boardY < 41){
		board.push(boardX + "x" + boardY);
		if (boardX == 40){
			boardY ++;
			boardX = 0;
		}
		boardX ++;
	}
}

function main(){
	//VIEW HANDLING
	Interval = setInterval(function(){
		
		for (var i = 0;i < board.length;i++){ //Draws board

		  ctx.fillStyle = "rgba(211,211,211,"+ opacity +")";
		  if (board[i]){
			  ctx.fillRect((board[i].split("x")[board[i].split("x").length - 2] * 15) - 1 ,(board[i].split("x")[board[i].split("x").length - 1] * 15) + 1,-14,14);
			  
		  }
			  
		}
		
		ctx.fillStyle = "black";
		for (var x = 0; x < snake.body.length; x++){ //Draws snake
			if (snake.body[x]){
				ctx.fillRect((snake.body[x].x * 15) - 1 ,(snake.body[x].y * 15) + 1,-14,14);
			}
		}
		
		ctx.fillStyle = "red";
		if (food[0]){ //Draws food
				ctx.fillRect((food[0].x * 15) - 1 ,(food[0].y * 15) + 1,-14,14);
			}
			
		if (snake.body[0].x == food[0].x && snake.body[0].y == food[0].y){ //Adds two segments after feeding
			snake.body.push({
				"x": snake.body[snake.body.length - 1].x,
				"y": snake.body[snake.body.length - 1].y
			});
			snake.body.push({
				"x": snake.body[snake.body.length - 1].x,
				"y": snake.body[snake.body.length - 1].y
			});
			snake.points++;
			if (opacity > 0.2){
				opacity -= 0.05;
				if (graphicalDecay){
					ctx.rotate(0.001);
					rotCount++;
				}	
			}
			document.getElementById("points").innerHTML = "Score: " + snake.points + "<br />Snake length: " + snake.body.length; //Updates "score board"
			setFood();
		}
		
		for (var h = 2;h < snake.body.length;h++){ //Loss message and food resetter (Yes I am thinking about just making a loss function)
			if (snake.body[0].x == snake.body[h].x && snake.body[0].y == snake.body[h].y){
				clearInterval(Interval);
				alert("You lost with a score of " + snake.points + " and a length of " + snake.body.length);
			}
			if (food[0].x == snake.body[h].x && food[0].y == snake.body[h].y){
				setFood();
			}
		}
		
		if ((snake.body[0].x > 40 || snake.body[0].x < 1) || (snake.body[0].y > 39 || snake.body[0].y < 0)){ //Other loss message
			clearInterval(Interval);
			alert("You lost with a score of " + snake.points + " and a length of " + snake.body.length);
		}
		
		snake.allowedCount ++;
		if (snake.allowedCount > snake.allowedWhen){ //Allows controlled intervals of snake movement
			move(snake.direction);
			snake.allowedCount = 0;
		}
	}, 34);
	
	function setFood(){ //Does what the function name suggests
		var x = Math.floor(Math.random() * 40),y = Math.floor(Math.random() * 40);
		if ((x > 40 || y > 40) || (x < 1 || y < 1)){
			x = 15, y = 15;
		}
		food[0].x = x;
		food[0].y = y;
	}
	
	function move(direction){ //Controls movement
		switch(direction){ //Pushes every object in the snake.body array down and then removes the last object
			case "up":
				snake.body.unshift(
				{
					"x": (snake.body[0].x),
					"y": (snake.body[0].y - 1)
				}
				);
				snake.body.pop();
				break;
			case "down":
				snake.body.unshift({
					"x": (snake.body[0].x),
					"y": (snake.body[0].y + 1)
				});
				snake.body.pop();
				break;
			case "left":
				snake.body.unshift({
					"x": (snake.body[0].x - 1),
					"y": (snake.body[0].y)
				});
				snake.body.pop();
				break;
			case "right":
				snake.body.unshift({
					"x": (snake.body[0].x + 1),
					"y": (snake.body[0].y)
				});
				snake.body.pop();
				break;
		}
	}
	
	function doKeyDown(e){ //Keyboard input
	  keys[e.keyCode] = true;
	  input();
	}
					
	function doKeyUp(e){keys[e.keyCode] = false;}
	
	function setDir(direction){ //Prevents one from backslithering into one's self
		if (snake.direction == "right" && direction != "left")
			snake.direction = direction;
		if (snake.direction == "left" && direction != "right")
			snake.direction = direction;
		if (snake.direction == "up" && direction != "down")
			snake.direction = direction;
		if (snake.direction == "down" && direction != "up")
			snake.direction = direction;
	}
	
	function input(){ //Handles ur darn keystrokes, makes em' nice n' legible
		if (87 in keys && keys[87]) //up
			setDir("up");
		if (83 in keys && keys[83]) //down
			setDir("down");
		if (65 in keys && keys[65]) //left
			setDir("left");
		if (68 in keys && keys[68]) //right
			setDir("right");
		if (32 in keys && keys[32]) //space
			addSegment();
	}
	
	function addSegment(){
		
		snake.body.push({
				"x": snake.body[snake.body.length - 1].x,
				"y": snake.body[snake.body.length - 1].y
			});
		snake.body.push({
				"x": snake.body[snake.body.length - 1].x,
				"y": snake.body[snake.body.length - 1].y
			});
		
	}
		
	window.addEventListener("keydown", doKeyDown, true);
	window.addEventListener("keyup", doKeyUp, true);
}