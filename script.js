// Create Mnemonica stack order
const mnemonicaStack = [
  { value: '4', suit: 'clubs' },
  { value: '2', suit: 'hearts' },
  { value: '7', suit: 'diamonds' },
  { value: '3', suit: 'clubs' },
  { value: '4', suit: 'hearts' },
  { value: '6', suit: 'diamonds' },
  { value: 'ace', suit: 'spades' },
  { value: '5', suit: 'hearts' },
  { value: '9', suit: 'spades' },
  { value: '2', suit: 'spades' },
  { value: 'queen', suit: 'hearts' },
  { value: '3', suit: 'diamonds' },
  { value: 'queen', suit: 'clubs' },
  { value: '8', suit: 'hearts' },
  { value: '6', suit: 'spades' },
  { value: '5', suit: 'spades' },
  { value: '9', suit: 'hearts' },
  { value: 'king', suit: 'clubs' },
  { value: '2', suit: 'diamonds' },
  { value: 'jack', suit: 'hearts' },
  { value: '3', suit: 'spades' },
  { value: '8', suit: 'spades' },
  { value: '6', suit: 'hearts' },
  { value: '10', suit: 'clubs' },
  { value: '5', suit: 'diamonds' },
  { value: 'king', suit: 'diamonds' },
  { value: '2', suit: 'clubs' },
  { value: '3', suit: 'hearts' },
  { value: '8', suit: 'diamonds' },
  { value: '5', suit: 'clubs' },
  { value: 'king', suit: 'spades' },
  { value: 'jack', suit: 'diamonds' },
  { value: '8', suit: 'clubs' },
  { value: '10', suit: 'spades' },
  { value: 'king', suit: 'hearts' },
  { value: 'jack', suit: 'clubs' },
  { value: '7', suit: 'spades' },
  { value: '10', suit: 'hearts' },
  { value: 'ace', suit: 'diamonds' },
  { value: '4', suit: 'spaces' },
  { value: '7', suit: 'hearts' },
  { value: '4', suit: 'diamonds' },
  { value: 'ace', suit: 'clubs' },
  { value: '9', suit: 'clubs' },
  { value: 'jack', suit: 'spades' },
  { value: 'queen', suit: 'diamonds' },
  { value: '7', suit: 'clubs' },
  { value: 'queen', suit: 'spaces' },
  { value: '10', suit: 'diamonds' },
  { value: '6', suit: 'clubs' },
  { value: 'ace', suit: 'hearts' },
  { value: '9', suit: 'diamonds' }
];

let maxCards = 52;
let shuffledIndices = [];
let currentCardIndex = 0;
let score = 0;
let answers = [];
let guesses = [];
let startTime = null;
let guessTimes = [];
let lastGuessTime = null;
let gameStarted = false;
let difficultCards = [];

