// ⚙️ CONFIGURAÇÃO RÁPIDA — edite aqui e o site inteiro atualiza
export const WHATSAPP_NUMBER = "5500000000000"; // DDI + DDD + número, só dígitos. Ex: 5511999998888
export const PRICE_FROM = "15"; // "a partir de R$ X/mês"
export const INSTAGRAM_URL = ""; // opcional: https://instagram.com/seuperfil

export function waLink(msg = "Oi! Vim pelo site e quero conhecer o PexeMusic 🎵") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;
