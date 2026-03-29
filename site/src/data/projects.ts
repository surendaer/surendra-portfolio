export type Project = {
  name: string;
  description: string;
  language: string;
  tags: string[];
  gitlabUrl: string;
  lastCommit: string;
};

export const projects: Project[] = [
  {
    name: "surendra-systems",
    description: "GitLab group namespace and entry point for all public engineering work. Index of all repositories, documentation, and architecture references.",
    language: "Markdown",
    tags: ["platform", "gitops"],
    gitlabUrl: "https://gitlab.com/surendaer",
    lastCommit: "2026-03-25",
  },
  {
    name: "surendra-portfolio",
    description: "This site. Python RSS scraper + Next.js static site. Auto-updated daily via GitLab CI, deployed to GitLab Pages at zero cost.",
    language: "Python / TypeScript",
    tags: ["python", "devops", "gitops"],
    gitlabUrl: "https://gitlab.com/surendaer/surendra-portfolio",
    lastCommit: "2026-03-25",
  },
  {
    name: "surendra-platform",
    description: "Platform engineering reference: ArgoCD GitOps with controller sharding, ApplicationSets, CASC for Jenkins, and automated Kubernetes DR via Velero + Ansible-Helm.",
    language: "YAML / Python",
    tags: ["kubernetes", "gitops", "platform"],
    gitlabUrl: "https://gitlab.com/surendaer/surendra-platform",
    lastCommit: "2026-03-01",
  },
  {
    name: "surendra-mlops",
    description: "MLOps platform reference: model CI/CD pipelines, artifact versioning, secure model deployment on Kubernetes. GenAI model serving and ML infrastructure on AWS/GCP.",
    language: "Python / YAML",
    tags: ["platform", "aws", "devops"],
    gitlabUrl: "https://gitlab.com/surendaer/surendra-mlops",
    lastCommit: "2026-02-15",
  },
  {
    name: "surendra-observability",
    description: "SRE observability stack: Prometheus, Grafana, Alertmanager with SLO burn-rate alerting, error budget dashboards, and on-call runbook templates.",
    language: "YAML",
    tags: ["sre", "kubernetes", "aws"],
    gitlabUrl: "https://gitlab.com/surendaer/surendra-observability",
    lastCommit: "2026-01-20",
  },
];
