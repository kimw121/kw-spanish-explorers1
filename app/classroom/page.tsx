
"use client";

import { useEffect, useState } from "react";

type Scene = "welcome" | "greetings" | "introductions" | "school" | "game" | "quiz" | "goodbye";
type Word = { es: string; en: string; emoji: string };
type Question = { prompt: string; answer: string; choices: string[]; audio?: string };

const NAV: { id: Scene; title: string; emoji: string }[] = [
  { id: "welcome", title: "Our World", emoji: "🌎" },
  { id: "greetings", title: "Say Hello", emoji: "👋" },
  { id: "introductions", title: "Meet Me", emoji: "🧒🏽" },
  { id: "school", title: "My School", emoji: "🎒" },
  { id: "game", title: "Play!", emoji: "🎮" },
  { id: "quiz", title: "Super Quiz", emoji: "🏆" },
  { id: "goodbye", title: "Goodbye!", emoji: "🎉" },
];

const GREETINGS: Word[] = [
  { es: "¡Hola!", en: "Hello!", emoji: "👋" },
  { es: "Buenos días", en: "Good morning", emoji: "🌞" },
  { es: "Buenas tardes", en: "Good afternoon", emoji: "🌤️" },
  { es: "Buenas noches", en: "Good evening / night", emoji: "🌙" },
  { es: "¿Cómo estás?", en: "How are you?", emoji: "💬" },
  { es: "Estoy bien", en: "I am fine", emoji: "😃" },
  { es: "Muy bien, gracias", en: "Very well, thank you", emoji: "🥰" },
  { es: "Adiós", en: "Goodbye", emoji: "👋" },
];

const SCHOOL: Word[] = [
  { es: "la mochila", en: "the backpack", emoji: "🎒" },
  { es: "el lápiz", en: "the pencil", emoji: "✏️" },
  { es: "el libro", en: "the book", emoji: "📚" },
  { es: "el cuaderno", en: "the notebook", emoji: "📓" },
  { es: "la regla", en: "the ruler", emoji: "📏" },
  { es: "la goma", en: "the eraser", emoji: "🧽" },
  { es: "la silla", en: "the chair", emoji: "🪑" },
  { es: "la mesa", en: "the table", emoji: "🪵" },
];

const QUIZ: Question[] = [
  { prompt: "How do you say HELLO?", choices: ["Adiós", "¡Hola!", "Gracias"], answer: "¡Hola!" },
  { prompt: "What does 'Buenos días' mean?", choices: ["Good night", "Good morning", "Goodbye"], answer: "Good morning" },
  { prompt: "Which word means BACKPACK?", choices: ["la mochila", "el libro", "la regla"], answer: "la mochila" },
  { prompt: "What does 'Me llamo Ana' mean?", choices: ["I live in Ana", "My name is Ana", "I am eight"], answer: "My name is Ana" },
  { prompt: "How do you ask someone's name?", choices: ["¿Cómo estás?", "¿Qué hora es?", "¿Cómo te llamas?"], answer: "¿Cómo te llamas?" },
  { prompt: "Listen to the Spanish. What is it?", choices: ["the notebook", "the pencil", "the book"], answer: "the pencil", audio: "el lápiz" },
  { prompt: "What does 'Estoy bien' mean?", choices: ["I am fine", "I am late", "I am hungry"], answer: "I am fine" },
  { prompt: "How do you say GOODBYE?", choices: ["Buenos días", "Adiós", "¡Hola!"], answer: "Adiós" },
];

function speak(value: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(value);
  u.lang = "es-ES";
  u.rate = 0.75;
  u.pitch = 1.08;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith("es"));
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

