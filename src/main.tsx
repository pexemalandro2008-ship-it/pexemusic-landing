import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/* Meta Pixel: todo clique no WhatsApp vira "Contact"; botões de plano também mandam "InitiateCheckout" com o valor */
declare global { interface Window { fbq?: (...a: unknown[]) => void } }
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
  if (!a || !window.fbq) return;
  const plan = a.dataset.plan;
  const value = Number(a.dataset.value);
  window.fbq("track", "Contact", plan ? { content_name: plan } : {});
  if (plan && value) window.fbq("track", "InitiateCheckout", { content_name: plan, value, currency: "BRL" });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
