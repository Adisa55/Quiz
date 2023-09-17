
const startButton = document.querySelector('.button');
const cardStart = document.querySelector('.card-start');
const card = document.querySelector('.card');
const numDisplay = card.querySelector('.num');
const optionsContainer = document.getElementById('options');
const complexity = document.querySelectorAll('.complexity li');




let currentQuestionIndex = 0;
let data; 
let questionContainer, nextbutton; 
let totalScore = 0;
let filteredQuestions = [];
let quizStarted;




function loadData(){

  fetch('science.json')
  .then(response => response.json())
  .then(parsedData => {
    data = parsedData; 
    
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
  filteredQuestions = data.filter( question =>  question.complexity === selectedComplexity);


  
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

      if(quizStarted != true) {
      complexity.forEach(item => {
        item.classList.remove('active');
      });
  
      
      this.classList.add('active');
    }
        const selectedComplexity = this.getAttribute('complexity');
        filterAndDisplayQuestions(selectedComplexity);
      
    });
  });

function startQuiz() {
       
      quizStarted=true;
  
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
      else{
          alert('Please choose the complexity.');
      }

}



function handleNextButtonClick() {
  const selectedAnswer = document.querySelector('input[name="options"]:checked');
  if (selectedAnswer) {
    const selectedOption = selectedAnswer.nextElementSibling.textContent;
    const currentQuestion = filteredQuestions[currentQuestionIndex];

    if (selectedOption === currentQuestion.answer) {
      totalScore += 5; // 
    }
    
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(filteredQuestions[currentQuestionIndex]);
    } else {
      clearInterval(timerInterval);
      quizFinished();
    }
  } else {
    alert('Please select an answer before proceeding.');
  }
}

const timerElement = document.querySelector('.time');
const totalTimeInSeconds = 90;
let timeLeft = totalTimeInSeconds;
let timerInterval = null;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const minutesStr = String(minutes).padStart(1, '30');
  const secondsStr = String(seconds).padStart(1, '30');
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

function findExplanation() {
  questionContainer.textContent = ' Show Answers and Explanations:';
  optionsContainer.innerHTML = '';


  for (let i = 0; i < filteredQuestions.length; i++) {
    const questions = filteredQuestions[i];
    const explanations = questions.explanation;

    const explanationDiv = document.createElement('div');
    explanationDiv.innerHTML = `
      <p><strong>Question ${i + 1}:</strong> ${questions.question}</p>
      <p><strong>Correct Answer:</strong> ${questions.answer}</p>
      <p><strong>Explanation:</strong> ${explanations}</p>
    `;

    questionContainer.appendChild(explanationDiv);
  }

  
  const showAnswersButton = document.getElementById('explanation');
  showAnswersButton.style.display = 'none';
}





function quizFinished() {
  const finalScore = totalScore;
  const time = timeLeft;
  questionContainer.textContent = `Quiz Finished! `;

  const scoretext = document.createElement('p');
  scoretext.textContent = `Your score is: ${finalScore} / 25.`;
  questionContainer.appendChild(scoretext);
  
  const timetext = document.createElement('p');
  timetext.textContent = `Time left: ${time} seconds.`;
  questionContainer.appendChild(timetext);

  const answerExplanation = document.getElementById('explanation');
  answerExplanation.style.display = 'block';
  answerExplanation.addEventListener('click', findExplanation);

  questionContainer.style.fontSize = '24px';
  optionsContainer.innerHTML = '';
  nextbutton.style.display = 'none';


}

startButton.addEventListener('click', () => {
  cardStart.style.display = 'none';
  startQuiz();
  startTimer();
});


