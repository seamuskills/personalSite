fishColors = { //colors fish can be
	"red":[185,1,0],
	"orange": [229,25,0],
	"light green": [146, 66, 4],
	"dark green": [48,146,48]
}
fishList = [] //list of fish
let ticks = 0 //ticks
let spawnDelay = 100 //delay till fish spawn
let score = 0 //the score the player has
let grassText = "" //the text that displays on grass
let grassTextReset = 0 //how long until said text resets
let bobber //the bobber for the fisher to throw
let buttons = []
let loop = "menu"
let timeleft = 0
let timed = false
let scale = 0

let highscore = window.localStorage.getItem("highscore")
if (highscore == null) {highscore = 0}