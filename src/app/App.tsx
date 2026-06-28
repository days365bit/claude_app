import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Food = { id: string; name: string; sub: string; emoji: string; color: string; cat: string };
type Restaurant = { name: string; cat: string; emoji: string; bg: string; rating: number; dist: string; wait: string; addr: string; lat: number; lng: number; rec?: boolean };

const FOODS: Food[] = [
  { id: "korean",   name: "한식",  sub: "국밥·비빔밥",   emoji: "🍲", color: "#FF6B35", cat: "한식"  },
  { id: "japanese", name: "일식",  sub: "라멘·초밥",     emoji: "🍣", color: "#2a78d6", cat: "일식"  },
  { id: "chinese",  name: "중식",  sub: "짜장·짬뽕",     emoji: "🥟", color: "#1baf7a", cat: "중식"  },
  { id: "western",  name: "양식",  sub: "파스타·돈가스",  emoji: "🍝", color: "#eda100", cat: "양식"  },
  { id: "snack",    name: "분식",  sub: "떡볶이·김밥",   emoji: "🌮", color: "#4a3aa7", cat: "분식"  },
  { id: "burger",   name: "햄버거", sub: "버거·감자튀김", emoji: "🍔", color: "#e34948", cat: "햄버거" },
];

const RESTAURANTS: Restaurant[] = [
  { name: "한솥도시락 역삼점", cat: "한식",  emoji: "🍱", bg: "#FFF3E0", rating: 4.2, dist: "3분",  wait: "즉시",  addr: "강남구 역삼동 123-4", lat: 0.45, lng: 0.30, rec: true },
  { name: "진순이 설렁탕",    cat: "한식",  emoji: "🍲", bg: "#FFF8F5", rating: 4.6, dist: "5분",  wait: "15분",  addr: "강남구 역삼동 456-7", lat: 0.35, lng: 0.55 },
  { name: "뚝배기 가마솥",    cat: "한식",  emoji: "🥘", bg: "#FFF0EB", rating: 4.1, dist: "4분",  wait: "5분",   addr: "강남구 역삼동 234-5", lat: 0.50, lng: 0.65, rec: true },
  { name: "후지야 라멘",      cat: "일식",  emoji: "🍜", bg: "#E8F4FD", rating: 4.4, dist: "7분",  wait: "10분",  addr: "강남구 역삼동 789-1", lat: 0.60, lng: 0.40 },
  { name: "스시료 역삼",      cat: "일식",  emoji: "🍣", bg: "#EEF6FF", rating: 4.7, dist: "9분",  wait: "20분",  addr: "강남구 역삼동 102-3", lat: 0.55, lng: 0.60 },
  { name: "짬뽕특구",         cat: "중식",  emoji: "🥟", bg: "#E8F8F0", rating: 4.3, dist: "6분",  wait: "20분",  addr: "강남구 역삼동 567-8", lat: 0.25, lng: 0.50 },
  { name: "왕돈가스 역삼",    cat: "양식",  emoji: "🥩", bg: "#FFF8E0", rating: 4.2, dist: "5분",  wait: "10분",  addr: "강남구 역삼동 910-1", lat: 0.40, lng: 0.35 },
  { name: "파파이스 역삼점",  cat: "햄버거", emoji: "🍔", bg: "#FFE8E0", rating: 4.1, dist: "3분",  wait: "즉시",  addr: "강남구 역삼동 321-4", lat: 0.38, lng: 0.28, rec: true },
  { name: "맘스터치 역삼",    cat: "햄버거", emoji: "🍔", bg: "#FFF0E8", rating: 4.3, dist: "6분",  wait: "5분",   addr: "강남구 역삼동 654-7", lat: 0.62, lng: 0.42 },
  { name: "종각 분식",        cat: "분식",  emoji: "🌮", bg: "#F0EBFF", rating: 4.0, dist: "8분",  wait: "즉시",  addr: "강남구 역삼동 345-6", lat: 0.30, lng: 0.70 },
];

// ─── Status Bar ───────────────────────────────────────────────────────────────

