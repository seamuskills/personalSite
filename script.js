input = [] //all the that the player is pressing
mapWidth = 192*1.5 //the width of the playing field (in map units)
mapHeight = 98*1.5 // the height of the playing field (in map units)
ticks = 0 //how many loops the game has gone through as of yet
asteroidTimer = 300 //how long until another asteroid spawns
score = 0 //current player score
dead = false //is the player dead?
highScore = Number(localStorage.getItem("highScore")) //get high score from local storage
if (highScore === null){ //if there was no score to get
  highScore = 0 //set it to 0
  localStorage.setItem("highScore",0) //save as 0
}
 
window.onkeypress = ({key}) => { //get and save keypresses
  input.push(key)
}

window.onkeyup = ({key}) => { //get and remove key releases from input
  while(input.includes(key)){
    input.splice(input.indexOf(key),1)
  }
}

class Player{ //player character object
  constructor(){
    this.pos = createVector(mapWidth/2,mapHeight/2) //where is the player currently?
    this.vel = createVector(0,0) //where is the player going?
    this.direction = 0 //the direction the ship is facing (degrees)
    this.fireDebounce = 15 //how long until the ship can fire again
  }
  update(){
    this.fireDebounce -= 1 //decrease the amount of time until the ship may fire
    let direction = input.includes("d") - input.includes("a") //get the direction the player wants to turn (right - left)
    this.direction += (direction > 0 ? 1 : direction == 0 ? 0 : -1) * 5 //add 5 for right or -5 for left or 0 for no direction
    if (input.includes("w")){ //if I'm pressing w
      this.vel.add(p5.Vector.fromAngle(radians(this.direction)).mult(0.06)) //go forward by a little fighting old velocity
    }
    this.vel.mult(0.999) //give the ship a very small amount of friction.

    this.pos.add(this.vel) //move by velocity
    
    if (this.pos.x < 0){ //if I'm too far left
      this.pos.x = mapWidth //go right
    }else if (this.pos.x > mapWidth){ //if I'm too far right
      this.pos.x = 0 //go to left
    }
    
    if (this.pos.y < 0){ //if I'm too far up
      this.pos.y = mapHeight //go down
    }else if (this.pos.y > mapHeight){ //if I'm too far down
      this.pos.y = 0 //go up
    }
    
    if (input.includes(" ") && this.fireDebounce <= 0){ //if I want to fire and I have waited long enough
      //create a bullet at my position facing where I am facing, that follows my velocity
      new Bullet(this.pos.x,this.pos.y,p5.Vector.fromAngle(radians(this.direction)).mult(3).add(this.vel))
      this.fireDebounce = 15 //reset the wait time
    }
    for (let a of asteroids){ //loop through asteroids
      if (collideRectPoly(this.pos.x-0.25,this.pos.y-0.25,0.25,0.25,a.positionedShape(),true)){ //if I'm touching one
        dead = true //I am dead
        for (let i=0;i < 90;i+=4){ //loop in a circle going by 4 degrees at a time
          new Bullet(this.pos.x,this.pos.y,p5.Vector.fromAngle(radians(i))) //spawn a bullet
        }
      }
    }
  }
  show(){
    fill(0xff) //fill white and stroke white
    stroke(0xff)
    translate(this.pos.x,this.pos.y) //go to player position
    rotate(this.direction+90) //rotate to the players direction
    beginShape() //start making the shape
    vertex(0.5,1) //lower right
    vertex(0,0.6) //lower middle
    vertex(-0.5,1) //lower left
    vertex(0,-1) //the top
    endShape(CLOSE) //stop making the shape
    rotate(-this.direction-90) //un-rotate
    translate(-this.pos.x,-this.pos.y) //un-position
  }
}
let p //declare the player ahead of time to avoid scoping issues

bullets = [] //list of bullet entities
class Bullet{ //the bullet the player shoots
  constructor(x,y,vel){
    this.pos = createVector(x, y) //where it is
    this.vel = vel //where its going
    bullets.push(this) //add this to the list of bullets
  }
  update(){
    this.pos.add(this.vel) //move by velocity
    //delete if off screen
    if (this.pos.x > mapWidth || this.pos.x < 0){
      bullets.splice(bullets.indexOf(this),1)
    }
    if (this.pos.y > mapHeight || this.pos.y < 0){
      bullets.splice(bullets.indexOf(this),1)
    }

    for (let a of asteroids){ //loop through the asteroids
      if (collidePointPoly(this.pos.x,this.pos.y,a.positionedShape())){ //if it's hitting one
        bullets.splice(bullets.indexOf(this),1) //get this out of the list
        asteroids.splice(asteroids.indexOf(a),1) //get the rock out of the list of rocks
        if (a.level > 1){ //if the asteroid can split
          new Asteroid(this.pos.x,this.pos.y,a.level-1) //make two lesser asteroids
          new Asteroid(this.pos.x,this.pos.y,a.level-1)
        }
        score += (4 - a.level) * 10 //increase score by the 4-level (30 pts for small, 10 pts for large, 20 pts for medium)
        break //It doesn't need to loop anymore cause it was a hit
      }
    }
  }
  show(){
    point(this.pos.x, this.pos.y) //draw a point at this position
  }
}