function randomize<T,>(arr: T[]) {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function ClassroomWorld({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="world-stage">
      <div className="sky-sun">☀️</div>
      <div className="sky-cloud cloud-a">☁️</div>
      <div className="sky-cloud cloud-b">☁️</div>
      <div className="hill hill-one" />
      <div className="hill hill-two" />
      <div className="road" />

      <div className="cartoon-school">
        <div className="school-roof" />
        <div className="school-wall">
          <div className="school-sign">ESPAÑOL</div>
          <span className="school-window">🪟</span>
          <span className="school-door">🚪</span>
          <span className="school-window">🪟</span>
        </div>
      </div>

      <div className="world-tree tree-left">🌳</div>
      <div className="world-tree tree-right">🌴</div>
      <span className="world-flower f1">🌼</span>
      <span className="world-flower f2">🌺</span>
      <span className="world-flower f3">🦋</span>

      <div className="world-kids">
        <span>👧🏽</span><span>👦🏻</span><span>👧🏿</span>
      </div>

      <div className="world-dialogue">¡Hola, amigos! 👋</div>
      <button className="world-enter" onClick={onEnter}>🚀 Enter the classroom!</button>
    </div>
  );
}

function Parrot({ message, onTalk }: { message: string; onTalk?: () => void }) {
  return (
    <div className="parrot-guide">
      <div className="parrot-face">🦜</div>
      <div className="parrot-bubble">
        <strong>¡Hola! I'm Paco the Parrot!</strong>
        <p>{message}</p>
      </div>
      {onTalk && <button className="round-sound" onClick={onTalk} aria-label="Hear Paco speak Spanish">🔊</button>}
    </div>
  );
}

export default function ClassroomPage() {
  const [scene, setScene] = useState<Scene>("welcome");
  const [xp, setXp] = useState(0);
  const [earned, setEarned] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("8");
  const [studentPlace, setStudentPlace] = useState("Jamaica");
  const [studentFeeling, setStudentFeeling] = useState("bien");
  const [practiceText, setPracticeText] = useState("");
  const [heard, setHeard] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [schoolIndex, setSchoolIndex] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameChoice, setGameChoice] = useState<string | null>(null);
  const [gameOptions, setGameOptions] = useState<string[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem("kw-first-class-v1");
      if (value) {
        const data = JSON.parse(value);
        if (typeof data.xp === "number") setXp(data.xp);
        if (Array.isArray(data.earned)) setEarned(data.earned);
        if (typeof data.studentName === "string") setStudentName(data.studentName);
        if (typeof data.practiceText === "string") setPracticeText(data.practiceText);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("kw-first-class-v1", JSON.stringify({ xp, earned, studentName, practiceText }));
    } catch {}
  }, [xp, earned, studentName, practiceText, loaded]);

  function reward(key: string, amount: number) {
    if (!loaded || earned.includes(key)) return;
    setEarned((previous) => [...previous, key]);
    setXp((previous) => previous + amount);
    setToast(`🌟 +${amount} XP! ¡Excelente!`);
  }

  function go(next: Scene) {
    setScene(next);
    setToast("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextGreeting() {
    setGreetingIndex((i) => (i + 1) % GREETINGS.length);
    setShowEnglish(false);
  }

  const fullIntro = [
    "¡Hola!",
    `Me llamo ${studentName.trim() || "Ana"}.`,
    `Tengo ${studentAge} años.`,
    `Soy de ${studentPlace.trim() || "Jamaica"}.`,
    `Estoy ${studentFeeling}.`,
    "¡Mucho gusto!",
  ].join(" ");

  function startMicrophone() {
    if (typeof window === "undefined") return;
    const browser = window as any;
    const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Recognition) {
      setToast("Microphone practice is not available in this browser. Try listening and repeating aloud.");
      return;
    }
    try {
      const recognition = new Recognition();
      recognition.lang = "es-ES";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        setHeard(e.results[0][0].transcript);
        reward("speaking", 25);
      };
      recognition.onerror = () => {
        setToast("Microphone couldn't hear clearly. Please try again.");
        setMicActive(false);
      };
      recognition.onend = () => setMicActive(false);
      recognition.start();
      setMicActive(true);
    } catch {
      setToast("Microphone could not start. You can still repeat aloud.");
      setMicActive(false);
    }
  }

  const currentGameWord = SCHOOL[gameIndex % SCHOOL.length];
  const currentGameOptions = gameOptions.length
    ? gameOptions
    : [currentGameWord.en, ...SCHOOL.filter((w) => w.en !== currentGameWord.en).slice(0, 2).map((w) => w.en)];

  function beginGameRound() {
    const others = randomize(SCHOOL.filter((w) => w.en !== currentGameWord.en)).slice(0, 2);
    setGameOptions(randomize([currentGameWord.en, ...others.map((w) => w.en)]));
    setGameChoice(null);
    speak(currentGameWord.es);
  }

  function selectGame(value: string) {
    if (gameChoice !== null) return;
    setGameChoice(value);
    if (value === currentGameWord.en) reward(`game-${gameIndex}`, 15);
  }

  function nextGame() {
    setGameIndex((i) => (i + 1) % SCHOOL.length);
    setGameChoice(null);
    setGameOptions([]);
  }

  function pickQuiz(choice: string) {
    if (quizAnswer !== null) return;
    setQuizAnswer(choice);
    if (choice === QUIZ[quizIndex].answer) setQuizScore((score) => score + 1);
  }

  function advanceQuiz() {
    if (quizIndex === QUIZ.length - 1) {
      const bonus = quizScore * 10;
      reward("first-class-quiz", bonus || 5);
      setQuizDone(true);
    } else {
      setQuizIndex((i) => i + 1);
      setQuizAnswer(null);
    }
  }

  const sceneIndex = NAV.findIndex((item) => item.id === scene);
  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="classroom-app">
      <style>{CSS}</style>

      <header className="app-header">
        <button className="logo" onClick={() => go("welcome")}>
          <span>🌎</span>
          <span><strong>KW Translations</strong><small>SPANISH EXPLORERS · GRADE 3</small></span>
        </button>
        <div className="stats">
          <span>⭐ {xp} XP</span>
          <span>🏆 Level {level}</span>
          <span>🎒 Lesson 1</span>
        </div>
      </header>

      <nav className="lesson-nav" aria-label="Classroom lesson sections">
        {NAV.map((n) => (
          <button key={n.id} className={scene === n.id ? "selected" : ""} onClick={() => go(n.id)}>
            <span>{n.emoji}</span> {n.title}
          </button>
        ))}
      </nav>

      <main className="classroom-main">
        {toast && <div className="class-toast" role="status">{toast}<button onClick={() => setToast("")}>×</button></div>}

        {scene === "welcome" && (
          <>
            <section className="opening-banner">
              <span className="eyebrow white">KW TRANSLATIONS PRESENTS</span>
              <h1>¡Bienvenidos a Español!</h1>
              <p>Welcome to your very first Spanish adventure!</p>
              <div className="opening-badges"><span>👋 Say Hello</span><span>🧒 Meet Friends</span><span>🎒 Explore School</span><span>🎮 Play & Learn</span></div>
            </section>
            <ClassroomWorld onEnter={() => go("greetings")} />
            <Parrot message="Today we'll meet friends, speak Spanish and play some awesome games! Tap around the classroom and help me learn!" onTalk={() => speak("¡Hola, amigos! ¡Bienvenidos a la clase de español!")} />
            <div className="welcome-objectives">
              <h2>🎯 Today's Superpowers</h2>
              <div className="objective-grid">
                <div><span>👋</span><strong>I can greet someone</strong><p>Hola, buenos días, adiós</p></div>
                <div><span>🙋</span><strong>I can introduce myself</strong><p>Me llamo... Tengo... años</p></div>
                <div><span>🎒</span><strong>I can name school objects</strong><p>El libro, la mochila, el lápiz</p></div>
                <div><span>🌟</span><strong>I can speak Spanish!</strong><p>Learn, practise, try again</p></div>
              </div>
            </div>
            <div className="center"><button className="btn yellow big" onClick={() => go("greetings")}>🚀 Begin Lesson 1 →</button></div>
          </>
        )}

        {scene === "greetings" && (
          <>
            <div className="section-heading"><span className="eyebrow">ADVENTURE 1 · SPEAKING</span><h1>👋 Let's Say Hello!</h1><p>Listen to our cartoon friends, then say the greetings aloud.</p></div>
            <Parrot message="When I say ¡Hola!, everyone waves and says ¡Hola! back. Ready?" onTalk={() => speak("¡Hola! Buenos días. ¿Cómo estás?")} />
            <div className="greeting-world">
              <div className="greeting-friend"><div className="character-bubble">¡Hola!</div><span>👧🏽</span><strong>María</strong></div>
              <div className="greeting-main">
                <span className="lesson-counter">Greeting {greetingIndex + 1} of {GREETINGS.length}</span>
                <div className="greeting-emoji">{GREETINGS[greetingIndex].emoji}</div>
                <h2>{GREETINGS[greetingIndex].es}</h2>
                <p>{showEnglish ? GREETINGS[greetingIndex].en : "What do you think it means?"}</p>
                <div className="action-row">
                  <button className="btn purple" onClick={() => { speak(GREETINGS[greetingIndex].es); reward(`greeting-${greetingIndex}`, 5); }}>🔊 Listen and Repeat</button>
                  <button className="btn outline" onClick={() => setShowEnglish(!showEnglish)}>{showEnglish ? "🙈 Hide Meaning" : "👀 Show Meaning"}</button>
                </div>
                <button className="btn green" onClick={nextGreeting}>Next Greeting →</button>
              </div>
              <div className="greeting-friend"><div className="character-bubble second">¡Buenos días!</div><span>👦🏿</span><strong>Juan</strong></div>
            </div>
            <div className="cards-grid">
              {GREETINGS.map((w, i) => (
                <button className="picture-card" key={w.es} onClick={() => { setGreetingIndex(i); setShowEnglish(true); speak(w.es); reward(`greeting-${i}`, 5); }}>
                  <span>{w.emoji}</span><strong>{w.es}</strong><small>{w.en}</small><b>🔊</b>
                </button>
              ))}
            </div>
            <section className="challenge-banner"><span>🎭</span><div><h2>Act It Out!</h2><p>One student says “¡Hola!” and the other replies “¡Buenos días!” Swap roles and try a new greeting.</p></div><button className="btn yellow" onClick={() => go("introductions")}>Meet Our Friends →</button></section>
          </>
        )}

        {scene === "introductions" && (
          <>
            <div className="section-heading"><span className="eyebrow">ADVENTURE 2 · MY SPANISH IDENTITY</span><h1>🧒🏽 Who Am I?</h1><p>Build a Spanish introduction and practise it with your cartoon friends!</p></div>
            <Parrot message="¡Me llamo Paco! That means My name is Paco. Now it's your turn!" onTalk={() => speak("Me llamo Paco. ¿Cómo te llamas?")} />
            <div className="dialogue-scene">
              <div className="dialogue-person"><span>👧🏽</span><strong>María</strong><button onClick={() => speak("¡Hola! Me llamo María. ¿Cómo te llamas?")}>🔊 ¡Hola! Me llamo María. ¿Cómo te llamas?</button></div>
              <div className="dialogue-person"><span>👦🏻</span><strong>Juan</strong><button onClick={() => speak("Me llamo Juan. Mucho gusto.")}>🔊 Me llamo Juan. Mucho gusto.</button></div>
            </div>
            <div className="two-columns">
              <div className="panel">
                <h2>✍️ My Explorer Passport</h2>
                <p>Fill in the spaces and see your Spanish introduction come alive!</p>
                <label>What is your name?<input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Daniel" maxLength={35}/></label>
                <label>How old are you?<select value={studentAge} onChange={(e) => setStudentAge(e.target.value)}>{["7","8","9","10","11","12"].map((n) => <option key={n}>{n}</option>)}</select></label>
                <label>Where are you from?<input value={studentPlace} onChange={(e) => setStudentPlace(e.target.value)} placeholder="Jamaica" maxLength={40}/></label>
                <label>How do you feel today?<select value={studentFeeling} onChange={(e) => setStudentFeeling(e.target.value)}><option value="bien">😊 Bien</option><option value="feliz">😄 Feliz</option><option value="triste">😢 Triste</option><option value="cansado">😴 Cansado (boy)</option><option value="cansada">😴 Cansada (girl)</option></select></label>
                <button className="btn purple" onClick={() => { speak(fullIntro); reward("intro-full", 20); }}>🔊 Hear My Introduction</button>
              </div>
              <div className="panel passport-preview">
                <div className="passport-avatar">🧑🏽‍🚀</div>
                <span className="eyebrow">MY SPANISH EXPLORER PASSPORT</span>
                <h2>¡Hola, {studentName.trim() || "amigo"}!</h2>
                <div className="passport-lines">
                  {fullIntro.split(". ").map((line, i) => <button key={i} onClick={() => { speak(line); reward(`intro-line-${i}`, 3); }}>🔊 {line.endsWith(".") || line.endsWith("!") ? line : `${line}.`}</button>)}
                </div>
                <div className="action-row">
                  <button className="btn green" onClick={() => { reward("intro-ready", 20); setToast("¡Muy bien! Your passport is ready!"); }}>🌟 My Passport Is Ready!</button>
                </div>
              </div>
            </div>
            <div className="two-columns">
              <div className="panel">
                <h2>📝 Write Your Own Introduction</h2>
                <p>Try to write at least three complete sentences in Spanish.</p>
                <textarea rows={7} value={practiceText} onChange={(e) => setPracticeText(e.target.value)} placeholder={"¡Hola!\nMe llamo...\nTengo ... años.\nSoy de...\nEstoy..."} />
                <button className="btn purple" onClick={() => { if (practiceText.trim().split(/\s+/).length < 10) setToast("Write a little more before completing your mission."); else { reward("intro-writing", 25); setToast("Wonderful writing! Ask your teacher to read it."); } }}>✅ Finish Writing</button>
              </div>
              <div className="panel speaking-card">
                <h2>🎤 Speaking Superstar!</h2>
                <p>Listen to your introduction, then try saying it aloud.</p>
                <span className="giant-mic">🎙️</span>
                <div className="action-row">
                  <button className="btn outline" onClick={() => speak(fullIntro)}>🔊 Listen First</button>
                  <button className="btn purple" disabled={micActive} onClick={startMicrophone}>{micActive ? "🎤 Listening..." : "🎤 Try Speaking"}</button>
                </div>
                {heard && <div className="feedback"><strong>What the microphone heard:</strong><p>{heard}</p></div>}
                <p className="small-note">The microphone is optional and works only in supported browsers with permission. Children can always practise aloud without it.</p>
              </div>
            </div>
            <section className="challenge-banner"><span>🗣️</span><div><h2>Partner Challenge!</h2><p>Ask your friend “¿Cómo te llamas?” and “¿Cuántos años tienes?” Let your partner answer in Spanish.</p></div><button className="btn yellow" onClick={() => go("school")}>Go to School →</button></section>
          </>
        )}

        {scene === "school" && (
          <>
            <div className="section-heading"><span className="eyebrow">ADVENTURE 3 · MY CLASSROOM</span><h1>🎒 What's in My Schoolbag?</h1><p>Tap each cartoon object to hear its Spanish name.</p></div>
            <Parrot message="I have a magic schoolbag! Can you help me name everything inside in Spanish?" onTalk={() => speak("¿Qué hay en la mochila? ¡Vamos a aprender!")} />
            <div className="school-scene">
              <div className="schoolboard"><span>¡Bienvenidos!</span><strong>Nuestra escuela</strong><small>📚 ✏️ 🎒</small></div>
              <div className="school-character">👩🏽‍🏫</div>
              <div className="school-objects">
                {SCHOOL.map((w, index) => <button key={w.es} className={schoolIndex === index ? "active" : ""} onClick={() => { setSchoolIndex(index); speak(w.es); reward(`school-${index}`, 5); }}><span>{w.emoji}</span><strong>{w.es}</strong><small>🔊 Tap to listen</small></button>)}
              </div>
            </div>
            <div className="featured-word">
              <span>{SCHOOL[schoolIndex].emoji}</span>
              <div><small>LOOK · LISTEN · SAY IT</small><h2>{SCHOOL[schoolIndex].es}</h2><p>{SCHOOL[schoolIndex].en}</p><button className="btn purple" onClick={() => speak(SCHOOL[schoolIndex].es)}>🔊 Listen Again</button></div>
            </div>
            <div className="classroom-activities">
              <h2>🎭 Show Me!</h2>
              <p>Teacher says a Spanish word. Students point to or hold up the correct school object!</p>
              <div className="activity-pills">{SCHOOL.slice(0, 6).map(w => <button key={w.es} onClick={() => speak(w.es)}>{w.emoji} {w.es} 🔊</button>)}</div>
            </div>
            <div className="center"><button className="btn green big" onClick={() => go("game")}>🎮 Let's Play a Game →</button></div>
          </>
        )}

        {scene === "game" && (
          <>
            <div className="section-heading"><span className="eyebrow">ADVENTURE 4 · LISTENING GAME</span><h1>🎮 Paco's Mystery Object!</h1><p>Listen to Paco's Spanish word. Can you find the correct English meaning?</p></div>
            <Parrot message="I know all these Spanish words! Can you guess what I'm saying?" onTalk={() => speak(currentGameWord.es)} />
            <section className="game-arena">
              <div className="game-mascot">🦜</div>
              <span className="lesson-counter">Mystery Word {gameIndex + 1} of {SCHOOL.length}</span>
              <h2>What did Paco say?</h2>
              <button className="giant-sound" onClick={beginGameRound}>🔊</button>
              <p>Tap the speaker to listen!</p>
              <div className="game-choices">
                {currentGameOptions.map((choice) => <button key={choice} disabled={gameChoice !== null} className={gameChoice !== null && choice === currentGameWord.en ? "correct" : gameChoice === choice ? "incorrect" : ""} onClick={() => selectGame(choice)}>{choice}</button>)}
              </div>
              {gameChoice !== null && <div className="game-result"><strong>{gameChoice === currentGameWord.en ? "🎉 ¡Excelente!" : "💡 Good try!"}</strong><p>{currentGameWord.es} means {currentGameWord.en}.</p><button className="btn green" onClick={nextGame}>Next Mystery →</button></div>}
            </section>
            <div className="center"><button className="btn yellow" onClick={() => go("quiz")}>🏆 Take the Super Quiz →</button></div>
          </>
        )}

        {scene === "quiz" && (
          <>
            <div className="section-heading"><span className="eyebrow">FINAL CHALLENGE</span><h1>🏆 The Spanish Superstar Quiz!</h1><p>Show us everything you've learned today!</p></div>
            {!quizDone ? (
              <section className="quiz-arena">
                <div className="quiz-top"><strong>Question {quizIndex + 1} of {QUIZ.length}</strong><span>⭐ {quizScore} correct</span></div>
                <div className="progress-track"><div style={{ width: `${(quizIndex / QUIZ.length) * 100}%` }}/></div>
                <div className="quiz-mascot">🧠</div>
                <h2>{QUIZ[quizIndex].prompt}</h2>
                {QUIZ[quizIndex].audio && <button className="btn purple" onClick={() => speak(QUIZ[quizIndex].audio!)}>🔊 Listen to the Spanish</button>}
                <div className="game-choices quiz-choices">
                  {QUIZ[quizIndex].choices.map(choice => <button key={choice} disabled={quizAnswer !== null} className={quizAnswer !== null && choice === QUIZ[quizIndex].answer ? "correct" : quizAnswer === choice ? "incorrect" : ""} onClick={() => pickQuiz(choice)}>{choice}</button>)}
                </div>
                {quizAnswer !== null && <div className="game-result"><h3>{quizAnswer === QUIZ[quizIndex].answer ? "🎉 ¡Muy bien!" : "💜 Keep practising!"}</h3><p>Correct answer: {QUIZ[quizIndex].answer}</p><button className="btn green" onClick={advanceQuiz}>{quizIndex === QUIZ.length - 1 ? "🏆 See My Results" : "Next Question →"}</button></div>}
              </section>
            ) : (
              <section className="quiz-arena results"><span>🏆🎊🌟</span><h2>¡Felicidades!</h2><p>You completed your first Spanish lesson!</p><div className="big-result">{quizScore} / {QUIZ.length}</div><p>Every time you practise, your Spanish grows stronger!</p><div className="action-row"><button className="btn outline" onClick={() => { setQuizIndex(0); setQuizAnswer(null); setQuizScore(0); setQuizDone(false); }}>🔄 Play Again</button><button className="btn yellow" onClick={() => go("goodbye")}>🎉 Graduation Celebration →</button></div></section>
            )}
          </>
        )}

        {scene === "goodbye" && (
          <>
            <section className="celebration">
              <div className="celebration-icons">🎊 ⭐ 🎈 🏆 🎉</div>
              <span className="eyebrow white">MISSION COMPLETE</span>
              <h1>¡Felicidades, exploradores!</h1>
              <p>Congratulations! You've completed your very first Spanish adventure!</p>
              <div className="graduation-kids">👧🏽 👦🏻 👧🏿 👦🏽</div>
              <div className="graduation-score">🌟 {xp} XP earned</div>
              <div className="action-row">
                <button className="btn yellow" onClick={() => { speak("¡Muy bien! ¡Felicidades! ¡Hasta luego, amigos!"); setShowCelebration(true); }}>🔊 Celebrate With Paco!</button>
                <button className="btn outline light" onClick={() => go("welcome")}>🌎 Back to My World</button>
              </div>
              {showCelebration && <div className="celebration-message">🎉 ¡Muy bien! ¡Hasta luego, amigos! 🎉</div>}
            </section>
            <div className="goodbye-card"><span>🦜</span><div><h2>One Last Thing!</h2><p>Before you leave, turn to a friend and say: “¡Adiós! ¡Hasta luego!”</p><button className="btn purple" onClick={() => speak("¡Adiós! ¡Hasta luego!")}>🔊 Hear Our Goodbye</button></div></div>
          </>
        )}

        <div className="bottom-navigation">
          <button disabled={sceneIndex === 0} onClick={() => go(NAV[sceneIndex - 1].id)}>← Previous Adventure</button>
          <span>{sceneIndex + 1} / {NAV.length} · Grade 3 Spanish</span>
          <button disabled={sceneIndex === NAV.length - 1} onClick={() => go(NAV[sceneIndex + 1].id)}>Next Adventure →</button>
        </div>
      </main>

      <footer className="class-footer"><strong>🌎 KW Translations Spanish Explorers</strong><p>Learn a language. Explore a world. Shine bright!</p><small>Grade 3 · Interactive First Spanish Lesson</small></footer>
    </div>
  );
}

