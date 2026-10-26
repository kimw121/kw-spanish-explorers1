
"use client";

import { useEffect, useRef, useState } from "react";

type Word = {
  spanish: string;
  english: string;
  emoji: string;
};

type Place = {
  id: string;
  name: string;
  spanish: string;
  emoji: string;
  description: string;
  color: string;
  words: Word[];
};

type Profile = {
  name: string;
  age: string;
  country: string;
  city: string;
  school: string;
  birthday: string;
  color: string;
  animal: string;
  food: string;
  hobby: string;
  feeling: string;
  family: string;
  dream: string;
};

const STORAGE = "kw-translations-spanish-explorers-v3";

const INITIAL_PROFILE: Profile = {
  name: "",
  age: "",
  country: "Jamaica",
  city: "",
  school: "",
  birthday: "",
  color: "azul",
  animal: "el perro",
  food: "la pizza",
  hobby: "bailar",
  feeling: "feliz",
  family: "",
  dream: "",
};

const PLACES: Place[] = [
  {
    id: "village",
    name: "Welcome Village",
    spanish: "El pueblo",
    emoji: "🏘️",
    description: "Meet friends and introduce yourself",
    color: "#ffcb83",
    words: [
      { spanish: "¡Hola!", english: "Hello!", emoji: "👋" },
      { spanish: "Buenos días", english: "Good morning", emoji: "🌞" },
      { spanish: "Buenas tardes", english: "Good afternoon", emoji: "🌤️" },
      { spanish: "Buenas noches", english: "Good evening / night", emoji: "🌙" },
      { spanish: "¿Cómo te llamas?", english: "What is your name?", emoji: "🪪" },
      { spanish: "Me llamo...", english: "My name is...", emoji: "😊" },
      { spanish: "¿Cuántos años tienes?", english: "How old are you?", emoji: "🎂" },
      { spanish: "Tengo ocho años", english: "I am eight years old", emoji: "8️⃣" },
      { spanish: "¿De dónde eres?", english: "Where are you from?", emoji: "🌎" },
      { spanish: "Soy de Jamaica", english: "I am from Jamaica", emoji: "🇯🇲" },
      { spanish: "¿Dónde vives?", english: "Where do you live?", emoji: "🏠" },
      { spanish: "Vivo en...", english: "I live in...", emoji: "📍" },
      { spanish: "¿Cómo estás?", english: "How are you?", emoji: "💬" },
      { spanish: "Estoy feliz", english: "I am happy", emoji: "😄" },
      { spanish: "Mucho gusto", english: "Nice to meet you", emoji: "🤝" },
      { spanish: "Hasta luego", english: "See you later", emoji: "👋" },
    ],
  },
  {
    id: "school",
    name: "Wonder School",
    spanish: "La escuela",
    emoji: "🏫",
    description: "Explore classrooms and school supplies",
    color: "#a6d6ff",
    words: [
      { spanish: "la mochila", english: "the backpack", emoji: "🎒" },
      { spanish: "el lápiz", english: "the pencil", emoji: "✏️" },
      { spanish: "el libro", english: "the book", emoji: "📚" },
      { spanish: "el cuaderno", english: "the notebook", emoji: "📓" },
      { spanish: "la regla", english: "the ruler", emoji: "📏" },
      { spanish: "la goma", english: "the eraser", emoji: "🧽" },
      { spanish: "la silla", english: "the chair", emoji: "🪑" },
      { spanish: "la mesa", english: "the table", emoji: "🪵" },
      { spanish: "la escuela", english: "the school", emoji: "🏫" },
      { spanish: "la maestra", english: "the female teacher", emoji: "👩🏽‍🏫" },
    ],
  },
  {
    id: "market",
    name: "Rainbow Market",
    spanish: "El mercado",
    emoji: "🍎",
    description: "Discover food, fruit and colours",
    color: "#ffc1d3",
    words: [
      { spanish: "la manzana", english: "the apple", emoji: "🍎" },
      { spanish: "el plátano", english: "the banana", emoji: "🍌" },
      { spanish: "la naranja", english: "the orange", emoji: "🍊" },
      { spanish: "la fresa", english: "the strawberry", emoji: "🍓" },
      { spanish: "el agua", english: "the water", emoji: "💧" },
      { spanish: "rojo", english: "red", emoji: "🔴" },
      { spanish: "azul", english: "blue", emoji: "🔵" },
      { spanish: "verde", english: "green", emoji: "🟢" },
      { spanish: "amarillo", english: "yellow", emoji: "🟡" },
      { spanish: "morado", english: "purple", emoji: "🟣" },
    ],
  },
  {
    id: "jungle",
    name: "Animal Jungle",
    spanish: "La selva",
    emoji: "🦜",
    description: "Meet animals in a tropical jungle",
    color: "#a2e7b0",
    words: [
      { spanish: "el perro", english: "the dog", emoji: "🐶" },
      { spanish: "el gato", english: "the cat", emoji: "🐱" },
      { spanish: "el pájaro", english: "the bird", emoji: "🐦" },
      { spanish: "el mono", english: "the monkey", emoji: "🐒" },
      { spanish: "el pez", english: "the fish", emoji: "🐠" },
      { spanish: "el caballo", english: "the horse", emoji: "🐴" },
      { spanish: "la mariposa", english: "the butterfly", emoji: "🦋" },
      { spanish: "el árbol", english: "the tree", emoji: "🌳" },
    ],
  },
  {
    id: "clock",
    name: "Clock Castle",
    spanish: "El castillo",
    emoji: "🏰",
    description: "Learn to tell the time in Spanish",
    color: "#d6b9fa",
    words: [
      { spanish: "¿Qué hora es?", english: "What time is it?", emoji: "🕒" },
      { spanish: "Es la una", english: "It is one o'clock", emoji: "🕐" },
      { spanish: "Son las dos", english: "It is two o'clock", emoji: "🕑" },
      { spanish: "Son las tres", english: "It is three o'clock", emoji: "🕒" },
      { spanish: "y cuarto", english: "quarter past", emoji: "⏱️" },
      { spanish: "y media", english: "half past", emoji: "🕧" },
      { spanish: "en punto", english: "on the hour", emoji: "⏰" },
      { spanish: "de la mañana", english: "in the morning", emoji: "🌅" },
    ],
  },
  {
    id: "family",
    name: "Family Garden",
    spanish: "El jardín",
    emoji: "🏡",
    description: "Learn family names and feelings",
    color: "#ffe0a7",
    words: [
      { spanish: "la madre", english: "the mother", emoji: "👩🏽" },
      { spanish: "el padre", english: "the father", emoji: "👨🏽" },
      { spanish: "la hermana", english: "the sister", emoji: "👧🏽" },
      { spanish: "el hermano", english: "the brother", emoji: "👦🏽" },
      { spanish: "la abuela", english: "the grandmother", emoji: "👵🏽" },
      { spanish: "el abuelo", english: "the grandfather", emoji: "👴🏽" },
      { spanish: "Estoy feliz", english: "I am happy", emoji: "😄" },
      { spanish: "Estoy cansado", english: "I am tired", emoji: "😴" },
    ],
  },
];

