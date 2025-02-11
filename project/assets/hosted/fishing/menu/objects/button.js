class Button{
	constructor(x,y,text){
		this.pos = createVector(x,y)
		this.text = text
		buttons.push(this)
	}
	update(){
		push()
		textSize(50*(scale/16))
		fill(0x33)
		if (mouseX > this.pos.x-textWidth(this.text)/2 && mouseX < this.pos.x+textWidth(this.text)/2 && mouseY > this.pos.y-(textSize()/2) && mouseY < this.pos.y+(textSize()/2)){
			fill(0x44)
			if (click){
				click = false
				switch (this.text){
					case "score attack":
						timeleft = 60000
						timed = true
						loop = "game"
					break
					case "infinite":
						timed = false
						loop = "game"
					break
					case "clear high score":
						if (confirm("are you sure you want to delete your highscore")){
							highscore = 0
							window.localStorage.setItem("highscore",0)
						}
					break
					case "<":
						quitToMenu()
					break
					case "help":
						buttons = []
						loop = "help"
					break
				}
			}
		}
		rectMode(CENTER)
		rect(this.pos.x,this.pos.y,textWidth(this.text),textSize(),8)
		fill(0xee)
		textAlign(CENTER,CENTER)
		text(this.text,this.pos.x,this.pos.y)
		pop()
	}
}