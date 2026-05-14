# Phase 7 — Infrastructure & DevOps

**Essence:** the production environment your code actually runs in. By
Phase 7's end the student reads a Dockerfile, docker-compose.yml,
Kubernetes manifest, Terraform config, and GitHub Actions workflow
end-to-end. Knows what to ask an agent when "I'll just deploy this to
AWS" comes up. Can spot the cost-explosion, security-leak, and
single-point-of-failure mistakes.

**Gate:** given a small SaaS app (Next.js + Postgres + Redis), draw the
production architecture: where each component runs, how requests reach
it, where secrets live, what handles SSL, what handles backups, what
monitors uptime. Identify the failure modes and what mitigates each.

**Restructuring note:** original scaffold had 37 lessons across 6 modules.
Expanded to ~55 lessons across 9 modules. Major additions: cloud-platform
depth (AWS/GCP/Cloudflare/Vercel side-by-side), Infrastructure as Code as
its own module, observability as more than "logs," reliability engineering
(SLOs, incident management), cost engineering.

**Primary references**
- *Site Reliability Engineering* and *The SRE Workbook* (Google) — free
  online, foundational.
- *The DevOps Handbook* (Kim et al.) — workflow / culture.
- *The Phoenix Project* (Kim et al.) — narrative.
- *Infrastructure as Code*, 2nd ed. (Kief Morris).
- *Cloud Native Patterns* (Cornelia Davis).
- *Kubernetes Up & Running* (Burns, Beda, Hightower).
- *Designing Data-Intensive Applications* (Kleppmann) ch. 8-12 for
  distributed systems intuition.
- AWS Well-Architected Framework — required reading.
- *Effective DevOps* (Davis & Daniels).
- *Production Ready Microservices* (Susan Fowler).
- *Observability Engineering* (Charity Majors et al.).
- The "12-Factor App" methodology — required.
- roadmap.sh/devops — community-maintained.
- Brendan Gregg's website (brendangregg.com) — Linux performance.
- *Linux Performance* (Brendan Gregg) — the book.

**Cross-phase threads touched here**
- Testing — production-shape testing (smoke tests, synthetic monitoring,
  chaos).
- Debugging — log aggregation, distributed tracing, eBPF, profiling in
  production.
- Performance — capacity planning, latency budgets, cost vs performance.
- Security — secrets, network segmentation, IAM, encryption, supply
  chain.
- AI-integration — GPU infrastructure, model serving, vector DB ops.

---

## Module 7.1 — Linux & shell scripting at the server level

### L1 · Why Linux runs production · STANDARD · ~30 min
Subtopics: open source + free + dominant on servers; the kernel + GNU
userland; major distro families (Debian/Ubuntu, RHEL/Fedora/Rocky/Alma,
Alpine, Arch, Amazon Linux, distroless); choosing one for production
(Ubuntu LTS or Amazon Linux is the modern default for general use;
Alpine for tiny container images; distroless for security-first
containers).

### L2 · Server-side Linux navigation and admin · DEEP · ~70 min
Subtopics: extends Phase 0 with production-shaped tasks: tmux/screen for
persistent sessions over SSH; sudo and the principle of least privilege;
adding users / groups (useradd, usermod, groupadd); systemd basics
(systemctl status/start/stop/enable; journalctl -u service -f -n 200);
log files (/var/log/, journalctl); disk space (df -h, du -sh, ncdu);
processes (top, htop, btop, atop, ps faux); files-open (lsof -p / lsof -i);
network (ss -tulpn, netstat, ip addr, ip route); routing the firewall
(ufw, firewalld, iptables for the curious); checking what's listening
on a port; the /etc/hosts override; reverse DNS (dig -x); time sync
(timedatectl, chronyc / ntpd); the "always log in UTC, set timezone
explicitly" rule.