const COLORS = ["azul", "rojo", "verde", "amarillo", "morado", "rosado", "negro", "blanco"];
const ANIMALS = ["el perro", "el gato", "el pájaro", "el caballo", "el mono", "el pez"];
const FOODS = ["la pizza", "el arroz", "el pollo", "la pasta", "la fruta", "el helado"];
const HOBBIES = ["bailar", "cantar", "leer", "dibujar", "nadar", "jugar", "correr"];
const FEELINGS = ["feliz", "triste", "emocionado", "emocionada", "cansado", "cansada", "bien"];

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "es-ES";
  speech.rate = 0.78;
  speech.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("es"));

  if (spanishVoice) speech.voice = spanishVoice;

  window.speechSynthesis.speak(speech);
}

function shuffle<T,>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function clean(value: string) {
  return value.trim().replace(/[.!?]+$/g, "");
}

function createIntroduction(profile: Profile) {
  const name = clean(profile.name) || "Alex";
  const city = clean(profile.city) || "Montego Bay";
  const country = clean(profile.country) || "Jamaica";

  const sentences = [
    "¡Hola!",
    `Me llamo ${name}.`,
    profile.age ? `Tengo ${clean(profile.age)} años.` : "Tengo ocho años.",
    `Soy de ${country}.`,
    `Vivo en ${city}.`,
    profile.school ? `Estudio en ${clean(profile.school)}.` : "Soy estudiante.",
    `Mi color favorito es ${profile.color}.`,
    `Mi animal favorito es ${profile.animal}.`,
    `Mi comida favorita es ${profile.food}.`,
    `Me gusta ${profile.hobby}.`,
    `Hoy estoy ${profile.feeling}.`,
  ];

  if (profile.birthday) {
    sentences.push(`Mi cumpleaños es el ${clean(profile.birthday)}.`);
  }

  if (profile.family) {
    sentences.push(`En mi familia hay ${clean(profile.family)}.`);
  }

  if (profile.dream) {
    sentences.push(`Quiero ser ${clean(profile.dream)}.`);
  }

  sentences.push("¡Mucho gusto!");
  sentences.push("¿Y tú? ¿Cómo te llamas?");

  return sentences;
}

function WorldArt() {
  return (
    <div className="world-scene" aria-label="A colourful three-dimensional storybook village">
      <div className="sun" />
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />

      <div className="mountain mountain-one" />
      <div className="mountain mountain-two" />
      <div className="mountain mountain-three" />

      <div className="hill hill-back" />
      <div className="hill hill-front" />

      <div className="world-path" />

      <div className="tree tree-one">
        <div className="tree-top" />
        <div className="tree-trunk" />
      </div>

      <div className="tree tree-two">
        <div className="tree-top" />
        <div className="tree-trunk" />
      </div>

      <div className="tree tree-three">
        <div className="tree-top" />
        <div className="tree-trunk" />
      </div>

      <div className="building building-one">
        <div className="building-roof" />
        <div className="building-wall">
          <div className="building-window" />
          <div className="building-door" />
        </div>
      </div>

      <div className="building building-two">
        <div className="building-roof" />
        <div className="building-wall">
          <div className="building-window" />
          <div className="building-door" />
        </div>
      </div>

      <div className="building building-three">
        <div className="building-roof" />
        <div className="building-wall">
          <div className="building-window" />
          <div className="building-door" />
        </div>
      </div>

      <span className="world-flower flower-one">🌼</span>
      <span className="world-flower flower-two">🌸</span>
      <span className="world-flower flower-three">🌺</span>
      <span className="world-bird">🦋</span>
    </div>
  );
}

