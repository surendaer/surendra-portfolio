"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Shared signal ──────────────────────────────────────────────────────────
type Signal = { name: string; label: string; shortDescription: string; color: string; icon: string } | null;
const _listeners = new Set<(s: Signal) => void>();
let _sig: Signal = null;
export function useSelectedSkill() {
  const [s, setS] = useState<Signal>(null);
  useEffect(() => {
    setS(_sig);
    _listeners.add(setS);
    return () => { _listeners.delete(setS); };
  }, []);
  return s;
}
const emit = (s: Signal) => { _sig = s; _listeners.forEach(f => f(s)); };

// ── Canvas ─────────────────────────────────────────────────────────────────
const W = 1000, H = 600;
const FRAME_PATH = "M 20,20 L 980,20 L 980,580 L 20,580 L 20,20";

// ── freeZone: nodes on the RIGHT rail + BOTTOM arc.
// These are NOT behind the hero text / content blocks, so they stay bright
// even when inContent dims the rest.
// Rule: x > 580 OR y > 420  →  free zone
type Node = {
  id: string; label: string; x: number; y: number;
  color: string; icon: string; description: string;
  cluster?: string;
  freeZone: boolean;
};

// CI frame nodes sit in a horizontal band at y=230 — between the Intelligence
// Layer (y=145) and the DevSecOps gate (y=300). This makes the CI pipeline the
// prominent focal element of Phase 1 without overlapping any mesh nodes.
// Phase 2+: dev/test cluster phaseDim(0.08) makes them nearly invisible → no
// Phase 3 impact; Phase 3 tree and mesh positions are completely unchanged.
const FRAME_NODES: Node[] = [
  { id:"plan",     label:"Plan",     x:130,  y:230, color:"#2684FF", icon:"jira",      description:"Backlog · sprint planning · issue tracking",               cluster:"dev",       freeZone:false },
  { id:"code",     label:"Code",     x:310,  y:230, color:"#FC6D26", icon:"gitlab",    description:"Source control · branch strategy · MR reviews",            cluster:"dev",       freeZone:false },
  { id:"build",    label:"Build",    x:490,  y:230, color:"#2496ED", icon:"docker",    description:"Multi-stage Docker build · immutable container images",     cluster:"test",      freeZone:false },
  { id:"test",     label:"Test",     x:670,  y:230, color:"#f87171", icon:"python",    description:"Unit · integration · AI-driven MTTR < 3 min",               cluster:"test",      freeZone:true  },
  { id:"secure",   label:"Scan",     x:850,  y:230, color:"#dc2626", icon:"snyk",      description:"IaC scan (tfsec · Checkov) · SAST · dependency CVE scanning",cluster:"devsecops", freeZone:true  },
  // Artifact drops below the CI row — represents the finalized build artefact
  // handed off to ArgoCD for GitOps deployment (visible in Phase 3)
  { id:"artifact", label:"Artifact", x:850,  y:390, color:"#22c55e", icon:"jfrog",     description:"65k downloads/min — JFrog at Walmart peak",                 cluster:"gitops",    freeZone:true  },
  { id:"infra",    label:"Grafana",  x:500,  y:580, color:"#F46800", icon:"grafana",   description:"Dashboards — observability · MTTR · SLO tracking",          cluster:"sre",       freeZone:true  },
  { id:"observe",  label:"Loki",     x:900,  y:580, color:"#F8B91E", icon:"loki",      description:"Log aggregation · Grafana LGTM stack · traces",             cluster:"sre",       freeZone:true  },
  { id:"feedback", label:"Feedback", x:20,   y:435, color:"#fbbf24", icon:"backstage", description:"Blameless postmortems · FinOps · improvement loop",         cluster:"sre",       freeZone:false },
];

// ── IBM Garage Method — three-band layout ─────────────────────────────────
//
//  COLUMNS (x):   Col-A=250   Col-B=500   Col-C=750
//  Spacing between cols: 250 units (≈25× node radius) — zero overlap possible
//
//  TOP BAND    y=145   mlflow      kubeflow    kafka       (Intelligence Layer)
//
//  MID BAND    y=300   snyk        vault       akeyless    (Secure Frame — hard gate)
//
//  BOTTOM BAND  Left side                   SRE cluster         GitOps 3×2 matrix
//  y=420        tf(175)   datadog(375)       crossplane(570) argocd(730) openshift(890)
//  y=530                  grafana(375)  prom(455)  k8s(570)  helm(730)   rancher(890)
//
//  GitOps matrix columns (x): 570  730  890  — spacing 160 units
//  Col-A: Crossplane / K8s   (infrastructure layer)
//  Col-B: ArgoCD / Helm      (delivery layer)
//  Col-C: OpenShift / Rancher (enterprise platform layer)
//
//  Bottom band verified against frame nodes:
//    argocd(730,420) → deploy-frame(855,580): dist=~190 ✓
//    helm(730,510)   → deploy-frame(855,580): dist=~160 ✓
//    prom(455,510)   → observe-frame(455,580): dist=70 ✓ (direct vertical)
//    tf(175,420)     → feedback-frame(20,435): dist=~160 ✓

