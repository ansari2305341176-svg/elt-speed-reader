import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { levels, notice } from "./lessonData.js";
import "./App.css";

const READING_TIME = 30;
const SLOW_ANSWER_SECONDS = 20;
const QUICK_ANSWER_SECONDS = 5;

function App() {
  const [theme, setTheme] = useState("light");
  const [phase, setPhase] = useState("welcome");
  const [noticeIndex, setNoticeIndex] = useState(0);
  const [noticeAnswer, setNoticeAnswer] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [time, setTime] = useState(READING_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [readingSeconds, setReadingSeconds] = useState([]);
  const [responseSeconds, setResponseSeconds] = useState([]);
  const [responseElapsed, setResponseElapsed] = useState(0);
  const [revisionDone, setRevisionDone] = useState(false);
  const [revisionChoice, setRevisionChoice] = useState("");
  const responseStartedAt = useRef(null);
  const readingFinished = useRef(false);

  const currentLevel = levels[levelIndex];
  const currentQuestion = currentLevel.questions[questionIndex];
  const completedQuestions = levelIndex * 2 + questionIndex;
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const answered = selectedAnswer !== null;
  const noticeQuestion = notice.questions[noticeIndex];

  useEffect(() => {
    if (phase !== "quiz" || answered || responseStartedAt.current === null) return undefined;
    const timer = setInterval(() => {
      setResponseElapsed(Math.floor((performance.now() - responseStartedAt.current) / 1000));
    }, 250);
    return () => clearInterval(timer);
  }, [phase, completedQuestions, answered]);

  function resetChallenge() {
    setPhase("notice");
    setNoticeIndex(0);
    setNoticeAnswer(null);
    setLevelIndex(0);
    setQuestionIndex(0);
    setTime(READING_TIME);
    setSelectedAnswer(null);
    setAttempts([]);
    setReadingSeconds([]);
    setResponseSeconds([]);
    setResponseElapsed(0);
    setRevisionDone(false);
    setRevisionChoice("");
    responseStartedAt.current = null;
    readingFinished.current = false;
  }

  function startChallenge() {
    resetChallenge();
  }

  function returnHome() {
    resetChallenge();
    setPhase("welcome");
  }

  function submitNoticeAnswer(index) {
    if (noticeAnswer !== null) return;
    setNoticeAnswer(index);
  }

  function continueNotice() {
    if (noticeIndex === 0) {
      setNoticeIndex(1);
      setNoticeAnswer(null);
    } else {
      readingFinished.current = false;
      setPhase("reading");
      setTime(READING_TIME);
    }
  }

  const finishReading = useCallback((readDuration = READING_TIME - time) => {
    if (phase !== "reading" || readingFinished.current) return;
    readingFinished.current = true;
    setReadingSeconds((previous) => {
      const updated = [...previous];
      updated[completedQuestions] = (updated[completedQuestions] || 0) + readDuration;
      return updated;
    });
    responseStartedAt.current = performance.now();
    setResponseElapsed(0);
    setPhase("quiz");
  }, [completedQuestions, phase, time]);

  useEffect(() => {
    if (phase !== "reading") return undefined;
    const timer = setTimeout(() => {
      if (time <= 1) finishReading(READING_TIME);
      else setTime(time - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, time, finishReading]);

  function handleAnswer(index) {
    if (answered) return;
    const correct = index === currentQuestion.answer;
    const elapsed = responseStartedAt.current === null
      ? responseElapsed
      : Math.max(0, (performance.now() - responseStartedAt.current) / 1000);

    setSelectedAnswer(index);
    setAttempts((previous) => {
      const updated = [...previous];
      updated[completedQuestions] = [
        ...(updated[completedQuestions] || []),
        { selected: index, correct, seconds: elapsed }
      ];
      return updated;
    });
    setResponseSeconds((previous) => {
      const updated = [...previous];
      updated[completedQuestions] = (updated[completedQuestions] || 0) + elapsed;
      return updated;
    });
    setResponseElapsed(Math.floor(elapsed));
    responseStartedAt.current = null;
  }

  function rereadPassage() {
    setSelectedAnswer(null);
    readingFinished.current = false;
    setTime(READING_TIME);
    setPhase("reading");
  }

  function nextQuestion() {
    if (!answered || !isCorrect) return;
    if (questionIndex === 0) {
      setQuestionIndex(1);
    } else if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
      setQuestionIndex(0);
    } else {
      setPhase("results");
      return;
    }
    readingFinished.current = false;
    setTime(READING_TIME);
    setSelectedAnswer(null);
    setPhase("reading");
  }

  const finalAnswers = useMemo(() => {
    return levels.flatMap((level) => level.questions).map((question, index) => {
      const questionAttempts = attempts[index] || [];
      return {
        skill: question.skill,
        question: question.question,
        selected: questionAttempts[0]?.selected ?? null,
        correctAnswer: question.answer,
        correct: questionAttempts[0]?.correct ?? false,
        attemptCount: questionAttempts.length,
        readingSeconds: readingSeconds[index] || 0,
        responseSeconds: responseSeconds[index] || 0,
        options: question.options,
        explanation: question.explanation
      };
    });
  }, [attempts, readingSeconds, responseSeconds]);

  const score = finalAnswers.filter((answer) => answer.correct).length;
  const skimScore = finalAnswers.filter((answer) => answer.skill === "Skimming" && answer.correct).length;
  const scanScore = finalAnswers.filter((answer) => answer.skill === "Scanning" && answer.correct).length;
  const longestCorrectStreak = finalAnswers.reduce((streak, answer) => {
    const current = answer.correct ? streak.current + 1 : 0;
    return { current, longest: Math.max(streak.longest, current) };
  }, { current: 0, longest: 0 }).longest;
  const averageResponseSeconds = finalAnswers.length
    ? finalAnswers.reduce((total, answer) => total + answer.responseSeconds, 0) / finalAnswers.length
    : 0;
  const averageReadingSeconds = finalAnswers.length
    ? finalAnswers.reduce((total, answer) => total + answer.readingSeconds, 0) / finalAnswers.length
    : 0;
  const feedbackTips = [];

  if (score >= 5) {
    feedbackTips.push({
      title: "Accuracy",
      text: "Great first-try accuracy. Keep using the same careful reading routine."
    });
  } else {
    feedbackTips.push({
      title: "Accuracy",
      text: "Build accuracy before speed: decide whether each question asks for a main idea or one exact detail."
    });
  }
  if (skimScore < scanScore) {
    feedbackTips.push({
      title: "Practice skimming",
      text: "Use the title, opening sentence, and conclusion to identify the passage's main idea."
    });
  } else if (scanScore < skimScore) {
    feedbackTips.push({
      title: "Practice scanning",
      text: "Look for names, dates, numbers, and keywords that match the question."
    });
  } else {
    feedbackTips.push({
      title: "Keep it balanced",
      text: score < 4
        ? "Both skills need practice. Identify the question type before choosing a reading strategy."
        : "Your skimming and scanning results were balanced. Keep practicing both strategies."
    });
  }
  feedbackTips.push(longestCorrectStreak < 3
    ? {
        title: "Build consistency",
        text: `Your longest first-try streak was ${longestCorrectStreak}. Pause to verify each choice in the passage.`
      }
    : {
        title: "Strong streak",
        text: `You answered ${longestCorrectStreak} questions correctly in a row on the first try.`
      });
  if (averageResponseSeconds > SLOW_ANSWER_SECONDS) {
    feedbackTips.push({
      title: "Improve your pace",
      text: `Your average answer time was ${averageResponseSeconds.toFixed(1)} seconds. Practice finding clues more efficiently.`
    });
  } else if (averageResponseSeconds < QUICK_ANSWER_SECONDS && score < 5) {
    feedbackTips.push({
      title: "Slow down to check",
      text: "You answered quickly, but missed some first tries. Verify your choice against the passage before submitting."
    });
  } else {
    feedbackTips.push({
      title: "Pacing",
      text: `Your average answer time was ${averageResponseSeconds.toFixed(1)} seconds. Your pace is on track.`
    });
  }

  function markRevisionComplete() {
    if (revisionChoice === "main") setRevisionDone(true);
  }

  return (
    <div className={`app ${theme === "blue" ? "blue-theme" : ""}`}>
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">📖</div>
            <div><h1>ELT Speed Reader</h1><p>Read fast. Think smart. Score better.</p></div>
          </div>
          <div className="header-actions">
            <span className="edition-badge">🇧🇩 Bangladesh Edition</span>
            <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "blue" : "light")}>
              {theme === "light" ? "🔵 Blue Mode" : "☀️ White Mode"}
            </button>
            {phase !== "welcome" && (
              <button className="theme-toggle" onClick={returnHome}>Home</button>
            )}
          </div>
        </header>

        {phase === "welcome" && (
          <section className="welcome-panel">
            <div className="welcome-copy">
              <span className="step-label">A QUICK READING ADVENTURE</span>
              <h2>Read smarter.<br /><span>Think faster.</span></h2>
              <p>
                Practice skimming for the big idea and scanning for the details that matter.
                Finish six questions to get a personal progress report.
              </p>
              <div className="welcome-stats">
                <div><strong>6</strong><span>questions</span></div>
                <div><strong>2</strong><span>reading skills</span></div>
                <div><strong>30s</strong><span>per passage</span></div>
              </div>
              <button className="primary-button welcome-button" onClick={startChallenge}>
                Start the challenge <span aria-hidden="true">→</span>
              </button>
              <small>No account, email, or database needed. Your report stays in this session.</small>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <div className="welcome-orbit orbit-one" />
              <div className="welcome-orbit orbit-two" />
              <div className="welcome-book">📚</div>
              <span className="art-chip skim-chip">SKIM</span>
              <span className="art-chip scan-chip">SCAN</span>
            </div>
          </section>
        )}

        {phase === "notice" && (
          <section className="game-card warmup-card">
            <div className="section-heading">
              <span className="step-label">WARM-UP · UNIVERSITY NOTICE</span>
              <span className="status-badge reading-status">Question {noticeIndex + 1} of 2</span>
            </div>
            <h2>Read the notice and answer</h2>
            <p className="section-description">
              Use skimming to understand the purpose, then scanning to find exact details.
            </p>
            <article className="passage-box">
              <div className="passage-topline">
                <span className="passage-category">UNIVERSITY NOTICE</span>
                <span className="word-count">Warm-up</span>
              </div>
              <h3>{notice.title}</h3>
              <p className="passage-text">{notice.passage}</p>
            </article>
            <div className="question-box">
              <span className="question-number">{noticeQuestion.skill.toUpperCase()}</span>
              <h3>{noticeQuestion.question}</h3>
              <div className="options-list">
                {noticeQuestion.options.map((option, index) => (
                  <button
                    key={option}
                    className={`option-button ${noticeAnswer !== null && index === noticeQuestion.answer ? "correct-option" : noticeAnswer === index ? "wrong-option" : ""}`}
                    disabled={noticeAnswer !== null}
                    onClick={() => submitNoticeAnswer(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              {noticeAnswer !== null && (
                <div className={`feedback-box ${noticeAnswer === noticeQuestion.answer ? "correct-feedback" : "wrong-feedback"}`}>
                  <h4>{noticeAnswer === noticeQuestion.answer ? "Correct!" : "Not quite."}</h4>
                  <p>{noticeQuestion.explanation}</p>
                  <button className="primary-button" onClick={continueNotice}>
                    {noticeIndex === 0 ? "Next warm-up question →" : "Start the six-question challenge →"}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {(phase === "reading" || phase === "quiz") && (
          <>
            <section className="level-banner">
              <div>
                <span className="level-label">LEVEL {levelIndex + 1} OF {levels.length}</span>
                <h2>{currentLevel.name} Level</h2>
                <p>{currentLevel.description}</p>
              </div>
              <div className="level-count"><strong>{questionIndex + 1}/2</strong><span>Level questions</span></div>
            </section>
            <section className="overall-progress">
              <div className="overall-progress-label">
                <span>Challenge progress</span>
                <strong>{completedQuestions}/6 completed</strong>
              </div>
              <div className="progress-track">
                <div className="overall-progress-fill" style={{ width: `${completedQuestions / 6 * 100}%` }} />
              </div>
            </section>
          </>
        )}

        {phase === "reading" && (
          <section className="game-card">
            <div className="section-heading">
              <span className="step-label">READ THE PASSAGE</span>
              <span className="status-badge reading-status">Passage {completedQuestions + 1} of 6</span>
            </div>
            <h2>Read carefully before answering</h2>
            <p className="section-description">
              You have 30 seconds, or finish early when ready. Each question has its own passage.
            </p>
            <div className="timer-panel">
              <div className="timer-information">
                <span>⏱️ Time remaining</span>
                <strong className={time <= 10 ? "time-warning" : ""}>{time}s</strong>
              </div>
              <div className="progress-track">
                <div className={`progress-fill ${time <= 10 ? "progress-warning" : ""}`} style={{ width: `${time / READING_TIME * 100}%` }} />
              </div>
              <div className="timer-feedback">
                <span>{Math.round(100 - time / READING_TIME * 100)}% elapsed</span>
                <span>{time > 10 ? "Look for the main idea or target details." : "Time is almost over. Prepare to answer."}</span>
              </div>
            </div>
            <article className="passage-box">
              <div className="passage-topline">
                <span className="passage-category">{currentLevel.name.toUpperCase()} · {currentQuestion.skill.toUpperCase()}</span>
                <span className="word-count">Question {completedQuestions + 1}</span>
              </div>
              <h3>{currentQuestion.passageTitle}</h3>
              <p className="passage-text">{currentQuestion.passage}</p>
            </article>
            <div className="reading-footer">
              <div className="reading-tip">
                <span>💡</span>
                <p>
                  <strong>{currentQuestion.skill} strategy:</strong>{" "}
                  {currentQuestion.skill === "Skimming"
                    ? "Read quickly for the overall message. Focus on the title, opening sentence, topic sentences and conclusion."
                    : "Search for exact information—such as a date, time, name or number. Let your eyes move quickly through the text."}
                </p>
              </div>
              <button className="primary-button" onClick={() => finishReading()}>
                I have finished reading <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        {phase === "quiz" && (
          <section className="game-card quiz-card">
            <div className="section-heading">
              <span className="step-label">COMPREHENSION TEST</span>
              <span className="status-badge quiz-status">{currentQuestion.skill} · 1 point</span>
            </div>
            <div className="quiz-progress-heading">
              <h2>Answer the question</h2>
              <span>Question {completedQuestions + 1} of 6</span>
            </div>
            <div className="stats-grid">
              <div className="stat-box"><span>✨ First-try score</span><strong>{finalAnswers.filter((answer) => answer.correct).length}/6</strong></div>
              <div className="stat-box"><span>🔎 Skill</span><strong>{currentQuestion.skill}</strong></div>
              <div className="stat-box"><span>⏱️ Answer time</span><strong>{responseElapsed}s</strong></div>
            </div>
            <div className="question-box">
              <span className="question-number">{currentQuestion.passageTitle.toUpperCase()}</span>
              <h3>{currentQuestion.question}</h3>
              <div className="options-list">
                {currentQuestion.options.map((option, index) => {
                  let className = "option-button";
                  if (answered && isCorrect && index === currentQuestion.answer) className += " correct-option";
                  else if (answered && index === selectedAnswer && !isCorrect) className += " wrong-option";
                  return (
                    <button key={option} className={className} onClick={() => handleAnswer(index)} disabled={answered}>
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {answered && index === selectedAnswer && <span className="option-mark">{isCorrect ? "✓" : "✕"}</span>}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`feedback-box ${isCorrect ? "correct-feedback" : "wrong-feedback"}`} aria-live="polite">
                  <h4>{isCorrect ? "Correct! Nice work." : "Not quite. Give it another read."}</h4>
                  <p>{isCorrect ? currentQuestion.explanation : currentQuestion.tip}</p>
                </div>
              )}
              {answered && !isCorrect && (
                <button className="primary-button retry-button" onClick={rereadPassage}>↻ Return to the passage</button>
              )}
              {answered && isCorrect && (
                <button className="primary-button next-button" onClick={nextQuestion}>
                  {completedQuestions === 5
                    ? "See my reading report →"
                    : questionIndex === 0
                      ? "Continue to next passage →"
                      : `Continue to ${levels[levelIndex + 1]?.name || "results"} →`}
                </button>
              )}
            </div>
          </section>
        )}

        {phase === "results" && (
          <section className="game-card results-card">
            <div className="result-icon">🏆</div>
            <span className="step-label">CHALLENGE COMPLETED</span>
            <h2>Your Reading Skills Report</h2>
            <p className="section-description">This report uses your first answers, answer times, and correct-answer streak.</p>
            <div className="final-score">
              <span>FIRST-TRY SCORE</span>
              <strong>{score} / 6</strong>
              <p>{score >= 5 ? "Excellent work. Your reading strategies are getting strong." : "Every attempt is practice. Use the coaching below to choose your next focus."}</p>
            </div>
            <div className="result-stats">
              <div className="result-stat"><span>Skimming</span><strong>{skimScore} / 3</strong></div>
              <div className="result-stat"><span>Scanning</span><strong>{scanScore} / 3</strong></div>
              <div className="result-stat"><span>Longest correct streak</span><strong>{longestCorrectStreak}</strong></div>
              <div className="result-stat"><span>Average answer time</span><strong>{averageResponseSeconds.toFixed(1)}s</strong></div>
              <div className="result-stat"><span>Average reading time</span><strong>{averageReadingSeconds.toFixed(1)}s</strong></div>
            </div>
            <div className="coaching-panel">
              <h3>What to work on next</h3>
              <div className="coaching-grid">
                {feedbackTips.map((tip) => (
                  <article className="coaching-tip" key={tip.title}>
                    <span className="coaching-spark" aria-hidden="true">✦</span>
                    <div><h4>{tip.title}</h4><p>{tip.text}</p></div>
                  </article>
                ))}
              </div>
            </div>
            <div className="level-results">
              <h3>First-answer review</h3>
              {finalAnswers.map((answer, index) => (
                <div className="answer-review-row" key={answer.question}>
                  <span>
                    <b>Q{index + 1} · {answer.skill}</b>
                    <small>
                      {answer.correct
                        ? "Correct on the first try"
                        : `First answer: ${String.fromCharCode(65 + answer.selected)} · Correct: ${String.fromCharCode(65 + answer.correctAnswer)}`}
                    </small>
                    <small>{answer.attemptCount} attempt(s) · {answer.responseSeconds.toFixed(1)}s answering · {answer.readingSeconds}s reading</small>
                  </span>
                  <strong className={answer.correct ? "answer-correct" : "answer-wrong"}>
                    {answer.correct ? "First-try correct" : "Retry needed"}
                  </strong>
                </div>
              ))}
            </div>
            <div className="revision-box">
              <h3>Quick revision activity</h3>
              <p>You see a university notice and need its registration deadline. Which strategy should you use?</p>
              <label className="revision-option">
                <input type="radio" name="revision" value="main" checked={revisionChoice === "main"} onChange={(event) => setRevisionChoice(event.target.value)} />
                Scanning — search for the exact date or deadline.
              </label>
              <label className="revision-option">
                <input type="radio" name="revision" value="skim" checked={revisionChoice === "skim"} onChange={(event) => setRevisionChoice(event.target.value)} />
                Skimming — read quickly to understand the general purpose.
              </label>
              <button className="secondary-button" onClick={markRevisionComplete} disabled={revisionDone || !revisionChoice}>
                {revisionDone ? "Revision completed ✓" : "Submit revision answer"}
              </button>
              {revisionChoice === "skim" && <p className="form-error">Try again. The task asks for one exact detail.</p>}
              {revisionDone && <p className="success-text">Correct. Your revision activity is complete.</p>}
            </div>
            <p className="small-note">Your report is only available in this browser session; it is not uploaded or saved to a database.</p>
            <button className="primary-button" onClick={resetChallenge}>Try the challenge again ↻</button>
          </section>
        )}

        <footer className="footer">
          <p>ELT Speed Reader • Bangladesh Edition</p>
          <span>Skimming for the main idea. Scanning for specific information.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
