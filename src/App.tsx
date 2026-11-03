import { useEffect, useRef, useState, type ReactNode } from "react";
import { PRICE_FROM, media, waLink } from "./config";

/* ---------- ícones (SVG inline, sem dependência) ---------- */
const I = {
  zap: (c = "h-6 w-6") => (
    <svg viewBox="0 0 32 32" className={c} fill="currentColor" aria-hidden>
      <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.3c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.6-5.6c0-5.8 4.8-10.5 10.8-10.5s10.8 4.7 10.8 10.5S22 26.3 16 26.3Zm5.9-7.8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  ),
  note: <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
  cloud: <path d="M12 13v8m0 0-3-3m3 3 3-3M20 16.6A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15.3" />,
  devices: <path d="M3 5h13v9H3zM7 18h5M9.5 14v4M17 9h4v11h-4z" />,
  heart: <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />,
  noads: <path d="M4 4l16 16M9 5h10a1 1 0 0 1 1 1v10M15 19H5a1 1 0 0 1-1-1V8" />,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.2L3 21l1.8-6.4A8 8 0 1 1 21 12Z" />,
  check: <path d="m5 12 5 5L20 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  phone: <path d="M7 2h10v20H7zM11 18h2" />,
  pc: <path d="M3 4h18v12H3zM8 20h8M12 16v4" />,
  tablet: <path d="M5 2h14v20H5zM11 18h2" />,
  tv: <path d="M3 6h18v12H3zM8 21h8M10 10l4 2-4 2z" />,
  play: <path d="M7 4v16l13-8z" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
};
const Ico = ({ d, c = "h-6 w-6" }: { d: ReactNode; c?: string }) => (
  <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);

