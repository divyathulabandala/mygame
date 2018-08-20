/*
 * Create a list that holds all of your cards
 */
// ~~~ This is an array with all the cards ~~~
const cardsList = ["fa-paper-plane-o", "fa-paper-plane-o",
			"fa-diamond", "fa-diamond",
			"fa-bicycle", "fa-bicycle",
			"fa-anchor", "fa-anchor",
			"fa-bolt", "fa-bolt",
			"fa-cube", "fa-cube",
			"fa-leaf", "fa-leaf",
			"fa-bomb", "fa-bomb",
			];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
let totalSec = 0;
let min = document.querySelector(".min");
let sec = document.querySelector(".sec");

//	~~~ Timer function ~~~
function startTimer (){	

	
	function setTime() {
		++totalSec;
		sec.innerHTML = pad(totalSec % 60);
		min.innerHTML = pad(parseInt(totalSec / 60));
	}

	function pad (val) {
		let valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}
	timer = setInterval(setTime, 1000)
	
}

function stopTimer() {
	clearInterval(timer);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const moves = document.querySelector(".moves");
let moveCounter = 0;

// ~~~ Moves Counter Function ~~~
function movesCount() {
	
	moveCounter += 1;
	moves.innerHTML = moveCounter
}
//  ~~~ This function adds the cards into the HTML when called ~~~
function displayCards(card) { 
	return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`
}

//  ~~~ This removes all stars currently being used and replaced with my default stars. ~~~
function resetStars() { 
	document.querySelector(".star-1").remove();
	document.querySelector(".star-2").remove();
	document.querySelector(".star-3").remove();
	$(".stars").append('<li class="star-1"><i class="fas fa-star"></i></li>');
	$(".stars").append('<li class="star-2"><i class="fas fa-star"></i></li>');
	$(".stars").append('<li class="star-3"><i class="fas fa-star"></i></li>');
}

function resetCards() {
	const deck = document.querySelector(".deck");
	allCards.forEach(function(card) {
		card.classList.remove("match", "show", "open");
		selectedCards = [];
		matchedCards = [];

	});
}

function endGame () {
	const modal = document.querySelector(".modal");
	const modalContent = document.querySelector(".modal-content");
	const messagePara = document.querySelector(".winning-message");
	const messageContainer = document.createElement("p");
	const closeModal = document.querySelector(".close");
	//const tryAgain = document.querySelector(".try-again");
	const newGame = document.querySelector(".new-game");
	let totalStars = document.querySelector(".stars").innerHTML;
	let scoreMessage = document.createElement("span");
	let timeMessage = document.createElement("p");

	setTimeout(function() {
		clearInterval(timer); //  Stops Timer				
	}, 300);

	modal.classList.add("modal-open");
	messageContainer.textContent = "You scored"
	messagePara.append(messageContainer);
	scoreMessage.innerHTML = totalStars;
	messageContainer.append(scoreMessage);

	timeMessage.innerText = "With a time of  " + min.innerHTML + ":" + sec.innerHTML+ "!"
	messagePara.append(timeMessage);

	newGame.addEventListener("click", function() {
		location.reload();
	});
	
	/*  ~~~ Coming Soon ~~~
	tryAgain.addEventListener("click", function() {
		modal.classList.remove("modal-open");
	});
	*/
}

//	~~~ This function starts out the game ~~~
function gameStart () {
	const deck = document.querySelector(".deck");
	//const score = document.querySelector(".score-panel");

	let deckHTML = shuffle(cardsList).map(function(card) {
		return displayCards(card);
	});
	deck.innerHTML = deckHTML.join("");
	startTimer();
}

gameStart(); // calls the game to start

const allCards = document.querySelectorAll(".card");
const stars = document.querySelector(".stars");
const reset = document.querySelector(".fa-repeat");
let selectedCards = [];
let matchedCards = [];

reset.addEventListener("click", function resetAll() {
	moves.innerHTML = 0;
	moveCounter = 0;
	totalSec = 0;
	stopTimer();
	startTimer();
	resetStars();
	resetCards();
});

//	~~~ This function deals with the actual game's functionality. ~~~
allCards.forEach(function(card) {
	card.addEventListener('click', function(e) {

		//	~~~ add selected cards to an array and prevents double-click bug ~~~
		if(!card.classList.contains("open") && !card.classList.contains("show") && !card.classList.contains("match")) {
			card.classList.add('open', 'show');
			selectedCards.push(card);
		}

			//	~~~ This if statement flips cards back down when they do not match over a 300 millisecond time span ~~~
			if(selectedCards.length === 2) {
				setTimeout(function() {
					selectedCards.forEach(function(card) {
						card.classList.remove("open", "show");
					});

					selectedCards = [];
					}, 300);
			}

			//	~~~ This prevents the bug of matching 3 cards ~~~
			while (selectedCards.length === 3) {
				selectedCards.remove(selectedCards.length);
			}

			//	~~~ This starts the moves counter ~~~
			if (selectedCards.length === 2 || matchedCards === 2) {
				movesCount();
			}

			//	~~~ If player reaches 14 moves, a star is deducted from the score ~~~
			if (moves.innerText == 14) {
				document.querySelector(".star-3").remove();
				$(".stars").append('<li class="star-3"><i class="far fa-star"></i></li>');
			}

			//	~~~ If player reaches 18 moves, another star is deducted from the score ~~~
			else if (moves.innerText == 18) {
				document.querySelector(".star-2").remove();
				$(".stars").append('<li class="star-2"><i class="far fa-star"></i></li>');
			}

			//	~~~ This determines whether cards with the same picture matches or not ~~~
			if (selectedCards[0].dataset.card === selectedCards[1].dataset.card) {
				selectedCards.forEach(function(card) {
					card.classList.add("match");
				});

					//	~~~ Adds matched cards to an array ~~~
					if (card.classList.contains("match")) {
					matchedCards.push(card);
					}

					//	~~~ When there are 8 matches in the array, a victory screen displays ~~~
					if (matchedCards.length === 8) {
						endGame();
					}
			}
			
	});
});

