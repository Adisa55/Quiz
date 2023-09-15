// Get references to relevant HTML elements
const startButton = document.querySelector('.button');
const cardStart = document.querySelector('.card-start');
const card = document.querySelector('.card');
const numDisplay = card.querySelector('.num');
const optionsContainer = document.getElementById('options');
const complexity = document.querySelectorAll('.complexity li');




let currentQuestionIndex = 0;
let data; 
let questionContainer, nextbutton; 
let score = 0;
let filteredQuestions = [];




function loadData(){

  fetch('questions.json')
  .then(response => response.json())
  .then(parsedData => {
    data = parsedData; // Store the data globally
    
    if(data.length == 0) {
      console.error('No questions found in the JSON data.');
    }
  })
  .catch(error => {
    console.error('Error fetching questions:', error);
  });
  
}
loadData();



function filterAndDisplayQuestions(selectedComplexity) {
  filteredQuestions = data.filter(question => question.complexity === selectedComplexity);


  
  if (filteredQuestions.length == 0){

    questionContainer.textContent = 'No questions found for this complexity.';
    optionsContainer.innerHTML = '';
    nextbutton.style.display = 'none';
  }

  
}


function displayQuestion(que) {
    numDisplay.textContent = currentQuestionIndex + 1;
    questionContainer = document.querySelector('.question');
    const questionDiv = document.createElement('div');
    questionDiv.textContent = que.question;
    questionDiv.setAttribute('complexity', que.complexity);
    questionContainer.textContent = ''; 

    questionContainer.appendChild(questionDiv);
    optionsContainer.innerHTML = `
      <div>
        <input type="radio" id="${que.option1}" compexity="Hard" name="options">
        <label for="${que.option1}">${que.option1}</label>
      </div>
      <div>
        <input type="radio" id="${que.option2}" name="options">
        <label for="${que.option2}">${que.option2}</label>
      </div>
      <div>
        <input type="radio" id="${que.option3}" name="options">
        <label for="${que.option3}">${que.option3}</label>
      </div>
      <div>
        <input type="radio" id="${que.option4}" name="options">
        <label for="${que.option4}">${que.option4}</label>
      </div>
      <div class="btn"><button class="next">Next</button></div>
    `;
    
    nextbutton = document.querySelector('.next'); 
    nextbutton.style.display = 'block';
    nextbutton.textContent = currentQuestionIndex === filteredQuestions.length - 1 ? 'Submit' : 'Next';
    nextbutton.removeEventListener('click', handleNextButtonClick);
    nextbutton.addEventListener('click', handleNextButtonClick);


   
  }
  complexity.forEach(level => {
    level.addEventListener('click', function () {
        const selectedComplexity = this.getAttribute('complexity');
        filterAndDisplayQuestions(selectedComplexity);
      
    });
  });

function startQuiz() {
  
      if (filteredQuestions.length > 0) {

        displayQuestion(filteredQuestions[0]);
        cardStart.style.display = 'none';
        
        nextbutton.addEventListener('click', handleNextButtonClick);
        if (nextbutton.textContent === 'Submit') {
          nextbutton.addEventListener('click', () => {
            quizFinished(); 
          });
        }
      } 

}



function handleNextButtonClick() {
  const selectedAnswer = document.querySelector('input[name="options"]:checked');
  if (selectedAnswer) {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(filteredQuestions[currentQuestionIndex]);
    } else {
      quizFinished();
    }
  } else {
    alert('Please select an answer before proceeding.');
  }
}

const timerElement = document.querySelector('.time');
const totalTimeInSeconds = 120;
let timeLeft = totalTimeInSeconds;
let timerInterval = null;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  timerElement.textContent = `${minutesStr}:${secondsStr}`;

}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      quizFinished();
    }
  }, 1000);
}


function calculateScore() {
  const totalScore = filteredQuestions.reduce((score, que) => {
    if (que.answer === getSelectedAnswer(que)) {
      return score + 5;
    }
    return score;
  }, 0);

  return totalScore;
}


function quizFinished() {
  questionContainer.textContent = 'Quiz Finished!';
  optionsContainer.innerHTML = '';
  nextbutton.style.display = 'none';
  const finalScore = calculateScore();
  cardStart.innerHTML =`<p>Your score is: ${finalScore}</p>`;
}

startButton.addEventListener('click', () => {
  cardStart.style.display = 'none';
  startQuiz();
  startTimer();
});


