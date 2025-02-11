class Fish{ //fish that swim around
	constructor(x,y,direction,speed){
		this.pos = createVector(x,y) //where it is
		this.dir = direction //if its going left or right
		this.speed = speed*(scale/16) //how fast its going
		this.color = fishColors[Object.keys(fishColors)[Math.round(Math.random()*(Object.keys(fishColors).length-1))]] //what color is it
		fishList.push(this) //put self in list of fish
	}
	update(){
		this.pos.x += this.speed*this.dir //move
		if ((this.dir == 1 && this.pos.x > width) || (this.dir == -1 && this.pos.x < 0)){ //if on other side of screen
			fishList.splice(fishList.indexOf(this),1) //delete self
		}
	}
	show(){
		fill(this.color[0],this.color[1],this.color[2]) //fill fish color
		circle(this.pos.x,this.pos.y,scale) //draw self
	}
}