class Fisher{
	constructor(x,y){
		this.pos = createVector(x,y)//where I am
		this.dir = 0 //where im facing
		this.power = 10 //how much power to throw bobber at
	}
	update(){
		let delta = this.pos.copy().sub(createVector(mouseX,mouseY)) //get different between mouse and me
		this.dir = atan2(delta.y,delta.x) //set direction to face mouse using delta
		if (click){ //if clicking
			this.power += scale/8 //add power
		}else{// otherwise
			if (this.power > 10){ //if releasing charge
				bobber = new Bobber(this.dir,this.power) //throw bobber
				this.power = 10 //reset power
			}
		}
	}
	show(){
		push() //push settings
		rectMode("center") //center rect mode for rotation
		translate(this.pos.x,this.pos.y) //use translate so rotation doesn't do wacky stuff
		rotate(this.dir) //rotate to face mouse

		fill(0xE1,0xCE,0x77) //fill skin color
		square(0,0,scale) //draw square
		stroke(0xff,0x0,0x0) //stroke red
		line(0,0,-this.power/2,0) //draw fishing line aiming tool
		pop() //reset settings
	}
}
