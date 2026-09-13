# RETRØVA

**Reddit Information Retrieval System** — projeto acadêmico da disciplina de
Recuperação da Informação.

Identidade visual Pixel Art / Retro Gaming; núcleo acadêmico real de
Recuperação da Informação (corpus → pré-processamento → índice invertido →
busca booleana).

> ⚠️ O Reddit **não** é o motor de busca. O Reddit é só a fonte dos
> documentos. Quem responde às consultas é o índice invertido e o
> executor de busca booleana implementados no backend — nunca uma
> chamada direta ao Reddit em tempo de busca.

## Arquitetura

```
frontend (React + TS + Tailwind)
        │  fetch /api/search, /api/stats, /api/document/:id
        ▼
backend (Node + Express + TS)
        │
        ├── reddit/redditClient.ts   → OAuth2 + coleta (só na ingestão)
        ├── corpus/corpusManager.ts  → persistência do corpus (SQLite)
        ├── processing/              → normalizer → tokenizer → stopwords → stemmer
        ├── index/invertedIndex.ts   → vocabulário + índice invertido (termo → docs)
        └── search/                  → queryParser (AND/OR/NOT) + booleanRetrieval
```

As credenciais do Reddit ficam **somente** no backend (`backend/.env`),
nunca no frontend.

## Como rodar

### 1. Backend

```bash
cd backend
cp .env.example .env
# edite .env com as credenciais do seu app Reddit (reddit.com/prefs/apps, tipo "script")
npm install
npm run seed     # popula o corpus localmente (offline, sem depender da API do Reddit)
# ou npm run ingest (se tiver credenciais do Reddit configuradas no .env)
npm run dev      # sobe a API em http://localhost:3001
```

### 2. Frontend

```bash
cp .env.example .env   # aponta VITE_API_URL para o backend
npm install
npm run dev             # http://localhost:5173
```

Se o backend não estiver rodando, o frontend cai automaticamente em
**modo demonstração** (dados mockados), para nunca travar uma
apresentação por falta de rede/API do Reddit.

## Onde está cada conceito da disciplina

| Conceito                  | Onde                                              |
|---------------------------|----------------------------------------------------|
| Corpus                    | `backend/src/corpus/corpusManager.ts` + tabela `documents` |
| Tokenização                | `backend/src/processing/tokenizer.ts`             |
| Normalização                | `backend/src/processing/normalizer.ts`            |
| Stop words                 | `backend/src/processing/stopwords.ts` (EN + PT)   |
| Stemming                   | `backend/src/processing/stemmer.ts` (Porter EN/PT via `natural`) |
| Vocabulário                | tabela `terms` + `backend/src/index/invertedIndex.ts` |
| Índice invertido            | tabela `postings` + `backend/src/index/invertedIndex.ts` |
| Busca booleana (AND/OR/NOT) | `backend/src/search/queryParser.ts` + `booleanRetrieval.ts` |
| Painel acadêmico            | `GET /api/stats` + `src/components/AcademicPanel.tsx` |

## Estrutura de telas (frontend)

- **HomeScreen** — logo RETRØVA, campo de busca (aceita sintaxe booleana), tamanho do corpus
- **ResultsScreen** — consulta interpretada, painel acadêmico, filtros por subreddit, ordenação, cards de resultado com termos casados
- **DocumentView** — documento completo do corpus + link para o post original no Reddit

## Evolução futura (não implementada ainda, de propósito)

Interfaces já deixadas prontas para receber, sem reescrever o núcleo:
índice posicional / busca por frase, TF-IDF, Vector Space Model, ranking,
métricas de avaliação (Precision@K, Recall).
