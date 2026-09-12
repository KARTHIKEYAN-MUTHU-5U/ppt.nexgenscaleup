/**
 * Executive Slide Studio - Master Templates & Data Catalog
 * Flags the flagship Philips ICA Reconciliation As-Is Blueprint,
 * plus 4 comprehensive executive enterprise templates.
 */

const PALETTES = {
  executive_blueprint: {
    id: "executive_blueprint",
    name: "Executive Blueprint (Corporate White & Navy)",
    canvas_bg: "#F4F6F9",
    hdr_bg: "#13233D",
    stripe: "#00A884",
    card_bg: "#FFFFFF",
    card_bd: "#D8E2EC",
    text_primary: "#101D30",
    text_secondary: "#2D3F55",
    text_muted: "#5E7794",
    blue_accent: "#0B5CAD",
    blue_bg: "#EEF5FC",
    blue_border: "#B8D5F2",
    amber_accent: "#D97706",
    amber_bg: "#FCF6E9",
    amber_border: "#FCDF88",
    teal_accent: "#008C95",
    teal_border: "#A3E0E3",
    rose_accent: "#D9468D",
    rose_bg: "#FDF2F7",
    rose_border: "#F7B6D7",
    red_accent: "#DC2626",
    red_bg: "#FEF2F2",
    red_border: "#FEC8C8",
    purple_accent: "#6366F1",
    dashed_border: "#BFE3E6"
  },
  obsidian_dark: {
    id: "obsidian_dark",
    name: "Obsidian Dark Mode (Tech & Neon)",
    canvas_bg: "#070B19",
    hdr_bg: "#0D152D",
    stripe: "#38BDF8",
    card_bg: "#0F1A38",
    card_bd: "rgba(56, 189, 248, 0.25)",
    text_primary: "#FFFFFF",
    text_secondary: "#E2E8F0",
    text_muted: "#94A3B8",
    blue_accent: "#38BDF8",
    blue_bg: "rgba(56, 189, 248, 0.1)",
    blue_border: "#38BDF8",
    amber_accent: "#F59E0B",
    amber_bg: "rgba(245, 158, 11, 0.1)",
    amber_border: "#F59E0B",
    teal_accent: "#10B981",
    teal_border: "#10B981",
    rose_accent: "#F43F5E",
    rose_bg: "rgba(244, 63, 94, 0.1)",
    rose_border: "#F43F5E",
    red_accent: "#EF4444",
    red_bg: "rgba(239, 68, 68, 0.1)",
    red_border: "#EF4444",
    purple_accent: "#A855F7",
    dashed_border: "rgba(56, 189, 248, 0.4)"
  },
  emerald_fintech: {
    id: "emerald_fintech",
    name: "Emerald FinTech (Clean Green & Platinum)",
    canvas_bg: "#F3F7F5",
    hdr_bg: "#062A1E",
    stripe: "#10B981",
    card_bg: "#FFFFFF",
    card_bd: "#D1E3DC",
    text_primary: "#0D211A",
    text_secondary: "#1F4236",
    text_muted: "#5B7C71",
    blue_accent: "#008C95",
    blue_bg: "#EBF5F6",
    blue_border: "#A6DCDD",
    amber_accent: "#D97706",
    amber_bg: "#FEF7EC",
    amber_border: "#F7D8A7",
    teal_accent: "#059669",
    teal_border: "#A7F3D0",
    rose_accent: "#BE185D",
    rose_bg: "#FDF2F8",
    rose_border: "#FBCFE8",
    red_accent: "#E11D48",
    red_bg: "#FFF1F2",
    red_border: "#FECDD3",
    purple_accent: "#4F46E5",
    dashed_border: "#A7D7C5"
  },
  royal_indigo: {
    id: "royal_indigo",
    name: "Royal Corporate Indigo (Executive Board)",
    canvas_bg: "#F5F6FA",
    hdr_bg: "#181938",
    stripe: "#6366F1",
    card_bg: "#FFFFFF",
    card_bd: "#DCE0EB",
    text_primary: "#14162B",
    text_secondary: "#2E3354",
    text_muted: "#666E91",
    blue_accent: "#3B82F6",
    blue_bg: "#EFF6FF",
    blue_border: "#BFDBFE",
    amber_accent: "#D97706",
    amber_bg: "#FFFBEB",
    amber_border: "#FDE68A",
    teal_accent: "#0D9488",
    teal_border: "#99F6E4",
    rose_accent: "#DB2777",
    rose_bg: "#FDF2F8",
    rose_border: "#FBCFE8",
    red_accent: "#DC2626",
    red_bg: "#FEF2F2",
    red_border: "#FECACA",
    purple_accent: "#6366F1",
    dashed_border: "#C7D2FE"
  }
};

