// Key names MUST match the Spline scene objects exactly.
// Labels and descriptions are remapped to Surendra's actual DevOps / Platform / GenAI stack.
export enum SkillNames {
  // Fixed — key names already match the tool
  DOCKER  = "docker",
  AWS     = "aws",
  GCP     = "gcp",
  LINUX   = "linux",
  GITLAB  = "git",       // key is named "git" in the scene
  GITHUB  = "github",
  NGINX   = "nginx",
  // Remapped — key icon is something else but we rename the meaning
  KUBERNETES    = "nextjs",    // was Next.js
  ARGOCD        = "react",     // was React
  AZURE         = "vue",       // was Vue
  HELM          = "tailwind",  // was Tailwind
  TERRAFORM     = "nodejs",    // was Node.js
  ANSIBLE       = "express",   // was Express
  PYTHON        = "ts",        // was TypeScript
  TEKTON        = "js",        // was JavaScript
  JENKINS       = "html",      // was HTML
  OPENSHIFT     = "css",       // was CSS
  PROMETHEUS    = "prettier",  // was Prettier
  GRAFANA       = "mongodb",   // was MongoDB
  VELERO        = "postgres",  // was PostgreSQL
  JFROG         = "npm",       // was NPM
  VAULT         = "vim",       // was Vim
  SPLUNK        = "firebase",  // was Firebase
  CROSSPLANE    = "wordpress", // was WordPress
  IBMCLOUD      = "vercel",    // was Vercel
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Record<SkillNames, Skill> = {
  // ── Fixed keys ──────────────────────────────────────────────────────────────
  [SkillNames.DOCKER]: {
    id: 1, name: "docker", label: "Docker",
    shortDescription: "Container runtime powering every pipeline at Walmart scale",
    color: "#2496ed",
    icon: "/assets/icons/docker.svg",
  },
  [SkillNames.AWS]: {
    id: 2, name: "aws", label: "AWS",
    shortDescription: "Multi-region cloud backbone — EC2, EKS, S3, IAM, and beyond",
    color: "#ff9900",
    icon: "/assets/icons/aws.svg",
  },
  [SkillNames.GCP]: {
    id: 3, name: "gcp", label: "Google Cloud",
    shortDescription: "GKE, GCS, Cloud Run — multi-cloud edge nodes for 65k/min artifact delivery",
    color: "#4285f4",
    icon: "/assets/icons/gcp.svg",
  },
  [SkillNames.LINUX]: {
    id: 4, name: "linux", label: "Linux",
    shortDescription: "chmod 777 is never the answer — but here we are",
    color: "#fcc624",
    icon: "/assets/icons/linux.svg",
  },
  [SkillNames.GITLAB]: {
    id: 5, name: "git", label: "GitLab",
    shortDescription: "HA/DR GitLab pipelines for Bendigo Bank, QBE, Westpac & Walmart",
    color: "#fc6d26",
    icon: "/assets/icons/gitlab.svg",
  },
  [SkillNames.GITHUB]: {
    id: 6, name: "github", label: "GitHub",
    shortDescription: "Actions, GHCR, and this very portfolio — open-source and inner-source",
    color: "#e6edf3",
    icon: "/assets/icons/github.svg",
  },
  [SkillNames.NGINX]: {
    id: 7, name: "nginx", label: "Nginx",
    shortDescription: "Ingress controller and reverse proxy for K8s multi-tenant traffic",
    color: "#009639",
    icon: "/assets/icons/nginx.svg",
  },
  // ── Remapped keys ────────────────────────────────────────────────────────────
  [SkillNames.KUBERNETES]: {
    id: 8, name: "nextjs", label: "Kubernetes",
    shortDescription: "Multi-tenant, multi-region clusters — 18,000 ArgoCD-managed workloads",
    color: "#326ce5",
    icon: "/assets/icons/kubernetes.svg",
  },
  [SkillNames.ARGOCD]: {
    id: 9, name: "react", label: "ArgoCD",
    shortDescription: "6 instances × ~3,000 apps — GitOps CD platform at Walmart scale",
    color: "#ef7b4d",
    icon: "/assets/icons/argocd.svg",
  },
  [SkillNames.AZURE]: {
    id: 10, name: "vue", label: "Azure",
    shortDescription: "AKS, Azure Blob, ADO — cloud layer in the 3-cloud artifact platform",
    color: "#0078d4",
    icon: "/assets/icons/azure.svg",
  },
  [SkillNames.HELM]: {
    id: 11, name: "tailwind", label: "Helm",
    shortDescription: "Package manager for K8s — templated releases across 3 clouds",
    color: "#0f1689",
    icon: "/assets/icons/helm.svg",
  },
  [SkillNames.TERRAFORM]: {
    id: 12, name: "nodejs", label: "Terraform",
    shortDescription: "IaC for multi-cloud infra — modules, workspaces, remote state",
    color: "#7b42bc",
    icon: "/assets/icons/terraform.svg",
  },
  [SkillNames.ANSIBLE]: {
    id: 13, name: "express", label: "Ansible",
    shortDescription: "Config management and Helm orchestration across bare-metal and cloud",
    color: "#ee0000",
    icon: "/assets/icons/ansible.svg",
  },
  [SkillNames.PYTHON]: {
    id: 14, name: "ts", label: "Python 3",
    shortDescription: "Pipeline Doctor agent, scraper, operators — the glue holding infra together",
    color: "#3776ab",
    icon: "/assets/icons/python.svg",
  },
  [SkillNames.TEKTON]: {
    id: 15, name: "js", label: "Tekton",
    shortDescription: "Kubernetes-native CI — pipeline-as-code for cloud-native workloads",
    color: "#fd495c",
    icon: "/assets/icons/tekton.svg",
  },
  [SkillNames.JENKINS]: {
    id: 16, name: "html", label: "Jenkins",
    shortDescription: "IBM templating platform foundations — shared libraries, DSL pipelines",
    color: "#d33833",
    icon: "/assets/icons/jenkins.svg",
  },
  [SkillNames.OPENSHIFT]: {
    id: 17, name: "css", label: "OpenShift",
    shortDescription: "Level-3 Kubernetes Operator on OpenShift — AEM lifecycle automation",
    color: "#ee0000",
    icon: "/assets/icons/openshift.svg",
  },
  [SkillNames.PROMETHEUS]: {
    id: 18, name: "prettier", label: "Prometheus",
    shortDescription: "Metrics collection across 18,000 workloads — SLO alerting backbone",
    color: "#e6522c",
    icon: "/assets/icons/prometheus.svg",
  },
  [SkillNames.GRAFANA]: {
    id: 19, name: "mongodb", label: "Grafana",
    shortDescription: "Dashboards for ArgoCD sync lag, artifact download rates, pipeline MTTR",
    color: "#f46800",
    icon: "/assets/icons/grafana.svg",
  },
  [SkillNames.VELERO]: {
    id: 20, name: "postgres", label: "Velero",
    shortDescription: "K8s backup & cross-region DR — RTO from 4 hours to 7 minutes",
    color: "#40b3ff",
    icon: "/assets/icons/velero.svg",
  },
  [SkillNames.JFROG]: {
    id: 21, name: "npm", label: "JFrog Artifactory",
    shortDescription: "65,000 downloads/min at Walmart holiday peak — global edge distribution",
    color: "#40be46",
    icon: "/assets/icons/jfrog.svg",
  },
  [SkillNames.VAULT]: {
    id: 22, name: "vim", label: "HashiCorp Vault",
    shortDescription: "Secrets management and dynamic credentials across multi-cloud K8s",
    color: "#ffcf25",
    icon: "/assets/icons/vault.svg",
  },
  [SkillNames.SPLUNK]: {
    id: 23, name: "firebase", label: "Splunk",
    shortDescription: "Enterprise log aggregation and security event correlation",
    color: "#65a637",
    icon: "/assets/icons/splunk.svg",
  },
  [SkillNames.CROSSPLANE]: {
    id: 24, name: "wordpress", label: "Crossplane",
    shortDescription: "Control-plane IaC — cloud resources as K8s custom resources",
    color: "#ef3e50",
    icon: "/assets/icons/crossplane.svg",
  },
  [SkillNames.IBMCLOUD]: {
    id: 25, name: "vercel", label: "IBM Cloud",
    shortDescription: "IKS, IBM Liberty, DevOps toolchains — 4 years of enterprise platform work",
    color: "#1261fe",
    icon: "/assets/icons/ibmcloud.svg",
  },
};
