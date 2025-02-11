function helpLoop(){
	fill(0x11)
	rect(0,0,width,height)
	fill(0xee)
	text(`highscore: ${highscore}`,width/2,textSize())
	text("click and hold to charge up power!\nland the bobber on a fish to catch it!\nscore is calculated using fish speed * distance from you,\nso be sure to aim far and lead your shots!\n(click the arrow in the bottom left\nto go back to the menu)",width/2,height/2)
	if (buttons.length == 0){
		new Button(scale,height-textSize()-scale/2,"<")
	}
	for (button of buttons){
		button.update()
	}
}