function IntroductionStudio({
  profile,
  onChange,
  earn,
}: {
  profile: Profile;
  onChange: (profile: Profile) => void;
  earn: (key: string, points: number) => void;
}) {
  const [writing, setWriting] = useState("");
  const [heard, setHeard] = useState("");
  const [notice, setNotice] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const sentences = createIntroduction(profile);
  const paragraph = sentences.join(" ");

  function update(key: keyof Profile, value: string) {
    onChange({ ...profile, [key]: value });
  }

  function input(label: string, key: keyof Profile, placeholder: string) {
    return (
      <label className="input-group">
        <span>{label}</span>
        <input
          value={profile[key]}
          placeholder={placeholder}
          maxLength={70}
          onChange={(event) => update(key, event.target.value)}
        />
      </label>
    );
  }

  function dropdown(label: string, key: keyof Profile, options: string[]) {
    return (
      <label className="input-group">
        <span>{label}</span>
        <select value={profile[key]} onChange={(event) => update(key, event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  function checkWriting() {
    const words = writing.trim().split(/\s+/).filter(Boolean);
    const punctuation = (writing.match(/[.!?]/g) || []).length;

    if (words.length < 20 || punctuation < 3) {
      setNotice("Keep going! Write at least 20 words and three complete sentences.");
      return;
    }

    earn("intro-writing", 40);
    setNotice("¡Muy bien! Writing mission completed. Ask your teacher to check your Spanish.");
  }

  function startSpeaking() {
    if (typeof window === "undefined") return;

    const browser = window as any;
    const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;

    if (!Recognition) {
      setNotice("Your browser does not support voice recognition. Listen to the model and repeat aloud instead.");
      return;
    }

    try {
      recognitionRef.current?.stop();

      const recognition = new Recognition();
      recognitionRef.current = recognition;
      recognition.lang = "es-ES";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setHeard(transcript);
        setNotice("Great speaking practice! Compare the words recognised with your model.");
        earn("intro-speaking", 30);
      };

      recognition.onerror = () => {
        setNotice("The microphone could not hear clearly. Try again or repeat after the audio.");
        setListening(false);
      };

      recognition.onend = () => setListening(false);

      recognition.start();
      setListening(true);
      setNotice("Speak clearly in Spanish!");
    } catch {
      setListening(false);
      setNotice("The microphone could not start. You can still practise aloud.");
    }
  }

  const questions = [
    ["¿Cómo te llamas?", "What is your name?"],
    ["¿Cuántos años tienes?", "How old are you?"],
    ["¿De dónde eres?", "Where are you from?"],
    ["¿Dónde vives?", "Where do you live?"],
    ["¿Cuál es tu color favorito?", "What is your favourite colour?"],
    ["¿Cuál es tu comida favorita?", "What is your favourite food?"],
    ["¿Qué te gusta hacer?", "What do you enjoy doing?"],
    ["¿Cómo estás hoy?", "How are you today?"],
    ["¿Cuándo es tu cumpleaños?", "When is your birthday?"],
    ["¿Qué quieres ser?", "What do you want to be?"],
  ];

  return (
    <section className="intro-studio">
      <div className="section-heading">
        <span>YOUR SPANISH ADVENTURE BEGINS HERE</span>
        <h2>🗣️ My Spanish Introduction Studio</h2>
        <p>
          Meet new friends, learn how to describe yourself, create your own Spanish speech,
          and practise reading, writing, listening and speaking.
        </p>
      </div>

      <div className="conversation">
        <div className="conversation-line">
          <span className="conversation-person">👧🏽</span>
          <button onClick={() => speak("¡Hola! ¿Cómo te llamas? ¿De dónde eres? ¿Qué te gusta hacer?")}>
            ¡Hola! ¿Cómo te llamas? ¿De dónde eres? ¿Qué te gusta hacer? 🔊
          </button>
        </div>

        <div className="conversation-line reply">
          <button onClick={() => speak(paragraph)}>
            ¡Hola! Me llamo {profile.name || "Alex"}. ¡Mucho gusto! 🔊
          </button>
          <span className="conversation-person">👦🏽</span>
        </div>
      </div>

      <div className="two-columns">
        <article className="panel">
          <h3>✏️ Step 1: All About Me</h3>
          <p>Fill in your details to create your very own Spanish introduction.</p>

          <div className="form-grid">
            {input("My name", "name", "María")}
            {input("My age", "age", "8")}
            {input("My country", "country", "Jamaica")}
            {input("My city", "city", "Montego Bay")}
            {input("My school", "school", "Name of my school")}
            {input("My birthday — in Spanish", "birthday", "15 de mayo")}

            {dropdown("My favourite colour", "color", COLORS)}
            {dropdown("My favourite animal", "animal", ANIMALS)}
            {dropdown("My favourite food", "food", FOODS)}
            {dropdown("My hobby", "hobby", HOBBIES)}
            {dropdown("How I feel today", "feeling", FEELINGS)}

            {input("My family — people", "family", "mi madre y mi hermano")}
            {input("What I want to be", "dream", "médico / médica")}
          </div>

          <button
            className="btn primary"
            onClick={() => {
              speak(paragraph);
              earn("intro-created", 30);
            }}
          >
            ✨ Build and Hear My Speech
          </button>
        </article>

        <article className="panel introduction-paper">
          <h3>📖 Step 2: My Spanish Speech</h3>
          <p>Your information becomes complete Spanish sentences!</p>

          {sentences.map((sentence, index) => (
            <div className="sentence" key={index}>
              <span className="sentence-number">{index + 1}</span>
              <strong>{sentence}</strong>
              <button
                aria-label={`Listen to sentence ${index + 1}`}
                onClick={() => {
                  speak(sentence);
                  earn(`intro-sentence-${index}`, 3);
                }}
              >
                🔊
              </button>
            </div>
          ))}

          <div className="button-row">
            <button
              className="btn primary"
              onClick={() => {
                speak(paragraph);
                earn("intro-full-listen", 15);
              }}
            >
              🔊 Listen to Everything
            </button>

            <button
              className="btn secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(paragraph);
                  setNotice("Your Spanish introduction has been copied!");
                } catch {
                  setNotice("Please select the text and copy it manually.");
                }
              }}
            >
              📋 Copy My Speech
            </button>
          </div>
        </article>
      </div>

      <div className="two-columns">
        <article className="panel">
          <h3>📝 Step 3: My Writing Challenge</h3>
          <p>
            Now write your introduction without looking at the example.
            Try to include your name, age, country, home, likes and favourite things.
          </p>

          <textarea
            rows={9}
            value={writing}
            onChange={(event) => setWriting(event.target.value)}
            placeholder={
              "¡Hola!\nMe llamo...\nTengo ... años.\nSoy de...\nVivo en...\nMe gusta...\nMi color favorito es..."
            }
          />

          <p className="helper">
            Writing practice is checked for length, not grammar accuracy. Your teacher can help you correct it.
          </p>

          <button className="btn primary" onClick={checkWriting}>
            ✅ Complete Writing Challenge
          </button>
        </article>

        <article className="panel speaking-panel">
          <h3>🎤 Step 4: My Speaking Challenge</h3>
          <p>Listen first, then say your Spanish introduction aloud.</p>

          <div className="microphone-art">🎙️</div>

          <div className="button-row">
            <button className="btn secondary" onClick={() => speak(paragraph)}>
              🔊 Listen First
            </button>

            <button className="btn primary" disabled={listening} onClick={startSpeaking}>
              {listening ? "🎤 Listening..." : "🎤 Start Speaking"}
            </button>
          </div>

          {heard && (
            <div className="feedback">
              <strong>What the microphone heard:</strong>
              <p>{heard}</p>
            </div>
          )}

          <p className="helper">
            Microphone recognition depends on the browser and permissions. It is a practice tool,
            not a reliable pronunciation grade.
          </p>
        </article>
      </div>

      {notice && <div className="feedback" role="status">{notice}</div>}

      <div className="question-garden">
        <h3>🌟 Step 5: Let's Have a Conversation!</h3>
        <p>Click any question to hear it in Spanish. Then answer out loud!</p>

        <div className="question-grid">
          {questions.map(([spanish, english]) => (
            <button key={spanish} onClick={() => speak(spanish)}>
              <strong>{spanish} 🔊</strong>
              <small>{english}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClockPractice({
  earn,
}: {
  earn: (key: string, points: number) => void;
}) {
  const [hour, setHour] = useState(3);
  const [minute, setMinute] = useState(30);
  const [show, setShow] = useState(false);

  const names = ["doce", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once"];

  const timeSentence = `${
    hour === 1 ? "Es la una" : `Son las ${names[hour % 12]}`
  }${
    minute === 0 ? " en punto" : minute === 15 ? " y cuarto" : " y media"
  }.`;

  function newTime() {
    setHour(Math.floor(Math.random() * 12) + 1);
    setMinute([0, 15, 30][Math.floor(Math.random() * 3)]);
    setShow(false);
  }

  return (
    <div className="panel clock-panel">
      <h2>🕰️ The Magical Clock</h2>
      <p>Look at the hands, then reveal the Spanish time!</p>

      <div className="clock-face">
        {Array.from({ length: 12 }, (_, index) => {
          const number = index === 0 ? 12 : index;
          const angle = ((number * 30 - 90) * Math.PI) / 180;

          return (
            <span
              className="clock-number"
              key={number}
              style={{
                left: `${50 + 39 * Math.cos(angle)}%`,
                top: `${50 + 39 * Math.sin(angle)}%`,
              }}
            >
              {number}
            </span>
          );
        })}

        <div
          className="clock-hand hour-hand"
          style={{ transform: `rotate(${hour * 30 + minute * 0.5}deg)` }}
        />

        <div
          className="clock-hand minute-hand"
          style={{ transform: `rotate(${minute * 6}deg)` }}
        />

        <div className="clock-centre" />
      </div>

      <h2>{hour}:{String(minute).padStart(2, "0")}</h2>

      <div className="button-row centre">
        <button className="btn secondary" onClick={newTime}>
          🎲 New Time
        </button>

        <button
          className="btn primary"
          onClick={() => {
            setShow(true);
            speak(timeSentence);
            earn(`clock-${hour}-${minute}`, 5);
          }}
        >
          🔊 Reveal in Spanish
        </button>
      </div>

      {show && <div className="feedback big-feedback">✨ {timeSentence}</div>}
    </div>
  );
}

export default function Page() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [xp, setXp] = useState(0);
  const [awarded, setAwarded] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const [placeId, setPlaceId] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState(0);

  const [quiz, setQuiz] = useState(false);
  const [questions, setQuestions] = useState<{ word: Word; options: string[] }[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [toast, setToast] = useState("");
  const [xpBump, setXpBump] = useState(false);

  const awardedRef = useRef<string[]>([]);
  const xpRef = useRef(0);
  const completedRef = useRef<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE);

      if (stored) {
        const data = JSON.parse(stored);

        const savedXp = typeof data.xp === "number" ? data.xp : 0;
        const savedAwarded = Array.isArray(data.awarded) ? data.awarded : [];
        const savedCompleted = Array.isArray(data.completed) ? data.completed : [];

        setXp(savedXp);
        setAwarded(savedAwarded);
        setCompleted(savedCompleted);
        setProfile({ ...INITIAL_PROFILE, ...(data.profile || {}) });

        xpRef.current = savedXp;
        awardedRef.current = savedAwarded;
        completedRef.current = savedCompleted;
      }
    } catch {
      // Start fresh if the browser contains invalid saved data.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem(
      STORAGE,
      JSON.stringify({
        profile,
        xp,
        awarded,
        completed,
      })
    );
  }, [ready, profile, xp, awarded, completed]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!xpBump) return;

    const timer = window.setTimeout(() => setXpBump(false), 600);
    return () => window.clearTimeout(timer);
  }, [xpBump]);

  function earn(key: string, points: number) {
    if (!ready) return;

    if (awardedRef.current.includes(key)) {
      setToast("⭐ You have already earned these points!");
      return;
    }

    const nextAwarded = [...awardedRef.current, key];
    const nextXp = xpRef.current + points;

    awardedRef.current = nextAwarded;
    xpRef.current = nextXp;

    setAwarded(nextAwarded);
    setXp(nextXp);
    setXpBump(true);
    setToast(`✨ +${points} XP! ¡Excelente!`);
  }

  function finishPlace(id: string) {
    if (completedRef.current.includes(id)) return;

    const next = [...completedRef.current, id];
    completedRef.current = next;
    setCompleted(next);
  }

  function openPlace(id: string) {
    setPlaceId(id);
    setSelectedWord(0);
    setQuiz(false);
    setQuizFinished(false);
    setToast("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    setPlaceId(null);
    setQuiz(false);
    setQuizFinished(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentPlace = PLACES.find((place) => place.id === placeId);

  function startQuiz(place: Place) {
    const chosen = shuffle(place.words).slice(0, Math.min(5, place.words.length));

    const quizQuestions = chosen.map((word) => {
      const wrong = shuffle(
        place.words.filter((other) => other.spanish !== word.spanish)
      ).slice(0, 3);

      return {
        word,
        options: shuffle([word.english, ...wrong.map((item) => item.english)]),
      };
    });

    setQuestions(quizQuestions);
    setQuestionNumber(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuizFinished(false);
    setQuiz(true);
  }

  function answerQuestion(option: string) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);

    if (option === questions[questionNumber].word.english) {
      setCorrectAnswers((previous) => previous + 1);

      if (currentPlace) {
        earn(`${currentPlace.id}-quiz-${questionNumber}`, 10);
      }
    }
  }

  function nextQuestion() {
    if (questionNumber + 1 >= questions.length) {
      setQuizFinished(true);

      if (currentPlace) {
        finishPlace(currentPlace.id);
        earn(`${currentPlace.id}-quiz-complete`, 30);
      }

      return;
    }

    setQuestionNumber((previous) => previous + 1);
    setSelectedAnswer(null);
  }

  const level = Math.floor(xp / 150) + 1;
  const levelProgress = Math.round(((xp % 150) / 150) * 100);

  return (
    <div className="spanish-app">
      <style>{STYLES}</style>

      <header className="topbar">
        <button className="logo" onClick={goHome}>
          <span>🌎</span>
          <span>
            <strong>KW Translations</strong>
            <small>SPANISH EXPLORERS</small>
          </span>
        </button>

        <div className="scoreboard">
          <span>🏅 Level {level}</span>
          <span className={xpBump ? "xp-score xp-pop" : "xp-score"}>
            ⭐ {xp} XP
          </span>
          <span>🏆 {completed.length}/{PLACES.length}</span>
        </div>
      </header>

      {toast && <div className="xp-toast" role="status">{toast}</div>}

      {!currentPlace ? (
        <>
          <section className="hero">
            <WorldArt />

            <div className="hero-overlay">
              <span className="hero-tag">WELCOME TO A MAGICAL WORLD OF SPANISH</span>

              <h1>
                Your Spanish
                <br />
                Adventure
                <br />
                Starts Here!
              </h1>

              <p>
                Explore wonderful places, meet new friends, speak Spanish,
                complete missions and collect stars!
              </p>

              <button
                className="btn sunshine"
                onClick={() => document.getElementById("world-map")?.scrollIntoView({ behavior: "smooth" })}
              >
                🚀 Start Exploring!
              </button>
            </div>

            <div className="floating-character">🧒🏽</div>
          </section>

          <main className="content">
            <section className="welcome-message">
              <span>👋</span>
              <div>
                <h2>¡Hola, {profile.name || "explorador"}!</h2>
                <p>
                  Welcome, explorer! Every place has new words, fun activities
                  and missions. Let's discover Spanish together.
                </p>
              </div>
            </section>

            <div className="section-heading">
              <span>YOUR ADVENTURE MAP</span>
              <h2>🌎 Explore the Spanish World</h2>
              <p>Choose a destination to begin your adventure!</p>
            </div>

            <section className="world-map" id="world-map">
              <WorldArt />

              <div className="map-label">🧭 Tap a destination to travel!</div>

              {PLACES.map((place, index) => {
                const positions = [
                  { left: "14%", top: "63%" },
                  { left: "41%", top: "31%" },
                  { left: "71%", top: "62%" },
                  { left: "86%", top: "30%" },
                  { left: "37%", top: "81%" },
                  { left: "63%", top: "82%" },
                ];

                return (
                  <button
                    key={place.id}
                    className="map-pin"
                    style={{
                      left: positions[index].left,
                      top: positions[index].top,
                      borderColor: place.color,
                    }}
                    onClick={() => openPlace(place.id)}
                  >
                    <span>{place.emoji}</span>
                    <strong>{place.name}</strong>
                    {completed.includes(place.id) && <i>⭐</i>}
                  </button>
                );
              })}
            </section>

            <div className="section-heading">
              <span>CHOOSE YOUR DESTINATION</span>
              <h2>✨ Six Magical Places</h2>
              <p>Each world has something special to teach you.</p>
            </div>

            <section className="destination-grid">
              {PLACES.map((place) => (
                <button
                  className="destination"
                  key={place.id}
                  onClick={() => openPlace(place.id)}
                >
                  <div className="destination-art" style={{ background: place.color }}>
                    <span>{place.emoji}</span>
                    <i>✨</i>
                  </div>

                  <div className="destination-info">
                    <h3>{place.name}</h3>
                    <strong>{place.spanish}</strong>
                    <p>{place.description}</p>
                    <span>
                      {completed.includes(place.id) ? "⭐ Mission completed" : "Explore this world →"}
                    </span>
                  </div>
                </button>
              ))}
            </section>

            <section className="progress-panel">
              <span>🏆</span>
              <div>
                <h2>My Explorer Progress</h2>
                <p>
                  Level {level} · {xp} XP earned · {completed.length} worlds completed
                </p>

                <div className="progress-track">
                  <div style={{ width: `${levelProgress}%` }} />
                </div>

                <small>{150 - (xp % 150)} XP until your next level</small>
              </div>
            </section>
          </main>
        </>
      ) : (
        <main className="content lesson-page">
          <button className="back-button" onClick={goHome}>
            ← Back to Adventure Map
          </button>

          <section className="lesson-hero">
            <WorldArt />

            <div className="lesson-caption">
              <span>NOW EXPLORING</span>
              <h1>{currentPlace.name}</h1>
              <strong>{currentPlace.spanish}</strong>
              <p>{currentPlace.description}</p>
            </div>

            <div className="lesson-icon">{currentPlace.emoji}</div>
          </section>

          {quiz ? (
            quizFinished ? (
              <section className="panel quiz-box">
                <div className="quiz-picture">🏆</div>
                <h2>¡Excelente, explorador!</h2>
                <p>
                  You got {correctAnswers} out of {questions.length} questions correct.
                </p>

                <p>Your mission has been recorded and your XP is saved!</p>

                <div className="button-row centre">
                  <button className="btn primary" onClick={() => startQuiz(currentPlace)}>
                    🔄 Try Again
                  </button>

                  <button className="btn secondary" onClick={goHome}>
                    🌎 Back to the World
                  </button>
                </div>
              </section>
            ) : (
              <section className="panel quiz-box">
                <div className="quiz-progress">
                  <strong>🎯 Spanish Challenge</strong>
                  <span>Question {questionNumber + 1} of {questions.length}</span>
                </div>

                <div className="quiz-picture">{questions[questionNumber].word.emoji}</div>

                <h2>What does this Spanish word mean?</h2>

                <button
                  className="pronunciation"
                  onClick={() => speak(questions[questionNumber].word.spanish)}
                >
                  🔊 {questions[questionNumber].word.spanish}
                </button>

                <div className="answer-grid">
                  {questions[questionNumber].options.map((option) => {
                    const correct = questions[questionNumber].word.english === option;

                    const className =
                      selectedAnswer === null
                        ? ""
                        : correct
                        ? "correct"
                        : selectedAnswer === option
                        ? "incorrect"
                        : "";

                    return (
                      <button
                        className={className}
                        key={option}
                        disabled={selectedAnswer !== null}
                        onClick={() => answerQuestion(option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="feedback">
                    <h3>
                      {selectedAnswer === questions[questionNumber].word.english
                        ? "🎉 ¡Muy bien! Correct!"
                        : "💜 Good try! Keep learning!"}
                    </h3>

                    <p>
                      The correct answer is:{" "}
                      <strong>{questions[questionNumber].word.english}</strong>
                    </p>

                    <button className="btn primary" onClick={nextQuestion}>
                      {questionNumber + 1 === questions.length
                        ? "🏆 Finish Mission"
                        : "Next Question →"}
                    </button>
                  </div>
                )}
              </section>
            )
          ) : (
            <>
              <section className="guide panel">
                <span>👩🏽‍🏫</span>
                <div>
                  <h3>¡Bienvenido a {currentPlace.spanish}!</h3>
                  <p>
                    Click on each picture, listen carefully and repeat the word.
                    Then complete the Spanish challenge to earn stars.
                  </p>
                </div>
                <button className="btn secondary" onClick={() => speak(`¡Bienvenido! Vamos a aprender español.`)}>
                  🔊 Listen
                </button>
              </section>

              {currentPlace.id === "village" && (
                <IntroductionStudio profile={profile} onChange={setProfile} earn={earn} />
              )}

              <div className="section-heading">
                <span>LOOK · LISTEN · REPEAT</span>
                <h2>🎨 Discover Spanish Words</h2>
                <p>Tap the pictures to hear Spanish spoken aloud.</p>
              </div>

              <div className="word-grid">
                {currentPlace.words.map((word, index) => (
                  <button
                    className={selectedWord === index ? "word-card selected" : "word-card"}
                    key={`${word.spanish}-${index}`}
                    onClick={() => {
                      setSelectedWord(index);
                      speak(word.spanish);
                      earn(`${currentPlace.id}-word-${index}`, 3);
                    }}
                  >
                    <span>{word.emoji}</span>
                    <strong>{word.spanish}</strong>
                    <small>{word.english}</small>
                    <i>🔊 Listen</i>
                  </button>
                ))}
              </div>

              <section className="spotlight">
                <div className="spotlight-picture">
                  {currentPlace.words[selectedWord].emoji}
                </div>

                <div>
                  <span>YOUR SPANISH WORD</span>
                  <h2>{currentPlace.words[selectedWord].spanish}</h2>
                  <p>{currentPlace.words[selectedWord].english}</p>

                  <button
                    className="btn primary"
                    onClick={() => speak(currentPlace.words[selectedWord].spanish)}
                  >
                    🔊 Listen and Repeat
                  </button>
                </div>
              </section>

              {currentPlace.id === "clock" && <ClockPractice earn={earn} />}

              <section className="mission-panel">
                <span>🚀</span>

                <div>
                  <small>YOUR NEXT MISSION</small>
                  <h2>Ready for the Spanish Challenge?</h2>
                  <p>
                    Answer five questions and collect your mission star.
                    Your earned XP stays saved when you return.
                  </p>
                </div>

                <button className="btn sunshine" onClick={() => startQuiz(currentPlace)}>
                  🎯 Start Challenge
                </button>
              </section>
            </>
          )}
        </main>
      )}

      <footer>
        <strong>🌎 KW Translations Spanish Explorers</strong>
        <p>Learn Spanish. Explore the World. Shine Bright!</p>
        <small>
          Built for young Spanish explorers · Grade 3 ·
          Progress saves in this browser
        </small>
      </footer>
    </div>
  );
}

const STYLES = `
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.spanish-app {
  min-height: 100vh;
  background: #f7f8ff;
  color: #29324d;
}

.spanish-app button,
.spanish-app input,
.spanish-app select,
.spanish-app textarea {
  font: inherit;
}

.spanish-app button {
  cursor: pointer;
}

.topbar {
  background: white;
  padding: 16px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #eee7fb;
  position: relative;
  z-index: 20;
}

.logo {
  border: none;
  background: none;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  color: #583caf;
}

.logo > span:first-child {
  font-size: 40px;
}

.logo strong,
.logo small {
  display: block;
}

.logo strong {
  font-size: 22px;
}

.logo small {
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 2px;
  margin-top: 4px;
}

.scoreboard {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.scoreboard > span {
  background: #f0eaff;
  color: #654ab1;
  padding: 12px 15px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 900;
}

.scoreboard .xp-score {
  background: #fff1be;
  color: #967019;
}

.xp-pop {
  animation: xp-pop .6s ease-out;
}

@keyframes xp-pop {
  0% { transform: scale(1); }
  35% { transform: scale(1.3) rotate(5deg); }
  65% { transform: scale(.95); }
  100% { transform: scale(1); }
}

.xp-toast {
  position: fixed;
  top: 88px;
  right: 25px;
  z-index: 100;
  padding: 16px 22px;
  background: #fff3c0;
  color: #74520d;
  border: 2px solid #ffdc74;
  border-radius: 19px;
  font-weight: 900;
  box-shadow: 0 15px 35px #332c6740;
  animation: toast-in .3s ease-out;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn {
  border: none;
  padding: 14px 23px;
  border-radius: 15px;
  font-weight: 900 !important;
  font-size: 14px;
  transition: transform .2s, box-shadow .2s;
}

.btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px #41366a2d;
}

.btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.btn.primary {
  color: white;
  background: linear-gradient(135deg, #7651d1, #a57be6);
}

.btn.secondary {
  color: #694cb7;
  background: #ede7ff;
}

.btn.sunshine {
  color: #62410f;
  background: linear-gradient(135deg, #ffe88b, #ffc65e);
  box-shadow: 0 5px 0 #d99a36;
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.button-row.centre {
  justify-content: center;
}

.content {
  max-width: 1200px;
  margin: auto;
  padding: 30px 25px 65px;
}

.hero {
  height: 575px;
  position: relative;
  overflow: hidden;
  background: #9fd7f5;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #2b376baf, #4c479845 65%, transparent);
  pointer-events: none;
}

.world-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #80b7f9 0%,
    #b4e4fa 46%,
    #d1f3ca 75%,
    #7dd2a4 100%
  );
  perspective: 800px;
}

.sun {
  position: absolute;
  width: 95px;
  height: 95px;
  top: 12%;
  right: 15%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fffddb, #ffe68e 70%, #ffcf63);
  box-shadow: 0 0 65px 35px #fff0a58b;
}

.cloud {
  position: absolute;
  width: 165px;
  height: 45px;
  border-radius: 70px;
  background: #ffffffdb;
  box-shadow: 20px -17px 0 3px #ffffffdb, 65px -6px 0 4px #ffffffdb;
  animation: cloud-float 9s ease-in-out infinite alternate;
}

.cloud-one { left: 15%; top: 19%; }
.cloud-two { left: 54%; top: 12%; transform: scale(.7); animation-delay: -4s; }

@keyframes cloud-float {
  from { translate: -10px 0; }
  to { translate: 25px 5px; }
}

.mountain {
  position: absolute;
  bottom: 30%;
  width: 450px;
  height: 390px;
  clip-path: polygon(50% 0%, 100% 100%, 0 100%);
  background: linear-gradient(115deg, #e7f8f5 0 46%, #9cb7ca 47% 100%);
  filter: drop-shadow(15px 18px 10px #5e7a9144);
}

.mountain-one { left: 1%; }
.mountain-two { left: 32%; bottom: 34%; transform: scale(1.2); }
.mountain-three { left: 70%; bottom: 30%; transform: scale(.9); }

.hill {
  position: absolute;
  left: -15%;
  width: 135%;
  height: 54%;
  border-radius: 50% 50% 0 0;
}

.hill-back {
  bottom: -15%;
  background: linear-gradient(175deg, #a9efa1, #54bc87);
  transform: rotate(-3deg);
}

.hill-front {
  bottom: -34%;
  background: linear-gradient(150deg, #94e6a5, #399e6e);
  transform: rotate(5deg);
}

.world-path {
  position: absolute;
  width: 48%;
  height: 65%;
  bottom: -43%;
  left: 25%;
  background: linear-gradient(90deg, #d0ac77, #ffedba 45%, #f1cd90);
  border-radius: 50% 50% 0 0;
  transform: rotate(-15deg);
  box-shadow: inset -30px 0 26px #a8815636;
}

.tree {
  position: absolute;
  bottom: 19%;
  height: 210px;
  width: 150px;
  filter: drop-shadow(14px 17px 8px #26583d56);
}

.tree-one { left: 11%; }
.tree-two { left: 79%; bottom: 17%; transform: scale(1.25); }
.tree-three { left: 55%; bottom: 38%; transform: scale(.66); }

.tree-trunk {
  width: 27px;
  height: 95px;
  background: linear-gradient(90deg, #855531, #ba8a52, #674628);
  position: absolute;
  bottom: 0;
  left: 62px;
  border-radius: 12px;
}

.tree-top {
  width: 145px;
  height: 145px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  border-radius: 48% 52% 44% 56%;
  background: radial-gradient(circle at 28% 23%, #b2f797, #4fc77e 55%, #22865c);
  box-shadow: inset -18px -19px 25px #18764b5e;
  animation: tree-sway 4s ease-in-out infinite alternate;
  transform-origin: bottom center;
}

@keyframes tree-sway {
  to { transform: rotate(3deg); }
}

.building {
  position: absolute;
  height: 170px;
  width: 170px;
  filter: drop-shadow(14px 20px 8px #3f61564f);
}

.building-one { left: 26%; bottom: 23%; }
.building-two { left: 61%; bottom: 33%; transform: scale(.85); }
.building-three { left: 42%; bottom: 42%; transform: scale(.67); }

.building-wall {
  position: absolute;
  bottom: 0;
  left: 23px;
  width: 125px;
  height: 110px;
  background: linear-gradient(110deg, #fff2d6 0 70%, #dbad8d 71%);
  border-radius: 4px;
  box-shadow: inset -15px 0 0 #d09b7780;
  transform: skewY(-4deg);
}

.building-roof {
  position: absolute;
  top: 9px;
  left: 6px;
  width: 166px;
  height: 88px;
  background: linear-gradient(125deg, #ffb2a6 0 55%, #bd658f 56%);
  clip-path: polygon(42% 0, 100% 57%, 83% 100%, 0 68%);
  z-index: 3;
  filter: drop-shadow(2px 7px 2px #874c5855);
}

.building-window {
  position: absolute;
  left: 22px;
  top: 34px;
  width: 30px;
  height: 31px;
  background: linear-gradient(145deg, #a8e5ff, #477aaa);
  border: 5px solid #fff8ed;
  box-shadow: 3px 4px 2px #493c5b3b;
}

.building-door {
  position: absolute;
  right: 23px;
  bottom: 0;
  height: 57px;
  width: 35px;
  background: linear-gradient(90deg, #a87bb6, #71569c);
  border-radius: 15px 15px 0 0;
}

.world-flower,
.world-bird {
  position: absolute;
  font-size: 42px;
  filter: drop-shadow(6px 8px 4px #334d5666);
}

.flower-one { left: 8%; bottom: 8%; }
.flower-two { left: 75%; bottom: 9%; }
.flower-three { left: 92%; bottom: 23%; }
.world-bird { right: 24%; top: 30%; animation: butterfly 5s ease-in-out infinite; }

@keyframes butterfly {
  50% { transform: translate(20px, -18px) rotate(8deg); }
}

.hero-overlay {
  position: absolute;
  z-index: 4;
  left: 7%;
  top: 16%;
  color: white;
  max-width: 600px;
}

.hero-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.5px;
  background: #ffffff2f;
  padding: 12px 18px;
  border: 1px solid #ffffff80;
  border-radius: 25px;
}

.hero h1 {
  font-size: clamp(43px, 5vw, 77px);
  line-height: 1.04;
  letter-spacing: -2px;
  margin: 25px 0;
  text-shadow: 0 5px 12px #172e6b5a;
}

.hero p {
  font-size: 18px;
  line-height: 1.7;
  max-width: 420px;
  margin-bottom: 28px;
}

.floating-character {
  position: absolute;
  right: 11%;
  bottom: 12%;
  z-index: 4;
  font-size: 130px;
  filter: drop-shadow(12px 18px 8px #273b5659);
  animation: mascot-bob 3s ease-in-out infinite;
}

@keyframes mascot-bob {
  50% { transform: translateY(-12px); }
}

.welcome-message {
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  border: 1px solid #eae6f5;
  border-radius: 23px;
  padding: 25px;
  margin: 12px 0 48px;
}

.welcome-message > span { font-size: 60px; }
.welcome-message h2 { margin: 0 0 8px; }
.welcome-message p { color: #788098; line-height: 1.6; margin: 0; }

.section-heading {
  text-align: center;
  margin: 48px 0 24px;
}

.section-heading > span {
  color: #8762d0;
  letter-spacing: 1.5px;
  font-size: 11px;
  font-weight: 900;
}

.section-heading h2 {
  font-size: clamp(28px, 4vw, 38px);
  margin: 10px 0;
}

.section-heading p {
  color: #7b8399;
  line-height: 1.6;
}

.world-map {
  position: relative;
  height: 570px;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0 18px 37px #34527722;
}

.map-label {
  position: absolute;
  top: 22px;
  left: 22px;
  padding: 12px 18px;
  border-radius: 18px;
  background: #fffffff0;
  font-weight: 900;
  color: #6647ae;
  z-index: 5;
}

.map-pin {
  position: absolute;
  z-index: 6;
  min-width: 120px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 4px solid white;
  border-radius: 20px;
  background: #fffffff0;
  color: #35415d;
  padding: 11px;
  gap: 6px;
  box-shadow: 0 9px 0 #345d6460, 0 14px 20px #1e41574d;
  transition: transform .2s;
}

.map-pin:hover {
  transform: translate(-50%, -59%) scale(1.08);
}

.map-pin > span {
  font-size: 43px;
  filter: drop-shadow(5px 6px 4px #35456652);
}

.map-pin strong {
  font-size: 12px;
}

.map-pin i {
  position: absolute;
  right: -7px;
  top: -16px;
  font-size: 24px;
}

.destination-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 19px;
}

.destination {
  text-align: left;
  border: 1px solid #e6e8f4;
  border-radius: 24px;
  overflow: hidden;
  background: white;
  padding: 0;
  color: #29324d;
  transition: transform .2s, box-shadow .2s;
}

.destination:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 25px #34467525;
}

.destination-art {
  display: grid;
  place-items: center;
  height: 160px;
  position: relative;
  box-shadow: inset 0 -22px 25px #ffffff8a;
}

.destination-art > span {
  font-size: 92px;
  filter: drop-shadow(10px 12px 6px #53637855);
}

.destination-art i {
  position: absolute;
  right: 20%;
  top: 13%;
  font-size: 27px;
}

.destination-info {
  padding: 22px;
}

.destination-info h3 {
  margin: 0 0 7px;
  font-size: 21px;
}

.destination-info strong,
.destination-info > span {
  color: #7856be;
}

.destination-info p {
  color: #848b9b;
  line-height: 1.6;
  margin: 13px 0 20px;
}

.destination-info > span {
  font-size: 14px;
  font-weight: 900;
}

.progress-panel {
  display: flex;
  align-items: center;
  gap: 25px;
  background: #eee8ff;
  border-radius: 25px;
  padding: 29px;
  margin-top: 45px;
}

.progress-panel > span {
  font-size: 64px;
}

.progress-panel > div {
  flex: 1;
}

.progress-panel h2 { margin: 0; }
.progress-panel p { color: #726b91; }

.progress-track {
  height: 15px;
  background: #d3c5f5;
  border-radius: 20px;
  overflow: hidden;
  margin: 13px 0;
}

.progress-track > div {
  height: 100%;
  background: linear-gradient(90deg, #ffc65b, #a276e5);
  transition: width .6s;
}

.lesson-page {
  padding-top: 26px;
}

.back-button {
  background: none;
  color: #7252be;
  border: none;
  font-weight: 900 !important;
  margin-bottom: 19px;
}

.lesson-hero {
  position: relative;
  height: 380px;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 15px 28px #365b7c2b;
}

.lesson-caption {
  position: absolute;
  left: 26px;
  top: 25px;
  z-index: 4;
  background: #fffffff1;
  padding: 25px;
  border-radius: 24px;
  max-width: 400px;
}

.lesson-caption > span {
  font-size: 11px;
  font-weight: 900;
  color: #7852bf;
  letter-spacing: 1px;
}

.lesson-caption h1 {
  font-size: 38px;
  margin: 9px 0;
}

.lesson-caption strong {
  color: #8b61ce;
}

.lesson-caption p {
  color: #727d92;
}

.lesson-icon {
  position: absolute;
  right: 15%;
  bottom: 18%;
  z-index: 3;
  font-size: 118px;
  filter: drop-shadow(12px 16px 9px #25465d66);
}

.panel {
  background: white;
  border: 1px solid #e8e7f3;
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 5px 16px #3e4e8420;
}

.guide {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 24px;
}

.guide > span { font-size: 60px; }
.guide > div { flex: 1; }
.guide h3 { font-size: 21px; margin: 0 0 8px; }
.guide p { color: #7b8398; line-height: 1.6; }

.intro-studio {
  margin: 45px 0;
}

.conversation {
  background: white;
  padding: 25px;
  border: 1px solid #e9e7f6;
  border-radius: 23px;
  display: grid;
  gap: 17px;
}

.conversation-line {
  display: flex;
  align-items: center;
  gap: 15px;
}

.conversation-line.reply {
  justify-content: flex-end;
}

.conversation-person {
  font-size: 48px;
}

.conversation-line button {
  background: #efeaff;
  border: none;
  border-radius: 18px;
  padding: 18px;
  color: #6446b0;
  font-weight: 900;
  text-align: left;
  line-height: 1.6;
}

.conversation-line.reply button {
  background: #ddf8e8;
  color: #367a57;
}

.two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin: 22px 0;
  align-items: start;
}

.panel h3 {
  margin-top: 0;
  font-size: 23px;
}

.panel > p {
  color: #778198;
  line-height: 1.65;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  margin: 23px 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group > span {
  color: #7050b1;
  font-weight: 900;
  font-size: 12px;
}

.input-group input,
.input-group select,
.panel textarea {
  width: 100%;
  min-width: 0;
  border: 2px solid #e4dff4;
  border-radius: 12px;
  padding: 13px;
  background: #faf9ff;
  color: #34415b;
  outline-color: #9371d9;
}

.panel textarea {
  resize: vertical;
  min-height: 230px;
  line-height: 1.8;
}

.sentence {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f4ff;
  border-radius: 15px;
  padding: 13px 11px;
  margin: 9px 0;
}

.sentence-number {
  min-width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  background: #e5dbff;
  color: #6d4cb8;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 900;
}

.sentence strong {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
}

.sentence button {
  border: none;
  background: none;
  font-size: 22px;
}

.helper {
  font-size: 13px;
  color: #8d8f9f !important;
  line-height: 1.7;
}

.speaking-panel {
  text-align: center;
}

.microphone-art {
  font-size: 110px;
  margin: 25px;
  filter: drop-shadow(9px 10px 7px #57447a56);
}

.speaking-panel .button-row {
  justify-content: center;
}

.feedback {
  padding: 22px;
  background: #e6f9ee;
  color: #286c51;
  border-radius: 19px;
  margin: 23px 0;
  line-height: 1.7;
  font-weight: 700;
}

.question-garden {
  background: linear-gradient(135deg, #fff0c5, #ffe3bd);
  padding: 29px;
  border-radius: 25px;
  margin-top: 30px;
}

.question-garden h3 {
  font-size: 25px;
  margin: 0 0 10px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
  margin-top: 20px;
}

.question-grid button {
  background: #fffaf0;
  border: 2px solid #e9d6a7;
  text-align: left;
  padding: 16px;
  border-radius: 15px;
  color: #664ba8;
}

.question-grid strong,
.question-grid small {
  display: block;
  line-height: 1.5;
}

.question-grid small {
  color: #897c79;
  margin-top: 8px;
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.word-card {
  border: 3px solid #e9e5f8;
  background: white;
  border-radius: 22px;
  min-height: 213px;
  padding: 15px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #34405a;
  transition: transform .2s, box-shadow .2s;
}

.word-card:hover,
.word-card.selected {
  transform: translateY(-5px);
  border-color: #a687e8;
  box-shadow: 0 10px 22px #6f519629;
}

.word-card > span {
  font-size: 68px;
  filter: drop-shadow(7px 8px 5px #344f7755);
}

.word-card strong {
  font-size: 16px;
  text-align: center;
}

.word-card small {
  color: #81889b;
  text-align: center;
}

.word-card i {
  font-style: normal;
  background: #f0eaff;
  color: #7152b8;
  padding: 7px 13px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 900;
}

.spotlight {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
  background: linear-gradient(135deg, #eee5ff, #ffe6ed);
  border-radius: 27px;
  padding: 28px;
  margin: 40px 0;
}

.spotlight-picture {
  min-height: 230px;
  display: grid;
  place-items: center;
  border-radius: 23px;
  background: #ffffffad;
  font-size: 145px;
  filter: drop-shadow(8px 10px 6px #4c4b7a55);
}

.spotlight > div:last-child > span {
  font-size: 12px;
  font-weight: 900;
  color: #7952be;
}

.spotlight h2 {
  font-size: 38px;
  margin: 14px 0;
}

.spotlight p {
  color: #777187;
  font-size: 20px;
}

.mission-panel {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  color: white;
  padding: 30px;
  background: linear-gradient(110deg, #6749b9, #9270d6);
  border-radius: 26px;
  margin: 45px 0;
}

.mission-panel > span { font-size: 63px; }
.mission-panel > div { flex: 1 1 230px; }
.mission-panel small { color: #ffe59c; font-weight: 900; }
.mission-panel h2 { margin: 8px 0; }
.mission-panel p { line-height: 1.7; margin: 0; }

.quiz-box {
  max-width: 850px;
  margin: 35px auto 70px;
  text-align: center;
  padding: 38px;
}

.quiz-progress {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #7851bb;
}

.quiz-picture {
  font-size: 115px;
  margin: 28px;
  filter: drop-shadow(8px 10px 6px #53607355);
}

.quiz-box h2 {
  font-size: 29px;
  line-height: 1.5;
}

.pronunciation {
  border: none;
  background: #ede7ff;
  color: #6047a2;
  padding: 16px 25px;
  border-radius: 18px;
  font-size: 23px !important;
  font-weight: 900 !important;
}

.answer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 30px;
}

.answer-grid button {
  border: 2px solid #e1d9f6;
  border-radius: 17px;
  background: #faf8ff;
  padding: 19px;
  color: #35405b;
  font-weight: 900;
}

.answer-grid button.correct {
  background: #dcf8e5;
  border-color: #59c791;
}

.answer-grid button.incorrect {
  background: #ffe0e5;
  border-color: #e78f9e;
}

.answer-grid button:disabled {
  cursor: default;
}

.big-feedback {
  font-size: 23px;
}

.clock-panel {
  text-align: center;
  margin: 35px 0;
}

.clock-face {
  position: relative;
  width: 270px;
  height: 270px;
  border-radius: 50%;
  margin: 30px auto;
  border: 14px solid #8060c8;
  background: radial-gradient(circle at 35% 25%, white, #ede8fc);
  box-shadow: 10px 15px 24px #51418849;
}

.clock-number {
  position: absolute;
  transform: translate(-50%, -50%);
  color: #634aa9;
  font-size: 18px;
  font-weight: 900;
}

.clock-hand {
  position: absolute;
  bottom: 50%;
  left: calc(50% - 4px);
  width: 8px;
  border-radius: 10px;
  transform-origin: center bottom;
}

.hour-hand {
  height: 68px;
  background: #6546a3;
}

.minute-hand {
  height: 94px;
  width: 5px;
  left: calc(50% - 2.5px);
  background: #e68aaa;
}

.clock-centre {
  width: 19px;
  height: 19px;
  background: #ffd36e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

footer {
  background: white;
  border-top: 1px solid #e7e6f2;
  padding: 35px;
  text-align: center;
}

footer strong { color: #6745b4; }
footer p { color: #8060c4; font-weight: 700; }
footer small { color: #8b90a1; line-height: 1.6; }

@media (max-width: 900px) {
  .destination-grid { grid-template-columns: repeat(2, 1fr); }
  .word-grid { grid-template-columns: repeat(3, 1fr); }
  .question-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 650px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .scoreboard > span {
    padding: 9px;
    font-size: 11px;
  }

  .hero { height: 470px; }
  .hero-overlay { top: 8%; left: 7%; right: 7%; }
  .hero h1 { font-size: 45px; }
  .hero p { font-size: 14px; max-width: 310px; }
  .hero-tag { font-size: 9px; }
  .floating-character { font-size: 75px; right: 5%; bottom: 7%; }

  .world-map { height: 540px; }
  .map-label { top: 10px; left: 10px; font-size: 11px; }

  .map-pin {
    min-width: 82px;
    padding: 8px 4px;
  }

  .map-pin > span { font-size: 26px; }
  .map-pin strong { font-size: 10px; }

  .destination-grid,
  .two-columns,
  .spotlight {
    grid-template-columns: 1fr;
  }

  .word-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .word-card { min-height: 190px; }
  .word-card > span { font-size: 53px; }
  .word-card strong { font-size: 13px; }

  .form-grid { grid-template-columns: 1fr; }
  .question-grid { grid-template-columns: 1fr 1fr; }
  .answer-grid { grid-template-columns: 1fr; }

  .lesson-hero { height: 340px; }
  .lesson-caption { left: 12px; top: 12px; padding: 15px; }
  .lesson-caption h1 { font-size: 26px; }
  .lesson-icon { font-size: 75px; right: 8%; bottom: 9%; }

  .guide { flex-wrap: wrap; }
  .guide > span { font-size: 43px; }

  .conversation-person { font-size: 31px; }
  .conversation-line button { padding: 12px; font-size: 12px; }

  .progress-panel {
    flex-direction: column;
    text-align: center;
  }

  .spotlight-picture {
    min-height: 165px;
    font-size: 98px;
  }

  .panel { padding: 19px; }
  .content { padding-left: 15px; padding-right: 15px; }
}

@media (prefers-reduced-motion: reduce) {
  .spanish-app *,
  .spanish-app *::before,
  .spanish-app *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
