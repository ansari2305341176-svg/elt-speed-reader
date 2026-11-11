
import { useEffect, useState } from "react";
import "./App.css";

const READING_TIME = 30;

const levels = [
  {
    name: "Beginner",
    description: "Build your reading comprehension foundation.",
    questions: [
      {
        passageTitle: "The Sundarbans",
        passage:
          "The Sundarbans is the largest mangrove forest in the world. It is located in the southwestern part of Bangladesh and is famous for the Royal Bengal Tiger. Many rivers and canals flow through this forest. The Sundarbans also protects coastal communities from storms and tidal waves.",
        question: "What is the Sundarbans famous for?",
        options: [
          "The Royal Bengal Tiger",
          "Tea gardens",
          "Mountain ranges",
          "Desert animals",
        ],
        answer: 0,
        explanation:
          "The passage specifically mentions the Royal Bengal Tiger as one of the most famous features of the Sundarbans.",
        tip:
          "Return to the sentence that describes what the Sundarbans is famous for. Look for the specific name mentioned after the words 'famous for'.",
      },
      {
        passageTitle: "The Importance of Trees",
        passage:
          "Trees are essential for maintaining a healthy environment. They absorb carbon dioxide and release oxygen into the atmosphere. Trees also provide shade, fruits and shelter for wildlife. Planting more trees can reduce environmental damage and make cities more comfortable.",
        question: "Which gas do trees absorb?",
        options: [
          "Oxygen",
          "Carbon dioxide",
          "Nitrogen",
          "Hydrogen",
        ],
        answer: 1,
        explanation:
          "The passage states that trees absorb carbon dioxide and release oxygen.",
        tip:
          "Read the sentence about the two gases carefully. The passage describes one gas that trees take in and another that they release. Do not confuse the two actions.",
      },
    ],
  },
  {
    name: "Intermediate",
    description: "Develop deeper understanding and analytical reading.",
    questions: [
      {
        passageTitle: "Digital Education in Bangladesh",
        passage:
          "Digital education has expanded learning opportunities in Bangladesh. Universities increasingly use online platforms to distribute materials and conduct classes. Students can attend lectures without travelling long distances. However, unreliable internet connections and the cost of devices remain serious barriers, particularly in rural communities. Improving digital infrastructure is therefore essential for making online education more inclusive.",
        question: "What is the main obstacle to inclusive digital education?",
        options: [
          "A lack of university subjects",
          "Limited access to reliable internet and devices",
          "Too many printed books",
          "A shortage of online platforms everywhere",
        ],
        answer: 1,
        explanation:
          "The passage identifies unreliable internet and the cost of devices as barriers, especially in rural communities.",
        tip:
          "Pay attention to the sentence beginning with 'However'. It introduces the barriers that make digital education difficult for some communities.",
      },
      {
        passageTitle: "Climate Change and Bangladesh",
        passage:
          "Bangladesh is highly vulnerable to climate change because of its low-lying geography and extensive river systems. Rising sea levels can increase coastal flooding and saltwater intrusion. These changes threaten agriculture, drinking water and the livelihoods of coastal families. Adaptation measures, such as stronger embankments and climate-resilient crops, can help communities respond to these risks.",
        question: "Why is Bangladesh particularly vulnerable to climate change?",
        options: [
          "Its low-lying geography and river systems",
          "Its lack of agricultural land",
          "Its distance from the ocean",
          "Its cold climate throughout the year",
        ],
        answer: 0,
        explanation:
          "The passage links Bangladesh's vulnerability to its low-lying geography and extensive river systems.",
        tip:
          "Revisit the opening sentence. It gives the geographical reasons for Bangladesh's vulnerability. Separate the causes from the later effects.",
      },
    ],
  },
  {
    name: "Advanced",
    description: "Challenge your inference, interpretation and critical reading.",
    questions: [
      {
        passageTitle: "Artificial Intelligence and Employment",
        passage:
          "Artificial intelligence is transforming workplaces by automating repetitive tasks and supporting complex decision-making. Although automation may displace certain jobs, it can also create demand for new skills and occupations. The overall effect on employment will depend partly on how effectively institutions prepare workers for changing labour markets. Investment in education, reskilling and social protection can help societies manage this transition.",
        question: "What is the central argument of the passage?",
        options: [
          "Artificial intelligence will eliminate every occupation.",
          "Automation has no meaningful effect on employment.",
          "Preparing workers is important for managing AI-driven changes.",
          "Only technology companies benefit from artificial intelligence.",
        ],
        answer: 2,
        explanation:
          "The passage presents worker preparation, reskilling and social protection as important ways to manage employment changes caused by AI.",
        tip:
          "For a central-argument question, consider the whole passage. Notice that it discusses both possible job losses and new opportunities, then explains what helps society manage the change.",
      },
      {
        passageTitle: "Economic Growth and Inequality",
        passage:
          "Economic growth is often measured through increases in national output, but this indicator alone cannot reveal how prosperity is distributed. A country may experience rapid growth while large sections of its population remain excluded from its benefits. Access to quality education, healthcare and productive employment influences whether growth improves living standards broadly. Sustainable development therefore requires attention to both economic expansion and social inclusion.",
        question: "What limitation of national output as a measure of progress is highlighted?",
        options: [
          "It measures environmental quality perfectly.",
          "It does not show how economic benefits are distributed.",
          "It directly measures access to healthcare.",
          "It explains every cause of poverty.",
        ],
        answer: 1,
        explanation:
          "National output measures economic activity but does not reveal whether the benefits reach different sections of society.",
        tip:
          "Compare what national output measures with what the passage says it cannot show. The key distinction is between the size of an economy and who benefits from its growth.",
      },
    ],
  },
];

