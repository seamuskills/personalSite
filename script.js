charDiv = document.getElementById("characterEntry");
outDiv = document.getElementById("resultDiv")

charTemplate = document.createElement("div")
charTemplate.classList.add("character")

nameInput = document.createElement("input")
nameInput.type = "text"
nameInput.id = "name"
charTemplate.appendChild(nameInput)

dexInput = document.createElement("input")
dexInput.type = "number"
dexInput.id = "dex"
charTemplate.appendChild(dexInput)

miscModInput = document.createElement("input")
miscModInput.type = "number"
miscModInput.id = "miscMod"
charTemplate.appendChild(miscModInput)

deleteButton = document.createElement("button")
deleteButton.textContent = "X"
deleteButton.id = "trash"
charTemplate.appendChild(deleteButton)

chars = [] //entry format: {name:"text", dex: 0, mod:0}

function removeChar(index){
    chars.splice(index, 1)
    charDiv.childNodes[index].remove()
}

function modifyProperty(index, input, property){
    chars[index][property] = input
}

function addChar(){
    chars.push({name:"undefined", dex:0, mod:0})
    let clone = charTemplate.cloneNode(true)
    clone.childNodes[0].addEventListener("input",(event) => {
        let index = Array.from(charDiv.children).indexOf(clone);
        modifyProperty(index, event.target.value, "name")
    })
    clone.childNodes[1].addEventListener("input",(event) => {
        let index = Array.from(charDiv.children).indexOf(clone);
        modifyProperty(index, Number(event.target.value), "dex")
    })
    clone.childNodes[2].addEventListener("input",(event) => {
        let index = Array.from(charDiv.children).indexOf(clone);
        modifyProperty(index, Number(event.target.value), "mod")
    })
    clone.childNodes[3].addEventListener("click", () => {
        let index = Array.from(charDiv.children).indexOf(clone);
        removeChar(index)
    })
    charDiv.insertBefore(clone, plusButton)
    return clone
}

plusButton = document.createElement("button")
plusButton.textContent = "+"
plusButton.id = "addButton"
plusButton.addEventListener("click", addChar)
charDiv.appendChild(plusButton)

function output(){
    let rolls = []
    for (let char of chars){
        let roll = Math.max(Math.round(Math.random()*20 + (char.dex + char.mod)), 1)
        rolls.push([char.name, roll, char.dex])
    }
    rolls.sort((a, b) => {
        if (a[1] !== b[1]){
            return a[1] < b[1] ? 1 : -1
        }else if (a[2] !== b[2]){
            return a[2] < b[2] ? 1 : -1
        }else{
            return Math.random() <= 0.5 ? 1 : -1
        }
    })
    outDiv.innerHTML = "Current Initiative:"
    for (let roll of rolls){
        rollElem = document.createElement("div")
        rollElem.classList.add("roll")
        rollElem.innerHTML = `${rolls.indexOf(roll) + 1}. ${roll[0]} (${roll[1]})`
        outDiv.appendChild(rollElem)
    }
}

function importJSON(){
    let fileImport = document.createElement("input")
    fileImport.type = "file"
    fileImport.click()
    fileImport.addEventListener("change", () => {
        let textPromise = fileImport.files[0].text()
        textPromise.then((result) => {parseJSON(result)})
    })
}

function parseJSON(string){
    let json
    try {
        json = JSON.parse(string)
    }catch(e){
        alert("Invalid json file provided!")
        return
    }
    let charsIndex = chars.length
    for (let i = 0; i < json.length; i++) {
        let elem = addChar()
        chars[charsIndex + i].name = json[i].name
        elem.childNodes[0].value = json[i].name
        chars[charsIndex + i].dex = json[i].dex
        elem.childNodes[1].value = json[i].dex
        chars[charsIndex + i].mode = json[i].mod
        elem.childNodes[2].value = json[i].mod
    }
}

function exportJSON(){
    let json = JSON.stringify(chars)
    let blob = new Blob([json], { type: "application/json" })

    let url = window.URL
    let link = url.createObjectURL(blob)
    let a = document.createElement("a")
    a.href = link
    a.download = "party.json"
    a.click()
}

rollButton = document.getElementById("rollButton")
rollButton.addEventListener("click", output)

uploadButton = document.getElementById("upload")
uploadButton.addEventListener("click", importJSON)

downloadButton = document.getElementById("download")
downloadButton.addEventListener("click", exportJSON)