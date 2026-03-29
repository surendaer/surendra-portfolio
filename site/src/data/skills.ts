// Icon names must exactly match a file in /public/assets/icons/{name}.svg
// Available: akeyless ansible argocd aws azure backstage datadog docker
//            finops gcp github gitlab grafana helm ibmcloud istio jenkins jfrog
//            kafka kubeflow kubernetes linux mcp mlflow new-relic nginx
//            openshift opentelemetry packer postgresql prometheus python
//            rancher snyk splunk tekton terraform vagrant velero

export type SkillItem = {
  label: string;
  icon?: string;
};

export type SkillGroup = {
  category: string;
  emoji: string;
  items: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    // Priority order — methodology → *Ops disciplines → rare credential → platform scope → topology
    category: "Engineering Practices",
    emoji: "🎯",
    items: [
      { label: "Agile / Scrum"                                       },
      { label: "DevOps Advocate / Consulting"                        },
      { label: "Gap Analysis & Roadmapping"                          },
      { label: "DevSecOps",              icon: "snyk"               },
      { label: "GitOps",                 icon: "argocd"             },
      { label: "MLOps",                  icon: "mlflow"             },
      { label: "FinOps",                 icon: "finops"             },
      { label: "AIOps / XOps"                                        },
      { label: "Kubernetes Operators (Level-3)", icon: "kubernetes" },
      { label: "Platform Engineering"                                },
      { label: "SRE"                                                 },
      { label: "Platform Modernisation"                              },
      { label: "On-prem · Cloud · Hybrid"                            },
      { label: "BCDR · RTO / RPO"                                    },
    ],
  },
  {
    // Icon items A→Z, then text-only A→Z
    category: "GenAI & ML Infrastructure",
    emoji: "🤖",
    items: [
      { label: "Kafka",                   icon: "kafka"    },
      { label: "Kubeflow",                icon: "kubeflow" },
      { label: "MCP",                     icon: "mcp"      },
      { label: "MLflow",                  icon: "mlflow"   },
      { label: "AI-powered Operations"                     },
      { label: "GenAI Platform Architecture"               },
      { label: "Model Serving"                             },
      { label: "Prompt Engineering"                        },
    ],
  },
  {
    // Icon items A→Z
    category: "Platform & Cloud",
    emoji: "☁️",
    items: [
      { label: "AWS",       icon: "aws"       },
      { label: "Azure",     icon: "azure"     },
      { label: "Backstage", icon: "backstage" },
      { label: "GCP",       icon: "gcp"       },
      { label: "IBM Cloud", icon: "ibmcloud"  },
      { label: "OpenShift", icon: "openshift" },
      { label: "Rancher",   icon: "rancher"   },
    ],
  },
  {
    // Icon items A→Z, then text-only A→Z
    category: "Platform Engineering & CI/CD",
    emoji: "⚙️",
    items: [
      { label: "ArgoCD",                icon: "argocd"     },
      { label: "Docker",                icon: "docker"     },
      { label: "GitHub Actions",        icon: "github"     },
      { label: "GitLab CI",             icon: "gitlab"     },
      { label: "Helm",                  icon: "helm"       },
      { label: "Jenkins",               icon: "jenkins"    },
      { label: "JFrog Artifactory",     icon: "jfrog"      },
      { label: "Kubernetes",            icon: "kubernetes" },
      { label: "Tekton",                icon: "tekton"     },
      { label: "Developer Experience (DevEx)"              },
    ],
  },
  {
    // Icon items A→Z, then text-only A→Z
    category: "Observability & Security",
    emoji: "🔭",
    items: [
      { label: "Akeyless",      icon: "akeyless"      },
      { label: "Datadog",       icon: "datadog"       },
      { label: "Grafana",       icon: "grafana"       },
      { label: "New Relic",     icon: "new-relic"     },
      { label: "OpenTelemetry", icon: "opentelemetry" },
      { label: "Prometheus",    icon: "prometheus"    },
      { label: "Snyk",          icon: "snyk"          },
      { label: "Splunk",        icon: "splunk"        },
      { label: "Velero",        icon: "velero"        },
      { label: "Policy-as-Code"                       },
    ],
  },
  {
    // Icon items A→Z, then text-only A→Z
    category: "Infrastructure & Automation",
    emoji: "🏗️",
    items: [
      { label: "Ansible",            icon: "ansible"   },
      { label: "Istio",              icon: "istio"     },
      { label: "Linux",              icon: "linux"     },
      { label: "Nginx",              icon: "nginx"     },
      { label: "Packer",             icon: "packer"    },
      { label: "Python",             icon: "python"    },
      { label: "Shell Scripting (Bash)", icon: "linux" },
      { label: "Terraform",          icon: "terraform" },
      { label: "Vagrant",            icon: "vagrant"   },
      { label: "Autoscaling"                           },
    ],
  },
];

export const certifications = [
  { name: "SysOps Administrator",         issuer: "AWS",       icon: "aws"   },
  { name: "Administrator Associate",      issuer: "Microsoft", icon: "azure" },
  { name: "DevOps Engineer Expert",       issuer: "Microsoft", icon: "azure" },
  { name: "Professional Cloud Architect", issuer: "Google",    icon: "gcp"   },
  { name: "Professional DevOps Engineer", issuer: "Google",    icon: "gcp"   },
];
