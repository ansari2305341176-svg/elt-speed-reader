
import { useState, useEffect } from "react";
import "./App.css";

const questions = [
  {
    question: "What is the main idea of the passage?",
    options: [
      "The development of transportation",
      "The importance of education in Bangladesh",
      "The history of agriculture",
      "The tourism industry"
    ],
    answer: 1,
    type: "Skimming"
  },
  {
    question: "Which technology is mentioned in the passage?",
    options: ["Artificial Intelligence", "Television", "Radio", "Printing press"],
    answer: 0,
    type: "Scanning"
  },
  {
    question: "What can students access through digital platforms?",
    options: [
      "Only newspapers",
      "Only textbooks",
      "Educational resources",
      "Only entertainment"
    ],
    answer: 2,
    type: "Scanning"
  },
  {
    question: "What is one challenge mentioned in the passage?",
    options: [
      "Lack of internet access in some areas",
      "Too many universities",
      "Lack of teachers everywhere",
      "No educational institutions"
    ],
    answer: 0,
    type: "Scanning"
  },
  {
    question: "What is the author's overall attitude?",
    options: [
      "Completely negative",
      "Optimistic but realistic",
      "Uninterested",
      "Critical of all technology"
    ],
    answer: 1,
    type: "Skimming"
  }
];

const passage = `Education plays an important role in the development of Bangladesh. 
Over the past decade, the country has experienced significant changes in its 
educational system. Digital technology has created new opportunities for students 
and teachers. Online learning platforms allow students to access educational 
resources from almost anywhere.

Many universities in Bangladesh are now introducing technology-based learning 
methods. Students can attend online classes, read digital books and communicate 
with teachers through various platforms. Artificial Intelligence is also becoming 
an important tool in modern education.

However, challenges still exist. Many students in rural areas have limited access 
to reliable internet connections and digital devices. Therefore, improving digital 
infrastructure is essential to ensure equal educational opportunities.

With proper planning and investment, technology can make education more 
accessible, effective and inclusive for students across Bangladesh.`;

function App() {
  const [started, setStarted] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(90);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    if (time <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, time]);

  function startGame() {
    setStarted(true);
    setShowNotice(false);
  }

  function chooseAnswer(index) {
    if (selected !== null) return;

    setSelected(index);

    if (index === questions[current].answer) {
      setScore((s) => s + 10);
    }
  }

  function nextQuestion() {
    if (current === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function restartGame() {
    setStarted(false);
    setShowNotice(true);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(90);
    setFinished(false);
  }

  const q = questions[current];

  return (
    <div className="app">

      <header className="navbar">
        <h2>📖 ELT Speed Reader</h2>
        <span>Skimming & Scanning Challenge</span>
      </header>

      <main className="container">

        <div className="stats">
          <div className="stat-card">
            <span>⭐ Score</span>
            <h2>{score}</h2>
          </div>

          <div className="stat-card">
            <span>📊 Level</span>
            <h2>Easy</h2>
          </div>

          <div className="stat-card">
            <span>⏱️ Time</span>
            <h2>{time}s</h2>
          </div>
        </div>

        {!started && !finished && (
          <section className="welcome card">
            <h1>Welcome to ELT Speed Reader!</h1>
            <p>
              Test your reading skills with this interactive
              skimming and scanning challenge.
            </p>
            <button onClick={() => setShowNotice(true)}>
              Start Challenge
            </button>
          </section>
        )}

        {started && !finished && (
          <>
            <div className="progress">
              <div
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`
                }}
              ></div>
            </div>

            <p className="question-count">
              Question {current + 1} of {questions.length}
            </p>

            <section className="card passage">
              <h2>📚 Reading Passage</h2>
              <p>{passage}</p>
            </section>

            <section className="card question-card">
              <span className="tag">{q.type}</span>

              <h3>{q.question}</h3>

              <div className="options">
                {q.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option ${
                      selected === index ? "selected" : ""
                    } ${
                      selected !== null && index === q.answer
                        ? "correct"
                        : ""
                    } ${
                      selected === index && index !== q.answer
                        ? "wrong"
                        : ""
                    }`}
                    onClick={() => chooseAnswer(index)}
                    disabled={selected !== null}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>

              {selected !== null && (
                <p className="feedback">
                  {selected === q.answer
                    ? "🎉 Correct answer! +10 points"
                    : "❌ Incorrect! The correct answer is " +
                      q.options[q.answer]}
                </p>
              )}

              {selected !== null && (
                <button className="next-btn" onClick={nextQuestion}>
                  {current === questions.length - 1
                    ? "See Results"
                    : "Next Question →"}
                </button>
              )}
            </section>
          </>
        )}

        {finished && (
          <section className="card result">
            <h1>🏆 Challenge Completed!</h1>
            <h2>{score} / 50</h2>
            <p>
              You answered {score / 10} out of 5 questions correctly.
            </p>
            <h3>
              {score >= 40
                ? "Excellent Work!"
                : score >= 20
                ? "Good Effort! Keep Practicing."
                : "Keep Learning and Try Again!"}
            </h3>
            <button onClick={restartGame}>Play Again</button>
          </section>
        )}

      </main>

      {showNotice && !started && (
        <div className="overlay">
          <div className="modal">
            <h2>💡 Notice</h2>
            <p>
              Welcome to the Skimming & Scanning Challenge!
              <br /><br />
              Read the passage carefully and answer five
              multiple-choice questions.
              <br /><br />
              You have 90 seconds to complete the challenge.
              Each correct answer earns 10 points.
            </p>
            <button onClick={startGame}>OK, Got it!</button>
          </div>
        </div>
      )}

      <footer>
        ELT Speed Reader © 2026 | Designed for University Students in Bangladesh
      </footer>

    </div>
  );
}

export default App;
