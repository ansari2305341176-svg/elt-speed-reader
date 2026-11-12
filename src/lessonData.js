export const notice = {
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

export const levels = [
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
        tip: "Scanning tip: Decide what information you need - in this case, a phone extension - then move your eyes quickly through the text to find the number."
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


