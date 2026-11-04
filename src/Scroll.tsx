import { useEffect, useRef, type ReactNode } from "react";

/* Um único loop de scroll (requestAnimationFrame) que atualiza todos os elementos registrados.
   Escreve o progresso numa variável CSS (--p, de 0 a 1) — sem re-render do React. */
type Sub = (vh: number) => void;
const subs = new Set<Sub>();
let ticking = false;
function run() {
  ticking = false;
  const vh = window.innerHeight;
  subs.forEach((s) => s(vh));
}
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(run);
    setTimeout(() => ticking && run(), 120); // fallback se o rAF estiver pausado
  }
}
function subscribe(s: Sub) {
  if (!subs.size) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
  subs.add(s);
  s(window.innerHeight);
  return () => {
    subs.delete(s);
    if (!subs.size) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };
}

/** progresso de 0→1 enquanto o elemento atravessa a tela (mode "through")
 *  ou enquanto uma seção alta é rolada com o conteúdo fixo (mode "pin"). */
export function useScrollVar<T extends HTMLElement>(mode: "through" | "pin" | "page" | "exit" = "through") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // efeitos ligados à rolagem seguem o dedo do usuário, então ficam ativos mesmo com "reduzir movimento"
    return subscribe((vh) => {
      let p: number;
      if (mode === "page") {
        const max = document.documentElement.scrollHeight - vh;
        p = max > 0 ? window.scrollY / max : 0;
      } else {
        const r = el.getBoundingClientRect();
        p =
          mode === "pin" ? -r.top / Math.max(1, r.height - vh)
          : mode === "exit" ? -r.top / Math.max(1, r.height)
          : (vh - r.top) / (vh + r.height);
      }
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    });
  }, [mode]);
  return ref;
}

/* barra de progresso de leitura no topo */
export function ScrollProgress() {
  const ref = useScrollVar<HTMLDivElement>("page");
  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden>
      <div data-progress className="h-full origin-left bg-gradient-to-r from-brand via-brand-light to-zap" style={{ transform: "scaleX(var(--p,0))" }} />
    </div>
  );
}

/* frase gigante que vai "acendendo" palavra por palavra conforme rola */
export function WordReveal({ text, accent = [] }: { text: string; accent?: string[] }) {
  const ref = useScrollVar<HTMLElement>("pin");
  const words = text.split(" ");
  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(30,123,255,.18),transparent_70%)]" style={{ opacity: "calc(var(--p,0) * 1.4)" }} aria-hidden />
        <p className="container-x relative font-display text-[2.1rem] font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
          {words.map((w, i) => {
            const start = (i / words.length) * 0.8;
            const isAccent = accent.includes(w.replace(/[.,!?]/g, ""));
            return (
              <span
                key={i}
                className={`inline-block pr-[0.28em] ${isAccent ? "text-brand-light" : "text-white"}`}
                style={{
                  opacity: `clamp(0.12, calc((var(--p,0) - ${start.toFixed(3)}) * 14 + 0.12), 1)`,
                  filter: `blur(clamp(0px, calc((${start.toFixed(3)} + 0.06 - var(--p,0)) * 60px), 6px))`,
                }}
              >
                {w}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

/* faixa horizontal: rola na vertical, os cards andam pro lado */
export function HorizontalScroll({ header, children, count }: { header: ReactNode; children: ReactNode; count: number }) {
  const ref = useScrollVar<HTMLElement>("pin");
  return (
    <section ref={ref} className="relative" style={{ height: `${100 + count * 22}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="container-x">{header}</div>
        <div
          className="mt-10 flex w-max gap-5 pl-4 sm:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
          style={{ transform: "translateX(calc(var(--p,0) * (-100% + 100vw - 2rem)))" }}
        >
          {children}
        </div>
        <div className="container-x mt-8">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full origin-left rounded-full bg-brand-light" style={{ transform: "scaleX(var(--p,0))" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* parallax simples: desloca o filho em Y conforme passa pela tela */
export function Parallax({ children, amount = 80, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useScrollVar<HTMLDivElement>("through");
  return (
    <div ref={ref} className={className} style={{ transform: `translateY(calc((0.5 - var(--p,0.5)) * ${amount}px))`, willChange: "transform" }}>
      {children}
    </div>
  );
}