const CSS = `
.classroom-app{--purple:#7452cb;--deep:#473586;--ink:#28334f;--muted:#6e7b95;--yellow:#ffdf6e;--green:#55d7a0;color:var(--ink);min-height:100vh;background:#f6f8ff;font-family:Arial,Helvetica,sans-serif}
.classroom-app *{box-sizing:border-box}
.classroom-app button,.classroom-app input,.classroom-app select,.classroom-app textarea{font:inherit}
.classroom-app button{cursor:pointer}
.classroom-app button:disabled{opacity:.6;cursor:default}
.classroom-app button:focus-visible,.classroom-app input:focus-visible,.classroom-app textarea:focus-visible,.classroom-app select:focus-visible{outline:3px solid #efaa43;outline-offset:3px}
.app-header{background:white;padding:16px max(22px,calc((100% - 1200px)/2));display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e8e5f3}
.logo{border:0;background:none;text-align:left;display:flex;align-items:center;gap:11px;color:var(--deep)}
.logo>span:first-child{font-size:39px}
.logo strong,.logo small{display:block}
.logo strong{font-size:20px}
.logo small{font-size:11px;font-weight:900;letter-spacing:1.2px;margin-top:4px}
.stats{display:flex;flex-wrap:wrap;gap:8px}
.stats span{background:#f0eaff;color:#6846b3;padding:10px 13px;border-radius:30px;font-size:12px;font-weight:900}
.stats span:first-child{background:#fff3cd;color:#7b5a17}
.lesson-nav{display:flex;gap:9px;justify-content:center;background:white;padding:13px 16px;overflow-x:auto;border-bottom:1px solid #e8e5f3}
.lesson-nav button{white-space:nowrap;flex-shrink:0;border:0;background:transparent;border-radius:13px;padding:11px 14px;color:#6c728b;font-size:13px;font-weight:900}
.lesson-nav button.selected{color:white;background:var(--purple)}
.classroom-main{max-width:1200px;margin:0 auto;padding:24px 20px 60px}
.class-toast{position:sticky;top:10px;z-index:30;background:#fff1be;color:#745119;padding:13px 18px;border-radius:15px;display:flex;justify-content:space-between;gap:20px;font-weight:900;box-shadow:0 8px 18px #44366822;margin-bottom:15px}
.class-toast button{border:0;background:transparent;font-size:20px;color:inherit}
.opening-banner{text-align:center;background:linear-gradient(120deg,#7353d3,#ab7bdf,#ec8eaf);color:white;border-radius:26px;padding:35px 20px;margin-bottom:20px}
.eyebrow{font-size:11px;font-weight:900;letter-spacing:1.6px;color:#7651c1}
.eyebrow.white{color:#ffefaf}
.opening-banner h1{font-size:clamp(31px,5vw,55px);margin:13px 0}
.opening-banner p{font-size:18px}
.opening-badges{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:21px}
.opening-badges span{background:#ffffff30;padding:10px 13px;border-radius:20px;font-size:12px;font-weight:900}
.world-stage{height:490px;position:relative;overflow:hidden;border-radius:28px;background:linear-gradient(#8bd5ff 0%,#d1f5ff 56%,#bfecc0 57%,#80cf91 100%);box-shadow:0 12px 28px #38538329}
.sky-sun{position:absolute;right:13%;top:8%;font-size:76px;filter:drop-shadow(0 0 30px #ffe286)}
.sky-cloud{position:absolute;font-size:70px;opacity:.9;animation:cloudMove 6s ease-in-out infinite alternate}
.cloud-a{top:7%;left:12%}.cloud-b{top:18%;right:31%;animation-delay:-3s}
.hill{position:absolute;border-radius:50%;width:110%;height:75%;background:linear-gradient(#a7e89a,#5dbd83);bottom:-49%}
.hill-one{left:-45%}.hill-two{right:-43%;background:linear-gradient(#b5ef9e,#53bd86)}
.road{position:absolute;width:190px;height:330px;bottom:-210px;left:calc(50% - 95px);background:linear-gradient(90deg,#e7be7e,#fff0c0,#e8ba78);transform:perspective(400px) rotateX(32deg);border-radius:50% 50% 0 0}
.cartoon-school{position:absolute;width:300px;height:250px;top:31%;left:calc(50% - 150px);filter:drop-shadow(15px 17px 11px #25577052)}
.school-roof{height:75px;width:320px;position:absolute;left:-10px;top:0;background:linear-gradient(145deg,#ffba82,#f07891 60%,#bd628f);clip-path:polygon(50% 0,100% 100%,0 100%)}
.school-wall{position:absolute;top:71px;height:168px;width:290px;left:5px;background:linear-gradient(110deg,#fff7d9 70%,#e4b98e 70%);border-radius:5px;display:flex;justify-content:space-around;align-items:center}
.school-sign{position:absolute;top:12px;left:77px;background:white;border-radius:9px;padding:6px 12px;color:#7351a7;font-size:15px;font-weight:900}
.school-window{font-size:50px}.school-door{font-size:85px;align-self:flex-end;line-height:1}
.world-tree{position:absolute;font-size:140px;filter:drop-shadow(12px 15px 7px #275d484d)}
.tree-left{left:8%;bottom:11%}.tree-right{right:7%;bottom:9%}
.world-flower{position:absolute;font-size:36px}.f1{left:14%;bottom:7%}.f2{right:15%;bottom:4%}.f3{right:25%;top:23%;animation:float 4s infinite}
.world-kids{position:absolute;display:flex;gap:8px;left:calc(50% - 120px);bottom:5%;font-size:79px;filter:drop-shadow(9px 9px 5px #34474f44);animation:float 3s ease-in-out infinite}
.world-dialogue{position:absolute;left:8%;top:16%;padding:14px 19px;background:white;border-radius:22px;box-shadow:0 8px 20px #3555692d;color:#7246a8;font-weight:900;transform:rotate(-6deg)}
.world-enter{position:absolute;right:20px;bottom:21px;background:#ffdc75;border:0;color:#654716;padding:16px 21px;border-radius:16px;font-weight:900!important;box-shadow:0 6px 0 #d5aa51}
@keyframes cloudMove{to{transform:translateX(30px)}}
@keyframes float{50%{transform:translateY(-12px)}}
.parrot-guide{display:flex;align-items:center;gap:17px;background:white;border:2px solid #e8e2f8;border-radius:23px;padding:19px;margin:22px 0}
.parrot-face{font-size:64px;animation:float 3s infinite}
.parrot-bubble{flex:1}.parrot-bubble strong{color:#6444aa;font-size:18px}.parrot-bubble p{margin:8px 0 0;color:#748096;line-height:1.5}
.round-sound{background:#eee8ff;border:0;border-radius:50%;width:49px;height:49px;font-size:22px;flex-shrink:0}
.welcome-objectives,.panel,.game-arena,.quiz-arena{background:white;border:1px solid #e9e5f3;border-radius:24px;padding:25px;margin:25px 0}
.welcome-objectives h2{font-size:26px}
.objective-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}
.objective-grid>div{background:#f4f0ff;padding:19px;text-align:center;border-radius:18px}
.objective-grid span{display:block;font-size:45px;margin-bottom:12px}
.objective-grid strong{display:block;font-size:14px}
.objective-grid p{font-size:12px;color:#74738c;line-height:1.5}
.btn{min-height:46px;border:0;border-radius:14px;padding:13px 19px;font-weight:900!important;font-size:14px;transition:transform .16s}
.btn:hover:not(:disabled){transform:translateY(-3px)}
.btn.yellow{background:#ffda70;color:#634718;box-shadow:0 4px 0 #d4a84d}
.btn.purple{background:var(--purple);color:white;box-shadow:0 4px 0 #5539a9}
.btn.green{background:#54d5a0;color:#20583e;box-shadow:0 4px 0 #39ab7c}
.btn.outline{background:#f1eaff;color:#6544ad;border:2px solid #daccf2}
.btn.outline.light{background:#ffffff35;color:white;border:2px solid #ffffff80}
.btn.big{padding:17px 26px;font-size:17px}
.center{text-align:center;margin:30px 0}
.section-heading{text-align:center;margin:34px auto 25px}
.section-heading h1{font-size:clamp(28px,4vw,42px);margin:11px 0}
.section-heading p{color:#768199;font-size:16px}
.greeting-world{display:grid;grid-template-columns:1fr 2fr 1fr;gap:10px;align-items:center;background:linear-gradient(145deg,#fff1d3,#ecdeff);border-radius:27px;padding:29px 18px;margin-bottom:25px}
.greeting-friend{text-align:center}.greeting-friend>span{display:block;font-size:clamp(60px,8vw,115px);filter:drop-shadow(7px 10px 5px #5e537e42)}
.greeting-friend strong{display:block;margin-top:15px}.character-bubble{background:white;color:#7950bd;padding:12px 9px;border-radius:20px;font-weight:900;transform:rotate(-6deg);font-size:13px}.character-bubble.second{transform:rotate(6deg)}
.greeting-main{text-align:center;background:#ffffffdb;border-radius:23px;padding:26px 15px}
.lesson-counter{display:inline-block;background:#f1e9ff;color:#7853b9;font-size:12px;font-weight:900;border-radius:30px;padding:9px 15px}
.greeting-emoji{font-size:72px;margin:13px 0}
.greeting-main h2{font-size:clamp(26px,4vw,38px);color:#5b3b9d;margin:12px 0}
.greeting-main p{color:#7a7992}
.action-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:22px 0}
.cards-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.picture-card{background:white;border:2px solid #e7e2f7;border-radius:20px;min-height:175px;padding:17px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#35405b;transition:transform .2s}
.picture-card:hover{transform:translateY(-5px);border-color:#ad90e5}
.picture-card span{font-size:45px}.picture-card strong{font-size:14px}.picture-card small{color:#7c8498}.picture-card b{color:#714eae;font-size:12px}
.challenge-banner{display:flex;align-items:center;gap:17px;background:linear-gradient(100deg,#7852c9,#ab84df);color:white;border-radius:23px;padding:25px;margin:30px 0;flex-wrap:wrap}
.challenge-banner>span{font-size:57px}.challenge-banner>div{flex:1 1 210px}.challenge-banner h2{margin:0 0 9px}.challenge-banner p{line-height:1.6;margin:0}
.dialogue-scene{display:grid;grid-template-columns:1fr 1fr;gap:17px;background:linear-gradient(130deg,#e0f5ff,#f6e6ff);padding:25px;border-radius:24px}
.dialogue-person{text-align:center}.dialogue-person>span{display:block;font-size:95px}.dialogue-person>strong{display:block;margin:7px}
.dialogue-person>button{border:0;background:white;padding:18px;border-radius:18px;max-width:300px;font-weight:800;color:#6645a9;line-height:1.5}
.two-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}
.panel h2{font-size:23px;margin-top:0}.panel>p{color:#778096;line-height:1.6}
.panel label{display:block;font-size:13px;font-weight:900;color:#6545ab;margin:16px 0}
.panel input,.panel select,.panel textarea{display:block;width:100%;border:2px solid #e1daf2;border-radius:13px;padding:13px;background:#faf9ff;color:#29324d;margin-top:8px}
.panel textarea{min-height:180px;resize:vertical;line-height:1.6}
.passport-preview{background:linear-gradient(150deg,#fff,#f3eaff)}
.passport-avatar{text-align:center;font-size:75px}
.passport-preview>.eyebrow{display:block;text-align:center;margin-top:15px}
.passport-preview h2{text-align:center;margin-top:13px}
.passport-lines{display:grid;gap:9px}
.passport-lines button{border:0;text-align:left;background:white;border-radius:12px;padding:12px;color:#6745af;font-weight:800;line-height:1.5}
.speaking-card{text-align:center}.giant-mic{display:block;font-size:100px;margin:22px}.small-note{font-size:12px!important;line-height:1.6}
.feedback{background:#e4f9ed;color:#26714e;border-radius:14px;padding:16px;margin-top:18px;line-height:1.6}
.school-scene{background:linear-gradient(#b7e6ff 0 45%,#ffebcf 45% 100%);border-radius:26px;overflow:hidden;padding:25px;position:relative;min-height:420px}
.schoolboard{margin:0 auto 20px;max-width:550px;background:#27745d;border:15px solid #aa7b59;border-radius:12px;box-shadow:5px 9px 14px #473e5140;color:white;text-align:center;display:flex;flex-direction:column;padding:13px;gap:7px;min-height:155px}
.schoolboard span{font-size:22px;font-weight:900}.schoolboard strong{font-size:32px}.schoolboard small{font-size:24px}
.school-character{position:absolute;left:3%;bottom:5%;font-size:80px}
.school-objects{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:780px;margin:20px auto 10px;position:relative;z-index:2}
.school-objects button{border:3px solid white;border-radius:15px;background:#ffffffed;display:flex;align-items:center;flex-direction:column;padding:12px 4px;min-height:105px;color:#5b4298}
.school-objects button.active{border-color:#ad85ed;background:#efe8ff}
.school-objects span{font-size:38px}.school-objects strong{font-size:12px}.school-objects small{font-size:10px;color:#7e7597;margin-top:5px}
.featured-word{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:center;margin:23px 0;border-radius:24px;background:linear-gradient(120deg,#f0e8ff,#ffeafa);padding:23px}
.featured-word>span{text-align:center;font-size:120px;filter:drop-shadow(9px 10px 5px #5e507e52)}
.featured-word small{color:#845ec3;font-weight:900}.featured-word h2{font-size:34px;margin:12px 0}.featured-word p{color:#7c7b91}
.classroom-activities{border-radius:20px;background:white;padding:24px;margin:22px 0}
.classroom-activities p{color:#778096}.activity-pills{display:flex;flex-wrap:wrap;gap:10px}
.activity-pills button{border:0;border-radius:20px;background:#efe9ff;color:#6043a3;padding:12px;font-size:13px;font-weight:800}
.game-arena,.quiz-arena{text-align:center;max-width:850px;margin:25px auto;padding:35px}
.game-mascot{font-size:100px;animation:float 3s infinite}
.game-arena h2,.quiz-arena h2{font-size:30px}
.giant-sound{display:block;margin:18px auto;width:160px;height:160px;border-radius:50%;border:12px solid #e8dbff;background:#d7c3ff;font-size:70px;box-shadow:0 12px 24px #7655b62f}
.game-arena>p{color:#778096}
.game-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:25px 0}
.game-choices button{border:2px solid #e2daf4;background:#faf8ff;color:#34405b;border-radius:17px;min-height:72px;padding:13px;font-weight:900}
.game-choices button.correct{border-color:#54c898;background:#daf8e8;opacity:1}
.game-choices button.incorrect{border-color:#f38c9d;background:#ffe2e9;opacity:1}
.game-result{border-radius:19px;background:#e8fff1;padding:22px;margin-top:21px;color:#236e50}
.quiz-top{display:flex;justify-content:space-between;gap:12px;color:#6c4ab2;font-size:13px}
.progress-track{height:13px;background:#e9e3f8;border-radius:20px;overflow:hidden;margin:20px 0}
.progress-track>div{height:100%;background:linear-gradient(90deg,#8f69df,#f6a4bf);transition:width .3s}
.quiz-mascot{font-size:95px;margin:20px}
.quiz-choices{grid-template-columns:repeat(3,1fr)}
.results>span{font-size:80px}.big-result{font-size:66px;color:#714dc2;font-weight:900;margin:20px}
.celebration{text-align:center;background:linear-gradient(130deg,#7d59d3,#c084df,#f096b8);color:white;border-radius:27px;padding:45px 20px}
.celebration-icons{font-size:45px;margin-bottom:18px}
.celebration h1{font-size:clamp(35px,5vw,55px)}
.celebration p{font-size:17px}
.graduation-kids{font-size:clamp(40px,8vw,80px);margin:25px auto}
.graduation-score{display:inline-block;background:#ffffff33;border-radius:25px;padding:15px 25px;font-size:21px;font-weight:900}
.celebration-message{font-size:23px;font-weight:900;margin-top:24px}
.goodbye-card{display:flex;gap:20px;align-items:center;background:white;border-radius:23px;padding:25px;margin:23px 0}
.goodbye-card>span{font-size:85px}.goodbye-card h2{margin:0 0 10px}.goodbye-card p{color:#738096}
.bottom-navigation{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:45px;padding:22px 0;border-top:1px solid #e3e4f1}
.bottom-navigation button{background:white;border:2px solid #e1dcf0;border-radius:12px;padding:13px;color:#6145a8;font-weight:900}
.bottom-navigation span{font-size:12px;color:#85869c}
.class-footer{text-align:center;background:white;border-top:1px solid #e8e5f3;padding:30px 16px}
.class-footer strong{color:#6947b5}.class-footer p{color:#8a73bf;font-weight:800}.class-footer small{color:#84889b}
@media(max-width:900px){.objective-grid,.cards-grid{grid-template-columns:repeat(2,1fr)}.greeting-world{grid-template-columns:1fr 2fr 1fr}.school-objects{max-width:640px}}
@media(max-width:650px){.app-header{flex-direction:column;align-items:flex-start}.lesson-nav{justify-content:flex-start}.classroom-main{padding:16px 12px 40px}.world-stage{height:385px}.cartoon-school{transform:scale(.73);transform-origin:center center;top:31%}.world-tree{font-size:85px}.world-kids{font-size:49px;left:calc(50% - 75px);bottom:7%}.world-dialogue{font-size:11px;left:6%;top:18%}.world-enter{font-size:12px;padding:12px;right:10px;bottom:8px}.opening-banner h1{font-size:32px}.objective-grid,.two-columns,.dialogue-scene,.featured-word{grid-template-columns:1fr}.greeting-world{grid-template-columns:1fr}.greeting-friend{display:none}.cards-grid,.school-objects,.game-choices,.quiz-choices{grid-template-columns:repeat(2,1fr)}.school-character{display:none}.schoolboard strong{font-size:24px}.school-scene{padding:12px}.school-objects button{min-height:104px}.featured-word>span{font-size:85px}.bottom-navigation span{order:3;width:100%;text-align:center}.parrot-face{font-size:45px}.parrot-bubble strong{font-size:14px}.parrot-bubble p{font-size:12px}.game-arena,.quiz-arena{padding:22px 13px}.goodbye-card>span{font-size:50px}}
@media(prefers-reduced-motion:reduce){.classroom-app *{animation:none!important;transition:none!important}}
`;