const EMOTES_CATALOG = [
  { id: "spec", name: "Accounting Specialist", category: "Operations", filename: "spec.gif" },
  { id: "qlik", name: "Qlik Sense Analytics", category: "Data", filename: "qlik.gif" },
  { id: "filter", name: "Filter by Entity", category: "Data", filename: "filter.gif" },
  { id: "list", name: "Open Items Classification", category: "Operations", filename: "list.gif" },
  { id: "pnf", name: "Posting Not Found", category: "Exceptions", filename: "pnf.gif" },
  { id: "idoc", name: "IDoc / OCR Issue", category: "Integration", filename: "idoc.gif" },
  { id: "hwi", name: "Troubleshoot Using HWI", category: "Resolution", filename: "hwi.gif" },
  { id: "no_edi", name: "No EDI / Non-SAP", category: "Exceptions", filename: "no_edi.gif" },
  { id: "inv", name: "Retrieve Invoice Copy", category: "Resolution", filename: "inv.gif" },
  { id: "ap_ar", name: "AP-AR Sign Issue", category: "Exceptions", filename: "ap_ar.gif" },
  { id: "review", name: "Review & Analyze Discrepancy", category: "Resolution", filename: "review.gif" },
  { id: "cash", name: "Cash Allocated / AP Paid", category: "Exceptions", filename: "cash.gif" },
  { id: "waiting", name: "Waiting Counterparty Action", category: "Resolution", filename: "waiting.gif" },
  { id: "gap", name: "Reconciliation Gap", category: "Governance", filename: "gap.gif" },
  { id: "notif", name: "Action Notification Email", category: "Governance", filename: "notif.gif" },
  { id: "esc", name: "Multi-Tier Escalation Siren", category: "Governance", filename: "esc.gif" },
  { id: "tb_robot", name: "Autonomous Bot", category: "Automation", filename: "tb_robot.gif" },
  { id: "tb_dash", name: "Executive Cockpit", category: "Analytics", filename: "tb_dash.gif" },
  { id: "tb_audit", name: "Audit & Compliance", category: "Governance", filename: "tb_audit.gif" },
  { id: "tb_rules", name: "Rules Engine", category: "Logic", filename: "tb_rules.gif" },
  { id: "tb_rbac", name: "RBAC Access Control", category: "Security", filename: "tb_rbac.gif" },
  { id: "tb_email", name: "Dispatch Email", category: "Alerts", filename: "tb_email.gif" },
  { id: "tb_ageing", name: "SLA Aging Watcher", category: "Time", filename: "tb_ageing.gif" },
  { id: "tb_write", name: "Document Authoring", category: "Operations", filename: "tb_write.gif" }
];

