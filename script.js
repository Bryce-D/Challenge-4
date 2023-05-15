const startButton = document.getElementById('start-btn');
const viewScoresButton = document.getElementById('view-scores-btn');
const questionContainer = document.getElementById('question-container');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('timer');
const endContainer = document.getElementById('end-container');
const finalScoreElement = document.getElementById('final-score');
const submitButton = document.getElementById('submit-btn');
const initialsInput = document.getElementById('initials');
const highScoresContainer = document.getElementById('high-scores-container');
const highScoresList = document.getElementById('high-scores-list');
const startContainer = document.getElementById('start-container');
// all my items that needed to be defined in js


let questions = [
  {
    question: "Where is the tallest building in the world?",
    answers: [
      { text: "England", correct: false },
      { text: "India", correct: true },
      { text: "Gemany", correct: false },
      { text: "Saudi Arabia", correct: false },
    ],
  },
  {
    question: "What is believed to be the largest living organism on Earth?",
    answers: [
      { text: "Blue Whale", correct: false },
      { text: "Humpback Whale", correct: false },
      { text: "Aspen Tree", correct: true },
      { text: "Redwood Tree", correct: false },
    ],
  },
  {
    question: "Where is the biggest volcano in our solar system located?",
    answers: [
      { text: "Mars", correct: true },
      { text: "Earth", correct: false },
      { text: "Venus", correct: false },
      { text: "Mercury", correct: false },
    ],
  },
  {
    question: "What is the funniest name for a Wi-Fi router I've seen?",
    answers: [
      { text: "Myriad Gnomes", correct: false },
      { text: "Watch for Killer Dolphins", correct: true },
      { text: "P*ss off Jerry", correct: false },
      { text: "Look Dad I Changed the Wifi", correct: false },
    ],
  },
];
// all my questions
let currentQuestionIndex = 0;
let score = 0;
let timeRemaining = 20;
let timerId;
// setting up my time on the timer and starting point og the score
startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', saveScore);
viewScoresButton.addEventListener('click', showHighScores);
// my event listeners to have my buttons work
function startQuiz() {
  document.getElementById('start-container').classList.add('hide');
  questionContainer.classList.remove('hide');
  showQuestion();
  startTimer();
}
// function to start quiz
function showHighScores() {
    document.getElementById('start-container').classList.add('hide'); // Hide the start container
    highScoresContainer.classList.remove('hide'); // Show the high scores container
  }
//allows highscores to be seen
function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question').innerText = question.question;
  answerButtonsElement.innerHTML = '';

  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}
//shows the questions when game starts
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
  
    Array.from(answerButtonsElement.children).forEach(button => {
      setStatusClass(button, button.dataset.correct);
    });
  
    if (correct === 'true') {
      score += 2; // Add 2 points for correct answer
    } else {
      timeRemaining -= 5; // Subtract 5 seconds for wrong answer
      if (timeRemaining < 0) {
        timeRemaining = 0; // Ensure time doesn't go negative
      }
    }
  
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      setTimeout(showQuestion, 500);
    } else {
      questionContainer.classList.add('hide');
      endContainer.classList.remove('hide');
      stopTimer();
      finalScoreElement.innerText = calculateScore(); // Display final score
    }
  }
  //actions for when question is answered rightly or wrongly
  function calculateScore() {
    const maxScore = questions.length * 2;
    const deductedPoints = Math.max(0, (questions.length - score / 2) * 2);
    const finalScore = maxScore - deductedPoints;
    return finalScore;
  }
  //calculates the score
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct === 'true') {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}
//connected to css colors correct answer green and wrong answer red
function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}
//removes color from answers after answering
function startTimer() {
  timerId = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

function updateTimer() {
  timeRemaining--;
  timerElement.innerText = timeRemaining;

  if (timeRemaining <= 0) {
    stopTimer();
  }
}
// functions for the timer
function calculateScore() {
  return Math.max(0, score); 
}

function saveScore(event) {
    event.preventDefault();
    const initials = initialsInput.value.trim();
    if (initials !== '') {
      const savedScores = JSON.parse(localStorage.getItem('quizScores')) || [];
      const scoreData = {
        initials: initials,
        score: score
      };
      savedScores.push(scoreData);
      localStorage.setItem('quizScores', JSON.stringify(savedScores));
      initialsInput.value = '';
      submitButton.disabled = true;
      showHighScores(); 
    }
}
  //saves the score

    function showHighScores() {
        document.getElementById('start-container').classList.add('hide'); 
        questionContainer.classList.add('hide'); 
        endContainer.classList.add('hide');
      
        const savedScores = JSON.parse(localStorage.getItem('quizScores')) || [];
        const sortedScores = savedScores.sort((a, b) => b.score - a.score);
        highScoresList.innerHTML = '';
      
        sortedScores.forEach((scoreData) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${scoreData.initials}: ${scoreData.score}`;
          highScoresList.appendChild(listItem);
        });
      
        highScoresContainer.classList.remove('hide'); 
      }
      //recorded high scores