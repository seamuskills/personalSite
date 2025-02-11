function menuLoop(){
	fill(0x11)
	rect(0,0,width,height)
	fill(0xee)
	text(`highscore: ${highscore}`,width/2,textSize())
	if (buttons.length == 0){
		new Button(width/2,height/2,"infinite")
		new Button(width/2,height/2-(56*scale/16),"score attack")
		new Button(width/2,height/2+(56*scale/16),"clear high score")
		new Button(width/2,height/2+(112*scale/16),"help")
	}
	for (button of buttons){
		button.update()
	}
}