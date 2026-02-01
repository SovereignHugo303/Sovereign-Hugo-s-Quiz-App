// Quiz Data
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Silver", "Iron"],
        correct: 1
    },
    {
        question: "What year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: 1
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "Thailand", "South Korea"],
        correct: 1
    },
    {
        question: "What is the square root of 16?",
        options: ["2", "4", "6", "8"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    }
];

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreDisplay = document.getElementById('score-display');
const answersReview = document.getElementById('answers-review');

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let shuffledQuestions = [];
let userAnswers = [];

// Initialize Quiz
function initQuiz() {
    shuffledQuestions = shuffleArray([...questions]);
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    userAnswers = [];
    totalQuestionsSpan.textContent = shuffledQuestions.length;
    showScreen(introScreen);
}

// Shuffle Array Utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Screen Management
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Display Question
function displayQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);
        optionElement.addEventListener('click', selectOption);
        optionElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption.call(optionElement, e);
            }
        });
        optionElement.tabIndex = 0;
        optionsContainer.appendChild(optionElement);
    });

    selectedAnswer = null;
    nextBtn.disabled = true;
    updateButtons();
}

// Select Option
function selectOption(e) {
    const optionElements = document.querySelectorAll('.option');
    optionElements.forEach(opt => opt.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    selectedAnswer = parseInt(e.currentTarget.getAttribute('data-index'));
    nextBtn.disabled = false;
}

// Update Buttons
function updateButtons() {
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Next Question
function nextQuestion() {
    if (selectedAnswer !== null) {
        userAnswers.push(selectedAnswer);
        if (selectedAnswer === shuffledQuestions[currentQuestionIndex].correct) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }
}

// Submit Quiz
function submitQuiz() {
    if (selectedAnswer !== null) {
        userAnswers.push(selectedAnswer);
        if (selectedAnswer === shuffledQuestions[currentQuestionIndex].correct) {
            score++;
        }
        showResults();
    }
}

// Show Results
function showResults() {
    scoreDisplay.textContent = `Your Score: ${score} out of ${shuffledQuestions.length}`;

    answersReview.innerHTML = '';
    shuffledQuestions.forEach((question, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = `answer-item ${userAnswers[index] === question.correct ? 'correct' : 'incorrect'}`;
        answerItem.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${question.question}<br>
            <strong>Your Answer:</strong> ${question.options[userAnswers[index]]}<br>
            <strong>Correct Answer:</strong> ${question.options[question.correct]}
        `;
        answersReview.appendChild(answerItem);
    });

    showScreen(resultsScreen);
}

// Event Listeners
startBtn.addEventListener('click', () => {
    showScreen(quizScreen);
    displayQuestion();
});

nextBtn.addEventListener('click', nextQuestion);

submitBtn.addEventListener('click', submitQuiz);

restartBtn.addEventListener('click', initQuiz);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (quizScreen.classList.contains('active')) {
            if (!nextBtn.disabled && nextBtn.style.display !== 'none') {
                nextQuestion();
            } else if (submitBtn.style.display !== 'none') {
                submitQuiz();
            }
        } else if (resultsScreen.classList.contains('active')) {
            initQuiz();
        }
    }
});

// Initialize on load
initQuiz();