function StatusBar() {
  const [time, setTime] = useState(() => {
    const n = new Date();
    return `${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setTime(`${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height: 52, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 22px 8px", background: "#F2F2F7", flexShrink: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9C8.55 9 9 9.45 9 10S8.55 11 8 11 7 10.55 7 10 7.45 9 8 9Z" fill="#000"/>
          <path d="M4.5 6.5C5.6 5.4 7 4.8 8 4.8s2.4.6 3.5 1.7l1-1C11.1 4 9.6 3.3 8 3.3S4.9 4 3.5 5.5l1 1Z" fill="#000"/>
          <path d="M1.8 3.8C3.4 2.2 5.6 1.3 8 1.3s4.6.9 6.2 2.5l1-1C13.3.9 10.8 0 8 0S2.7.9.8 2.8l1 1Z" fill="#000" opacity=".4"/>
        </svg>
        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 22, height: 11, borderRadius: 3, border: "1px solid rgba(0,0,0,0.35)", padding: "1.5px", display: "flex", alignItems: "center" }}>
            <div style={{ width: "76%", height: "100%", borderRadius: 1.5, background: "#000" }} />
          </div>
          <div style={{ width: 2, height: 5, background: "rgba(0,0,0,0.4)", borderRadius: "0 1px 1px 0" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Nav Header ───────────────────────────────────────────────────────────────

function NavHeader({ title, backLabel, onBack }: { title: string; backLabel?: string; onBack?: () => void }) {
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", padding: "0 16px", background: "#F2F2F7", borderBottom: "0.5px solid #E5E5EA", flexShrink: 0, position: "relative" }}>
      {onBack ? (
        <button onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 2, color: "#FF6B35", fontSize: 15, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", padding: "4px 0", zIndex: 1, fontWeight: 400 }}>
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5L9 16" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ marginLeft: 2 }}>{backLabel ?? "뒤로"}</span>
        </button>
      ) : (
        <div style={{ width: 60 }} />
      )}
      <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 16, fontWeight: 600, color: "#000", pointerEvents: "none" }}>
        {title}
      </div>
    </div>
  );
}

// ─── Roulette Canvas ──────────────────────────────────────────────────────────

export type RouletteHandle = { spin: () => void; canSpin: boolean; spinning: boolean };

const RouletteCanvas = forwardRef<RouletteHandle, {
  votes: Record<string, number>;
  onSpinEnd: (winner: Food) => void;
  result: string;
  setResult: (s: string) => void;
}>(function RouletteCanvas({ votes, onSpinEnd, result, setResult }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rAngleRef = useRef(0);
  const spinningRef = useRef(false);
  const rafRef = useRef<number>(0);
  const [spinning, setSpinning] = useState(false);

  const voted = FOODS.filter(f => (votes[f.id] || 0) > 0);
  const canSpin = voted.length > 0 && !spinning;

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const cx = 90, cy = 90, r = 86;
    ctx.clearRect(0, 0, 180, 180);

    const list = FOODS.filter(f => (votes[f.id] || 0) > 0);

    if (!list.length) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = "#EFEFEF"; ctx.fill();
      ctx.fillStyle = "#C7C7CC"; ctx.font = "12px -apple-system,sans-serif"; ctx.textAlign = "center";
      ctx.fillText("투표 후 활성화돼요", cx, cy + 4);
    } else if (list.length === 1) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = list[0].color; ctx.fill();
      ctx.fillStyle = "#fff"; ctx.textAlign = "center";
      ctx.font = "bold 28px -apple-system,sans-serif"; ctx.fillText(list[0].emoji, cx, cy + 2);
      ctx.font = "bold 13px -apple-system,sans-serif"; ctx.fillText(list[0].name, cx, cy + 20);
    } else {
      const arc = (Math.PI * 2) / list.length;
      list.forEach((f, i) => {
        const s = rAngleRef.current + i * arc - Math.PI / 2, e = s + arc;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, s, e);
        ctx.fillStyle = f.color; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(s + arc / 2);
        ctx.textAlign = "right"; ctx.fillStyle = "#fff";
        const sm = list.length > 4;
        ctx.font = `bold ${sm ? 10 : 12}px -apple-system,sans-serif`;
        ctx.fillText(f.emoji, r - 5, 4);
        if (!sm) { ctx.font = "bold 10px -apple-system,sans-serif"; ctx.fillText(f.name, r - 22, 4); }
        ctx.restore();
      });
    }
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = "#E5E5EA"; ctx.lineWidth = 2; ctx.stroke();
  }, [votes]);

  useEffect(() => { draw(); }, [draw]);

  const spin = useCallback(() => {
    const list = FOODS.filter(f => (votes[f.id] || 0) > 0);
    if (!list.length || spinningRef.current) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult("돌아가는 중...");

    const totalRot = Math.PI * 2 * (6 + Math.random() * 6);
    const dur = 3600, t0 = performance.now(), a0 = rAngleRef.current;

    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      rAngleRef.current = a0 + totalRot * (1 - Math.pow(1 - p, 4));
      draw();
      if (p < 1) { rafRef.current = requestAnimationFrame(tick); return; }

      const arc = (Math.PI * 2) / list.length;
      const norm = ((rAngleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const idx = Math.floor(((Math.PI * 2 - norm + Math.PI / 2) % (Math.PI * 2)) / arc) % list.length;
      const w = list[idx];
      setResult(`${w.emoji} ${w.name} 당첨!`);
      spinningRef.current = false;
      setSpinning(false);
      onSpinEnd(w);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [votes, draw, onSpinEnd, setResult]);

  useImperativeHandle(ref, () => ({ spin, canSpin, spinning }), [spin, canSpin, spinning]);

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 14, textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 10, textAlign: "left" }}>룰렛으로 결정하기</div>
      <div style={{ position: "relative", width: 180, margin: "0 auto 10px" }}>
        <canvas ref={canvasRef} width={180} height={180} />
        <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "16px solid #FF6B35" }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#000", minHeight: 22 }}>{result}</div>
    </div>
  );
});

