
// hata yakalamayi unutma
async function fetchQuestions(qc) {

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
        return data.slice(0, qc); // ilk 10 soruyu al
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
  let questionCount = quizSettings.questionCount;
  const questions = await fetchQuestions(questionCount);
  if (questions.length === 0) {
    console.error('Sorular alınamadı!');
    return;
  }
  const quizCard = document.getElementById('quiz'); 
  const configCard = document.getElementById('config');
  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const timerElement = document.getElementById('timer'); // saat etiketi
  const questCounterElement = document.getElementById('questCounter'); // soru sayac
  const nextButton = document.getElementById('next-button');
  const finishButton = document.getElementById('finish-button');
  const lockIcon = document.getElementById('lock-icon');
  let currentQuestionIndex = 0;
  let secondsLeft = quizSettings.questionSkipTime;
  // get local storage remaining time
  let remainingTime = quizSettings.questionTime;
  let timerInterval;
  
  configCard.style.display = 'none';
  quizCard.style.display = 'block';


  nextButton.addEventListener('click', handleSkipClick);
  finishButton.addEventListener('click', showResults);

  /************** soru cevap hazirla basla **************/
  function renderQuestion() {

    questCounterElement.textContent = `${currentQuestionIndex + 1}/${questions.length}`; // sayaci guncelle
    const currentQuestion = questions[currentQuestionIndex];
    let options = currentQuestion.body.split(" ").slice(0, 4);

    quizContainer.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${currentQuestionIndex + 1}. Soru:</h5>
                    <p class="card-text">${currentQuestion.body} ?</p>
                    <ul class="list-group choices">
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[0]}">${options[0]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[1]}">${options[1]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[2]}">${options[2]}</a>
                        <a href="#" class="list-group-item list-group-item-action choice" data-choice="${options[3]}">${options[3]}</a>
                    </ul>
                </div>
            
        `;
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
      choice.addEventListener('click', handleAnswerClick);
    });
    startTimer();
  }
  /*########### soru cevap hazirla bitir ###########*/

  /************** cevap olayi basla **************/
  function handleAnswerClick(event) {
    const selectedChoice = event.target.dataset.choice;
    // ad active class

    userAnswers[currentQuestionIndex] = selectedChoice; // cevap
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
      // remova avtive class
      if (choice.classList.contains('active')) {
        choice.classList.remove('active');
      }
      // choice.removeEventListener('click', handleAnswerClick);
    });
    event.target.classList.add('active');

  }
  /*########### cevap olayi bitir ###########*/

  /************** soru gec olayi basla **************/
  function handleSkipClick() {
    secondsLeft = quizSettings.questionSkipTime;
    clearInterval(timerInterval); 
    remainingTime = quizSettings.questionTime;
    nextButton.disabled = true;
    showNextQuestion(); 
  }
  /*########### soru gec olayi bitir ###########*/

  /************** zaman basla **************/
  function startTimer() {
    timerInterval = setInterval(() => {
      timerElement.textContent = remainingTime; 
      if (remainingTime <= 0) {
        timerElement.textContent = '0:0:0';
        remainingTime = quizSettings.questionTime;
        clearInterval(timerInterval);
        showNextQuestion(); 
      } else {
        secondsLeft--;
        remainingTime--;
        if (secondsLeft === 0) {
          lockIcon.innerHTML = '<i class="bi bi-unlock-fill text-success" data-bs-toggle="tooltip" title="Bir sonraki soruya geçiş açık."></i>';
          nextButton.disabled = false;
        }
        const hour = Math.floor(remainingTime / 3600) % 24;
        const minute = Math.floor(remainingTime / 60) % 60;
        const second = Math.floor(remainingTime % 60);
        timerElement.textContent = `${hour}:${minute}:${second}`;
      }
    }, 1000); // Her saniyede bir güncelle
  }
  /*########### zaman bitir ###########*/


  /************** sonraki soru basla **************/
  function showNextQuestion() {
    currentQuestionIndex++;
    lockIcon.innerHTML = '<i class="bi bi-lock-fill text-danger" data-bs-toggle="tooltip" title="Belirlenen minimum süre dolmadan soruyu geçemezsiniz!"></i>';
    if (currentQuestionIndex < questions.length) {
      
      if (currentQuestionIndex === questions.length - 1) {
        finishButton.disabled = false;
        nextButton.disabled = true;
        
      }
      renderQuestion();

    } else {
      
      showResults();
    }
  }
  /*########### sonraki soru bitir ###########*/

  /************** sonuc goster basla **************/
  function showResults() {
    quizCard.style.display = 'none';
    let resultHTML = '<h2>Sonuçlar</h2><table class="table"><thead><tr><th>Numara</th><th style="max-withd:60%;">Soru</th><th>Cevap</th></tr></thead><tbody>';
    questions.forEach((question, index) => {
      resultHTML += `<tr><td>${index+1}</td><td>${question.body}</td><td>${userAnswers[index] || '-'}</td></tr>`;
    });
    resultHTML += '</tbody></table>';
    resultContainer.innerHTML = resultHTML;
    quizContainer.style.display = 'none'; 
    resultContainer.style.display = 'block';
  }
  /*########### sonuc goster bitir ###########*/
  renderQuestion();
}

const userAnswers = [];

document.getElementById('start-button').addEventListener('click', startQuiz);
