import '../db/schema.js'
import { ingestPosts, corpusSize } from '../corpus/corpusManager.js'
import { buildInvertedIndex, vocabularySize } from '../index/invertedIndex.js'
import type { RedditPostRaw } from '../types.js'

const SEED_POSTS: RedditPostRaw[] = [
  // --- r/learnpython ---
  {
    redditId: 'lp_001',
    title: 'How do I start learning Python in 2024 as a complete beginner?',
    selftext: 'I have no programming background. Should I follow online tutorials, read Automate the Boring Stuff with Python, or take an interactive course? Looking for best practices and roadmap.',
    subreddit: 'learnpython',
    createdUtc: 1715000100,
    score: 142,
    numComments: 38,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_001',
  },
  {
    redditId: 'lp_002',
    title: 'Understanding list comprehensions vs traditional for loops in Python',
    selftext: 'List comprehensions look cleaner and pythonic, but are they faster than standard for loops with append? When should I avoid list comprehensions for readability?',
    subreddit: 'learnpython',
    createdUtc: 1715010100,
    score: 89,
    numComments: 24,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_002',
  },
  {
    redditId: 'lp_003',
    title: 'Why is dictionary lookup O(1) in Python? Hash map implementation',
    selftext: 'I am reading about time complexity. How does Python implement dict under the hood using hash tables? What happens when a hash collision occurs?',
    subreddit: 'learnpython',
    createdUtc: 1715020100,
    score: 215,
    numComments: 45,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_003',
  },
  {
    redditId: 'lp_004',
    title: 'Virtual environments: venv vs conda vs poetry',
    selftext: 'Which package manager and virtual environment tool should I use for Python web development and data science? Poetry seems modern, but venv is built-in.',
    subreddit: 'learnpython',
    createdUtc: 1715030100,
    score: 176,
    numComments: 52,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_004',
  },
  {
    redditId: 'lp_005',
    title: 'Object-oriented programming (OOP) in Python: classes, inheritance and dunder methods',
    selftext: 'Can someone explain __init__, __str__, and __repr__? Why does self need to be passed explicitly in instance methods?',
    subreddit: 'learnpython',
    createdUtc: 1715040100,
    score: 98,
    numComments: 19,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_005',
  },
  {
    redditId: 'lp_006',
    title: 'Web scraping with BeautifulSoup and requests vs Playwright',
    selftext: 'I want to scrape data from an ecommerce site. BeautifulSoup works for static HTML, but the site uses dynamic JavaScript rendering. Is Playwright better than Selenium?',
    subreddit: 'learnpython',
    createdUtc: 1715050100,
    score: 112,
    numComments: 31,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_006',
  },
  {
    redditId: 'lp_007',
    title: 'Asyncio tutorial: when should you use asynchronous programming in Python?',
    selftext: 'Is asyncio only useful for network I/O bound tasks? Why doesn’t it speed up CPU bound calculations? Multiprocessing vs threading vs async explained.',
    subreddit: 'learnpython',
    createdUtc: 1715060100,
    score: 130,
    numComments: 29,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_007',
  },
  {
    redditId: 'lp_008',
    title: 'How to write unit tests in Python using pytest and mock',
    selftext: 'Coming from unittest, pytest feels much cleaner. How do fixtures and parameterization work? Any tips on mocking external HTTP API requests?',
    subreddit: 'learnpython',
    createdUtc: 1715070100,
    score: 87,
    numComments: 15,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_008',
  },
  {
    redditId: 'lp_009',
    title: 'FastAPI vs Flask vs Django for building REST APIs',
    selftext: 'Building my first backend in Python. FastAPI offers automatic Swagger docs and Pydantic validation. Is Django overkill for a simple microservice?',
    subreddit: 'learnpython',
    createdUtc: 1715080100,
    score: 304,
    numComments: 78,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_009',
  },
  {
    redditId: 'lp_010',
    title: 'Handling exceptions and custom errors properly in Python',
    selftext: 'Never do bare except: pass. Always catch specific exceptions like ValueError, KeyError, or FileNotFoundError to avoid hiding bugs.',
    subreddit: 'learnpython',
    createdUtc: 1715090100,
    score: 75,
    numComments: 12,
    permalink: 'https://reddit.com/r/learnpython/comments/lp_010',
  },

  // --- r/learnprogramming ---
  {
    redditId: 'prog_001',
    title: 'How to think like a programmer: breaking down complex problems',
    selftext: 'When you are given an algorithm task, do not write code immediately. Use pseudocode, draw flowcharts, divide the problem into smaller subproblems.',
    subreddit: 'learnprogramming',
    createdUtc: 1715100100,
    score: 540,
    numComments: 92,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_001',
  },
  {
    redditId: 'prog_002',
    title: 'Data structures and algorithms: Roadmap for beginners',
    selftext: 'Start with arrays and linked lists, then move to stacks, queues, hash maps, trees (binary search tree), and graphs. Learn sorting and binary search.',
    subreddit: 'learnprogramming',
    createdUtc: 1715110100,
    score: 412,
    numComments: 66,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_002',
  },
  {
    redditId: 'prog_003',
    title: 'Git version control essential commands: commit, branch, merge and rebase',
    selftext: 'Learn how to create feature branches, commit meaningful messages, resolve merge conflicts, and push to GitHub or GitLab repositories.',
    subreddit: 'learnprogramming',
    createdUtc: 1715120100,
    score: 280,
    numComments: 41,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_003',
  },
  {
    redditId: 'prog_004',
    title: 'Recursion vs iteration: how call stack works in memory',
    selftext: 'Every recursive function needs a base case and recursive step. If recursion is too deep, you will get a stack overflow error.',
    subreddit: 'learnprogramming',
    createdUtc: 1715130100,
    score: 165,
    numComments: 28,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_004',
  },
  {
    redditId: 'prog_005',
    title: 'SQL vs NoSQL databases: When to choose PostgreSQL over MongoDB',
    selftext: 'Relational databases provide ACID transactions and strict schemas. NoSQL document stores offer flexible schemas and horizontal scalability.',
    subreddit: 'learnprogramming',
    createdUtc: 1715140100,
    score: 340,
    numComments: 63,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_005',
  },
  {
    redditId: 'prog_006',
    title: 'REST API design principles: HTTP methods, status codes, and JSON response',
    selftext: 'Use GET for retrieval, POST for creation, PUT/PATCH for updates, and DELETE for removal. Return 200 OK, 201 Created, 400 Bad Request, 404 Not Found.',
    subreddit: 'learnprogramming',
    createdUtc: 1715150100,
    score: 220,
    numComments: 35,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_006',
  },
  {
    redditId: 'prog_007',
    title: 'JavaScript fundamentals: Closures, Promises, and the Event Loop',
    selftext: 'Understand single-threaded execution, call stack, callback queue, microtask queue, and how async/await syntax wraps Promises in modern JS.',
    subreddit: 'learnprogramming',
    createdUtc: 1715160100,
    score: 298,
    numComments: 48,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_007',
  },
  {
    redditId: 'prog_008',
    title: 'Docker containerization guide for beginners: images, containers, volumes',
    selftext: 'Why does Docker solve the "it works on my machine" problem? Build a Dockerfile, run containers, and manage multi-container apps with docker-compose.',
    subreddit: 'learnprogramming',
    createdUtc: 1715170100,
    score: 389,
    numComments: 57,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_008',
  },
  {
    redditId: 'prog_009',
    title: 'Clean code and SOLID principles explained with practical examples',
    selftext: 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, and Dependency inversion. Write maintainable and readable code.',
    subreddit: 'learnprogramming',
    createdUtc: 1715180100,
    score: 410,
    numComments: 72,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_009',
  },
  {
    redditId: 'prog_010',
    title: 'How to debug effectively: using breakpoints, logs, and rubber duck debugging',
    selftext: 'Stop guessing what your code is doing. Use interactive debuggers in VS Code, inspect variables, step through execution, and read stack traces.',
    subreddit: 'learnprogramming',
    createdUtc: 1715190100,
    score: 195,
    numComments: 23,
    permalink: 'https://reddit.com/r/learnprogramming/comments/prog_010',
  },

  // --- r/datascience ---
  {
    redditId: 'ds_001',
    title: 'Pandas data manipulation best practices: Vectorization vs apply',
    selftext: 'Avoid iterating over rows with iterrows. Use vectorized operations in NumPy and Pandas for 100x performance gains when cleaning tabular data.',
    subreddit: 'datascience',
    createdUtc: 1715200100,
    score: 360,
    numComments: 44,
    permalink: 'https://reddit.com/r/datascience/comments/ds_001',
  },
  {
    redditId: 'ds_002',
    title: 'Information Retrieval and search engines: Inverted Index vs Vector Search',
    selftext: 'Traditional Information Retrieval uses tokenization, stopword removal, Porter stemmer, and inverted index for boolean search (AND, OR, NOT). Modern search adds semantic embeddings.',
    subreddit: 'datascience',
    createdUtc: 1715210100,
    score: 480,
    numComments: 62,
    permalink: 'https://reddit.com/r/datascience/comments/ds_002',
  },
  {
    redditId: 'ds_003',
    title: 'Feature engineering: Handling missing values, categorical encoding, and scaling',
    selftext: 'Techniques for imputation: mean, median, KNN. Encoding with One-Hot vs Target encoding. Standardization with StandardScaler vs MinMaxScaler.',
    subreddit: 'datascience',
    createdUtc: 1715220100,
    score: 210,
    numComments: 30,
    permalink: 'https://reddit.com/r/datascience/comments/ds_003',
  },
  {
    redditId: 'ds_004',
    title: 'Machine learning model evaluation: Precision, Recall, F1-Score, and ROC-AUC',
    selftext: 'Why accuracy is misleading on imbalanced datasets. Choose precision when false positives are costly, recall when false negatives are critical.',
    subreddit: 'datascience',
    createdUtc: 1715230100,
    score: 315,
    numComments: 51,
    permalink: 'https://reddit.com/r/datascience/comments/ds_004',
  },
  {
    redditId: 'ds_005',
    title: 'Natural Language Processing (NLP) pipeline from raw text to TF-IDF and embeddings',
    selftext: 'Text preprocessing: lowercase normalization, regex cleaning, tokenization, stop word filtering, and stemming or lemmatization before building vocabulary matrix.',
    subreddit: 'datascience',
    createdUtc: 1715240100,
    score: 425,
    numComments: 59,
    permalink: 'https://reddit.com/r/datascience/comments/ds_005',
  },
  {
    redditId: 'ds_006',
    title: 'SQL for Data Science: Window functions (ROW_NUMBER, RANK, LEAD, LAG)',
    selftext: 'Window functions are essential for complex aggregations, cumulative sums, running totals, and cohort analysis without unnecessary self joins.',
    subreddit: 'datascience',
    createdUtc: 1715250100,
    score: 290,
    numComments: 36,
    permalink: 'https://reddit.com/r/datascience/comments/ds_006',
  },
  {
    redditId: 'ds_007',
    title: 'Exploratory Data Analysis (EDA) checklist with Seaborn and Matplotlib',
    selftext: 'Check distributions with histograms, outliers with boxplots, correlations with heatmaps, and relationships with scatter plots before modeling.',
    subreddit: 'datascience',
    createdUtc: 1715260100,
    score: 180,
    numComments: 21,
    permalink: 'https://reddit.com/r/datascience/comments/ds_007',
  },
  {
    redditId: 'ds_008',
    title: 'Random Forest vs XGBoost vs LightGBM: Gradient boosting in tabular data',
    selftext: 'Tree ensemble methods dominate Kaggle tabular competitions. LightGBM handles large datasets faster with histogram-based splitting.',
    subreddit: 'datascience',
    createdUtc: 1715270100,
    score: 375,
    numComments: 68,
    permalink: 'https://reddit.com/r/datascience/comments/ds_008',
  },
  {
    redditId: 'ds_009',
    title: 'MLOps: Deploying machine learning models with FastAPI and Docker',
    selftext: 'Packaging trained scikit-learn models as REST APIs. Monitoring data drift, latency, batch inference, and model versioning with MLflow.',
    subreddit: 'datascience',
    createdUtc: 1715280100,
    score: 245,
    numComments: 33,
    permalink: 'https://reddit.com/r/datascience/comments/ds_009',
  },
  {
    redditId: 'ds_010',
    title: 'Deep learning: Transfer learning with PyTorch and Hugging Face Transformers',
    selftext: 'Fine-tuning pretrained BERT and transformer models for text classification. Using GPU acceleration with CUDA in PyTorch pipelines.',
    subreddit: 'datascience',
    createdUtc: 1715290100,
    score: 310,
    numComments: 42,
    permalink: 'https://reddit.com/r/datascience/comments/ds_010',
  },

  // --- r/brdev ---
  {
    redditId: 'brdev_001',
    title: 'Como conseguir a primeira vaga como desenvolvedor Júnior em 2024?',
    selftext: 'Mercado de tecnologia mais concorrido. Ter projetos reais no GitHub, bom domínio de Git, lógica de programação, estrutura de dados e comunicação contam muito.',
    subreddit: 'brdev',
    createdUtc: 1715300100,
    score: 410,
    numComments: 89,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_001',
  },
  {
    redditId: 'brdev_002',
    title: 'Faculdade de Ciência da Computação vs ADS vs Cursos Livres: O que vale a pena?',
    selftext: 'Ciência da Computação dá base teórica forte em algoritmos, compiladores, arquitetura e recuperação da informação. ADS é mais rápido e prático para entrar no mercado.',
    subreddit: 'brdev',
    createdUtc: 1715310100,
    score: 320,
    numComments: 74,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_002',
  },
  {
    redditId: 'brdev_003',
    title: 'Desenvolvimento backend com Node.js, TypeScript e PostgreSQL',
    selftext: 'Construindo arquitetura limpa com Express, Prisma/TypeORM, autenticação JWT, validação com Zod e testes automatizados com Jest.',
    subreddit: 'brdev',
    createdUtc: 1715320100,
    score: 230,
    numComments: 45,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_003',
  },
  {
    redditId: 'brdev_004',
    title: 'React vs Vue vs Angular: Qual escolher para o frontend do seu projeto?',
    selftext: 'React domina o ecossistema com Vite, Next.js e Tailwind CSS. Vue possui curva de aprendizado suave. Angular oferece framework opinativo completo.',
    subreddit: 'brdev',
    createdUtc: 1715330100,
    score: 195,
    numComments: 53,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_004',
  },
  {
    redditId: 'brdev_005',
    title: 'Trabalho remoto para o exterior: Como se preparar e negociar em dólar',
    selftext: 'Fluência em inglês técnico, código limpo, experiência com times assíncronos e boa reputação em plataformas internacionais.',
    subreddit: 'brdev',
    createdUtc: 1715340100,
    score: 512,
    numComments: 104,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_005',
  },
  {
    redditId: 'brdev_006',
    title: 'Dicas para otimizar consultas SQL em bancos relacionais grandes',
    selftext: 'Crie índices nas colunas filtradas no WHERE e JOIN, evite SELECT *, use EXPLAIN ANALYZE para inspecionar planos de execução e paginação com chaves.',
    subreddit: 'brdev',
    createdUtc: 1715350100,
    score: 280,
    numComments: 39,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_006',
  },
  {
    redditId: 'brdev_007',
    title: 'Boas práticas de segurança em APIs web: CORS, rate limiting e sanitização',
    selftext: 'Proteja rotas contra ataques de injeção SQL, configure cabeçalhos Helmet, limite requisições com express-rate-limit e nunca exponha credenciais em repositórios.',
    subreddit: 'brdev',
    createdUtc: 1715360100,
    score: 260,
    numComments: 32,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_007',
  },
  {
    redditId: 'brdev_008',
    title: 'Arquitetura de microsserviços vs Monólito modular',
    selftext: 'Não comece com microsserviços antes de precisar de escalabilidade real. Um monólito bem estruturado é mais simples de manter, testar e deployar.',
    subreddit: 'brdev',
    createdUtc: 1715370100,
    score: 345,
    numComments: 61,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_008',
  },
  {
    redditId: 'brdev_009',
    title: 'Implementando motor de busca com índice invertido em Recuperação de Informação',
    selftext: 'Projeto acadêmico: processando documentos, aplicando tokenização, remoção de stopwords, algoritmo de stemming de Porter e busca booleana com operadores AND, OR e NOT.',
    subreddit: 'brdev',
    createdUtc: 1715380100,
    score: 390,
    numComments: 48,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_009',
  },
  {
    redditId: 'brdev_010',
    title: 'Dicas de saúde mental e ergonomia para quem programa o dia todo',
    selftext: 'Cadeira ergonômica, pausas regulares com método Pomodoro, exercícios físicos e separar o horário de trabalho do lazer evitam burnout.',
    subreddit: 'brdev',
    createdUtc: 1715390100,
    score: 185,
    numComments: 27,
    permalink: 'https://reddit.com/r/brdev/comments/brdev_010',
  },
]

