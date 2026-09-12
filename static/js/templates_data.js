/**
 * Executive Slide Studio - Master Templates & Data Catalog
 * 10 Intricate, Executive-Grade Philips Templates & 46 Transparent Animated Emotes.
 * Absolutely ZERO Blue or Glassmorphic "AI Slop" — Professional Warm Executive Palette.
 */

const PALETTES = {
  executive_blueprint: {
    id: "executive_blueprint",
    name: "Executive Blueprint (Warm Professional)",
    canvas_bg: "#F7F6F3",
    hdr_bg: "#1A1A2E",
    stripe: "#E8734A",
    card_bg: "#FFFFFF",
    card_bd: "#E0DDD7",
    text_primary: "#1A1A2E",
    text_secondary: "#3D3D50",
    text_muted: "#6B6B7B",
    blue_accent: "#2D3B4E",     // Primary dark slate accent (replaces harsh blue)
    blue_bg: "#F0EFEB",         // Light neutral warm card tint
    blue_border: "#D5D2CB",     // Clean warm slate border
    amber_accent: "#C4621A",
    amber_bg: "#FBF3EC",
    amber_border: "#EDCFB3",
    teal_accent: "#1A7A6D",     // Professional sage/spruce
    teal_border: "#B3D9D3",
    rose_accent: "#B5395A",     // Deep executive rose
    rose_bg: "#FBF0F3",
    rose_border: "#E8BFC9",
    red_accent: "#C42B2B",
    red_bg: "#FBF0F0",
    red_border: "#E8C0C0",
    purple_accent: "#5A4E8C",   // Deep warm slate plum
    dashed_border: "#D4D0C8"
  },
  obsidian_dark: {
    id: "obsidian_dark",
    name: "Obsidian Dark Mode (Warm Charcoal)",
    canvas_bg: "#0E0E12",
    hdr_bg: "#161619",
    stripe: "#E8734A",
    card_bg: "#1C1C22",
    card_bd: "rgba(255, 255, 255, 0.1)",
    text_primary: "#EDEDED",
    text_secondary: "#BABABA",
    text_muted: "#777777",
    blue_accent: "#E8734A",     // Primary warm coral accent
    blue_bg: "rgba(232, 115, 74, 0.08)",
    blue_border: "rgba(232, 115, 74, 0.3)",
    amber_accent: "#E0A030",
    amber_bg: "rgba(224, 160, 48, 0.08)",
    amber_border: "rgba(224, 160, 48, 0.3)",
    teal_accent: "#34D399",
    teal_border: "rgba(52, 211, 153, 0.3)",
    rose_accent: "#E84A7A",
    rose_bg: "rgba(232, 74, 122, 0.08)",
    rose_border: "rgba(232, 74, 122, 0.3)",
    red_accent: "#EF4444",
    red_bg: "rgba(239, 68, 68, 0.08)",
    red_border: "rgba(239, 68, 68, 0.3)",
    purple_accent: "#A78BFA",
    dashed_border: "rgba(255, 255, 255, 0.15)"
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
    blue_accent: "#1A6B5A",
    blue_bg: "#EDF5F2",
    blue_border: "#B3D9CF",
    amber_accent: "#C4621A",
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
    name: "Royal Corporate (Deep Plum)",
    canvas_bg: "#F6F5F8",
    hdr_bg: "#1E1830",
    stripe: "#8B5CF6",
    card_bg: "#FFFFFF",
    card_bd: "#DDD8E6",
    text_primary: "#1E1830",
    text_secondary: "#3D3555",
    text_muted: "#6E6680",
    blue_accent: "#5A4E8C",
    blue_bg: "#F3F1F8",
    blue_border: "#CFCBE0",
    amber_accent: "#C4621A",
    amber_bg: "#FBF5EE",
    amber_border: "#EDCFB3",
    teal_accent: "#0D9488",
    teal_border: "#99F6E4",
    rose_accent: "#B5395A",
    rose_bg: "#FBF0F3",
    rose_border: "#E8BFC9",
    red_accent: "#C42B2B",
    red_bg: "#FBF0F0",
    red_border: "#E8C0C0",
    purple_accent: "#7C3AED",
    dashed_border: "#D4CEE0"
  }
};