function App() {
  const [phase, setPhase] = useState("reading");
  const [levelIndex, setLevelIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [time, setTime] = useState(READING_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [theme, setTheme] = useState("light");

  const currentLevel = levels[levelIndex];
  const currentQuestion = currentLevel.questions[questionIndex];

  const totalQuestions = 6;

  const completedQuestions =
    levels
      .slice(0, levelIndex)
      .reduce((total, level) => total + level.questions.length, 0) +
    questionIndex;

  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const progress = (completedQuestions / totalQuestions) * 100;
  const remainingProgress = (time / READING_TIME) * 100;

  // Reading timer
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

  // Check the selected answer
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

  // Return to the same passage after a wrong answer
  const rereadPassage = () => {
    setSelectedAnswer(null);
    setTime(READING_TIME);
    setPhase("reading");
  };

  // Move forward only after a correct answer
  const moveToNextQuestion = () => {
    if (!answered || !isCorrect) return;

    if (questionIndex < currentLevel.questions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
    } else if (levelIndex < levels.length - 1) {
      setLevelIndex((previous) => previous + 1);
      setQuestionIndex(0);
    } else {
      setPhase("results");
      return;
    }

    setTime(READING_TIME);
    setSelectedAnswer(null);
    setPhase("reading");
  };

  // Restart the complete challenge
  const restartGame = () => {
    setPhase("reading");
    setLevelIndex(0);
    setQuestionIndex(0);
    setTime(READING_TIME);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
  };

  const toggleTheme = () => {
    setTheme((previous) =>
      previous === "light" ? "blue" : "light"
    );
  };

  return (
    <div className={`app ${theme === "blue" ? "blue-theme" : ""}`}>
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div className="brand">
            <div className="brand-icon">📖</div>
            <div>
              <h1>ELT Speed Reader</h1>
              <p>Read fast. Think smart. Score better.</p>
            </div>
          </div>

          <div className="header-actions">
            <span className="edition-badge">
              🇧🇩 Bangladesh Edition
            </span>

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

          {/* LEVEL AND PROGRESS */}
          {(phase === "reading" || phase === "quiz") && (
            <>
              <section className="level-banner">
                <div>
                  <span className="level-label">
                    LEVEL {levelIndex + 1} OF 3
                  </span>
                  <h2>{currentLevel.name} Level</h2>
                  <p>{currentLevel.description}</p>
                </div>

                <div className="level-count">
                  <strong>
                    {questionIndex + 1}/2
                  </strong>
                  <span>Level questions</span>
                </div>
              </section>

              <section className="overall-progress">
                <div className="overall-progress-label">
                  <span>Overall challenge progress</span>
                  <strong>
                    {completedQuestions}/{totalQuestions} completed
                  </strong>
                </div>

                <div className="progress-track">
                  <div
                    className="overall-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </section>
            </>
          )}

          {/* READING PHASE */}
          {phase === "reading" && (
            <section className="game-card">
              <div className="section-heading">
                <span className="step-label">READ THE PASSAGE</span>

                <span className="status-badge reading-status">
                  Passage {completedQuestions + 1} of {totalQuestions}
                </span>
              </div>

              <h2>Read carefully before answering</h2>

              <p className="section-description">
                Every question has its own passage. You have 30 seconds,
                or you can finish early when you are ready.
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
                    className={`progress-fill ${
                      time <= 10 ? "progress-warning" : ""
                    }`}
                    style={{ width: `${remainingProgress}%` }}
                  />
                </div>

                <div className="timer-feedback">
                  <span>
                    {Math.round(100 - remainingProgress)}% elapsed
                  </span>

                  <span>
                    {time > 20
                      ? "Take your time and understand the passage."
                      : time > 10
                      ? "Keep reading. Focus on important details."
                      : time > 0
                      ? "Almost time! Prepare for the question."
                      : "Reading time is over!"}
                  </span>
                </div>
              </div>

              <article className="passage-box">
                <div className="passage-topline">
                  <span className="passage-category">
                    {currentLevel.name.toUpperCase()} PASSAGE
                  </span>

                  <span className="word-count">
                    Question {completedQuestions + 1}
                  </span>
                </div>

                <h3>{currentQuestion.passageTitle}</h3>

                <p className="passage-text">
                  {currentQuestion.passage}
                </p>
              </article>

              <div className="reading-footer">
                <div className="reading-tip">
                  <span>💡</span>

                  <p>
                    <strong>Reading strategy:</strong> Identify the main
                    idea, supporting details and important keywords.
                    You may need these details to answer correctly.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={finishReading}
                >
                  I Have Finished Reading →
                </button>
              </div>
            </section>
          )}

          {/* QUIZ PHASE */}
          {phase === "quiz" && (
            <section className="game-card">
              <div className="section-heading">
                <span className="step-label">
                  COMPREHENSION TEST
                </span>

                <span className="status-badge quiz-status">
                  1 point for each correct answer
                </span>
              </div>

              <div className="quiz-progress-heading">
                <h2>Answer the question</h2>

                <span>
                  Question {completedQuestions + 1} of {totalQuestions}
                </span>
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <span>⭐ Score</span>
                  <strong>{score}</strong>
                </div>

                <div className="stat-box">
                  <span>🔥 Streak</span>
                  <strong>{streak}</strong>
                </div>

                <div className="stat-box">
                  <span>✅ Correct</span>
                  <strong>{correctCount}</strong>
                </div>
              </div>

              <div className="question-box">
                <span className="question-number">
                  {currentQuestion.passageTitle.toUpperCase()}
                </span>

                <h3>{currentQuestion.question}</h3>

                <div className="options-list">
                  {currentQuestion.options.map((option, index) => {
                    let optionClass = "option-button";

                    // Reveal the correct answer only after a correct selection.
                    if (
                      answered &&
                      isCorrect &&
                      index === currentQuestion.answer
                    ) {
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

                        {answered &&
                          isCorrect &&
                          index === currentQuestion.answer && (
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

                {/* FEEDBACK */}
                {answered && (
                  <div
                    className={`feedback-box ${
                      isCorrect
                        ? "correct-feedback"
                        : "wrong-feedback"
                    }`}
                  >
                    <h4>
                      {isCorrect
                        ? "🎉 Correct! You earned 1 point."
                        : "❌ Not quite. Try using this reading tip."}
                    </h4>

                    {isCorrect ? (
                      <p>{currentQuestion.explanation}</p>
                    ) : (
                      <div className="feedback-tip">
                        <strong>💡 Reading tip</strong>

                        <p>{currentQuestion.tip}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* WRONG ANSWER: RETRY */}
                {answered && !isCorrect && (
                  <button
                    className="primary-button retry-button"
                    onClick={rereadPassage}
                  >
                    ↻ Return to Passage and Read Again
                  </button>
                )}

                {/* CORRECT ANSWER: NEXT */}
                {answered && isCorrect && (
                  <button
                    className="primary-button next-button"
                    onClick={moveToNextQuestion}
                  >
                    {completedQuestions === totalQuestions - 1
                      ? "Complete Challenge →"
                      : questionIndex ===
                          currentLevel.questions.length - 1 &&
                        levelIndex < levels.length - 1
                      ? `Unlock ${levels[levelIndex + 1].name} Level →`
                      : "Continue to Next Passage →"}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* FINAL RESULTS */}
          {phase === "results" && (
            <section className="game-card results-card">
              <div className="result-icon">🏆</div>

              <span className="step-label">
                ALL THREE LEVELS COMPLETED
              </span>

              <h2>Challenge Completed!</h2>

              <p className="section-description">
                You have successfully answered all 6 questions.
              </p>

              <div className="final-score">
                <span>YOUR FINAL SCORE</span>

                <strong>
                  {score} / {totalQuestions}
                </strong>

                <p>
                  {score === totalQuestions
                    ? "Outstanding! You achieved a perfect score!"
                    : score >= 5
                    ? "Excellent performance! Keep sharpening your skills."
                    : score >= 3
                    ? "Good effort! Continue practising."
                    : "You completed the challenge. Keep learning and improving!"}
                </p>
              </div>

              <div className="result-stats">
                <div className="result-stat">
                  <span>Correct answers</span>
                  <strong>{correctCount}</strong>
                </div>

                <div className="result-stat">
                  <span>Passages read</span>
                  <strong>{totalQuestions}</strong>
                </div>

                <div className="result-stat">
                  <span>Best streak</span>
                  <strong>{bestStreak}</strong>
                </div>
              </div>

              <div className="level-results">
                <h3>Challenge completed</h3>

                {levels.map((level, index) => (
                  <div
                    className="level-result-row"
                    key={level.name}
                  >
                    <span>
                      Level {index + 1}: {level.name}
                    </span>

                    <strong>
                      {level.questions.length} / 2 unlocked
                    </strong>
                  </div>
                ))}
              </div>

              <button
                className="primary-button restart-button"
                onClick={restartGame}
              >
                ↻ Start a New Challenge
              </button>
            </section>
          )}
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <p>ELT Speed Reader • Bangladesh Edition</p>
          <span>
            6 passages. 6 questions. 3 difficulty levels.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
