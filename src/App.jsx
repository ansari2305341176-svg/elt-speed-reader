
import { useState, useEffect } from "react";
import "./App.css";

const passage = `Education plays an important role in the development of Bangladesh. Over the past decade, the country has experienced significant changes in its educational system. Digital technology has created new opportunities for students and teachers. Online learning platforms allow students to access educational resources from almost anywhere.

Many universities in Bangladesh are now introducing technology-based learning methods. Students can attend online classes, read digital books and communicate with teachers through various platforms. Artificial Intelligence is also becoming an important tool in modern education.

However, challenges still exist. Many students in rural areas have limited access to reliable internet connections and digital devices. Therefore, improving digital infrastructure is essential to ensure equal educational opportunities.

With proper planning and investment, technology can make education more accessible, effective and inclusive for students across Bangladesh.`;

const questions = [
  {
    type: "Skimming",
    question: "What is the main idea of the passage?",
    options: [
      "The development of transportation",
      "The importance of education and technology in Bangladesh",
      "The history of agriculture",
      "The tourism industry"
    ],
    answer: 1,
    explanation:
      "The passage mainly discusses how technology is transforming education in Bangladesh."
  },
  {
    type: "Scanning",
    question: "Which technology is mentioned in the passage?",
    options: [
      "Artificial Intelligence",
      "Television broadcasting",
      "Radio communication",
      "Printing technology"
    ],
    answer: 0,
    explanation:
      "The passage specifically mentions Artificial Intelligence as an emerging educational tool."
  },
  {
    type: "Scanning",
    question: "What can students access through digital platforms?",
    options: [
      "Only newspapers",
      "Only textbooks",
      "Educational resources",
      "Only entertainment"
    ],
    answer: 2,
    explanation:
      "The first paragraph explains that students can access educational resources online."
  },
  {
    type: "Scanning",
    question: "What is one challenge faced by rural students?",
    options: [
      "Too many universities",
      "Limited internet access and digital devices",
      "Too many digital books",
      "Lack of educational subjects"
    ],
    answer: 1,
    explanation:
      "The third paragraph identifies limited internet connections and digital devices as challenges."
  },
  {
    type: "Skimming",
    question: "What is the author's overall attitude?",
    options: [
      "Completely negative",
      "Optimistic but realistic",
      "Uninterested",
      "Against technology"
    ],
    answer: 1,
    explanation:
      "The author recognizes both the benefits of technology and the challenges that still need to be addressed."
  }
];

