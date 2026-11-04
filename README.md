# PexeMusic — Landing Page

Landing page de vendas do PexeMusic (Vite + React + TypeScript + Tailwind — mesma stack do Lovable).

## Editar rápido
Tudo que muda com frequência está em **`src/config.ts`**:
- `WHATSAPP_NUMBER` — número do WhatsApp (só dígitos, com 55 + DDD)
- `PRICE_FROM` — preço "a partir de"

Textos e seções ficam em `src/App.tsx`. Imagens e vídeo em `public/media/`.

## Rodar local
```bash
npm install
npm run dev
```

## Deploy
Publicado no Cloudflare Pages (projeto `pexemusic`, https://pexemusic.pages.dev): cada push na `main` gera um deploy automático (build `npm run build`, saída `dist`).