### L3 · Shell scripting beyond one-liners · DEEP · ~80 min
Subtopics: shebang line; set -euo pipefail discipline; variables (env vs
local); $1...$N positional; "$@" vs "$*"; functions; control flow (if,
case, for, while, until); test ([ … ] vs [[ … ]] — prefer [[); arithmetic
(( … )); string manipulation (${var%suffix}, ${var#prefix}, ${var/old/new});
arrays; here-docs (<<EOF); reading stdin (read line, while read -r line);
trap for cleanup; subshells $(…); the "shellcheck" linter (always run);
when bash is enough vs when to reach for Python (rule of thumb: if it
needs arrays-of-objects or any structured data, it's a Python script).

### L4 · cron, systemd timers, at · STANDARD · ~40 min
Subtopics: cron syntax (m h dom mon dow command); crontab -e per user;
/etc/cron.{d,daily,hourly,weekly,monthly}; systemd timers as the modern
alternative (OnCalendar=); the at command for one-shot scheduled; modern
SaaS rarely runs cron on individual servers — use platform schedulers
(EventBridge, Vercel Cron, GitHub Actions schedule) — but you'll meet
real crons in legacy systems and on VPSs.

### L5 · Process management and supervisors · STANDARD · ~50 min
Subtopics: systemd unit files (basic structure); the [Unit] / [Service]
/ [Install] sections; ExecStart, Restart, User, Environment, EnvironmentFile;
After= / Requires= dependencies; reading status; auto-restart strategies;
PM2 / forever as Node-specific historical; supervisord (Python-derived);
the "in 2026 you mostly let Docker / Kubernetes / a PaaS handle
supervision" reality.

### L6 · SSH and remote management · DEEP · ~60 min
Subtopics: SSH protocol overview; key-based vs password (always keys);
ssh-keygen (ed25519 modern, rsa legacy 4096-bit minimum); ssh-agent;
SSH config file (~/.ssh/config — Host blocks, IdentityFile, Hostname,
User, Port, ForwardAgent); the authorized_keys file; port forwarding
(-L local-port:remote-host:remote-port, -R remote-port:local-host:
local-port); SOCKS proxy (-D); SCP / rsync over SSH; ProxyJump for
bastion hosts; the "never expose SSH to the public internet without
careful auth" rule; SSH bastion / jump-host pattern; alternatives:
AWS Systems Manager Session Manager, GCP IAP, Tailscale, Cloudflare
Access (zero-trust replacement for SSH).

---

## Module 7.2 — Docker and containerization

### L7 · What containers actually are · DEEP · ~70 min
Subtopics: containers as OS-level isolation using kernel features
(namespaces for view isolation, cgroups for resource limits); the
difference from VMs (containers share the host kernel; VMs have their
own); the "but it works on my machine" elimination; container vs image
(image = read-only blueprint; container = running instance); Docker
Engine vs containerd vs OCI runtime spec; the ecosystem (Docker Desktop
the popular dev tool; Podman as the daemonless alternative; nerdctl).

### L8 · Dockerfile in depth · VERY-DEEP · ~120 min
Subtopics (~25):
1. FROM — base image choice (official, language-specific, alpine vs
   debian vs distroless).
2. The "pin the version" rule (FROM node:22.11.0-alpine3.20, NOT
   :latest).
3. WORKDIR, COPY, ADD (use COPY; ADD has surprising URL fetch behavior).
4. RUN — each is a layer; chain related commands to reduce layers.
5. The COPY package.json before COPY . trick for dependency cache hit
   on code-only changes.
6. The .dockerignore file — same role as .gitignore, prevents secrets
   and node_modules from leaking into images.
7. ENV vs ARG — ARG is build-time; ENV persists.
8. EXPOSE — documentation only, doesn't actually publish ports.
9. USER — switch from root before running the app.
10. ENTRYPOINT vs CMD — ENTRYPOINT is the "the thing that always runs,"
    CMD is the default arguments.
11. HEALTHCHECK — declared health probe.
12. Layer caching — what invalidates it, why order matters.
13. **Multi-stage builds** — build in a heavy image, copy artifacts to a
    lean runtime image. Critical for small images.
14. Common multi-stage shapes: Node (build → production); Python
    (builder → runtime); Go (compile → scratch); Rust (build → debian-
    slim).
15. The "compile statically and run on scratch" extreme.
16. distroless images (gcr.io/distroless/*) — no shell, no package
    manager, dramatic attack-surface reduction.
17. Image size targets: <100MB for most stacks; <50MB for compiled langs.
18. BuildKit features (--mount=type=cache for persistent build cache
    across runs; --mount=type=secret for build-time secrets).
19. Targets (`docker build --target test`).
20. Reading docker history / dive to inspect layers.
21. Tagging conventions (semver tags, "latest" anti-pattern in production).
22. Image registries (Docker Hub, GitHub Container Registry, GHCR, AWS
    ECR, GCR, Azure ACR, ttl.sh for ephemeral).
23. Signing images (cosign, Notary v2, Docker Content Trust).
24. Scanning images (trivy, grype, Snyk) for CVEs.
25. The "your Dockerfile is your most-leveraged security artifact" reality.

References: docker docs Dockerfile reference; Anchore guides; "Best
practices for writing Dockerfiles" (docker.com).

### L9 · Running containers · DEEP · ~60 min
Subtopics: docker run (the giant catalog: -d, --rm, --name, -p, -v,
-e, --env-file, --network, --user, --memory, --cpus, --restart, --tmpfs);
docker exec for shell access; docker logs (-f, --tail); docker ps;
docker stop / kill / rm; the "always set --memory and --cpus" production
discipline; reading the container's stdout/stderr; bind mounts vs
volumes; named volumes for data persistence; the "12-factor stateless
container, all state external" rule.

### L10 · Docker Compose · DEEP · ~70 min
Subtopics: compose.yaml structure; services, networks, volumes; depends_on
(start order — but doesn't wait for healthy); healthcheck + condition:
service_healthy for real dependency ordering; environment vs env_file;
ports; volumes; build context; the override file pattern (compose.yml +
compose.override.yml for dev, compose.prod.yml for prod overrides);
profiles (run a subset of services); compose for local dev as the standard
SaaS pattern (app + Postgres + Redis + MinIO + Mailhog); compose for
CI ephemeral environments; the "compose is great for dev, not for prod
beyond a single-host VPS" reality.

### L11 · Volumes, networks, persistence · STANDARD · ~50 min
Subtopics: bind mounts vs volumes vs tmpfs; volume drivers; the data-
container pattern (legacy); networks — default bridge, custom bridge,
host, overlay; service discovery via container name in same network;
exposing ports vs internal-only; the "DB on host, app in container"
hybrid; backups of volumes.

### L12 · Container security · DEEP · ~60 min
Subtopics: run as non-root (USER 1000); read-only filesystem; drop
capabilities (--cap-drop=ALL --cap-add=NET_BIND_SERVICE); no-new-privileges;
seccomp profiles; the "rootless Docker" mode; image scanning in CI;
SBOM (software bill of materials) generation; signing images;
restricting network egress; the "trust no image you didn't build or
verify" rule.

---

## Module 7.3 — Kubernetes (when, what, how much)

### L13 · The "do you actually need Kubernetes" question · STANDARD · ~30 min
Subtopics: the "Kubernetes is for multi-team, multi-service, large-scale
platforms" reality; the alternatives for small SaaS (Vercel, Fly.io,
Railway, Render, AWS App Runner, ECS Fargate, GCP Cloud Run, Cloudflare
Workers); when K8s wins (very large fleets, complex orchestration,
custom infra, vendor-lock concerns, kubernetes-as-internal-platform);
when K8s loses (small team, "we just need to deploy this Next.js app");
the "learn enough K8s to read manifests" target.

### L14 · The Kubernetes mental model · DEEP · ~80 min
Subtopics: declarative desired state (you describe what you want, the
control loop reconciles); the API server as the brain; etcd as the store;
controllers; the kubelet on each node; the scheduler; the cluster vs
the workload; namespaces; the standard objects: Pod (smallest unit; one
or more containers sharing network/volumes); Deployment (manages
ReplicaSets which manage Pods); Service (stable network endpoint);
Ingress (HTTP routing to Services); ConfigMap (non-secret config);
Secret (secrets, base64-encoded by default, NOT encrypted — use external
secrets stores); PersistentVolume / PersistentVolumeClaim (storage);
StatefulSet (for stateful apps with stable identity); DaemonSet (one pod
per node, e.g., log shipper); Job / CronJob (one-shot / scheduled);
HorizontalPodAutoscaler (HPA); the Networking model (every pod gets an IP,
flat network).

### L15 · kubectl in practice · STANDARD · ~50 min
Subtopics: kubectl get/describe/logs/exec/apply/delete; YAML manifests;
contexts and kubeconfig; namespaces; selectors (-l app=foo); kubectl
port-forward for local access; kubectl proxy; the kubectl cheat sheet;
k9s as a friendlier TUI; the "always write the YAML and apply it; never
imperative-create in production" rule.

### L16 · Helm and Kustomize · STANDARD · ~50 min
Subtopics: Helm — package manager for K8s (charts, templates, values,
releases); when Helm is right (third-party operators, Bitnami charts);
Kustomize — overlay-based config customization (no templating); the
"use Helm for installing other things, Kustomize for your own apps" rule;
the operator pattern briefly (CRDs + controllers extending K8s).

### L17 · Production K8s — the things you must do · DEEP · ~70 min
Subtopics: resource requests and limits (CPU, memory) — the "no limits =
node OOM eventually" rule; readinessProbe and livenessProbe; startup
probes for slow-starting apps; horizontal autoscaling on CPU + custom
metrics; pod disruption budgets; node taints + tolerations; affinity /
anti-affinity for spread; topology spread constraints; the rollingUpdate
strategy; canary patterns with two Deployments + Ingress weighting (or
Argo Rollouts); secrets external-secrets-operator (pulls from Vault /
AWS Secrets Manager / GCP Secret Manager); GitOps with Argo CD or Flux;
managed K8s (EKS, GKE, AKS, DigitalOcean K8s, Linode LKE) vs self-managed.

---

## Module 7.4 — Cloud platforms

### L18 · IaaS vs PaaS vs SaaS vs serverless · STANDARD · ~30 min
Subtopics: the spectrum from "rent a server" to "rent a function";
where each fits for SaaS.

### L19 · AWS — the essential services · VERY-DEEP · ~180 min (two sessions)
Subtopics (~35):
1. The AWS console / CLI / SDK — primary interfaces.
2. **IAM** (Identity and Access Management) — users, groups, roles,
   policies (managed and inline); the "least privilege" doctrine;
   federation; assume-role; instance profiles; OIDC trust (for GitHub
   Actions, Vercel, etc. — short-lived creds via OIDC instead of
   long-lived keys); the "never put long-lived AWS keys in CI" rule.
3. AWS Organizations — multi-account setups; the prod-account-vs-dev-
   account isolation; SCPs (Service Control Policies).
4. Regions, AZs, edge locations — picking regions for latency + data
   residency; multi-AZ vs multi-region.
5. **EC2** — virtual machines; instance families (T = burstable, M =
   general, C = compute, R = memory, I = storage, P/G = GPU); AMIs;
   security groups (stateful firewall); user data scripts; spot vs
   on-demand vs reserved/savings plans.
6. **VPC** (Virtual Private Cloud) — network isolation; subnets (public/
   private); route tables; internet gateway; NAT gateway (expensive!);
   security groups (instance-level) vs NACLs (subnet-level); VPC peering
   vs Transit Gateway; PrivateLink.
7. **ELB / ALB / NLB** — load balancers; ALB for HTTP/HTTPS with
   path/host routing; NLB for TCP/UDP/static IPs.
8. **Route 53** — DNS at AWS; health checks; latency-based routing;
   weighted routing; failover.
9. **CloudFront** — CDN; origin failover; behaviors; signed URLs;
   Lambda@Edge / CloudFront Functions.
10. **S3** — object storage; buckets; objects; storage classes (Standard,
    IA, One Zone-IA, Glacier, Deep Archive); lifecycle policies;
    versioning; replication; access control (bucket policies, IAM,
    pre-signed URLs); the "block public access" default and the famous
    leaks; encryption (SSE-S3, SSE-KMS, SSE-C); event notifications.
11. **RDS** — managed relational DB; Multi-AZ for HA; read replicas;
    parameter groups; option groups; backup window; auto-minor-version-
    upgrade; the "you don't run Postgres on EC2 yourself unless you
    really know why" rule.
12. **Aurora** — AWS's enhanced MySQL/Postgres engine; serverless v2;
    cluster-vs-instance; faster failover; reads scale to 15 replicas;
    the cost premium.
13. **DynamoDB** — managed NoSQL key-value/document; eventually consistent
    reads vs strongly consistent; provisioned vs on-demand capacity;
    GSIs (global secondary indexes); the "design for access patterns,
    not normalized" mental shift; DAX caching.
14. **ElastiCache** — managed Redis / Memcached.
15. **OpenSearch** — managed Elasticsearch.
16. **Lambda** — serverless functions; the cold-start problem; SnapStart
    (for Java); the 15-minute max execution; layers; environment vars;
    log to CloudWatch by default; concurrency limits; provisioned
    concurrency (reduce cold starts).
17. **ECS / Fargate** — container orchestration; Fargate = serverless
    containers; task definitions; services; the "ECS Fargate is the
    easy-mode container deploy" reality.
18. **EKS** — managed Kubernetes (covered in M7.3).
19. **App Runner** — fully managed container deploy; smaller scope than
    ECS; competes with Cloud Run.
20. **API Gateway** — REST / HTTP / WebSocket; authorizers; throttling;
    usage plans; the relationship to Lambda.
21. **Step Functions** — state machines / workflows; for orchestration
    of multiple Lambdas / Tasks.
22. **EventBridge** — event bus; scheduled events (replaces CloudWatch
    Events); pipes.
23. **SQS** — queues; standard vs FIFO; visibility timeout; DLQs.
24. **SNS** — pub/sub; fanout to SQS / Lambda / HTTP.
25. **Kinesis / Firehose** — streaming.
26. **CloudWatch** — logs (groups, streams), metrics, alarms,
    dashboards; Logs Insights for query; the "everything logs here by
    default" reality.
27. **X-Ray** — distributed tracing (or use OpenTelemetry → 3rd party
    backend).
28. **Secrets Manager** vs **SSM Parameter Store** — secrets storage;
    Secrets Manager has rotation built-in (more expensive); SSM is
    cheaper for plain config.
29. **KMS** — key management; envelope encryption pattern.
30. **WAF** — web application firewall; managed rules + custom rules.
31. **Shield** — DDoS protection (Standard is free, Advanced is
    enterprise).
32. **Certificate Manager** — free TLS certs auto-renewed.
33. **Cost Explorer**, **Budgets** — the "AWS bill discipline" tools;
    tagging strategy; the "every resource has owner + project + env
    tags" rule.
34. **Trusted Advisor / Cost Anomaly Detection / Compute Optimizer** —
    the underused tools.
35. The **"hello-world to production" path on AWS** (e.g., Route 53 →
    CloudFront → ALB → ECS Fargate → RDS).

### L20 · GCP — the essential services · STANDARD · ~90 min
Subtopics: Cloud Run (the killer serverless-container service —
arguably best in class); GKE / GKE Autopilot; Cloud SQL; Spanner (when
you genuinely need global SQL); Firestore (managed Firestore /
Datastore); BigQuery (the canonical warehouse); Pub/Sub; Cloud Functions;
IAM (with allUsers / allAuthenticatedUsers special principals); VPC; Load
Balancing; Cloud CDN; Secret Manager; Workload Identity Federation
(OIDC for GitHub Actions). The "GCP is often better for data + serverless;
AWS for breadth" generalization.

### L21 · Vercel, Netlify, Cloudflare — the modern app platforms · DEEP · ~70 min
Subtopics:
- **Vercel** — Next.js's home; serverless functions; edge functions; ISR;
  preview deployments per PR; analytics; image optimization; KV / Blob /
  Postgres add-ons; the "git-push-to-deploy" simplicity; cost considerations
  (function invocation pricing).
- **Netlify** — similar shape; strong on static + JAMstack; Edge Functions;
  Forms; Identity.
- **Cloudflare Workers + Pages + R2 + D1 + KV + Queues + Durable Objects**
  — the most ambitious "edge-native" full platform; Workers (V8 isolates,
  zero cold start); R2 (S3-compatible, no egress); D1 (SQLite at the edge);
  Durable Objects (stateful coordination); KV (eventually consistent
  key-value); the "edge-first" architecture trade-offs.

### L22 · Fly.io, Railway, Render, Heroku · STANDARD · ~40 min
Subtopics: PaaS positioned as "Heroku for the modern age"; Fly.io's
nearest-region deploy + globally distributed apps + Postgres clusters
+ machines API; Railway's simple deploy-from-git + DB add-ons; Render
similar with managed Postgres + Redis + cron; Heroku (the original;
still alive, more expensive); the "if you don't need cloud breadth,
PaaS is cheaper to operate" reality.

### L23 · Object storage and CDN deeply · DEEP · ~60 min
Subtopics: S3 / R2 / Backblaze B2 / Cloudflare Workers KV — pick on
egress cost (R2 = zero egress, S3 = expensive egress) and ecosystem; CDN
fundamentals (caching, invalidation, origin shield, anycast); origin
authentication; signed URLs / signed cookies; cache headers (Cache-Control,
Surrogate-Control, CDN-Cache-Control — the layered cache headers); the
"image hosting on CDN, not your app" pattern; image transformation at
edge (Cloudflare Images, imgix, Vercel Image, ImageKit).

---

## Module 7.5 — Infrastructure as Code (IaC)

### L24 · What IaC is and why · STANDARD · ~40 min
Subtopics: the "infrastructure in version control" doctrine; reproducible
environments; review-then-apply workflow; drift detection; the
declarative vs imperative split; the modern landscape (Terraform / OpenTofu
dominant, Pulumi / CDK / SST for "real code," CloudFormation legacy AWS-
specific, Ansible for config-management/imperative).

### L25 · Terraform / OpenTofu · DEEP · ~90 min
Subtopics: HCL syntax; providers (aws, google, cloudflare, etc.);
resources; data sources; variables; outputs; modules; remote state (S3 +
DynamoDB locking, Terraform Cloud, OpenTofu state encryption);
workspaces; the plan → apply cycle; terraform fmt / validate / plan /
apply / destroy / import / state list; tfstate as the source of truth
(secret! treat as DB); for_each / count; lifecycle blocks
(create_before_destroy, prevent_destroy, ignore_changes); the modules
ecosystem; common patterns (split repos by environment, or use
workspaces). The "OpenTofu fork is now the open governance Terraform"
politics.

### L26 · Pulumi / SST / CDK · STANDARD · ~50 min
Subtopics: "real programming language" IaC; TypeScript, Python, Go, C#;
Pulumi as multi-cloud; AWS CDK (synthesizes to CloudFormation); SST
(Pulumi-based, Next.js-focused); the trade-off vs Terraform (loops and
abstractions in real code vs HCL's simpler model); the "you can have
the best of both with CDKTF" middle path.

### L27 · Ansible / Chef / Puppet — config management · LIGHT · ~30 min
For the legacy systems and Linux fleets where these still matter.
Ansible is by far the most common today (agentless, YAML).

---

## Module 7.6 — CI/CD pipelines deep

### L28 · CI/CD principles revisited · STANDARD · ~30 min
The "every commit is potentially shippable" doctrine; the trunk-based
+ feature-flag model; the deploy != release distinction; the lead-time
metric; DORA's four key metrics (lead time, deploy frequency, change
fail rate, MTTR).

### L29 · GitHub Actions for production · DEEP · ~80 min
Extends Phase 1 with: reusable workflows; OIDC for AWS / GCP / Cloudflare
(no long-lived secrets); environments with required reviewers (manual
gate before prod deploy); concurrency groups; deployment_status events;
the matrix builds for multi-platform; cost considerations (large runner
minute pricing); self-hosted runners on EC2 / GCP / Fly.io for cheap
heavy work.

### L30 · GitLab CI, CircleCI, Buildkite, Jenkins · LIGHT · ~30 min
Awareness only. GitLab CI for GitLab users. CircleCI when GH Actions is
limited. Buildkite for enterprise pipeline orchestration. Jenkins for
old-school self-hosted (becoming less common).

### L31 · Build pipelines proper · DEEP · ~70 min
The canonical SaaS pipeline: lint → typecheck → test (unit) → test
(integration) → security scan (SAST, dep scan) → build → push image →
deploy to staging → smoke test → manual gate → deploy to prod → smoke
test in prod → ready. Each stage's purpose; what to do when each fails;
parallelizing for speed; caching dependencies between runs; the "fast
feedback for failures" priority.

### L32 · Deployment strategies · DEEP · ~70 min
Subtopics:
- **Recreate** — stop old, start new. Has downtime.
- **Rolling update** — gradually replace pods. Default in K8s.
- **Blue-green** — two parallel environments; switch traffic at once.
- **Canary** — gradual traffic shift; observe error rate; rollback on
  spike.
- **Feature flags** — deploy code but don't activate; release independently
  of deploy.
- **Dark launch** — call new code path without using output.
- **Shadow traffic** — duplicate live requests to new version for testing.

The "feature flags + trunk-based" pattern as the safest modern combo.

### L33 · Database migrations in CI/CD · DEEP · ~60 min
Subtopics: the "run migrations before the new code" sequencing; backward-
compatible migrations (covered in Phase 4 L39); the migrations container
pattern in K8s; preventing concurrent migration runs (advisory lock,
single-replica job); rollback strategies; the "no destructive migration
in a single deploy" rule.

### L34 · Feature flags · DEEP · ~50 min
Subtopics: flag types (boolean, multivariate, gradual rollout, targeted);
managed services (LaunchDarkly, ConfigCat, Statsig, Flagsmith, Vercel
Edge Config, Cloudflare's flag tools, open-source PostHog/Unleash);
self-hosted minimum (a database table works); flag hygiene (sunset
removed flags); A/B testing as a sibling pattern.

---

## Module 7.7 — Observability

### L35 · Logging vs metrics vs traces — the three pillars · STANDARD · ~40 min
What each is for; how they overlap; structured logs as the modern
default; the "observability is more than monitoring" mindset.

### L36 · Logs in production · DEEP · ~70 min
Subtopics: log to stdout, not files (12-factor); JSON output for parsing;
log aggregation (CloudWatch Logs, GCP Logging, Datadog, Loki + Grafana,
Elasticsearch + Kibana, Mezmo, Better Stack); log retention policies
(cost vs need); log sampling for high-volume events; PII redaction;
the "request ID in every log line" pattern; log levels in production
(INFO default, WARN for unusual, ERROR for actionable, DEBUG only when
investigating); structured fields (user_id, tenant_id, request_id,
trace_id); the "loguru / pino / winston / structlog" structured loggers.

### L37 · Metrics · DEEP · ~70 min
Subtopics: counter / gauge / histogram / summary; the RED method (Rate,
Errors, Duration); the USE method (Utilization, Saturation, Errors);
percentiles vs averages (always p50/p95/p99, never just mean); cardinality
management (don't put unbounded fields like user_id as a metric label);
Prometheus + Grafana as the OSS standard; managed (Datadog, New Relic,
Honeycomb, Grafana Cloud); the OpenTelemetry metrics API.

### L38 · Distributed tracing · DEEP · ~70 min
Subtopics: spans, traces, parents, children, attributes; W3C
tracecontext propagation header; OpenTelemetry SDKs (auto-instrumentation
for popular libs + manual span creation); sampling strategies (head,
tail, deterministic); backend options (Jaeger, Tempo, Honeycomb,
Datadog APM, AWS X-Ray); the "when latency is mysterious, traces beat
logs" principle.

### L39 · OpenTelemetry as the modern unification · DEEP · ~60 min
The CNCF-standard SDK + protocol (OTLP); auto-instrumentation libraries
per language; the Collector for receive / process / export; vendor-neutral
("export to whichever backend you want, switch later"); the "instrument
once, export everywhere" payoff.

### L40 · Alerting and on-call · STANDARD · ~50 min
Subtopics: alerts vs metrics — most metrics shouldn't page; alert design
(error budget, threshold, duration); page vs notify vs ticket tiers;
PagerDuty / Opsgenie / VictorOps; runbooks tied to alerts; the "if it
pages, it must be actionable" rule; alert fatigue and the SRE remediation.

### L41 · Synthetic monitoring and uptime · STANDARD · ~30 min
Pingdom / UptimeRobot / Better Uptime / Checkly — external probes of
your endpoints; the "alert when YOUR alerts can't reach you" backup
discipline.

### L42 · Error tracking · STANDARD · ~30 min
Sentry as the dominant choice; capturing errors with stack + breadcrumbs +
user/tenant context; release tracking; sourcemap upload (frontend);
on-call routing; integration with Slack/PagerDuty.

---

## Module 7.8 — Reliability engineering

### L43 · SLOs, SLIs, SLAs, error budgets · DEEP · ~60 min
Subtopics: SLI (the metric — e.g., success rate); SLO (the target — e.g.,
99.9% success); SLA (the contract — externally promised); error budget
(1 - SLO over a window); when error budget is exhausted, freeze releases
until reliability recovers; the "you can never be 100%" reality; the
trade-off with feature velocity.

References: Google SRE Workbook ch. 1-2.

### L44 · Incident management · DEEP · ~60 min
Subtopics: declaration; severity levels; incident commander role;
comms separated from investigation; the "stop the bleeding before
finding the cause" priority; status page communication; the timeline
captured; the postmortem (blameless); the action items must have owners
+ dates; major incident definition; the difference between investigation
and learning.

References: Google SRE Workbook ch. 9.

### L45 · Postmortems · STANDARD · ~40 min
The blameless culture; the timeline format; what to include (impact,
timeline, root cause(s), what went well, what didn't, action items);
the "don't blame humans — fix systems" stance.

### L46 · Backup and disaster recovery · STANDARD · ~60 min
Subtopics: RPO (recovery point objective) and RTO (recovery time
objective); 3-2-1 backup rule (3 copies, 2 media, 1 offsite); database
backups (covered in Phase 4 L31); the "test your restores" rule; DR
playbooks; multi-region for catastrophic-failure tolerance; cost-vs-
RPO/RTO trade-off.

### L47 · Chaos engineering · LIGHT · ~30 min
Awareness only. The "deliberately inject failure to test resilience"
practice. Netflix's Chaos Monkey heritage. When it's worth doing
(large stable systems with HA claims); when it isn't (small SaaS still
finding product-market fit).

---

## Module 7.9 — Security and secrets in production

### L48 · Secrets management at scale · DEEP · ~70 min
Subtopics: the rule: secrets never in source, never in environment YAML
in repos, never in unrestricted env vars; secrets in a vault (AWS
Secrets Manager, GCP Secret Manager, HashiCorp Vault, Doppler,
1Password); secrets fetched at startup or via sidecar; rotation; access
audit; least-privilege per service; sealed-secrets (encrypt secrets in
git, decrypt at deploy); SOPS for similar; external-secrets-operator
for K8s.

### L49 · Network security · DEEP · ~70 min
Subtopics: the public/private subnet split; security groups + NACLs;
egress filtering (your service should only call known endpoints);
VPC endpoints (private connection to AWS services, avoiding the public
internet); zero-trust network access (Tailscale, Cloudflare Access)
replacing VPN; the "least surface area" doctrine; the bastion host
pattern; what to expose vs not.

### L50 · TLS everywhere · STANDARD · ~50 min
Subtopics: free TLS (Let's Encrypt, AWS Certificate Manager, Cloudflare);
auto-renewal; the "TLS 1.2+ minimum" baseline; HSTS preload; mTLS for
service-to-service; certificate management.

### L51 · Supply chain security · STANDARD · ~50 min
Subtopics: dependency vulnerability scanning (Dependabot, Renovate,
Snyk); SBOM (Software Bill of Materials); SLSA framework levels;
signing artifacts (cosign, in-toto); pinning by hash for critical deps;
the "you are only as secure as your weakest dependency" reality.

### L52 · Compliance basics · LIGHT · ~30 min
Awareness: SOC 2, ISO 27001, HIPAA (US health), GDPR (EU privacy), CCPA
(California), PCI-DSS (payment cards); the "compliance is a long
project, not a checkbox" reality; the "Vanta / Drata / Secureframe" tools
for streamlining; when to start (usually when enterprise customers ask).

---

## Module 7.10 — Cost engineering

### L53 · The cost mindset · STANDARD · ~50 min
Subtopics: the FinOps idea (engineering-aware cost management); cost vs
revenue ratio (unit economics); cost allocation by tags/labels; the
"unexpected egress fees" (S3 to internet, cross-region transfers); the
"unused resources" disease (orphaned EBS volumes, idle ECS tasks,
forgotten Lambdas); rightsizing (instance / pod size); reserved /
savings plans for stable workloads; spot / preemptible for batch.

### L54 · Specific cost traps · DEEP · ~50 min
Subtopics: NAT Gateway egress ($/GB ouch); data transfer charges
(cross-AZ adds up); CloudFront egress vs S3 direct egress; RDS Multi-AZ
storage doubled; managed Postgres I/O fees; Datadog cardinality cost
explosion; Lambda + heavy CPU cost; over-provisioned K8s clusters; the
"check the bill weekly" discipline.

### L55 · Cost monitoring and alerting · STANDARD · ~30 min
AWS Cost Explorer / Budgets / Cost Anomaly Detection; GCP Billing Reports
and budgets; Vercel / Vercel usage; Vantage / Cloudability / Yotascale
as third-party FinOps tools.

---

## Phase 7 cross-thread coverage

- **Testing:** smoke tests in CI/CD; chaos light; integration with real
  managed services in staging.
- **Debugging:** logs, traces, metrics, eBPF for kernel-level (advanced).
- **Performance:** capacity planning, autoscaling, query budgets.
- **Security:** dominant theme — M7.9 dedicated, threads elsewhere.
- **AI-integration:** GPU instances on AWS (P/G family) for training;
  model serving with TGI / vLLM / Modal / Replicate / Anyscale; vector
  DB ops; the "AI inference is expensive — cache aggressively" reality.

---

## What Phase 7 doesn't cover (deferred)

- AI-specific infrastructure deep — Phase 8.
- Application security audit — Phase 9.
- Performance optimization deep — Phase 9.
