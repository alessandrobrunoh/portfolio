import { GITHUB_STATS } from "./github-stats";
import type { SiteData } from "./site.types";

// Italian translation of site.en.ts — same shape, same ids/slugs/hrefs/keys,
// only human-readable copy is translated. Kept in sync by hand; if a field
// is added to site.en.ts, add its Italian counterpart here too.

export const IT: SiteData = {
  PROFILE: {
    name: "Alessandro Bruno",
    role: "Software Engineer — Rust / Backend",
    shortRole: "Rust · Backend · Event-driven",
    headline: "Servizi event-driven in Rust in produzione, dai consumer asincroni alle trace in Grafana.",
    location: "Bologna, Italia",
    github: "https://github.com/alessandrobrunoh",
    website: "https://alessandrobrunoh.it",
    email: "alessandro.brunoh@gmail.com",
    x: "",
    avatar: "/avatar.jpg",
    company: { name: "Luna S.r.l.", href: "https://lunapartner.it" },
    bio: "Backend engineer Rust a Bologna. Da oltre un anno lavoro su microservizi event-driven in produzione in Luna S.r.l.: consumer asincroni su Valkey Streams, payload su S3, trace e log con OpenTelemetry verso Grafana, Loki e Tempo — tutto passato da code review senior. La mia tesi triennale, PETRA, è una piattaforma event-driven per la telemetria asincrona in tempo reale. Fuori dal lavoro costruisco strumenti un livello più in basso: ducklake-orm, un ORM Rust pubblicato su crates.io; Mnemosyne, una cronologia semantica del codice basata su Tree-sitter; e il supporto al linguaggio JDL, accettato in Zed.",
    availability: "Disponibile per ruoli Rust e backend — da remoto o ibrido in Italia, con preavviso. Cittadino UE.",
  },

  TOC: [
    { n: "01", href: "#intro", label: "Intro" },
    { n: "02", href: "#projects", label: "Progetti" },
    { n: "03", href: "#experience", label: "Esperienza" },
    { n: "04", href: "#oss", label: "Open Source" },
    { n: "05", href: "#stack", label: "Stack" },
    { n: "06", href: "#contact", label: "Contatti" },
  ],

  COMPANY: {
    name: "Luna S.r.l.",
    href: "https://lunapartner.it",
    location: "Bologna, Italia",
    summary:
      "In Luna S.r.l. ho iniziato su una piattaforma fleet e dopo due mesi sono passato al backend Rust in produzione del cliente, con code review senior. Oggi lavoro su quella piattaforma event-driven e su una nuova console operatore.",
  },

  ROLES: [
    {
      title: "Sviluppatore Software",
      dates: "Giu 2026 — presente",
      current: true,
      bullets: [
        "Servizi Rust event-driven in produzione per carichi dei clienti: consumer asincroni su Valkey Streams, payload su S3.",
        "Trace e log con OpenTelemetry verso Grafana, Loki e Tempo.",
        "Una nuova console operatore in Spring Boot e React — API e interfaccia.",
      ],
      tags: ["Rust", "Tokio", "Valkey Streams", "S3", "OpenTelemetry", "Spring Boot", "React"],
    },
    {
      title: "Tirocinante Sviluppatore Software",
      dates: "Set 2025 — Giu 2026",
      current: false,
      bullets: [
        "Piattaforma fleet in Spring Boot, Angular e React Native, con aggiornamenti live via WebSocket.",
        "Dopo due mesi, passato al backend Rust del cliente con code review senior.",
        "Branch Git impilati e diff piccoli e revisionabili come metodo di lavoro.",
      ],
      tags: ["Spring Boot", "Angular", "React Native", "WebSocket", "Rust"],
    },
  ],

  EDUCATION: {
    school: "Università di Bologna — Campus di Cesena",
    degree: "Laurea in Tecnologie dei Sistemi Informatici",
    native: "B.Sc. Computer Systems Technologies",
    dates: "Laureato il 10 lug 2026",
    thesis:
      "Progettazione e Sviluppo di PETRA, una Piattaforma Event-Driven per la Telemetria e l'Analisi Asincrona in Tempo Reale",
    thesisHref: "",
  },

  CONTRIBUTIONS: [
    {
      status: "Merged",
      title: "Supporto al linguaggio JDL",
      repo: "zed-industries/extensions",
      href: "https://github.com/zed-industries/extensions/pull/3339",
      note: "Grammatica Tree-sitter ed estensione per l'editor, ora nel marketplace ufficiale.",
    },
    {
      status: "Open",
      title: "UI per il port forwarding e forward SSH live",
      repo: "zed-industries/zed",
      href: "https://github.com/zed-industries/zed/pull/55248",
      note: "Aggiungere o rimuovere forward nelle sessioni remote senza riconnettersi.",
    },
    {
      status: "Published",
      title: "ducklake-orm",
      repo: "crates.io",
      href: "https://crates.io/crates/ducklake-orm",
      note: "ORM Rust con derive macro, query builder, pooling, migrazioni e time travel di DuckLake.",
    },
  ],

  PROJECTS: [
    {
      id: "eivar",
      name: "Eivar-Online",
      blurb: "Prototipo multiplayer: simulazione Rust server-authoritative, stato replicato, predizione lato client.",
      href: "https://github.com/alessandrobrunoh/Eivar-Online",
      stars: GITHUB_STATS.stars["Eivar-Online"] ?? 0,
      lang: "Rust",
      meta: "In corso",
      featured: true,
      year: "2026",
      stack: ["Bevy", "SpacetimeDB", "WebAssembly", "Stato distribuito"],
      highlights: [
        "Simulazione server-authoritative con predizione lato client",
        "Stato replicato tramite un modulo SpacetimeDB compilato in WebAssembly",
        "Loot, raccolta, crafting e mercati tra giocatori come eventi di dominio delimitati",
      ],
      learned:
        "Come un game loop rispecchi gli stessi istinti event-driven che uso al lavoro — il server possiede la verità, il client si limita a predire.",
      body: "Un prototipo multiplayer open source scritto in Rust. Bevy ECS gestisce il gameplay; il server possiede la verità. Il lavoro recente copre crowd-control, kit di abilità, loot dai cadaveri ed eventi di dominio delimitati — gli stessi istinti event-driven che uso al lavoro, applicati a un mondo vivo.",
    },
    {
      id: "mnemosyne",
      name: "Mnemosyne",
      blurb: "Cronologia semantica del codice, local-first: simboli e modifiche strutturali via Tree-sitter, non diff per righe.",
      href: "https://github.com/alessandrobrunoh/Mnemosyne",
      stars: GITHUB_STATS.stars["Mnemosyne"] ?? 0,
      lang: "Rust",
      meta: "Cronologia semantica",
      featured: true,
      year: "2026",
      stack: ["Tree-sitter", "redb", "Storage content-addressed", "MCP"],
      highlights: [
        "Traccia simboli e modifiche strutturali invece dei diff per righe",
        "Daemon, CLI e TUI sopra un workspace di storage content-addressed",
        "Accessibile agli strumenti AI tramite MCP",
      ],
      learned:
        "Rilasciare un demone che le persone usano davvero. Storage content-addressed, una TUI, e la disciplina di tenere ogni byte sul dispositivo.",
      body: "Lo strumento di cronologia locale che volevo usare ogni giorno. Un demone osserva i salvataggi, una TUI e una CLI cercano e ripristinano, e niente lascia la macchina. È ancora il progetto che mi ha insegnato a rilasciare uno strumento Rust che le persone usano davvero.",
    },
    {
      id: "ducklake",
      name: "ducklake-orm",
      blurb: "ORM Rust per DuckDB e DuckLake, pubblicato su crates.io — derive macro, query builder, pooling, migrazioni, time travel.",
      href: "https://github.com/alessandrobrunoh/ducklake-orm",
      stars: GITHUB_STATS.stars["ducklake-orm"] ?? 0,
      lang: "Rust",
      meta: "crates.io",
      featured: true,
      year: "2026",
      stack: ["Rust", "DuckDB", "proc-macro", "SQL"],
      highlights: [
        "Le derive macro mappano struct in tabelle senza boilerplate",
        "Filtri type-safe, order_by, limit, count, fetch_one",
        "Pooling, migrazioni e time travel di DuckLake",
      ],
      learned: "Il livello sotto la query: confini tipizzati, ergonomia dei dati, e cosa serve per rendere lo storage analitico un prodotto.",
      body: "Un ORM Rust leggero per DuckDB, costruito per rendere lo storage analitico accessibile senza nasconderne le parti utili. Il lavoro riguarda confini tipizzati, ergonomia dei dati e piccole decisioni API che rendono uno strumento piacevole da continuare a usare.",
    },
    {
      id: "weaklings",
      name: "Weaklings-Manager",
      blurb: "Piattaforma self-hosted per gilde di Albion — banca, divisione del loot, analisi delle battaglie, login Discord.",
      href: "https://github.com/alessandrobrunoh/Weaklings-Manager",
      stars: GITHUB_STATS.stars["Weaklings-Manager"] ?? 0,
      lang: "Angular",
      meta: "API Axum",
      featured: false,
      year: "2026",
      stack: ["Axum", "PostgreSQL", "Angular", "Discord"],
      highlights: [
        "Banca di gilda e divisione del loot",
        "Sessioni evento con analisi delle battaglie",
        "Login Discord con accesso basato sui ruoli",
      ],
      learned:
        "Un dominio reale con utenti reali: autenticazione, banca, composizioni, e un bot che doveva restare online per una gilda — non una demo.",
      body: "Un'API Rust/Axum, una dashboard Angular e un bot Discord — che coprono banca, composizioni, tracciamento dell'energia sifonata e dati live di Albion. Costruito per una gilda che aveva bisogno di uno strumento vero, non di un foglio di calcolo.",
    },
    {
      id: "ketchapp",
      name: "KetchApp",
      blurb: "Produttività nello studio come microservizi. Pomodoro, piani con IA, notifiche asincrone.",
      href: "https://github.com/orgs/ketchapp-for-study",
      lang: "Java",
      meta: "Org",
      featured: false,
      year: "2025",
      stack: ["Rust", "Java", "Kafka", "Auth"],
      highlights: ["API di autenticazione in Rust", "Notifiche basate su Kafka", "Servizi separati invece di un monolite"],
      learned:
        "Dove si rompe un monolite. Autenticazione in Rust, notifiche su Kafka, e le giunture che si vedono solo quando i pezzi iniziano a muoversi.",
      body: "Progetto universitario di gruppo diventato il mio primo vero taglio a microservizi: un'API di autenticazione in Rust, un percorso Java su Kafka, e notifiche asincrone per Pomodoro e piani di studio. L'organizzazione mantiene ancora questa suddivisione.",
    },
    {
      id: "briscola",
      name: "Briscola Online",
      blurb: "Briscola in tempo reale via WebSocket. Multiplayer full-stack.",
      href: "https://github.com/alessandrobrunoh/Progetto-Ingegneria-Web",
      stars: GITHUB_STATS.stars["Progetto-Ingegneria-Web"] ?? 0,
      lang: "Vue",
      meta: "Web",
      featured: false,
      year: "2024",
      stack: ["Vue", "WebSocket", "Node"],
      highlights: ["Partite multiplayer dal vivo", "UI del tavolo responsive", "Dati di gioco persistenti"],
      learned:
        "La prima volta che un WebSocket doveva restare onesto per degli amici al tavolo — stato, turni, e un'interfaccia che poteva perdere.",
      body: "Progetto del corso di ingegneria del web che doveva davvero funzionare per giocare. Briscola in tempo reale via WebSocket, un frontend Vue, e abbastanza backend per mantenere onesta una partita. La prima volta che ho rilasciato qualcosa che degli amici si sono seduti a usare.",
    },
    {
      id: "sdp",
      name: "Semantic Delta Protocol",
      blurb: "Modifiche al codice a livello di AST — Tree-sitter e hashing strutturale.",
      href: "https://github.com/alessandrobrunoh/Semantic-Delta-Protocol",
      lang: "Rust",
      meta: "Protocollo",
      featured: false,
      year: "2026",
      stack: ["Rust", "Tree-sitter", "JSON-RPC"],
      highlights: [
        "Simboli invece di diff per riga",
        "Hashing strutturale che sopravvive ai refactor",
        "Superficie JSON-RPC per gli editor",
      ],
      learned: "Un'identità che sopravvive a un rename. Tree-sitter percorre l'AST; gli hash mantengono una funzione la stessa funzione.",
      body: "Un protocollo per tracciare le modifiche a livello di funzione e classe, non di riga. Tree-sitter percorre l'AST; gli hash strutturali mantengono l'identità attraverso un rename. Il fratello di ricerca di Mnemosyne.",
    },
    {
      id: "vapt",
      name: "VAPT Research",
      blurb: "Report di sicurezza su un fork di OWASP Juice Shop.",
      href: "https://github.com/alessandrobrunoh/Relazione-Sicurezza-Privacy",
      lang: "TypeScript",
      meta: "Ricerca",
      featured: false,
      year: "2025",
      stack: ["TypeScript", "OWASP", "VAPT"],
      highlights: [
        "Juice Shop forkato come bersaglio",
        "Risultati strutturati, non un dump di scansione",
        "Lavoro universitario che doveva leggersi come un report",
      ],
      learned: "Perimetro, exploit, impatto, correzione. Scrivere come un report, non come una classifica di CVE.",
      body: "Una valutazione delle vulnerabilità su un'app volutamente vulnerabile, scritta come un vero report. Il punto era il metodo: perimetro, exploit, impatto, correzione — non una classifica di CVE.",
    },
  ],

  STACK: {
    groups: [
      {
        name: "Rust",
        level: "Esperto",
        items: "Tokio · Axum · SQLx · Tree-sitter · Bevy",
        also: "Actix, SeaORM, Diesel, clap, ratatui, Leptos, Dioxus, GPUI, wasm-bindgen",
      },
      {
        name: "TypeScript",
        level: "Competente",
        items: "Angular · React · React Native · Node",
        also: "Svelte, Expo, NestJS, Tailwind CSS",
      },
      {
        name: "Java & Python",
        level: "Competente",
        items: "Spring Boot · Hibernate · Maven",
        also: "JHipster, Gradle, Kafka, Python",
      },
      {
        name: "Infrastruttura",
        level: "",
        items: "Docker · PostgreSQL · Valkey · S3 · OpenTelemetry · Grafana",
        also: "Linux, Loki, Tempo, Alloy, Redis, DuckLake, Kubernetes",
      },
    ],
  },

  FUTURE_PROJECTS: [
    {
      id: "solana-dex",
      name: "Mini DEX su Solana",
      blurb: "Matching degli ordini on-chain sotto i vincoli della blockchain.",
      href: "",
      lang: "Solana",
      meta: "Pianificato",
      year: "Prossimo",
      stack: ["Rust", "Solana", "Anchor"],
      highlights: [
        "Order book on-chain con logica di matching in un programma",
        "Vincoli del modello ad account invece di un database libero",
        "I limiti di compute budget costringono ogni istruzione a essere essenziale",
      ],
      learned: "Come regge il matching on-chain sotto il modello ad account di Solana e i limiti di calcolo — non solo la teoria.",
      body: "Un matcher di ordini per DEX scritto come programma Solana. La parte interessante non è la logica di matching — è costruirla dentro un modello ad account e un compute budget che ti costringono a giustificare ogni byte e ogni istruzione.",
    },
    {
      id: "btree-db",
      name: "Mini motore di database con un B-Tree",
      blurb: "Interni dello storage — il livello sotto gli ORM.",
      href: "https://github.com/alessandrobrunoh/mini-db-btree",
      lang: "Rust",
      meta: "Pianificato",
      year: "Prossimo",
      stack: ["Rust", "B-Tree", "Storage"],
      highlights: [
        "Split delle pagine, letture e scritture su pagine disco grezze",
        "Nessun ORM in mezzo — il livello di storage stesso",
        "Uno sguardo dalle fondamenta a ciò su cui poggia ducklake-orm",
      ],
      learned:
        "Cosa fa davvero un B-Tree su disco — split delle pagine, letture e scritture — invece di limitarsi a chiamarne uno tramite un ORM.",
      body: "Un piccolo motore di database costruito attorno a un B-Tree, da zero. Dopo aver pubblicato un ORM, questo è il livello sottostante: come i dati vengono davvero organizzati, suddivisi e trovati su disco.",
    },

  ],

  BLOG: [
    {
      slug: "publishing-a-crate-without-an-audience",
      title: "Quando uno strumento dati diventa un prodotto",
      subtitle: "ducklake-orm",
      pitch:
        "Le piccole decisioni di API e documentazione che trasformano lo storage a basso livello in qualcosa che le persone possono usare davvero.",
      status: "Planned",
      body: [
        "Lo storage analitico è potente, ma la potenza da sola non rende piacevole uno strumento. Ho costruito ducklake-orm per esplorare il confine tra le capacità di DuckDB e un'API chiara per il lavoro quotidiano.",
        "Le decisioni interessanti non riguardavano solo le query: errori tipizzati, valori predefiniti comprensibili, migrazioni e il punto in cui un'astrazione deve fermarsi e lasciare parlare il database.",
        "Questa bozza ripercorrerà i compromessi che hanno modellato l'API, la documentazione che avrei voluto scrivere per prima e la differenza tra avvolgere un sistema e renderlo comprensibile.",
        "Il test a cui torno è semplice: un nuovo utente riesce a prevedere cosa succede dopo senza aprire l'implementazione? Se no, l'astrazione sta ancora facendo pagare al lettore la propria complessità.",
      ],
    },
    {
      slug: "what-i-got-wrong-about-event-buses",
      title: "Cosa ho sbagliato sugli event bus",
      subtitle: "Valkey / tirocinio → assunzione",
      pitch: "Le assunzioni che ho portato da un mondo request/response a uno event-driven, e dove si sono rotte.",
      status: "Planned",
      body: [
        "Sono arrivato al ruolo di backend Rust da un mondo request/response — un'API Spring che rispondeva a una chiamata e andava avanti. L'event bus non funziona così, e le assunzioni che mi sono portato dietro erano sbagliate in modi che si sono visti solo sotto carico.",
        "La prima: trattavo \"consegnato\" ed \"elaborato\" come lo stesso evento. Non lo sono, e il divario tra i due è dove vivono retry, duplicati e bug di ordinamento. Gli stream di Valkey rendono visibile quel divario, se sei disposto a guardarlo.",
        "Questa è una bozza — il pezzo finito ripercorrerà il fallimento specifico che me l'ha insegnato, e come l'osservabilità (Grafana, Alloy, Loki, Tempo) abbia dovuto essere progettata fin dall'inizio prima che mi fidassi abbastanza del bus da costruirci sopra.",
        "La regola pratica è diventata una piccola macchina a stati: leggi, elabora, conferma. Quando le transizioni sono esplicite, i retry smettono di sembrare casi limite e diventano parte del design.",
      ],
    },
    {
      slug: "reading-a-zed-pr-end-to-end",
      title: "Leggere una PR di Zed dall'inizio alla fine",
      subtitle: "Open source, in pratica",
      pitch: "Come una PR reale attraversa la review in una codebase in rapida evoluzione — cosa cercano davvero i reviewer.",
      status: "Draft",
      body: [
        "Far unire l'estensione per il linguaggio JDL in zed-industries/extensions ha significato leggere il processo di review di Zed tanto quanto il codice — una codebase in rapida evoluzione con idee precise su come dovrebbe apparire un contributo prima ancora che un maintainer lo guardi.",
        "La parte interessante non era il file della grammatica. Era osservare cosa segnalavano davvero i reviewer: naming che non rispettava le convenzioni esistenti, fixture di test mancanti, e scope creep in una PR che doveva fare una sola cosa.",
        "Questa è ancora una bozza. Il pezzo finito ripercorrerà i commenti di review specifici su quella PR e su quella più recente ancora aperta (dynamic port forwarding), e cosa mi hanno insegnato sullo scrivere una PR che uno sconosciuto possa approvare rapidamente.",
        "Una buona review è un esercizio di compressione: il comportamento deve essere evidente, il diff stretto e il reviewer deve trovarsi davanti a una decisione, non a dieci ipotesi.",
      ]
    },
  ],

  PULSE: {
    lede: "Attività pubblica reale, presa dall'API di GitHub — quanto rilascio ogni trimestre e in che linguaggio. Il passaggio dai progetti universitari al lavoro sui sistemi in Rust è tutta la storia.",
    takeaway: "Porto una visione sistemica nel lavoro di prodotto: capire il dominio, rendere chiara l'interfaccia e lasciare una codebase più facile da estendere.",
    note: `Generato dall'API di GitHub il ${GITHUB_STATS.generatedAt} da scripts/sync-github.mjs — il calendario dei contributi per il volume, e i commit attribuiti al linguaggio principale di ogni repository per la ripartizione. Il lavoro privato conta nei totali come lo conta GitHub; nessun nome di repository privato viene pubblicato.`,
    forHiringManagers: {
      title: "Come contribuisco",
      points: [
        { label: "Pensiero sistemico", detail: "Collego dominio, asincronia, persistenza e osservabilità senza trattarli come livelli isolati." },
        {
          label: "Consapevolezza del prodotto",
          detail: "Mi interessa l'interfaccia attorno al sistema: flussi chiari, feedback utili e software che si possa continuare a usare.",
        },
        {
          label: "Tooling deliberato",
          detail: "Dalle CLI ai contributi agli editor, cerco strumenti piccoli che eliminino attrito dal lavoro ripetuto.",
        },
        { label: "Collaborazione aperta", detail: "Imparo volentieri in pubblico, ricevo review e rendo i contributi facili da riprendere per altri." },
      ],
    },
    kpis: [
      { label: "GitHub", value: GITHUB_STATS.lastYearContributions, hint: "Contributi, ultimi 12 mesi" },
      { label: "Repository pubblici", value: GITHUB_STATS.publicRepos, hint: `${GITHUB_STATS.totalStars} stelle in totale` },
      { label: "In Luna S.r.l.", display: "Delivery → sistemi", hint: "Dal prodotto rilasciato alla progettazione della piattaforma" },
    ],
    phases: [
      { era: "’24", title: "Università", body: "Vue e TypeScript. Il primo multiplayer a cui gli amici si sono seduti a giocare." },
      { era: "’25", title: "Tirocinio", body: "Java e Spring in produzione. Primo servizio Tokio. Una grammatica per Zed unita." },
      { era: "’26", title: "Lavoro sui sistemi", body: "Sistemi event-driven in produzione, una tesi sulla telemetria live e strumenti per esplorare i livelli sottostanti." },
      { era: "Prossimo", title: "Prossimo obiettivo", body: "Kubernetes in produzione. Raft. Un matcher on-chain." },
    ],
  },

  TOOLS: [
    { name: "OpenAI", product: "GPT 6 Sol", href: "https://openai.com", mark: "openai" },
    { name: "Zed", product: "IDE", href: "https://zed.dev", mark: "zed" },
    { name: "Delta", product: "IDE Agente", href: "https://delta.dev", mark: "delta" },
    { name: "GitButler", product: "Client Git", href: "https://gitbutler.com", mark: "gitbutler" },
  ],

  UI: {
    skipToContent: "Vai al contenuto",
    tocIndex: "Indice",
    tocCurrentWork: "Lavoro attuale",
    tocLanguages: "Lingue parlate",
    tocContact: "Contatti",
    sectionTitles: {
      intro: "Intro",
      experience: "Esperienza",
      projects: "Progetti",
      pulse: "Attività",
      openSource: "Open Source",
      blog: "Blog",
      stack: "Stack",
      futureProjects: "Esplorazioni",
      contact: "Contatti",
    },
    backToBlog: "← Torna al Blog",
    postNotFound: "Articolo non trovato.",
    close: "Chiudi",
    toggleTheme: "Cambia tema colore",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    contactLede: "Il modo più veloce per raggiungermi è l'email — leggo tutto e rispondo.",
    emailLabel: "Email",
    copyEmail: "Copia indirizzo",
    copiedEmail: "Copiato",
    readThesis: "Leggi la tesi",
  },
};
