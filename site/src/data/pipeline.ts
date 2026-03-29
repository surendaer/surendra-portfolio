// Each stage maps to a node on the DevOps infinity loop background.
// Row 0 = top rail (left→right): Plan → Code → Build → Test → Secure
// Row 1 = bottom rail (right→left): Artifact → Deploy → Infra → Observe → Feedback

export type BadgeType = "security" | "culture" | "process";

export type PipelineStage = {
  id: string;
  label: string;
  tools: string[];
  icons: string[];        // filenames in /public/assets/icons/ (no extension)
  color: string;
  row: 0 | 1;
  pos: number;            // 0–4 within the row
  badge?: string;
  badgeType?: BadgeType;
  description: string;
};

export const STAGES: PipelineStage[] = [
  // ── Top rail (left → right) ──────────────────────────────────────────────
  {
    id: "plan",
    label: "Plan",
    tools: ["GitLab Issues", "Agile", "Scrum", "ADRs"],
    icons: ["gitlab"],
    color: "#4ade80",
    row: 0, pos: 0,
    description: "Backlog, sprint planning, architecture decision records",
  },
  {
    id: "code",
    label: "Code",
    tools: ["GitLab", "GitHub", "Branch Strategy", "MR Reviews"],
    icons: ["gitlab", "github"],
    color: "#4ade80",
    row: 0, pos: 1,
    badge: "Shift Left Security",
    badgeType: "process",
    description: "Source control, inner-source patterns, protected branches",
  },
  {
    id: "build",
    label: "Build",
    tools: ["Tekton", "Jenkins", "GitLab CI", "Docker"],
    icons: ["tekton", "jenkins", "gitlab", "docker"],
    color: "#22d3ee",
    row: 0, pos: 2,
    description: "Pipeline-as-code, container builds, shared libraries",
  },
  {
    id: "test",
    label: "Test",
    tools: ["Unit", "Integration", "Contract", "Pipeline Doctor"],
    icons: ["python"],
    color: "#22d3ee",
    row: 0, pos: 3,
    description: "AI-driven MTTR < 3 min — self-healing pipeline diagnostics",
  },
  {
    id: "secure",
    label: "Secure",
    tools: ["Snyk", "Vault", "Akeyless", "IaC Scan"],
    icons: ["snyk", "vault", "akeyless"],
    color: "#f87171",
    row: 0, pos: 4,
    badge: "DevSecOps — security is a culture, not a gate",
    badgeType: "security",
    description: "SAST, SCA, secrets management, container scanning",
  },
  // ── Bottom rail (right → left, rendered pos 0=right) ────────────────────
  {
    id: "artifact",
    label: "Artifact",
    tools: ["JFrog Artifactory", "65k downloads/min", "3 clouds"],
    icons: ["jfrog"],
    color: "#f87171",
    row: 1, pos: 4,
    description: "Peak Walmart holiday load — 20,000+ engineers, 3-cloud edge",
  },
  {
    id: "deploy",
    label: "Deploy",
    tools: ["ArgoCD", "Helm", "Crossplane", "6 instances"],
    icons: ["argocd", "helm", "crossplane"],
    color: "#60a5fa",
    row: 1, pos: 3,
    badge: "GitOps — git is the source of truth",
    badgeType: "culture",
    description: "18,000 ArgoCD-managed workloads across 6 instances",
  },
  {
    id: "infra",
    label: "Infra",
    tools: ["Terraform", "Ansible", "Kubernetes", "OpenShift"],
    icons: ["terraform", "ansible", "kubernetes", "openshift"],
    color: "#60a5fa",
    row: 1, pos: 2,
    description: "Multi-cloud IaC, Level-3 K8s Operators, on-prem + cloud",
  },
  {
    id: "observe",
    label: "Observe",
    tools: ["Prometheus", "Grafana", "Datadog", "OpenTelemetry"],
    icons: ["prometheus", "grafana", "datadog", "opentelemetry"],
    color: "#fbbf24",
    row: 1, pos: 1,
    badge: "SRE — SLOs over heroics · error budgets over blame",
    badgeType: "culture",
    description: "Full-stack observability — metrics, traces, logs, dashboards",
  },
  {
    id: "feedback",
    label: "Feedback",
    tools: ["Splunk", "New Relic", "Postmortems", "FinOps"],
    icons: ["splunk", "new-relic"],
    color: "#fbbf24",
    row: 1, pos: 0,
    badge: "FinOps — every cloud dollar has an owner",
    badgeType: "process",
    description: "Blameless postmortems, cost attribution, continuous improvement",
  },
];

// Which stages to highlight per page section
export const SECTION_HIGHLIGHT: Record<string, string[]> = {
  hero:     [],
  skills:   ["build", "secure", "deploy", "infra"],
  work:     ["deploy", "infra", "observe", "artifact"],
  projects: ["code", "build", "test", "plan"],
  contact:  ["feedback"],
};