/* ---------- utilidades ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const Eq = ({ bars = 5, c = "bg-brand-light" }: { bars?: number; c?: string }) => (
  <span className="inline-flex h-4 items-end gap-[3px]" aria-hidden>
    {Array.from({ length: bars }).map((_, i) => (
      <span key={i} className={`w-[3px] origin-bottom rounded-full ${c} animate-eq`} style={{ height: "100%", animationDelay: `${i * 0.13}s`, animationDuration: `${0.8 + (i % 3) * 0.25}s` }} />
    ))}
  </span>
);

const ZapButton = ({ children, msg, className = "" }: { children: ReactNode; msg?: string; className?: string }) => (
  <a href={waLink(msg)} target="_blank" rel="noopener" className={`btn-zap ${className}`}>
    {I.zap("h-6 w-6")}
    {children}
  </a>
);

const Bubbles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {Array.from({ length: 14 }).map((_, i) => (
      <span
        key={i}
        className="absolute bottom-[-20px] rounded-full border border-brand-light/40 bg-brand-light/10 animate-bubble"
        style={{ left: `${(i * 71) % 100}%`, width: 6 + (i % 4) * 5, height: 6 + (i % 4) * 5, animationDuration: `${12 + (i % 5) * 4}s`, animationDelay: `${i * 1.3}s` }}
      />
    ))}
  </div>
);

/* ---------- seções ---------- */
function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? "border-b border-white/10 bg-abyss/80 backdrop-blur-xl" : ""}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#topo" className="flex items-center gap-2.5">
          <img src={media("logo.webp")} alt="" className="h-9 w-9 rounded-xl" />
          <span className="font-display text-lg font-extrabold tracking-tight">
            Pexe<span className="text-brand-light">Music</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#recursos" className="hover:text-white">Recursos</a>
          <a href="#como" className="hover:text-white">Como funciona</a>
          <a href="#planos" className="hover:text-white">Planos</a>
          <a href="#faq" className="hover:text-white">Dúvidas</a>
        </nav>
        <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-zap px-4 py-2 text-sm font-bold text-abyss transition hover:bg-[#2ee672]">
          {I.zap("h-4 w-4")} <span className="hidden sm:inline">Assinar</span><span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="topo" className="grain relative overflow-hidden bg-ocean-glow pb-20 pt-28 sm:pt-36">
      <Bubbles />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
        <div className="reveal">
          <span className="eyebrow"><Eq bars={4} /> Seu app de música em um só lugar</span>
          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Toda música.<br />
            <span className="text-grad">Zero anúncio.</span><br />
            Até sem internet.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Milhões de músicas no celular, computador, tablet e na sua TV. Baixe suas playlists e ouça offline — no ônibus, no treino, na viagem.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ZapButton msg="Oi! Quero assinar o PexeMusic 🎵 Quais são os planos?">
              Quero o PexeMusic
              <span className="absolute inset-0 -z-10 rounded-full bg-zap animate-pulseRing" aria-hidden />
            </ZapButton>
            <a href="#planos" className="btn-ghost">Ver planos <Ico d={I.arrow} c="h-5 w-5" /></a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
            <span className="flex items-baseline gap-1.5">
              a partir de <b className="font-display text-2xl text-white">R${PRICE_FROM}</b>/mês
            </span>
            <span className="h-5 w-px bg-white/15" />
            {[[I.phone, "Celular"], [I.pc, "PC"], [I.tablet, "Tablet"], [I.tv, "TV"]].map(([d, l]) => (
              <span key={l as string} className="flex items-center gap-1.5"><Ico d={d} c="h-4 w-4 text-brand-light" />{l as string}</span>
            ))}
          </div>
        </div>

        <div className="reveal relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-10 rounded-full bg-brand/30 blur-3xl" aria-hidden />
          <img src={media("app.webp")} alt="App PexeMusic aberto no celular e na TV" className="relative w-full rounded-[2rem] shadow-2xl shadow-brand/30 ring-1 ring-white/10 animate-float" />
          {/* card flutuante "tocando agora" */}
          <div className="card absolute -bottom-6 -left-2 flex items-center gap-3 bg-abyss/80 p-3 pr-5 shadow-xl sm:-left-10">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-light"><Ico d={I.play} c="h-5 w-5 fill-white text-white" /></span>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-glow">Tocando agora · offline</p>
              <p className="text-sm font-semibold">Sua playlist favorita</p>
            </div>
            <Eq />
          </div>
          <div className="card absolute -right-2 top-6 bg-abyss/80 px-4 py-3 text-center shadow-xl sm:-right-6">
            <p className="font-display text-2xl font-extrabold text-zap">0</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">anúncios</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Sem anúncios", "Ouça offline", "Milhões de músicas", "Celular · PC · Tablet · TV", "Playlists personalizadas", `A partir de R$${PRICE_FROM}/mês`, "Atendimento no WhatsApp"];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-brand py-4">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.2em] text-abyss sm:text-base">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">{t}<span className="text-white">✦</span></span>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  const rows: [string, boolean, boolean][] = [
    ["Música sem anúncio no meio", false, true],
    ["Toca mesmo sem internet", false, true],
    ["Não gasta seu pacote de dados", false, true],
    ["Celular, PC, tablet e TV", false, true],
    ["Atendimento humano no WhatsApp", false, true],
    [`A partir de R$${PRICE_FROM}/mês`, false, true],
  ];
  return (
    <section className="relative py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="reveal">
          <span className="eyebrow">Chega disso</span>
          <h2 className="h2 mt-5">Ainda pagando caro pra ouvir música <span className="text-grad">cortada por anúncio?</span></h2>
          <p className="mt-5 max-w-lg text-lg text-white/65">
            A música boa começa, o refrão chega… e entra propaganda. A internet cai e vem o silêncio. O PexeMusic foi feito pra acabar com isso — por um preço que cabe no bolso.
          </p>
          <ZapButton className="mt-8" msg="Oi! Cansei de anúncio na música 😅 Quero conhecer o PexeMusic.">Quero ouvir sem interrupção</ZapButton>
        </div>
        <div className="reveal card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white/50 sm:px-7">
            <span />
            <span className="w-16 text-center sm:w-24">Apps comuns</span>
            <span className="w-16 text-center text-brand-glow sm:w-24">PexeMusic</span>
          </div>
          {rows.map(([label, other, pexe]) => (
            <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-white/5 px-5 py-4 last:border-0 sm:px-7">
              <span className="text-sm text-white/85 sm:text-base">{label}</span>
              <span className="flex w-16 justify-center sm:w-24">
                <span className={`grid h-7 w-7 place-items-center rounded-full ${other ? "bg-zap/15 text-zap" : "bg-rose-500/15 text-rose-400"}`}>
                  <Ico d={other ? I.check : I.x} c="h-4 w-4" />
                </span>
              </span>
              <span className="flex w-16 justify-center sm:w-24">
                <span className={`grid h-7 w-7 place-items-center rounded-full ${pexe ? "bg-zap/15 text-zap" : "bg-rose-500/15 text-rose-400"}`}>
                  <Ico d={pexe ? I.check : I.x} c="h-4 w-4" />
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const f = [
    [I.note, "Milhões de músicas", "Lançamentos, sertanejo, funk, pop, rock, gospel, internacionais — seus artistas favoritos num lugar só."],
    [I.cloud, "Ouça offline", "Baixe as playlists e ouça sem internet. No metrô, no avião, no sítio. Sem gastar seu pacote de dados."],
    [I.devices, "Em todos os dispositivos", "Celular, computador, tablet e Smart TV. Comece no fone e continue na sala."],
    [I.heart, "Playlists personalizadas", "Foco, treino, relax, viagem. Monte as suas ou descubra mixes feitos pro seu gosto."],
    [I.noads, "Zero anúncios", "Nada de propaganda cortando o refrão. É play e pronto, do começo ao fim."],
    [I.chat, "Suporte no WhatsApp", "Dúvida? Fala com gente de verdade, direto no WhatsApp. Resposta rápida e sem robô chato."],
  ] as const;
  return (
    <section id="recursos" className="relative overflow-hidden bg-deep py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-light/50 to-transparent" />
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Recursos</span>
          <h2 className="h2 mt-5">Tudo que você quer num app de música. <span className="text-grad">Nada do que irrita.</span></h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.map(([d, t, p], i) => (
            <div key={t} className="reveal card group p-7 transition hover:-translate-y-1 hover:border-brand-light/40" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-brand-light/30 bg-brand-light/10 text-brand-light shadow-[0_0_30px_-6px_rgba(63,208,255,.6)] transition group-hover:scale-110">
                <Ico d={d} c="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-white/60">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      v.currentTime = 0;
      userPaused.current = false;
      v.play().catch(() => {});
    }
    setMuted(next);
  };
  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? !userPaused.current && v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <section className="grain relative overflow-hidden bg-ocean-glow py-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div className="reveal order-2 mx-auto lg:order-1">
          <div className="relative w-[260px] rounded-[2.6rem] border-[10px] border-[#0d1426] bg-black shadow-2xl shadow-brand/40 ring-1 ring-white/15 sm:w-[300px]">
            <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0d1426]" />
            <video ref={ref} src={media("promo.mp4")} poster={media("promo.webp")} muted loop playsInline preload="metadata" onClick={togglePlay} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className="aspect-[9/16] w-full cursor-pointer rounded-[2rem] object-cover" />
            {!playing && (
              <button onClick={togglePlay} aria-label="Reproduzir vídeo" className="absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-abyss shadow-2xl transition hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9" fill="currentColor" aria-hidden><path d="M7 4v16l13-8z" /></svg>
              </button>
            )}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-abyss/70 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-abyss/90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4v16l13-8z" />}
              </svg>
            </button>
            <button
              onClick={toggleSound}
              aria-label={muted ? "Ativar som" : "Desativar som"}
              className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold shadow-lg backdrop-blur transition ${muted ? "bg-white text-abyss hover:scale-105" : "bg-abyss/70 text-white/90 ring-1 ring-white/20"}`}
            >
              {muted && <span className="absolute inset-0 -z-10 rounded-full bg-white animate-pulseRing" aria-hidden />}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" />
                {muted ? <path d="m22 9-6 6m0-6 6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
              </svg>
              {muted ? "Toque para ouvir" : "Som ligado"}
            </button>
            </div>
          </div>
        </div>
        <div className="reveal order-1 lg:order-2">
          <span className="eyebrow"><Eq bars={3} /> Veja em 18 segundos</span>
          <h2 className="h2 mt-5">No celular, no PC, na TV. <span className="text-grad">Sempre tocando.</span></h2>
          <p className="mt-5 max-w-lg text-lg text-white/65">
            Sem internet? Sem problema. Suas músicas ficam salvas no aparelho e tocam onde você estiver. É só abrir e dar play.
          </p>
          <ul className="mt-8 space-y-4">
            {["Baixe playlists inteiras com um toque", "Continue de onde parou em outro aparelho", "Qualidade de som alta, sem cortes"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/85">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-light/15 text-brand-light"><Ico d={I.check} c="h-4 w-4" /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Moments() {
  const m = [["Foco", "🎧"], ["Treino", "🔥"], ["Relax", "🌊"], ["Viagem", "🚗"]];
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="reveal relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand/40 to-transparent blur-2xl" aria-hidden />
          <img src={media("relax.webp")} alt="Mulher relaxando no sofá ouvindo música com fones" loading="lazy" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover ring-1 ring-white/10" />
          <div className="card absolute bottom-5 left-5 right-5 flex items-center justify-between bg-abyss/70 p-4 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-glow">Playlist · Relax</p>
              <p className="font-display font-bold">Aperte o play. Respire.</p>
            </div>
            <Eq bars={6} />
          </div>
        </div>
        <div className="reveal">
          <span className="eyebrow">Pra cada momento</span>
          <h2 className="h2 mt-5">Um momento só seu, <span className="text-grad">no ritmo da música.</span></h2>
          <p className="mt-5 max-w-lg text-lg text-white/65">
            Acordou, foi pro trabalho, treinou, deitou no sofá. O PexeMusic tem a trilha certa pra cada parte do seu dia.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {m.map(([t, e]) => (
              <div key={t} className="card flex flex-col items-center gap-2 py-5 transition hover:border-brand-light/40">
                <span className="text-2xl">{e}</span>
                <span className="font-display text-sm font-semibold">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const s = [
    ["Chama no WhatsApp", "Clica no botão verde e manda um oi. A gente responde rapidinho."],
    ["Escolhe seu plano", `Planos a partir de R$${PRICE_FROM}/mês. A gente te ajuda a escolher o melhor pra você.`],
    ["Recebe o acesso e dá play", "Instala, entra e pronto: milhões de músicas liberadas em todos os seus aparelhos."],
  ];
  return (
    <section id="como" className="relative bg-deep py-24">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Como funciona</span>
          <h2 className="h2 mt-5">Do oi ao play em <span className="text-grad">3 passos.</span></h2>
        </div>
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-brand-light/0 via-brand-light/50 to-brand-light/0 md:block" aria-hidden />
          {s.map(([t, p], i) => (
            <div key={t} className="reveal card relative p-7 text-center" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-light font-display text-xl font-extrabold shadow-[0_0_40px_-6px_rgba(63,208,255,.8)]">{i + 1}</span>
              <h3 className="mt-5 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-white/60">{p}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-12 text-center">
          <ZapButton msg="Oi! Quero assinar o PexeMusic. Como faço?">Começar agora pelo WhatsApp</ZapButton>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const perks = ["Milhões de músicas liberadas", "Sem nenhum anúncio", "Download para ouvir offline", "Celular, computador, tablet e TV", "Playlists personalizadas", "Suporte direto no WhatsApp"];
  return (
    <section id="planos" className="grain relative overflow-hidden bg-ocean-glow py-24">
      <Bubbles />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="reveal">
          <span className="eyebrow">Planos</span>
          <h2 className="h2 mt-5">Menos que um lanche. <span className="text-grad">Música o mês inteiro.</span></h2>
          <p className="mt-5 max-w-lg text-lg text-white/65">
            Por menos de R$0,50 por dia você ouve o que quiser, quando quiser, sem propaganda. E tem plano com desconto pra quem fecha por mais tempo.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-zap/15 text-zap">{I.zap("h-6 w-6")}</span>
            <p>Fale com a gente e descubra os planos <b className="text-white">trimestral, semestral e anual</b> com preço ainda menor.</p>
          </div>
        </div>

        <div className="reveal relative">
          <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-br from-brand-light via-brand to-zap opacity-70 blur-lg" aria-hidden />
          <div className="relative rounded-[2rem] border border-white/15 bg-abyss/90 p-8 backdrop-blur-xl sm:p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={media("logo.webp")} alt="" className="h-12 w-12 rounded-2xl" />
                <div>
                  <p className="font-display text-lg font-extrabold">PexeMusic Premium</p>
                  <p className="text-sm text-white/50">Acesso completo</p>
                </div>
              </div>
              <span className="rounded-full bg-zap/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zap">Mais vendido</span>
            </div>
            <div className="mt-8">
              <span className="rounded-md bg-brand-light px-2.5 py-1 text-xs font-extrabold uppercase tracking-widest text-abyss">Planos a partir de</span>
              <div className="mt-3 flex items-end gap-1 font-display">
                <span className="mb-3 text-3xl font-extrabold">R$</span>
                <span className="text-8xl font-extrabold leading-none tracking-tighter">{PRICE_FROM}</span>
                <span className="mb-3 flex flex-col leading-none">
                  <span className="text-3xl font-extrabold">,00</span>
                  <span className="mt-1 text-sm font-semibold text-brand-light">por mês</span>
                </span>
              </div>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Ico d={I.check} c="mt-0.5 h-4 w-4 shrink-0 text-zap" />{p}
                </li>
              ))}
            </ul>
            <ZapButton className="mt-9 w-full" msg={`Oi! Quero assinar o PexeMusic a partir de R$${PRICE_FROM}/mês 🎵`}>Assinar pelo WhatsApp</ZapButton>
            <p className="mt-4 text-center text-xs text-white/40">Atendimento humano · Ativação rápida · Sem complicação</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const q = [
    ["Como eu assino o PexeMusic?", "É só clicar em qualquer botão verde da página. Você cai direto no nosso WhatsApp, escolhe o plano e recebe o acesso rapidinho."],
    ["Quanto custa?", `Os planos começam em R$${PRICE_FROM} por mês. Também temos opções de período maior com desconto — pergunte no WhatsApp.`],
    ["Funciona sem internet?", "Sim! Você baixa suas músicas e playlists no aparelho e ouve offline, sem gastar dados."],
    ["Em quais aparelhos funciona?", "Celular, computador, tablet e Smart TV. Você usa sua conta nos seus dispositivos."],
    ["Tem anúncio?", "Não. Nenhum. Nem no meio da música, nem entre uma faixa e outra."],
    ["E se eu tiver alguma dúvida depois de assinar?", "Nosso suporte é pelo WhatsApp, com gente de verdade. Chamou, a gente responde."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24">
      <div className="container-x max-w-3xl">
        <div className="reveal text-center">
          <span className="eyebrow">Dúvidas</span>
          <h2 className="h2 mt-5">Perguntas frequentes</h2>
        </div>
        <div className="mt-12 space-y-3">
          {q.map(([t, a], i) => (
            <div key={t} className={`reveal card overflow-hidden transition ${open === i ? "border-brand-light/40" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display font-semibold" aria-expanded={open === i}>
                {t}
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 text-brand-light transition ${open === i ? "rotate-45" : ""}`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden px-6 text-white/65"><span className="block pb-5">{a}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="grain relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(30,123,255,.45),transparent_70%)]" aria-hidden />
      <Bubbles />
      <div className="container-x relative text-center">
        <img src={media("logo.webp")} alt="PexeMusic" className="reveal mx-auto h-28 w-28 rounded-[1.75rem] shadow-2xl shadow-brand/50 animate-float sm:h-36 sm:w-36" />
        <h2 className="reveal h2 mx-auto mt-10 max-w-3xl">Mergulhe no som. <span className="text-grad">Seu próximo play começa agora.</span></h2>
        <p className="reveal mx-auto mt-5 max-w-xl text-lg text-white/65">Milhões de músicas, sem anúncio, até offline. A partir de R${PRICE_FROM}/mês.</p>
        <div className="reveal mt-9">
          <ZapButton msg="Oi! Quero assinar o PexeMusic agora 🎵">Conheça o PexeMusic</ZapButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 pb-28 sm:pb-10">
      <div className="container-x flex flex-col items-center justify-between gap-4 text-sm text-white/45 sm:flex-row">
        <div className="flex items-center gap-2">
          <img src={media("logo.webp")} alt="" className="h-7 w-7 rounded-lg" />
          <span>© {new Date().getFullYear()} PexeMusic. Todos os direitos reservados.</span>
        </div>
        <a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-zap">{I.zap("h-4 w-4")} Fale com a gente</a>
      </div>
    </footer>
  );
}

/* botão flutuante de WhatsApp (aparece depois do hero) */
function FloatingZap() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
      className={`fixed bottom-5 right-5 z-50 grid h-16 w-16 place-items-center rounded-full bg-zap text-white shadow-[0_10px_40px_-6px_rgba(37,211,102,.8)] transition duration-300 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <span className="absolute inset-0 rounded-full bg-zap animate-pulseRing" aria-hidden />
      {I.zap("relative h-8 w-8")}
    </a>
  );
}

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Features />
        <VideoShowcase />
        <Moments />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingZap />
    </>
  );
}