const TEMPLATES_CONFIG = {
  process_flow: {
    id: "process_flow",
    name: "ICA Reconciliation | AS-IS WORKFLOW BLUEPRINT (Philips Flagship)",
    category: "Operations Architecture",
    description: "The complete 4-stage Philips ICA Decision Architecture with symmetrical branching, 2.0 pt DrawingML connectors, and 3-tier escalation governance matrix.",
    defaultData: {
      template_id: "process_flow",
      palette: "executive_blueprint",
      branding: {
        company_name: "PHILIPS",
        category_subtitle: "INTERCOMPANY ACCOUNTING PROCESS FLOW & GOVERNANCE",
        logo_key: "philips"
      },
      header: {
        title: "ICA Reconciliation  |  AS-IS WORKFLOW BLUEPRINT",
        subtitle: "PHILIPS  •  INTERCOMPANY ACCOUNTING PROCESS FLOW & GOVERNANCE",
        date: "September 2026",
        slide_no: "01",
        status_text: "AS-IS BLUEPRINT"
      },
      ribbon: [
        { num: "01", title: "INGESTION & SCOPE", sub: "Qlik Sense Extract & Filtering", badge_color: "#0B5CAD" },
        { num: "02", title: "CLASSIFY & TRIAGE", sub: "3-Track Operational Taxonomy", badge_color: "#D97706" },
        { num: "03", title: "RESOLVE BY CAUSE", sub: "HWI, OCR, Forensic & Counterparty", badge_color: "#008C95" },
        { num: "04", title: "CLOSE THE LOOP", sub: "Escalation Matrix & Governance", badge_color: "#D9468D" }
      ],
      container_label: "PHILIPS AS-IS FLOW",
      ingestion_track: [
        {
          id: "node_spec",
          title: "Accounting Specialist",
          sub: "Philips Accounting Lead",
          emote: "spec",
          glow: "rgba(11, 92, 173, 0.15)"
        },
        {
          id: "node_qlik",
          title: "Extract Open-Item Report",
          sub: "Qlik Sense extract  |  Exclude reciprocal matched items.",
          emote: "qlik",
          glow: "rgba(11, 92, 173, 0.15)"
        },
        {
          id: "node_filter",
          title: "Filter by Company Code",
          sub: "Scope validation by entity code",
          emote: "filter",
          glow: "rgba(11, 92, 173, 0.15)"
        },
        {
          id: "node_list",
          title: "List of open items with classification",
          sub: "Consolidated open delta ready for triage taxonomy.\nMaps unreconciled line items into operational resolution tracks.",
          emote: "list",
          glow: "rgba(11, 92, 173, 0.15)"
        }
      ],
      decision_fork: {
        root: {
          title: "Posting not found",
          sub: "Kernel out of scope line",
          emote: "pnf",
          glow: "rgba(11, 92, 173, 0.15)"
        },
        sub_branch_1a: {
          cause: {
            title: "IDoc / OCR Issue",
            sub: "Interface syntax failure",
            emote: "idoc"
          },
          action: {
            title: "Troubleshoot IDoc Using HWI",
            sub: "Execute SAP Hand Work Instructions",
            emote: "hwi",
            chevron: "›",
            chevron_color: "#008C95"
          }
        },
        sub_branch_1b: {
          cause: {
            title: "No EDI / Non-SAP",
            sub: "Paper drop / legacy format",
            emote: "no_edi"
          },
          action: {
            title: "Request / Retrieve Invoice Copy",
            sub: "Auto-fetch PDF via OCR matching",
            emote: "inv",
            chevron: "›",
            chevron_color: "#0B5CAD"
          }
        },
        track_2: {
          cause: {
            title: "Investigate AP-AR sign issue",
            sub: "AR cleared, AP remains open (+/−)",
            emote: "ap_ar"
          },
          action: {
            title: "Review & Analyze Issue",
            sub: "Investigate discrepancy; post clearing journal",
            emote: "review",
            chevron: "›",
            chevron_color: "#D97706"
          }
        },
        track_3: {
          cause: {
            title: "Cash to allocated / AP paid",
            sub: "AR unapplied in reciprocal ERP",
            emote: "cash"
          },
          action: {
            title: "Waiting for Counterparty Action (Clearing)",
            sub: "Pending reciprocal entity ledger clearing",
            emote: "waiting",
            chevron: "›",
            chevron_color: "#D9468D"
          }
        }
      },
      governance_column: {
        gap_card: {
          badge: "GAP DETECTED",
          title: "Reconciliation Discrepancy",
          sub: "Open-item delta isolated between reciprocal Philips entities.",
          emote: "gap"
        },
        notif_card: {
          badge: "ACTION NOTIFICATION",
          title: "Send Action Notification (Email)",
          sub: "Structured notice sent to counterparty accounting lead.",
          emote: "notif"
        },
        escalation_card: {
          badge: "MULTI-TIER ESCALATION",
          title: "No Response → Initiate Escalation (Matrix)",
          emote: "esc",
          tiers: [
            {
              code: "L1",
              hrs: "48h Inaction",
              owner: "Accounting Lead / Processor",
              detail: "Initial SLA alert; re-verify unmatched ledger delta."
            },
            {
              code: "L2",
              hrs: "96h Inaction",
              owner: "FSS Shared Services Manager",
              detail: "Shared services escalation; bilateral review call."
            },
            {
              code: "L3",
              hrs: ">5d / Close",
              owner: "Entity Finance Director",
              detail: "Executive sign-off; post un-cleared accrual & audit note."
            }
          ]
        }
      }
    }
  },

  strategic_roadmap: {
    id: "strategic_roadmap",
    name: "Strategic Transformation Roadmap (3 Horizons)",
    category: "Strategy & Executive",
    description: "3-Horizon acceleration timeline (H1 Now, H2 Next, H3 Future) across 4 workstream lanes with quarterly milestones and strategic ROI metrics.",
    defaultData: {
      template_id: "strategic_roadmap",
      palette: "obsidian_dark",
      branding: {
        company_name: "ENTERPRISE",
        category_subtitle: "3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION",
        logo_key: "microsoft"
      },
      header: {
        title: "STRATEGIC TRANSFORMATION ROADMAP",
        subtitle: "ENTERPRISE  •  3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION",
        date: "Q3 2026",
        slide_no: "02",
        status_text: "APPROVED ROADMAP"
      },
      horizons: [
        { num: "H1", title: "HORIZON 1: NOW (Months 1–6)", sub: "Foundation, Hygiene & Fast-Path Quick Wins", color: "#38BDF8" },
        { num: "H2", title: "HORIZON 2: NEXT (Months 7–18)", sub: "Autonomous Agentic Automation & Scale", color: "#F59E0B" },
        { num: "H3", title: "HORIZON 3: FUTURE (Months 19–36)", sub: "Cognitive Enterprise & Ecosystem Integration", color: "#10B981" }
      ],
      workstreams: [
        {
          id: "ws1",
          name: "ERP & SAP Core",
          emote: "hwi",
          h1: "Clean Core Migration • Automated Journal Reconciliation",
          h2: "Real-time Intercompany Settlement • Cloud ERP Rollout",
          h3: "Autonomous Self-Healing Ledger • Zero-Touch Close"
        },
        {
          id: "ws2",
          name: "Agentic AI & Analytics",
          emote: "tb_robot",
          h1: "Qlik Analytics Catalog • OCR Anomaly Detector",
          h2: "Multi-Agent Exception Resolution • Generative Insights",
          h3: "Predictive Cash Allocation • Continuous Compliance AI"
        },
        {
          id: "ws3",
          name: "Operating Model",
          emote: "spec",
          h1: "GBS Global CoE Alignment • SLA Baseline Matrix",
          h2: "Bilateral Hub Playbooks • Talent Digital Upskilling",
          h3: "Value Realization Cockpit • Global Federated Services"
        },
        {
          id: "ws4",
          name: "Risk & Governance",
          emote: "tb_audit",
          h1: "Statutory Rule Engine • RBAC Granular Security",
          h2: "Continuous Automated Audit Trail • SOX Controls 2.0",
          h3: "Dynamic Real-Time Risk Radar • Autonomous Escrow"
        }
      ],
      metrics: [
        { label: "CYCLE TIME", value: "-68%", sub: "Reconciliation Hours" },
        { label: "AUTO-MATCH", value: "94.2%", sub: "Straight-Through Rate" },
        { label: "OPEX REDUCTION", value: "$4.8M", sub: "Annual Recurring ROI" }
      ]
    }
  },

  operating_model: {
    id: "operating_model",
    name: "Target Operating Model (TOM 3-Tier Architecture)",
    category: "Organization & Governance",
    description: "3-tier functional architecture (Executive Steering, Global Center of Excellence, Shared Service Delivery Hubs) with end-to-end RACI matrix.",
    defaultData: {
      template_id: "operating_model",
      palette: "royal_indigo",
      branding: {
        company_name: "GLOBAL GBS",
        category_subtitle: "TARGET OPERATING MODEL & GOVERNANCE ARCHITECTURE",
        logo_key: "siemens"
      },
      header: {
        title: "TARGET OPERATING MODEL (TOM) ARCHITECTURE",
        subtitle: "GLOBAL GBS  •  3-TIER SERVICE DELIVERY & RACI ACCOUNTABILITY",
        date: "2026",
        slide_no: "03",
        status_text: "TARGET ARCHITECTURE"
      },
      tiers: [
        {
          level: "TIER 1: STRATEGIC STEERING",
          title: "Executive Governance & Policy Council",
          owner: "CFO • VP Global Business Services • Group Controller",
          emote: "tb_dash",
          mandate: "Sets global accounting standards, capital allocation, and annual SLA performance targets."
        },
        {
          level: "TIER 2: CENTER OF EXCELLENCE",
          title: "Global Process Owners & Automation CoE",
          owner: "Process Leads • AI Engineers • Enterprise Architects",
          emote: "tb_rules",
          mandate: "Designs standard workflows, maintains rules engine, and develops AI agent workflows."
        },
        {
          level: "TIER 3: SHARED DELIVERY HUBS",
          title: "Regional Execution & Triage Hubs",
          owner: "Americas Hub • EMEA Hub • APAC Delivery Centers",
          emote: "spec",
          mandate: "Executes day-to-day reconciliation, manages exceptions, and enforces escalation SLAs."
        }
      ],
      raci: [
        { activity: "Policy & Accounting Standards", s: "A / R", c: "C", h: "I" },
        { activity: "Core Rule Engine Calibration", s: "I", c: "A / R", h: "C" },
        { activity: "Day-to-Day Exception Triage", s: "I", c: "C", h: "A / R" },
        { activity: "Executive SLA Escalation (L3)", s: "A", c: "R", h: "C" }
      ]
    }
  },

  data_pipeline: {
    id: "data_pipeline",
    name: "Enterprise AI & Data Architecture Pipeline",
    category: "Technology & AI",
    description: "4-stage pipeline (Ingestion, Unified Lakehouse, Autonomous Agentic AI, Enterprise Consumption) with latency SLAs and security guardrails.",
    defaultData: {
      template_id: "data_pipeline",
      palette: "obsidian_dark",
      branding: {
        company_name: "ENTERPRISE DATA",
        category_subtitle: "AI-POWERED RECONCILIATION DATA PLATFORM",
        logo_key: "google"
      },
      header: {
        title: "ENTERPRISE DATA & AGENTIC AI PIPELINE",
        subtitle: "ENTERPRISE DATA  •  HIGH-THROUGHPUT RECONCILIATION ARCHITECTURE",
        date: "2026",
        slide_no: "04",
        status_text: "SYSTEM BLUEPRINT"
      },
      stages: [
        { num: "01", name: "SOURCE INGESTION", tech: "SAP S/4HANA • Oracle • EDI", emote: "idoc", sla: "< 50ms Latency" },
        { num: "02", name: "UNIFIED LAKEHOUSE", tech: "Delta Parquet • Real-Time CDC", emote: "qlik", sla: "100% ACID Fidelity" },
        { num: "03", name: "AGENTIC AI CORE", tech: "Multi-Agent RAG • Anomaly Triage", emote: "tb_robot", sla: "Autonomous Resolution" },
        { num: "04", name: "CONSUMPTION & ERP", tech: "REST APIs • Automated Clearing", emote: "cash", sla: "Real-Time Posting" }
      ],
      guardrails: [
        { title: "Zero Trust RBAC", detail: "Strict entity isolation and role-based data masking.", emote: "tb_rbac" },
        { title: "Immutable Audit Trail", detail: "Cryptographic logging for every AI decision & manual edit.", emote: "tb_audit" },
        { title: "Continuous SLA Monitor", detail: "Automated alerts if queue latency exceeds 120 seconds.", emote: "tb_ageing" }
      ]
    }
  },

  kpi_scorecard: {
    id: "kpi_scorecard",
    name: "Executive Board KPI & Performance Scorecard",
    category: "Executive & Board",
    description: "4 high-impact KPI cards with RAG health bars, strategic pillar deep-dives, and an accountability action plan.",
    defaultData: {
      template_id: "kpi_scorecard",
      palette: "emerald_fintech",
      branding: {
        company_name: "BOARD OF DIRECTORS",
        category_subtitle: "GLOBAL FINANCIAL OPERATIONS PERFORMANCE SCORECARD",
        logo_key: "apple"
      },
      header: {
        title: "EXECUTIVE PERFORMANCE & KPI SCORECARD",
        subtitle: "BOARD OF DIRECTORS  •  Q3 PERFORMANCE REVIEW & OPERATIONS HEALTH",
        date: "Q3 2026",
        slide_no: "05",
        status_text: "BOARD REPORT"
      },
      kpis: [
        { label: "AUTO-MATCH RATE", value: "96.4%", delta: "+14.2% YoY", rag: "green", emote: "tb_robot", note: "Target: 92%" },
        { label: "CLOSE CYCLE TIME", value: "1.8 Days", delta: "-2.4 Days", rag: "green", emote: "tb_ageing", note: "Target: < 2 Days" },
        { label: "AGED OPEN DELTA", value: "$412K", delta: "-82% QoQ", rag: "amber", emote: "gap", note: "Target: < $250K" },
        { label: "FIRST-PASS RESOLUTION", value: "89.7%", delta: "+8.5% YoY", rag: "green", emote: "review", note: "Target: 85%" }
      ],
      pillars: [
        { name: "Automation & AI Adoption", score: "94%", detail: "Over 820K transactions auto-reconciled monthly with zero human touches." },
        { name: "Governance & Escalation Compliance", score: "98%", detail: "All L1–L3 SLA violations tracked, reviewed, and resolved within policy timeframes." },
        { name: "Audit Cleanliness & SOX Controls", score: "100%", detail: "Zero material deficiencies reported across all 48 operating entities." }
      ]
    }
  }
};
