# SHIELD — Operational Intelligence

Centro de comando para organizar sinais operacionais, integrações e incidentes dos ativos digitais.

## Rodar localmente

Requisitos: Node.js compatível com Vite 8 e npm.

```sh
git clone https://github.com/atosmjr00/screenshot-precision.git
cd screenshot-precision
npm install
cp .env.example .env
npm run dev
```

## Configurar autenticação

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No painel do Supabase, copie a Project URL e a publishable key (ou anon key legada).
3. Preencha `.env`:

   ```env
   VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
   ```

4. Em **Authentication → URL Configuration**, adicione a URL local de desenvolvimento (por exemplo, `http://localhost:3000`) e a URL pública de produção à lista de URLs permitidas.
5. Reinicie o servidor depois de alterar o `.env`.

Com Supabase configurado, cadastro e login usam autenticação real por e-mail/senha, e as rotas do workspace redirecionam visitantes sem sessão para `/login`. Sem as variáveis, o painel fica em modo de demonstração para desenvolvimento; não use esse modo como autenticação de produção.

## Rotas

- `/` — landing page pública.
- `/login` — login.
- `/cadastro` — criação de conta.
- `/painel` — centro de comando SHIELD.
- `/contas` — interface de contas de anúncios atualmente demonstrativa.

## Estado das integrações

A autenticação do SHIELD pode ser ativada com as credenciais do Supabase. As integrações de plataformas (Meta Ads, Google Ads, TikTok Ads) ainda precisam de configuração OAuth, credenciais de desenvolvedor, endpoints seguros para callback/troca e armazenamento protegido dos tokens. A interface não deve ser tratada como conexão real até que cada fluxo seja implementado e validado com uma conta autorizada.

## Stack

- TanStack Start / TanStack Router
- React + TypeScript
- Tailwind CSS
- Supabase Auth (configuração necessária)
