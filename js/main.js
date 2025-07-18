// lógica javascript para página index

document.addEventListener('DOMContentLoaded', function () {
    // --- Módulo 1 ---
    const pieces = document.querySelectorAll('.data-piece');
    const dropZone = document.getElementById('data-drop-zone');
    const resultCard = document.getElementById('info-card-result');
    const piecesContainer = document.getElementById('data-pieces-container');
    let droppedCount = 0;

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.dataset.piece);
            setTimeout(() => piece.style.opacity = '0.5', 0);
        });
        piece.addEventListener('dragend', () => {
            piece.style.opacity = '1';
        });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('hovered');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('hovered');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('hovered');
        const pieceId = e.dataTransfer.getData('text/plain');
        const droppedPiece = document.querySelector(`.data-piece[data-piece='${pieceId}']`);

        if (droppedPiece) {
            droppedPiece.style.display = 'none';
            droppedCount++;
            if (droppedCount === pieces.length) {
                dropZone.style.display = 'none';
                resultCard.classList.add('visible');
            }
        }
    });

    // --- Módulo 2 ---
    const cabinetBtns = document.querySelectorAll('.db-cabinet-btn');
    cabinetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const targetCabinet = document.getElementById(targetId);
            const allCabinets = document.querySelectorAll('[id^="cabinet-"]');

            allCabinets.forEach(cab => {
                if (cab.id !== targetId) {
                    cab.classList.add('hidden');
                }
            });

            targetCabinet.classList.toggle('hidden');
        });
    });

    // --- Módulo 3 ---
    const highlightRowBtn = document.getElementById('highlight-row-btn');
    const highlightColBtn = document.getElementById('highlight-col-btn');
    const targetRow = document.getElementById('target-row');
    const table = document.querySelector('.interactive-table');

    highlightRowBtn.addEventListener('click', () => {
        targetRow.classList.toggle('highlight-row');
    });

    highlightColBtn.addEventListener('click', () => {
        table.querySelectorAll(`td:nth-child(2), th:nth-child(2)`).forEach(cell => {
            cell.classList.toggle('highlight-col');
        });
    });

    // --- Módulo 4 ---
    const connectBtn = document.getElementById('connect-btn');
    const relationLine = document.getElementById('relation-line');
    const relationText = document.getElementById('relation-text');

    connectBtn.addEventListener('click', () => {
        if (relationLine.classList.contains('visible')) {
            relationLine.classList.remove('visible');
            relationText.style.opacity = '0';
            connectBtn.textContent = 'Conectar';
        } else {
            relationLine.classList.add('visible');
            setTimeout(() => {
                relationText.style.opacity = '1';
            }, 300);
            connectBtn.textContent = 'Desconectar';
        }
    });
});

// logica javascript para quiz.html

document.addEventListener('DOMContentLoaded', function () {
    const quizData = [
        {
            question: "¿Cuál es la función principal de un Sistema Gestor de Bases de Datos (SGBD)?",
            options: ["Crear diseños gráficos", "Escribir documentos de texto", "Gestionar e interactuar con una base de datos", "Navegar por internet"],
            correctAnswer: 2
        },
        {
            question: "En una base de datos relacional, los datos se organizan principalmente en...",
            options: ["Archivos de audio", "Carpetas y subcarpetas", "Tablas con filas y columnas", "Presentaciones de diapositivas"],
            correctAnswer: 2
        },
        {
            question: "Una 'fila' o 'registro' en una tabla de base de datos representa...",
            options: ["Un único elemento (ej: un estudiante específico)", "Una característica o atributo (ej: 'Nombre')", "El nombre de la tabla", "La conexión a la base de datos"],
            correctAnswer: 0
        },
        {
            question: "¿Qué es un Diagrama Entidad-Relación (ERD)?",
            options: ["Una hoja de cálculo", "Una interfaz de usuario", "Una representación conceptual y visual de la base de datos", "Un archivo de configuración del servidor"],
            correctAnswer: 2
        }
    ];

    let currentQuestionIndex = 0;
    let userScore = 0;
    let selectedOption = null;

    const quizContainer = document.getElementById('quiz-container');
    const loaderContainer = document.getElementById('loader-container');
    const resultsContainer = document.getElementById('results-container');

    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress-bar');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');

    // --- Funciones Principales ---

    function loadQuestion() {
        selectedOption = null;
        const currentQuestion = quizData[currentQuestionIndex];

        // Actualizar progreso
        questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizData.length}`;
        progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;

        // Mostrar pregunta y opciones
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn', 'p-4', 'rounded-lg', 'text-lg', 'text-left');
            button.dataset.index = index;
            button.addEventListener('click', handleOptionSelect);
            optionsContainer.appendChild(button);
        });

        // Actualizar texto del botón "Siguiente"
        if (currentQuestionIndex === quizData.length - 1) {
            nextBtn.textContent = 'Ver Resultados';
        } else {
            nextBtn.textContent = 'Siguiente Pregunta';
        }
        nextBtn.classList.add('hidden');
    }

    /** Maneja la selección de una opción */
    function handleOptionSelect(event) {
        Array.from(optionsContainer.children).forEach(btn => {
            btn.classList.remove('selected');
        });

        const clickedButton = event.target;
        clickedButton.classList.add('selected');
        selectedOption = parseInt(clickedButton.dataset.index);

        // Mostrar el botón "Siguiente"
        nextBtn.classList.remove('hidden');
    }

    /** Maneja el clic en el botón "Siguiente" */
    function handleNextClick() {

        if (selectedOption === quizData[currentQuestionIndex].correctAnswer) {
            userScore++;
        }

        currentQuestionIndex++;

        // Mostrar animación de carga y luego la siguiente pregunta o resultados
        quizContainer.classList.add('fade-out');

        setTimeout(() => {
            quizContainer.classList.add('hidden');
            quizContainer.classList.remove('fade-out');
            loaderContainer.classList.remove('hidden');

            setTimeout(() => {
                loaderContainer.classList.add('hidden');
                if (currentQuestionIndex < quizData.length) {
                    quizContainer.classList.remove('hidden');
                    quizContainer.classList.add('fade-in');
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 1000);
        }, 500);
    }

    /** Muestra la pantalla de resultados finales */
    function showResults() {
        resultsContainer.classList.remove('hidden');

        const resultTitle = document.getElementById('result-title');
        const resultScore = document.getElementById('result-score');
        const resultMessage = document.getElementById('result-message');

        resultScore.textContent = `${userScore}/${quizData.length}`;

        if (userScore === quizData.length) {
            resultTitle.textContent = '¡Felicidades, eres un experto!';
            resultMessage.textContent = 'Has acertado todas las preguntas. ¡Dominas los conceptos básicos!';
        } else if (userScore >= quizData.length / 2) {
            resultTitle.textContent = '¡Muy bien hecho!';
            resultMessage.textContent = `Un gran puntaje. Tienes una base sólida para seguir construyendo.`;
        } else {
            resultTitle.textContent = '¡Buen intento!';
            resultMessage.textContent = 'No te preocupes, la práctica hace al maestro. ¡Inténtalo de nuevo!';
        }
    }

    // --- Inicialización ---
    nextBtn.addEventListener('click', handleNextClick);
    loadQuestion();
});