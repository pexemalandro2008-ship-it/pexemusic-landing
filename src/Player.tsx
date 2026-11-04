import { useEffect, useRef, useState } from "react";
import { media, waLink } from "./config";

/* Faixas instrumentais originais (sem direitos de terceiros).
   Para trocar: coloque o .mp3 em public/music e edite a lista abaixo. */
const TRACKS = [
  { file: "correnteza.mp3", title: "Correnteza", artist: "Cardume", tag: "Lo-fi · Foco", from: "#1e7bff", to: "#3fd0ff" },
  { file: "mare-alta.mp3", title: "Maré Alta", artist: "Luma Azul", tag: "House · Treino", from: "#7c3aed", to: "#3fd0ff" },
  { file: "noite-azul.mp3", title: "Noite Azul", artist: "Índigo", tag: "Trap · Noite", from: "#0b2a6b", to: "#a855f7" },
  { file: "pexe-vibes.mp3", title: "Pexe Vibes", artist: "PexeMusic", tag: "Vibe · Relax", from: "#14a84b", to: "#3fd0ff" },
];

const music = (f: string) => `${import.meta.env.BASE_URL}music/${f}`;
const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/* evento global para não tocar música e vídeo com som ao mesmo tempo */
export const MEDIA_EVENT = "pexe:media";
export const announce = (source: "player" | "video") => window.dispatchEvent(new CustomEvent(MEDIA_EVENT, { detail: source }));

const PlayIcon = ({ c = "h-6 w-6" }) => <svg viewBox="0 0 24 24" className={c} fill="currentColor" aria-hidden><path d="M7 4v16l13-8z" /></svg>;
const PauseIcon = ({ c = "h-6 w-6" }) => <svg viewBox="0 0 24 24" className={c} fill="currentColor" aria-hidden><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>;
const SkipIcon = ({ c = "h-5 w-5", back = false }) => (
  <svg viewBox="0 0 24 24" className={`${c} ${back ? "rotate-180" : ""}`} fill="currentColor" aria-hidden><path d="M5 4v16l11-8zM17 4h2v16h-2z" /></svg>
);

function Cover({ i, spinning, size = "h-full w-full" }: { i: number; spinning: boolean; size?: string }) {
  const t = TRACKS[i];
  return (
    <div className={`relative ${size} overflow-hidden rounded-2xl`} style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_55%)]" />
      <img src={media("logo.webp")} alt="" className={`absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-2xl ring-4 ring-white/20 ${spinning ? "animate-[spin_8s_linear_infinite]" : ""}`} />
    </div>
  );
}

