# Swarm & Bee AI

**swarmandbee.ai** — Vertical AI models and platinum-grade training data infrastructure.

## Live Site

**[swarmandbee.ai](https://swarmandbee.ai)**

## Pages

| Page | URL | Description |
|------|-----|-------------|
| **Hub** | [/](https://swarmandbee.ai) | Main site — fleet, skills, architecture, BeeBox |
| **Signal** | [/signal](https://swarmandbee.ai/signal) | SwarmSignal real-time market intelligence |
| **Curator** | [/curator](https://swarmandbee.ai/curator) | SwarmCurator data curation platform |
| **Morey** | [/morey](https://swarmandbee.ai/morey) | SwarmCRE-9B chat interface |
| **SwarmCare** | [/swarmcare](https://swarmandbee.ai/swarmcare) | Support and care plans |
| **Hedera** | [/hedera](https://swarmandbee.ai/hedera) | Hedera network — signal timestamping |
| **Dashboard** | [/dashboard](https://swarmandbee.ai/dashboard) | User portal — pair inventory, billing |
| **SwarmMed** | [/swarmmed](https://swarmandbee.ai/swarmmed) | 434,882 medical pairs across 92 specialties |
| **SwarmPharma** | [/swarmpharma](https://swarmandbee.ai/swarmpharma) | 50K pharma pairs, 16 task types, 5-step trajectory |
| **SwarmAviation** | [/swarmaviation](https://swarmandbee.ai/swarmaviation) | 45,222 aviation pairs, CoVe quality pipeline |

## Model Fleet

| Model | Base | Pairs | Status |
|-------|------|-------|--------|
| SwarmPharma-35B | Qwen3.5-35B-A3B | 25,629 | Sealed v1 |
| SwarmCRE-35B | Qwen3.5-35B-A3B | 643,382 | Training v3 |
| SwarmCurator-27B | Qwen3.5-27B | — | Live (Blackwell 96GB) |
| SwarmCurator-9B | Qwen3.5-9B | 46,000 | Live (3090 Ti 24GB) |
| SwarmResearch-32B | Qwen2.5-32B | 35,499 | Trained v1 |
| Morey (CRE-9B) | Qwen3.5-9B | 643,382 | Live API |
| BeeMini-3B | Qwen2.5-3B | 60,000 | Live (Q4_K_M, 1.8GB) |
| SwarmSignal-2B | Qwen3.5-2B | — | Live (Jetson Edge) |

## Data Inventory

**1.24M unique platinum training pairs** across 6 verticals:

- **CRE**: 643,382 pairs — 10 specialties, math-verified
- **Medical**: 434,882 pairs — 92 specialties, 19 textbook sources
- **Aviation**: 45,222 pairs — 50+ specialties, CoVe verified
- **Pharma**: 50,000 pairs — 16 task types, 5-step trajectory
- **Drone**: 6,755 pairs — 176 specialties
- **Core**: 31,347 pairs — legal, research, safety

## Infrastructure

- **Compute**: RTX PRO 6000 Blackwell (96GB) + RTX 3090 Ti (24GB) on swarmrails
- **Edge**: Jetson Orin Nano 8GB, Intel N150 (zima-edge-1)
- **Storage**: Cloudflare R2 (6 buckets), Synology NAS, Supabase
- **API**: [router.swarmandbee.com](https://router.swarmandbee.com) — 28 SwarmSkills, wallet-metered
- **Quality**: 6 deterministic gates (no LLM judge), CoVe 2-stage verification

## Hosting

Static site on Cloudflare Pages. Deploys automatically on push to `main`.

## Links

- **API**: [router.swarmandbee.com](https://router.swarmandbee.com)
- **HuggingFace**: [huggingface.co/SwarmandBee](https://huggingface.co/SwarmandBee)
- **Discord**: [discord.gg/sNjJrND5eb](https://discord.gg/sNjJrND5eb)
- **X**: [@swarmandbee](https://x.com/swarmandbee)
