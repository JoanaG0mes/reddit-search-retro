# RETRØVA — Backend

Node + Express + TypeScript. Implementa o pipeline real de Recuperação da
Informação sobre um corpus coletado do Reddit.

## Setup

```bash
cp .env.example .env
```

Preencha `REDDIT_CLIENT_ID` e `REDDIT_CLIENT_SECRET` com as credenciais de
um app criado em https://www.reddit.com/prefs/apps (tipo **script**, uso
pessoal/não comercial). Ajuste `REDDIT_USER_AGENT` trocando `SEU_USUARIO_AQUI`
pelo seu usuário do Reddit — o Reddit throttla/bloqueia clientes com
User-Agent genérico ou ausente.

```bash
npm install
```

## Popular o corpus

```bash
npm run seed
```
Popula o SQLite (`data/retrova.db`) com documentos reais dos subreddits e reconstrói o índice invertido (não depende de credenciais do Reddit).

Para coletar dados novos diretamente via API do Reddit:
```bash
npm run ingest
```

Isso coleta os subreddits listados em `src/scripts/ingest.ts` (edite a
lista `SUBREDDITS` para trocar os alvos ou os limites — comece com
100 a 500 documentos no total, como pede o enunciado), persiste no SQLite
(`data/retrova.db`) e reconstrói o índice invertido do zero.

Você também pode disparar uma ingestão pontual via API, com o servidor
já rodando:

```bash
curl -X POST http://localhost:3001/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"subreddit": "learnpython", "limit": 100}'
```

## Rodar o servidor

```bash
npm run dev
```

## Endpoints

- `GET /api/search?q=python AND programming NOT java` — busca booleana real sobre o índice invertido
- `GET /api/stats` — corpus size, tamanho do vocabulário, termos mais frequentes (painel acadêmico)
- `GET /api/document/:id` — documento completo do corpus (para a tela Document View)
- `POST /api/ingest` — coleta um subreddit e reconstrói o índice

## Limites da API do Reddit

OAuth via `client_credentials`, 60 requisições/minuto por app registrado
(janela deslizante de 10 min). Suficiente para coletar algumas centenas de
posts sem problema; não paralelize ingestões de muitos subreddits ao mesmo
tempo.
