import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./services/supabase";
import "./App.css";
const READING_TIME = 30;

const notice = {
  title: "University Career Seminar",
  passage: "The Department of Software Engineering will organize a Career Preparation Seminar on 24 November 2026. The seminar will begin at 10:30 a.m. in the university auditorium. Students from all departments may participate. Interested students must register online by 20 November 2026. Participants should bring their student ID cards. For further information, contact the Student Affairs Office.",
  questions: [
    {
      skill: "Skimming",
      question: "What is the main purpose of this notice?",
      options: ["To announce a career preparation seminar", "To publish semester examination results", "To recruit software engineers", "To announce a university holiday"],
      answer: 0,
      explanation: "The notice mainly informs students about an upcoming Career Preparation Seminar and invites them to participate."
    },
    {
      skill: "Scanning",
      question: "When and where will the seminar take place?",
      options: ["20 November, 10:30 a.m., Room 204", "24 November, 10:30 a.m., university auditorium", "24 November, 2:30 p.m., library", "20 November, 9:00 a.m., university auditorium"],
      answer: 1,
      explanation: "Scan for the date, time and venue: 24 November 2026, 10:30 a.m., university auditorium. The registration deadline is 20 November 2026."
    }
  ]
};

const levels = [
  {
    name: "Beginner",
    description: "Learn the basic difference between reading for the main idea and reading for details.",
    questions: [
      {
        skill: "Skimming",
        passageTitle: "A University Library",
        passage: "A university library is more than a place to borrow books. It provides a quiet environment for study, access to academic journals and digital resources, and spaces for group discussion. Many libraries also arrange workshops to help students develop research skills. By offering these services, a library supports both academic learning and independent study.",
        question: "What is the main idea of the passage?",
        options: ["University libraries support different forms of learning", "Libraries should only lend printed books", "Group discussions are not useful for students", "All university workshops take place in libraries"],
        answer: 0,
        explanation: "The whole passage describes several ways a university library supports students. This is a main-idea question, so you should consider the entire passage.",
        tip: "Skimming tip: Read the title, first sentence and concluding sentence. Look for the overall message instead of focusing on every small detail."
      },
      {
        skill: "Scanning",
        passageTitle: "Campus Health Centre",
        passage: "The university health centre is located beside the central cafeteria. It opens from 8:30 a.m. to 4:00 p.m., Sunday to Thursday. Students can receive basic medical advice and first aid without charge. For an appointment, students should call extension 215. The centre remains closed on public holidays.",
        question: "Which telephone extension should a student call to make an appointment?",
        options: ["125", "215", "250", "415"],
        answer: 1,
        explanation: "The exact detail is extension 215. Scanning means searching quickly for a specific number or fact.",
        tip: "Scanning tip: Decide what information you need—in this case, a phone extension—then move your eyes quickly through the text to find the number."
      }
    ]
  },
  {
    name: "Intermediate",
    description: "Identify the central message and locate precise information in longer passages.",
    questions: [
      {
        skill: "Skimming",
        passageTitle: "Public Transport and University Students",
        passage: "Affordable public transport can make university education more accessible. Students who live far from campus often spend a significant amount of time and money travelling. Reliable buses and trains can reduce these difficulties and help students attend classes regularly. Better public transport may also reduce traffic congestion because fewer people need to use private vehicles. However, routes, safety and service frequency must be improved to make the system dependable. Investment in public transport therefore benefits both students and the wider city.",
        question: "Which statement best expresses the main idea of the passage?",
        options: ["Private vehicles are the only reliable way to reach universities", "Improved public transport can benefit students and cities", "University students should avoid travelling long distances", "Traffic congestion has no connection with public transport"],
        answer: 1,
        explanation: "The passage discusses how dependable public transport helps students and can also reduce wider urban problems. That is its overall message.",
        tip: "Skimming tip: Do not select an option just because it repeats one sentence. Choose the statement that covers the passage as a whole."
      },
      {
        skill: "Scanning",
        passageTitle: "Research Workshop Registration",
        passage: "The Research and Innovation Club will conduct a workshop titled 'Finding Reliable Academic Sources' on 28 November 2026. The programme will run from 1:00 p.m. to 3:30 p.m. in Seminar Room B, Building 4. Registration is free, but only 60 seats are available. Students must complete the online form by 25 November. A confirmation email will be sent within 24 hours of registration.",
        question: "What is the registration deadline?",
        options: ["24 November 2026", "25 November 2026", "28 November 2026", "30 November 2026"],
        answer: 1,
        explanation: "The passage states that students must complete the online form by 25 November. Search for the deadline rather than rereading every sentence.",
        tip: "Scanning tip: Search for deadline clues such as 'by', 'before' or 'no later than'. Check the date carefully."
      }
    ]
  },
  {
    name: "Advanced",
    description: "Apply skimming and scanning strategies to realistic academic reading tasks.",
    questions: [
      {
        skill: "Skimming",
        passageTitle: "Digital Skills and Graduate Employment",
        passage: "A university degree provides graduates with subject knowledge, but employers increasingly expect additional digital and communication skills. In many workplaces, employees must interpret data, collaborate through digital platforms and explain complex ideas clearly. These abilities are useful across sectors, not only in technology companies. Universities can respond by integrating practical projects, presentations and digital tools into their courses. Students should also build skills independently through projects and continuous learning. The central challenge is to connect academic knowledge with the practical abilities required in changing workplaces.",
        question: "You have 20 seconds to decide what this passage is mainly about. Which approach would be most effective?",
        options: ["Memorise every example and supporting phrase", "Read the opening and closing sentences and identify the repeated central theme", "Search only for the word 'technology'", "Read the passage backwards, word by word"],
        answer: 1,
        explanation: "Skimming is appropriate when time is limited and you need the overall message. The opening and closing sentences help reveal the central theme: connecting academic knowledge with practical skills.",
        tip: "Advanced skimming tip: Use the title, opening sentence, topic sentences and conclusion to form a quick picture of the writer's overall argument."
      },
      {
        skill: "Scanning",
        passageTitle: "Student Research Conference Schedule",
        passage: "The Annual Student Research Conference will be held on 5 December 2026 at the Daffodil International University campus. The opening session starts at 9:15 a.m. in the main auditorium. Paper presentations will begin at 10:00 a.m. in Rooms 301, 302 and 405. The lunch break is scheduled for 1:00 p.m. The poster exhibition will remain open until 3:45 p.m. Presenters must submit their final slides to the conference desk by 8:45 a.m. on the event day. The registration desk opens at 8:00 a.m.",
        question: "A presenter needs to submit the final slides. What is the exact deadline?",
        options: ["8:00 a.m. on 5 December", "8:45 a.m. on 5 December", "9:15 a.m. on 5 December", "10:00 a.m. on 5 December"],
        answer: 1,
        explanation: "The exact deadline is 8:45 a.m. on 5 December 2026. Scanning helps locate one specific time among several times in the same passage.",
        tip: "Advanced scanning tip: Identify the target category first (a submission deadline), then distinguish it from other nearby times such as registration and session starts."
      }
    ]
  }
];

