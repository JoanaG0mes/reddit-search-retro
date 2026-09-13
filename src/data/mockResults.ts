import type { RedditResult } from '../types'

// Dados de FALLBACK, usados apenas quando o backend do RETRØVA está fora
// do ar (modo demo). A busca real usa o índice invertido + busca booleana
// implementados em backend/src/search — ver ApiUnavailableError em App.tsx.
export const mockResults: RedditResult[] = [
  {
    id: '1',
    title: 'Como aprender Python do zero em 2026?',
    subreddit: 'r/learnpython',
    excerpt:
      'Estou começando a estudar Python e gostaria de saber quais recursos vocês recomendam para quem nunca programou antes...',
    date: '2026-07-12',
    comments: 84,
    score: 512,
    relevance: 92,
    url: 'https://reddit.com/r/learnpython/example1',
    matchedTerms: [],
  },
  {
    id: '2',
    title: 'Qual a diferença entre listas e tuplas na prática?',
    subreddit: 'r/learnprogramming',
    excerpt:
      'Sei a definição teórica, mas ainda tenho dúvida sobre quando usar uma ou outra em projetos reais...',
    date: '2026-06-30',
    comments: 41,
    score: 203,
    relevance: 78,
    url: 'https://reddit.com/r/learnprogramming/example2',
    matchedTerms: [],
  },
  {
    id: '3',
    title: 'Melhores bibliotecas de Python para Ciência de Dados',
    subreddit: 'r/datascience',
    excerpt:
      'Fazendo uma lista com pandas, numpy, scikit-learn e outras. Quais vocês não abrem mão no dia a dia?',
    date: '2026-05-18',
    comments: 129,
    score: 940,
    relevance: 71,
    url: 'https://reddit.com/r/datascience/example3',
    matchedTerms: [],
  },
  {
    id: '4',
    title: 'Erro estranho ao instalar pacotes com pip',
    subreddit: 'r/learnpython',
    excerpt:
      'Toda vez que tento instalar um pacote novo recebo um erro de permissão. Já tentei ambiente virtual e nada...',
    date: '2026-04-02',
    comments: 23,
    score: 67,
    relevance: 65,
    url: 'https://reddit.com/r/learnpython/example4',
    matchedTerms: [],
  },
  {
    id: '5',
    title: 'Vale a pena aprender Python antes de JavaScript?',
    subreddit: 'r/cscareerquestions',
    excerpt:
      'Estou decidindo minha primeira linguagem e o pessoal fala muito bem de Python para iniciantes...',
    date: '2026-03-21',
    comments: 156,
    score: 388,
    relevance: 58,
    url: 'https://reddit.com/r/cscareerquestions/example5',
    matchedTerms: [],
  },
  {
    id: '6',
    title: 'Projeto simples em Python para portfólio de iniciante',
    subreddit: 'r/learnpython',
    excerpt:
      'Preciso de ideias de projetos pequenos que mostrem que eu sei o básico da linguagem para vagas júnior...',
    date: '2026-02-09',
    comments: 97,
    score: 445,
    relevance: 51,
    url: 'https://reddit.com/r/learnpython/example6',
    matchedTerms: [],
  },
]

export const totalIndexedDocuments = 128_430