function App() {
  const [phase, setPhase] = useState("welcome");
  const [time, setTime] = useState(30);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState([]);

  // 30-second reading countdown
  useEffect(() => {
    if (phase !== "reading") return;

    const timer = setInterval(() => {
      setTime((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Automatically move to questions after 30 seconds
  useEffect(() => {
    if (phase === "reading" && time === 0) {
      setPhase("quiz");
    }
  }, [phase, time]);

  // Start the game
  function startGame() {
    setPhase("reading");
    setTime(30);
  }

  // Check the selected answer
  function submitAnswer(index) {
    if (selected !== null) return;

    setSelected(index);

    const isCorrect = index === questions[current].answer;

    setAnswers((previous) => [
      ...previous,
      {
        question: current,
        selected: index,
        correct: isCorrect
      }
    ]);

    if (isCorrect) {
      setScore((previous) => previous + 10);
      setCorrect((previous) => previous + 1);

      const newStreak = streak + 1;

      setStreak(newStreak);
      setBestStreak((previous) =>
        Math.max(previous, newStreak)
      );
    } else {
      setStreak(0);
    }
  }

  // Move to the next question
  function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent((previous) => previous + 1);
      setSelected(null);
    } else {
      setPhase("result");
    }
  }

  // Restart the complete game
  function restartGame() {
    setPhase("welcome");
    setTime(30);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
  }

  const question = questions[current];

  const accuracy = Math.round(
    (correct / questions.length) * 100
  );

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">📖</div>

          <div>
            <h2>ELT Speed Reader</h2>
            <span>Skimming & Scanning Challenge</span>
          </div>
        </div>

        <div className="header-badge">
          🇧🇩 Bangladesh Edition
        </div>
      </header>

      <main className="container">

        {/* GAME STATISTICS */}
        <div className="stats">

          <div className="stat-card">
            <div className="stat-icon purple">⭐</div>

            <div>
              <span>Total Score</span>
              <h2>{score}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">🎯</div>

            <div>
              <span>Difficulty</span>
              <h2>Easy</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">🔥</div>

            <div>
              <span>Streak</span>
              <h2>{streak}</h2>
            </div>
          </div>

        </div>

        {/* WELCOME SCREEN */}
        {phase === "welcome" && (
          <section className="welcome card">

            <div className="welcome-icon">🚀</div>

            <span className="eyebrow">
              INTERACTIVE ELT TOOLKIT
            </span>

            <h1>Challenge Your Reading Speed!</h1>

            <p>
              Improve your English reading skills through
              an exciting skimming and scanning challenge.
            </p>

            <div className="feature-row">
              <div>⏱️ 30 Seconds</div>
              <div>📝 5 Questions</div>
              <div>🏆 50 Points</div>
            </div>

            <button
              className="primary-btn"
              onClick={startGame}
            >
              Start Challenge →
            </button>

            <p className="small-note">
              Designed for Bangladeshi University Students
            </p>

          </section>
        )}

        {/* READING PHASE */}
        {phase === "reading" && (
          <section className="card reading-section">

            <div className="section-heading">

              <div>
                <span className="eyebrow">PHASE 01</span>
                <h2>📚 Reading Time</h2>
              </div>

              <div className={`timer ${
                time <= 10 ? "urgent" : ""
              }`}>
                <span>TIME LEFT</span>

                <strong>
                  00:{String(time).padStart(2, "0")}
                </strong>
              </div>

            </div>

            <div className="timer-track">
              <div
                className="timer-fill"
                style={{
                  width: `${(time / 30) * 100}%`
                }}
              />
            </div>

            <div className="reading-instruction">
              💡 Read the passage carefully. Questions will
              appear automatically after 30 seconds.
            </div>

            <div className="passage-box">

              <h3>
                Education and Digital Transformation in Bangladesh
              </h3>

              <p>{passage}</p>

            </div>

            <div className="reading-footer">
              <span>
                🔒 Questions are locked during reading
              </span>

              <span>
                {time} seconds remaining
              </span>
            </div>

          </section>
        )}

        {/* QUIZ PHASE */}
        {phase === "quiz" && (
          <section className="quiz-section">

            <div className="quiz-top">

              <div>
                <span className="eyebrow">PHASE 02</span>
                <h2>🧠 Test Your Understanding</h2>
              </div>

              <div className="question-number">
                {current + 1} / {questions.length}
              </div>

            </div>

            <div className="question-progress">
              <div
                style={{
                  width: `${
                    ((current + 1) / questions.length) * 100
                  }%`
                }}
              />
            </div>

            <div className="card question-card">

              <div className="question-meta">

                <span className="tag">
                  {question.type}
                </span>

                <span className="points">
                  +10 POINTS
                </span>

              </div>

              <h3>{question.question}</h3>

              <div className="options">

                {question.options.map((option, index) => {

                  const isCorrect =
                    index === question.answer;

                  const isSelected =
                    selected === index;

                  let optionClass = "option";

                  if (selected !== null && isCorrect) {
                    optionClass += " correct";
                  } else if (
                    isSelected && !isCorrect
                  ) {
                    optionClass += " wrong";
                  }

                  return (
                    <button
                      key={index}
                      className={optionClass}
                      onClick={() => submitAnswer(index)}
                      disabled={selected !== null}
                    >

                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span>{option}</span>

                      <span className="option-mark">
                        {selected !== null && isCorrect
                          ? "✓"
                          : isSelected && !isCorrect
                          ? "✕"
                          : ""}
                      </span>

                    </button>
                  );
                })}

              </div>

              {/* INSTANT FEEDBACK */}
              {selected !== null && (
                <div
                  className={`feedback ${
                    selected === question.answer
                      ? "success"
                      : "error"
                  }`}
                >

                  <h3>
                    {selected === question.answer
                      ? "🎉 Excellent! Correct Answer!"
                      : "❌ Not Quite Right!"}
                  </h3>

                  <p>
                    {selected === question.answer
                      ? "You earned 10 points. Keep going!"
                      : `Correct answer: ${
                          question.options[question.answer]
                        }`}
                  </p>

                  <div className="explanation">
                    <strong>Explanation:</strong>{" "}
                    {question.explanation}
                  </div>

                </div>
              )}

              <div className="question-footer">

                <span>
                  {selected === null
                    ? "Select the correct answer"
                    : "Answer submitted"}
                </span>

                {selected !== null && (
                  <button
                    className="primary-btn"
                    onClick={nextQuestion}
                  >
                    {current === questions.length - 1
                      ? "View Results →"
                      : "Next Question →"}
                  </button>
                )}

              </div>

            </div>

          </section>
        )}

        {/* RESULT SCREEN */}
        {phase === "result" && (
          <section className="card result-section">

            <div className="result-icon">🏆</div>

            <span className="eyebrow">
              CHALLENGE COMPLETED
            </span>

            <h1>
              {accuracy >= 80
                ? "Outstanding Performance!"
                : accuracy >= 60
                ? "Great Job!"
                : accuracy >= 40
                ? "Good Effort!"
                : "Keep Practicing!"}
            </h1>

            <p className="result-subtitle">
              You have completed the ELT Speed Reading Challenge.
            </p>

            <div className="score-circle">

              <strong>{score}</strong>

              <span>OUT OF 50</span>

            </div>

            <div className="result-stats">

              <div>
                <strong>{correct}/5</strong>
                <span>Correct Answers</span>
              </div>

              <div>
                <strong>{accuracy}%</strong>
                <span>Accuracy</span>
              </div>

              <div>
                <strong>{bestStreak}</strong>
                <span>Best Streak</span>
              </div>

            </div>

            <div className="review">

              <h3>📋 Answer Summary</h3>

              {questions.map((q, index) => {

                const result = answers.find(
                  (item) => item.question === index
                );

                return (
                  <div
                    className="review-row"
                    key={index}
                  >

                    <span>
                      Q{index + 1}. {q.type}
                    </span>

                    <strong
                      className={
                        result?.correct
                          ? "green-text"
                          : "red-text"
                      }
                    >
                      {result?.correct
                        ? "✓ Correct"
                        : "✕ Incorrect"}
                    </strong>

                  </div>
                );
              })}

            </div>

            <button
              className="primary-btn"
              onClick={restartGame}
            >
              ↻ Play Again
            </button>

          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer>
        <strong>ELT Speed Reader</strong>

        <p>
          Interactive English Learning Toolkit | Bangladesh Edition
        </p>

        <span>
          © 2026 All Rights Reserved
        </span>
      </footer>

    </div>
  );
}

export default App;