function App() {
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("welcome");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const authFlowRef = useRef(false);
  const [form, setForm] = useState({ name: "", studentId: "", email: "", password: "" });
  const [phase, setPhase] = useState("notice");
  const [noticeIndex, setNoticeIndex] = useState(0);
  const [noticeAnswer, setNoticeAnswer] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [time, setTime] = useState(READING_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [revisionDone, setRevisionDone] = useState(false);
  const [revisionChoice, setRevisionChoice] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const currentLevel = levels[levelIndex];
  const currentQuestion = currentLevel.questions[questionIndex];
  const totalQuestions = 6;
  const completedQuestions = levelIndex * 2 + questionIndex;
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const answered = selectedAnswer !== null;
  const noticeQuestion = notice.questions[noticeIndex];

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadProfile(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        if (!authFlowRef.current) loadProfile(newSession);
      } else {
        setSession(null);
        setProfile(null);
        setView("welcome");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadProfile(currentSession, expectedRole = null) {
    setSession(currentSession);
    const { data, error } = await supabase.from("profiles").select("id, full_name, student_id, role").eq("id", currentSession.user.id).single();
    if (error) {
      const signOutError = expectedRole ? (await supabase.auth.signOut()).error : null;
      setSession(null);
      setProfile(null);
      setView("welcome");
      setAuthError(
        signOutError
          ? `Could not load your profile: ${error.message}. Sign out failed: ${signOutError.message}`
          : "Could not load your profile. Check the database setup or contact the administrator."
      );
      return;
    }
    if (expectedRole && data.role !== expectedRole) {
      const { error: signOutError } = await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setView("welcome");
      const message = expectedRole === "teacher"
        ? "This account does not have teacher access. Ask the database administrator to assign the teacher role."
        : "This is a teacher account. Choose Teacher login.";
      setAuthError(signOutError ? `${message} Sign out failed: ${signOutError.message}` : message);
      return;
    }
    setProfile(data);
    setView(data.role === "teacher" ? "teacher" : "student");
    if (data.role === "teacher") fetchTeacherResults();
  }

  useEffect(() => {
    if (phase !== "reading") return;
    if (time <= 0) { setPhase("quiz"); return; }
    const timer = setTimeout(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearTimeout(timer);
  }, [phase, time]);

  async function handleAuth(event) {
    event.preventDefault(); setAuthError(""); setAuthLoading(true);
    if (!supabase) { setAuthError("Supabase is not configured. Complete the setup instructions first."); setAuthLoading(false); return; }
    authFlowRef.current = true;
    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(), password: form.password,
          options: {
            data: { full_name: form.name.trim(), student_id: form.studentId.trim() },
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        if (data.session) await loadProfile(data.session, "student");
        else setAuthError("Registration submitted. Check your email to confirm, then sign in.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
        if (error) throw error;
        await loadProfile(data.session, authMode === "teacher" ? "teacher" : "student");
      }
    } catch (error) { setAuthError(error.message || "Authentication failed."); }
    finally { authFlowRef.current = false; setAuthLoading(false); }
  }

  async function logout() { if (supabase) await supabase.auth.signOut(); setSession(null); setProfile(null); setView("welcome"); resetChallenge(); }

  function resetChallenge() {
    setPhase("notice"); setNoticeIndex(0); setNoticeAnswer(null); setLevelIndex(0); setQuestionIndex(0);
    setTime(READING_TIME); setSelectedAnswer(null); setAnswers([]); setRevisionDone(false); setRevisionChoice(""); setSaveMessage("");
  }

  function submitNoticeAnswer(index) { if (noticeAnswer !== null) return; setNoticeAnswer(index); }
  function continueNotice() {
    if (noticeIndex === 0) { setNoticeIndex(1); setNoticeAnswer(null); }
    else { setPhase("reading"); setTime(READING_TIME); }
  }
  function finishReading() { setPhase("quiz"); }
  function handleAnswer(index) {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswers((old) => {
      const updated = [...old]; updated[completedQuestions] = { selected: index, correct: index === currentQuestion.answer, skill: currentQuestion.skill, question: currentQuestion.question, correctAnswer: currentQuestion.answer };
      return updated;
    });
  }
  function rereadPassage() { setSelectedAnswer(null); setTime(READING_TIME); setPhase("reading"); }
  function nextQuestion() {
    if (!answered || !isCorrect) return;
    if (questionIndex === 0) { setQuestionIndex(1); }
    else if (levelIndex < 2) { setLevelIndex(levelIndex + 1); setQuestionIndex(0); }
    else { setPhase("results"); return; }
    setTime(READING_TIME); setSelectedAnswer(null); setPhase("reading");
  }

  const finalAnswers = useMemo(() => {
    return levels.flatMap((level) => level.questions).map((q, i) => ({
      skill: q.skill, question: q.question, selected: answers[i]?.selected ?? null,
      correctAnswer: q.answer, correct: answers[i]?.selected === q.answer,
      options: q.options, explanation: q.explanation
    }));
  }, [answers]);
  const score = finalAnswers.filter((a) => a.correct).length;
  const skimScore = finalAnswers.filter((a) => a.skill === "Skimming" && a.correct).length;
  const scanScore = finalAnswers.filter((a) => a.skill === "Scanning" && a.correct).length;
  const feedback = score === 6
    ? "Excellent work. You correctly applied both reading strategies across all difficulty levels."
    : skimScore > scanScore
      ? "Your skimming is stronger. Practise locating exact dates, names, times and numbers when scanning."
      : scanScore > skimScore
        ? "Your scanning is stronger. Practise identifying the overall message without getting distracted by details."
        : "Keep practising both skills. First decide whether a task asks for the main idea or a specific detail, then choose the matching strategy.";

  async function saveStudentResult() {
    if (!supabase || !session || !profile) { setSaveMessage("You must sign in to save your result online."); return; }
    setSaveMessage("Saving your result...");
    const payload = {
      student_id: profile.id,
      total_score: score,
      skimming_score: skimScore,
      scanning_score: scanScore,
      answers: finalAnswers,
      notice_answers: { first: notice.questions[0].answer, second: notice.questions[1].answer },
      feedback,
      revision_completed: revisionDone
    };
    const { error } = await supabase.from("submissions").upsert(payload, { onConflict: "student_id" });
    if (error) setSaveMessage(`Could not save: ${error.message}`);
    else setSaveMessage("Your result has been saved securely.");
  }
  async function loadMyResult() {
    if (!supabase || !profile) return;
    const { data, error } = await supabase.from("submissions").select("*").eq("student_id", profile.id).maybeSingle();
    if (error) setSaveMessage(error.message);
    else if (data) { setSaveMessage("Your latest saved result is available."); setStudentResults([data]); }
    else setSaveMessage("You have not submitted a result yet.");
  }
  async function fetchTeacherResults() {
    if (!supabase) {
      setTeacherError("Supabase is not configured.");
      return;
    }

    setTeacherLoading(true);
    setTeacherError("");
    try {
      const { data, error } = await supabase
        .from("teacher_results")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) {
        setTeacherError(`Could not load class results: ${error.message}`);
        return;
      }
      setStudentResults(data || []);
    } catch (error) {
      setTeacherError(error instanceof Error ? error.message : "Could not load class results.");
    } finally {
      setTeacherLoading(false);
    }
  }
  async function markRevisionComplete() {
    if (revisionChoice !== "main") return;
    setRevisionDone(true);
    if (supabase && profile) {
      await supabase.from("submissions").update({ revision_completed: true }).eq("student_id", profile.id);
    }
  }
  function exportCSV() {
    const headers = ["Student Name", "Student ID", "Score / 6", "Skimming / 3", "Scanning / 3", "Revision completed", "Feedback"];
    const rows = studentResults.map((r) => [r.full_name, r.student_code, r.total_score, r.skimming_score, r.scanning_score, r.revision_completed ? "Yes" : "No", r.feedback]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); link.download = "skimming-scanning-results.csv"; link.click(); URL.revokeObjectURL(link.href);
  }

  const filteredResults = studentResults.filter((r) => `${r.full_name || ""} ${r.student_code || ""}`.toLowerCase().includes(teacherSearch.toLowerCase()));
  const submittedResults = studentResults.filter((result) => result.submitted && result.total_score !== null);
  const averageScore = submittedResults.length
    ? (submittedResults.reduce((total, result) => total + result.total_score, 0) / submittedResults.length).toFixed(1)
    : null;
  const completedRevisions = submittedResults.filter((result) => result.revision_completed).length;

  return (
    <div className={`app ${theme === "blue" ? "blue-theme" : ""}`}>
      <div className="container">
        <header className="header">
          <div className="brand"><div className="brand-icon">📖</div><div><h1>ELT Speed Reader</h1><p>Read fast. Think smart. Score better.</p></div></div>
          <div className="header-actions"><span className="edition-badge">🇧🇩 Bangladesh Edition</span><button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "blue" : "light")}>{theme === "light" ? "🔵 Blue Mode" : "☀️ White Mode"}</button>{session && <button className="theme-toggle" onClick={logout}>Log out</button>}</div>
        </header>

        {view === "welcome" && <section className="game-card auth-card">
          <span className="step-label">SKIMMING & SCANNING LESSON</span><h2>Welcome to the Reading Skills Challenge</h2>
          <p className="section-description">Learn to read for the main idea (skimming) and locate exact information (scanning). Sign in to save your result and view your personal progress.</p>
          {!supabase && <div className="feedback-box wrong-feedback"><strong>Supabase is not connected</strong><p>Set <code>VITE_SUPABASE_URL</code> and either <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> or <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>, apply <code>supabase/schema.sql</code> in your Supabase SQL Editor, then restart the dev server. For a deployed site, add both variables to its build environment and redeploy.</p></div>}
          <div className="auth-tabs">
            <button className={authMode === "login" ? "active-tab" : ""} onClick={() => { setAuthMode("login"); setAuthError(""); }}>Student sign in</button>
            <button className={authMode === "signup" ? "active-tab" : ""} onClick={() => { setAuthMode("signup"); setAuthError(""); }}>Student registration</button>
            <button className={authMode === "teacher" ? "active-tab" : ""} onClick={() => { setAuthMode("teacher"); setAuthError(""); }}>Teacher login</button>
          </div>
          <form className="auth-form" onSubmit={handleAuth}>
            {authMode === "signup" && <><label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></label><label>Student ID<input required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="e.g. 231-15-000" /></label></>}
            <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label>
            <label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>
            {authError && <p className="form-error">{authError}</p>}
            <button className="primary-button" disabled={authLoading}>{authLoading ? "Please wait..." : authMode === "signup" ? "Create student account →" : authMode === "teacher" ? "Teacher sign in →" : "Student sign in →"}</button>
          </form>
          <p className="small-note">Teacher accounts are created and assigned the teacher role by the database administrator. Students cannot create or access teacher accounts.</p>
        </section>}

        {view === "student" && profile && <>
          <section className="level-banner"><div><span className="level-label">STUDENT DASHBOARD</span><h2>Welcome, {profile.full_name}</h2><p>Student ID: {profile.student_id}</p></div><div className="level-count"><strong>15 min</strong><span>Class activity</span></div></section>
          {phase === "notice" && <section className="game-card"><div className="section-heading"><span className="step-label">ACTIVITY 1 · UNIVERSITY NOTICE</span><span className="status-badge reading-status">Question {noticeIndex + 1} of 2</span></div><h2>Read the notice and answer</h2><p className="section-description">Use skimming to understand the purpose, then scanning to find exact details.</p><article className="passage-box"><div className="passage-topline"><span className="passage-category">UNIVERSITY NOTICE</span><span className="word-count">Notice reading</span></div><h3>{notice.title}</h3><p className="passage-text">{notice.passage}</p></article><div className="question-box"><span className="question-number">{noticeQuestion.skill.toUpperCase()}</span><h3>{noticeQuestion.question}</h3><div className="options-list">{noticeQuestion.options.map((o, i) => <button key={i} className={`option-button ${noticeAnswer !== null && i === noticeQuestion.answer ? "correct-option" : noticeAnswer === i ? "wrong-option" : ""}`} disabled={noticeAnswer !== null} onClick={() => submitNoticeAnswer(i)}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{o}</span></button>)}</div>{noticeAnswer !== null && <div className={`feedback-box ${noticeAnswer === noticeQuestion.answer ? "correct-feedback" : "wrong-feedback"}`}><h4>{noticeAnswer === noticeQuestion.answer ? "Correct!" : "Not quite."}</h4><p>{noticeQuestion.explanation}</p><button className="primary-button" onClick={continueNotice}>{noticeIndex === 0 ? "Next notice question →" : "Start six-question challenge →"}</button></div>}</div></section>}
          {(phase === "reading" || phase === "quiz") && <>
            <section className="level-banner"><div><span className="level-label">LEVEL {levelIndex + 1} OF 3</span><h2>{currentLevel.name} Level</h2><p>{currentLevel.description}</p></div><div className="level-count"><strong>{questionIndex + 1}/2</strong><span>Level questions</span></div></section>
            <section className="overall-progress"><div className="overall-progress-label"><span>Challenge progress</span><strong>{completedQuestions}/6 completed</strong></div><div className="progress-track"><div className="overall-progress-fill" style={{ width: `${completedQuestions / 6 * 100}%` }} /></div></section>
          </>}
          {phase === "reading" && <section className="game-card"><div className="section-heading"><span className="step-label">READ THE PASSAGE</span><span className="status-badge reading-status">Passage {completedQuestions + 1} of 6</span></div><h2>Read carefully before answering</h2><p className="section-description">You have 30 seconds, or you can finish early when ready. Each question has its own passage.</p><div className="timer-panel"><div className="timer-information"><span>⏱️ Time remaining</span><strong className={time <= 10 ? "time-warning" : ""}>{time}s</strong></div><div className="progress-track"><div className={`progress-fill ${time <= 10 ? "progress-warning" : ""}`} style={{ width: `${time / READING_TIME * 100}%` }} /></div><div className="timer-feedback"><span>{Math.round(100 - time / READING_TIME * 100)}% elapsed</span><span>{time > 10 ? "Look for the main idea or the target details." : "Time is almost over. Prepare to answer."}</span></div></div><article className="passage-box"><div className="passage-topline"><span className="passage-category">{currentLevel.name.toUpperCase()} · {currentQuestion.skill.toUpperCase()}</span><span className="word-count">Question {completedQuestions + 1}</span></div><h3>{currentQuestion.passageTitle}</h3><p className="passage-text">{currentQuestion.passage}</p></article><div className="reading-footer"><div className="reading-tip"><span>💡</span><p><strong>{currentQuestion.skill} strategy:</strong> {currentQuestion.skill === "Skimming" ? "Read quickly for the overall message. Focus on the title, opening sentence, topic sentences and conclusion." : "Search for the exact information you need—such as a date, time, name or number. Let your eyes move quickly through the text."}</p></div><button className="primary-button" onClick={finishReading}>I Have Finished Reading →</button></div></section>}
          {phase === "quiz" && <section className="game-card"><div className="section-heading"><span className="step-label">COMPREHENSION TEST</span><span className="status-badge quiz-status">{currentQuestion.skill} · 1 point</span></div><div className="quiz-progress-heading"><h2>Answer the question</h2><span>Question {completedQuestions + 1} of 6</span></div><div className="stats-grid"><div className="stat-box"><span>⭐ Score</span><strong>{answers.filter((a) => a?.correct).length}</strong></div><div className="stat-box"><span>🔎 Skill</span><strong>{currentQuestion.skill}</strong></div><div className="stat-box"><span>📚 Level</span><strong>{currentLevel.name}</strong></div></div><div className="question-box"><span className="question-number">{currentQuestion.passageTitle.toUpperCase()}</span><h3>{currentQuestion.question}</h3><div className="options-list">{currentQuestion.options.map((option, index) => { let cls = "option-button"; if (answered && isCorrect && index === currentQuestion.answer) cls += " correct-option"; else if (answered && index === selectedAnswer && !isCorrect) cls += " wrong-option"; return <button key={index} className={cls} onClick={() => handleAnswer(index)} disabled={answered}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{answered && index === selectedAnswer && <span className="option-mark">{isCorrect ? "✓" : "✕"}</span>}</button>; })}</div>{answered && <div className={`feedback-box ${isCorrect ? "correct-feedback" : "wrong-feedback"}`}><h4>{isCorrect ? "Correct! You earned 1 point." : "Incorrect. Read the passage again."}</h4><p>{isCorrect ? currentQuestion.explanation : currentQuestion.tip}</p></div>}{answered && !isCorrect && <button className="primary-button retry-button" onClick={rereadPassage}>↻ Return to Passage and Read Again</button>}{answered && isCorrect && <button className="primary-button next-button" onClick={nextQuestion}>{completedQuestions === 5 ? "Complete Challenge →" : questionIndex === 0 ? "Continue to Next Passage →" : `Unlock ${levels[levelIndex + 1]?.name || "Results"} →`}</button>}</div></section>}
          {phase === "results" && <section className="game-card results-card"><div className="result-icon">🏆</div><span className="step-label">CHALLENGE COMPLETED</span><h2>Your Reading Skills Report</h2><p className="section-description">Your result is private. Only you and the authorized teacher can view it.</p><div className="final-score"><span>YOUR FINAL SCORE</span><strong>{score} / 6</strong><p>{feedback}</p></div><div className="result-stats"><div className="result-stat"><span>Skimming</span><strong>{skimScore} / 3</strong></div><div className="result-stat"><span>Scanning</span><strong>{scanScore} / 3</strong></div><div className="result-stat"><span>Correct answers</span><strong>{score} / 6</strong></div></div><div className="level-results"><h3>Individual answer review</h3>{finalAnswers.map((a, i) => <div className="answer-review-row" key={i}><span><b>Q{i + 1} · {a.skill}</b><small>{a.question}</small></span><strong className={a.correct ? "answer-correct" : "answer-wrong"}>{a.correct ? "Correct" : `Incorrect · ${a.selected === null ? "Not answered" : `Your answer: ${String.fromCharCode(65 + a.selected)}`}`}</strong></div>)}</div><div className="revision-box"><h3>Quick revision activity</h3><p>You see a university notice and need to find the registration deadline. Which strategy should you use?</p><label className="revision-option"><input type="radio" name="revision" value="main" checked={revisionChoice === "main"} onChange={(e) => setRevisionChoice(e.target.value)} /> Scanning — search for the exact date or deadline.</label><label className="revision-option"><input type="radio" name="revision" value="skim" checked={revisionChoice === "skim"} onChange={(e) => setRevisionChoice(e.target.value)} /> Skimming — read quickly to understand the general purpose.</label><button className="secondary-button" onClick={markRevisionComplete} disabled={revisionDone || !revisionChoice}>{revisionDone ? "Revision completed ✓" : "Submit revision answer"}</button>{revisionChoice === "skim" && <p className="form-error">Try again. The task asks for one exact detail.</p>}{revisionDone && <p className="success-text">Correct. Your revision activity is complete.</p>}</div><button className="primary-button" onClick={saveStudentResult}>Save my result online</button>{saveMessage && <p className="small-note">{saveMessage}</p>}<button className="secondary-button" onClick={async () => { await loadMyResult(); setView("my-results"); }}>View my saved result</button><button className="secondary-button" onClick={resetChallenge}>Retake the lesson</button></section>}
        </>}
        {view === "my-results" && <section className="game-card"><span className="step-label">PRIVATE STUDENT RECORD</span><h2>My Results</h2><p className="section-description">Only your own record is available here.</p>{studentResults.length ? studentResults.map((r, i) => <div className="final-score" key={i}><span>LATEST SAVED RESULT</span><strong>{r.total_score} / 6</strong><p>Skimming: {r.skimming_score}/3 · Scanning: {r.scanning_score}/3</p><p>{r.feedback}</p></div>) : <p>{saveMessage || "No saved result found."}</p>}<button className="secondary-button" onClick={() => setView("student")}>Back to dashboard</button></section>}

        {view === "teacher" && profile?.role === "teacher" && (
          <section className="game-card teacher-card">
            <div className="teacher-heading">
              <div>
                <span className="step-label">PRIVATE TEACHER DASHBOARD</span>
                <h2>Class Progress</h2>
                <p className="section-description">
                  Welcome, {profile.full_name}. Review student activity and assessment results.
                </p>
              </div>
              <button className="secondary-button" onClick={fetchTeacherResults} disabled={teacherLoading}>
                {teacherLoading ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>

            {teacherError && <p className="form-error" role="alert">{teacherError}</p>}

            <div className="teacher-toolbar">
              <input
                aria-label="Search students by name or ID"
                value={teacherSearch}
                onChange={(event) => setTeacherSearch(event.target.value)}
                placeholder="Search student name or ID"
              />
              <button
                className="secondary-button"
                onClick={exportCSV}
                disabled={teacherLoading || studentResults.length === 0}
              >
                Export CSV ↓
              </button>
            </div>

            <div className="teacher-summary">
              <div className="stat-box">
                <span>Registered students</span>
                <strong>{studentResults.length}</strong>
              </div>
              <div className="stat-box">
                <span>Submitted assessments</span>
                <strong>{submittedResults.length}</strong>
              </div>
              <div className="stat-box">
                <span>Average submitted score</span>
                <strong>{averageScore ?? "—"}/6</strong>
              </div>
              <div className="stat-box">
                <span>Revisions completed</span>
                <strong>{completedRevisions}/{submittedResults.length}</strong>
              </div>
            </div>

            {teacherLoading ? (
              <p className="small-note" role="status">Loading class progress...</p>
            ) : filteredResults.length > 0 ? (
              <div className="table-wrap">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>ID</th>
                      <th>Score</th>
                      <th>Skim</th>
                      <th>Scan</th>
                      <th>Status</th>
                      <th>Revision</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => (
                      <tr key={result.student_uuid}>
                        <td>{result.full_name}</td>
                        <td>{result.student_code || "—"}</td>
                        <td>{result.total_score == null ? "—" : `${result.total_score}/6`}</td>
                        <td>{result.skimming_score == null ? "—" : `${result.skimming_score}/3`}</td>
                        <td>{result.scanning_score == null ? "—" : `${result.scanning_score}/3`}</td>
                        <td>{result.submitted ? "Submitted" : "Not submitted"}</td>
                        <td>{result.revision_completed ? "Complete" : "Incomplete"}</td>
                        <td>
                          <button className="text-button" onClick={() => setSelectedResult(result)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="small-note">
                {studentResults.length === 0
                  ? "No student accounts have been registered yet."
                  : "No students match your search."}
              </p>
            )}

            {selectedResult && (
              <div className="teacher-detail">
                <div className="teacher-heading">
                  <h3>{selectedResult.full_name} · {selectedResult.student_code || "No student ID"}</h3>
                  <button className="text-button" onClick={() => setSelectedResult(null)}>Close ×</button>
                </div>
                <p><b>Status:</b> {selectedResult.submitted ? "Submitted" : "Not submitted"}</p>
                <p>
                  <b>Score:</b> {selectedResult.total_score == null ? "—" : `${selectedResult.total_score}/6`}
                  {" · "}<b>Skimming:</b> {selectedResult.skimming_score == null ? "—" : `${selectedResult.skimming_score}/3`}
                  {" · "}<b>Scanning:</b> {selectedResult.scanning_score == null ? "—" : `${selectedResult.scanning_score}/3`}
                </p>
                <p><b>Automated feedback:</b> {selectedResult.feedback || "No feedback yet because no result has been submitted."}</p>
                <p><b>Revision:</b> {selectedResult.revision_completed ? "Completed" : "Incomplete"}</p>
                {(selectedResult.answers || []).map((answer, index) => (
                  <div className="answer-review-row" key={index}>
                    <span><b>Q{index + 1} · {answer.skill}</b><small>{answer.question}</small></span>
                    <strong className={answer.correct ? "answer-correct" : "answer-wrong"}>
                      {answer.correct
                        ? "Correct"
                        : `Incorrect · Selected ${answer.selected === null ? "—" : String.fromCharCode(65 + answer.selected)}`}
                    </strong>
                  </div>
                ))}
              </div>
            )}
            <button className="secondary-button" onClick={logout}>Log out</button>
          </section>
        )}

        <footer className="footer"><p>ELT Speed Reader • Bangladesh Edition</p><span>Skimming for the main idea. Scanning for specific information.</span></footer>
      </div>
    </div>
  );
}

export default App;
