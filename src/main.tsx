import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GOOGLE_ADS_SEND_TO } from "./config";

/* Meta Pixel: todo clique no WhatsApp vira "Contact"; botões de plano também mandam "InitiateCheckout" com o valor */
declare global { interface Window { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void } }
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
  if (!a) return;
  const plan = a.dataset.plan;
  const value = Number(a.dataset.value);
  if (window.fbq) {
    window.fbq("track", "Contact", plan ? { content_name: plan } : {});
    if (plan && value) window.fbq("track", "InitiateCheckout", { content_name: plan, value, currency: "BRL" });
  }
  /* Google Ads: conversão "Clique WhatsApp" */
  if (window.gtag && GOOGLE_ADS_SEND_TO) window.gtag("event", "conversion", { send_to: GOOGLE_ADS_SEND_TO, value: 1.0, currency: "BRL" });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
