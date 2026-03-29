export type WorkItem = {
  slug: string;
  title: string;
  subtitle: string;
  company: string;
  period: string;
  tags: string[];
  featured: boolean;
  placeholder: boolean;
  summary: string;
  results: { metric: string; label: string }[];
  techStack: string[];
};

// Reverse chronological order
export const workItems: WorkItem[] = [
  {
    slug: "pipeline-doctor-distributed-ci",
    title: "Distributed CI + Pipeline Doctor",
    subtitle: "An AI agent that detects, diagnoses, and fixes CI/CD failures autonomously — and raises the PR",
    company: "Walmart",
    period: "2023 – Present",
    tags: ["ai", "devops", "platform", "kubernetes"],
    featured: true,
    placeholder: false,
    summary:
      "Built Pipeline Doctor — an AI-powered orchestration system that hooks into GitHub Actions, GitLab CI, and Jenkins via webhooks, uses GPT-4 to analyse pipeline failures, generates context-aware code fixes, and automatically raises a Pull Request. Reduced mean time to fix from 30–60 minutes to under 3 minutes. Won Hackathon Runner-up at Walmart's internal Prompt-a-thon 2025.",
    results: [
      { metric: "< 3 min",   label: "Mean time to fix (was 30–60 min)" },
      { metric: "95%",       label: "Faster error resolution for handled failure classes" },
      { metric: "Runner-up", label: "Walmart Prompt-a-thon 2025 — AI-powered CI remediation" },
      { metric: "3",         label: "CI platforms integrated (GitHub Actions, GitLab CI, Jenkins)" },
    ],
    techStack: ["Python 3.11", "Flask", "Celery", "GPT-4 / Claude", "GitHub Actions", "GitLab CI", "Jenkins", "Docker", "Prometheus", "Redis", "GitHub API", "GitLab API"],
  },
  {
    slug: "rto-4-hours-to-7-minutes",
    title: "Distributed ArgoCD GitOps CD at Walmart Scale",
    subtitle: "6 ArgoCD instances · 18,000 applications — GitOps platform, cross-region DR, and zero-downtime v2.9 → v3.2 upgrade",
    company: "Walmart",
    period: "2025 – Present",
    tags: ["gitops", "kubernetes", "platform", "devops"],
    featured: true,
    placeholder: false,
    summary:
      "Owned ArgoCD as a managed internal platform for Walmart's Kubernetes fleet — 6 ArgoCD instances, each managing ~3,000 applications across multi-tenant, multi-region clusters. Three compounding outcomes: GitOps migration eliminating drift; automated cross-region DR reducing RTO from ~4 hours to ~7 minutes; zero-downtime upgrade from v2.9 to v3.2 navigating five breaking changes.",
    results: [
      { metric: "6 instances",   label: "ArgoCD — ~3,000 apps each, 18,000 apps total" },
      { metric: "4 hrs → 7 min", label: "RTO for cross-region ArgoCD and workload recovery" },
      { metric: "v2.9 → v3.2",   label: "Zero-downtime upgrade across multi-tenant and single-tenant clusters" },
      { metric: "0",             label: "Configuration drift incidents after GitOps model migration" },
      { metric: "5",             label: "Breaking changes navigated without platform downtime" },
      { metric: "90%",           label: "Reduction in manual intervention via automated finalizer ordering" },
    ],
    techStack: ["ArgoCD v2.9–v3.2", "Jenkins CASC", "Kubernetes (EKS, AKS)", "Velero", "Ansible", "Helm", "ApplicationSets", "Prometheus", "Grafana", "Terraform", "Python"],
  },
  {
    slug: "65k-downloads-per-minute",
    title: "Centralised Artifactory — 65,000 Downloads Per Minute",
    subtitle: "Global CI/CD artifact platform for 20,000+ engineers at Walmart",
    company: "Walmart",
    period: "2022 – 2024",
    tags: ["platform", "aws", "devops", "kubernetes"],
    featured: true,
    placeholder: false,
    summary:
      "Scaled Walmart's CI/CD artifact platform to handle 65,000+ downloads/min by introducing global edge distribution across AWS, Azure, and GCP. Reduced build and deployment latency by ~60% for 20,000+ engineers worldwide.",
    results: [
      { metric: "65,000+",  label: "Artifact downloads per minute at peak" },
      { metric: "~60%",     label: "Reduction in build and deployment latency" },
      { metric: "20,000+",  label: "Engineers served globally" },
      { metric: "3 clouds", label: "AWS · Azure · GCP regional edge nodes" },
      { metric: "0",        label: "Global cascading failures from single-region outages" },
    ],
    techStack: ["AWS", "Azure", "GCP", "JFrog Artifactory", "Kubernetes (EKS/AKS/GKE)", "Prometheus", "Grafana", "Terraform", "Helm"],
  },
  {
    slug: "encoding-ops-into-the-platform",
    title: "Encoding Ops Into the Platform",
    subtitle: "Level-3 OpenShift Kubernetes Operator eliminating manual AEM toil at a global digital experience client",
    company: "IBM",
    period: "2020 – 2021",
    tags: ["kubernetes", "platform", "devops"],
    featured: true,
    placeholder: false,
    summary:
      "Built a Level-3 Kubernetes Operator encoding a global digital experience client's full AEM operational lifecycle — install, scale, backup, recover. ~40% reduction in non-production cloud costs. Zero ticket-driven deployments.",
    results: [
      { metric: "~40%",        label: "Reduction in non-production cloud costs" },
      { metric: "Level-3",     label: "Operator capability — Full Lifecycle" },
      { metric: "0 tickets",   label: "Required for AEM deployment, scaling, and recovery" },
      { metric: "Multi-region", label: "HA with Tekton pipeline + backup and restoration" },
      { metric: "On-demand",   label: "Dev/Test environment provisioning (was ticket-driven)" },
    ],
    techStack: ["Red Hat OpenShift", "Kubernetes Operators (Level-3)", "Tekton", "AWS", "IBM Cloud (ROKS)", "Terraform", "Ansible", "Helm", "Python"],
  },
  {
    slug: "zero-downtime-for-fintech",
    title: "Zero Downtime for Fintech",
    subtitle: "Lead DevSecOps Consultant — Bendigo Bank, QBE Insurance, Westpac Bank",
    company: "IBM",
    period: "2019 – 2020",
    tags: ["devops", "platform", "devsecops"],
    featured: false,
    placeholder: false,
    summary:
      "Led the redesign of CI/CD operating models for three major Australian financial institutions. Delivered GitLab HA/DR platform with standardised pipeline templates meeting strict regulatory and availability requirements.",
    results: [
      { metric: "3",        label: "Major Australian financial institutions modernised" },
      { metric: "HA/DR",    label: "GitLab with active-passive DR across AZs" },
      { metric: "100%",     label: "Pipelines with embedded security and quality gates" },
      { metric: "0",        label: "Business disruption during platform cutover" },
      { metric: "Org-wide", label: "Pipeline template adoption after evaluation and testing" },
    ],
    techStack: ["GitLab (HA/DR)", "AWS", "IBM Cloud", "API Connect", "Terraform", "Ansible", "Docker", "Kubernetes", "DevSecOps"],
  },
  {
    slug: "devops-templating-platform",
    title: "DevOps Templating Platform",
    subtitle: "Platform foundations — DevOps toolchain, pipeline templates, and IBM Liberty projects",
    company: "IBM",
    period: "2015 – 2019",
    tags: ["devops", "platform"],
    featured: false,
    placeholder: true,
    summary: "Details coming soon.",
    results: [],
    techStack: ["IBM Liberty", "Jenkins", "Ansible", "DevOps"],
  },
];
