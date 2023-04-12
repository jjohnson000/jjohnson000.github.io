"use strict";

(function() {
let timerId;
let remainingSeconds;
let totalCards = 0;

window.addEventListener("load", init);

function init() {
    //why does it generate the game at load? I need it to do it only when I click on start-btn
    id("start-btn").addEventListener("click", startGame);
    id("back-btn").addEventListener("click", backButton);
    id("refresh-btn").addEventListener("click", refreshGame);

}

function startGame(){
    id("set-count").textContent = 0;
    startTimer();
    deleteBoard();
    toggleView();
    createBoard();
    id("refresh-btn").addEventListener("click", refreshGame);
}
function backButton(){
    gameEnd();
    toggleView();
}

function gameEnd(){
    clearInterval(timerId);
    if(remainingSeconds == 0){
        let cards = document.getElementsByClassName("card");
        for(let i = 0; i < 12; i++){
            if(cards[i].classList.contains("selected")){
                cards[i].classList.toggle("selected");
            }
            cards[i].removeEventListener("click", cardSelected);
        }
        
        id("refresh-btn").removeEventListener("click", refreshGame);
    }
    
}

function createBoard(){
    let inputStuff = document.querySelector("input");
        let standardOrEasy;
        if (inputStuff.checked == true){ 
            standardOrEasy = true;
        } else {
            standardOrEasy = false;
        }
        let board = document.getElementById("board");

    for(let i = 0; i < 12; i++){
        let newCard = generateUniqueCard(standardOrEasy);

        while(isDuplicate(newCard) == true){
            newCard = generateUniqueCard(standardOrEasy);
        }

        board.appendChild(newCard);
        id(newCard.id).addEventListener("click", cardSelected);
        totalCards++;
    }
}
function deleteBoard(){
    // let cards = document.getElementsByClassName("card");
    let cards = qsa(".card");

    for(let i = 0; i < cards.length; i++){
        cards[i].remove();
    }
}

function refreshGame(){
    deleteBoard();
    createBoard();
    clearInterval(timerId);
    startTimer();
}

function isDuplicate(nCard){
    if(document.getElementById(nCard.id) == null) { //there are no duplicates
        return false; 
    } else {
       return true;
    }
}

function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let allSame = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      let allDiff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
      if (!(allDiff || allSame)) {
        return false;
      }
    }
    return true;
  }


function toggleView(){
    let gameView = id("game-view");
    let menuView = id("menu-view");
    gameView.classList.toggle("hidden");
    menuView.classList.toggle("hidden");
}

function generateRandomAttributes(isEasy){
    let colors = ["green", "purple", "red"];
    let fill = ["solid", "outline", "striped"];
    let shape = ["diamond", "oval", "squiggle"];
    let count = ["1", "2", "3"];
    let array_attributes = [4];
    if(isEasy == true){
        array_attributes[0] = colors[Math.floor(Math.random()*3)]
        array_attributes[1] = "solid";
        array_attributes[2] = shape[Math.floor(Math.random()*3)]
        array_attributes[3] = count[Math.floor(Math.random()*3)]
    } else {
        array_attributes[0] = colors[Math.floor(Math.random()*3)]
        array_attributes[1] = fill[Math.floor(Math.random()*3)];
        array_attributes[2] = shape[Math.floor(Math.random()*3)]
        array_attributes[3] = count[Math.floor(Math.random()*3)]
    }
    
    return array_attributes;
}

function generateUniqueCard(isEasy){
    let cardDiv = document.createElement("div");
    let a_attributes = generateRandomAttributes(isEasy);
    let count = parseInt(a_attributes[3])
    for(let i = 0; i<count; i++){
        let newImage = document.createElement("img");
        newImage.src = "img/" + a_attributes[0] + "-" + a_attributes[1] + "-" + a_attributes[2] + ".png";
        newImage.alt = a_attributes[0] + "-" + a_attributes[1] + "-" + a_attributes[2] + "-" + a_attributes[3];
        cardDiv.appendChild(newImage);
    }
    let stringId = a_attributes[0] + "-" + a_attributes[1] + "-" + a_attributes[2] + "-" + a_attributes[3]
    cardDiv.id = stringId;
    cardDiv.className = "card";
    return cardDiv;
}

function cardSelected(){
    this.classList.toggle("selected");
    let unfilteredCards = document.getElementsByClassName("card");
    let filteredCards = [];
    for(let i = 0; i < 12; i++){
       if(unfilteredCards[i].classList.contains("selected")){
        if(filteredCards.length<=3){
         filteredCards.push(unfilteredCards[i]);
        } else {
            i = 12;
        }
       }
    }

    if(isASet(filteredCards)){
        for(let i = 0; i < 3; i++){
            filteredCards[i].classList.toggle("selected");
            filteredCards[i].classList.add("hide-imgs");
            let newPara = document.createElement("p");
            newPara.textContent = "Set!";
            filteredCards[i].appendChild(newPara);
        }

        setTimeout(function(){replaceCards(filteredCards)}, 1000);

        id("set-count").textContent = parseInt(id("set-count").textContent) + 1;
        
    } else {
        for(let i = 0; i < 3; i++){
            filteredCards[i].classList.toggle("selected");
            filteredCards[i].classList.add("hide-imgs");
            let newPara = document.createElement("p");
            newPara.textContent = "It's not a set :(";
            filteredCards[i].appendChild(newPara);
        }
        
        setTimeout(function(){resetFromNotSet(filteredCards)}, 1000);

        remainingSeconds = remainingSeconds - 15;
    }    
}


function replaceCards(filteredCards){
    let inputStuff = document.querySelector("input");
        let standardOrEasy;
        if (inputStuff.checked == true){ 
            standardOrEasy = true;
        } else {
            standardOrEasy = false;
        }

    for(let i = 0; i < 3; i++){
        let newCard = generateUniqueCard(standardOrEasy);

        while(isDuplicate(newCard) == true){
            newCard = generateUniqueCard(standardOrEasy);
        }

        filteredCards[i].replaceWith(newCard);
        id(newCard.id).addEventListener("click", cardSelected);
        
    }
    console.log("wait for one second");
}
function resetFromNotSet(filteredCards){
    for(let i = 0; i < 3; i++){
        filteredCards[i].classList.remove("hide-imgs");
        filteredCards[i].removeChild(filteredCards[i].lastChild);
    }
}

function startTimer(){
    let selectElement = document.querySelector("select");
    remainingSeconds = selectElement.value;
    timerId = setInterval(advancedTimer, 1000);
}

function advancedTimer(){
    remainingSeconds--;
    if(remainingSeconds <= 0){
        id("time").textContent = "00" + ":" + "00";
        clearInterval(timerId);
        gameEnd();
    } else {
        let minutes = Math.floor(remainingSeconds/60);
        let seconds = remainingSeconds%60;

        let string_minutes = minutes.toString();
        let string_seconds = seconds.toString();
        id("time").textContent = string_minutes.padStart(2, '0') + ":" + string_seconds.padStart(2, '0');
    }
}

/////////////////////////////////////////////////////////////////////
// Helper functions
function id(id) {
    return document.getElementById(id);
}
  
function qs(selector) {
    return document.querySelector(selector);
}
  
function qsa(selector) {
    return document.querySelectorAll(selector);
}
})();
//random: 