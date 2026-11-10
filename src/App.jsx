
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
      },
      {
        passageTitle: "A Healthy Lifestyle",
        passage:
          "A healthy lifestyle depends on regular exercise, balanced food and sufficient sleep. Walking every day can improve physical fitness. Eating vegetables and fruits provides important nutrients. People who maintain healthy habits may reduce their risk of many diseases.",
        question: "Which activity can improve physical fitness?",
        options: [
          "Skipping meals",
          "Sleeping all day",
          "Walking every day",
          "Avoiding vegetables",
        ],
        answer: 2,
        explanation:
          "The passage explains that walking every day can improve physical fitness.",
      },
      {
        passageTitle: "The Padma Bridge",
        passage:
          "The Padma Bridge is an important infrastructure project in Bangladesh. It connects the southwestern region with the central part of the country. The bridge has improved communication and transportation. It also helps people and businesses move goods more easily.",
        question: "What has the Padma Bridge improved?",
        options: [
          "International air travel",
          "Communication and transportation",
          "Mountain tourism",
          "Sea fishing",
        ],
        answer: 1,
        explanation:
          "The passage directly identifies communication and transportation as major improvements.",
      },
      {
        passageTitle: "The Value of Reading",
        passage:
          "Reading books is a useful habit for students. It improves vocabulary, develops imagination and increases knowledge. Regular reading also helps people understand different cultures and ideas. Even reading for twenty minutes every day can create positive learning habits.",
        question: "What does regular reading improve?",
        options: [
          "Physical strength",
          "Driving ability",
          "Cooking skills",
          "Vocabulary",
        ],
        answer: 3,
        explanation:
          "The passage mentions vocabulary as one of the main benefits of reading.",
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
      },
      {
        passageTitle: "The Growth of the Garment Industry",
        passage:
          "The ready-made garment industry has played a major role in Bangladesh's economic development. It creates employment opportunities and earns foreign currency through exports. Millions of workers depend on this sector. Nevertheless, the industry faces challenges involving workplace safety, fair wages and environmental sustainability. Long-term growth requires improvements in all these areas.",
        question: "According to the passage, what is necessary for the industry's long-term growth?",
        options: [
          "Reducing all export activities",
          "Depending only on low wages",
          "Improving safety, wages and sustainability",
          "Closing smaller factories",
        ],
        answer: 2,
        explanation:
          "The final sentence emphasizes improvements in workplace safety, fair wages and environmental sustainability.",
      },
      {
        passageTitle: "Urbanisation and Traffic",
        passage:
          "Rapid urbanisation has increased pressure on transportation systems in many developing cities. As more people move to urban areas, the number of private vehicles often rises. This contributes to traffic congestion, air pollution and wasted working hours. Better public transport, effective urban planning and improved pedestrian facilities can reduce these problems.",
        question: "Which approach does the passage recommend to reduce urban traffic problems?",
        options: [
          "Encouraging more private vehicles",
          "Expanding roads without planning",
          "Reducing pedestrian facilities",
          "Improving public transport and urban planning",
        ],
        answer: 3,
        explanation:
          "The passage recommends better public transport, effective planning and improved pedestrian facilities.",
      },
      {
        passageTitle: "Financial Inclusion",
        passage:
          "Financial inclusion means ensuring that individuals and businesses can access useful and affordable financial services. Mobile banking has helped many people in Bangladesh transfer money and make payments without visiting a bank branch. However, digital literacy, transaction costs and security concerns can limit its benefits. Building trust and improving access are important for wider participation.",
        question: "What does financial inclusion primarily aim to achieve?",
        options: [
          "Access to affordable and useful financial services",
          "The elimination of all physical banks",
          "The restriction of digital payments",
          "The replacement of cash with foreign currency",
        ],
        answer: 0,
        explanation:
          "The passage defines financial inclusion as access to useful and affordable financial services.",
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
      },
      {
        passageTitle: "The Role of Independent Media",
        passage:
          "Independent media contributes to democratic accountability by investigating public decisions and informing citizens. Its influence, however, depends on credibility and professional standards. When reporting becomes driven by sensationalism or political pressure, public trust may decline. A healthy media environment therefore requires editorial independence, verification of information and opportunities for diverse viewpoints.",
        question: "Which condition is most important for maintaining public trust in media?",
        options: [
          "Publishing information as quickly as possible",
          "Avoiding criticism of public institutions",
          "Promoting only popular viewpoints",
          "Maintaining editorial independence and verifying information",
        ],
        answer: 3,
        explanation:
          "The passage connects public trust with professional standards, editorial independence and information verification.",
      },
      {
        passageTitle: "Renewable Energy Transition",
        passage:
          "Transitioning to renewable energy can reduce dependence on fossil fuels and lower greenhouse gas emissions. Yet the transition is not simply a matter of installing solar panels or wind turbines. Energy storage, grid modernisation, investment and reliable policy frameworks are also necessary. Without these supporting systems, renewable energy may not consistently meet demand. Successful energy transitions therefore require coordinated technological and institutional changes.",
        question: "What can be inferred about renewable energy projects from the passage?",
        options: [
          "Their success depends on supporting infrastructure and policies as well as technology.",
          "They automatically guarantee uninterrupted electricity.",
          "They make investment and energy storage unnecessary.",
          "They can succeed without changes to electricity grids.",
        ],
        answer: 0,
        explanation:
          "The passage explains that renewable energy requires storage, modern grids, investment and reliable policies in addition to generating technology.",
      },
      {
        passageTitle: "Education and Social Mobility",
        passage:
          "Education is frequently regarded as a pathway to social mobility because it can expand people's knowledge, skills and employment opportunities. Nevertheless, educational access alone does not guarantee equal outcomes. Differences in school quality, family income, nutrition and professional networks can influence how individuals benefit from education. Policies that improve both educational quality and wider social conditions are therefore important for reducing persistent inequality.",
        question: "Which assumption does the passage challenge?",
        options: [
          "Education can develop useful skills.",
          "Employment opportunities can influence social mobility.",
          "Equal access to education automatically produces equal outcomes.",
          "Family income can affect educational opportunities.",
        ],
        answer: 2,
        explanation:
          "The passage argues that access alone does not guarantee equal outcomes because other social and economic factors also matter.",
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
  const totalQuestions = levels.reduce(
    (total, level) => total + level.questions.length,
    0
  );
  const completedQuestions = levels
    .slice(0, levelIndex)
    .reduce((total, level) => total + level.questions.length, 0) + questionIndex;

  const isCorrect = selectedAnswer === currentQuestion.answer;
  const answered = selectedAnswer !== null;
  const progress = (completedQuestions / totalQuestions) * 100;
  const remainingProgress = (time / READING_TIME) * 100;

  // Countdown for each individual passage.
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

  // A wrong answer sends the player back to the SAME passage.
  const rereadPassage = () => {
    setSelectedAnswer(null);
    setTime(READING_TIME);
    setPhase("reading");
  };

  // Only a correct answer unlocks the next question.
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
          {(phase === "reading" || phase === "quiz") && (
            <>
              <section className="level-banner">
                <div>
                  <span className="level-label">
                    LEVEL {levelIndex + 1} OF {levels.length}
                  </span>
                  <h2>{currentLevel.name} Level</h2>
                  <p>{currentLevel.description}</p>
                </div>
                <div className="level-count">
                  <strong>{questionIndex + 1}/5</strong>
                  <span>Level questions</span>
                </div>
              </section>

              <section className="overall-progress">
                <div className="overall-progress-label">
                  <span>Overall challenge progress</span>
                  <strong>{completedQuestions}/{totalQuestions} completed</strong>
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
                Every question has its own passage. You have 30 seconds, or
                you can finish early when you are ready.
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
                  <span>{Math.round(100 - remainingProgress)}% elapsed</span>
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
                <p className="passage-text">{currentQuestion.passage}</p>
              </article>

              <div className="reading-footer">
                <div className="reading-tip">
                  <span>💡</span>
                  <p>
                    <strong>Reading strategy:</strong> Identify the main idea,
                    supporting details and important keywords. You may need
                    these details to answer correctly.
                  </p>
                </div>

                <button className="primary-button" onClick={finishReading}>
                  I Have Finished Reading →
                </button>
              </div>
            </section>
          )}

          {phase === "quiz" && (
            <section className="game-card">
              <div className="section-heading">
                <span className="step-label">COMPREHENSION TEST</span>
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
                    className={`feedback-box ${
                      isCorrect ? "correct-feedback" : "wrong-feedback"
                    }`}
                  >
                    <h4>
                      {isCorrect
                        ? "🎉 Correct! You earned 1 point."
                        : "❌ Incorrect! You must read the passage again."}
                    </h4>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                {answered && !isCorrect && (
                  <button
                    className="primary-button retry-button"
                    onClick={rereadPassage}
                  >
                    ↻ Return to Passage and Read Again
                  </button>
                )}

                {answered && isCorrect && (
                  <button
                    className="primary-button next-button"
                    onClick={moveToNextQuestion}
                  >
                    {completedQuestions === totalQuestions - 1
                      ? "Complete Challenge →"
                      : questionIndex === 4 && levelIndex < 2
                      ? `Unlock ${levels[levelIndex + 1].name} Level →`
                      : "Continue to Next Passage →"}
                  </button>
                )}
              </div>
            </section>
          )}

          {phase === "results" && (
            <section className="game-card results-card">
              <div className="result-icon">🏆</div>
              <span className="step-label">ALL THREE LEVELS COMPLETED</span>
              <h2>Challenge Completed!</h2>
              <p className="section-description">
                You have successfully answered all 15 questions.
              </p>

              <div className="final-score">
                <span>YOUR FINAL SCORE</span>
                <strong>{score} / {totalQuestions}</strong>
                <p>
                  {score === 15
                    ? "Outstanding! You achieved a perfect score!"
                    : score >= 12
                    ? "Excellent performance! Keep sharpening your skills."
                    : score >= 8
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
                  <strong>15</strong>
                </div>
                <div className="result-stat">
                  <span>Best streak</span>
                  <strong>{bestStreak}</strong>
                </div>
              </div>

              <div className="level-results">
                <h3>Challenge completed</h3>
                {levels.map((level, index) => (
                  <div className="level-result-row" key={level.name}>
                    <span>
                      Level {index + 1}: {level.name}
                    </span>
                    <strong>5 / 5 unlocked</strong>
                  </div>
                ))}
              </div>

              <button className="primary-button restart-button" onClick={restartGame}>
                ↻ Start a New Challenge
              </button>
            </section>
          )}
        </main>

        <footer className="footer">
          <p>ELT Speed Reader • Bangladesh Edition</p>
          <span>15 passages. 15 questions. 3 difficulty levels.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