const EMOTES_CATALOG = [
  // Original 24 Emotes
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
  { id: "tb_write", name: "Document Authoring", category: "Operations", filename: "tb_write.gif" },

  // 22 New Curated Emotes (Total: 46)
  { id: "calc", name: "Month-End Calculator", category: "Finance", filename: "calc.gif" },
  { id: "ledger", name: "General Ledger & Accruals", category: "Finance", filename: "ledger.gif" },
  { id: "stamp", name: "Executive Sign-Off & Stamp", category: "Governance", filename: "stamp.gif" },
  { id: "chart_up", name: "Financial Trajectory & Growth", category: "Analytics", filename: "chart_up.gif" },
  { id: "currency", name: "Multi-Currency & FX Settlement", category: "Finance", filename: "currency.gif" },
  { id: "handshake", name: "Vendor Partnership & Contract", category: "Vendor", filename: "handshake.gif" },
  { id: "po_doc", name: "Purchase Order Agreement", category: "Procurement", filename: "po_doc.gif" },
  { id: "truck", name: "Logistics & Goods Receipt", category: "Supply Chain", filename: "truck.gif" },
  { id: "scan_doc", name: "OCR Invoice Scanner", category: "Operations", filename: "scan_doc.gif" },
  { id: "payment", name: "Payment Release & Wire", category: "Finance", filename: "payment.gif" },
  { id: "server", name: "HealthSuite Cloud Infrastructure", category: "IT & Cloud", filename: "server.gif" },
  { id: "ticket", name: "ITIL Support Incident", category: "Operations", filename: "ticket.gif" },
  { id: "monitor", name: "System Telemetry & Health", category: "IT & Cloud", filename: "monitor.gif" },
  { id: "shield", name: "Enterprise Risk & SOX Shield", category: "Governance", filename: "shield.gif" },
  { id: "warning", name: "KRI Critical Alert", category: "Risk", filename: "warning.gif" },
  { id: "checkmark", name: "Audit Compliance Pass", category: "Governance", filename: "checkmark.gif" },
  { id: "radar", name: "Continuous Risk Radar", category: "Risk", filename: "radar.gif" },
  { id: "user", name: "Clinical Practitioner / Persona", category: "Customer", filename: "user.gif" },
  { id: "cart", name: "Procurement Catalog Cart", category: "Procurement", filename: "cart.gif" },
  { id: "chat", name: "Clinical Support Chat", category: "Operations", filename: "chat.gif" },
  { id: "heart", name: "Patient & Clinician Satisfaction", category: "Experience", filename: "heart.gif" },
  { id: "gear", name: "Process Automation Engine", category: "Automation", filename: "gear.gif" }
];

