import { GITHUB_STATS } from "./github-stats";
import type { SiteData } from "./site.types";

// Italian translation of site.en.ts — same shape, same ids/slugs/hrefs/keys,
// only human-readable copy is translated. Kept in sync by hand; if a field
// is added to site.en.ts, add its Italian counterpart here too.

export const IT: SiteData = {
  PROFILE: {
    name: "Alessandro Bruno",
    role: "Systems & Product Engineer",
    shortRole: "Systems · Product · Open Source",
    location: "Italia",
    github: "https://github.com/alessandrobrunoh",
    website: "https://alessandrobrunoh.it",
    email: "alessandro.brunoh@gmail.com",
    x: "",
    avatar: "/avatar.jpg",
    company: { name: "Luna S.r.l.", href: "https://lunapartner.it" },
    bio: "Rust è il linguaggio a cui torno sempre — servizi asincroni su Tokio, sistemi event-driven costruiti su stream di messaggi, e confini tipizzati che tengono leggibile una codebase a mesi di distanza. Quello che mi piace è il percorso intero: portare un modello di dominio fino a qualcosa di osservabile in produzione, e lasciare il codice più facile da estendere di come l'ho trovato. Lo stesso istinto si vede in quello che scrivo per me — un demone di local history, un ORM per DuckDB, e un'estensione di linguaggio che è dentro Zed.",
    availability: "Disponibile per ruoli backend e systems — Italia o da remoto.",
  },

  TOC: [
    { n: "01", href: "#intro", label: "Intro" },
    { n: "02", href: "#experience", label: "Esperienza" },
    { n: "03", href: "#projects", label: "Progetti" },
    { n: "04", href: "#oss", label: "Open Source" },
    { n: "05", href: "#stack", label: "Stack" },
    { n: "06", href: "#pulse", label: "Attività" },
    { n: "07", href: "#exploring", label: "Esplorazioni" },
    { n: "08", href: "#blog", label: "Scritti" },
    { n: "09", href: "#contact", label: "Contatti" },
  ],

  COMPANY: {
    name: "Luna S.r.l.",
    href: "https://lunapartner.it",
    location: "Italia",
    summary:
      "In Luna S.r.l. sono passato da un fleet tracker in produzione alla piattaforma event-driven che oggi progetto e sviluppo, portando nel sistema successivo le lezioni di delivery, operazioni e utenti reali.",
  },

  ROLES: [
    {
      title: "Systems & Product Engineer",
      dates: "Giu 2026 — presente",
      current: true,
      bullets: [
        "Progetto da zero un'architettura a microservizi event-driven in Rust.",
        "Valkey streams e code come bus; AWS S3 per la persistenza; Tokio per servizi completamente asincroni.",
        "L'osservabilità è progettata fin dall'inizio — Grafana, Alloy, Loki e Tempo — non aggiunta dopo.",
      ],
      tags: ["Rust", "Tokio", "S3", "Grafana", "Systems"],
    },
    {
      title: "Tirocinante Sviluppatore Software",
      dates: "Set 2025 — Giu 2026",
      current: false,
      bullets: [
        "Realizzato un fleet tracker in produzione usato su mezzi spazzatrici.",
        "API Spring Boot, dashboard Angular per l'ufficio, app Expo sul mezzo.",
        "Percorsi assegnati da centrale; avanzamento trasmesso in tempo reale via WebSocket.",
      ],
      tags: ["Spring Boot", "Angular", "Expo", "WebSocket"],
    },
  ],

  EDUCATION: {
    school: "Università di Bologna",
    degree: "Laurea in Tecnologie dei Sistemi Informatici",
    native: "B.Sc. Computer Systems Technologies",
    dates: "Laureato il 10 lug 2026",
    thesis:
      "Progettazione e Sviluppo di PETRA, una Piattaforma Event-Driven per la Telemetria e l'Analisi Asincrona in Tempo Reale",
    thesisHref: "",
  },

  CONTRIBUTIONS: [
    {
      status: "Open",
      title: "Nuova UI e port forwarding dinamico",
      repo: "zed-industries/zed",
      href: "https://github.com/zed-industries/zed/pull/55248",
      note: "In pausa.",
    },
    {
      status: "Merged",
      title: "Supporto al linguaggio JDL",
      repo: "zed-industries/extensions",
      href: "https://github.com/zed-industries/extensions/pull/3339",
      note: "Rilasciato in Zed.",
    },
    {
      status: "Open",
      title: "Semantic Delta Protocol",
      repo: "zed-industries / editor tooling",
      href: "https://github.com/alessandrobrunoh/Semantic-Delta-Protocol",
      note: "Identità del codice a livello AST.",
    },
  ],

  PROJECTS: [
    {
      id: "eivar",
      name: "Eivar-Online",
      blurb: "MMO Bevy server-authoritative. Replica UDP, mondo persistente, raccolta risorse, mercati, combattimento.",
      href: "https://github.com/alessandrobrunoh/Eivar-Online",
      stars: GITHUB_STATS.stars["Eivar-Online"] ?? 0,
      lang: "Rust",
      meta: "In corso",
      featured: true,
      year: "2026",
      stack: ["Bevy", "ECS", "UDP", "SeaORM"],
      highlights: [
        "Autorità del server con predizione e interpolazione",
        "Tabelle di loot, raccolta, crafting e mercati tra giocatori",
        "Sessioni account e un percorso di login via web",
      ],
      learned:
        "Come un game loop rispecchi gli stessi istinti event-driven che uso al lavoro — il server possiede la verità, il client si limita a predire.",
      body: "Un prototipo multiplayer open source scritto in Rust. Bevy ECS gestisce il gameplay; il server possiede la verità. Il lavoro recente copre crowd-control, kit di abilità, loot dai cadaveri ed eventi di dominio delimitati — gli stessi istinti event-driven che uso al lavoro, applicati a un mondo vivo.",
    },
    {
      id: "mnemosyne",
      name: "Mnemosyne",
      blurb:
        "Cronologia locale tra IDE diversi. Snapshot ad ogni salvataggio, ricerca full-text, ripristino istantaneo — completamente locale e altamente deduplicato.",
      href: "https://github.com/alessandrobrunoh/Mnemosyne",
      stars: GITHUB_STATS.stars["Mnemosyne"] ?? 0,
      lang: "Rust",
      meta: "Cronologia locale",
      featured: true,
      year: "2026",
      stack: ["Rust", "CLI", "TUI", "Daemon"],
      highlights: [
        "Snapshot ad ogni salvataggio, anche tra un commit Git e l'altro",
        "Archivio locale content-addressed e altamente deduplicato",
        "Ricerca full-text e ripristino istantaneo dei file",
      ],
      learned:
        "Rilasciare un demone che le persone usano davvero. Storage content-addressed, una TUI, e la disciplina di tenere ogni byte sul dispositivo.",
      body: "Lo strumento di cronologia locale che volevo usare ogni giorno. Un demone osserva i salvataggi, una TUI e una CLI cercano e ripristinano, e niente lascia la macchina. È ancora il progetto che mi ha insegnato a rilasciare uno strumento Rust che le persone usano davvero.",
    },
    {
      id: "ducklake",
      name: "ducklake-orm",
      blurb: "ORM Rust leggero per DuckDB — derive macro, CRUD type-safe, pooling, time travel, migrazioni.",
      href: "https://github.com/alessandrobrunoh/ducklake-orm",
      stars: GITHUB_STATS.stars["ducklake-orm"] ?? 0,
      lang: "Rust",
      meta: "Strumenti dati",
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
        items: "Tokio · Axum · SQLx · Bevy · ratatui",
        also: "Actix, SeaORM, Diesel, clap, Leptos, Dioxus, GPUI, wasm-bindgen",
      },
      {
        name: "TypeScript",
        level: "Competente",
        items: "Angular · React · Node · Tailwind CSS",
        also: "Svelte, Expo, React Native, NestJS",
      },
      {
        name: "Java",
        level: "Competente",
        items: "Spring Boot · Hibernate · Maven",
        also: "JHipster, Gradle, Kafka",
      },
      {
        name: "Infrastruttura",
        level: "",
        items: "Docker · PostgreSQL · Valkey · AWS S3 · Grafana",
        also: "Kubernetes, Redis, DuckLake, Alloy, Loki, Tempo",
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
    { name: "xAI", product: "Grok", href: "https://x.ai", mark: "grok" },
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
