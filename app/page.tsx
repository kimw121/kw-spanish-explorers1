
"use client";

import { useEffect, useRef, useState } from "react";

type Screen = "garage" | "race" | "question" | "finish";

type Racer = {
  name: string;
  age: string;
  country: string;
  car: number;
  level: number;
  xp: number;
};

type RoadItem = {
  id: number;
  lane: number;
  z: number;
  kind: "rival" | "star";
  car: number;
  passed: boolean;
};

type GameWorld = {
  time: number;
  lane: number;
  visualLane: number;
  road: number;
  objects: RoadItem[];
  nextId: number;
  spawn: number;
  score: number;
  hearts: number;
  boost: number;
  nitro: number;
  safe: number;
  combo: number;
};

const CARS = [
  {
    name: "Lamborghini Supercar",
    type: "EXOTIC SPEED",
    color: "#9ce44e",
    image:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Porsche 911",
    type: "RACE MACHINE",
    color: "#facc15",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Corvette",
    type: "SUPER SPORT",
    color: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "BMW Sport",
    type: "STREET RACER",
    color: "#38bdf8",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Muscle Car",
    type: "RAW POWER",
    color: "#fb923c",
    image:
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mercedes Sports",
    type: "LUXURY SPEED",
    color: "#a78bfa",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "City Racer",
    type: "TURBO COMPACT",
    color: "#2dd4bf",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Grave Digger",
    type: "MONSTER TRUCK",
    color: "#b084ff",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Monster_Jam_Brazil_%28246352017%29.jpeg",
  },
];

const AGE_WORDS: Record<string, string> = {
  "7": "siete",
  "8": "ocho",
  "9": "nueve",
  "10": "diez",
  "11": "once",
  "12": "doce",
};

const MISSIONS = [
  {
    spanish: "¡Hola!",
    english: "How do you say hello?",
    answers: ["¡Hola!", "Adiós", "Gracias"],
    correct: 0,
  },
  {
    spanish: "¿Cómo te llamas?",
    english: "What is your name?",
    answers: ["Tengo ocho años", "Me llamo...", "Estoy bien"],
    correct: 1,
  },
  {
    spanish: "¿Cuántos años tienes?",
    english: "How old are you?",
    answers: ["Soy de...", "Estoy bien", "Tengo ... años"],
    correct: 2,
  },
  {
    spanish: "¿De dónde eres?",
    english: "Where are you from?",
    answers: ["Soy de...", "Me llamo...", "Tengo..."],
    correct: 0,
  },
  {
    spanish: "¿Cómo estás?",
    english: "How are you?",
    answers: ["Tengo nueve años", "Estoy bien", "Me llamo..."],
    correct: 1,
  },
  {
    spanish: "¡Mucho gusto!",
    english: "What does this mean?",
    answers: ["Goodbye", "Good morning", "Nice to meet you"],
    correct: 2,
  },
];

const INITIAL: Racer[] = [
  {
    name: "Racer 1",
    age: "8",
    country: "Jamaica",
    car: 0,
    level: 0,
    xp: 0,
  },
  {
    name: "Racer 2",
    age: "9",
    country: "Jamaica",
    car: 7,
    level: 0,
    xp: 0,
  },
];

const RACE_LENGTH = 18;
const STORAGE_KEY = "kw-turbo-racers-v1";

function newWorld(): GameWorld {
  return {
    time: 0,
    lane: 1,
    visualLane: 1,
    road: 0,
    objects: [],
    nextId: 0,
    spawn: 0,
    score: 0,
    hearts: 3,
    boost: 0,
    nitro: 100,
    safe: 0,
    combo: 0,
  };
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "es-ES";
  voice.rate = 0.78;

  const spanishVoice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith("es"));

  if (spanishVoice) voice.voice = spanishVoice;

  window.speechSynthesis.speak(voice);
}

function sentence(player: Racer, level: number) {
  if (level === 0) return "¡Hola!";
  if (level === 1) return `Me llamo ${player.name}.`;
  if (level === 2)
    return `Tengo ${AGE_WORDS[player.age] || player.age} años.`;
  if (level === 3) return `Soy de ${player.country}.`;
  if (level === 4) return "Estoy bien.";
  return "¡Mucho gusto!";
}