const MESH_NODES: Node[] = [
  // ── TOP BAND y=145 — Intelligence Layer (AIOps / MLOps) ─────────────────
  // 4 nodes evenly spaced: x=175, 400, 600, 825  (spacing ~200 units)
  { id:"mlflow-m",    label:"MLflow",     x:175, y:145, color:"#e2e8f0", icon:"mlflow",     description:"Experiment tracking · model registry",        cluster:"mlops",     freeZone:false },
  { id:"kubeflow",    label:"Kubeflow",   x:400, y:145, color:"#e2e8f0", icon:"kubeflow",   description:"ML pipeline orchestration on Kubernetes",     cluster:"mlops",     freeZone:false },
  { id:"mcp-m",       label:"MCP",        x:600, y:145, color:"#e2e8f0", icon:"mcp",        description:"Model Context Protocol · AI agent tool integration", cluster:"mlops", freeZone:true  },
  { id:"kafka-m",     label:"Kafka",      x:825, y:145, color:"#e2e8f0", icon:"kafka",      description:"Event streaming for ML feature pipelines",    cluster:"mlops",     freeZone:true  },

  // ── MID BAND y=300 — Secure Frame (hard gate: Code → Deploy) ────────────
  { id:"snyk-m",      label:"Snyk",       x:250, y:300, color:"#f87171", icon:"snyk",       description:"SAST · SCA · container & IaC scanning",      cluster:"devsecops", freeZone:false },
  { id:"vault-m",     label:"Vault",      x:500, y:300, color:"#f87171", icon:"vault",      description:"Secrets management · dynamic credentials",    cluster:"devsecops", freeZone:false },
  { id:"akeyless-m",  label:"Akeyless",   x:750, y:300, color:"#f87171", icon:"akeyless",   description:"Cloud-native secrets · PKI at scale",         cluster:"devsecops", freeZone:true  },

  // ── BOTTOM BAND — Foundation Layer (Platform · SRE · GitOps) ────────────
  //
  //  x=80  x=175  x=375  x=575  x=775
  //  AWS   Tf     Datadog Cross  ArgoCD   y=420
  //  GCP           (gap between cloud col and IaC col = 95 units)
  //  Azure  K8s   Grafana Prom   Helm     y=510  (azure≈515)
  //
  // Cloud targets column (x=80) — between feedback-frame(20,435) and IaC column(175)
  { id:"aws-m",       label:"AWS",        x:80,  y:415, color:"#f97316", icon:"aws",        description:"EKS · ECS · Lambda · S3 — primary cloud",    cluster:"platform",  freeZone:true  },
  { id:"gcp-m",       label:"GCP",        x:80,  y:465, color:"#eab308", icon:"gcp",        description:"GKE · GCS · BigQuery · Vertex AI",            cluster:"platform",  freeZone:true  },
  { id:"azure-m",     label:"Azure",      x:80,  y:515, color:"#0078d4", icon:"azure",      description:"AKS · ACR · Azure DevOps Pipelines",          cluster:"platform",  freeZone:true  },
  // IaC column (x=175) — Terraform anchor
  { id:"tf-m",        label:"Terraform",  x:175, y:420, color:"#c4b5fd", icon:"terraform",  description:"IaC — modules · workspaces · remote state",  cluster:"platform",  freeZone:true  },
  // SRE / Observe columns (x=375, x=455)
  // Prometheus moves to x=455 to make room for the clean GitOps matrix starting at x=570
  { id:"datadog-m",   label:"Datadog",    x:375, y:420, color:"#632CA6", icon:"datadog",    description:"APM · distributed tracing at Walmart scale", cluster:"sre",       freeZone:true  },
  { id:"grafana-m",   label:"Splunk",     x:375, y:530, color:"#65a637", icon:"splunk",     description:"Log analytics · SIEM · unified observability", cluster:"sre",       freeZone:true  },
  { id:"prom-m",      label:"Prometheus", x:100, y:580, color:"#f59e0b", icon:"prometheus", description:"Metrics collection · SLO alerting backbone", cluster:"sre",       freeZone:true  },
  //
  // ── GitOps / Platform 3×2 matrix ─────────────────────────────────────────
  //
  //   Col-A  x=570    Col-B  x=730    Col-C  x=890
  //   ──────────────────────────────────────────────
  //   Crossplane       ArgoCD          OpenShift     y=420  (deploy tools row)
  //   Kubernetes       Helm            Rancher        y=530  (runtime platforms row)
  //
  //  • Crossplane + K8s: infrastructure pair (GitOps-managed cloud resources)
  //  • ArgoCD + Helm:    delivery pair (release engine)
  //  • OpenShift + Rancher: enterprise platform pair
  //  Inter-column spacing = 160 units.  Inter-row spacing = 110 units.
  //
  { id:"crossplane-m",label:"Crossplane", x:570, y:420, color:"#4ade80", icon:"crossplane", description:"Cloud resources as K8s custom resources",     cluster:"gitops",    freeZone:true  },
  { id:"argocd-m",    label:"ArgoCD",     x:730, y:420, color:"#4ade80", icon:"argocd",     description:"GitOps CD — git as single source of truth",  cluster:"gitops",    freeZone:true  },
  { id:"openshift-m", label:"OpenShift",  x:890, y:420, color:"#f87171", icon:"openshift",  description:"Enterprise Kubernetes · OpenShift clusters",  cluster:"gitops",    freeZone:true  },
  { id:"k8s-m",       label:"Kubernetes", x:570, y:530, color:"#60a5fa", icon:"kubernetes", description:"Multi-tenant · multi-region clusters",        cluster:"platform",  freeZone:true  },
  { id:"helm-m",      label:"Helm",       x:730, y:530, color:"#4ade80", icon:"helm",       description:"K8s package manager — templated releases",   cluster:"gitops",    freeZone:true  },
  { id:"rancher-m",   label:"Rancher",    x:870, y:505, color:"#4ade80", icon:"rancher",    description:"Multi-cluster K8s management · RKE",          cluster:"platform",  freeZone:true  },
];

const ALL_NODES = [...FRAME_NODES, ...MESH_NODES];
// Proximity: ambient glow only — never scales the node.
// Hover (active): intentional interaction — scales + glows.
// Tight radius prevents accidental triggers while mouse passes over content.
const PROX_RADIUS  = 44;   // was 72 — reduced so only deliberate near-hover activates
const HOVER_RADIUS = 22;   // was 28 — tighter direct-hit target

// ── Branch wiring — IBM Garage Method flow ────────────────────────────────
//
//  Intelligence Layer: build-frame fans out to all three MLOps nodes
//  Secure Frame:       secure-frame sweeps LEFT as a horizontal gate bar
//  Foundation Layer:   bottom rail connects up into 4-column grid
//  Cross-links:        Snyk→Tf (IaC scanning) · Akeyless→ArgoCD (secrets gate)
//  Feedback loop:      feedback-frame → Platform chain (Garage: Co-operate → re-inform Plan)

const BRANCHES: Array<{ d: string; color: string; cluster: string; freeZone: boolean }> = [
  // Intelligence Layer: build-frame(495,20) → kubeflow(400,145), then horizontal spine 175→825
  { d:"M 495,20 L 400,145 M 175,145 L 825,145",                         color:"#e2e8f0", cluster:"mlops",     freeZone:false },

  // Secure gate: Scan frame node (850,230) → akeyless(750,300) → vault(500,300) → snyk(250,300)
  // Reads right-to-left — security sweeps inward as a hard gate across the full width
  { d:"M 864,230 L 750,300 M 750,300 L 500,300 M 500,300 L 250,300",    color:"#f87171", cluster:"devsecops", freeZone:false },

  // GitOps: full 3×2 grid mesh — deploy-frame anchors col-B, fans left to col-A and right to col-C
  //
  //   col-A(570)   col-B(730)   col-C(890)
  //   Crossplane ── ArgoCD ── OpenShift    y=420  (row-1 horizontal spine)
  //       │             │           │
  //   Kubernetes ──  Helm  ── Rancher      y=530  (row-2 horizontal — "middle green" connector)
  //
  //  deploy-frame(855,580) enters via helm(730,530), then branches to all 3 columns in both rows.
  { d:"M 855,580 L 730,530 M 730,530 L 730,420 M 730,420 L 570,420 M 730,420 L 890,420 M 570,420 L 570,530 M 890,420 L 870,505 M 570,530 L 870,505", color:"#4ade80", cluster:"gitops",    freeZone:true  },

  // SRE: observe-frame(900,580) → splunk(805,545) → datadog(195,545)
  { d:"M 900,580 L 900,545 M 900,545 L 805,545 M 805,545 L 195,545", color:"#9B59B6", cluster:"sre", freeZone:true },

  // Platform: feedback-frame(20,435) → cloud-col(80) → IaC-col(175)
  // Vertical cloud rail: aws(80,415) → gcp(80,465) → azure(80,515)
  { d:"M 20,435 L 80,415 M 80,415 L 80,515 M 80,415 L 175,420",               color:"#a78bfa", cluster:"platform", freeZone:false },

  // Cross: snyk(250,300) ↘ tf(175,420) — security scans IaC before provisioning
  { d:"M 250,300 L 175,420",                                             color:"#6b7280", cluster:"cross",     freeZone:false },

  // Cross: akeyless(750,300) ↘ argocd(730,420) — secrets gate before GitOps deploy
  { d:"M 750,300 L 730,420",                                             color:"#6b7280", cluster:"cross",     freeZone:true  },

  // Semantic: argocd(730,420) → helm(730,530) — ArgoCD applies via Helm charts
  // Dedicated entry so this relationship glows independently of the grid mesh
  { d:"M 730,420 L 730,530",                                             color:"#86efac", cluster:"gitops",    freeZone:true  },
];

// XOps labels — placed at band midpoints, clear of all nodes
// Top band: y=215 (below mlops y=145, above mid-band y=300)
// Mid band: y=365 (below devsecops y=300, above bottom-band y=420)  — gate label centred
// Bottom band: y=465 (between row-1 y=420 and row-2 y=510)
const XOPS = [
  { label:"AIOps / MLOps", x:500, y:105, color:"#e2e8f0", cluster:"mlops"     },
  { label:"DevSecOps",     x:500, y:365, color:"#f87171", cluster:"devsecops" },
  { label:"GitOps",        x:810, y:475, color:"#4ade80", cluster:"gitops"    }, // midpoint col-B(730)–col-C(890), between rows y=420 and y=530
  { label:"SRE / FinOps",  x:415, y:475, color:"#fbbf24", cluster:"sre"       }, // midpoint grafana(375)–prom(455), between rows
  { label:"Platform",      x:128, y:475, color:"#a78bfa", cluster:"platform"  }, // between cloud(x=80) and IaC(x=175) cols
];