// ─── Map SVG ─────────────────────────────────────────────────────────────────

function MapSVG({ restaurant }: { restaurant: Restaurant }) {
  const W = 320, H = 188;
  const roads = [
    { x1: 0, y1: 66, x2: 320, y2: 75, w: 12 }, { x1: 0, y1: 122, x2: 320, y2: 117, w: 10 },
    { x1: 78, y1: 0, x2: 87, y2: 188, w: 10 }, { x1: 174, y1: 0, x2: 169, y2: 188, w: 10 },
    { x1: 244, y1: 0, x2: 248, y2: 188, w: 10 },
  ];
  const blds = [
    { x: 12, y: 12, w: 58, h: 46 }, { x: 96, y: 8, w: 68, h: 50 }, { x: 188, y: 7, w: 44, h: 52 },
    { x: 256, y: 10, w: 58, h: 48 }, { x: 8, y: 84, w: 62, h: 30 }, { x: 96, y: 82, w: 68, h: 28 },
    { x: 188, y: 82, w: 46, h: 28 }, { x: 256, y: 83, w: 58, h: 28 }, { x: 8, y: 130, w: 62, h: 52 },
    { x: 96, y: 128, w: 68, h: 54 }, { x: 188, y: 130, w: 46, h: 52 }, { x: 256, y: 130, w: 58, h: 52 },
  ];
  const px = Math.round(restaurant.lng * W);
  const py = Math.round(restaurant.lat * H);

  return (
    <svg viewBox="0 0 320 188" style={{ width: "100%", height: "100%" }}>
      <rect width="320" height="188" fill="#E8F4FD" />
      {roads.map((rd, i) => <line key={i} x1={rd.x1} y1={rd.y1} x2={rd.x2} y2={rd.y2} stroke="#fff" strokeWidth={rd.w} />)}
      {blds.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="#C8D8E8" />)}
      <circle cx={W / 2} cy={H / 2} r="6" fill="#34C759" />
      <circle cx={W / 2} cy={H / 2} r="3" fill="#fff" />
      <circle cx={px} cy={py} r="13" fill="#FF6B35" opacity=".25" />
      <circle cx={px} cy={py} r="8" fill="#FF6B35" />
      <circle cx={px} cy={py} r="4" fill="#fff" />
      <text x={px} y={py - 17} textAnchor="middle" fontSize="11" fontWeight="600" fill="#FF6B35" fontFamily="-apple-system,sans-serif">
        {restaurant.name.split(" ")[0]}
      </text>
    </svg>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

type View = "main" | "select" | "rest" | "map";

export default function App() {
  const [view, setView] = useState<View>("main");
  const [dir, setDir] = useState<"left" | "right">("left");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [currentPick, setCurrentPick] = useState<string | null>(null);
  const [rouletteWinner, setRouletteWinner] = useState<Food | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [spinResult, setSpinResult] = useState("");
  const rouletteRef = useRef<RouletteHandle>(null);

  const VIEW_ORDER: View[] = ["main", "select", "rest", "map"];

  const go = (to: View, explicitDir?: "left" | "right") => {
    const fi = VIEW_ORDER.indexOf(view), ti = VIEW_ORDER.indexOf(to);
    setDir(explicitDir ?? (ti >= fi ? "left" : "right"));
    setView(to);
  };

  const startVote = () => { setCurrentPick(null); go("select", "left"); };
  const cancelVote = () => go("main", "right");

  const confirmVote = () => {
    if (!currentPick) return;
    setVotes(prev => ({ ...prev, [currentPick]: (prev[currentPick] || 0) + 1 }));
    setTotalParticipants(p => p + 1);
    go("main", "right");
  };

  const resetAll = () => {
    setVotes({});
    setTotalParticipants(0);
    setRouletteWinner(null);
    setSpinResult("");
  };

  const openMap = (r: Restaurant) => { setSelectedRestaurant(r); go("map", "left"); };

  const restList = rouletteWinner
    ? RESTAURANTS.filter(r => r.cat === rouletteWinner.cat)
    : RESTAURANTS;

  // stats: foods with votes, sorted by count desc
  const votedFoods = FOODS.filter(f => (votes[f.id] || 0) > 0)
    .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0));
  const maxVotes = Math.max(...votedFoods.map(f => votes[f.id] || 0), 1);

  const slideVariants = {
    enterLeft:  { x: 48,  opacity: 0 },
    enterRight: { x: -48, opacity: 0 },
    center:     { x: 0,   opacity: 1 },
    exitLeft:   { x: -48, opacity: 0 },
    exitRight:  { x: 48,  opacity: 0 },
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#E5E5EA", fontFamily: "-apple-system,'SF Pro Text',Helvetica,sans-serif", padding: "20px 0" }}>

      {/* iPhone frame */}
      <div style={{ width: 320, background: "#000", borderRadius: 48, padding: 3, boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.1)" }}>
        <div style={{ background: "#F2F2F7", borderRadius: 46, overflow: "hidden", minHeight: 700, display: "flex", flexDirection: "column", position: "relative" }}>

          {/* Dynamic Island */}
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 88, height: 28, background: "#000", borderRadius: 20, zIndex: 99 }} />

          <StatusBar />

          {/* Screen area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={view}
                variants={slideVariants}
                initial={dir === "left" ? "enterLeft" : "enterRight"}
                animate="center"
                exit={dir === "left" ? "exitLeft" : "exitRight"}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
              >

                {/* ── MAIN ─────────────────────────────────────────────── */}
                {view === "main" && (
                  <>
                    <NavHeader title="오늘 점심 뭐 먹지?" />
                    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }} className="hide-scrollbar">

                      <div style={{ padding: "16px 20px 10px" }}>
                        <div style={{ fontSize: 13, color: "#8E8E93" }}>버튼을 눌러 음식을 선택해요</div>
                      </div>

                      {/* Participant card */}
                      <div style={{ margin: "0 16px 12px", background: "#fff", borderRadius: 16, padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: "#FF6B35", letterSpacing: -0.5 }}>
                              <span>{totalParticipants}</span>명
                            </div>
                            <div style={{ fontSize: 13, color: "#8E8E93", marginTop: 2 }}>참여 완료</div>
                          </div>
                          <button onClick={startVote}
                            style={{ height: 44, borderRadius: 12, border: "none", background: "#FF6B35", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "0 20px", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 18 }}>＋</span>참여하기
                          </button>
                        </div>
                        <button onClick={resetAll}
                          style={{ width: "100%", height: 34, borderRadius: 9, border: "1px solid #E5E5EA", background: "transparent", color: "#8E8E93", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          ↺ 초기화
                        </button>
                      </div>

                      {/* Stats card */}
                      <div style={{ margin: "0 16px 12px", background: "#fff", borderRadius: 16, padding: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>투표 현황</span>
                          <span style={{ fontSize: 11, color: "#8E8E93" }}>
                            {totalParticipants > 0 ? `총 ${totalParticipants}명 참여` : "아직 투표 없음"}
                          </span>
                        </div>
                        {votedFoods.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "20px 0", color: "#C7C7CC", fontSize: 13 }}>
                            참여하기를 눌러 투표를 시작하세요
                          </div>
                        ) : votedFoods.map(f => {
                          const n = votes[f.id] || 0;
                          const barW = Math.round(n / maxVotes * 100);
                          const pct = Math.round(n / totalParticipants * 100);
                          return (
                            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{f.emoji}</span>
                              <span style={{ fontSize: 12, color: "#3C3C43", width: 38, flexShrink: 0, fontWeight: 500 }}>{f.name}</span>
                              <div style={{ flex: 1, height: 22, background: "#F2F2F7", borderRadius: 6, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${barW}%` }} transition={{ duration: 0.4 }}
                                  style={{ height: "100%", borderRadius: 6, background: f.color, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                                  {n > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{n}명</span>}
                                </motion.div>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#3C3C43", width: 28, textAlign: "right", flexShrink: 0 }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Roulette wheel (no buttons inside) */}
                      <div style={{ margin: "0 16px 10px" }}>
                        <RouletteCanvas
                          ref={rouletteRef}
                          votes={votes}
                          result={spinResult}
                          setResult={setSpinResult}
                          onSpinEnd={(winner) => setRouletteWinner(winner)}
                        />
                      </div>

                      {/* 3-button action bar */}
                      <div style={{ padding: "0 16px 4px", display: "flex", flexDirection: "column", gap: 8 }}>
                        {/* Primary: spin */}
                        <button
                          onClick={() => rouletteRef.current?.spin()}
                          disabled={!(rouletteRef.current?.canSpin ?? false) && Object.keys(votes).length === 0}
                          style={{
                            width: "100%", height: 44, borderRadius: 12, border: "none",
                            background: Object.values(votes).some(v => v > 0) ? "#FF6B35" : "#FFB899",
                            color: "#fff", fontSize: 15, fontWeight: 600,
                            cursor: Object.values(votes).some(v => v > 0) ? "pointer" : "default",
                            fontFamily: "inherit",
                          }}
                        >
                          🎲 룰렛 돌리기
                        </button>

                        {/* Secondary row: 참여하기 + 맛집 보기 */}
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={startVote}
                            style={{ flex: 1, height: 40, borderRadius: 11, border: "1.5px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            ＋ 참여하기
                          </button>
                          <AnimatePresence initial={false}>
                            {rouletteWinner ? (
                              <motion.button key="rest-btn"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => go("rest", "left")}
                                style={{ flex: 1, height: 40, borderRadius: 11, border: "none", background: "#FFF0EB", color: "#C73E00", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {rouletteWinner.emoji} 맛집 보기
                              </motion.button>
                            ) : (
                              <motion.button key="reset-btn"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                onClick={resetAll}
                                style={{ flex: 1, height: 40, borderRadius: 11, border: "1px solid #E5E5EA", background: "transparent", color: "#8E8E93", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                                ↺ 초기화
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── FOOD SELECT ──────────────────────────────────────── */}
                {view === "select" && (
                  <>
                    <NavHeader title={`${totalParticipants + 1}번째 참여`} backLabel="메인" onBack={cancelVote} />
                    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }} className="hide-scrollbar">
                      <div style={{ padding: "12px 20px 10px", fontSize: 13, color: "#8E8E93" }}>먹고 싶은 음식을 골라주세요</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8, padding: "0 16px 12px" }}>
                        {FOODS.map(f => {
                          const sel = currentPick === f.id;
                          return (
                            <motion.div key={f.id} whileTap={{ scale: 0.96 }}
                              onClick={() => setCurrentPick(f.id)}
                              style={{ background: sel ? "#FFF8F5" : "#fff", borderRadius: 14, padding: "14px 10px 12px", cursor: "pointer", border: `2px solid ${sel ? "#FF6B35" : "#E5E5EA"}`, textAlign: "center", position: "relative", userSelect: "none" }}>
                              {/* Checkmark */}
                              <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${sel ? "transparent" : "#C7C7CC"}`, background: sel ? "#FF6B35" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: sel ? "#fff" : "transparent" }}>
                                ✓
                              </div>
                              <div style={{ fontSize: 30, marginBottom: 6 }}>{f.emoji}</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{f.name}</div>
                              <div style={{ fontSize: 10, color: "#8E8E93", marginTop: 2 }}>{f.sub}</div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div style={{ padding: "0 16px" }}>
                        <button onClick={confirmVote} disabled={!currentPick}
                          style={{ width: "100%", height: 44, borderRadius: 12, border: "none", background: currentPick ? "#FF6B35" : "#FFB899", color: "#fff", fontSize: 15, fontWeight: 600, cursor: currentPick ? "pointer" : "default", fontFamily: "inherit" }}>
                          선택 완료
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── RESTAURANTS ──────────────────────────────────────── */}
                {view === "rest" && (
                  <>
                    <NavHeader
                      title={rouletteWinner ? `${rouletteWinner.name} 맛집` : "주변 맛집"}
                      backLabel="메인"
                      onBack={() => go("main", "right")}
                    />
                    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }} className="hide-scrollbar">
                      <div style={{ padding: "12px 20px 6px", fontSize: 13, color: "#8E8E93" }}>
                        {rouletteWinner ? `${restList.length}곳 · 룰렛 결과 필터` : `${RESTAURANTS.length}곳 · 도보 10분 이내`}
                      </div>

                      {/* Roulette result banner */}
                      {rouletteWinner && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                          style={{ margin: "0 16px 10px", background: "#FFF8F5", borderRadius: 14, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 24 }}>{rouletteWinner.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: "#C73E00", fontWeight: 600, marginBottom: 1 }}>룰렛 결과</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>{rouletteWinner.name} 음식점만 보는 중</div>
                          </div>
                          <span onClick={() => setRouletteWinner(null)} style={{ fontSize: 11, color: "#8E8E93", cursor: "pointer", textDecoration: "underline", whiteSpace: "nowrap" }}>전체 보기</span>
                        </motion.div>
                      )}

                      {/* Restaurant list */}
                      <div style={{ padding: "0 16px" }}>
                        {restList.length === 0 ? (
                          <div style={{ textAlign: "center", padding: 30, color: "#8E8E93", fontSize: 13 }}>
                            해당 음식점이 없어요<br />
                            <span onClick={() => setRouletteWinner(null)} style={{ color: "#FF6B35", cursor: "pointer" }}>전체 보기</span>
                          </div>
                        ) : restList.map((r, i) => (
                          <motion.div key={r.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            onClick={() => openMap(r)}
                            style={{ background: "#fff", borderRadius: 14, padding: 12, marginBottom: 9, cursor: "pointer", display: "flex", alignItems: "center", gap: 11 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>{r.name}</span>
                                {r.rec && <span style={{ fontSize: 10, background: "#FFF0EB", color: "#C73E00", padding: "2px 6px", borderRadius: 4, fontWeight: 600, marginLeft: 4 }}>추천</span>}
                              </div>
                              <div style={{ fontSize: 11, color: "#8E8E93", marginBottom: 3 }}>{r.cat}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#FF9F0A" }}>★ {r.rating}</span>
                                <span style={{ fontSize: 11, color: "#8E8E93" }}>{r.dist}</span>
                                <span style={{ fontSize: 10, background: "#E5E5EA", color: "#3C3C43", padding: "2px 5px", borderRadius: 4, fontWeight: 500 }}>대기 {r.wait}</span>
                              </div>
                            </div>
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                              <path d="M1 1L7 7L1 13" stroke="#C7C7CC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── MAP ──────────────────────────────────────────────── */}
                {view === "map" && selectedRestaurant && (
                  <>
                    <NavHeader title={selectedRestaurant.name} backLabel="맛집" onBack={() => go("rest", "right")} />
                    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }} className="hide-scrollbar">
                      {/* Map */}
                      <div style={{ margin: "0 16px 10px", background: "#E8F4FD", borderRadius: 16, height: 188, overflow: "hidden" }}>
                        <MapSVG restaurant={selectedRestaurant} />
                      </div>

                      {/* Info card */}
                      <div style={{ margin: "0 16px", background: "#fff", borderRadius: 14, padding: 13 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 3 }}>{selectedRestaurant.name}</div>
                        <div style={{ fontSize: 12, color: "#8E8E93", marginBottom: 9 }}>{selectedRestaurant.addr}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {[
                            { label: `★ ${selectedRestaurant.rating}` },
                            { label: selectedRestaurant.dist },
                            { label: `대기 ${selectedRestaurant.wait}` },
                          ].map(({ label }) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, background: "#F2F2F7", borderRadius: 20, padding: "5px 10px", fontSize: 11, fontWeight: 500, color: "#3C3C43" }}>
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nav button */}
                      <button style={{ width: "calc(100% - 32px)", margin: "10px 16px 0", height: 42, borderRadius: 12, border: "none", background: "#FF6B35", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        ↗ 길 안내
                      </button>
                    </div>
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