function fullIntro(player: Racer) {
  return (
    `¡Hola! Me llamo ${player.name}. ` +
    `Tengo ${AGE_WORDS[player.age] || player.age} años. ` +
    `Soy de ${player.country}. ` +
    "Estoy bien. ¡Mucho gusto!"
  );
}

function laneX(lane: number, z: number) {
  const width = 165 + z * 665;
  return 480 + (lane - 1) * width / 3;
}

function drawCar(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  x: number,
  y: number,
  width: number,
  color: string,
  label: string,
  player = false
) {
  const height = width * 0.84;

  ctx.save();

  ctx.shadowColor = player ? "#4ae9ff" : "#050914";
  ctx.shadowBlur = player ? 20 : 10;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(
    x - width / 2,
    y - height / 2,
    width,
    height,
    12
  );
  ctx.fill();
  ctx.clip();

  if (image?.complete && image.naturalWidth > 0) {
    const ratio = Math.max(
      width / image.naturalWidth,
      height / image.naturalHeight
    );

    const iw = image.naturalWidth * ratio;
    const ih = image.naturalHeight * ratio;

    ctx.drawImage(
      image,
      x - iw / 2,
      y - ih / 2,
      iw,
      ih
    );
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(
      x - width / 2,
      y - height / 2,
      width,
      height
    );
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(4,9,20,.83)";
  ctx.fillRect(
    x - width / 2,
    y + height * 0.21,
    width,
    height * 0.29
  );

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = `900 ${Math.max(10, width * 0.12)}px Arial`;
  ctx.fillText(label, x, y + height * 0.41);

  ctx.restore();
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  world: GameWorld,
  cars: HTMLImageElement[],
  racer: Racer
) {
  const W = 960;
  const H = 540;

  // Sunset sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#111b49");
  sky.addColorStop(0.42, "#6b4c96");
  sky.addColorStop(0.7, "#ee9475");
  sky.addColorStop(1, "#17283d");

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#ffe1a4";
  ctx.beginPath();
  ctx.arc(735, 76, 42, 0, Math.PI * 2);
  ctx.fill();

  // Skyline
  for (let i = 0; i < 34; i++) {
    const bh = 39 + (i * 43) % 94;
    ctx.fillStyle = i % 2 ? "#242c4e" : "#36375e";
    ctx.fillRect(i * 31, 150 - bh, 27, bh);

    if (i % 3 === 0) {
      ctx.fillStyle = "#f8ce83";
      ctx.fillRect(i * 31 + 8, 146 - bh + 17, 4, 5);
    }
  }

  // Road
  ctx.fillStyle = "#17303d";
  ctx.fillRect(0, 105, W, H - 105);

  ctx.beginPath();
  ctx.moveTo(395, 105);
  ctx.lineTo(565, 105);
  ctx.lineTo(900, 540);
  ctx.lineTo(60, 540);
  ctx.closePath();

  const road = ctx.createLinearGradient(0, 105, 0, 540);
  road.addColorStop(0, "#4a5063");
  road.addColorStop(1, "#121a28");
  ctx.fillStyle = road;
  ctx.fill();

  // Glowing road sides
  ctx.strokeStyle = "#ff5cab";
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.moveTo(395, 105);
  ctx.lineTo(60, 540);
  ctx.moveTo(565, 105);
  ctx.lineTo(900, 540);
  ctx.stroke();

  // Animated lane markings
  for (const divider of [1, 2]) {
    for (let i = 0; i < 13; i++) {
      const t = (i / 13 + world.road) % 1;
      const t2 = Math.min(1, t + 0.045);

      const y1 = 105 + t * t * 435;
      const y2 = 105 + t2 * t2 * 435;

      const x1 =
        480 + (divider / 3 - 0.5) * (170 + t * t * 660);

      const x2 =
        480 + (divider / 3 - 0.5) * (170 + t2 * t2 * 660);

      ctx.strokeStyle = "#fff5d7";
      ctx.lineWidth = 2 + t * 7;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // Roadside lights
  for (let i = 0; i < 10; i++) {
    const t = (i / 10 + world.road * 0.7) % 1;
    const y = 105 + t * t * 435;
    const offset = 100 + t * 340;

    for (const side of [-1, 1]) {
      const x = 480 + side * offset;

      ctx.strokeStyle = "#49dcff";
      ctx.lineWidth = 2 + t * 3;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 13 - t * 60);
      ctx.stroke();

      ctx.fillStyle = "#ffdf83";
      ctx.beginPath();
      ctx.arc(x, y - 13 - t * 60, 3 + t * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Moving traffic and collectibles
  for (const item of world.objects) {
    if (item.z < 0 || item.z > 1.1) continue;

    const z = Math.min(1, item.z);
    const y = 112 + z * 390;
    const x = laneX(item.lane, z);

    if (item.kind === "star") {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = `${18 + z * 42}px Arial`;
      ctx.shadowColor = "#ffe067";
      ctx.shadowBlur = 16;
      ctx.fillText("⭐", x, y);
      ctx.restore();
    } else {
      drawCar(
        ctx,
        cars[item.car],
        x,
        y,
        24 + z * 98,
        CARS[item.car].color,
        "RIVAL"
      );
    }
  }

  const px = laneX(world.visualLane, 1);

  // Nitro flame
  if (world.boost > 0) {
    ctx.save();
    ctx.fillStyle = "#43e9ff";
    ctx.shadowColor = "#43e9ff";
    ctx.shadowBlur = 28;

    ctx.fillRect(px - 37, 493, 16, 55);
    ctx.fillRect(px + 21, 493, 16, 55);

    ctx.restore();
  }

  // Player car
  if (
    world.safe <= 0 ||
    Math.floor(world.time * 10) % 2 === 0
  ) {
    drawCar(
      ctx,
      cars[racer.car],
      px,
      420,
      racer.car === 7 ? 150 : 135,
      CARS[racer.car].color,
      "YOU",
      true
    );
  }

  // HUD
  ctx.fillStyle = "rgba(5,12,26,.85)";
  ctx.beginPath();
  ctx.roundRect(15, 15, 270, 65, 12);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffe178";
  ctx.font = "900 20px Arial";
  ctx.fillText("KW TURBO RACERS", 28, 43);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Arial";
  ctx.fillText(
    world.boost > 0
      ? "⚡ NITRO ACTIVE!"
      : "DODGE • COLLECT • WIN",
    28,
    65
  );

  ctx.textAlign = "right";
  ctx.font = "900 25px Arial";

  ctx.fillText(
    `${Math.max(0, Math.ceil(RACE_LENGTH - world.time))} SEC`,
    940,
    42
  );

  // Final checkpoint coming up
  if (world.time >= RACE_LENGTH - 4) {
    ctx.fillStyle = "#ffe078";
    ctx.textAlign = "center";
    ctx.font = "900 24px Arial";
    ctx.fillText("🚧 SPANISH GATE AHEAD!", 480, 135);
  }
}

function CarPhoto({
  index,
  selected = false,
}: {
  index: number;
  selected?: boolean;
}) {
  const car = CARS[index];
  const [failed, setFailed] = useState(false);

  return (
    <div className="car-photo">
      {failed ? (
        <div className="photo-fallback">
          <span>{index === 7 ? "🚛" : "🏎️"}</span>
          <strong>{car.name}</strong>
        </div>
      ) : (
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}

      {selected && <span className="selected-tag">✓ SELECTED</span>}
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("garage");
  const [players, setPlayers] = useState<Racer[]>(INITIAL);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const [choice, setChoice] = useState<number | null>(null);
  const [spoken, setSpoken] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [hud, setHud] = useState({
    score: 0,
    hearts: 3,
    nitro: 100,
    combo: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<GameWorld>(newWorld());
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const screenRef = useRef<Screen>("garage");
  const lockRef = useRef(false);

  const racer = players[active];
  const question = MISSIONS[Math.min(racer.level, 5)];

  // Load saved progress.
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

      if (Array.isArray(saved?.players) && saved.players.length === 2) {
        setPlayers(saved.players);
      }
    } catch {}

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ players }));
    } catch {}
  }, [players, ready]);

  // Preload car photos once.
  useEffect(() => {
    imagesRef.current = CARS.map((car) => {
      const image = new window.Image();
      image.src = car.image;
      return image;
    });
  }, []);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  function changePlayer(update: Partial<Racer>) {
    setPlayers((old) =>
      old.map((p, i) =>
        i === active ? { ...p, ...update } : p
      )
    );
  }

  function move(direction: number) {
    if (screenRef.current !== "race") return;

    const world = worldRef.current;
    world.lane = Math.max(0, Math.min(2, world.lane + direction));
  }

  function nitro() {
    if (screenRef.current !== "race") return;

    const world = worldRef.current;

    if (world.nitro < 30 || world.boost > 0) return;

    world.nitro -= 30;
    world.boost = 2.2;
  }

  // Keyboard controls.
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (screenRef.current !== "race") return;

      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)
      ) {
        event.preventDefault();
      }

      if (event.repeat) return;

      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowUp" || event.key === " ") nitro();
    }

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  // Smooth racing loop: canvas redraws at approximately 30 FPS.
  useEffect(() => {
    if (screen !== "race") return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let last = 0;
    let lastHud = 0;
    let running = true;

    function loop(now: number) {
      if (!running || !ctx) return;

      frame = requestAnimationFrame(loop);

      if (now - last < 33) return;

      const dt = last
        ? Math.min(0.05, (now - last) / 1000)
        : 0;

      last = now;

      const world = worldRef.current;

      world.time += dt;
      world.boost = Math.max(0, world.boost - dt);
      world.safe = Math.max(0, world.safe - dt);

      const speed = world.boost > 0 ? 1.8 : 1;

      world.road =
        (world.road + dt * 0.62 * speed) % 1;

      world.visualLane +=
        (world.lane - world.visualLane) *
        Math.min(1, dt * 13);

      // Traffic and collectibles.
      world.spawn += dt;

      if (world.spawn >= 1.35) {
        world.spawn = 0;

        world.objects.push({
          id: world.nextId++,
          lane: Math.floor(Math.random() * 3),
          z: 0,
          kind: Math.random() < 0.32 ? "star" : "rival",
          car: Math.floor(Math.random() * CARS.length),
          passed: false,
        });
      }

      for (const item of world.objects) {
        const before = item.z;
        item.z += dt * 0.52 * speed;

        if (before < 0.82 && item.z >= 0.82) {
          if (item.lane === world.lane) {
            if (item.kind === "star") {
              world.score += 50;
              world.nitro = Math.min(100, world.nitro + 20);
              world.combo++;
            } else if (world.safe <= 0) {
              world.hearts = Math.max(0, world.hearts - 1);
              world.safe = 1.2;
              world.combo = 0;
            }

            item.z = 2;
          } else if (item.kind === "rival" && !item.passed) {
            // Reward dodging rival cars.
            world.score += 15;
            world.combo++;
            item.passed = true;
          }
        }
      }

      world.objects = world.objects.filter(
        (item) => item.z < 1.12
      );

      drawScene(ctx, world, imagesRef.current, racer);

      if (now - lastHud > 300) {
        lastHud = now;

        setHud({
          score: world.score,
          hearts: world.hearts,
          nitro: Math.round(world.nitro),
          combo: world.combo,
        });
      }

      // Every round ends in a mandatory Spanish challenge.
      if (world.time >= RACE_LENGTH || world.hearts <= 0) {
        running = false;
        cancelAnimationFrame(frame);

        setChoice(null);
        setSpoken(false);
        setFeedback("");
        setScreen("question");

        speak(question.spanish);
      }
    }

    frame = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
    };
  }, [screen, active, racer.car, racer.level, question.spanish]);

  function startRace() {
    worldRef.current = newWorld();

    setHud({
      score: 0,
      hearts: 3,
      nitro: 100,
      combo: 0,
    });

    setChoice(null);
    setSpoken(false);
    setFeedback("");

    setScreen("race");
  }

  function approveAnswer() {
    if (lockRef.current) return;
    if (choice !== question.correct || !spoken) return;

    lockRef.current = true;

    const updated = players.map((p, index) =>
      index === active
        ? {
            ...p,
            level: Math.min(6, p.level + 1),
            xp: p.xp + 100 + worldRef.current.score,
          }
        : p
    );

    setPlayers(updated);

    speak("¡Excelente! ¡Muy bien!");

    if (updated.every((p) => p.level >= 6)) {
      setScreen("finish");
    } else {
      const other = active === 0 ? 1 : 0;
      setActive(
        updated[other].level < 6 ? other : active
      );
      setScreen("garage");
    }

    lockRef.current = false;
  }

  function resetGame() {
    setPlayers(INITIAL);
    setActive(0);
    setScreen("garage");
    setChoice(null);
    setSpoken(false);
    setFeedback("");
  }

  return (
    <main className="turbo-game">
      <style suppressHydrationWarning>{CSS}</style>

      <header className="topbar">
        <strong>🏁 KW TURBO RACERS</strong>
        <span>
          ⭐ {players[0].xp + players[1].xp} TEAM XP
        </span>
      </header>

      {screen === "garage" && (
        <section className="garage">
          <div className="hero">
            <small>THE SPANISH GRAND PRIX</small>
            <h1>CHOOSE YOUR RIDE!</h1>
            <p>REAL CARS · TURBO · SPANISH CHALLENGES</p>
          </div>

          <div className="player-tabs">
            {players.map((p, i) => (
              <button
                key={i}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
              >
                🏎️ {p.name}
                <small>GATE {Math.min(6, p.level + 1)}/6</small>
              </button>
            ))}
          </div>

          <div className="player-info">
            <label>
              DRIVER NAME
              <input
                maxLength={20}
                value={racer.name}
                onChange={(e) =>
                  changePlayer({ name: e.target.value })
                }
              />
            </label>

            <label>
              AGE
              <select
                value={racer.age}
                onChange={(e) =>
                  changePlayer({ age: e.target.value })
                }
              >
                {["7", "8", "9", "10", "11", "12"].map((age) => (
                  <option key={age}>{age}</option>
                ))}
              </select>
            </label>

            <label>
              COUNTRY
              <input
                value={racer.country}
                onChange={(e) =>
                  changePlayer({ country: e.target.value })
                }
              />
            </label>
          </div>

          <div className="car-grid">
            {CARS.map((car, i) => (
              <button
                key={car.name}
                className={`car-card ${
                  racer.car === i ? "selected" : ""
                }`}
                onClick={() => changePlayer({ car: i })}
              >
                <CarPhoto index={i} selected={racer.car === i} />
                <div className="car-description">
                  <small>{car.type}</small>
                  <strong>{car.name}</strong>
                </div>
              </button>
            ))}
          </div>

          <button className="primary" onClick={startRace}>
            🚀 START MY RACE!
          </button>
        </section>
      )}

      {screen === "race" && (
        <section className="race">
          <div className="race-hud">
            <span>🏎️ {racer.name}</span>
            <span>❤️ {hud.hearts}</span>
            <span>⭐ {hud.score}</span>
            <span>⚡ {hud.nitro}%</span>
            <span>🔥 COMBO {hud.combo}</span>
          </div>

          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="race-canvas"
            aria-label="Arcade racing game"
          />

          <div className="controls">
            <button onClick={() => move(-1)}>◀ LEFT</button>
            <button className="nitro" onClick={nitro}>
              ⚡ TURBO!
            </button>
            <button onClick={() => move(1)}>RIGHT ▶</button>
          </div>

          <p className="control-help">
            ← → STEER · SPACE / ↑ TURBO · DODGE CARS · GRAB STARS
          </p>
        </section>
      )}

      {screen === "question" && (
        <section className="checkpoint">
          <div className="checkpoint-title">
            🚧 SPANISH CHECKPOINT! 🚧
          </div>

          <small>
            DRIVER: {racer.name} · GATE {racer.level + 1}/6
          </small>

          <h1>{question.spanish}</h1>
          <p>{question.english}</p>

          <button
            className="audio"
            onClick={() => speak(question.spanish)}
          >
            🔊 HEAR THE QUESTION
          </button>

          <div className="choices">
            {question.answers.map((item, i) => (
              <button
                key={item}
                className={
                  choice === i
                    ? i === question.correct
                      ? "correct"
                      : "wrong"
                    : ""
                }
                onClick={() => {
                  setChoice(i);
                  setSpoken(false);
                  setFeedback(
                    i === question.correct
                      ? "⭐ CORRECT! SAY THE SENTENCE!"
                      : "TRY AGAIN! ¡OTRA VEZ!"
                  );
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="feedback">{feedback}</div>
          )}

          {choice === question.correct && (
            <div className="speak-panel">
              <span>🎤 SPEAK TO UNLOCK!</span>
              <h2>{sentence(racer, racer.level)}</h2>

              <button
                onClick={() =>
                  speak(sentence(racer, racer.level))
                }
              >
                🔊 LISTEN
              </button>

              <button
                className={spoken ? "approved" : ""}
                onClick={() => setSpoken(true)}
              >
                {spoken
                  ? "✅ TEACHER APPROVED"
                  : "🎤 APPROVE SPOKEN ANSWER"}
              </button>
            </div>
          )}

          <button
            className="primary"
            disabled={choice !== question.correct || !spoken}
            onClick={approveAnswer}
          >
            ⭐ UNLOCK NEXT RACE · +100 XP
          </button>
        </section>
      )}

      {screen === "finish" && (
        <section className="finish">
          <div className="trophy">🏆 🎉 🏁</div>
          <h1>SPANISH CHAMPIONS!</h1>
          <h2>¡FELICIDADES!</h2>

          <div className="results">
            {players.map((p, i) => (
              <div className="result" key={i}>
                <CarPhoto index={p.car} />

                <h3>{p.name}</h3>
                <strong>⭐ {p.xp} XP</strong>
                <p>{fullIntro(p)}</p>

                <button onClick={() => speak(fullIntro(p))}>
                  🔊 HEAR MY INTRODUCTION
                </button>
              </div>
            ))}
          </div>

          <button className="primary" onClick={resetGame}>
            🏁 NEW CHAMPIONSHIP
          </button>
        </section>
      )}
    </main>
  );
}

const CSS = `
.turbo-game {
  min-height:100vh;
  background:#090e1b;
  color:white;
  font-family:Arial,Helvetica,sans-serif;
}
.turbo-game * {box-sizing:border-box;}
.turbo-game button,.turbo-game input,.turbo-game select {font:inherit;}
.turbo-game button {cursor:pointer;}
.turbo-game button:disabled {opacity:.4;cursor:not-allowed;}
.topbar {
  display:flex;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  padding:16px 24px;
  background:#142039;
  border-bottom:1px solid #354867;
}
.topbar strong {color:#ffe078;font-size:18px;}
.topbar span {color:#83eaff;font-weight:900;}
.garage {
  max-width:1250px;
  margin:auto;
  padding:28px 20px 55px;
  text-align:center;
}
.hero small {
  color:#8beaff;
  font-size:12px;
  font-weight:900;
  letter-spacing:3px;
}
.hero h1 {
  font-size:clamp(36px,7vw,76px);
  line-height:1.05;
  margin:15px auto;
}
.hero p {color:#ffe078;font-weight:900;}
.player-tabs {
  display:flex;
  justify-content:center;
  flex-wrap:wrap;
  gap:12px;
  margin:25px auto;
}
.player-tabs button {
  display:flex;
  flex-direction:column;
  gap:8px;
  background:#263650;
  color:white;
  border:2px solid #4e6584;
  border-radius:15px;
  padding:15px 25px;
  font-weight:900;
}
.player-tabs button.active {
  background:#ffe078;
  color:#241c11;
  border-color:#ffe078;
}
.player-tabs small {font-size:10px;}
.player-info {
  display:grid;
  grid-template-columns:2fr 1fr 2fr;
  max-width:800px;
  margin:20px auto;
  gap:12px;
  text-align:left;
}
.player-info label {
  color:#ffe078;
  font-size:12px;
  font-weight:900;
}
.player-info input,.player-info select {
  width:100%;
  display:block;
  background:#1d2e47;
  color:white;
  border:1px solid #5c7597;
  border-radius:10px;
  padding:13px;
  margin-top:8px;
}
.car-grid {
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:15px;
  margin:30px auto;
}
.car-card {
  background:#1c2940;
  border:3px solid #374f70;
  border-radius:18px;
  overflow:hidden;
  padding:0;
  color:white;
  text-align:left;
  transition:transform .15s;
}
.car-card:hover {transform:translateY(-4px);}
.car-card.selected {
  border-color:#ffe078;
  box-shadow:0 0 25px #ffe07825;
}
.car-photo {
  position:relative;
  height:175px;
  background:#283b57;
  overflow:hidden;
}
.car-photo img {
  display:block;
  width:100%;
  height:100%;
  object-fit:cover;
}
.photo-fallback {
  display:grid;
  place-items:center;
  align-content:center;
  gap:8px;
  height:100%;
  color:#ffffff;
  font-size:45px;
}
.photo-fallback strong {font-size:13px;}
.selected-tag {
  position:absolute;
  top:8px;
  right:8px;
  background:#ffe078;
  color:#1d1c16;
  border-radius:7px;
  padding:8px;
  font-size:10px;
  font-weight:900;
}
.car-description {padding:16px;}
.car-description small {
  display:block;
  color:#83eaff;
  font-weight:900;
  font-size:11px;
}
.car-description strong {
  display:block;
  font-size:18px;
  margin-top:9px;
}
.primary {
  background:linear-gradient(120deg,#ffed91,#ffbd41);
  color:#211b0e;
  border:0;
  border-radius:15px;
  padding:19px 30px;
  font-size:18px!important;
  font-weight:900!important;
  margin:25px auto;
  box-shadow:0 5px 0 #a4741e;
}
.race {max-width:1150px;margin:auto;}
.race-hud {
  background:#1a2a45;
  padding:15px;
  display:flex;
  align-items:center;
  justify-content:space-around;
  gap:10px;
  flex-wrap:wrap;
  color:#ffe078;
  font-weight:900;
}
.race-canvas {
  display:block;
  width:100%;
  height:auto;
  max-height:70vh;
  background:#15253e;
}
.controls {
  display:grid;
  grid-template-columns:1fr 1.4fr 1fr;
  gap:12px;
  background:#14253e;
  padding:15px;
}
.controls button {
  background:#2f486c;
  color:white;
  border:2px solid #6784ac;
  border-radius:15px;
  min-height:80px;
  font-size:18px;
  font-weight:900;
}
.controls .nitro {
  background:#ffe078;
  color:#221c0f;
}
.control-help {
  color:#b1c5dd;
  text-align:center;
  font-size:12px;
  font-weight:900;
  padding:15px;
}
.checkpoint {
  max-width:810px;
  margin:25px auto;
  border:3px solid #ffe078;
  background:linear-gradient(#273f6a,#121f35);
  border-radius:25px;
  padding:32px 20px;
  text-align:center;
}
.checkpoint-title {
  color:#ffe078;
  font-size:clamp(23px,4vw,39px);
  font-weight:900;
  margin-bottom:20px;
}
.checkpoint>small {color:#8beaff;font-weight:900;}
.checkpoint h1 {
  font-size:clamp(28px,5vw,52px);
  margin:20px 0 10px;
}
.checkpoint>p {color:#cbdcf0;font-size:20px;}
.audio,.speak-panel button,.result button {
  background:#506aab;
  color:white;
  border:0;
  border-radius:12px;
  padding:15px 21px;
  font-weight:900;
  margin:8px;
}
.choices {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:13px;
  margin:27px 0;
}
.choices button {
  min-height:110px;
  border:2px solid #6884a9;
  border-radius:14px;
  background:#2e486c;
  padding:14px;
  color:white;
  font-weight:900;
}
.choices button.correct {
  background:#267d55;
  border-color:#8dffc1;
}
.choices button.wrong {
  background:#833849;
  border-color:#ff92a1;
}
.feedback {
  color:#ffe078;
  font-weight:900;
  padding:15px;
}
.speak-panel {
  background:#294361;
  border-radius:20px;
  padding:24px;
  margin:20px 0;
}
.speak-panel span {color:#ffe078;font-weight:900;}
.speak-panel h2 {
  font-size:clamp(24px,4vw,36px);
}
.speak-panel button.approved {background:#20a36b;}
.finish {
  max-width:1000px;
  margin:auto;
  text-align:center;
  padding:45px 20px;
}
.trophy {font-size:60px;}
.finish>h1 {
  font-size:clamp(39px,7vw,75px);
  color:#ffe078;
}
.finish>h2 {color:#88eaff;}
.results {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:20px;
  margin:30px auto;
}
.result {
  background:#1d2f48;
  border:2px solid #4f6888;
  border-radius:20px;
  padding:20px;
}
.result .car-photo {height:210px;border-radius:13px;}
.result h3 {font-size:27px;}
.result strong {color:#ffe078;font-size:24px;}
.result p {font-size:18px;line-height:1.6;}
@media(max-width:850px) {
  .car-grid {grid-template-columns:repeat(2,minmax(0,1fr));}
  .player-info {grid-template-columns:1fr;}
}
@media(max-width:550px) {
  .car-grid {gap:9px;}
  .car-photo {height:120px;}
  .car-description {padding:10px;}
  .car-description strong {font-size:14px;}
  .choices,.results {grid-template-columns:1fr;}
  .choices button {min-height:65px;}
  .controls {gap:7px;padding:9px;}
  .controls button {min-height:69px;font-size:13px;}
  .checkpoint {margin:10px;padding:22px 12px;}
}
`;
