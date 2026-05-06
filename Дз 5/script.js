const quiz = [
    {
        question: "Сколько будет 2+2?",
        options: [2, 3, 4, 5],
        correct: 4
    },
    {
        question: "Столица Франции?",
        options: ["Берлин", "Париж", "Рим"],
        correct: "Париж"
    },
    {
        question: "JS это?",
        options: ["Язык", "База данных", "ОС"],
        correct: "Язык"
    }
];

const quizList = document.getElementById('quizList');
const showQuizBtn = document.getElementById('showQuizBtn');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');

let quizVisible = false;

function renderQuiz() {
    quizList.innerHTML = '';
    
    quiz.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.correct = item.correct;

        const questionSpan = document.createElement('div');
        questionSpan.className = 'question-text';
        questionSpan.textContent = `${index + 1}. ${item.question}`;
        card.appendChild(questionSpan);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        item.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q_${index}`;
            radio.value = option;
            
            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${option}`));
            optionsDiv.appendChild(label);
        });
        
        card.appendChild(optionsDiv);
        quizList.appendChild(card);
    });
}

function showQuiz() {
    if (!quizVisible) {
        quizVisible = true;
        quizList.classList.remove('hidden');
        renderQuiz();
        showQuizBtn.disabled = true;
        showQuizBtn.textContent = 'Вопросы показаны';
        resultDiv.innerHTML = '';
    }
}

showQuizBtn.addEventListener('click', showQuiz);

function checkAnswers() {
    if (!quizVisible) {
        alert("Сначала покажите вопросы");
        return;
    }
    
    const cards = document.querySelectorAll('.question-card');
    let correctCount = 0;
    
    cards.forEach((card) => {
        const selected = card.querySelector('input[type="radio"]:checked');
        const correctAnswer = card.dataset.correct;
        
        if (selected) {
            if (selected.value == correctAnswer) {
                correctCount++;
                card.style.backgroundColor = '#d4edda';
            } else {
                card.style.backgroundColor = '#f8d7da';
            }
        } else {
            card.style.backgroundColor = '#fff3cd';
        }
    });
    
    if (correctCount === quiz.length) {
        resultDiv.innerHTML = `Отлично! Все ${correctCount} ответов правильные`;
        resultDiv.style.background = "#d4edda";
        resultDiv.style.color = "#155724";
    } else {
        resultDiv.innerHTML = `Правильных ответов: ${correctCount} из ${quiz.length}`;
        resultDiv.style.background = "#f8d7da";
        resultDiv.style.color = "#721c24";
    }
}

submitBtn.addEventListener('click', checkAnswers);