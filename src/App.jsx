
import { useEffect, useState } from "react";
import "./App.css";

const READING_TIME = 30;

const questions = [
  {
    question: "What is the main topic of the passage?",
    options: [
      "The history of Bangladesh",
      "Digital education in Bangladesh",
      "The development of agriculture",
      "Online shopping",
    ],
    answer: 1,
    explanation:
      "The passage mainly discusses the progress and challenges of digital education in Bangladesh.",
  },
  {
    question: "What are many universities using?",
    options: [
      "Online platforms",
      "Printed newspapers",
      "Radio programmes",
      "Traditional libraries only",
    ],
    answer: 0,
    explanation:
      "The passage says that many universities use online platforms to conduct classes and share learning materials.",
  },
  {
    question: "What can students access through digital education?",
    options: [
      "Only classroom lectures",
      "Free transportation",
      "Digital books and virtual lectures",
      "Government jobs",
    ],
    answer: 2,
    explanation:
      "Students can access digital books, attend virtual lectures and communicate with teachers.",
  },
  {
    question: "What challenge do rural students face?",
    options: [
      "A lack of teachers everywhere",
      "Limited internet access",
      "Too many online classes",
      "A lack of digital books",
    ],
    answer: 1,
    explanation:
      "The passage identifies limited internet access as a major challenge for rural students.",
  },
  {
    question: "What could make digital education more accessible?",
    options: [
      "Reducing school hours",
      "Closing online platforms",
      "Improving infrastructure",
      "Removing digital books",
    ],
    answer: 2,
    explanation:
      "Better infrastructure can improve access to digital education for everyone.",
  },
];

