const questionCountInput = document.getElementById('question-count');
const questionTimeInput = document.getElementById('question-time');
const questionSkipTimeInput = document.getElementById('question-skip-time');
const form = document.querySelector('form');
const alertContainer = document.getElementById('alert-container'); // Bootstrap alert container
const quizSettings = getQuizSettings();
let _questionCount;
let _questionTime;
let _questionSkipTime;

const defaultValues = {
    questionCount: 10,
    questionTime: 5,
    questionSkipTime: 10
};
localStorage.setItem('quizSettings', JSON.stringify(defaultValues));


questionCountInput.value = quizSettings.questionCount;
questionTimeInput.value = quizSettings.questionTime;
questionSkipTimeInput.value = quizSettings.questionSkipTime;

// Form submit 
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // form oku
    const newValues = {
        questionCount: parseInt(questionCountInput.value),
        questionTime: parseInt(questionTimeInput.value),
        questionSkipTime: parseInt(questionSkipTimeInput.value)
    };
    let conf =getQuizSettings();
    if(newValues.questionCount === conf.questionCount && newValues.questionTime === conf.questionTime && newValues.questionSkipTime === conf.questionSkipTime){
        showAlert('Yeni ayarlar kayıtlı ayarlarla aynı!', 'danger');
    }else{
        // Local storage yaz
        localStorage.setItem('quizSettings', JSON.stringify(newValues));
        showAlert('Ayarlar başarıyla kaydedildi.', 'success');
    }
});

function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);

   
    setTimeout(() => {
        if (alertContainer.contains(alert)){
            alertContainer.removeChild(alert);
        }
    }, 3000);
}

// alart kapat
alertContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-close')) {
        const alert = event.target.closest('.alert');
        if (alert) {
            alertContainer.removeChild(alert);
        }
    }
});

function getQuizSettings() {
    conf = JSON.parse(localStorage.getItem('quizSettings'));
    return conf ? conf : defaultValues;
}
