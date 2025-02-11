class Bobber{ //bobber that player shoots to catch fish
	constructor(dir,power){
		this.power = power //how far will it go
		this.pos = fisher.pos.copy() //set position to be on the fisher
		this.speed = p5.Vector.fromAngle(dir) //its direction in a coord pair
		this.target = this.pos.copy().add(this.speed.copy().mult(-this.power)) //final destination
		this.speed.mult(8*(scale/16)) //make the speed alot faster
		this.life = 600 //how long it will last after its landed at the target
		this.active = true //if its active
		this.moving = true
	}
	update(){
		if (this.pos.copy().dist(this.target) > scale){ //if not at target
			this.pos.sub(this.speed) //move
		}else{ //otherwise
			if (this.life == 600){ //first frame of not moving
				this.moving = false
				for (fish of fishList){ //loop through fish
					if (fish.pos.dist(this.pos) < scale){ //if on a fish
						fish.speed /= scale/16
						score += fish.speed*fisher.pos.dist(fish.pos)*(scale/16) //incerment score by fishSpeed * fishDistanceToFish
						grassTextReset = 5000 //how much time until grass text resets
						grassText += `\nfish Caught: ${fish.speed.toFixed(2)} speed * ${fisher.pos.dist(fish.pos).toFixed(2)} distance for a total of ${(fish.speed*fisher.pos.dist(fish.pos)).toFixed(2)}` //display the score recieved in grass text
						fishList.splice(fishList.indexOf(fish),1) //get rid of fish
					}
				}
			}
			this.life -= deltaTime //subtract from life
			if (this.life < 0){ //if life < 0
				this.active = false //i am no longer active
			}
		}
	}
	show(){
		fill(0xee,128) //fill transparent white
		circle(this.pos.x,this.pos.y,(scale/2)*(this.moving+1)) //draw the bobber
	}
}