# 09 — Operations & Zero-Budget Cloud Strategy

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Zero-Budget Deployment Topology

To ensure zero financial waste during development and research, the platform leverages generous free-tier cloud primitives:

| Component                      | Target Platform          | Free Tier Allowance                                         | Operational Considerations          |
| ------------------------------ | ------------------------ | ----------------------------------------------------------- | ----------------------------------- |
| **Workstation UI & Nitro SSR** | Vercel / Cloud Run       | 100GB Fast Data Transfer (Vercel) / 2M requests (Cloud Run) | Scale-to-zero when idle             |
| **PostgreSQL Database**        | Neon Serverless Postgres | 0.5 GiB storage, scale-to-zero compute                      | Autosuspends after 5 min inactivity |
| **Cache & Pub/Sub**            | Upstash Redis            | 10,000 commands/day free                                    | Ephemeral tick cache                |
| **Asset & Artifact Storage**   | Cloudflare R2            | 10GB storage / month, 0 egress fees                         | Report exports, model checkpoints   |
| **DNS, CDN & DDoS Shield**     | Cloudflare Free          | Unlimited CDN caching & SSL                                 | Standard tier protection            |
| **CI / CD Pipeline**           | GitHub Actions           | 2,000 free runner minutes / month                           | Turbo cached builds & tests         |

---

## 2. Scale-to-Zero & Cold Start Mitigation

- **Neon Connection Pooling**: Uses Neon's `@neondatabase/serverless` WebSocket/HTTP connection pooler to prevent connection exhaustion during cold starts.
- **Graceful Fallbacks**: If Redis or external market feeds are temporarily suspended, the workstation serves cached static presets with a visible offline indicator.
