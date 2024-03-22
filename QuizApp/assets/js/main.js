
// hata yakalamayi unutma
async function fetchQuestions() {
  let response;
  let data;
  let flag = false;

  try {
    response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      console.error("Bağlantı sırasında bir hata oluştu!");
      return [];
    } else {
      data = await response.json();
      if (data.length != 0) {
        flag = true;
        return data.slice(0, 10); // ilk 10 soruyu al
      }
    }
  } catch (error) {
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        console.error("Bağlantı sırasında bir hata oluştu!");
      } else {
        console.error("TypeError: " + error.message);
      }
    } else {
      console.error("Bilinmeyen bir hata oluştu!", error);
    }
  }

}

async function startQuiz() {

  const quizSettings = JSON.parse(localStorage.getItem('quizSettings'));
  const questions = await fetchQuestions();
  if (questions.length === 0) {
    console.error('Sorular alınamadı!');
    return;
  }
  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const timerElement = document.getElementById('timer'); // saat etiketi
  const questCounterElement = document.getElementById('questCounter'); // soru sayac
  let currentQuestionIndex = 0;
  let secondsLeft = quizSettings.questionSkipTime;
  // get local storage remaining time
  let remainingTime = quizSettings.questionTime;
  let timerInterval;

  function renderQuestion() {

    questCounterElement.textContent = `${currentQuestionIndex + 1}/${questions.length}`; // sayaci guncelle
    const currentQuestion = questions[currentQuestionIndex];
    let options = currentQuestion.body.split(" ").slice(0, 4);

    quizContainer.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${currentQuestionIndex + 1}. Soru:</h5>
                    <p class="card-text">${currentQuestion.body} ?</p>
                    <ul class="list-group choices">
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[0]}" style="pointer-events: none;">${options[0]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[1]}" style="pointer-events: none;">${options[1]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[2]}" style="pointer-events: none;">${options[2]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[3]}" style="pointer-events: none;">${options[3]}</a>
                    </ul>
                </div>
            
        `;
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
      choice.addEventListener('click', handleAnswerClick);
    });
    startTimer();
  }

  function handleAnswerClick(event) {
    const selectedChoice = event.target.dataset.choice;
    userAnswers[currentQuestionIndex] = selectedChoice; // cevap
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {

      choice.removeEventListener('click', handleAnswerClick);
    });

  }

  function startTimer() {
    timerInterval = setInterval(() => {
      
      timerElement.textContent = remainingTime; // kalan zaman
      if (remainingTime <= 0) {
        timerElement.textContent = '0:0:0';
        remainingTime = quizSettings.questionTime;
        clearInterval(timerInterval);
        showNextQuestion();
      } else {

        

        
        if (secondsLeft === 0) {
          quizContainer.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${currentQuestionIndex + 1}. Soru:</h5>
                    <p class="card-text">${currentQuestion.body} ?</p>
                    <ul class="list-group choices">
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[0]}" >${options[0]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[1]}" >${options[1]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[2]}" >${options[2]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[3]}" >${options[3]}</a>
                    </ul>
                </div>
            
        `;
        }
        
        remainingTime--;
               
        const hour = Math.floor(remainingTime / 3600) % 24;
        const minute = Math.floor(remainingTime / 60) % 60;
        const second = Math.floor(remainingTime % 60);
        timerElement.textContent = `${hour}:${minute}:${second}`;
        

      }
    }, 1000); // 1 saniyede bir azalt
  }

  function showNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      renderQuestion();

    } else {
      showResults();
    }
  }

  function showResults() {
    let resultHTML = '<h2>Sonuçlar</h2><table><tr><th>Soru</th><th>Cevap</th></tr>';
    questions.forEach((question, index) => {
      resultHTML += `<tr><td>${question.title}</td><td>${userAnswers[index] || '-'}</td></tr>`;
    });
    resultHTML += '</table>';
    resultContainer.innerHTML = resultHTML;
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
  }

  renderQuestion();
}

const userAnswers = [];

document.getElementById('start-button').addEventListener('click', startQuiz);
