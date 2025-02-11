let floor = 240 //where do the raindrops stop falling
let speed = 6 //how fast are the drops
let splashSize = 12 //how far the splashes spread out until they disappear
let ticks = 0 //ticks for pacing the spawning of rain
let intensity = 99 //how fast the rain spawns
let dropNumber = 2 //how many spawn per spawn
let offsetscale = 16 //how far the offset goes for rain falling on the ground
let canvas //canvas variable

let drops = []//list of raindrops

class Drop{//rainDrop
	constructor(x,y){
		this.pos = createVector(x,y) //position
		this.size = createVector(2,20)//size
		this.color = color(255) //color
		this.color.setAlpha(100)//setting the alpha of the color
		drops.push(this) //adding this to the list
		this.flooroffset = ((Math.random()*-offsetscale)-5) //setting the offset
	}
	update(){
		this.pos.y += speed //make rain fall
		if (this.pos.y+this.size.y > floor-(this.flooroffset*(height/256)) && this.size.y >= speed){
			this.size.y -= speed //if touching floor than the size decreases so its more smooth
		}
		if (this.size.y < speed){ //if below floor height
			new Splash(this.pos.x,this.pos.y)//spawn splash
			drops.splice(drops.indexOf(this),1)//delete self
		}
	}
	show(){
		fill(this.color) //set fill color
		ellipse(this.pos.x,this.pos.y,this.size.x*(height/256),this.size.y*(height/256)) //draw rain
	}
}

let splashes = [] //list of splashes

class Splash{ //rain splash
	constructor(x,y){
		this.pos = createVector(x,y) //position
		this.size = 1 //size
		this.alpha = 100 //how transparent it is
		this.color = color(255) //set its color
		this.color.setAlpha(100) //set color transparency
		splashes.push(this) //add to the list of splashes
	}
	update(){
		if (this.size < splashSize){ //if this size < splashsize
			this.size += 0.4 //splash size increases
		}
		this.alpha = ((splashSize-this.size)/splashSize)*100 //set the alpha
		this.color.setAlpha(this.alpha) //set the colors alpha to the new alpha
		if (this.alpha <= 0){ //if invisible
			splashes.splice(splashes.indexOf(this),1) //get rid of self
		}
	}
	show(){
		noFill() //no fill color
		stroke(this.color) //stroke color
		ellipse(this.pos.x,this.pos.y,this.size*(height/256),this.size*(height/256)/2) //draw
		noStroke() //set back to no stroke
	}
}

function resize(w){ //resize window with w width
	speed = speed / (width/512) //make speed not relative 
	floor = floor/height //make floor height not relative
	resizeCanvas(w,w/2) //resize canvas
	floor *= height //make floor height relative again
	speed = speed * (width/512) //make speed relative
}

function setup(){
	canvas = createCanvas() //create the canvas
	noStroke() //no stroke
	resizeCanvas(512,256) //resize the canvas to default size
}
function draw(){
	ticks++ //add to ticks
	background(0) //clear screen
	if (ticks % (100-intensity) == 0){ //decide if I should spawn rain this frame
		for (let i = 0; i<dropNumber;i++){ //repeat dropNumber times
			new Drop(width*Math.random(),-12) //spawn a drop at a random position above the world
		}
	}
	fill(50) //set fill color to 50
	rect(0,floor-5,width,height-(floor-5)) //draw floor
	for (let drop of drops){ //for all drops
		drop.update() //update them
		drop.show() //show them
	}
	for (let splash of splashes){ //for all splashes
		splash.update() //update them
		splash.show() //show them
	}
}