export default function Player() {
  const audio = useRef<HTMLAudioElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const section = useRef<HTMLElement>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [inView, setInView] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  // liga o analisador de áudio (precisa de um clique do usuário)
  const ensureAnalyser = () => {
    if (analyser.current || !audio.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const src = ctx.createMediaElementSource(audio.current);
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.8;
      src.connect(an);
      an.connect(ctx.destination);
      analyser.current = an;
    } catch {
      /* sem visualizador, áudio toca normal */
    }
  };

  const play = (i = cur) => {
    const a = audio.current;
    if (!a) return;
    ensureAnalyser();
    if (i !== cur) {
      setCur(i);
      a.src = music(TRACKS[i].file);
    }
    setDismissed(false);
    a.play().catch(() => {});
  };
  const toggle = () => (playing ? audio.current?.pause() : play());
  const next = () => play((cur + 1) % TRACKS.length);
  const prev = () => (audio.current && audio.current.currentTime > 3 ? (audio.current.currentTime = 0) : play((cur - 1 + TRACKS.length) % TRACKS.length));

  useEffect(() => {
    const a = audio.current!;
    const on = (e: Event) => {
      if (e.type === "play") { setPlaying(true); announce("player"); }
      if (e.type === "pause") setPlaying(false);
      if (e.type === "timeupdate") setTime(a.currentTime);
      if (e.type === "loadedmetadata" || e.type === "durationchange") setDur(a.duration);
    };
    const evs = ["play", "pause", "timeupdate", "loadedmetadata", "durationchange"];
    evs.forEach((ev) => a.addEventListener(ev, on));
    const onMedia = (e: Event) => (e as CustomEvent).detail === "video" && a.pause();
    window.addEventListener(MEDIA_EVENT, onMedia);
    return () => {
      evs.forEach((ev) => a.removeEventListener(ev, on));
      window.removeEventListener(MEDIA_EVENT, onMedia);
    };
  }, []);

  // próxima faixa automática
  useEffect(() => {
    const a = audio.current!;
    const end = () => next();
    a.addEventListener("ended", end);
    return () => a.removeEventListener("ended", end);
  });

  // visualizador
  useEffect(() => {
    let raf = 0;
    const draw = () => {
      const c = canvas.current;
      const an = analyser.current;
      if (c) {
        const ctx = c.getContext("2d")!;
        const w = (c.width = c.clientWidth * devicePixelRatio);
        const h = (c.height = c.clientHeight * devicePixelRatio);
        ctx.clearRect(0, 0, w, h);
        const bars = 40;
        const data = new Uint8Array(64);
        if (an && playing) an.getByteFrequencyData(data);
        const bw = w / bars;
        const g = ctx.createLinearGradient(0, h, 0, 0);
        g.addColorStop(0, TRACKS[cur].from);
        g.addColorStop(1, "#7fe6ff");
        ctx.fillStyle = g;
        for (let i = 0; i < bars; i++) {
          const v = an && playing ? data[Math.floor((i / bars) * 48)] / 255 : 0.06 + 0.04 * Math.sin(i * 0.7 + performance.now() / 600);
          const bh = Math.max(3 * devicePixelRatio, v * h);
          const x = i * bw + bw * 0.2;
          ctx.beginPath();
          ctx.roundRect(x, h - bh, bw * 0.6, bh, bw * 0.3);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [playing, cur]);

  // mini player quando a seção sai da tela
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    if (section.current) io.observe(section.current);
    return () => io.disconnect();
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const a = audio.current;
    if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    a.currentTime = Math.min(1, Math.max(0, (x - r.left) / r.width)) * dur;
  };

  const t = TRACKS[cur];
  const pct = dur ? (time / dur) * 100 : 0;

  return (
    <section id="ouvir" ref={section} className="relative overflow-hidden bg-deep py-24">
      <audio ref={audio} src={music(TRACKS[0].file)} preload="metadata" />
      <div className="absolute inset-0 opacity-60 transition-[background] duration-700" style={{ background: `radial-gradient(50% 60% at 70% 40%, ${t.from}55, transparent 70%)` }} aria-hidden />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div className="reveal">
          <span className="eyebrow">▶ Ouça agora</span>
          <h2 className="h2 mt-5">Dá o play. <span className="text-grad">Sente a diferença.</span></h2>
          <p className="mt-5 max-w-md text-lg text-white/65">
            É assim que o PexeMusic soa: sem propaganda, sem corte, faixa atrás de faixa. Escolha uma e aperte o play.
          </p>
          <a href={waLink("Oi! Ouvi o player no site e quero assinar o PexeMusic 🎧")} target="_blank" rel="noopener" className="btn-ghost mt-8">
            Quero isso no meu celular →
          </a>
          <p className="mt-6 text-xs text-white/35">Faixas demonstrativas instrumentais. No app você tem milhões de músicas dos seus artistas favoritos.</p>
        </div>

        <div className="reveal card relative overflow-hidden bg-abyss/70 p-5 shadow-2xl shadow-black/40 sm:p-7">
          <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="mx-auto aspect-square w-44 sm:w-full">
              <Cover i={cur} spinning={playing} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-glow">{playing ? "Tocando agora" : "Pronto para tocar"} · {t.tag}</p>
              <p className="mt-1 truncate font-display text-3xl font-extrabold">{t.title}</p>
              <p className="text-white/55">{t.artist}</p>
              <canvas ref={canvas} className="mt-4 h-14 w-full" aria-hidden />
              <div className="mt-3 cursor-pointer py-2" onClick={seek} onTouchStart={seek} role="slider" aria-label="Posição da música" aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(time)}>
                <div className="relative h-1.5 rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-brand-light" style={{ width: `${pct}%` }} />
                  <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" style={{ left: `${pct}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-xs tabular-nums text-white/45">
                <span>{fmt(time)}</span>
                <span>{fmt(dur)}</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-6 sm:justify-start">
                <button onClick={prev} aria-label="Faixa anterior" className="text-white/70 transition hover:text-white"><SkipIcon back /></button>
                <button onClick={toggle} aria-label={playing ? "Pausar" : "Tocar"} className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-abyss shadow-[0_10px_40px_-6px_rgba(63,208,255,.8)] transition hover:scale-105">
                  {!playing && <span className="absolute inset-0 -z-10 rounded-full bg-white animate-pulseRing" aria-hidden />}
                  {playing ? <PauseIcon c="h-7 w-7" /> : <PlayIcon c="ml-1 h-7 w-7" />}
                </button>
                <button onClick={next} aria-label="Próxima faixa" className="text-white/70 transition hover:text-white"><SkipIcon /></button>
              </div>
            </div>
          </div>

          <ul className="mt-6 divide-y divide-white/5 border-t border-white/10 pt-2">
            {TRACKS.map((tr, i) => (
              <li key={tr.file}>
                <button onClick={() => (i === cur ? toggle() : play(i))} className={`flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition hover:bg-white/5 ${i === cur ? "bg-white/[0.04]" : ""}`}>
                  <span className="h-11 w-11 shrink-0"><Cover i={i} spinning={false} size="h-11 w-11" /></span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-semibold ${i === cur ? "text-brand-light" : ""}`}>{tr.title}</span>
                    <span className="block truncate text-sm text-white/45">{tr.artist} · {tr.tag}</span>
                  </span>
                  {i === cur && playing ? (
                    <span className="inline-flex h-4 items-end gap-[3px]" aria-hidden>
                      {[0, 1, 2].map((k) => <span key={k} className="h-full w-[3px] origin-bottom animate-eq rounded-full bg-brand-light" style={{ animationDelay: `${k * 0.15}s` }} />)}
                    </span>
                  ) : (
                    <PlayIcon c="h-4 w-4 text-white/40" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* mini player fixo enquanto a música toca e a seção está fora da tela */}
      <div className={`fixed bottom-5 left-4 z-50 flex w-[calc(100%-7.5rem)] max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-abyss/85 p-2 pr-3 shadow-2xl backdrop-blur-xl transition duration-300 ${playing && !inView && !dismissed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"}`}>
        <a href="#ouvir" className="h-11 w-11 shrink-0"><Cover i={cur} spinning={playing} size="h-11 w-11" /></a>
        <a href="#ouvir" className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold">{t.title}</span>
          <span className="block truncate text-xs text-white/50">{t.artist}</span>
          <span className="mt-1.5 block h-0.5 rounded-full bg-white/10"><span className="block h-full rounded-full bg-brand-light" style={{ width: `${pct}%` }} /></span>
        </a>
        <button onClick={toggle} aria-label={playing ? "Pausar" : "Tocar"} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-abyss">
          {playing ? <PauseIcon c="h-5 w-5" /> : <PlayIcon c="ml-0.5 h-5 w-5" />}
        </button>
        <button onClick={next} aria-label="Próxima faixa" className="hidden text-white/70 hover:text-white sm:block"><SkipIcon /></button>
      </div>
    </section>
  );
}