function startGame(practiceMode = false) {
  const cardCount = practiceMode ? difficultCards.length : parseInt(document.getElementById('card-count').value);
  if (!practiceMode && (isNaN(cardCount) || cardCount < 1 || cardCount > 52)) {
    alert('Please enter a valid number between 1 and 52');
    return;
  }

  maxCards = cardCount;
  gameStarted = true;
  
  // Create and shuffle indices array
  if (practiceMode) {
    shuffledIndices = [...difficultCards];
  } else {
    // Create array of all possible indices and shuffle them
    shuffledIndices = Array.from({length: 52}, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    // Take only the first cardCount indices
    shuffledIndices = shuffledIndices.slice(0, cardCount);
  }
  
  // Shuffle the selected indices
  for (let i = shuffledIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
  }
  
  currentCardIndex = 0;
  score = 0;
  answers = new Array(maxCards).fill(null);
  guesses = new Array(maxCards).fill(null);
  guessTimes = new Array(maxCards).fill(0);
  startTime = Date.now();
  lastGuessTime = Date.now();

  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = `
    <div id="card-display"></div>
    <div class="input-container">
      <input type="number" id="guess-input" placeholder="Enter card position (1-52)">
      <button onclick="checkAnswer()">Submit</button>
    </div>
  `;
  
  showNextCard();
}

function showNextCard() {
  if (currentCardIndex >= maxCards) {
    displayResults();
    return;
  }

  const shuffledIndex = shuffledIndices[currentCardIndex];
  const card = mnemonicaStack[shuffledIndex];
  const cardDisplay = document.getElementById('card-display');
  const valueChar = card.value === '10' ? '0' : card.value.charAt(0).toUpperCase();
  cardDisplay.innerHTML = `<img src="https://deckofcardsapi.com/static/img/${valueChar}${card.suit.charAt(0).toUpperCase()}.png" alt="${card.value} of ${card.suit}" class="card-image">`;
  
  document.getElementById('guess-input').value = '';
  document.getElementById('guess-input').focus();
  
  if (currentCardIndex === 0) {
    startTime = Date.now();
  }
  lastGuessTime = Date.now();
}

function checkAnswer() {
  const guess = parseInt(document.getElementById('guess-input').value);
  
  if (isNaN(guess) || guess < 1 || guess > 52) {
    alert('Please enter a valid number between 1 and 52');
    return;
  }

  const currentTime = Date.now();
  guessTimes[currentCardIndex] = (currentTime - lastGuessTime) / 1000;

  const shuffledIndex = shuffledIndices[currentCardIndex];
  guesses[currentCardIndex] = guess;
  answers[currentCardIndex] = guess === shuffledIndex + 1;
  if (guess === shuffledIndex + 1) {
    score++;
  }

  currentCardIndex++;
  showNextCard();
}

function displayResults() {
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const averageTime = (guessTimes.reduce((a, b) => a + b, 0) / maxCards).toFixed(2);
  const fastestTime = Math.min(...guessTimes).toFixed(2);
  const slowestTime = Math.max(...guessTimes).toFixed(2);
  const fastAnswers = guessTimes.filter(time => time <= 2).length;

  // Collect difficult cards (wrong answers or >2s response time)
  difficultCards = shuffledIndices.filter((cardIndex, i) => 
    !answers[i] || guessTimes[i] > 2
  );

  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = `
    <p>You got ${score} out of ${maxCards} right (${fastAnswers} under 2 seconds)</p>
    <div class="results">
      ${answers.map((correct, index) => {
        const shuffledIndex = shuffledIndices[index];
        const card = mnemonicaStack[shuffledIndex];
        const valueChar = card.value === '10' ? '0' : card.value.charAt(0).toUpperCase();
        const tooSlow = guessTimes[index] > 2;
        return `<div class="result ${correct ? (tooSlow ? 'slow' : 'correct') : 'incorrect'}">
          <img src="https://deckofcardsapi.com/static/img/${valueChar}${card.suit.charAt(0).toUpperCase()}.png" 
               alt="${card.value} of ${card.suit}" 
               class="result-card-image">
          ${correct ? (tooSlow ? '⚠' : '✓') : `✗ (Guessed: ${guesses[index]}, Correct: ${shuffledIndex + 1})`}
          (${guessTimes[index].toFixed(2)}s)
        </div>`;
      }).join('')}
    </div>
    <div class="button-container">
      <button onclick="resetGame()">Play Again</button>
      ${difficultCards.length > 0 ? 
        `<button onclick="startGame(true)">Practice ${difficultCards.length} Difficult Cards</button>` : 
        ''}
    </div>
  `;
}

function resetGame() {
  gameStarted = false;
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = `
    <div class="input-container">
      <input type="number" id="card-count" placeholder="How many cards? (1-52)" min="1" max="52">
      <button onclick="startGame(false)">Go</button>
    </div>
  `;
}

// Make functions globally accessible
window.startGame = startGame;
window.checkAnswer = checkAnswer;
window.resetGame = resetGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  resetGame();
});