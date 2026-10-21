<!--
  Source for the GitHub profile README (github.com/alessandrobrunoh/alessandrobrunoh).
  Kept next to the site so both tell the same story: when site.en.ts changes, update this too.
-->

# Alessandro Bruno

Software engineer in Bologna, backend first. At [Luna S.r.l.](https://lunapartner.it) I design and build event-driven systems in Rust for clients. On my own time I build the developer tools I was missing.

[Portfolio](https://alessandrobrunoh.it) · [CV](https://alessandrobrunoh.it/alessandro-bruno-cv.pdf) · [Email](mailto:alessandro.brunoh@gmail.com)

**Open to** Software Engineer and Forward Deployed Engineer roles: backend first, also full-stack or customer-facing. Italy and the rest of Europe, remote or hybrid. EU citizen.

---

## Work

**Software Developer, Luna S.r.l.** · Jun 2026 to present
- Designed the event-driven Rust platform for a client project, and build it with a team of 5–10: Tokio consumers on Valkey Streams, payloads on S3. The client is under NDA.
- Made the services observable end to end with OpenTelemetry, Grafana, Loki and Tempo, so a single event can be followed across services.
- Building a new operator console: Spring Boot APIs and a React UI.
- Case study: [an event-driven platform for a client](https://alessandrobrunoh.it/work/event-platform)

**Software Developer Intern, Luna S.r.l.** · Sep 2025 to Jun 2026
- Fleet platform in Spring Boot, Angular and React Native with live updates over WebSockets. About 200 vehicles run on it today.
- Moved onto a client's production Rust backend after two months, shipping under senior code review.

**B.Sc. Computer Systems Technologies, University of Bologna** · Jul 2026
- Thesis: *PETRA, an event-driven platform for real-time asynchronous telemetry and analysis.*

## Projects

| Project | What it is | Stack |
|---|---|---|
| [Trama](https://github.com/alessandrobrunoh/trama) · [live](https://trama.alessandrobrunoh.it) | Coordination layer for teams that ship with people and coding agents: issues, workstreams, decisions and artifacts in one place. Self-hosted, with a Rust MCP server. | Angular · NestJS · PostgreSQL · Rust |
| [ducklake-orm](https://github.com/alessandrobrunoh/ducklake-orm) | Rust ORM for DuckDB and DuckLake, [published on crates.io](https://crates.io/crates/ducklake-orm). Derive macros, typed queries, migrations, time travel. 39 integration tests. | Rust · DuckDB · proc-macro |
| [Mnemosyne](https://github.com/alessandrobrunoh/Mnemosyne) | Local-first semantic history for source code. Tracks symbols with Tree-sitter, not line diffs; queryable by AI agents over MCP. | Rust · Tree-sitter · redb |
| [Eivar-Online](https://github.com/alessandrobrunoh/Eivar-Online) | Multiplayer prototype: server-authoritative simulation, replicated state, client-side prediction. | Rust · Bevy · SpacetimeDB |
| [TrainGame](https://github.com/alessandrobrunoh/train-game-test) | Life sim on an endless train: hundreds of NPCs, a closed economy and gangs. An LLM proposes one novelty a day; the deterministic engine validates it or refuses it. | Rust · Bevy · SQLite · LLM |
| [Weaklings-Manager](https://github.com/alessandrobrunoh/Weaklings-Manager) | Guild platform for Albion Online: bank, loot splits, battle analytics, Discord login. Used by about 50 players. | Rust/Axum · PostgreSQL · Angular |

## Open source

- **Merged** · [JDL syntax highlighting](https://github.com/zed-industries/extensions/pull/3339) in `zed-industries/extensions`
- **In review** · [Port forwarding UI](https://github.com/zed-industries/zed/pull/65705) in `zed-industries/zed`
- **Published** · [ducklake-orm](https://crates.io/crates/ducklake-orm) on crates.io

## Stack

- **Rust:** Tokio, Axum, SQLx, Tree-sitter, Bevy
- **TypeScript:** Angular, React, React Native, Node, NestJS
- **Java:** Spring Boot, Hibernate, Maven
- **Infrastructure:** Docker, PostgreSQL, Valkey, S3, OpenTelemetry, Grafana

## How I work

I wrote all of my code by hand through university and the first half of my internship. Today I write it with coding agents, and the time I used to spend typing goes into specifying the change and reviewing it. I treat generated code as a proposal: I read the diff, run the tests and ask for changes. [Trama](https://trama.alessandrobrunoh.it) came out of that way of working.