asteroids = [] //list of rocks
class Asteroid{
  constructor(x = null, y = null, level = null){
    if (x === null || y === null){ //if position isn't specified spawn in a large circle around everything
      this.pos = p5.Vector.fromAngle(radians(Math.random()*360)).add(createVector(mapWidth/2,mapHeight/2)).mult(mapHeight**2)
    }else{ //otherwise use the specified position
      this.pos = createVector(x,y)
    }
    //the velocity is in a random direction at a random magnitude
    this.vel = p5.Vector.fromAngle(radians(Math.random()*360)).mult(0.2+Math.random()*0.6)
    this.vertexCount = 3+round(Math.random()*15) //how many points in the shape
    if (level === null){ //if level isn't specified
      this.level = round(1+Math.random()*3) //make it random
    }else{ //otherwise use whats specified
      this.level = level
    }
    this.shape = [] //the array of vectors to be used for the objects shape
    for (let i=0; i < this.vertexCount; i++){ //loop through the vertex count
      let percent = i/this.vertexCount; //how far am I through the shape as a percentage
      let angle = Math.PI*2 * percent //what angle is that?
      //make a perfect circle but the points are randomly offset.
      this.shape.push(p5.Vector.fromAngle(angle).mult(1+Math.random()*0.6).mult(1+this.level*4))
    }
    asteroids.push(this) //add this to the list
    this.wrapMargin = (10*this.level) //how far offscreen this can go before teleporting to the other side
    this.collideDebounce = 60 //how long this must wait before colliding again
  }
  positionedShape(){ //get an array for the shape at a specific coordinate.
    let newShape = [] // new shape
    for (let i of this.shape){ //basically copy the current shape but add the position to it
      newShape.push(i.copy().add(this.pos.x,this.pos.y))
    }
    return newShape //return the new shape
  }
  update(){
    this.pos.add(this.vel) //add velocity to position

    if (this.pos.x < -this.wrapMargin){ //wrap the screen in the x direction
      this.pos.x = mapWidth+this.wrapMargin
    }else if (this.pos.x > mapWidth+this.wrapMargin){
      this.pos.x = -this.wrapMargin
    }
    
    if (this.pos.y < -this.wrapMargin){ //wrap the screen in the y direction
      this.pos.y = mapHeight+this.wrapMargin
    }else if (this.pos.y > mapHeight+this.wrapMargin){
      this.pos.y = -this.wrapMargin
    }

    for (let i of asteroids){// loop through asteroids
      if (i == this || i.collideDebounce > 0){ //don't use this asteroid if it's the one responsible for this update function or it can't collide yet
        continue
      }
      if (collidePolyPoly(this.positionedShape(),i.positionedShape(),true)){ //if they are touching
        this.collideDebounce = 30 //set debounces to 30 frames
        i.collideDebounce = 30
        let dif = this.pos.copy().sub(i.pos).normalize().mult(0.6) //get the difference vector
        this.vel.add(dif.mult(i.level/this.level)) //add the vector to this one
        i.vel.sub(dif.mult(this.level/i.level)) //subtract it from this one
      }
    }
    this.collideDebounce-- //decrease the wait time to collide.
  }
  show(){
    noFill() //dont fill
    translate(this.pos.x,this.pos.y) //translate drawing to the position needed
    beginShape() //begin the shape
    for (let i of this.shape){ //loop through the points and add them
      vertex(i.x,i.y)
    }
    endShape(CLOSE) //close the shape
    translate(-this.pos.x,-this.pos.y) //undo the translate
  }
}

window.onresize = () => {
  resizeCanvas(window.innerWidth,window.innerHeight) //resize the canvas to be always covering the screen
}

function setup(){
  resizeCanvas(window.innerWidth,window.innerHeight) //resize the canvas to cover the screen
  angleMode(DEGREES) //make sure I'm using degrees
  p = new Player() //make the player
  new Asteroid() //make an asteroid to start with
}

function draw(){
  ticks++ //increment the amount of ticks that have passed
  scale(width/mapWidth) //make sure the scaling is correct. It seems to reset every frame so I just set it
  background(0,0,0,200) //background is black but not fully opaque

  if (score > highScore){ //increase the high score if it's below score
    highScore = score
  }
  
  if (ticks % (15+round(asteroidTimer)) == 0 && asteroids.length < 10){ //make asteroids if it's been long enough and there is less than 10
    asteroidTimer -= Math.random()*2 //asteroids spawn progressively faster
    new Asteroid()
  }

  if (!dead){ //if I'm not dead
    score += 0.01 * p.vel.mag() //increase score a little for survival based on speed
    p.update() //update and show the player
    p.show()
  }else{ //if I am dead
    if (score == highScore){ //save the high score if applicable
      localStorage.setItem("highScore",score)
    }
    fill(0xff) //display the try again text
    noStroke()
    text("Refresh to play again!",mapWidth/2-textWidth("Refresh to play again!")/2,mapHeight/2)
    noFill()
    stroke(0xff)
  }

  for (let i of bullets){ //update and show bullets
    i.update()
    i.show()
  }

  for (let i of asteroids){ //update and show the rocks
    i.update()
    i.show()
  }
  fill(0x22) //make score text and cut off non-playable area at the bottom
  noStroke()
  rect(0,mapHeight,mapWidth,height)
  stroke(0xff)
  text(`${Math.round(score)}`,0,12)
  text(`${Math.round(highScore)}`,0,mapHeight-6)
}