function App() {
  const [phase, setPhase] = useState("reading");
  const [time, setTime] = useState(READING_TIME);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [theme, setTheme] = useState("light");

  const currentQuestion = questions[questionIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQuestion?.answer;
  const progress = ((READING_TIME - time) / READING_TIME) * 100;
  const remainingProgress = (time / READING_TIME) * 100;

  // Countdown timer. When it reaches zero, the quiz starts automatically.
  useEffect(() => {
    if (phase !== "reading") return;

    if (time <= 0) {
      setPhase("quiz");
      return;
    }

    const timer = setTimeout(() => {
      setTime((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, time]);

  const finishReading = () => {
    setPhase("quiz");
  };

  const handleAnswer = (answerIndex) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);

    if (answerIndex === currentQuestion.answer) {
      setScore((previous) => previous + 1);
      setCorrectCount((previous) => previous + 1);
      setStreak((previous) => {
        const newStreak = previous + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      setPhase("results");
    } else {
      setQuestionIndex((previous) => previous + 1);
      setSelectedAnswer(null);
    }
  };

  const restartGame = () => {
    setPhase("reading");
    setTime(READING_TIME);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
  };

  const toggleTheme = () => {
    setTheme((previous) => (previous === "light" ? "blue" : "light"));
  };

  return (
    <div className={`app ${theme === "blue" ? "blue-theme" : ""}`}>
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">📖</div>
            <div>
              <h1>ELT Speed Reader</h1>
              <p>Read fast. Think smart. Score better.</p>
            </div>
          </div>

          <div className="header-actions">
            <span className="edition-badge">🇧🇩 Bangladesh Edition</span>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Switch colour theme"
            >
              {theme === "light" ? "🔵 Blue Mode" : "☀️ White Mode"}
            </button>
          </div>
        </header>

        <main>
          {phase === "reading" && (
            <section className="game-card">
              <div className="section-heading">
                <span className="step-label">STEP 1 OF 2</span>
                <span className="status-badge reading-status">Reading time</span>
              </div>

              <h2>Read the passage carefully</h2>
              <p className="section-description">
                You have 30 seconds. Finished early? Start the questions whenever
                you are ready.
              </p>

              <div className="timer-panel">
                <div className="timer-information">
                  <span>⏱️ Time remaining</span>
                  <strong className={time <= 10 ? "time-warning" : ""}>
                    {time}s
                  </strong>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label="Reading time remaining"
                  aria-valuemin="0"
                  aria-valuemax="30"
                  aria-valuenow={time}
                >
                  <div
                    className={`progress-fill ${time <= 10 ? "progress-warning" : ""}`}
                    style={{ width: `${remainingProgress}%` }}
                  />
                </div>

                <div className="timer-feedback">
                  <span>{Math.round(progress)}% elapsed</span>
                  <span>
                    {time > 20
                      ? "Plenty of time — keep reading!"
                      : time > 10
                      ? "Good progress — stay focused!"
                      : time > 0
                      ? "Almost time! Get ready for the quiz."
                      : "Reading time is over!"}
                  </span>
                </div>
              </div>

              <article className="passage-box">
                <div className="passage-topline">
                  <span className="passage-category">EDUCATION</span>
                  <span className="word-count">Short passage</span>
                </div>

                <h3>Digital Education in Bangladesh</h3>

                <p className="passage-text">
                  Bangladesh has made significant progress in digital education.
                  Many universities now use online platforms to conduct classes
                  and share learning materials. Students can access digital
                  books, attend virtual lectures and communicate with teachers.
                  However, rural students still face challenges due to limited
                  internet access. Better infrastructure can make education more
                  accessible to everyone.
                </p>
              </article>

              <div className="reading-footer">
                <div className="reading-tip">
                  <span>💡</span>
                  <p>
                    <strong>Tip:</strong> Focus on the main idea and important
                    details. You do not need to memorize every word.
                  </p>
                </div>

                <button className="primary-button finish-button" onClick={finishReading}>
                  I Have Finished Reading →
                </button>
              </div>
            </section>
          )}

          {phase === "quiz" && (
            <section className="game-card">
              <div className="section-heading">
                <span className="step-label">STEP 2 OF 2</span>
                <span className="status-badge quiz-status">Quiz time</span>
              </div>

              <div className="quiz-progress-heading">
                <h2>Test your understanding</h2>
                <span>
                  Question {questionIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="question-progress-track">
                <div
                  className="question-progress-fill"
                  style={{
                    width: `${((questionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <span>⭐ Score</span>
                  <strong>{score}</strong>
                </div>
                <div className="stat-box">
                  <span>🔥 Current streak</span>
                  <strong>{streak}</strong>
                </div>
                <div className="stat-box">
                  <span>✅ Correct</span>
                  <strong>{correctCount}/{questions.length}</strong>
                </div>
              </div>

              <div className="question-box">
                <span className="question-number">
                  QUESTION {questionIndex + 1}
                </span>
                <h3>{currentQuestion.question}</h3>

                <div className="options-list">
                  {currentQuestion.options.map((option, index) => {
                    let optionClass = "option-button";

                    if (answered && index === currentQuestion.answer) {
                      optionClass += " correct-option";
                    } else if (
                      answered &&
                      index === selectedAnswer &&
                      !isCorrect
                    ) {
                      optionClass += " wrong-option";
                    }

                    return (
                      <button
                        key={index}
                        className={optionClass}
                        onClick={() => handleAnswer(index)}
                        disabled={answered}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                        {answered && index === currentQuestion.answer && (
                          <span className="option-mark">✓</span>
                        )}
                        {answered &&
                          index === selectedAnswer &&
                          !isCorrect && (
                            <span className="option-mark">✕</span>
                          )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div
                    className={`feedback-box ${isCorrect ? "correct-feedback" : "wrong-feedback"}`}
                  >
                    <h4>
                      {isCorrect
                        ? "🎉 Correct! You earned 1 point."
                        : "❌ Not quite right. No point this time."}
                    </h4>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                {answered && (
                  <button className="primary-button next-button" onClick={nextQuestion}>
                    {questionIndex === questions.length - 1
                      ? "View My Results →"
                      : "Next Question →"}
                  </button>
                )}
              </div>
            </section>
          )}

          {phase === "results" && (
            <section className="game-card results-card">
              <div className="result-icon">🏆</div>
              <span className="step-label">CHALLENGE COMPLETED</span>
              <h2>Your reading results</h2>
              <p className="section-description">
                Great effort! Here is your performance summary.
              </p>

              <div className="final-score">
                <span>YOUR FINAL SCORE</span>
                <strong>{score} / {questions.length}</strong>
                <p>
                  {score === 5
                    ? "Excellent! Perfect performance!"
                    : score >= 3
                    ? "Well done! Keep practising."
                    : "Keep learning. You will improve with practice!"}
                </p>
              </div>

              <div className="result-stats">
                <div className="result-stat">
                  <span>✅ Correct answers</span>
                  <strong>{correctCount}</strong>
                </div>
                <div className="result-stat">
                  <span>❌ Incorrect answers</span>
                  <strong>{questions.length - correctCount}</strong>
                </div>
                <div className="result-stat">
                  <span>🔥 Best streak</span>
                  <strong>{bestStreak}</strong>
                </div>
              </div>

              <button className="primary-button restart-button" onClick={restartGame}>
                ↻ Play Again
              </button>
            </section>
          )}
        </main>

        <footer className="footer">
          <p>ELT Speed Reader • Bangladesh Edition</p>
          <span>Improve your reading speed and comprehension.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
