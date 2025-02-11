function gameLoop(){
	if (ticks == 0){
		buttons = []
		new Button(scale,height-textSize()-scale/2,"<")
	}
	ticks++ //incerment ticks
	if (timed){
		timeleft -= deltaTime
		if (timeleft < 0){
			if (score > highscore){
				highscore = Math.round(score)
				window.localStorage.setItem("highscore", score)
			}
			quitToMenu()
		}
	}
	grassTextReset -= deltaTime //decrease grass text reset time
	if (grassTextReset < 0){ //reset if its below 0
		grassText = ""
	}
	background(0x67,0xAF,0x90) //water
	fill(0xC6,0xB6,0x31)
	rect(0,height*0.5,width,height/2) //sand
	fill(0xBC,0x85,0x2F)
	rect(0,height*0.66,width,height/3) //dirt
	fill(0x83,0xBC,0x44)
	rect(0,height*0.75,width,height/4) //grass

	fisher.update() //update and draw fisher
	fisher.show()

	if (bobber){ //if bobber exists
		if (bobber.active){ //if bobber is active
			bobber.update() //update and draw bobber
			bobber.show()
		}
	}
	for (fish of fishList){ //loop through fish
		fish.update() //draw and update fish
		fish.show()
	}
	if (ticks % spawnDelay == 0 && fishList.length < 10){ //if ticks is divisible by spawnDelay and there are less than 10 fish
		var direction = Math.round(Math.random()) //direction is randomly 1 or 0
		if (direction == 0){direction = -1} //0 = -1 now
		if (direction == 1){ //if direction = 1
			new Fish(-16,Math.random()*(height/2-16),direction,Math.max(Math.random()*4,1)) //spawn fish on left
		}else{ //otherwise
			new Fish(width+16,Math.random()*(height/2-16),direction,Math.max(Math.random()*4,1)) //spawn fish on right
		}
		spawnDelay = Math.max(1,Math.round(Math.random()*100)) //randomly set spawn delay between 1 and 100
	}
	fill(0x0) //fill with black
	if (!timed){
		text(`score:${Math.round(score)}`,width/2,textSize()) //draw score text
	}else{
		text(`score:${Math.round(score)} § time: ${round(timeleft/1000)}`, width/2,textSize())
	}
	textSize(12*(scale/16))
	text(grassText,width/2,height*(0.75+(0.25/2))) //draw grass text
	textSize(24*(scale/16))
	for (button of buttons){
		button.update()
	}
}