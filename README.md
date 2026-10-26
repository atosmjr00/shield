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


## Meta Ads OAuth (fase inicial)

A conexão Meta Ads usa Supabase Edge Functions. O token é armazenado em `meta_connections`, tabela protegida por RLS sem políticas para clientes de navegador. Não coloque o App Secret da Meta em variáveis `VITE_*`.

1. Execute no Supabase SQL Editor a migração `supabase/migrations/20261025001000_meta_oauth.sql`.
2. Configure os secrets das Edge Functions no projeto Supabase:
   - `META_APP_ID`: App ID do aplicativo Meta.
   - `META_APP_SECRET`: App Secret (somente servidor).
   - `META_REDIRECT_URI`: URL exata da função callback, no formato `https://SEU_PROJETO.supabase.co/functions/v1/meta-oauth-callback`.
   - `META_GRAPH_API_VERSION`: versão da Graph API habilitada para o aplicativo (ex.: `vXX.0`, substitua pela versão atualmente suportada no Meta for Developers).
   - `SHIELD_APP_URL`: URL de retorno do app, por exemplo `http://localhost:8080` durante desenvolvimento.
3. No painel Meta for Developers, adicione o valor de `META_REDIRECT_URI` em **Valid OAuth Redirect URIs** do produto Login e habilite as permissões necessárias para Marketing API (`ads_read`, `read_insights`) conforme a análise de acesso do aplicativo.
4. Implante as funções `meta-oauth-start` e `meta-oauth-callback`. A função de callback precisa aceitar chamadas sem JWT, pois a Meta redireciona o navegador; o `supabase/config.toml` configura isso.
5. Teste em `http://localhost:8080`. Se estiver usando `127.0.0.1`, configure essa origem separadamente e ajuste `SHIELD_APP_URL` para a origem usada.

Esta etapa implementa o início do OAuth, validação de state de uso único, troca do código no servidor e armazenamento protegido do token. **Ainda não importa contas de anúncios, campanhas ou métricas**; isso é a próxima etapa, após confirmar a autorização e os requisitos de acesso da Meta.