const SECTION_CLUSTERS: Record<string, string[]> = {
  hero:     [],
  skills:   ["dev","test","devsecops","mlops","gitops","sre","platform"],
  work:     ["gitops","sre","devsecops"],
  projects: ["dev","test","mlops"],
  contact:  ["platform","sre"],
};

const PACKETS = [
  { color:"#3b82f6", dur:9,  begin:0   },
  { color:"#60a5fa", dur:9,  begin:2.2 },
  { color:"#ef4444", dur:9,  begin:4.0 },
  { color:"#22c55e", dur:9,  begin:5.8 },
  { color:"#f59e0b", dur:11, begin:7.2 },
  { color:"#a78bfa", dur:11, begin:3.1 },
];

// ── Node component ─────────────────────────────────────────────────────────
function PipelineNode({
  node, active, proximity, frame, dimmed, phase, popped, settled,
  onEnter, onLeave,
}: {
  node: Node; active: boolean; proximity: boolean; frame: boolean;
  dimmed: boolean; phase: 1|2|3; popped: boolean; settled: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  const r    = frame ? 14 : 10;
  // lift is defined below with the scale rules (proximity no longer lifts)

  // Phase 2: dev/test FRAME nodes drift rightward — code has shipped downstream
  const isDevNode    = node.cluster === "dev" || node.cluster === "test";
  const isDeployNode = node.id === "deploy" || node.id === "observe" || node.id === "infra";

  // Phase 2: mesh nodes fly to side rails; Phase 3: settle into bottom strip
  const frameDriftX = phase >= 2 && isDevNode ? 32 : 0;
  const target      = phase === 3
    ? (PHASE3_TARGETS[node.id] ?? PHASE2_TARGETS[node.id] ?? null)
    : phase === 2
      ? (PHASE2_TARGETS[node.id] ?? null)
      : null;
  const meshSwapX   = target ? target.x - node.x : 0;
  const meshSwapY   = target ? target.y - node.y : 0;
  const driftX      = frameDriftX + meshSwapX;
  const swapDelay   = phase === 3
    ? (PHASE3_DELAYS[node.id] ?? 0)
    : (SWAP_DELAYS[node.id] ?? 0);
  const phaseDim    = phase >= 2 && isDevNode ? 0.08 : 1;

  // Phase 3: deploy pulse only while hovering — no ambient glow in greyed mode
  const deployBright = phase === 3 && isDeployNode && active;

  // Scale rules:
  //   popped  → spring bounce (phase-3 pop animation)
  //   active  → intentional hover: grows to confirm interaction
  //   proximity → NO scale — glow-only to avoid accidental overlap
  //   default → 1.0
  const baseScale   = popped ? 1.4 : active ? 1.2 : 1.0;
  const lift        = active ? -6 : 0;   // only active nodes lift, not proximity
  const glowR       = popped ? r + 12 : active ? r + 8 : proximity ? r + 5 : r + 2;
  // CI frame nodes sit at y=230 (mid-screen). Labels go below so they don't
  // crowd the Intelligence Layer above. Legacy y=20 border nodes (none remain)
  // would have got labels above; right/left edge nodes keep their anchor logic.
  const labelBelow = frame ? (node.y >= 200 || node.x <= 20) : true;
  const labelY     = labelBelow ? node.y + r + 13 : node.y - r - 6;
  const labelX     = node.x <= 20 ? node.x - 10 : node.x >= 980 ? node.x + 10 : node.x;
  const anchor     = node.x <= 20 ? "end" : node.x >= 980 ? "start" : "middle";

  // Phase 3 greyed mode: lighter slate so rings are visible; hover rehydrates to original colour
  const nodeColor  = (phase === 3 && !active) ? "#4b5563" : (deployBright ? "#4ade80" : node.color);

  // freeZone nodes (bottom band — both mesh and frame): mild ambient presence at rest.
  const ambientFreeZone = node.freeZone;
  // Phase 3: ALL nodes sit at a consistent 0.50 regardless of freeZone/dimmed status —
  // the tree is the focal element and every node in it must be equally readable.
  // hover snaps to full brightness + original colour for all nodes.
  const phase3Fade  = phase === 3 ? (active ? 1.0 : 0.50) : 1;

  // Phase 1: dim GitOps / Platform / SRE mesh nodes so the CI pipeline frame nodes
  // at y=230 are the visual focal point. mlops + devsecops stay visible as context.
  const phase1GhostNode = !active && !proximity && phase === 1 &&
    (node.cluster === "gitops" || node.cluster === "platform" || node.cluster === "sre");
  const phase1NodeDim = phase1GhostNode ? 0.18 : 1;

  // In Phase 3 skip the content-dimming rule entirely so non-freeZone nodes
  // (mlflow, kubeflow, snyk, vault) reach the same 0.50 rest opacity as freeZone peers.
  const baseOpacity = phase === 3
    ? phaseDim * phase3Fade
    : (dimmed ? 0.18 : 1.0) * phaseDim * phase3Fade * phase1NodeDim;
  const restGlowOpacity = ambientFreeZone ? 0.28 : 0.08;
  const restGlowWidth   = ambientFreeZone ? 1.0  : 0.4;
  const restBodyOpacity = ambientFreeZone ? 0.42 : 0.28;
  const restFilter      = ambientFreeZone
    ? `drop-shadow(0 0 2px ${nodeColor}45)`   // whisper-level glow — becomes vivid on hover
    : "none";

  return (
    <g
      style={{
        transform:       `translate(${driftX}px, ${lift + meshSwapY}px) scale(${baseScale})`,
        transformOrigin: `${node.x}px ${node.y}px`,
        // Once Phase 3 entrance has settled, drop the stagger delay so hover
        // responds instantly instead of waiting up to 0.45s before starting.
        transition:      popped
          ? "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease"
          : phase === 3 && target && !settled
            ? `transform 0.6s cubic-bezier(0.4,0,0.2,1) ${swapDelay}s, opacity 0.5s ease ${swapDelay}s`
          : phase === 3 && settled
            ? "transform 0.18s ease-out, opacity 0.18s ease-out"
            : meshSwapX !== 0
              ? `transform 1.8s cubic-bezier(0.4,0,0.2,1) ${swapDelay}s, opacity 1.4s ease ${swapDelay}s`
              : "transform 0.4s ease, opacity 0.6s ease",
        opacity:         baseOpacity * (meshSwapX !== 0 && phase === 2 ? 0.75 : 1),
        cursor:          "pointer",
        pointerEvents:   "auto",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Extra pulse ring for phase-3 deploy/observe nodes */}
      {deployBright && (
        <circle cx={node.x} cy={node.y} r={r + 4} fill="none"
          stroke={nodeColor} strokeWidth="1.5" opacity="0.6"
          className="deploy-pulse-ring"
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        />
      )}
      {/* Glow ring — freeZone mesh nodes have a strong ambient rest glow */}
      <circle cx={node.x} cy={node.y} r={glowR}
        fill="none" stroke={nodeColor}
        strokeWidth={active || popped ? 1.5 : proximity ? 0.8 : restGlowWidth}
        opacity={active || popped ? 0.60 : proximity ? 0.22 : restGlowOpacity}
        style={{ transition:"all 0.15s ease-out",
          filter:(active||popped||deployBright)
            ? `drop-shadow(0 0 ${popped?9:6}px ${nodeColor})`
            : restFilter }}
      />
      {/* Node body */}
      <circle cx={node.x} cy={node.y} r={r}
        fill={active||popped ? `${nodeColor}28` : proximity ? `${nodeColor}0e` : "#0f172a"}
        stroke={nodeColor}
        strokeWidth={active||popped ? 2 : proximity ? 1.2 : 0.8}
        opacity={active||popped ? 1 : proximity ? 0.6 : restBodyOpacity}
        style={{ transition:"all 0.15s ease-out" }}
      />
      {node.icon && (
        <image
          href={`/assets/icons/${node.icon}.svg`}
          x={node.x - r * 0.62} y={node.y - r * 0.62}
          width={r * 1.25} height={r * 1.25}
          opacity={active||popped ? 0.80 : proximity ? 0.6 : (ambientFreeZone ? 0.80 : 0.2)}
          style={{ transition:"opacity 0.12s ease-out", filter:"brightness(0) invert(1)" }}
        />
      )}
      <text x={labelX} y={labelY}
        textAnchor={anchor as "middle" | "start" | "end"}
        fontSize={frame ? 9 : 8}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="600" letterSpacing="0.07em"
        fill={active||popped ? nodeColor : proximity ? `${nodeColor}cc` : (ambientFreeZone ? `${nodeColor}aa` : "#475569")}
        style={{ transition:"fill 0.15s ease-out" }}
      >
        {node.label}
      </text>
    </g>
  );
}

// ── Phase 1 CI pipeline connector lines ───────────────────────────────────
//
//  Draws the flow between the 5 horizontal CI frame nodes at y=230
//  and the Artifact node at y=390.  Lines are drawn gap-free between
//  node edges (r=14 for frame nodes):
//
//    Plan(130) ──→ Code(310) ──→ Build(490) ──→ Test(670) ──→ Scan(850)
//                                                                   ↓
//                                                            Artifact(850,390)
//
//  Fades out smoothly as the user scrolls into Phase 2.
function Phase1CIPipeline({ phase }: { phase: 1|2|3 }) {
  const show = phase === 1;
  const r = 14; // frame node radius
  return (
    <g style={{ opacity: show ? 1 : 0, transition:"opacity 0.8s ease", pointerEvents:"none" }}>
      {/* Horizontal connectors — colour follows the SOURCE node */}
      <path d={`M ${130+r},230 L ${310-r},230`} fill="none" stroke="#2684FF" strokeWidth="1.2" opacity="0.55"/>
      <path d={`M ${310+r},230 L ${490-r},230`} fill="none" stroke="#FC6D26" strokeWidth="1.2" opacity="0.55"/>
      <path d={`M ${490+r},230 L ${670-r},230`} fill="none" stroke="#2496ED" strokeWidth="1.2" opacity="0.55"/>
      <path d={`M ${670+r},230 L ${850-r},230`} fill="none" stroke="#f87171" strokeWidth="1.2" opacity="0.55"/>
      {/* Scan → Artifact vertical drop */}
      <path d={`M 850,${230+r} L 850,${390-r}`} fill="none" stroke="#22c55e" strokeWidth="1.2" opacity="0.55"/>
      {/* Arrow heads */}
      {[{x:310-r-1,y:230,c:"#2684FF"},{x:490-r-1,y:230,c:"#FC6D26"},{x:670-r-1,y:230,c:"#2496ED"},{x:850-r-1,y:230,c:"#f87171"}].map((a,i)=>(
        <polygon key={i} points={`${a.x},${a.y-3} ${a.x+5},${a.y} ${a.x},${a.y+3}`} fill={a.c} opacity="0.55"/>
      ))}
      <polygon points={`847,${390-r-1} 850,${390-r+4} 853,${390-r-1}`} fill="#22c55e" opacity="0.55"/>
      {/* CI pipeline label */}
      <text x="490" y="210" textAnchor="middle" fontSize="7"
        fontFamily="'JetBrains Mono', monospace" letterSpacing="0.16em"
        fill="#94a3b8" opacity="0.40">CI PIPELINE</text>
    </g>
  );
}

// ── Phase 3 flow diagram — horizontal left→right pipeline ─────────────────
// Layout header comment is inline with FLOW_PATHS below.
// strokeDasharray=1400 covers the longest convergence curve.
//
// ── Horizontal left→right pipeline ─────────────────────────────────────
// All nodes in y=400–545 — entirely below contact-section text (SVG y≈280–370)
//
//  GitLab(90,465) ─┬─ Terraform(185,430) ─ Crossplane(280,420) ─┬─ AWS(395,402)
//                  │                                              ├─ Azure(395,420)
//                  │                                              └─ GCP(395,438)
//                  └─ ArgoCD(185,500)   ─ Helm(280,520)       ─┬─ OpenShift(395,500)
//                                                               ├─ K8s(395,518)
//                                                               └─ Rancher(395,536)
//  Cloud/Platform → Datadog(555,430) · Prometheus(655,448) · Grafana(755,430)
//
const FLOW_PATHS: Array<{ d:string; color:string; delay:number }> = [
  // ── Source splits ───────────────────────────────────────────────────────
  { d:"M 90,465 C 137,465 155,433 185,430",   color:"#c4b5fd", delay:0.00 },  // GitLab → Terraform
  { d:"M 90,465 C 137,465 155,498 185,500",   color:"#4ade80", delay:0.04 },  // GitLab → ArgoCD
  // ── IaC chain ───────────────────────────────────────────────────────────
  { d:"M 185,430 C 232,430 258,422 280,420",  color:"#c4b5fd", delay:0.14 },  // Terraform → Crossplane
  { d:"M 280,420 C 330,420 363,404 395,402",  color:"#f97316", delay:0.24 },  // → AWS
  { d:"M 280,420 L 395,420",                  color:"#0078d4", delay:0.27 },  // → Azure
  { d:"M 280,420 C 330,420 363,436 395,438",  color:"#eab308", delay:0.29 },  // → GCP
  // ── GitOps chain ────────────────────────────────────────────────────────
  { d:"M 185,500 C 232,500 258,520 280,520",  color:"#22c55e", delay:0.16 },  // ArgoCD → Helm
  { d:"M 280,520 C 330,520 363,502 395,500",  color:"#ef4444", delay:0.26 },  // → OpenShift
  { d:"M 280,520 L 395,518",                  color:"#326CE5", delay:0.29 },  // → K8s
  { d:"M 280,520 C 330,520 363,534 395,536",  color:"#22c55e", delay:0.31 },  // → Rancher
  // ── Convergence: cloud/platform → observability ──────────────────────
  { d:"M 395,402 C 468,402 510,430 555,430",  color:"#f97316", delay:0.44 },  // AWS → Datadog
  { d:"M 395,420 C 470,420 515,430 555,430",  color:"#0078d4", delay:0.47 },  // Azure → Datadog
  { d:"M 395,438 C 470,438 548,448 655,448",  color:"#eab308", delay:0.50 },  // GCP → Prometheus
  { d:"M 395,500 C 470,500 545,452 655,448",  color:"#ef4444", delay:0.53 },  // OpenShift → Prometheus
  { d:"M 395,518 C 470,518 625,432 755,430",  color:"#326CE5", delay:0.56 },  // K8s → Grafana
  { d:"M 395,536 C 470,536 632,436 755,430",  color:"#22c55e", delay:0.59 },  // Rancher → Grafana
  // ── Observability spine ─────────────────────────────────────────────────
  { d:"M 555,430 L 655,448 L 755,430",        color:"#fbbf24", delay:0.73 },
  // ── Secondary observability: Splunk (from Datadog) + Loki (from Grafana) ─
  { d:"M 555,430 C 568,447 575,458 588,466",  color:"#65a637", delay:0.78 },  // Datadog → Splunk
  { d:"M 755,430 C 745,447 736,458 722,466",  color:"#F8B91E", delay:0.81 },  // Grafana → Loki
];

const FLOW_NODES: Array<{
  x:number; y:number; icon:string; label:string; color:string; delay:number;
}> = [
  // Source (left)
  { x: 90, y:465, icon:"gitlab",     label:"GitLab",    color:"#94a3b8", delay:0.00 },
  // IaC chain (upper arm)
  { x:185, y:430, icon:"terraform",  label:"Terraform", color:"#c4b5fd", delay:0.10 },
  { x:280, y:420, icon:"crossplane", label:"Crossplane",color:"#22c55e", delay:0.20 },
  { x:395, y:402, icon:"aws",        label:"AWS",       color:"#f97316", delay:0.30 },
  { x:395, y:420, icon:"azure",      label:"Azure",     color:"#0078d4", delay:0.33 },
  { x:395, y:438, icon:"gcp",        label:"GCP",       color:"#eab308", delay:0.35 },
  // GitOps chain (lower arm)
  { x:185, y:500, icon:"argocd",     label:"ArgoCD",    color:"#4ade80", delay:0.10 },
  { x:280, y:520, icon:"helm",       label:"Helm",      color:"#22c55e", delay:0.20 },
  { x:395, y:500, icon:"openshift",  label:"OpenShift", color:"#ef4444", delay:0.30 },
  { x:395, y:518, icon:"kubernetes", label:"K8s",       color:"#326CE5", delay:0.33 },
  { x:395, y:536, icon:"rancher",    label:"Rancher",   color:"#22c55e", delay:0.35 },
  // Observability (right) — primary spine
  { x:555, y:430, icon:"datadog",    label:"Datadog",   color:"#fbbf24", delay:0.54 },
  { x:655, y:448, icon:"prometheus", label:"Prometheus",color:"#f59e0b", delay:0.64 },
  { x:755, y:430, icon:"grafana",    label:"Grafana",   color:"#F46800", delay:0.74 },
  // Observability (right) — secondary tier (SIEM + log aggregation)
  { x:588, y:466, icon:"splunk",     label:"Splunk",    color:"#65a637", delay:0.81 },
  { x:722, y:466, icon:"loki",       label:"Loki",      color:"#F8B91E", delay:0.86 },
];

function Phase3FlowDiagram({ visible, flowKey }: { visible: boolean; flowKey: number }) {
  const r = 11;   // increased from 9 for readability
  if (!visible) return null;
  return (
    <g key={flowKey}>
      {/* Connections */}
      {FLOW_PATHS.map((p, i) => (
        <path key={i} d={p.d} fill="none"
          stroke={p.color} strokeWidth="0.9"
          strokeDasharray="1400" strokeDashoffset="1400"
          style={{
            animationName: "flow-path-in",
            animationDuration: "0.35s",
            animationTimingFunction: "ease",
            animationFillMode: "forwards",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Nodes */}
      {FLOW_NODES.map((n, i) => (
        <g key={i} className="flow-node-g"
          style={{
            opacity: 0,
            animationName: "flow-node-in",
            animationDuration: "0.25s",
            animationTimingFunction: "ease",
            animationFillMode: "forwards",
            animationDelay: `${n.delay}s`,
          }}
        >
          <circle cx={n.x} cy={n.y} r={r + 5}
            fill="none" stroke={n.color} strokeWidth="0.8" opacity="0.28" />
          <circle cx={n.x} cy={n.y} r={r}
            fill={`${n.color}22`} stroke={n.color} strokeWidth="1.8" />
          <image
            href={`/assets/icons/${n.icon}.svg`}
            x={n.x - r * 0.62} y={n.y - r * 0.62}
            width={r * 1.25} height={r * 1.25}
            opacity="0.9"
            style={{ filter:"brightness(0) invert(1)" }}
          />
          <text x={n.x} y={n.y + r + 9}
            textAnchor="middle" fontSize="6.5"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="600" letterSpacing="0.05em"
            fill={n.color} opacity="0.85"
          >{n.label}</text>
        </g>
      ))}
      {/* Section labels above each arm */}
      <text x="170" y="218"
        textAnchor="middle" fontSize="6.5"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.14em" fill="#c4b5fd" opacity="0.45"
        style={{ animationName:"flow-node-in", animationDuration:"0.5s",
          animationFillMode:"forwards", animationDelay:"0.8s", opacity:0 } as React.CSSProperties}
      >IaC · CLOUD</text>
      <text x="830" y="218"
        textAnchor="middle" fontSize="6.5"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.14em" fill="#4ade80" opacity="0.45"
        style={{ animationName:"flow-node-in", animationDuration:"0.5s",
          animationFillMode:"forwards", animationDelay:"0.8s", opacity:0 } as React.CSSProperties}
      >GitOps · PLATFORM</text>
      {/* Convergence label */}
      <text x="500" y="510"
        textAnchor="middle" fontSize="6.5"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.16em" fill="#fbbf24" opacity="0.40"
        style={{ animationName:"flow-node-in", animationDuration:"0.5s",
          animationFillMode:"forwards", animationDelay:"0.95s", opacity:0 } as React.CSSProperties}
      >OBSERVABILITY · SRE CLOSED LOOP</text>
    </g>
  );
}

// Nodes that pop out in phase 3 (staggered)
const PHASE3_POP_IDS = ["argocd-m","helm-m","prom-m","grafana-m","datadog-m"];

// ── Phase 2: side rails — icons hug left/right frame edges, clear of center ──
//
//   LEFT RAIL (x=65)                   RIGHT RAIL (x=920)
//   pre-prod tools stacked vertically   post-prod tools stacked vertically
//   ──────────────────────────          ──────────────────────────────────
//   snyk        y=120                   prom        y=200
//   vault       y=205                   grafana     y=320
//   akeyless    y=290                   datadog     y=440
//   crossplane  y=375
//   argocd      y=460
//   helm        y=530
//
// RIGHT rail stays clear of frame nodes: secure(980,175) artifact(980,375)
// LEFT  col-A(x=92) + col-B(x=195): container platforms sit to the right of their GitOps pair
// Phase 2: pre-prod tools on left side; post-prod (observe + cloud-targets) on right side.
// x=92 keeps left-rail nodes visible but clear of the x=20 frame border.
// x=908 keeps right-rail nodes clear of the x=980 frame border.
// Vertical spacing = 75 SVG units (7.5× node radius) — no overlap.
const PHASE2_TARGETS: Record<string, { x: number; y: number }> = {
  // Pre-prod: Security + GitOps/IaC → left side
  "snyk-m":       { x:  92, y: 110 },
  "vault-m":      { x:  92, y: 185 },
  "akeyless-m":   { x:  92, y: 260 },
  "crossplane-m": { x:  92, y: 335 },
  "argocd-m":     { x:  92, y: 410 },
  "helm-m":       { x:  92, y: 485 },
  "tf-m":         { x:  92, y: 540 },
  // Cloud + Observability → right side
  "aws-m":        { x: 908, y: 150 },
  "gcp-m":        { x: 908, y: 225 },
  "azure-m":      { x: 908, y: 300 },
  "prom-m":       { x: 100, y: 580 },
  "grafana-m":    { x: 908, y: 460 },
  "datadog-m":    { x: 908, y: 530 },
  // Container platforms: second column at x=195 alongside their deploy-tool pair
  //   Crossplane(92,335) ─ K8s(195,335)       same y — 103 units apart ✓
  //   ArgoCD(92,410)    ─ OpenShift(195,410)   same y — 103 units apart ✓
  //   Helm(92,485)      ─ Rancher(195,485)     same y — 103 units apart ✓
  "k8s-m":        { x: 195, y: 335 },
  "openshift-m":  { x: 195, y: 410 },
  "rancher-m":    { x: 195, y: 485 },
};

// ── Phase 3: branching deployment tree ────────────────────────────────────
//
//  IBM Garage co-operate phase — nodes rearrange into a deployment topology:
//
//  vault(90,155) ─────── snyk(500,90) ─────── akeyless(860,155)
//        └── tf(220,255)                        argocd(780,255) ─┘
//                └── crossplane(220,365)    helm(890,365) ─┘
//                         │                        │
//                   [comb y=415]            [comb y=415]
//                aws  azure  gcp       openshift  k8s  rancher
//               (90) (220) (350)        (620)   (750) (880)   y=460
//                      └──────── converge ────────┘
//              datadog(340,545)  prometheus(490,545)  grafana(640,545)
//
const PHASE3_TARGETS: Record<string, { x: number; y: number }> = {
  // ── Intelligence Layer: floats ABOVE the deployment tree ───────────────
  // Clear of top rail (y=20) by 45 units, and above security row (y=155) by 90 units
  // 4 nodes: x=175, 400, 600, 825 (matching MESH_NODES spacing)
  "mlflow-m":     { x: 175, y:  65 },
  "kubeflow":     { x: 400, y:  65 },
  "mcp-m":        { x: 600, y:  65 },
  "kafka-m":      { x: 825, y:  65 },
  // ── Security / secrets ─────────────────────────────────────────────────
  "vault-m":      { x:  90, y: 155 },
  "snyk-m":       { x: 500, y:  90 },
  "akeyless-m":   { x: 860, y: 155 },
  "tf-m":         { x: 195, y: 255 },
  "crossplane-m": { x: 195, y: 365 },
  "aws-m":        { x:  90, y: 460 },
  "azure-m":      { x: 195, y: 460 },
  "gcp-m":        { x: 325, y: 460 },
  "argocd-m":     { x: 805, y: 255 },
  "helm-m":       { x: 805, y: 365 },
  "openshift-m":  { x: 655, y: 460 },
  "k8s-m":        { x: 805, y: 460 },
  "rancher-m":    { x: 955, y: 460 },
    "datadog-m":    { x: 195, y: 545 },  // beneath Azure — clean vertical IaC chain
    "prom-m":       { x: 100, y: 580 },  // stays on frame border bottom rail
    "grafana-m":    { x: 805, y: 545 },  // Splunk — beneath K8s — clean vertical GitOps chain
};

// Staggered delays — left-movers depart first, right-movers follow.
const SWAP_DELAYS: Record<string, number> = {
  // Security → left
  "snyk-m":       0.00,
  "vault-m":      0.10,
  "akeyless-m":   0.18,
  // GitOps/IaC → left
  "crossplane-m": 0.26,
  "argocd-m":     0.34,
  "helm-m":       0.42,
  "tf-m":         0.50,
  "aws-m":        0.56,
  // Cloud → split (GCP/Azure go right)
  "gcp-m":        0.56,
  "azure-m":      0.64,
  // Observability → right
  "prom-m":       0.60,
  "grafana-m":    0.72,
  "datadog-m":    0.84,
  // Container platforms
  "openshift-m":  0.20,
  "rancher-m":    0.28,
  // MLOps — gentle lift into intelligence layer (Phase 3)
  "mlflow-m":     0.0,
  "kubeflow":     0.06,
  "kafka-m":      0.12,
};

// Phase 3 delays — build the deployment tree top-down.
// All values halved from the original design so the total entrance time
// (max delay 0.45s + 0.6s duration) matches Phase 1's snappy feel (~1s total).
const PHASE3_DELAYS: Record<string, number> = {
  // Intelligence layer — lift into top band
  "mlflow-m":     0.00,
  "kubeflow":     0.04,
  "mcp-m":        0.06,
  "kafka-m":      0.08,
  // Security / secrets gate
  "snyk-m":       0.11,
  "vault-m":      0.14,
  "akeyless-m":   0.17,
  // IaC + GitOps roots
  "tf-m":         0.20,
  "argocd-m":     0.23,
  "crossplane-m": 0.26,
  "helm-m":       0.29,
  // Cloud targets (IaC arm)
  "aws-m":        0.32,
  "azure-m":      0.35,
  "gcp-m":        0.38,
  // Platform targets (GitOps arm)
  "openshift-m":  0.32,
  "k8s-m":        0.35,
  "rancher-m":    0.38,
  // Observability convergence
  "datadog-m":    0.42,
  "grafana-m":    0.45,
  "prom-m":       0.45,
};

// ── Phase 3 branching tree lines ───────────────────────────────────────────
// Fades in when phase===3. Shows the deployment flow topology:
//   Secrets → IaC/GitOps roots → comb forks → cloud/platform targets → observability
function Phase3Tree({ phase }: { phase: 1|2|3 }) {
  const show = phase === 3;
  return (
    <g style={{ opacity: show ? 1 : 0, transition:"opacity 1.0s ease 0.8s", pointerEvents:"none" }}>
      {/* ── IaC branch (left, indigo) ──────────────────────────────────── */}
      {/* vault(90,165) → tf(195,255): secrets flow into IaC */}
      <path d="M 90,165 L 195,255"         fill="none" stroke="#c4b5fd" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.70"/>
      {/* tf(195,265) → crossplane(195,365): stack root line */}
      <path d="M 195,265 L 195,365"         fill="none" stroke="#c4b5fd" strokeWidth="1.4" opacity="0.70"/>
      {/* crossplane → comb fork → [aws(90), azure(195), gcp(325)] */}
      <path d="M 195,375 L 195,415 M 90,415 L 325,415 M 90,415 L 90,450 M 195,415 L 195,450 M 325,415 L 325,450"
            fill="none" stroke="#c4b5fd" strokeWidth="1.2" opacity="0.65"/>

      {/* ── GitOps branch (right, green) ───────────────────────────────── */}
      {/* akeyless(860,165) → argocd(805,255): secrets gate for deploy */}
      <path d="M 860,165 L 805,255"         fill="none" stroke="#4ade80" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.70"/>
      {/* argocd(805,265) → helm(805,365): straight vertical chain */}
      <path d="M 805,265 L 805,365"         fill="none" stroke="#4ade80" strokeWidth="1.4" opacity="0.70"/>
      {/* helm(805,375) → comb fork → [openshift(655), k8s(805), rancher(955)] */}
      <path d="M 805,375 L 805,415 M 655,415 L 955,415 M 655,415 L 655,450 M 805,415 L 805,450 M 955,415 L 955,450"
            fill="none" stroke="#22c55e" strokeWidth="1.2" opacity="0.65"/>

     {/* ── Convergence: IaC clouds → Datadog(195,545) ─────────────────── */}
     <path d="M  90,470 Q 140,520 195,545"  fill="none" stroke="#632CA6" strokeWidth="1.0" opacity="0.60"/>
     <path d="M 195,470 L 195,545"          fill="none" stroke="#632CA6" strokeWidth="1.0" opacity="0.60"/>
     <path d="M 325,470 Q 265,520 195,545"  fill="none" stroke="#632CA6" strokeWidth="1.0" opacity="0.60"/>
     {/* ── Convergence: GitOps platforms → Splunk(805,545) ─────────────── */}
     <path d="M 655,470 Q 720,520 805,545"  fill="none" stroke="#65a637" strokeWidth="1.0" opacity="0.60"/>
     <path d="M 805,470 L 805,545"          fill="none" stroke="#65a637" strokeWidth="1.0" opacity="0.60"/>
     <path d="M 955,470 Q 890,520 805,545"  fill="none" stroke="#65a637" strokeWidth="1.0" opacity="0.60"/>

     {/* ── Observability connector: Datadog(195,545) — Splunk(805,545) direct */}
     <path d="M 195,545 L 805,545"
           fill="none" stroke="#9B59B6" strokeWidth="1.1" opacity="0.55"/>

      {/* ── Intelligence Layer label — above the tree ──────────────────── */}
      <text x="500" y="43" textAnchor="middle" fontSize="7"
        fontFamily="'JetBrains Mono', monospace" letterSpacing="0.16em"
        fill="#e2e8f0" opacity="0.55">
        INTELLIGENCE LAYER — AIOPS / MLOPS
      </text>
      {/* Horizontal connector across all four MLOps nodes (175→825) */}
      <path d="M 175,65 L 825,65" fill="none" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.45"/>

      {/* ── Feedback loop: observability → intelligence (dashed, completing IBM Garage cycle) */}
      <path d="M 195,555 Q 100,570 20,560 Q 20,65 165,65"
            fill="none" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.30"/>
    </g>
  );
}

// ── Pipeline scene ─────────────────────────────────────────────────────────
function PipelineScene() {
  const svgRef           = useRef<SVGSVGElement>(null);
  const [hovered,        setHovered]        = useState<Node | null>(null);
  const [proxSet,        setProxSet]        = useState<Set<string>>(new Set());
  const [activeClusters, setActiveClusters] = useState<string[]>([]);
  const [inContent,      setInContent]      = useState(false);
  const [phase,          setPhase]          = useState<1|2|3>(1);
  const [poppedIds,      setPoppedIds]      = useState<Set<string>>(new Set());
  // flowKey increments each time phase 3 is entered — re-triggers CSS animations
  const [flowKey,        setFlowKey]        = useState(0);
  // phase3Settled: true once Phase 3 entrance animations have finished (~1.2s).
  // Switches each node's transition from the staggered entrance timing to a
  // fast no-delay hover transition so cursor interactions feel instant.
  const [phase3Settled,  setPhase3Settled]  = useState(false);

  // Scroll phase: 1 = dev/plan, 2 = in-flight, 3 = deployed (flow diagram)
  useEffect(() => {
    let prevPhase = 1;
    const onScroll = () => {
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      const next: 1|2|3 = p < 0.33 ? 1 : p < 0.66 ? 2 : 3;
      if (next === 3 && prevPhase !== 3) setFlowKey(k => k + 1); // re-trigger diagram anim
      prevPhase = next;
      setPhase(next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phase 3 settled: after entrance animations complete, switch to fast hover transitions.
  // max PHASE3_DELAY (0.45s) + transition duration (0.6s) + 200ms buffer = 1250ms.
  useEffect(() => {
    if (phase !== 3) { setPhase3Settled(false); return; }
    const t = setTimeout(() => setPhase3Settled(true), 1250);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3: stagger-pop metrics + GitOps nodes (160ms apart) for entrance,
  // then clear after all bounces settle so hover scale works like Phase 1.
  useEffect(() => {
    if (phase !== 3) { setPoppedIds(new Set()); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHASE3_POP_IDS.forEach((id, i) => {
      timers.push(setTimeout(() =>
        setPoppedIds(prev => new Set(Array.from(prev).concat(id))), 250 + i * 160));
    });
    // Last node pops at 250+(n-1)*160ms; spring takes ~550ms — clear at 1800ms
    timers.push(setTimeout(() => setPoppedIds(new Set()), 1800));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Track phase in a ref so handleMouseMove always reads the current value
  // without needing to be recreated (avoids stale-closure bug).
  const phaseRef = useRef<1|2|3>(1);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current; if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const sp = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const near = new Set<string>();
    let closest: Node | null = null, minDist = Infinity;
    const ph = phaseRef.current;
    for (const node of ALL_NODES) {
      // Resolve the node's effective (visually rendered) position for the
      // current phase — base coords are wrong once CSS transforms are applied.
      const target = ph === 3
        ? (PHASE3_TARGETS[node.id] ?? PHASE2_TARGETS[node.id] ?? null)
        : ph === 2
          ? (PHASE2_TARGETS[node.id] ?? null)
          : null;
      const ex = target ? target.x : node.x;
      const ey = target ? target.y : node.y;
      const d = Math.hypot(ex - sp.x, ey - sp.y);
      if (d < PROX_RADIUS) near.add(node.id);
      if (d < minDist) { minDist = d; closest = node; }
    }
    setProxSet(near);
    setHovered(minDist < HOVER_RADIUS ? closest : null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setProxSet(new Set()); setHovered(null);
  }, []);

  useEffect(() => {
    if (!hovered) { emit(null); return; }
    emit({ name:hovered.id, label:hovered.label,
      shortDescription:hovered.description,
      color:hovered.color, icon:`/assets/icons/${hovered.icon}.svg` });
  }, [hovered]);

  useEffect(() => {
    const frame = svgRef.current?.querySelector(".pipeline-frame") as SVGPathElement | null;
    if (frame) {
      const len = frame.getTotalLength();
      gsap.set(frame, { strokeDasharray:len, strokeDashoffset:len });
      gsap.to(frame,  { strokeDashoffset:0, duration:3, ease:"power2.inOut", delay:0.2 });
    }
    const triggers: Array<[string, string]> = [
      ["#skills","skills"],["#work","work"],["#projects","projects"],["#contact","contact"],
    ];
    triggers.forEach(([sel, sec], idx) => {
      ScrollTrigger.create({
        trigger:sel, start:"top 75%", end:"bottom 25%",
        onEnter:     () => { setActiveClusters(SECTION_CLUSTERS[sec]??[]); setInContent(true);  },
        onLeaveBack: () => {
          setActiveClusters(SECTION_CLUSTERS[idx>0 ? triggers[idx-1][1] : "hero"]??[]);
          setInContent(idx > 0);
        },
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Phase 3: cluster-based activation is suppressed — every node rests in greyed
  // mode and only lights up on direct hover. This prevents the contact-section
  // cluster mapping (["platform","sre"]) from permanently activating AWS, GCP,
  // Azure, Terraform, K8s, Rancher, Prometheus, Splunk, Datadog and the SRE
  // frame nodes with the full active glow ring.
  const isActive  = (n: Node) => hovered?.id === n.id ||
    (phase !== 3 && activeClusters.length > 0 && activeClusters.includes(n.cluster ?? ""));
  const isProx    = (n: Node) => proxSet.has(n.id);
  // A node is dimmed only if inContent AND it's not in the free (right/bottom) zone
  const isDimmed  = (n: Node) => inContent && !n.freeZone;
  const branchDim = (b: typeof BRANCHES[0]) =>
    inContent && !b.freeZone && b.cluster !== "cross";
  // Phase 3: branch lines are never "on" via cluster — only the tree overlay shows
  const branchOn  = (b: typeof BRANCHES[0]) =>
    phase !== 3 && (activeClusters.includes(b.cluster) || b.cluster === "cross");

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full pipeline-breathe"
      style={{ opacity:1, overflow:"visible", display:"block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <filter id="glow-s" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-h" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="frame-grad" gradientUnits="userSpaceOnUse" x1="20" y1="20" x2="980" y2="20">
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.8"/>
          <stop offset="18%"  stopColor="#60a5fa" stopOpacity="0.8"/>
          <stop offset="35%"  stopColor="#2496ED" stopOpacity="0.9"/>
          <stop offset="52%"  stopColor="#1a7abf" stopOpacity="0.9"/>
          <stop offset="62%"  stopColor="#22c55e" stopOpacity="0.8"/>
          <stop offset="75%"  stopColor="#4ade80" stopOpacity="0.8"/>
          <stop offset="86%"  stopColor="#a78bfa" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8"/>
        </linearGradient>
      </defs>

      {/* Ghost track */}
      <path d={FRAME_PATH} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="3"/>

      {/* Draw-in frame — greyed + dimmed in Phase 3 */}
      <path className="pipeline-frame" d={FRAME_PATH} fill="none"
        stroke={phase === 3 ? "#334155" : "url(#frame-grad)"} strokeWidth="1.5"
        strokeDasharray="9999" strokeDashoffset="9999"
        opacity={phase === 3 ? 0.20 : inContent ? 0.25 : 0.7}
        style={{ transition:"opacity 0.8s ease, stroke 0.8s ease" }}
        filter={phase === 3 ? undefined : "url(#glow-s)"}
      />

      {/* Branch mesh — fades while mesh nodes are in transit (phase 2+) */}
      {BRANCHES.map((b, i) => {
        const dim = branchDim(b);
        const on  = branchOn(b);
        // During node side-swap, branch lines become orphaned — dissolve them.
        // Exception: the ArgoCD→Helm semantic line (single vertical, #86efac) persists across phases.
        const isArgoCDHelm = b.color === "#86efac" && b.d === "M 730,420 L 730,530";
        const swapping = !isArgoCDHelm && phase >= 2 && (
          b.cluster === "devsecops" || b.cluster === "gitops" ||
          b.cluster === "sre"       || b.cluster === "cross"
        );
        // freeZone branches (bottom band) are the visible hierarchy — keep them readable.
        // Non-freeZone branches (top/mid bands) stay recessed so they don't crowd content.
        const restOpacity  = b.freeZone ? 0.28 : 0.10;
        const restWidth    = b.freeZone ? 0.8  : 0.5;
        // Phase 1: ghost out GitOps/SRE/Platform branches so CI pipeline is the
        // focal visual. Cross-links and mlops/devsecops branches stay visible.
        const branchPhase1Ghost = phase === 1 &&
          (b.cluster === "gitops" || b.cluster === "sre" || b.cluster === "platform");
        const branchOpacity = phase === 3
          ? 0.10
          : swapping ? 0.03
          : branchPhase1Ghost ? 0.04
          : dim ? 0.05 : on ? 0.55 : restOpacity;
        const branchWidth = on ? 1.4 : restWidth;
        return (
          <path key={i} d={b.d} fill="none"
            stroke={phase === 3 ? "#334155" : b.color}
            strokeWidth={branchWidth}
            opacity={branchOpacity}
            strokeDasharray={b.cluster==="cross" ? "4 4" : undefined}
            style={{ transition:"opacity 1.0s ease, stroke 0.8s ease" }}
            filter={phase !== 3 && on && !dim && !swapping ? "url(#glow-s)" : undefined}
          />
        );
      })}

      {/* XOps labels — dissolve while nodes are swapping sides in phase 2+ */}
      {XOPS.map((l) => {
        const labelSwapping = phase >= 2 && (
          l.cluster === "devsecops" || l.cluster === "gitops" || l.cluster === "sre"
        );
        // Phase 3: labels are fully dissolved — the tree overlay is the focal element.
        // Cluster-based brightening is also suppressed in Phase 3 for the same reason
        // as isActive: the contact-section clusters ["platform","sre"] would otherwise
        // light up SRE/Platform labels permanently.
        const labelOpacity = phase === 3 || labelSwapping
          ? 0.0
          : activeClusters.includes(l.cluster) || activeClusters.length===0
            ? (inContent && l.cluster==="mlops" ? 0.12 : 0.3)
            : 0.07;
        return (
          <text key={l.label} x={l.x} y={l.y}
            textAnchor="middle" fontSize={7.5}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.14em" fill={l.color}
            opacity={labelOpacity}
            style={{ transition:"opacity 1.0s ease" }}
          >
            {l.label.toUpperCase()}
          </text>
        );
      })}

      {/* Mesh nodes */}
      {MESH_NODES.map((n) => (
        <PipelineNode key={n.id} node={n} frame={false}
          active={isActive(n)} proximity={isProx(n) && !isActive(n)}
          dimmed={isDimmed(n)} phase={phase} popped={poppedIds.has(n.id)}
          settled={phase3Settled}
          onEnter={() => setHovered(n)} onLeave={() => setHovered(null)}/>
      ))}

      {/* Frame nodes */}
      {FRAME_NODES.map((n) => (
        <PipelineNode key={n.id} node={n} frame={true}
          active={isActive(n)} proximity={isProx(n) && !isActive(n)}
          dimmed={isDimmed(n)} phase={phase} popped={poppedIds.has(n.id)}
          settled={phase3Settled}
          onEnter={() => setHovered(n)} onLeave={() => setHovered(null)}/>
      ))}

      {/* Phase 1: CI pipeline connector lines */}
      <Phase1CIPipeline phase={phase} />

      {/* Phase 3: branching deployment tree */}
      <g style={{ opacity: phase === 3 ? 0.85 : 0, transition: "opacity 1.0s ease" }}>
        <Phase3Tree phase={phase} />
      </g>

      {/* Frame packets — paused in Phase 3 (contact section = no distractions) */}
      {phase !== 3 && PACKETS.map((p, i) => (
        <circle key={i} r={i%2===0?3.5:2.5} fill={p.color} filter="url(#glow-h)">
          <animateMotion
            dur={`${phase === 1 ? p.dur : p.dur * 0.5}s`}
            repeatCount="indefinite" path={FRAME_PATH} begin={`${p.begin}s`}/>
        </circle>
      ))}

      {/* Branch packets — paused in Phase 3 */}
      {phase !== 3 && [
        { path:"M 495,20 L 495,155 L 335,155",                   color:"#e2e8f0", dur:3,   begin:0.8 },
        { path:"M 864,230 L 790,230 L 790,285 L 645,285",         color:"#f87171", dur:3.2, begin:0.3 },
        { path:"M 855,580 L 855,435 L 715,435 L 715,315",         color:"#4ade80", dur:3.2, begin:1.5 },
        { path:"M 900,580 L 900,545 L 805,545 L 195,545",          color:"#9B59B6", dur:3,   begin:1.1 },
        { path:"M 20,435 L 165,435 L 165,315",                    color:"#a78bfa", dur:2.8, begin:0.5 },
      ].map((p, i) => (
        <circle key={i} r="2" fill={p.color} opacity="0.75" filter="url(#glow-s)">
          <animateMotion dur={`${p.dur}s`} repeatCount="indefinite"
            path={p.path} begin={`${p.begin}s`}/>
        </circle>
      ))}
    </svg>
  );
}

// ── Export — wraps scene in ambient edge glows (Idea 3) ────────────────────
export default function KeyboardBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="w-full h-full fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Ambient right-edge glow: red (DevSecOps) fading to green (GitOps prod) */}
      <div className="absolute inset-0" style={{ background:
        "radial-gradient(ellipse 28% 55% at 100% 32%, rgba(220,38,38,0.10) 0%, transparent 70%), " +
        "radial-gradient(ellipse 22% 38% at 100% 68%, rgba(34,197,94,0.08) 0%, transparent 65%)"
      }}/>

      {/* Ambient bottom-edge glow: gold (SRE) and purple (Infra/Platform) */}
      <div className="absolute inset-0" style={{ background:
        "radial-gradient(ellipse 55% 28% at 55% 100%, rgba(245,158,11,0.09) 0%, transparent 70%), " +
        "radial-gradient(ellipse 28% 22% at 16% 100%, rgba(167,139,250,0.08) 0%, transparent 65%)"
      }}/>

      <PipelineScene />
    </div>
  );
}
