class QuestionRenderer {
    constructor(questionData, selectedAnswer = null) {
        this.data = questionData;
        this.selectedAnswer = selectedAnswer;
    }

    renderAnswers(onSelect) {
        const allAnswers = [...this.data.incorrect_answers, this.data.correct_answer];
        for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }

        const container = document.createElement('div');
        container.className = 'answers';

        allAnswers.forEach(answer => {
            const btn = document.createElement('button');
            btn.textContent = answer;
            btn.className = 'answer-btn';

            if (this.selectedAnswer === answer) {
                this.markAnswer(btn, answer, this.data.correct_answer);
                btn.disabled = true;
            }

            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                container.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
                this.markAnswer(btn, answer, this.data.correct_answer);
                onSelect(answer);
            });

            container.appendChild(btn);
        });

        return container;
    }

    markAnswer(btn, selected, correct) {
        if (selected === correct) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('wrong');
            btn.parentElement.querySelectorAll('.answer-btn').forEach(b => {
                if (b.textContent === correct) b.classList.add('correct');
            });
        }
    }

    getCategory() {
        return this.data.category || 'No category';
    }

    getQuestionText() {
        const txt = document.createElement('textarea');
        txt.innerHTML = this.data.question;
        return txt.value;
    }
}

class QuizApp {
    constructor() {
        this.apiUrl = 'https://opentdb.com/api.php?amount=10';
        this.storageKey = 'quizState';
        this.questions = [];
        this.userAnswers = [];
        this.currentIndex = 0;
        this.score = 0;

        this.loadingScreen = document.getElementById('loadingScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultScreen = document.getElementById('resultScreen');
        this.questionCounterSpan = document.getElementById('questionCounter');
        this.scoreDisplaySpan = document.getElementById('scoreDisplay');
        this.categorySpan = document.getElementById('category');
        this.questionTextP = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.nextBtn = document.getElementById('nextBtn');
        this.finalScoreSpan = document.getElementById('finalScore');
        this.resultMessageDiv = document.getElementById('resultMessage');
        this.restartBtn = document.getElementById('restartBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    init = () => {
        this.showScreen('loading');
        this.load();
        if (!this.questions.length) {
            this.fetchQuestions();
        } else {
            this.renderCurrentQuestion();
            this.updateStats();
            this.showScreen('quiz');
        }
        this.bindEvents();
    }

    bindEvents = () => {
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restart());
        this.clearBtn.addEventListener('click', () => this.clearProgress());
    }

    async fetchQuestions() {
        try {
            const res = await fetch(this.apiUrl);
            const data = await res.json();
            if (data.response_code === 0 && data.results) {
                this.questions = data.results;
                this.userAnswers = new Array(this.questions.length).fill(null);
                this.score = this.calculateScore();
                this.save();
                this.renderCurrentQuestion();
                this.updateStats();
                this.showScreen('quiz');
            } else {
                throw new Error('API error');
            }
        } catch (err) {
            console.error(err);
            this.questionTextP.innerText = 'Error loading questions. Please refresh.';
            this.nextBtn.disabled = true;
        }
    }

    calculateScore = () => {
        let correct = 0;
        this.questions.forEach((q, i) => {
            if (this.userAnswers[i] && this.userAnswers[i] === q.correct_answer) correct++;
        });
        return correct;
    }

    save = () => {
        const state = {
            questions: this.questions,
            userAnswers: this.userAnswers,
            currentIndex: this.currentIndex,
            score: this.score
        };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    load = () => {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
            const state = JSON.parse(raw);
            if (state.questions && state.questions.length) {
                this.questions = state.questions;
                this.userAnswers = state.userAnswers || new Array(this.questions.length).fill(null);
                this.currentIndex = state.currentIndex < this.questions.length ? state.currentIndex : 0;
                this.score = state.score ?? this.calculateScore();
            }
        }
    }

    updateStats = () => {
        if (this.questions.length) {
            this.questionCounterSpan.innerText = `Question ${this.currentIndex + 1} / ${this.questions.length}`;
        }
        this.scoreDisplaySpan.innerText = `Score: ${this.score}`;
    }

    renderCurrentQuestion = () => {
        if (!this.questions.length || this.currentIndex >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        const q = this.questions[this.currentIndex];
        const savedAnswer = this.userAnswers[this.currentIndex];
        const renderer = new QuestionRenderer(q, savedAnswer);

        this.categorySpan.innerText = renderer.getCategory();
        this.questionTextP.innerText = renderer.getQuestionText();

        this.answersContainer.innerHTML = '';
        const answersDiv = renderer.renderAnswers((selected) => {
            this.handleAnswer(selected);
        });
        this.answersContainer.appendChild(answersDiv);

        const hasAnswer = this.userAnswers[this.currentIndex] !== null;
        this.nextBtn.disabled = !hasAnswer;
        this.updateStats();
        this.save();
    }

    handleAnswer = (selected) => {
        this.userAnswers[this.currentIndex] = selected;
        this.score = this.calculateScore();
        this.updateStats();
        this.nextBtn.disabled = false;
        this.save();
    }

    nextQuestion = () => {
        if (this.currentIndex + 1 < this.questions.length) {
            this.currentIndex++;
            this.renderCurrentQuestion();
        } else {
            this.finishQuiz();
        }
        this.save();
    }

    finishQuiz = () => {
        this.showScreen('result');
        this.finalScoreSpan.innerText = `${this.score} / ${this.questions.length}`;
        
        let msg = '';
        if (this.score === this.questions.length) msg = 'Perfect! You are a real expert!';
        else if (this.score >= this.questions.length * 0.7) msg = 'Great job! Good knowledge!';
        else if (this.score >= this.questions.length * 0.4) msg = 'Not bad, but you can do better!';
        else msg = 'Try again! Practice makes perfect!';
        
        this.resultMessageDiv.innerText = msg;
    }

    restart = () => {
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.currentIndex = 0;
        this.score = 0;
        this.save();
        this.renderCurrentQuestion();
        this.updateStats();
        this.showScreen('quiz');
    }

    clearProgress = async () => {
        localStorage.removeItem(this.storageKey);
        this.questions = [];
        this.userAnswers = [];
        this.currentIndex = 0;
        this.score = 0;
        this.showScreen('loading');
        await this.fetchQuestions();
    }

    showScreen = (screen) => {
        this.loadingScreen.classList.remove('active');
        this.quizScreen.classList.remove('active');
        this.resultScreen.classList.remove('active');
        
        if (screen === 'loading') this.loadingScreen.classList.add('active');
        if (screen === 'quiz') this.quizScreen.classList.add('active');
        if (screen === 'result') this.resultScreen.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => new QuizApp());