// Gera variações realistas para expandir o corpus para mais de 100 documentos
function generateExpandedCorpus(): RedditPostRaw[] {
  const list: RedditPostRaw[] = [...SEED_POSTS]
  const variations = [
    { sub: 'learnpython', topic: 'Python', keywords: ['scripting', 'automation', 'data analysis', 'algorithms', 'web scraping', 'APIs'] },
    { sub: 'learnprogramming', topic: 'Programming', keywords: ['debugging', 'clean architecture', 'system design', 'recursion', 'data structures', 'databases'] },
    { sub: 'datascience', topic: 'Data Science', keywords: ['machine learning', 'feature selection', 'neural networks', 'statistics', 'deep learning', 'pandas'] },
    { sub: 'brdev', topic: 'Carreira e Desenvolvimento', keywords: ['desenvolvimento backend', 'engenharia de software', 'testes unitários', 'banco de dados', 'devops', 'algoritmos'] },
  ]

  let count = 11
  for (const v of variations) {
    for (const kw of v.keywords) {
      const id = `${v.sub}_${count}`
      const isPt = v.sub === 'brdev'
      const title = isPt
        ? `Discussão sobre ${kw}: melhores práticas e ferramentas recomendadas`
        : `Discussion on ${kw}: best practices, common pitfalls and tools in ${v.topic}`
      const selftext = isPt
        ? `Quais são as principais dicas para quem está trabalhando com ${kw}? Compartilhe experiências, erros frequentes e dicas práticas de desenvolvimento.`
        : `What are your top recommendations when dealing with ${kw}? Looking for real-world advice, performance considerations, and recommended libraries.`
      list.push({
        redditId: id,
        title,
        selftext,
        subreddit: v.sub,
        createdUtc: 1715400000 + count * 3600,
        score: Math.floor(Math.random() * 200) + 15,
        numComments: Math.floor(Math.random() * 40) + 5,
        permalink: `https://reddit.com/r/${v.sub}/comments/${id}`,
      })
      count++
    }
  }

  // Mais documentos complementares para cobrir termos específicos de busca booleana
  const extraQueries = [
    { title: 'Python and SQL integration with SQLAlchemy and SQLite', sub: 'learnpython', text: 'How to connect Python to SQLite database, execute SQL queries, handle transactions, and build relational schemas.' },
    { title: 'JavaScript and TypeScript: migration guide for frontend apps', sub: 'learnprogramming', text: 'Why adding TypeScript types to JavaScript improves code quality and reduces runtime bugs in React and Node.' },
    { title: 'Information retrieval boolean queries: evaluate AND, OR, NOT operations', sub: 'datascience', text: 'Evaluating boolean expressions using posting lists intersection for AND, union for OR, and difference for NOT.' },
    { title: 'Docker container with Python and PostgreSQL for local development', sub: 'learnprogramming', text: 'Setting up docker-compose with Python backend, PostgreSQL database, and persistent volume storage.' },
    { title: 'Machine learning classification without deep neural networks', sub: 'datascience', text: 'Using Logistic Regression, Random Forest, and Support Vector Machines for tabular data classification.' },
    { title: 'Como organizar código backend limpo em TypeScript', sub: 'brdev', text: 'Separando controllers, services, repositories e validações para facilitar testes unitários e manutenção futura.' },
    { title: 'Algoritmos de busca em grafos: BFS e DFS com exemplos', sub: 'brdev', text: 'Implementando busca em largura e busca em profundidade com fila e pilha em problemas clássicos de computação.' },
    { title: 'Pandas vs Polars: dataframe performance comparison in Python', sub: 'datascience', text: 'Polars is written in Rust and uses multithreading. Is it ready to replace Pandas for large tabular data?' },
    { title: 'Git branch strategy: Gitflow vs trunk-based development', sub: 'learnprogramming', text: 'Trunk-based development encourages frequent small merges into main, whereas Gitflow uses develop and feature branches.' },
    { title: 'Web development roadmap: HTML, CSS, JavaScript, React, and Node', sub: 'learnprogramming', text: 'Complete guide for full stack web developers learning frontend and backend technologies from scratch.' },
  ]

  for (let i = 0; i < extraQueries.length; i++) {
    const q = extraQueries[i]
    list.push({
      redditId: `extra_${i + 1}`,
      title: q.title,
      selftext: q.text,
      subreddit: q.sub,
      createdUtc: 1715500000 + i * 3600,
      score: 120 + i * 10,
      numComments: 20 + i * 2,
      permalink: `https://reddit.com/r/${q.sub}/comments/extra_${i + 1}`,
    })
  }

  return list
}

async function runSeed() {
  console.log('🚀 Iniciando população do corpus (seed local)...')
  const posts = generateExpandedCorpus()
  console.log(`Documentos a inserir: ${posts.length}`)

  const ingested = ingestPosts(posts)
  console.log(`✅ Inseridos/atualizados com sucesso: ${ingested} documentos`)

  console.log('⚙️ Construindo índice invertido (tokenização, stopwords, stemming)...')
  const indexResult = buildInvertedIndex()

  console.log('🎉 --- Corpus e Índice Prontos! ---')
  console.log(`📚 Total de Documentos no Corpus: ${corpusSize()}`)
  console.log(`📖 Total de Termos no Vocabulário: ${vocabularySize()}`)
  console.log(`📑 Documentos processados: ${indexResult.documentsProcessed}`)
}

runSeed().catch((err) => {
  console.error('Erro ao popular corpus:', err)
  process.exit(1)
})
