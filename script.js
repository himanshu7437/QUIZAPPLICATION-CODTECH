// Variables
const questions = [
    // Existing Questions
    {
        question: "What is the capital of France?",
        hint: "It's also known as the city of love.",
        answers: [
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Paris", correct: true },
            { text: "Lisbon", correct: false }
        ]
    },
    {
        question: "The Earth is flat.",
        hint: "Think about what you've learned in geography.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true }
        ]
    },
    {
        question: "Who wrote 'Hamlet'?",
        hint: "He is also known for 'Romeo and Juliet'.",
        answers: [
            { text: "Charles Dickens", correct: false },
            { text: "William Shakespeare", correct: true },
            { text: "Mark Twain", correct: false },
            { text: "Jane Austen", correct: false }
        ]
    },
    {
        question: "What is the smallest planet in our solar system?",
        hint: "It's named after the Roman messenger god.",
        answers: [
            { text: "Venus", correct: false },
            { text: "Earth", correct: false },
            { text: "Mercury", correct: true },
            { text: "Mars", correct: false }
        ]
    },
    {
        question: "What gas do plants need for photosynthesis?",
        hint: "It's the same gas that we exhale.",
        answers: [
            { text: "Oxygen", correct: false },
            { text: "Hydrogen", correct: false },
            { text: "Carbon Dioxide", correct: true },
            { text: "Nitrogen", correct: false }
        ]
    },
    // New Science Questions
    {
        question: "What is the chemical symbol for Gold?",
        hint: "It starts with the letter 'A'.",
        answers: [
            { text: "Ag", correct: false },
            { text: "Au", correct: true },
            { text: "Pb", correct: false },
            { text: "Fe", correct: false }
        ]
    },
    {
        question: "What planet is known as the Red Planet?",
        hint: "It's the fourth planet from the Sun.",
        answers: [
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
            { text: "Venus", correct: false }
        ]
    },
    {
        question: "Which organ in the human body is responsible for pumping blood?",
        hint: "It's located in the chest.",
        answers: [
            { text: "Lungs", correct: false },
            { text: "Liver", correct: false },
            { text: "Heart", correct: true },
            { text: "Kidney", correct: false }
        ]
    },
    {
        question: "What is the powerhouse of the cell?",
        hint: "It generates the energy needed for cell functions.",
        answers: [
            { text: "Nucleus", correct: false },
            { text: "Mitochondria", correct: true },
            { text: "Ribosome", correct: false },
            { text: "Endoplasmic Reticulum", correct: false }
        ]
    },
    {
        question: "What is the most abundant gas in Earth's atmosphere?",
        hint: "It's essential for respiration and combustion.",
        answers: [
            { text: "Oxygen", correct: false },
            { text: "Carbon Dioxide", correct: false },
            { text: "Nitrogen", correct: true },
            { text: "Argon", correct: false }
        ]
    }
];

const nameForm = document.getElementById('start-form');
const nameInput = document.getElementById('name-input');
const quizContainer = document.getElementById('quiz-container');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const hintElement = document.getElementById('hint-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress');
const leaderboardElement = document.getElementById('leaderboard');
const timerElement = document.getElementById('time-left');

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 30; // Time limit in seconds
let userName = '';

// Event Listeners
nameForm.addEventListener('submit', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setNextQuestion();
    } else {
        showResults();
    }
});
restartButton.addEventListener('click', restartQuiz);

// Functions
function startQuiz(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    userName = nameInput.value.trim();
    if (userName === '') {
        alert('Please enter your name to start the quiz.');
        return;
    }

    // Hide the name form and show the quiz container
    nameForm.classList.add('hidden');
    quizContainer.classList.remove('hidden');

    score = 0;
    currentQuestionIndex = 0;
    resultsContainer.classList.add('hidden');
    questionContainerElement.classList.remove('hidden');
    setNextQuestion();
    updateProgressBar();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
    updateProgressBar();
    startTimer();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    hintElement.innerText = question.hint;
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

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    clearInterval(timer);
    timerElement.textContent = timeLimit;
    timerElement.parentElement.classList.remove('red'); // Ensure timer color is reset
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('wrong');
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    nextButton.classList.remove('hidden');
    clearInterval(timer); // Stop the timer when an answer is selected
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    scoreElement.innerText = `${userName}, you scored ${score} out of ${questions.length}`;
    updateLeaderboard();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: userName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard(leaderboard);
}

function renderLeaderboard(leaderboard) {
    leaderboardElement.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(li);
    });
}

function startTimer() {
    let timeLeft = timeLimit;
    timerElement.textContent = timeLeft;
    timerElement.parentElement.classList.remove('red'); // Ensure timer color is reset
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 10) {
            timerElement.parentElement.classList.add('red');
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    alert('Time is up! Submitting the quiz.');
    selectAnswer({ target: null }); // Simulate answer selection to end quiz
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function restartQuiz() {
    resultsContainer.classList.add('hidden');
    nameForm.classList.remove('hidden');
    quizContainer.classList.add('hidden');
    nameInput.value = ''; // Clear the name input field
    progressBar.style.width = '0%'; // Reset the progress bar
}
