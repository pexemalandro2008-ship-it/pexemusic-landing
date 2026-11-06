// ⚙️ CONFIGURAÇÃO RÁPIDA — edite aqui e o site inteiro atualiza
export const WHATSAPP_NUMBER = "5518991703108"; // DDI + DDD + número, só dígitos
export const PRICE_FROM = "15"; // "a partir de R$ X/mês"
export const INSTAGRAM_URL = ""; // opcional: https://instagram.com/seuperfil
// Confiança (aparecem no rodapé só se preenchidos — use apenas dados reais)
export const COMPANY_NAME = ""; // razão social, ex.: "PexeMusic Serviços Digitais LTDA"
export const COMPANY_CNPJ = ""; // ex.: "00.000.000/0001-00"
export const APP_STORE_URL = ""; // link do app na Play Store, se existir

export function waLink(msg = "Oi! Vi o anúncio e quero saber mais sobre o PexeMusic 🎵") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;

/** Google Ads: conversão "Clique WhatsApp" (AW-ID/rótulo). Vazio = não envia. */
export const GOOGLE_ADS_SEND_TO = "AW-18548610322/IGntCKrJgLMdEJKq1YxF";