const TEMPLATES_CONFIG = {
  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 1: PHILIPS ICA RECONCILIATION AS-IS BLUEPRINT (FLAGSHIP)
  // ──────────────────────────────────────────────────────────────────────────
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
        { num: "01", title: "INGESTION & SCOPE", sub: "Qlik Sense Extract & Filtering", badge_color: "#2D3B4E" },
        { num: "02", title: "CLASSIFY & TRIAGE", sub: "3-Track Operational Taxonomy", badge_color: "#D97706" },
        { num: "03", title: "RESOLVE BY CAUSE", sub: "HWI, OCR, Forensic & Counterparty", badge_color: "#1A7A6D" },
        { num: "04", title: "CLOSE THE LOOP", sub: "Escalation Matrix & Governance", badge_color: "#B5395A" }
      ],
      container_label: "PHILIPS AS-IS FLOW",
      ingestion_track: [
        { id: "node_spec", title: "Accounting Specialist", sub: "Philips Accounting Lead", emote: "spec" },
        { id: "node_qlik", title: "Extract Open-Item Report", sub: "Qlik Sense extract  |  Exclude reciprocal matched items.", emote: "qlik" },
        { id: "node_filter", title: "Filter by Company Code", sub: "Scope validation by entity code", emote: "filter" },
        { id: "node_list", title: "List of open items with classification", sub: "Consolidated open delta ready for triage taxonomy.\nMaps unreconciled line items into operational resolution tracks.", emote: "list" }
      ],
      decision_fork: {
        root: { title: "Posting not found", sub: "Kernel out of scope line", emote: "pnf" },
        sub_branch_1a: {
          cause: { title: "IDoc / OCR Issue", sub: "Interface syntax failure", emote: "idoc" },
          action: { title: "Troubleshoot IDoc Using HWI", sub: "Execute SAP Hand Work Instructions", emote: "hwi", chevron: "›", chevron_color: "#1A7A6D" }
        },
        sub_branch_1b: {
          cause: { title: "No EDI / Non-SAP", sub: "Paper drop / legacy format", emote: "no_edi" },
          action: { title: "Request / Retrieve Invoice Copy", sub: "Auto-fetch PDF via OCR matching", emote: "inv", chevron: "›", chevron_color: "#2D3B4E" }
        },
        track_2: {
          cause: { title: "Investigate AP-AR sign issue", sub: "AR cleared, AP remains open (+/−)", emote: "ap_ar" },
          action: { title: "Review & Analyze Issue", sub: "Investigate discrepancy; post clearing journal", emote: "review", chevron: "›", chevron_color: "#D97706" }
        },
        track_3: {
          cause: { title: "Cash to allocated / AP paid", sub: "AR unapplied in reciprocal ERP", emote: "cash" },
          action: { title: "Waiting for Counterparty Action (Clearing)", sub: "Pending reciprocal entity ledger clearing", emote: "waiting", chevron: "›", chevron_color: "#B5395A" }
        }
      },
      governance_column: {
        gap_card: { badge: "GAP DETECTED", title: "Reconciliation Discrepancy", sub: "Open-item delta isolated between reciprocal Philips entities.", emote: "gap" },
        notif_card: { badge: "ACTION NOTIFICATION", title: "Send Action Notification (Email)", sub: "Structured notice sent to counterparty accounting lead.", emote: "notif" },
        escalation_card: {
          badge: "MULTI-TIER ESCALATION",
          title: "No Response → Initiate Escalation (Matrix)",
          emote: "esc",
          tiers: [
            { code: "L1", hrs: "48h Inaction", owner: "Accounting Lead / Processor", detail: "Initial SLA alert; re-verify unmatched ledger delta." },
            { code: "L2", hrs: "96h Inaction", owner: "FSS Shared Services Manager", detail: "Shared services escalation; bilateral review call." },
            { code: "L3", hrs: ">5d / Close", owner: "Entity Finance Director", detail: "Executive sign-off; post un-cleared accrual & audit note." }
          ]
        }
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 2: PHILIPS HEALTHTECH STRATEGIC ROADMAP (3 HORIZONS)
  // ──────────────────────────────────────────────────────────────────────────
  strategic_roadmap: {
    id: "strategic_roadmap",
    name: "Strategic Transformation Roadmap (3 Horizons)",
    category: "Strategy & Executive",
    description: "3-Horizon acceleration timeline (H1 Now, H2 Next, H3 Future) across 4 workstream lanes with quarterly milestones and strategic ROI metrics.",
    defaultData: {
      template_id: "strategic_roadmap",
      palette: "obsidian_dark",
      branding: {
        company_name: "PHILIPS HEALTHCARE",
        category_subtitle: "3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION",
        logo_key: "philips"
      },
      header: {
        title: "PHILIPS STRATEGIC TRANSFORMATION ROADMAP",
        subtitle: "PHILIPS HEALTHCARE  •  3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION",
        date: "Q3 2026",
        slide_no: "02",
        status_text: "APPROVED ROADMAP"
      },
      horizons: [
        { num: "H1", title: "HORIZON 1: NOW (Months 1–6)", sub: "Foundation, Core SAP Hygiene & Quick Wins", color: "#E8734A" },
        { num: "H2", title: "HORIZON 2: NEXT (Months 7–18)", sub: "Autonomous Agentic Automation & Scale", color: "#E0A030" },
        { num: "H3", title: "HORIZON 3: FUTURE (Months 19–36)", sub: "Cognitive Healthcare Enterprise & Interconnect", color: "#34D399" }
      ],
      workstreams: [
        {
          id: "ws1",
          name: "ERP & SAP Core",
          emote: "hwi",
          h1: "Clean Core Migration • Automated Journal Reconciliation",
          h2: "Real-time Intercompany Settlement • Cloud S/4HANA Rollout",
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
          h1: "Philips GBS Global CoE Alignment • SLA Baseline Matrix",
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
        { label: "OPEX REDUCTION", value: "€4.8M", sub: "Annual Recurring ROI" }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 3: PHILIPS TARGET OPERATING MODEL (TOM 3-TIER ARCHITECTURE)
  // ──────────────────────────────────────────────────────────────────────────
  operating_model: {
    id: "operating_model",
    name: "Target Operating Model (TOM 3-Tier Architecture)",
    category: "Organization & Governance",
    description: "3-tier functional architecture (Executive Steering, Global Center of Excellence, Shared Service Delivery Hubs) with end-to-end RACI matrix.",
    defaultData: {
      template_id: "operating_model",
      palette: "executive_blueprint",
      branding: {
        company_name: "PHILIPS GBS",
        category_subtitle: "TARGET OPERATING MODEL & GOVERNANCE ARCHITECTURE",
        logo_key: "philips"
      },
      header: {
        title: "PHILIPS TARGET OPERATING MODEL (TOM) ARCHITECTURE",
        subtitle: "PHILIPS GLOBAL BUSINESS SERVICES  •  3-TIER SERVICE DELIVERY & RACI ACCOUNTABILITY",
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
          mandate: "Sets global accounting standards, capital allocation, and annual SLA performance targets across all Philips entities."
        },
        {
          level: "TIER 2: CENTER OF EXCELLENCE",
          title: "Global Process Owners & Automation CoE",
          owner: "Process Leads • AI Engineers • Enterprise Architects",
          emote: "tb_rules",
          mandate: "Designs standardized workflows, calibrates rules engine, and builds autonomous agent exception handlers."
        },
        {
          level: "TIER 3: SHARED DELIVERY HUBS",
          title: "Regional Execution & Triage Hubs",
          owner: "Amsterdam Hub • Panama Hub • Chennai Delivery Center",
          emote: "spec",
          mandate: "Executes daily bilateral reconciliation, resolves transactional exceptions, and enforces escalation SLAs."
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

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 4: PHILIPS HEALTHSUITE AI & DATA PIPELINE
  // ──────────────────────────────────────────────────────────────────────────
  data_pipeline: {
    id: "data_pipeline",
    name: "Enterprise AI & Data Architecture Pipeline",
    category: "Technology & AI",
    description: "4-stage pipeline (Ingestion, Unified Lakehouse, Autonomous Agentic AI, Enterprise Consumption) with latency SLAs and security guardrails.",
    defaultData: {
      template_id: "data_pipeline",
      palette: "obsidian_dark",
      branding: {
        company_name: "PHILIPS HEALTHSUITE",
        category_subtitle: "AI-POWERED RECONCILIATION DATA PLATFORM",
        logo_key: "philips"
      },
      header: {
        title: "PHILIPS HEALTHSUITE DATA & AGENTIC AI PIPELINE",
        subtitle: "PHILIPS HEALTHSUITE  •  HIGH-THROUGHPUT RECONCILIATION & DATA FABRIC",
        date: "2026",
        slide_no: "04",
        status_text: "SYSTEM BLUEPRINT"
      },
      stages: [
        { num: "01", name: "SOURCE INGESTION", tech: "SAP S/4HANA • EDI Gateway • Qlik", emote: "idoc", sla: "< 50ms Latency" },
        { num: "02", name: "UNIFIED LAKEHOUSE", tech: "Delta Parquet • Real-Time CDC Hub", emote: "qlik", sla: "100% ACID Fidelity" },
        { num: "03", name: "AGENTIC AI CORE", tech: "Multi-Agent RAG • Anomaly Triage Bot", emote: "tb_robot", sla: "Autonomous Resolution" },
        { num: "04", name: "CONSUMPTION & ERP", tech: "REST APIs • Automated SAP Clearing", emote: "cash", sla: "Real-Time Posting" }
      ],
      guardrails: [
        { title: "Zero Trust RBAC", detail: "Strict entity isolation and role-based data masking across 48 Philips operating entities.", emote: "tb_rbac" },
        { title: "Immutable Audit Trail", detail: "Cryptographic logging for every AI decision & manual transaction edit.", emote: "tb_audit" },
        { title: "Continuous SLA Monitor", detail: "Automated alerts if queue latency or exception aging exceeds policy limits.", emote: "tb_ageing" }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 5: ROYAL PHILIPS EXECUTIVE BOARD KPI SCORECARD
  // ──────────────────────────────────────────────────────────────────────────
  kpi_scorecard: {
    id: "kpi_scorecard",
    name: "Executive Board KPI & Performance Scorecard",
    category: "Executive & Board",
    description: "4 high-impact KPI cards with RAG health bars, strategic pillar deep-dives, and an accountability action plan.",
    defaultData: {
      template_id: "kpi_scorecard",
      palette: "emerald_fintech",
      branding: {
        company_name: "ROYAL PHILIPS BOARD",
        category_subtitle: "GLOBAL FINANCIAL OPERATIONS PERFORMANCE SCORECARD",
        logo_key: "philips"
      },
      header: {
        title: "ROYAL PHILIPS OPERATIONS & KPI SCORECARD",
        subtitle: "EXECUTIVE BOARD REVIEW  •  GLOBAL RECONCILIATION & OPERATIONS HEALTH",
        date: "Q3 2026",
        slide_no: "05",
        status_text: "BOARD REPORT"
      },
      kpis: [
        { label: "AUTO-MATCH RATE", value: "96.4%", delta: "+14.2% YoY", rag: "green", emote: "tb_robot", note: "Target: 92%" },
        { label: "CLOSE CYCLE TIME", value: "1.8 Days", delta: "-2.4 Days", rag: "green", emote: "tb_ageing", note: "Target: < 2 Days" },
        { label: "AGED OPEN DELTA", value: "€380K", delta: "-82% QoQ", rag: "amber", emote: "gap", note: "Target: < €250K" },
        { label: "FIRST-PASS RESOLUTION", value: "89.7%", delta: "+8.5% YoY", rag: "green", emote: "review", note: "Target: 85%" }
      ],
      pillars: [
        { name: "Automation & AI Adoption", score: "94%", detail: "Over 820K transactions auto-reconciled monthly across global Philips hubs with zero human touches." },
        { name: "Governance & Escalation Compliance", score: "98%", detail: "All L1–L3 SLA violations tracked, reviewed, and resolved within policy timeframes." },
        { name: "Audit Cleanliness & SOX Controls", score: "100%", detail: "Zero material deficiencies reported across all operating legal entities." }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 6: PHILIPS MONTH-END FINANCIAL CLOSE & SETTLEMENT PIPELINE
  // ──────────────────────────────────────────────────────────────────────────
  financial_close: {
    id: "financial_close",
    name: "Month-End Financial Close & Reconciliation Pipeline",
    category: "Operations Architecture",
    description: "4-phase horizontal close cycle (Sub-Ledger Close → Intercompany Settlement → Consolidation → Board Sign-Off) with exception forks and escalation SLAs.",
    defaultData: {
      template_id: "financial_close",
      palette: "executive_blueprint",
      branding: {
        company_name: "PHILIPS GLOBAL FINANCE",
        category_subtitle: "MONTH-END CLOSE & INTERCOMPANY SETTLEMENT PIPELINE",
        logo_key: "philips"
      },
      header: {
        title: "MONTH-END FINANCIAL CLOSE  |  SETTLEMENT PIPELINE",
        subtitle: "PHILIPS GLOBAL FINANCE  •  AUTOMATED RECONCILIATION & GOVERNANCE GATEWAY",
        date: "Fiscal Year 2026",
        slide_no: "06",
        status_text: "CLOSE RUNBOOK"
      },
      phases: [
        { phase: "PHASE 01", days: "WD -2 to WD 0", title: "Sub-Ledger Cutoff", sub: "GL, AP, AR, Asset Postings", emote: "calc", status: "COMPLETE" },
        { phase: "PHASE 02", days: "WD +1 to WD +2", title: "Bilateral Matching", sub: "Intercompany Invoicing & FX", emote: "currency", status: "AUTOMATED" },
        { phase: "PHASE 03", days: "WD +3 to WD +4", title: "Consolidation & Eliminations", sub: "Group Ledger & Currency Matrix", emote: "ledger", status: "IN PROGRESS" },
        { phase: "PHASE 04", days: "WD +5 Close", title: "Sign-Off & Distribution", sub: "Executive Management Pack", emote: "stamp", status: "PLANNED" }
      ],
      nodes: [
        { id: "fc_node1", stage: 1, title: "Sub-Ledger Ingestion", desc: "Lock transactional sub-ledgers across 48 entities", emote: "calc", badge: "LOCK" },
        { id: "fc_node2", stage: 1, title: "Accruals & Prepayments", desc: "Automated standard recurring journals", emote: "ledger", badge: "POST" },
        { id: "fc_node3", stage: 2, title: "Intercompany Run", desc: "Execute bilateral automated settlement runs", emote: "currency", badge: "MATCH" },
        { id: "fc_node4", stage: 2, title: "Discrepancy Triage", desc: "Route unallocated items > €10K to fast track", emote: "gap", badge: "TRIAGE" },
        { id: "fc_node5", stage: 3, title: "Trial Balance Rollup", desc: "Automated group currency consolidation", emote: "chart_up", badge: "CONSOLIDATE" },
        { id: "fc_node6", stage: 4, title: "CFO & Controller Sign-Off", desc: "Audit trail certification and board release", emote: "stamp", badge: "AUDIT" }
      ],
      gateways: {
        threshold: "€25,000 Materiality Delta Limit",
        sla: "4-Hour Critical Variance Escalation",
        approver: "VP Group Accounting & Reporting"
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 7: PHILIPS PROCURE-TO-PAY (P2P) & VENDOR WORKFLOW
  // ──────────────────────────────────────────────────────────────────────────
  vendor_p2p: {
    id: "vendor_p2p",
    name: "Procure-to-Pay (P2P) & Vendor Logistics Workflow",
    category: "Operations Architecture",
    description: "5-stage procurement lifecycle (Vendor Onboard → PO Sourcing → Goods Receipt → 3-Way Invoice Match → Payment Release) with dispute handling.",
    defaultData: {
      template_id: "vendor_p2p",
      palette: "executive_blueprint",
      branding: {
        company_name: "PHILIPS SUPPLY CHAIN",
        category_subtitle: "PROCURE-TO-PAY (P2P) END-TO-END LIFECYCLE",
        logo_key: "philips"
      },
      header: {
        title: "PROCURE-TO-PAY (P2P)  |  VENDOR LIFECYCLE & SETTLEMENT",
        subtitle: "PHILIPS PROCUREMENT & SUPPLY CHAIN  •  AUTOMATED 3-WAY MATCH & EXCEPTION FLOW",
        date: "2026",
        slide_no: "07",
        status_text: "P2P RUNBOOK"
      },
      steps: [
        { num: "01", title: "Vendor Onboarding", sub: "KYC, Tax & Sanction Checks", emote: "handshake" },
        { num: "02", title: "Sourcing & Purchase Order", sub: "Automated PO dispatch in SAP", emote: "po_doc" },
        { num: "03", title: "Goods Receipt (GR/IR)", sub: "Barcode scan & warehouse confirmation", emote: "truck" },
        { num: "04", title: "OCR Invoice Extraction", sub: "3-Way Line Matching Engine", emote: "scan_doc" },
        { num: "05", title: "Payment Release", sub: "Electronic Funds Transfer (EFT)", emote: "payment" }
      ],
      exception_flow: {
        title: "Discrepancy Resolution Track",
        trigger: "Price or Quantity Variance > 1.5%",
        resolution: "Automated Buyer Clarification Workflow → 48h Supplier Credit Note",
        emote: "warning"
      },
      vendor_scorecard: {
        on_time_delivery: "98.2%",
        match_accuracy: "99.1%",
        touchless_rate: "91.4%"
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 8: PHILIPS IT SERVICE DELIVERY ARCHITECTURE (ITIL)
  // ──────────────────────────────────────────────────────────────────────────
  it_service: {
    id: "it_service",
    name: "IT Service Management & Incident Resolution Architecture",
    category: "Organization & IT",
    description: "Tiered ITIL support flow (L0 Self-Service → L1 Service Desk → L2 Technical Support → L3 Engineering) with Major Incident Management SLAs.",
    defaultData: {
      template_id: "it_service",
      palette: "obsidian_dark",
      branding: {
        company_name: "PHILIPS ENTERPRISE IT",
        category_subtitle: "HEALTHSUITE INCIDENT-TO-RESOLUTION ARCHITECTURE",
        logo_key: "philips"
      },
      header: {
        title: "IT SERVICE MANAGEMENT  |  INCIDENT-TO-RESOLUTION ARCHITECTURE",
        subtitle: "PHILIPS ITIL FRAMEWORK  •  MULTI-TIER TRIAGE, TELEMETRY & ESCALATION",
        date: "2026",
        slide_no: "08",
        status_text: "ITIL ARCHITECTURE"
      },
      tiers: [
        { level: "L0", name: "HealthSuite Self-Service", desc: "Automated diagnostic bots & knowledge base", emote: "tb_robot", sla: "Instant (< 1m)" },
        { level: "L1", name: "Global Service Desk", desc: "First-contact triage, ticket routing & password resets", emote: "ticket", sla: "< 15m Response" },
        { level: "L2", name: "Application & Cloud Support", desc: "Deep diagnostics, SAP connectivity & data sync", emote: "server", sla: "< 2h Resolution" },
        { level: "L3", name: "Core Platform Engineering", desc: "Code defect remediation & kernel infrastructure", emote: "monitor", sla: "< 4h P1 Resolution" }
      ],
      major_incident: {
        title: "Major Incident Management (MIM)",
        trigger: "P1 Critical HealthSuite Cloud Outage",
        actions: "Command bridge spun up in 5m; executive briefing every 30m; automated roll-forward patch.",
        emote: "warning"
      },
      slas: [
        { prio: "P1 Critical", resp: "15 min", res: "4 hours", uptime: "99.99%" },
        { prio: "P2 High", resp: "30 min", res: "8 hours", uptime: "99.95%" },
        { prio: "P3 Medium", resp: "2 hours", res: "24 hours", uptime: "99.90%" }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 9: PHILIPS 5x5 ENTERPRISE RISK & COMPLIANCE MATRIX
  // ──────────────────────────────────────────────────────────────────────────
  risk_compliance: {
    id: "risk_compliance",
    name: "Enterprise Risk & Compliance 5x5 Control Matrix",
    category: "Technology & Risk",
    description: "5×5 risk matrix (Likelihood × Impact) with plotted risk vectors, automated SOX control testing, and Key Risk Indicators (KRI).",
    defaultData: {
      template_id: "risk_compliance",
      palette: "executive_blueprint",
      branding: {
        company_name: "PHILIPS QUALITY & REGULATORY",
        category_subtitle: "ENTERPRISE RISK MANAGEMENT & SOX COMPLIANCE",
        logo_key: "philips"
      },
      header: {
        title: "ENTERPRISE RISK & COMPLIANCE  |  5x5 CONTROL MATRIX",
        subtitle: "PHILIPS REGULATORY & SOX CONTROLS  •  CONTINUOUS RISK RADAR & CONTROL TESTING",
        date: "Q3 2026",
        slide_no: "09",
        status_text: "RISK RADAR"
      },
      risk_vectors: [
        { id: "R1", name: "Unmatched Foreign Exchange Exposure", x: 4, y: 3, level: "HIGH", owner: "Treasury Lead", emote: "currency" },
        { id: "R2", name: "Delayed Month-End Sign-Off", x: 3, y: 2, level: "MED", owner: "Accounting Controller", emote: "tb_ageing" },
        { id: "R3", name: "Interface IDoc Syntax Failure", x: 2, y: 4, level: "MED", owner: "Integration Architect", emote: "idoc" },
        { id: "R4", name: "Unauthorized System Override", x: 1, y: 5, level: "CRITICAL", owner: "Internal Audit Lead", emote: "tb_rbac" },
        { id: "R5", name: "Regulatory SOX Non-Compliance", x: 2, y: 5, level: "CRITICAL", owner: "VP Compliance", emote: "shield" }
      ],
      control_pillars: [
        { name: "Preventative Controls", desc: "Automated SAP validation gates preventing invalid journal lines.", emote: "shield", pass: "100%" },
        { name: "Detective Controls", desc: "Continuous daily exception scanning across bilateral ledgers.", emote: "radar", pass: "99.4%" },
        { name: "Corrective Controls", desc: "Structured 3-tier escalation matrix with audit-certified logging.", emote: "checkmark", pass: "100%" }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TEMPLATE 10: PHILIPS HEALTHCARE CUSTOMER & CLINICAL JOURNEY
  // ──────────────────────────────────────────────────────────────────────────
  customer_journey: {
    id: "customer_journey",
    name: "Customer Experience & Clinical Touchpoint Journey",
    category: "Technology & Risk",
    description: "6-phase clinical customer lifecycle (Awareness → Evaluation → Procurement → Clinical Onboarding → Continuous Operation → Renewal) with emotion curve.",
    defaultData: {
      template_id: "customer_journey",
      palette: "executive_blueprint",
      branding: {
        company_name: "PHILIPS HEALTHCARE SOLUTIONS",
        category_subtitle: "CLINICAL TOUCHPOINT & CUSTOMER LIFECYCLE",
        logo_key: "philips"
      },
      header: {
        title: "CLINICAL EXPERIENCE  |  CUSTOMER TOUCHPOINT JOURNEY MAP",
        subtitle: "PHILIPS HEALTHCARE SOLUTIONS  •  HOSPITAL & CLINICIAN LIFECYCLE ARCHITECTURE",
        date: "2026",
        slide_no: "10",
        status_text: "JOURNEY BLUEPRINT"
      },
      stages: [
        { phase: "01. AWARENESS", title: "Clinical Need", action: "Clinician discovers connected health technology", emote: "user", score: "+82 NPS" },
        { phase: "02. EVALUATION", title: "Hospital RFP", action: "Biomedical engineering technical evaluation", emote: "chat", score: "+78 NPS" },
        { phase: "03. PROCUREMENT", title: "Contracting", action: "Enterprise supply contract & PO release", emote: "cart", score: "+85 NPS" },
        { phase: "04. ONBOARDING", title: "Installation", action: "HealthSuite clinical integration & staff training", emote: "gear", score: "+92 NPS" },
        { phase: "05. OPERATION", title: "Live Diagnostic", action: "Real-time patient monitoring & uptime telemetry", emote: "monitor", score: "+96 NPS" },
        { phase: "06. ADVOCACY", title: "Care Renewal", action: "Expansion to multi-site hospital network", emote: "heart", score: "+94 NPS" }
      ],
      kpis: [
        { label: "CLINICAL NPS", val: "+89", sub: "Hospital Satisfaction" },
        { label: "ONBOARD TIME", val: "14 Days", sub: "Full Integration" },
        { label: "RETENTION", val: "99.1%", sub: "Annual Renewals" }
      ]
    }
  }
};
