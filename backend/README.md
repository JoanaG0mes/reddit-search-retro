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
Popula o SQLite (`data/retrova.db`) com dados artificiais de demonstracao e reconstroi o indice invertido. Esse comando nao comprova coleta real do Reddit.

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

O backend usa OAuth via `client_credentials` quando ha credenciais; sem elas, tenta RSS. O acesso e os limites dependem das permissoes concedidas pelo Reddit. Referencia: https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki

## Checkpoint 1: verificar coleta real

Execute dentro de `backend`:

```bash
npm run check:reddit -- learnpython
```

O teste coleta ate tres posts reais e mostra seus IDs, titulos e links, sem alterar o banco e sem mostrar credenciais. Sem credenciais OAuth, tenta RSS; se a fonte bloquear o acesso ou nao retornar posts, termina com falha. Nunca substitui a coleta por dados do seed.

Depois de validar o acesso, `npm run ingest` coleta os subreddits configurados, salva no SQLite e reconstroi o indice. A autenticacao do projeto Devvit `rec-inf` e separada das credenciais OAuth deste backend.

RSS fornece o conteudo disponivel no feed e pode retornar menos documentos que o limite solicitado. Score e numero de comentarios nao sao fornecidos pelo feed; os valores nesses campos sao marcadores, nao metricas extraidas.
