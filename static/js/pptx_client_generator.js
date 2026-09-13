/**
 * Client-side Presentation Generator using PptxGenJS
 * Compiles exact 16:9 Philips Executive Master Blueprints into native .pptx
 * Supports all 10 executive presentation templates with 2.0 pt DrawingML connectors.
 * Dynamically resolves warm palettes — ABSOLUTELY ZERO hardcoded blue AI slop!
 */

class ClientPptxGenerator {
  static async generate(data, options = {}) {
    if (typeof PptxGenJS === "undefined") {
      throw new Error("PptxGenJS library is not loaded");
    }

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE"; // Exact 13.333 x 7.50 inches (16:9 executive widescreen standard)

    const paletteKey = data.palette || "executive_blueprint";
    const C = (typeof PALETTES !== "undefined" && PALETTES[paletteKey]) ? PALETTES[paletteKey] : {
      canvas_bg: "#F7F6F3",
      hdr_bg: "#1A1A2E",
      stripe: "#E8734A",
      card_bg: "#FFFFFF",
      card_bd: "#E0DDD7",
      text_primary: "#1A1A2E",
      text_secondary: "#3D3D50",
      text_muted: "#6B6B7B",
      blue_accent: "#2D3B4E",
      blue_bg: "#F0EFEB",
      blue_border: "#D5D2CB",
      amber_accent: "#C4621A",
      amber_bg: "#FBF3EC",
      amber_border: "#EDCFB3",
      teal_accent: "#1A7A6D",
      teal_border: "#B3D9D3",
      rose_accent: "#B5395A",
      rose_bg: "#FBF0F3",
      rose_border: "#E8BFC9",
      red_accent: "#C42B2B",
      red_bg: "#FBF0F0",
      red_border: "#E8C0C0",
      purple_accent: "#5A4E8C",
      dashed_border: "#D4D0C8"
    };

    const templateId = data.template_id || "process_flow";
    const stageNames = this.getStageNamesForTemplate(templateId);
    const baseSub = (data.header && data.header.subtitle) ? data.header.subtitle : "PHILIPS EXECUTIVE SUITE";
    const singleSlideOnly = options.singleSlideOnly || false;

    // ──────────────────────────────────────────────────────────────────────────
    // SLIDE 1: MASTER ARCHITECTURE BLUEPRINT (100% COMPLETE EXECUTIVE VIEW)
    // ──────────────────────────────────────────────────────────────────────────
    const masterData = JSON.parse(JSON.stringify(data));
    masterData.header = masterData.header || {};
    masterData.header.subtitle = `${baseSub}  •  MASTER ARCHITECTURE BLUEPRINT (ALL STAGES ACTIVE)`;
    this.buildTemplate(pptx, templateId, masterData, C, 0);

    if (!singleSlideOnly) {
      // ──────────────────────────────────────────────────────────────────────────
      // SLIDES 2 to 6: PROGRESSIVE STAGE FOCUS (FULL ARCHITECTURE + STAGE HIGHLIGHT)
      // ──────────────────────────────────────────────────────────────────────────
      for (let s = 1; s <= 5; s++) {
        const slideData = JSON.parse(JSON.stringify(data));
        slideData.header = slideData.header || {};
        const stageTitle = stageNames[s - 1] || `Stage ${s} Flow`;
        slideData.header.subtitle = `${baseSub}  •  STAGE ${s} IN FOCUS: ${stageTitle.toUpperCase()}`;
        // Render the complete architecture with active spotlighting on stage s
        this.buildTemplate(pptx, templateId, slideData, C, s);
      }
    }

    const filename = this.getFilenameForTemplate(templateId);

    // Inject OpenXML native transitions into package via JSZip (Zero Blank Screens, Zero Click Locks)
    try {
      if (typeof JSZip !== "undefined") {
        const arrayBuffer = await pptx.write("arraybuffer");
        const blob = await this.injectTimingAnimations(arrayBuffer);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.warn("Direct buffer download fallback:", e);
    }

    return pptx.writeFile({ fileName: filename });
  }

  static async injectTimingAnimations(arrayBuffer) {
    if (typeof JSZip === "undefined") return arrayBuffer;
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const slideFiles = Object.keys(zip.files).filter(f => f.startsWith("ppt/slides/slide") && f.endsWith(".xml"));

      for (const slidePath of slideFiles) {
        let slideXml = await zip.file(slidePath).async("text");

        // 1. Strip any legacy shape-level entrance timing that causes blank screens & click-locks
        if (slideXml.includes("<p:timing>")) {
          slideXml = slideXml.replace(/<p:timing>[\s\S]*?<\/p:timing>/g, "");
        }

        // 2. Inject native executive slide cross-fade transition for instant, silk-smooth presentation flow
        if (!slideXml.includes("<p:transition")) {
          const transXml = `<p:transition speed="med"><p:fade/></p:transition>`;
          slideXml = slideXml.replace("</p:sld>", transXml + "</p:sld>");
        }

        zip.file(slidePath, slideXml);
      }

      return await zip.generateAsync(typeof Blob !== "undefined" ? { type: "blob" } : { type: "nodebuffer" });
    } catch (e) {
      console.warn("Transition injection error:", e);
      return arrayBuffer;
    }
  }

  static buildTemplate(pptx, templateId, data, C, stageLimit = 5) {
    switch (templateId) {
      case "strategic_roadmap":
        this.buildStrategicRoadmap(pptx, data, C, stageLimit);
        break;
      case "operating_model":
        this.buildOperatingModel(pptx, data, C, stageLimit);
        break;
      case "data_pipeline":
        this.buildDataPipeline(pptx, data, C, stageLimit);
        break;
      case "kpi_scorecard":
        this.buildKpiScorecard(pptx, data, C, stageLimit);
        break;
      case "financial_close":
        this.buildFinancialClose(pptx, data, C, stageLimit);
        break;
      case "vendor_p2p":
        this.buildVendorP2P(pptx, data, C, stageLimit);
        break;
      case "it_service":
        this.buildITService(pptx, data, C, stageLimit);
        break;
      case "risk_compliance":
        this.buildRiskCompliance(pptx, data, C, stageLimit);
        break;
      case "customer_journey":
        this.buildCustomerJourney(pptx, data, C, stageLimit);
        break;
      case "change_mgmt":
        this.buildChangeMgmt(pptx, data, C, stageLimit);
        break;
      case "swot_analysis":
        this.buildSwotAnalysis(pptx, data, C, stageLimit);
        break;
      case "project_timeline":
        this.buildProjectTimeline(pptx, data, C, stageLimit);
        break;
      case "org_chart":
        this.buildOrgChart(pptx, data, C, stageLimit);
        break;
      case "budget_waterfall":
        this.buildBudgetWaterfall(pptx, data, C, stageLimit);
        break;
      case "process_flow":
      default:
        this.buildProcessFlow(pptx, data, C, stageLimit);
        break;
    }
  }

  static getStageNamesForTemplate(templateId) {
    switch (templateId) {
      case "financial_close":
        return [
          "Stage 1: Close Phases & Ingestion Timeline",
          "Stage 2: Reconciliation & 3-Way Matching Runbook",
          "Stage 3: Auto-Clearing & Exception Handling",
          "Stage 4: Settlement Velocity & Performance Speed",
          "Stage 5: Close Governance & Materiality SLA Gateways"
        ];
      case "vendor_p2p":
        return [
          "Stage 1: Purchase Requisition & PO Issuance",
          "Stage 2: Logistics & Goods Receipt (GR) Tracking",
          "Stage 3: SAP 3-Way Matching Pipeline (PO vs GR vs IR)",
          "Stage 4: Invoice Clearance & Variance Tolerance",
          "Stage 5: Vendor Scorecard & Automated Payment Gateways"
        ];
      case "strategic_roadmap":
        return [
          "Horizon 1: Immediate Core Platform Modernization",
          "Horizon 2: Next-Gen Scaled Enterprise Expansion",
          "Horizon 3: Disruptive Vision & Autonomous Moonshots",
          "Strategic Enablers: Architecture & Org Alignment",
          "Enterprise Governance: Capital Allocation & Milestones"
        ];
      case "operating_model":
        return [
          "Tier 1: Strategic Governance & Executive Steering",
          "Tier 2: Business Unit Delivery & Execution Engines",
          "Tier 3: Platform Architecture & Global Shared Services",
          "Cross-Functional Handshakes & Decision Gates",
          "Master TOM Operating Model & Value Stream Realization"
        ];
      case "data_pipeline":
        return [
          "Layer 1: Multi-Modal Ingestion (EHR, Telemetry, DICOM)",
          "Layer 2: Compliance Normalization & HIPAA Boundary",
          "Layer 3: Enterprise Lakehouse & Storage Engine",
          "Layer 4: Agentic AI Inference & ML Orchestration",
          "Layer 5: Clinical Action Gateways & Executive Analytics"
        ];
      case "kpi_scorecard":
        return [
          "Dimension 1: Financial Performance & Margin Growth",
          "Dimension 2: Operational Velocity & Quality SLAs",
          "Dimension 3: Patient Experience & Customer Satisfaction",
          "Dimension 4: Innovation & Digital Platform Maturity",
          "Executive Board KPI Dashboard & Governance Review"
        ];
      case "it_service":
        return [
          "Tier 1: Service Desk Ingestion & Rapid Triage",
          "Tier 2: Technical Deep-Dive & SLA Escalation",
          "Tier 3: Problem Management & Root Cause Remediation",
          "Tier 4: Platform Reliability & Continuous Engineering",
          "ITIL Governance Matrix & MTTR Performance Gate"
        ];
      case "risk_compliance":
        return [
          "Dimension 1: Risk Identification & Taxonomy Ingestion",
          "Dimension 2: 5x5 Impact vs Likelihood Heatmap Matrix",
          "Dimension 3: Internal Control & Mitigation Workflows",
          "Dimension 4: SOX Compliance & Regulatory Safeguards",
          "Executive Risk Committee Audit Trail & Sign-Off"
        ];
      case "customer_journey":
        return [
          "Phase 1: Discovery, Onboarding & Eligibility Verification",
          "Phase 2: Clinical Diagnostic Assessment & Consultation",
          "Phase 3: Personalized Treatment Delivery & Intervention",
          "Phase 4: Post-Procedure Monitoring & Recovery Protocol",
          "Phase 5: Longitudinal Patient Outcomes & Brand Loyalty"
        ];
      case "change_mgmt":
        return [
          "ADKAR Stage 1: Awareness of Business Imperative",
          "ADKAR Stage 2: Desire to Support & Participate",
          "ADKAR Stage 3: Knowledge & Training Architecture",
          "ADKAR Stage 4: Ability to Execute & Adopt New Ways of Working",
          "ADKAR Stage 5: Reinforcement & Long-Term Institutionalization"
        ];
      case "swot_analysis":
        return [
          "Quadrant 1: Core Competitive Strengths & Differentiators",
          "Quadrant 2: Internal Vulnerabilities & Operational Weaknesses",
          "Quadrant 3: Market Expansion & Emerging Opportunities",
          "Quadrant 4: External Threats & Macro Volatility",
          "Executive Strategic Synthesis & Capital Prioritization"
        ];
      case "budget_waterfall":
        return [
          "Step 1: Baseline Operating Budget Allocation",
          "Step 2: Organic Revenue & Commercial Growth Variances",
          "Step 3: Strategic Synergies & Operational Cost Takeout",
          "Step 4: Strategic Capex & Digital Transformation Reinvestment",
          "Step 5: Net Final Operating EBITDA & Executive Margin Walk"
        ];
      case "project_timeline":
        return [
          "Quarter 1: Foundation Architecture & Discovery Alignment",
          "Quarter 2: Core Platform Development & Sprint Delivery",
          "Quarter 3: System Integration & Pilot Operational Validation",
          "Quarter 4: Global Cutover, Deployment & Rollout Scaling",
          "Program Governance, Steering Milestones & Critical Path"
        ];
      case "org_chart":
        return [
          "Level 1: Executive Board & Supervisory Committee",
          "Level 2: Function & Business Unit Executive Leadership",
          "Level 3: Strategic Operations & Program Engineering Directors",
          "Level 4: Cross-Functional Councils & Global Practice Leads",
          "Enterprise Governance & Accountability Matrix"
        ];
      case "process_flow":
      default:
        return [
          "Stage 1: Ingestion & Scope Validation Pipeline",
          "Stage 2: Open-Item Delta & Filter Governance",
          "Stage 3: 3-Track Root Cause Taxonomy & Decision Routing",
          "Stage 4: Action Execution & Remediation Pipeline",
          "Stage 5: Master Process Flow Architecture & SLA Governance"
        ];
    }
  }

  static getFilenameForTemplate(templateId) {
    switch (templateId) {
      case "financial_close": return "Philips_Month_End_Financial_Close_Animated.pptx";
      case "vendor_p2p": return "Philips_Procure_To_Pay_P2P_Animated.pptx";
      case "strategic_roadmap": return "Philips_Strategic_Transformation_Roadmap_Animated.pptx";
      case "operating_model": return "Philips_Target_Operating_Model_TOM_Animated.pptx";
      case "data_pipeline": return "Philips_HealthSuite_AI_Data_Pipeline_Animated.pptx";
      case "kpi_scorecard": return "Royal_Philips_Executive_KPI_Scorecard_Animated.pptx";
      case "it_service": return "Philips_ITIL_Service_Architecture_Animated.pptx";
      case "risk_compliance": return "Philips_Enterprise_Risk_Compliance_5x5_Animated.pptx";
      case "customer_journey": return "Philips_Clinical_Customer_Journey_Animated.pptx";
      case "change_mgmt": return "Philips_Change_Management_ADKAR_Animated.pptx";
      case "swot_analysis": return "Philips_Executive_SWOT_Matrix_Animated.pptx";
      case "project_timeline": return "Philips_Project_Gantt_Timeline_Animated.pptx";
      case "org_chart": return "Philips_Executive_Org_Hierarchy_Animated.pptx";
      case "budget_waterfall": return "Philips_Financial_Budget_Waterfall_Animated.pptx";
      case "process_flow":
      default: return "Philips_ICA_Executive_Blueprint_Animated.pptx";
    }
  }

  static h(colorStr) {
    if (!colorStr) return "FFFFFF";
    const s = String(colorStr).trim();
    if (s.toLowerCase() === "transparent") return "FFFFFF";
    if (s.startsWith("#")) return s.replace("#", "");
    const rgbaMatch = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (rgbaMatch) {
      let r = parseInt(rgbaMatch[1], 10);
      let g = parseInt(rgbaMatch[2], 10);
      let b = parseInt(rgbaMatch[3], 10);
      const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
      r = Math.round(r * a + 255 * (1 - a));
      g = Math.round(g * a + 255 * (1 - a));
      b = Math.round(b * a + 255 * (1 - a));
      const toHex = (n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0").toUpperCase();
      return `${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    return s.replace("#", "");
  }

  // Common Header Creator
  static addHeader(slide, pptx, h, b, C) {
    // Top Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.62,
      fill: { color: this.h(C.hdr_bg) },
      line: { width: 0 }
    });

    // Warm Accent Stripe
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0.62,
      w: 13.333,
      h: 0.025,
      fill: { color: this.h(C.stripe) },
      line: { width: 0 }
    });

    // Title & Subtitle
    slide.addText(
      [
        { text: (h.title || "EXECUTIVE ARCHITECTURE BLUEPRINT") + "\n", options: { bold: true, fontSize: 16, color: "FFFFFF" } },
        { text: (h.subtitle || "PHILIPS  •  EXECUTIVE OPERATIONS & GOVERNANCE"), options: { fontSize: 8.5, color: "B0AFAF" } }
      ],
      {
        x: 0.40,
        y: 0.06,
        w: 9.50,
        h: 0.52,
        fontFace: "Calibri",
        margin: 0
      }
    );

    // Corporate Logo Badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 11.35,
      y: 0.10,
      w: 1.60,
      h: 0.42,
      rectRadius: 0.06,
      fill: { color: "FFFFFF" },
      line: { width: 0 }
    });

    try {
      slide.addImage({
        path: `logos/${b.logo_key || 'philips'}.png`,
        x: 11.45,
        y: 0.15,
        w: 1.40,
        h: 0.32,
        sizing: { type: "contain", w: 1.40, h: 0.32 }
      });
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 1: PHILIPS ICA RECONCILIATION AS-IS BLUEPRINT
  // ══════════════════════════════════════════════════════════════════════════
  static buildProcessFlow(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const ing = data.ingestion_track || [];
    const df = data.decision_fork || {};
    const gov = data.governance_column || {};

    this.addHeader(slide, pptx, h, b, C);

    // 2. Top 4-Stage Ribbon
    const ribbon = data.ribbon || [];
    const rx = [0.40, 3.40, 7.10, 10.10];
    const rw = [2.70, 3.40, 2.70, 2.83];
    const rColors = [C.blue_accent, C.amber_accent, C.teal_accent, C.rose_accent];

    ribbon.forEach((r, idx) => {
      const x = rx[idx];
      const w = rw[idx];
      const bColor = r.badge_color || rColors[idx];

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x,
        y: 0.71,
        w: w,
        h: 0.36,
        rectRadius: 0.06,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 0.75 }
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.08,
        y: 0.75,
        w: 0.38,
        h: 0.28,
        rectRadius: 0.04,
        fill: { color: this.h(bColor) },
        line: { width: 0 }
      });
      slide.addText(r.num, {
        x: x + 0.08,
        y: 0.75,
        w: 0.38,
        h: 0.28,
        fontSize: 9,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Calibri",
        margin: [0, 0, 0, 0]
      });

      slide.addText(
        [
          { text: r.title + "\n", options: { bold: true, fontSize: 8.5, color: this.h(C.text_primary) } },
          { text: r.sub, options: { fontSize: 7, color: this.h(C.text_muted) } }
        ],
        { x: x + 0.52, y: 0.75, w: w - 0.58, h: 0.28, fontFace: "Calibri", margin: [0, 0, 0, 0] }
      );

      if (idx < 3) {
        this.addArrowRight(slide, x + w + 0.06, 0.89, rx[idx + 1] - 0.06, this.h(C.text_muted));
      }
    });

    // 3. Main Outer Dashed Container
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40,
      y: 1.18,
      w: 12.53,
      h: 6.14,
      rectRadius: 0.12,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.dashed_border), width: 1.8, dashType: "dash" }
    });

    // Floating Container Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.52,
      y: 1.08,
      w: 2.00,
      h: 0.24,
      rectRadius: 0.06,
      fill: { color: this.h(C.amber_accent) },
      line: { width: 0 }
    });
    slide.addText(data.container_label || "PHILIPS AS-IS FLOW", {
      x: 0.52,
      y: 1.08,
      w: 2.00,
      h: 0.24,
      fontSize: 8,
      bold: true,
      color: "FFFFFF",
      align: "center",
      fontFace: "Calibri",
      margin: [0, 0, 0, 0]
    });

    // 4. Ingestion Pipeline Column 1
    const sx = 0.68, sw = 2.00;
    if (stageLimit >= 1) {
      this.addBpCard(slide, sx, 1.52, sw, 0.70, ing[0]?.title || "Accounting Specialist", ing[0]?.sub || "Philips Accounting Lead", ing[0]?.emote || "spec", this.h(C.card_bg), this.h(C.card_bd));
      this.addArrowDown(slide, sx + sw/2, 2.22, 2.58, this.h(C.blue_accent));

      this.addBpCard(slide, sx, 2.58, sw, 1.26, ing[1]?.title || "Extract Open-Item Report", ing[1]?.sub || "Qlik Sense extract | Exclude reciprocal matched items.", ing[1]?.emote || "qlik", this.h(C.blue_bg), this.h(C.blue_border), this.h(C.blue_accent));
      this.addArrowDown(slide, sx + sw/2, 3.84, 4.22, this.h(C.blue_accent));
    }

    if (stageLimit >= 2) {
      this.addBpCard(slide, sx, 4.22, sw, 0.64, ing[2]?.title || "Filter by Company Code", ing[2]?.sub || "Scope validation by entity code", ing[2]?.emote || "filter", this.h(C.card_bg), this.h(C.blue_border));
      this.addArrowDown(slide, sx + sw/2, 4.86, 5.24, this.h(C.blue_accent));

      this.addBpCard(slide, sx, 5.24, sw, 1.82, ing[3]?.title || "List of open items with classification", ing[3]?.sub || "Consolidated open delta ready for triage taxonomy.\nMaps unreconciled line items into operational resolution tracks.", ing[3]?.emote || "list", this.h(C.card_bg), this.h(C.card_bd), this.h(C.blue_accent));
    }

    // 5. Decision Fork Connectors & Root Causes
    const fxm = 2.88, fx2 = 3.08;
    const tw1 = 1.78;
    const t2w = 1.94, a2x = 5.38, a2w = 2.48;

    if (stageLimit >= 3) {
      this.addLine(slide, sx + sw, 5.40, fxm, 5.40, this.h(C.purple_accent));
      this.addLine(slide, fxm, 2.75, fxm, 6.54, this.h(C.purple_accent));
      this.addArrowRight(slide, fxm, 2.75, fx2, this.h(C.purple_accent));
      this.addArrowRight(slide, fxm, 5.00, fx2, this.h(C.purple_accent));
      this.addArrowRight(slide, fxm, 6.54, fx2, this.h(C.purple_accent));

      // Track 1: Posting Not Found
      this.addBpCard(slide, fx2, 2.20, tw1, 1.10, df.root?.title || "Posting not found", df.root?.sub || "Kernel out of scope line", df.root?.emote || "pnf", this.h(C.card_bg), this.h(C.card_bd), this.h(C.blue_accent));

      // Track 2: AP-AR
      this.addBpCard(slide, fx2, 4.46, t2w, 1.08, df.track_2?.cause?.title || "Investigate AP-AR sign issue", df.track_2?.cause?.sub || "AR cleared, AP remains open (+/−)", df.track_2?.cause?.emote || "ap_ar", this.h(C.card_bg), this.h(C.amber_border), this.h(C.amber_accent));

      // Track 3: Cash to allocated
      this.addBpCard(slide, fx2, 6.00, t2w, 1.08, df.track_3?.cause?.title || "Cash to allocated / AP paid", df.track_3?.cause?.sub || "AR unapplied in reciprocal ERP", df.track_3?.cause?.emote || "cash", this.h(C.card_bg), this.h(C.rose_border), this.h(C.rose_accent));
    }

    // 6. Action Execution & Remediation Tracks
    const sfxm = 5.02, sfx2 = 5.18;
    const iaw = 1.48, hx = 6.92, hw = 1.90;

    if (stageLimit >= 4) {
      // Sub-fork to 1A and 1B
      this.addLine(slide, fx2 + tw1, 2.75, sfxm, 2.75, this.h(C.purple_accent));
      this.addLine(slide, sfxm, 2.03, sfxm, 3.47, this.h(C.purple_accent));
      this.addArrowRight(slide, sfxm, 2.03, sfx2, this.h(C.purple_accent));
      this.addArrowRight(slide, sfxm, 3.47, sfx2, this.h(C.purple_accent));

      // 1A: IDoc
      this.addBpCard(slide, sfx2, 1.52, iaw, 1.02, df.sub_branch_1a?.cause?.title || "IDoc / OCR Issue", df.sub_branch_1a?.cause?.sub || "Interface syntax failure", df.sub_branch_1a?.cause?.emote || "idoc", this.h(C.card_bg), this.h(C.teal_border));
      this.addArrowRight(slide, sfx2 + iaw, 2.03, hx, this.h(C.teal_accent));
      this.addBpCard(slide, hx, 1.52, hw, 1.02, df.sub_branch_1a?.action?.title || "Troubleshoot IDoc Using HWI", df.sub_branch_1a?.action?.sub || "Execute SAP Hand Work Instructions", df.sub_branch_1a?.action?.emote || "hwi", this.h(C.card_bg), this.h(C.teal_border), null, this.h(C.teal_accent));

      // 1B: No EDI
      this.addBpCard(slide, sfx2, 2.96, iaw, 1.02, df.sub_branch_1b?.cause?.title || "No EDI / Non-SAP", df.sub_branch_1b?.cause?.sub || "Paper drop / legacy format", df.sub_branch_1b?.cause?.emote || "no_edi", this.h(C.card_bg), this.h(C.blue_border));
      this.addArrowRight(slide, sfx2 + iaw, 3.47, hx, this.h(C.blue_accent));
      this.addBpCard(slide, hx, 2.96, hw, 1.02, df.sub_branch_1b?.action?.title || "Request / Retrieve Invoice Copy", df.sub_branch_1b?.action?.sub || "Auto-fetch PDF via OCR matching", df.sub_branch_1b?.action?.emote || "inv", this.h(C.card_bg), this.h(C.blue_border), null, this.h(C.blue_accent));

      // Track 2 Action: Review
      this.addArrowRight(slide, fx2 + t2w, 5.00, a2x, this.h(C.amber_accent));
      this.addBpCard(slide, a2x, 4.46, a2w, 1.08, df.track_2?.action?.title || "Review & Analyze Issue", df.track_2?.action?.sub || "Investigate discrepancy; post clearing journal", df.track_2?.action?.emote || "review", this.h(C.card_bg), this.h(C.amber_border), null, this.h(C.amber_accent));

      // Track 3 Action: Waiting
      this.addArrowRight(slide, fx2 + t2w, 6.54, a2x, this.h(C.rose_accent));
      this.addBpCard(slide, a2x, 6.00, a2w, 1.08, df.track_3?.action?.title || "Waiting for Counterparty Action (Clearing)", df.track_3?.action?.sub || "Pending reciprocal entity ledger clearing", df.track_3?.action?.emote || "waiting", this.h(C.card_bg), this.h(C.rose_border), null, this.h(C.rose_accent));
    }

    // 7. Convergence & Governance Column (Stage 5)
    const cvx2 = 9.02, gx = 9.28;
    const gw = 3.45;

    if (stageLimit >= 5) {
      this.addLine(slide, hx + hw, 2.03, cvx2, 2.03, this.h(C.purple_accent));
      this.addLine(slide, hx + hw, 3.47, cvx2, 3.47, this.h(C.purple_accent));
      this.addLine(slide, a2x + a2w, 5.00, cvx2, 5.00, this.h(C.purple_accent));
      this.addLine(slide, a2x + a2w, 6.54, cvx2, 6.54, this.h(C.purple_accent));
      this.addLine(slide, cvx2, 2.03, cvx2, 6.54, this.h(C.purple_accent));
      this.addArrowRight(slide, cvx2, 2.12, gx, this.h(C.purple_accent));

      this.addBpCard(slide, gx, 1.52, gw, 1.20, gov.gap_card?.title || "Reconciliation Discrepancy", gov.gap_card?.sub || "Open-item delta isolated between reciprocal Philips entities.", gov.gap_card?.emote || "gap", this.h(C.rose_bg), this.h(C.rose_border), null, null, "GAP DETECTED", this.h(C.rose_accent));
      this.addArrowDown(slide, gx + gw/2, 2.72, 3.16, this.h(C.rose_accent));

      this.addBpCard(slide, gx, 3.16, gw, 1.20, gov.notif_card?.title || "Send Action Notification (Email)", gov.notif_card?.sub || "Structured notice sent to counterparty accounting lead.", gov.notif_card?.emote || "notif", this.h(C.card_bg), this.h(C.rose_border), null, null, "ACTION NOTIFICATION", this.h(C.rose_accent));
      this.addArrowDown(slide, gx + gw/2, 4.36, 4.80, this.h(C.red_accent));

      // Escalation Matrix Card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: gx,
        y: 4.80,
        w: gw,
        h: 2.28,
        rectRadius: 0.08,
        fill: { color: this.h(C.red_bg) },
        line: { color: this.h(C.red_border), width: 1 }
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: gx + 0.14,
        y: 4.94,
        w: 1.44,
        h: 0.22,
        rectRadius: 0.04,
        fill: { color: this.h(C.red_accent) },
        line: { width: 0 }
      });
      slide.addText("MULTI-TIER ESCALATION", {
        x: gx + 0.14,
        y: 4.94,
        w: 1.44,
        h: 0.22,
        fontSize: 7,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Calibri",
        margin: [0, 0, 0, 0]
      });

      slide.addText("No Response → Initiate Escalation (Matrix)", {
        x: gx + 0.14,
        y: 5.26,
        w: gw - 0.76,
        h: 0.30,
        fontSize: 10,
        bold: true,
        color: this.h(C.red_accent),
        fontFace: "Calibri",
        margin: [0, 0, 0, 0]
      });

      const tiers = gov.escalation_card?.tiers || [
        { code: "L1", hrs: "48h Inaction", owner: "Accounting Lead / Processor", detail: "Initial SLA alert; re-verify unmatched ledger delta." },
        { code: "L2", hrs: "96h Inaction", owner: "FSS Shared Services Manager", detail: "Shared services escalation; bilateral review call." },
        { code: "L3", hrs: ">5d / Close", owner: "Entity Finance Director", detail: "Executive sign-off; post un-cleared accrual & audit note." }
      ];

      const tierParas = [];
      tiers.forEach(t => {
        tierParas.push({ text: `${t.code} (${t.hrs}): `, options: { bold: true, fontSize: 8, color: this.h(C.red_accent) } });
        tierParas.push({ text: `${t.owner}\n`, options: { bold: true, fontSize: 8, color: this.h(C.text_primary) } });
        tierParas.push({ text: `    ${t.detail}\n\n`, options: { fontSize: 7, color: this.h(C.text_muted) } });
      });

      slide.addText(tierParas, {
        x: gx + 0.14,
        y: 5.60,
        w: gw - 0.76,
        h: 1.40,
        fontFace: "Calibri",
        margin: [0, 0, 0, 0]
      });

      try {
        slide.addImage({
          path: "emotes/esc.gif",
          x: gx + gw - 0.58,
          y: 5.00,
          w: 0.48,
          h: 0.48
        });
      } catch (e) {}
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 2: STRATEGIC ROADMAP (3 HORIZONS)
  // ══════════════════════════════════════════════════════════════════════════
  static buildStrategicRoadmap(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const horizons = data.horizons || [];
    const workstreams = data.workstreams || [];
    const metrics = data.metrics || [];

    this.addHeader(slide, pptx, h, b, C);

    // Horizon Headers - Render all 3 horizons with active spotlighting
    horizons.forEach((hz, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const x = 3.20 + i * 3.24;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x,
        y: 0.78,
        w: 3.10,
        h: 0.46,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(hz.color || C.stripe), width: isSpotlight ? 2.0 : 1.0 }
      });
      slide.addText(
        [
          { text: hz.title + "\n", options: { bold: true, fontSize: 9.5, color: this.h(hz.color || C.text_primary) } },
          { text: hz.sub || "", options: { fontSize: 7, color: this.h(C.text_muted) } }
        ],
        { x: x + 0.14, y: 0.82, w: 2.80, h: 0.38, fontFace: "Calibri", margin: 0 }
      );

      if (i < 2) {
        slide.addShape(pptx.ShapeType.rightArrow, {
          x: x + 3.12,
          y: 0.95,
          w: 0.10,
          h: 0.12,
          fill: { color: this.h(C.blue_accent) },
          line: { width: 0 }
        });
      }
    });

    // Workstreams - Render complete matrix across all horizons
    workstreams.forEach((ws, i) => {
      const y = 1.38 + i * 1.18;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.40,
        y: y,
        w: 2.60,
        h: 1.06,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.blue_accent), width: 0.75 }
      });
      slide.addText(ws.name, { x: 0.54, y: y + 0.36, w: 2.20, h: 0.34, bold: true, fontSize: 11, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });

      [ws.h1, ws.h2, ws.h3].forEach((htxt, hidx) => {
        const isSpotlight = (stageLimit === hidx + 1);
        const x = 3.20 + hidx * 3.24;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: x,
          y: y,
          w: 3.10,
          h: 1.06,
          fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
          line: { color: this.h(isSpotlight ? C.blue_accent : C.card_bd), width: isSpotlight ? 1.5 : 0.75 }
        });
        slide.addText(htxt || "", { x: x + 0.14, y: y + 0.20, w: 2.80, h: 0.66, fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
      });
    });

    // Strategic Metrics - Always rendered across full width
    const isMetricsSpotlight = (stageLimit >= 4);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40,
      y: 6.26,
      w: 12.53,
      h: 0.90,
      fill: { color: this.h(isMetricsSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
      line: { color: this.h(isMetricsSpotlight ? C.blue_accent : C.card_bd), width: isMetricsSpotlight ? 1.5 : 0.75 }
    });
    metrics.forEach((m, i) => {
      const x = 1.20 + i * 4.00;
      slide.addText(
        [
          { text: (m.label || "") + "\n", options: { bold: true, fontSize: 9, color: this.h(C.text_muted) } },
          { text: (m.value || "") + "  ", options: { bold: true, fontSize: 24, color: this.h(C.blue_accent) } },
          { text: m.sub || "", options: { fontSize: 8.5, color: this.h(C.text_secondary) } }
        ],
        { x: x, y: 6.36, w: 3.50, h: 0.70, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 3: TARGET OPERATING MODEL (TOM)
  // ══════════════════════════════════════════════════════════════════════════
  static buildOperatingModel(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const tiers = (data.tiers && data.tiers.length) ? data.tiers : [
      { level: "TIER 1: STRATEGIC STEERING", title: "Executive Governance & Policy Council", owner: "CFO • VP Global Business Services", mandate: "Sets global accounting standards, capital allocation, and annual SLA performance targets across all Philips entities." },
      { level: "TIER 2: CENTER OF EXCELLENCE", title: "Global Process Owners & Automation CoE", owner: "Process Leads • AI Engineers", mandate: "Designs standardized workflows, calibrates rules engine, and builds autonomous agent exception handlers." },
      { level: "TIER 3: SHARED DELIVERY HUBS", title: "Regional Execution & Triage Hubs", owner: "Amsterdam Hub • Panama Hub • Chennai Delivery Center", mandate: "Executes daily bilateral reconciliation, resolves transactional exceptions, and enforces escalation SLAs." }
    ];
    const raci = (data.raci && data.raci.length) ? data.raci : [
      { activity: "Policy & Accounting Standards", s: "A / R", c: "C", h: "I" },
      { activity: "Core Rule Engine Calibration", s: "I", c: "A / R", h: "C" },
      { activity: "Day-to-Day Exception Triage", s: "I", c: "C", h: "A / R" },
      { activity: "Executive SLA Escalation (L3)", s: "A", c: "R", h: "C" }
    ];

    this.addHeader(slide, pptx, h, b, C);

    // Render all 3 Tiers on Left (x: 0.40, w: 7.50)
    tiers.slice(0, 3).forEach((t, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const y = 0.84 + i * 2.00;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.40, y: y, w: 7.50, h: 1.86,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? C.blue_accent : C.card_bd), width: isSpotlight ? 1.8 : 1.0 }
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.56, y: y + 0.16, w: 2.40, h: 0.26,
        fill: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.blue_accent) },
        line: { width: 0 }
      });
      slide.addText(t.level || "", { x: 0.56, y: y + 0.16, w: 2.40, h: 0.26, bold: true, fontSize: 8, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });
      slide.addText(t.title || "", { x: 0.56, y: y + 0.50, w: 5.50, h: 0.35, bold: true, fontSize: 13, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText("Leadership: " + (t.owner || ""), { x: 0.56, y: y + 0.85, w: 5.50, h: 0.25, bold: true, fontSize: 9, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0 });
      slide.addText(t.mandate || "", { x: 0.56, y: y + 1.15, w: 5.50, h: 0.55, fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });

      if (i < 2) {
        slide.addShape(pptx.ShapeType.downArrow, { x: 4.05, y: y + 1.88, w: 0.20, h: 0.10, fill: { color: this.h(C.blue_accent) }, line: { width: 0 } });
      }
    });

    // Render Governance RACI Matrix on Right (x: 8.20, y: 0.84, w: 4.73, h: 5.86)
    const isRaciSpotlight = (stageLimit === 4);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.20, y: 0.84, w: 4.73, h: 5.86,
      fill: { color: this.h(isRaciSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
      line: { color: this.h(isRaciSpotlight ? (C.stripe || C.amber_accent) : C.card_bd), width: isRaciSpotlight ? 1.8 : 1.2 }
    });
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.40, y: 1.04, w: 2.40, h: 0.28, fill: { color: this.h(C.blue_accent) }, line: { width: 0 } });
    slide.addText("GOVERNANCE RACI MATRIX", { x: 8.40, y: 1.04, w: 2.40, h: 0.28, bold: true, fontSize: 8.5, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    raci.forEach((r, idx) => {
      const ry = 1.60 + idx * 0.95;
      slide.addText(
        [
          { text: (r.activity || "") + "\n", options: { bold: true, fontSize: 10, color: this.h(C.text_primary) } },
          { text: `Tier 1: ${r.s}   •   Tier 2: ${r.c}   •   Tier 3: ${r.h}`, options: { bold: true, fontSize: 9, color: this.h(C.amber_accent) } }
        ],
        { x: 8.40, y: ry, w: 4.33, h: 0.75, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 4: DATA PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildDataPipeline(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const stages = (data.stages && data.stages.length) ? data.stages : [
      { num: "01", name: "SOURCE INGESTION", tech: "SAP S/4HANA • EDI Gateway • Qlik", emote: "idoc", sla: "< 50ms Latency" },
      { num: "02", name: "UNIFIED LAKEHOUSE", tech: "Delta Parquet • Real-Time CDC Hub", emote: "qlik", sla: "100% ACID Fidelity" },
      { num: "03", name: "AGENTIC AI CORE", tech: "Multi-Agent RAG • Anomaly Triage Bot", emote: "tb_robot", sla: "Autonomous Resolution" },
      { num: "04", name: "CONSUMPTION & ERP", tech: "REST APIs • Automated SAP Clearing", emote: "cash", sla: "Real-Time Posting" }
    ];
    const guardrails = (data.guardrails && data.guardrails.length) ? data.guardrails : [
      { title: "Zero Trust RBAC", detail: "Strict entity isolation and role-based data masking across 48 Philips operating entities." },
      { title: "Immutable Audit Trail", detail: "Cryptographic logging for every AI decision & manual transaction edit." },
      { title: "Continuous SLA Monitor", detail: "Automated alerts if queue latency or exception aging exceeds policy limits." }
    ];

    this.addHeader(slide, pptx, h, b, C);

    // All 4 Stages across top (x: 0.40 to 12.93, w: 2.92 each)
    stages.slice(0, 4).forEach((st, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const x = 0.40 + i * 3.16;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: 0.90, w: 2.92, h: 4.20,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? C.blue_accent : C.card_bd), width: isSpotlight ? 2.0 : 1.0 }
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.20, y: 1.12, w: 0.52, h: 0.32,
        fill: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.blue_accent) },
        line: { width: 0 }
      });
      slide.addText(st.num || `0${i+1}`, { x: x + 0.20, y: 1.12, w: 0.52, h: 0.32, bold: true, fontSize: 9, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });
      slide.addText(st.name || "", { x: x + 0.20, y: 1.70, w: 2.52, h: 0.35, bold: true, fontSize: 12, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(st.tech || "", { x: x + 0.20, y: 2.10, w: 2.52, h: 0.50, fontSize: 9, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.20, y: 4.30, w: 2.52, h: 0.42, fill: { color: this.h(isSpotlight ? C.card_bg : C.blue_bg) }, line: { width: 0 } });
      slide.addText(st.sla || "", { x: x + 0.20, y: 4.30, w: 2.52, h: 0.42, bold: true, fontSize: 9, color: this.h(C.blue_accent), align: "center", fontFace: "Calibri", margin: 0 });

      if (i < 3) {
        slide.addShape(pptx.ShapeType.rightArrow, { x: x + 2.94, y: 2.95, w: 0.20, h: 0.16, fill: { color: this.h(C.blue_accent) }, line: { width: 0 } });
      }
    });

    // Governance Guardrails - Always rendered across full width
    const isGuardrailSpotlight = (stageLimit >= 5);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: 5.34, w: 12.53, h: 1.76,
      fill: { color: this.h(isGuardrailSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
      line: { color: this.h(isGuardrailSpotlight ? C.blue_accent : C.card_bd), width: isGuardrailSpotlight ? 1.8 : 1.0 }
    });
    slide.addText("ENTERPRISE GOVERNANCE & COMPLIANCE GUARDRAILS", { x: 0.64, y: 5.50, w: 10.00, h: 0.30, bold: true, fontSize: 10, color: this.h(C.blue_accent), fontFace: "Calibri", margin: 0 });
    guardrails.forEach((g, i) => {
      const gx = 0.64 + i * 4.00;
      slide.addText(
        [
          { text: (g.title || "") + "\n", options: { bold: true, fontSize: 9.5, color: this.h(C.text_primary) } },
          { text: g.detail || "", options: { fontSize: 8, color: this.h(C.text_muted) } }
        ],
        { x: gx, y: 5.90, w: 3.60, h: 0.80, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 5: KPI SCORECARD
  // ══════════════════════════════════════════════════════════════════════════
  static buildKpiScorecard(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const kpis = (data.kpis && data.kpis.length) ? data.kpis : [
      { label: "AUTO-MATCH RATE", value: "96.4%", delta: "+14.2% YoY", rag: "green", note: "Target: 92%" },
      { label: "CLOSE CYCLE TIME", value: "1.8 Days", delta: "-2.4 Days", rag: "green", note: "Target: < 2 Days" },
      { label: "AGED OPEN DELTA", value: "€380K", delta: "-82% QoQ", rag: "amber", note: "Target: < €250K" },
      { label: "FIRST-PASS RESOLUTION", value: "89.7%", delta: "+8.5% YoY", rag: "green", note: "Target: 85%" }
    ];
    const pillars = (data.pillars && data.pillars.length) ? data.pillars : [
      { name: "Automation & AI Adoption", score: "94%", detail: "Over 820K transactions auto-reconciled monthly across global Philips hubs with zero human touches." },
      { name: "Governance & Escalation Compliance", score: "98%", detail: "All L1–L3 SLA violations tracked, reviewed, and resolved within policy timeframes." },
      { name: "Audit Cleanliness & SOX Controls", score: "100%", detail: "Zero material deficiencies reported across all operating legal entities." }
    ];

    this.addHeader(slide, pptx, h, b, C);

    // Render all 4 KPI Cards across top
    kpis.slice(0, 4).forEach((k, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const x = 0.40 + i * 3.16;
      const ragColor = k.rag === "green" ? "10B981" : (k.rag === "amber" ? "F59E0B" : "EF4444");
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: 0.86, w: 2.92, h: 1.90,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? C.blue_accent : C.card_bd), width: isSpotlight ? 2.0 : 1.0 }
      });
      slide.addShape(pptx.ShapeType.rect, { x: x, y: 0.86, w: 0.08, h: 1.90, fill: { color: ragColor }, line: { width: 0 } });
      slide.addText(k.label || "", { x: x + 0.20, y: 1.05, w: 2.50, h: 0.25, bold: true, fontSize: 9, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addText(k.value || "", { x: x + 0.20, y: 1.35, w: 2.50, h: 0.55, bold: true, fontSize: 26, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText((k.delta || "") + " • " + (k.note || ""), { x: x + 0.20, y: 2.05, w: 2.50, h: 0.45, bold: true, fontSize: 8.5, color: ragColor, fontFace: "Calibri", margin: 0 });
    });

    // Render all 3 Strategic Pillars
    const isPillarsSpotlight = (stageLimit >= 5);
    pillars.slice(0, 3).forEach((p, i) => {
      const y = 3.00 + i * 1.34;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.40, y: y, w: 12.53, h: 1.14,
        fill: { color: this.h(isPillarsSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isPillarsSpotlight ? C.blue_accent : C.card_bd), width: isPillarsSpotlight ? 1.5 : 1.0 }
      });
      slide.addText(p.name || "", { x: 0.64, y: y + 0.25, w: 10.00, h: 0.35, bold: true, fontSize: 13, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(p.detail || "", { x: 0.64, y: y + 0.60, w: 10.00, h: 0.35, fontSize: 9.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addShape(pptx.ShapeType.roundRect, { x: 11.00, y: y + 0.36, w: 1.50, h: 0.44, fill: { color: this.h(C.blue_bg) }, line: { width: 0 } });
      slide.addText(p.score || "", { x: 11.00, y: y + 0.36, w: 1.50, h: 0.44, bold: true, fontSize: 15, color: this.h(C.blue_accent), align: "center", fontFace: "Calibri", margin: 0 });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 6: FINANCIAL CLOSE PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildFinancialClose(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    this.addHeader(slide, pptx, h, b, C);

    // 1. Top 4 Close Phases Ribbon (Exact 13.333" widescreen distribution)
    const phases = data.phases || [
      { num: "01", title: "SUB-LEDGER CUTOFF", sub: "WD -2 to WD 0: Sub-Ledger Close & Freeze", emote: "calc", badge_color: C.blue_accent },
      { num: "02", title: "BILATERAL MATCHING", sub: "WD +1 to WD +2: Rule-Based Pairing Engine", emote: "currency", badge_color: C.amber_accent },
      { num: "03", title: "CONSOLIDATION & ELIMS", sub: "WD +3 to WD +4: Group Elimination Postings", emote: "ledger", badge_color: C.teal_accent },
      { num: "04", title: "CLOSE THE LOOP", sub: "WD +5 Close: CFO Sign-Off & Release", emote: "stamp", badge_color: C.rose_accent }
    ];

    const rx = [0.40, 3.40, 7.10, 10.10];
    const rw = [2.70, 3.40, 2.70, 2.83];
    const rColors = [C.blue_accent, C.amber_accent, C.teal_accent, C.rose_accent];

    phases.forEach((p, idx) => {
      const x = rx[idx];
      const w = rw[idx];
      const bColor = p.badge_color || rColors[idx];
      const isSpotlight = (stageLimit === idx + 1);

      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: 0.71, w: w, h: 0.36,
        rectRadius: 0.06,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? (C.stripe || bColor) : C.card_bd), width: isSpotlight ? 1.5 : 0.75 }
      });

      // Number badge pill
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 0.08, y: 0.75, w: 0.38, h: 0.28,
        rectRadius: 0.04,
        fill: { color: this.h(bColor) },
        line: { width: 0 }
      });
      slide.addText(p.num || `0${idx + 1}`, {
        x: x + 0.08, y: 0.75, w: 0.38, h: 0.28,
        fontSize: 9, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });

      // Title & Sub
      slide.addText(
        [
          { text: (p.title || "") + "\n", options: { bold: true, fontSize: 8.5, color: this.h(C.text_primary) } },
          { text: p.sub || "", options: { fontSize: 7, color: this.h(C.text_muted) } }
        ],
        { x: x + 0.52, y: 0.75, w: w - 0.58, h: 0.28, fontFace: "Calibri", margin: 0 }
      );

      if (idx < 3) {
        this.addArrowRight(slide, x + w + 0.06, 0.89, rx[idx + 1] - 0.06, this.h(C.text_muted));
      }
    });

    // 2. Main Outer Dashed Container (Exact Benchmark Proportions: y=1.18 to 7.32, h=6.14)
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 1.18, w: 12.53, h: 6.14,
      rectRadius: 0.12,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.dashed_border), width: 1.8, dashType: "dash" }
    });

    // Floating Container Pill Header
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.52, y: 1.08, w: 2.80, h: 0.24,
      rectRadius: 0.06,
      fill: { color: this.h(C.blue_accent) },
      line: { width: 0 }
    });
    slide.addText(data.container_label || "PHILIPS FINANCIAL CLOSE RUNBOOK", {
      x: 0.52, y: 1.08, w: 2.80, h: 0.24,
      fontSize: 8, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    // 3. Lane 1: Sub-Ledger Transactional Ingestion & Freeze Pipeline (Always Rendered)
    const sx = 0.68, sw = 2.00;
    const isLane1Spotlight = (stageLimit === 1);
    this.addBpCard(slide, sx, 1.52, sw, 0.70, "Accounting Specialist", "Sub-Ledger Processing Lead", "calc", this.h(isLane1Spotlight ? (C.blue_bg || C.card_bg) : C.card_bg), this.h(isLane1Spotlight ? C.blue_accent : C.card_bd));
    this.addArrowDown(slide, sx + sw/2, 2.22, 2.58, this.h(C.blue_accent));

    this.addBpCard(slide, sx, 2.58, sw, 1.26, "Extract Sub-Ledgers", "SAP ECC & S/4HANA lock across 48 company codes.", "ledger", this.h(C.blue_bg), this.h(C.blue_border), this.h(C.blue_accent));
    this.addArrowDown(slide, sx + sw/2, 3.84, 4.22, this.h(C.blue_accent));

    const isLane2Spotlight = (stageLimit === 2);
    this.addBpCard(slide, sx, 4.22, sw, 0.64, "Accruals & Prepayments", "Automate recurring standard journal post", "currency", this.h(isLane2Spotlight ? (C.amber_bg || C.card_bg) : C.card_bg), this.h(isLane2Spotlight ? C.amber_accent : C.blue_border));
    this.addArrowDown(slide, sx + sw/2, 4.86, 5.24, this.h(C.blue_accent));

    this.addBpCard(slide, sx, 5.24, sw, 1.20, "Locked Trial Balance", "Consolidated sub-ledger delta extract ready for bilateral pairing.", "chart_up", this.h(C.card_bg), this.h(C.card_bd), null, null, null, null, [
      "Transactional cutoff certified across all units.",
      "Accrual reconciliation variance: €0.00."
    ]);

    // 4. Lanes 2 & 3: Symmetrical Bilateral Settlement & Triage Taxonomy (Always Rendered)
    const isTrackSpotlight = (stageLimit === 3);
    // Main Spine from Lane 1 to Symmetrical 3-Track Tree
    this.addLine(slide, sx + sw, 5.84, 3.04, 5.84, this.h(C.purple_accent));
    this.addLine(slide, 3.04, 2.58, 3.04, 6.70, this.h(C.purple_accent));

    // Track 1 (Top): Automated Bilateral Invoicing & Match
    this.addArrowRight(slide, 3.04, 2.58, 3.24, this.h(C.purple_accent));
    this.addBpCard(slide, 3.24, 2.14, 1.80, 0.88, "Automated Pairing Engine", "Bilateral invoice match", "currency", this.h(isTrackSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg), this.h(isTrackSpotlight ? C.blue_accent : C.blue_border), this.h(C.blue_accent));

    this.addLine(slide, 5.04, 2.58, 5.20, 2.58, this.h(C.blue_accent));
    this.addLine(slide, 5.20, 2.02, 5.20, 3.14, this.h(C.blue_accent));

    this.addArrowRight(slide, 5.20, 2.02, 5.36, this.h(C.blue_accent));
    this.addBpCard(slide, 5.36, 1.58, 1.50, 0.88, "Same-Day Invoicing", "Direct SAP clearance", "calc", this.h(C.card_bg), this.h(C.blue_border));

    this.addArrowRight(slide, 5.20, 3.14, 5.36, this.h(C.blue_accent));
    this.addBpCard(slide, 5.36, 2.70, 1.50, 0.88, "FX & Currency Match", "Auto-hedging validation", "ap_ar", this.h(C.card_bg), this.h(C.blue_border));

    // Step 2 Action Cards
    this.addBpCard(slide, 7.10, 1.58, 1.90, 0.88, "Auto-Clearing (94.8%)", "Execute bilateral clearance", "stamp", this.h(C.card_bg), this.h(C.teal_border));
    slide.addShape(this.getShapeType("ellipse"), { x: 6.94, y: 1.88, w: 0.28, h: 0.28, fill: { color: this.h(C.teal_accent) }, line: { width: 0 } });
    slide.addText(">", { x: 6.94, y: 1.88, w: 0.28, h: 0.28, fontSize: 9, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    this.addBpCard(slide, 7.10, 2.70, 1.90, 0.88, "Execute Bilateral Run", "Bilateral netting journal", "handshake", this.h(C.card_bg), this.h(C.teal_border));
    slide.addShape(this.getShapeType("ellipse"), { x: 6.94, y: 3.00, w: 0.28, h: 0.28, fill: { color: this.h(C.teal_accent) }, line: { width: 0 } });
    slide.addText(">", { x: 6.94, y: 3.00, w: 0.28, h: 0.28, fontSize: 9, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    // Track 2 (Middle): Discrepancy Triage & Exception Routing
    this.addArrowRight(slide, 3.04, 4.40, 3.24, this.h(C.purple_accent));
    this.addBpCard(slide, 3.24, 3.96, 2.00, 0.88, "Variance Delta Triage", "Route unallocated items", "gap", this.h(C.card_bg), this.h(C.amber_border), this.h(C.amber_accent));

    this.addBpCard(slide, 5.56, 3.96, 2.50, 0.88, "Fast-Track Investigation", "Investigate discrepancy < €25K; post clearing journal", "tb_ageing", this.h(C.card_bg), this.h(C.amber_border));
    slide.addShape(this.getShapeType("ellipse"), { x: 5.38, y: 4.26, w: 0.28, h: 0.28, fill: { color: this.h(C.amber_accent) }, line: { width: 0 } });
    slide.addText(">", { x: 5.38, y: 4.26, w: 0.28, h: 0.28, fontSize: 9, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    // Track 3 (Bottom): Group Consolidation & Elimination
    this.addArrowRight(slide, 3.04, 6.00, 3.24, this.h(C.purple_accent));
    this.addBpCard(slide, 3.24, 5.56, 2.00, 0.88, "Group Eliminations Run", "Reciprocal account offset", "tb_rules", this.h(C.card_bg), this.h(C.rose_border), this.h(C.rose_accent));

    this.addBpCard(slide, 5.56, 5.56, 2.50, 0.88, "Trial Balance Rollup", "Automated group currency rollup; CFO audit certification", "stamp", this.h(C.card_bg), this.h(C.rose_border));
    slide.addShape(this.getShapeType("ellipse"), { x: 5.38, y: 5.86, w: 0.28, h: 0.28, fill: { color: this.h(C.rose_accent) }, line: { width: 0 } });
    slide.addText(">", { x: 5.38, y: 5.86, w: 0.28, h: 0.28, fontSize: 9, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    // 5. Lane 4: Governance Gateways & Multi-Tier Escalation Matrix (Always Rendered)
    const gx = 9.25, gw = 3.45;
    const isGovSpotlight = (stageLimit === 4);

    // Connectors from Track ends to Governance column
    this.addLine(slide, 9.00, 2.02, 9.25, 2.02, this.h(C.purple_accent));
    this.addLine(slide, 9.00, 3.14, 9.25, 3.14, this.h(C.purple_accent));
    this.addLine(slide, 8.06, 4.40, 9.25, 4.40, this.h(C.purple_accent));
    this.addLine(slide, 8.06, 6.00, 9.25, 6.00, this.h(C.purple_accent));
    this.addLine(slide, 9.00, 2.02, 9.00, 3.14, this.h(C.purple_accent));

    // Governance Card 1: Materiality Threshold
    this.addBpCard(slide, gx, 1.52, gw, 1.14, "Materiality Threshold Gate", "Variances below €25K auto-expensed with audit certification note.", "stamp", this.h(isGovSpotlight ? (C.rose_bg || C.card_bg) : C.card_bg), this.h(isGovSpotlight ? C.rose_accent : C.rose_border), null, null, "MATERIALITY LIMIT (€25K)", this.h(C.rose_accent));
    this.addArrowDown(slide, gx + gw/2, 2.66, 3.16, this.h(C.rose_accent));

    // Governance Card 2: Escalation SLA
    this.addBpCard(slide, gx, 3.16, gw, 1.20, "Escalation SLA Notification", "Structured alert sent to counterparty finance lead via Slack & SAP.", "tb_ageing", this.h(isGovSpotlight ? (C.amber_bg || C.card_bg) : C.card_bg), this.h(isGovSpotlight ? C.amber_accent : C.amber_border), null, null, "CRITICAL SLA (4-HOUR)", this.h(C.amber_accent));

    // Governance Card 3: Multi-Tier Escalation Matrix
    const isEscSpotlight = (stageLimit === 5);
    this.addArrowDown(slide, gx + gw/2, 4.36, 4.80, this.h(C.red_accent));

    slide.addShape(this.getShapeType("roundRect"), {
      x: gx, y: 4.80, w: gw, h: 2.28,
      rectRadius: 0.08,
      fill: { color: this.h(isEscSpotlight ? (C.red_bg || C.card_bg) : C.red_bg) },
      line: { color: this.h(isEscSpotlight ? C.stripe : C.red_border), width: isEscSpotlight ? 2.0 : 1.0 }
    });

    slide.addShape(this.getShapeType("roundRect"), {
      x: gx + 0.14, y: 4.94, w: 1.44, h: 0.22,
      rectRadius: 0.04,
      fill: { color: this.h(C.red_accent) },
      line: { width: 0 }
    });
    slide.addText("MULTI-TIER ESCALATION", {
      x: gx + 0.14, y: 4.94, w: 1.44, h: 0.22,
      fontSize: 7, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    slide.addText("Inaction → Automated Executive Escalation", {
      x: gx + 0.14, y: 5.26, w: gw - 0.76, h: 0.30,
      fontSize: 10, bold: true, color: this.h(C.red_accent), fontFace: "Calibri", margin: 0
    });

    const tiers = [
      { code: "L1", hrs: "24h SLA", owner: "Sub-Ledger Accounting Lead", detail: "Initial SLA alert; re-verify unmatched ledger delta." },
      { code: "L2", hrs: "48h SLA", owner: "FSS Shared Services Controller", detail: "Shared services escalation; bilateral review conference." },
      { code: "L3", hrs: "Close Day", owner: "CFO & Group Finance Director", detail: "Executive sign-off; post un-cleared accrual & board release." }
    ];

    const tierParas = [];
    tiers.forEach(t => {
      tierParas.push({ text: `${t.code} (${t.hrs}): `, options: { bold: true, fontSize: 8, color: this.h(C.red_accent) } });
      tierParas.push({ text: `${t.owner}\n`, options: { bold: true, fontSize: 8, color: this.h(C.text_primary) } });
      tierParas.push({ text: `    ${t.detail}\n\n`, options: { fontSize: 7, color: this.h(C.text_muted) } });
    });

    slide.addText(tierParas, {
      x: gx + 0.14, y: 5.60, w: gw - 0.76, h: 1.40,
      fontFace: "Calibri", margin: 0
    });

    try {
      slide.addImage({
        path: this.getEmotePath("tb_rbac"),
        x: gx + gw - 0.58, y: 5.00, w: 0.48, h: 0.48
      });
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 7: PROCURE-TO-PAY (P2P) & VENDOR WORKFLOW
  // ══════════════════════════════════════════════════════════════════════════
  static buildVendorP2P(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    // 5 Lifecycle Step Cards across top
    const steps = (data.steps && data.steps.length) ? data.steps : [
      { num: "01", title: "Vendor Onboarding", sub: "KYC, Tax & Sanction Checks", emote: "handshake" },
      { num: "02", title: "Sourcing & Purchase Order", sub: "Automated PO dispatch in SAP", emote: "po_doc" },
      { num: "03", title: "Goods Receipt (GR/IR)", sub: "Barcode scan & warehouse confirmation", emote: "truck" },
      { num: "04", title: "OCR Invoice Extraction", sub: "3-Way Line Matching Engine", emote: "scan_doc" },
      { num: "05", title: "Payment Release", sub: "Electronic Funds Transfer (EFT)", emote: "payment" }
    ];

    const sw = 2.38;
    steps.forEach((st, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const x = 0.40 + i * 2.54;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: 0.76, w: sw, h: 1.48,
        rectRadius: 0.08,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? (C.stripe || C.amber_accent) : C.card_bd), width: isSpotlight ? 2.0 : 1.0 }
      });
      // Pill Number Badge
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.12, y: 0.86, w: 0.44, h: 0.22,
        rectRadius: 0.04,
        fill: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.blue_accent) },
        line: { width: 0 }
      });
      slide.addText(st.num || `0${i+1}`, {
        x: x + 0.12, y: 0.86, w: 0.44, h: 0.22,
        fontSize: 8, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
      // Circular Avatar
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + sw - 0.48, y: 0.86, w: 0.38, h: 0.38,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.blue_border), width: 0.75 }
      });
      try {
        slide.addImage({
          path: this.getEmotePath(st.emote),
          x: x + sw - 0.44, y: 0.90, w: 0.30, h: 0.30
        });
      } catch (e) {}
      // Title
      slide.addText(st.title || "", {
        x: x + 0.12, y: 1.16, w: sw - 0.24, h: 0.44,
        fontSize: 10, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      // Sub
      slide.addText(st.sub || "", {
        x: x + 0.12, y: 1.62, w: sw - 0.24, h: 0.54,
        fontSize: 7.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });

      if (i < 4) {
        this.addArrowRight(slide, x + sw + 0.02, 1.48, x + 2.54 - 0.02, this.h(C.blue_accent));
      }
    });

    // 2. Middle Left: SAP 3-WAY MATCHING PIPELINE
    const isMatchingSpotlight = (stageLimit === 3);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: 2.38, w: 7.90, h: 3.52,
      rectRadius: 0.10,
      fill: { color: this.h(isMatchingSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
      line: { color: this.h(isMatchingSpotlight ? C.amber_accent : C.dashed_border), width: isMatchingSpotlight ? 2.0 : 1.5, dashType: isMatchingSpotlight ? "solid" : "dash" }
    });
    // Floating Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.56, y: 2.28, w: 3.80, h: 0.24,
      rectRadius: 0.05,
      fill: { color: this.h(C.amber_accent) },
      line: { width: 0 }
    });
    slide.addText("SAP 3-WAY MATCHING PIPELINE (PO vs GR vs IR)", {
      x: 0.56, y: 2.28, w: 3.80, h: 0.24,
      fontSize: 8, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    const pillars = [
      { name: "Purchase Order (PO)", badge: "CONTRACT TERMS", emote: "po_doc", desc: "Contract terms, unit pricing, delivery schedules & legal entity code." },
      { name: "Goods Receipt (GR)", badge: "PHYSICAL RECEIPT", emote: "truck", desc: "Physical barcode scan, accepted warehouse quantity & delivery receipt." },
      { name: "Vendor Invoice (IR)", badge: "FINANCIAL CLAIM", emote: "scan_doc", desc: "Tax details, payment terms, net delta & verified banking details." }
    ];
    pillars.forEach((p, idx) => {
      const px = 0.65 + idx * 2.50;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: px, y: 2.68, w: 2.30, h: 1.86,
        rectRadius: 0.08,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.blue_border), width: 1.0 }
      });
      // Pill badge
      slide.addShape(pptx.ShapeType.roundRect, {
        x: px + 0.12, y: 2.78, w: 1.20, h: 0.20,
        rectRadius: 0.04,
        fill: { color: this.h(C.blue_accent) },
        line: { width: 0 }
      });
      slide.addText(p.badge, {
        x: px + 0.12, y: 2.78, w: 1.20, h: 0.20,
        fontSize: 6.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
      // Avatar circle
      slide.addShape(pptx.ShapeType.ellipse, {
        x: px + 2.30 - 0.44, y: 2.78, w: 0.36, h: 0.36,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.blue_border), width: 0.75 }
      });
      try {
        slide.addImage({
          path: this.getEmotePath(p.emote),
          x: px + 2.30 - 0.40, y: 2.82, w: 0.28, h: 0.28
        });
      } catch (e) {}
      slide.addText(p.name, {
        x: px + 0.12, y: 3.08, w: 2.06, h: 0.44,
        fontSize: 10, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      slide.addText(p.desc, {
        x: px + 0.12, y: 3.56, w: 2.06, h: 0.90,
        fontSize: 7.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });

      if (idx < 2) {
        this.addArrowRight(slide, px + 2.32, 3.60, px + 2.50 - 0.02, this.h(C.amber_accent));
      }
    });

    // Matching Engine Banner
    const exFlow = data.exception_flow || {};
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.65, y: 4.70, w: 7.40, h: 0.96,
      rectRadius: 0.06,
      fill: { color: this.h(C.amber_bg || C.card_bg) },
      line: { color: this.h(C.amber_border || C.card_bd), width: 1.0 }
    });
    slide.addText(exFlow.title ? `${exFlow.title.toUpperCase()}: ${exFlow.trigger || ""}` : "MATCHING VERIFICATION ENGINE: Automated Price Variance < 1.0% Auto-Cleared • Exception Hand-Off", {
      x: 0.80, y: 4.80, w: 7.10, h: 0.30,
      fontSize: 9.5, bold: true, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0
    });
    slide.addText(exFlow.resolution || "Discrepancies > 1.0% automatically route to Procure-to-Pay triage queue with 48-hour vendor clarification SLA.", {
      x: 0.80, y: 5.12, w: 7.10, h: 0.44,
      fontSize: 8, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
    });

    // 3. Middle Right: Vendor Scorecard Dock
    const isScorecardSpotlight = (stageLimit === 5);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.50, y: 2.38, w: 4.43, h: 3.52,
      rectRadius: 0.10,
      fill: { color: this.h(isScorecardSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
      line: { color: this.h(isScorecardSpotlight ? C.teal_accent : C.card_bd), width: isScorecardSpotlight ? 2.0 : 1.2 }
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.70, y: 2.28, w: 3.40, h: 0.24,
      rectRadius: 0.05,
      fill: { color: this.h(C.teal_accent) },
      line: { width: 0 }
    });
    slide.addText("VENDOR PERFORMANCE & RISK SCORECARD", {
      x: 8.70, y: 2.28, w: 3.40, h: 0.24,
      fontSize: 8, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    const vCard = data.vendor_scorecard || {};
    const kpis = [
      { label: "On-Time Delivery", score: vCard.on_time_delivery || "98.2%", status: "OPTIMAL", badgeColor: C.teal_accent, desc: "Evaluated across global shipments" },
      { label: "Match Accuracy SLA", score: vCard.match_accuracy || "99.1%", status: "PASS", badgeColor: C.blue_accent, desc: "Within bilateral contract delta margin" },
      { label: "Touchless Invoice Rate", score: vCard.touchless_rate || "91.4%", status: "HIGH", badgeColor: C.rose_accent, desc: "Zero manual touches in SAP posting" }
    ];
    kpis.forEach((k, i) => {
      const ky = 2.68 + i * 0.98;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 8.70, y: ky, w: 4.03, h: 0.82,
        rectRadius: 0.08,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.card_bd), width: 0.75 }
      });
      // Label
      slide.addText(k.label, {
        x: 8.85, y: ky + 0.10, w: 2.40, h: 0.24,
        fontSize: 9.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      // Status Pill
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 8.70 + 4.03 - 0.92, y: ky + 0.10, w: 0.78, h: 0.20,
        rectRadius: 0.04,
        fill: { color: this.h(k.badgeColor) },
        line: { width: 0 }
      });
      slide.addText(k.status, {
        x: 8.70 + 4.03 - 0.92, y: ky + 0.10, w: 0.78, h: 0.20,
        fontSize: 7, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
      // Score & Desc
      slide.addText(`${k.score}  •  ${k.desc}`, {
        x: 8.85, y: ky + 0.40, w: 3.73, h: 0.32,
        fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });
    });

    // 4. Bottom Full-Width Procurement Ribbon
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: 6.08, w: 12.53, h: 1.16,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });
    slide.addText("PHILIPS SUPPLY CHAIN & PROCUREMENT EXCELLENCE  •  E2E METRICS", {
      x: 0.64, y: 6.16, w: 6.00, h: 0.22,
      fontSize: 8.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
    });
    // KPI 1
    slide.addText(vCard.on_time_delivery || "98.2%", {
      x: 0.64, y: 6.42, w: 1.60, h: 0.48,
      fontSize: 22, bold: true, color: this.h(C.blue_accent), fontFace: "Calibri", margin: 0
    });
    slide.addText("PO-to-Receipt On-Time SLA\nGlobal Supplier Benchmark", {
      x: 2.10, y: 6.46, w: 2.40, h: 0.44,
      fontSize: 8.5, bold: true, color: this.h(C.teal_accent), fontFace: "Calibri", margin: 0
    });
    // KPI 2
    slide.addText(vCard.match_accuracy || "99.1%", {
      x: 4.80, y: 6.42, w: 1.60, h: 0.48,
      fontSize: 22, bold: true, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0
    });
    slide.addText("3-Way Matching Line Accuracy\nAutomated Tolerance Clear", {
      x: 5.85, y: 6.46, w: 2.40, h: 0.44,
      fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
    });
    // KPI 3
    slide.addText(vCard.touchless_rate || "91.4%", {
      x: 8.60, y: 6.42, w: 1.60, h: 0.48,
      fontSize: 22, bold: true, color: this.h(C.rose_accent), fontFace: "Calibri", margin: 0
    });
    slide.addText("Touchless Invoice Processing Rate\nZero Human Touch", {
      x: 9.65, y: 6.46, w: 2.80, h: 0.44,
      fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 8: IT SERVICE DELIVERY ARCHITECTURE
  // ══════════════════════════════════════════════════════════════════════════
  static buildITService(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const tiers = (data.tiers && data.tiers.length) ? data.tiers : [
      { level: "TIER 1", name: "Service Desk & Triage", desc: "Automated chatbot, initial intake, password reset, and incident logging across channels.", sla: "< 15 Min", emote: "ticket" },
      { level: "TIER 2", name: "Technical Deep-Dive", desc: "Specialized application, network, and database diagnostics with automated telemetry lookup.", sla: "< 2 Hours", emote: "monitor" },
      { level: "TIER 3", name: "Problem Management", desc: "Root-cause isolation, firmware patches, and hotfix deployment with engineering escalation.", sla: "< 8 Hours", emote: "server" },
      { level: "TIER 4", name: "Platform Reliability", desc: "Continuous infrastructure resiliency, failover automation, and cloud architecture scaling.", sla: "< 24 Hours", emote: "gear" }
    ];

    const mim = data.major_incident || {
      title: "P1 Critical HealthSuite Cloud Outage Bridge",
      trigger: "3 consecutive failed heartbeats on clinical imaging gateway",
      actions: "War Room Mobilization < 5 min • Executive Broadcast < 15 min • MTTR Target < 60 min"
    };

    const slas = (data.slas && data.slas.length) ? data.slas : [
      { prio: "P1 CRITICAL", resp: "5 Min", res: "60 Min", uptime: "99.99%" },
      { prio: "P2 HIGH", resp: "15 Min", res: "4 Hours", uptime: "99.9%" },
      { prio: "P3 STANDARD", resp: "60 Min", res: "24 Hours", uptime: "99.5%" }
    ];

    // 1. Four ITIL Tier Columns (Left Side, x: 0.40 to 8.80)
    tiers.forEach((t, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const x = 0.40 + i * 2.15;
      const tw = 2.00;

      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: 0.80, w: tw, h: 4.90,
        rectRadius: 0.08,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.card_bd), width: isSpotlight ? 2.0 : 1.2 }
      });

      // Tier Level Badge Pill
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 0.14, y: 0.95, w: 0.65, h: 0.26,
        rectRadius: 0.04,
        fill: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.blue_accent) },
        line: { width: 0 }
      });
      slide.addText(t.level || `TIER ${i+1}`, {
        x: x + 0.14, y: 0.95, w: 0.65, h: 0.26,
        fontSize: 8, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });

      // Circular Avatar with Emote
      slide.addShape(this.getShapeType("ellipse"), {
        x: x + tw - 0.48, y: 0.92, w: 0.36, h: 0.36,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.blue_border), width: 0.75 }
      });
      try {
        slide.addImage({
          path: this.getEmotePath(t.emote || "ticket"),
          x: x + tw - 0.44, y: 0.96, w: 0.28, h: 0.28
        });
      } catch (e) {}

      // Tier Name
      slide.addText(t.name || "", {
        x: x + 0.14, y: 1.35, w: tw - 0.28, h: 0.44,
        fontSize: 11, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });

      // Tier Description
      slide.addText(t.desc || "", {
        x: x + 0.14, y: 1.85, w: tw - 0.28, h: 2.80,
        fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });

      // Bottom SLA Pill
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 0.14, y: 5.15, w: tw - 0.28, h: 0.40,
        rectRadius: 0.06,
        fill: { color: this.h(isSpotlight ? C.card_bg : C.blue_bg) },
        line: { color: this.h(isSpotlight ? C.stripe : C.blue_border), width: 1.0 }
      });
      slide.addText(`SLA: ${t.sla || "< 1 Hour"}`, {
        x: x + 0.14, y: 5.15, w: tw - 0.28, h: 0.40,
        fontSize: 9.5, bold: true, color: this.h(C.blue_accent), align: "center", fontFace: "Calibri", margin: 0
      });

      if (i < 3) {
        this.addArrowRight(slide, x + tw + 0.02, 3.25, x + 2.15 - 0.02, this.h(C.blue_accent));
      }
    });

    // 2. Right Side: Major Incident Management (MIM) Card
    const isMimSpotlight = (stageLimit === 5);
    slide.addShape(this.getShapeType("roundRect"), {
      x: 9.15, y: 0.80, w: 3.78, h: 2.30,
      rectRadius: 0.08,
      fill: { color: this.h(isMimSpotlight ? (C.red_bg || C.card_bg) : C.card_bg) },
      line: { color: this.h(isMimSpotlight ? C.red_accent : C.red_border), width: isMimSpotlight ? 2.0 : 1.2 }
    });

    // MIM Pill Badge
    slide.addShape(this.getShapeType("roundRect"), {
      x: 9.30, y: 0.94, w: 1.70, h: 0.24,
      rectRadius: 0.04,
      fill: { color: this.h(C.red_accent) },
      line: { width: 0 }
    });
    slide.addText("MAJOR INCIDENT MGMT", {
      x: 9.30, y: 0.94, w: 1.70, h: 0.24,
      fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    // Warning Emote Avatar
    slide.addShape(this.getShapeType("ellipse"), {
      x: 12.45, y: 0.90, w: 0.36, h: 0.36,
      fill: { color: this.h(C.red_bg) },
      line: { color: this.h(C.red_border), width: 0.75 }
    });
    try {
      slide.addImage({
        path: this.getEmotePath("warning"),
        x: 12.49, y: 0.94, w: 0.28, h: 0.28
      });
    } catch (e) {}

    // MIM Content
    slide.addText(mim.title || "P1 Critical Outage Bridge", {
      x: 9.30, y: 1.25, w: 3.48, h: 0.32,
      fontSize: 11, bold: true, color: this.h(C.red_accent), fontFace: "Calibri", margin: 0
    });
    slide.addText(`Trigger: ${mim.trigger || "Critical threshold breach"}`, {
      x: 9.30, y: 1.60, w: 3.48, h: 0.26,
      fontSize: 8.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
    });
    slide.addText(mim.actions || "Immediate mobilization & triage", {
      x: 9.30, y: 1.88, w: 3.48, h: 0.44,
      fontSize: 8, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
    });

    // 3. Right Side: SLA Matrix Table (Middle Right)
    slide.addShape(this.getShapeType("roundRect"), {
      x: 9.15, y: 3.25, w: 3.78, h: 2.45,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });
    slide.addText("SERVICE LEVEL AGREEMENTS (SLA)", {
      x: 9.30, y: 3.40, w: 3.48, h: 0.24,
      fontSize: 10, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
    });

    slas.forEach((s, idx) => {
      const sy = 3.72 + idx * 0.62;
      slide.addShape(this.getShapeType("roundRect"), {
        x: 9.30, y: sy, w: 3.48, h: 0.52,
        rectRadius: 0.05,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.blue_border), width: 0.75 }
      });
      slide.addText(s.prio || "", {
        x: 9.42, y: sy + 0.08, w: 1.60, h: 0.20,
        fontSize: 8.5, bold: true, color: this.h(C.blue_accent), fontFace: "Calibri", margin: 0
      });
      slide.addText(`Response: ${s.resp}  •  Resolve: ${s.res}`, {
        x: 9.42, y: sy + 0.28, w: 2.40, h: 0.18,
        fontSize: 7.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
      });
      slide.addText(s.uptime || "", {
        x: 11.85, y: sy + 0.12, w: 0.80, h: 0.28,
        fontSize: 12, bold: true, color: this.h(C.teal_accent), align: "right", fontFace: "Calibri", margin: 0
      });
    });

    // 4. Bottom Full-Width Telemetry Banner
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 5.90, w: 12.53, h: 1.20,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });
    slide.addText("PHILIPS HEALTHSUITE CLOUD TELEMETRY & OPERATIONAL METRICS", {
      x: 0.64, y: 6.00, w: 8.00, h: 0.22,
      fontSize: 8.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
    });
    // Metric 1
    slide.addText("99.99%", { x: 0.64, y: 6.28, w: 1.60, h: 0.44, fontSize: 22, bold: true, color: this.h(C.teal_accent), fontFace: "Calibri", margin: 0 });
    slide.addText("Platform Availability\nGlobal Multi-Region SLA", { x: 2.10, y: 6.32, w: 2.40, h: 0.40, fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
    // Metric 2
    slide.addText("1.2 SEC", { x: 4.80, y: 6.28, w: 1.60, h: 0.44, fontSize: 22, bold: true, color: this.h(C.blue_accent), fontFace: "Calibri", margin: 0 });
    slide.addText("Mean API Gateway Latency\nSub-Second P99 Routing", { x: 6.15, y: 6.32, w: 2.40, h: 0.40, fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
    // Metric 3
    slide.addText("0 DEFECTS", { x: 8.80, y: 6.28, w: 1.60, h: 0.44, fontSize: 22, bold: true, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0 });
    slide.addText("Clinical Audit Security Breaches\nHIPAA & GDPR Certified", { x: 10.35, y: 6.32, w: 2.40, h: 0.40, fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 9: RISK & COMPLIANCE 5x5 MATRIX
  // ══════════════════════════════════════════════════════════════════════════
  static buildRiskCompliance(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const vectors = (data.risk_vectors && data.risk_vectors.length) ? data.risk_vectors : [
      { id: "R-01", name: "Cyber Cloud Breach", x: 4, y: 5, rag: "red", emote: "shield" },
      { id: "R-02", name: "MDR Recall", x: 5, y: 4, rag: "red", emote: "warning" },
      { id: "R-03", name: "Microchip Delay", x: 3, y: 3, rag: "amber", emote: "radar" },
      { id: "R-04", name: "FX Exposure", x: 2, y: 2, rag: "green", emote: "currency" },
      { id: "R-05", name: "AI Talent Gap", x: 2, y: 4, rag: "amber", emote: "user" }
    ];

    const pillars = (data.control_pillars && data.control_pillars.length) ? data.control_pillars : [
      { id: "SOX-01", name: "Automated Segregation of Duties (SoD)", desc: "Strict SAP authorization profiles enforced across 48 legal entities.", pass: "100%", emote: "shield" },
      { id: "SOX-02", name: "Cryptographic Sub-Ledger Approval Gate", desc: "Digital HMAC signatures required before posting clearing journals.", pass: "TESTED PASS", emote: "tb_rbac" },
      { id: "SOX-03", name: "Continuous Vulnerability Scanning SLA", desc: "Automated daily pen-testing on HealthSuite cloud clusters.", pass: "AUDITED", emote: "radar" }
    ];

    // 1. 5x5 Heat Map Grid (Left Side, x: 0.40, y: 0.80, w: 7.00, h: 4.90)
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 0.80, w: 7.00, h: 4.90,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });
    slide.addText("5x5 ENTERPRISE RISK MATRIX (LIKELIHOOD x IMPACT)", {
      x: 0.60, y: 0.95, w: 6.50, h: 0.28,
      bold: true, fontSize: 11, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
    });

    // Y-Axis and X-Axis labels
    slide.addText("LIKELIHOOD (1 TO 5)", {
      x: 0.45, y: 2.80, w: 0.40, h: 1.80,
      fontSize: 7.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", align: "center", margin: 0
    });
    slide.addText("IMPACT SEVERITY (1 TO 5)", {
      x: 2.50, y: 5.45, w: 3.00, h: 0.20,
      fontSize: 7.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", align: "center", margin: 0
    });

    // Render 25 Heatmap Cells (5 rows x 5 cols)
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const gx = 0.90 + c * 1.20;
        const gy = 1.30 + (4 - r) * 0.76;
        const score = (r + 1) * (c + 1);
        let cellBg = C.blue_bg;
        if (score >= 15) cellBg = C.red_bg;
        else if (score >= 10) cellBg = C.amber_bg;
        else if (score >= 6) cellBg = C.card_bg;

        slide.addShape(this.getShapeType("roundRect"), {
          x: gx, y: gy, w: 1.12, h: 0.70,
          rectRadius: 0.04,
          fill: { color: this.h(cellBg) },
          line: { color: this.h(C.card_bd), width: 0.5 }
        });
        slide.addText(`L${r+1}-I${c+1}`, {
          x: gx + 0.06, y: gy + 0.06, w: 0.60, h: 0.16,
          fontSize: 6.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
        });
      }
    }

    // Plot Risk Vectors onto Matrix
    vectors.forEach(rv => {
      const col = Math.min(5, Math.max(1, rv.x || 3)) - 1;
      const row = Math.min(5, Math.max(1, rv.y || 3)) - 1;
      const vx = 0.90 + col * 1.20 + 0.16;
      const vy = 1.30 + (4 - row) * 0.76 + 0.22;
      const vColor = rv.rag === "red" ? C.red_accent : (rv.rag === "amber" ? C.amber_accent : C.teal_accent);

      slide.addShape(this.getShapeType("roundRect"), {
        x: vx, y: vy, w: 0.80, h: 0.38,
        rectRadius: 0.04,
        fill: { color: this.h(vColor) },
        line: { width: 0 }
      });
      slide.addText(rv.id || "RISK", {
        x: vx, y: vy + 0.02, w: 0.80, h: 0.18,
        fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
      slide.addText(rv.name || "", {
        x: vx - 0.10, y: vy + 0.20, w: 1.00, h: 0.16,
        fontSize: 6, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
    });

    // 2. Right Side: SOX Control Framework (x: 7.60, y: 0.80, w: 5.33, h: 4.90)
    slide.addShape(this.getShapeType("roundRect"), {
      x: 7.60, y: 0.80, w: 5.33, h: 4.90,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });

    slide.addShape(this.getShapeType("roundRect"), {
      x: 7.80, y: 0.95, w: 2.10, h: 0.24,
      rectRadius: 0.04,
      fill: { color: this.h(C.blue_accent) },
      line: { width: 0 }
    });
    slide.addText("SOX CONTROL FRAMEWORK", {
      x: 7.80, y: 0.95, w: 2.10, h: 0.24,
      fontSize: 8, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    pillars.forEach((cp, idx) => {
      const cy = 1.35 + idx * 1.05;
      slide.addShape(this.getShapeType("roundRect"), {
        x: 7.80, y: cy, w: 4.93, h: 0.92,
        rectRadius: 0.06,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.blue_border), width: 1.0 }
      });
      // Title
      slide.addText(`${cp.id ? cp.id + ': ' : ''}${cp.name || ''}`, {
        x: 7.95, y: cy + 0.10, w: 3.50, h: 0.26,
        fontSize: 9.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      // Pass Badge
      slide.addShape(this.getShapeType("roundRect"), {
        x: 11.50, y: cy + 0.10, w: 1.10, h: 0.22,
        rectRadius: 0.04,
        fill: { color: this.h(C.teal_accent) },
        line: { width: 0 }
      });
      slide.addText(`${cp.pass || 'PASS'}`, {
        x: 11.50, y: cy + 0.10, w: 1.10, h: 0.22,
        fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
      // Desc
      slide.addText(cp.desc || "", {
        x: 7.95, y: cy + 0.38, w: 4.65, h: 0.46,
        fontSize: 8, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
      });
    });

    // KRI Monitoring Box
    slide.addShape(this.getShapeType("roundRect"), {
      x: 7.80, y: 4.70, w: 4.93, h: 0.85,
      rectRadius: 0.06,
      fill: { color: this.h(C.amber_bg) },
      line: { color: this.h(C.amber_border), width: 1.0 }
    });
    slide.addText("Continuous Key Risk Indicator (KRI) Monitoring", {
      x: 7.95, y: 4.80, w: 4.65, h: 0.24,
      fontSize: 9.5, bold: true, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0
    });
    slide.addText("All 5 critical enterprise risk vectors reviewed bi-weekly with Group Audit Committee.", {
      x: 7.95, y: 5.08, w: 4.65, h: 0.38,
      fontSize: 8, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
    });

    // 3. Bottom Regulatory & Compliance Certification Health Ribbon
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 5.90, w: 12.53, h: 1.20,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });
    slide.addText("REGULATORY & COMPLIANCE CERTIFICATION HEALTH  •  EXECUTIVE AUDIT TRAIL", {
      x: 0.64, y: 6.00, w: 8.00, h: 0.22,
      fontSize: 8.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
    });
    // KPI 1
    slide.addText("100%", { x: 0.64, y: 6.28, w: 1.60, h: 0.44, fontSize: 22, bold: true, color: this.h(C.teal_accent), fontFace: "Calibri", margin: 0 });
    slide.addText("SOX 404 Testing Pass Rate\nZero Deficiencies Noted", { x: 1.90, y: 6.32, w: 2.60, h: 0.40, fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
    // KPI 2
    slide.addText("0 MATERIAL", { x: 4.80, y: 6.28, w: 1.90, h: 0.44, fontSize: 22, bold: true, color: this.h(C.blue_accent), fontFace: "Calibri", margin: 0 });
    slide.addText("Weaknesses Reported (FY26)\nCertified by External Audit", { x: 6.45, y: 6.32, w: 2.40, h: 0.40, fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
    // KPI 3
    slide.addText("48 ENTITIES", { x: 8.80, y: 6.28, w: 1.90, h: 0.44, fontSize: 22, bold: true, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0 });
    slide.addText("Global Bilateral Compliance\nUniform Risk Taxonomy", { x: 10.45, y: 6.32, w: 2.40, h: 0.40, fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 10: CUSTOMER & CLINICAL JOURNEY
  // ══════════════════════════════════════════════════════════════════════════
  static buildCustomerJourney(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const stages = (data.stages && data.stages.length) ? data.stages : [
      { phase: "PHASE 1", title: "Discovery & Intake", action: "Hospital intake portal, automated eligibility check, and clinical record parsing.", score: "CSAT 94.2%", emote: "user" },
      { phase: "PHASE 2", title: "Diagnostic Assessment", action: "Philips CT/MR imaging scan, AI anomaly detection, and multidisciplinary tumor board review.", score: "CSAT 96.8%", emote: "scan_doc" },
      { phase: "PHASE 3", title: "Treatment Delivery", action: "Image-guided therapy intervention, surgical execution, and patient monitoring.", score: "CSAT 98.1%", emote: "heart" },
      { phase: "PHASE 4", title: "Post-Procedure Recovery", action: "Hospital telemetry monitoring, discharge instructions, and connected home recovery protocol.", score: "CSAT 95.4%", emote: "monitor" },
      { phase: "PHASE 5", title: "Longitudinal Outcomes", action: "90-day clinical outcome tracking, medication adherence app, and physician follow-up.", score: "CSAT 97.6%", emote: "chart_up" },
      { phase: "PHASE 6", title: "Advocacy & Renewal", action: "Patient health improvement certification, provider NPS review, and software renewal.", score: "NPS +78", emote: "handshake" }
    ];

    const kpis = (data.kpis && data.kpis.length) ? data.kpis : [
      { val: "+72 NPS", label: "CLINICAL EXPERIENCE NPS", sub: "Top Decile Hospital Benchmark" },
      { val: "98.4%", label: "PROTOCOL ADHERENCE", sub: "Zero Preventable Readmissions" },
      { val: "€2.4M", label: "AVERAGE HEALTH SYSTEM LTV", sub: "Long-Term Enterprise Partnership" }
    ];

    // 1. Six Journey Stage Columns across the slide (x: 0.40 to 12.93)
    const colW = 1.98;
    const colGap = 0.12;
    stages.forEach((st, i) => {
      const isSpotlight = (stageLimit === i + 1);
      const x = 0.40 + i * (colW + colGap);

      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: 0.80, w: colW, h: 4.90,
        rectRadius: 0.08,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.card_bd), width: isSpotlight ? 2.0 : 1.2 }
      });

      // Phase Pill Badge
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 0.12, y: 0.95, w: 0.85, h: 0.24,
        rectRadius: 0.04,
        fill: { color: this.h(isSpotlight ? (C.stripe || C.blue_accent) : C.blue_accent) },
        line: { width: 0 }
      });
      slide.addText(st.phase || `PHASE ${i+1}`, {
        x: x + 0.12, y: 0.95, w: 0.85, h: 0.24,
        fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });

      // Circular Avatar
      slide.addShape(this.getShapeType("ellipse"), {
        x: x + colW - 0.46, y: 0.90, w: 0.34, h: 0.34,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.blue_border), width: 0.75 }
      });
      try {
        slide.addImage({
          path: this.getEmotePath(st.emote || "user"),
          x: x + colW - 0.42, y: 0.94, w: 0.26, h: 0.26
        });
      } catch (e) {}

      // Stage Title
      slide.addText(st.title || "", {
        x: x + 0.12, y: 1.35, w: colW - 0.24, h: 0.48,
        fontSize: 10.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });

      // Action / protocol text
      slide.addText(st.action || "", {
        x: x + 0.12, y: 1.90, w: colW - 0.24, h: 2.75,
        fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });

      // Bottom Satisfaction Score Pill
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 0.12, y: 5.15, w: colW - 0.24, h: 0.40,
        rectRadius: 0.06,
        fill: { color: this.h(isSpotlight ? C.card_bg : C.blue_bg) },
        line: { color: this.h(isSpotlight ? C.teal_accent : C.blue_border), width: 1.0 }
      });
      slide.addText(st.score || "CSAT 95%+", {
        x: x + 0.12, y: 5.15, w: colW - 0.24, h: 0.40,
        fontSize: 10, bold: true, color: this.h(C.teal_accent), align: "center", fontFace: "Calibri", margin: 0
      });

      if (i < stages.length - 1) {
        this.addArrowRight(slide, x + colW + 0.01, 3.25, x + colW + colGap - 0.01, this.h(C.blue_accent));
      }
    });

    // 2. Bottom Lifecycle Value & Clinical Satisfaction KPI Banner
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 5.90, w: 12.53, h: 1.20,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.2 }
    });
    slide.addText("CLINICAL SATISFACTION & LIFECYCLE VALUE METRICS  •  GLOBAL BENCHMARK", {
      x: 0.64, y: 6.00, w: 8.00, h: 0.22,
      fontSize: 8.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
    });

    kpis.forEach((k, idx) => {
      const kx = 0.64 + idx * 4.10;
      slide.addText(k.val || "", {
        x: kx, y: 6.26, w: 1.60, h: 0.46,
        fontSize: 24, bold: true, color: this.h(idx === 0 ? C.blue_accent : (idx === 1 ? C.teal_accent : C.amber_accent)), fontFace: "Calibri", margin: 0
      });
      slide.addText(`${k.label || ""}\n${k.sub || ""}`, {
        x: kx + 1.65, y: 6.30, w: 2.30, h: 0.42,
        fontSize: 8.5, bold: true, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HELPER DRAWING METHODS
  // ══════════════════════════════════════════════════════════════════════════
  static getShapeType(type) {
    if (typeof PptxGenJS !== "undefined" && PptxGenJS.ShapeType && PptxGenJS.ShapeType[type]) {
      return PptxGenJS.ShapeType[type];
    }
    if (typeof window !== "undefined" && window.PptxGenJS && window.PptxGenJS.ShapeType && window.PptxGenJS.ShapeType[type]) {
      return window.PptxGenJS.ShapeType[type];
    }
    return type;
  }

  static addBpCard(slide, x, y, w, h, title, sub, emote, bg, border, stripColor = null, chevronColor = null, badgeText = null, badgeColor = null) {
    slide.addShape(this.getShapeType("roundRect"), {
      x: x,
      y: y,
      w: w,
      h: h,
      rectRadius: 0.08,
      fill: { color: bg },
      line: { color: border, width: 1 }
    });

    if (stripColor) {
      slide.addShape(this.getShapeType("rect"), {
        x: x,
        y: y,
        w: 0.06,
        h: h,
        fill: { color: stripColor },
        line: { width: 0 }
      });
    }

    if (badgeText && badgeColor) {
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 0.14,
        y: y + 0.12,
        w: 1.12,
        h: 0.20,
        rectRadius: 0.04,
        fill: { color: badgeColor },
        line: { width: 0 }
      });
      slide.addText(badgeText, {
        x: x + 0.14,
        y: y + 0.12,
        w: 1.12,
        h: 0.20,
        fontSize: 7,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Calibri",
        margin: [0, 0, 0, 0]
      });
    }

    const titleY = (badgeText && badgeColor) ? y + 0.38 : y + 0.12;
    const titleColor = stripColor || (bg === "FFFFFF" ? "1A1A2E" : "1A1A2E");

    // UNIFIED MULTI-RUN TEXT FRAME: Zero text collisions, automatic natural reflow
    const textRuns = [];
    if (title) {
      textRuns.push({
        text: title + (sub ? "\n" : ""),
        options: {
          bold: true,
          fontSize: 9.5,
          color: titleColor,
          breakLine: !!sub
        }
      });
    }
    if (sub) {
      textRuns.push({
        text: sub,
        options: {
          bold: false,
          fontSize: 7.5,
          color: "6B6B7B"
        }
      });
    }

    const hasEmote = !!emote;
    const textW = hasEmote ? Math.max(0.6, w - 0.62) : Math.max(0.6, w - 0.24);
    const textH = Math.max(0.35, h - (titleY - y) - 0.06);

    slide.addText(textRuns, {
      x: x + 0.12,
      y: titleY,
      w: textW,
      h: textH,
      fontFace: "Calibri",
      margin: [0, 0, 0, 0],
      wrap: true,
      valign: "top"
    });

    if (chevronColor) {
      slide.addText("›", {
        x: x + w - 0.30,
        y: y + h/2 - 0.18,
        w: 0.24,
        h: 0.36,
        fontSize: 18,
        bold: true,
        color: chevronColor,
        fontFace: "Calibri",
        margin: [0, 0, 0, 0]
      });
    }

    if (emote) {
      try {
        const emoteFilename = typeof window !== "undefined" && window.getEmoteInfo ? window.getEmoteInfo(emote).filename : (emote.includes(".") ? emote : (emote.startsWith("m_") || emote.startsWith("icon_") ? `${emote}.png` : `${emote}.gif`));
        if (!emoteFilename.endsWith(".svg")) {
          slide.addImage({
            path: `emotes/${emoteFilename}`,
            x: x + w - 0.50,
            y: y + h/2 - 0.22,
            w: 0.44,
            h: 0.44
          });
        }
      } catch (e) {}
    }
  }

  static addArrowRight(slide, x1, y, x2, color) {
    const minX = Math.min(x1, x2);
    const w = Math.abs(x2 - x1);
    if (w < 0.01) return;
    slide.addShape(this.getShapeType("line"), {
      x: minX,
      y: y,
      w: w,
      h: 0,
      flipH: x2 < x1,
      line: { color: color, width: 2.0, endArrowType: "triangle" }
    });
  }

  static addArrowDown(slide, x, y1, y2, color) {
    const minY = Math.min(y1, y2);
    const h = Math.abs(y2 - y1);
    if (h < 0.01) return;
    slide.addShape(this.getShapeType("line"), {
      x: x,
      y: minY,
      w: 0,
      h: h,
      flipV: y2 < y1,
      line: { color: color, width: 2.0, endArrowType: "triangle" }
    });
  }

  static addLine(slide, x1, y1, x2, y2, color) {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    if (w < 0.005 && h < 0.005) return;
    slide.addShape(this.getShapeType("line"), {
      x: minX,
      y: minY,
      w: Math.max(0.001, w),
      h: Math.max(0.001, h),
      flipH: x2 < x1,
      flipV: y2 < y1,
      line: { color: color, width: 2.0 }
    });
  }

  static getEmotePath(emote) {
    if (!emote) return "emotes/spec.gif";
    if (window.getEmoteInfo) return `emotes/${window.getEmoteInfo(emote).filename}`;
    if (emote.includes(".")) return `emotes/${emote}`;
    if (emote.startsWith("m_") || emote.startsWith("icon_") || emote.startsWith("badge_")) return `emotes/${emote}.png`;
    return `emotes/${emote}.gif`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 11: CHANGE MANAGEMENT (ADKAR)
  // ══════════════════════════════════════════════════════════════════════════
  static buildChangeMgmt(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const phases = (data.phases && data.phases.length) ? data.phases : [
      { title: "Awareness", sub: "Business need for change", status: "COMPLETE" },
      { title: "Desire", sub: "Willingness to support", status: "COMPLETE" },
      { title: "Knowledge", sub: "Training & capabilities", status: "IN PROGRESS" },
      { title: "Ability", sub: "Day-to-day execution", status: "PLANNED" },
      { title: "Reinforcement", sub: "Sustaining change", status: "PLANNED" }
    ];

    // 1. Top ADKAR 5 Phases Ribbon (Always Rendered Across Full Width)
    phases.forEach((p, idx) => {
      const isSpotlight = (stageLimit === idx + 1);
      const x = 0.40 + idx * 2.52;
      const isComplete = p.status === "COMPLETE";
      const accent = isComplete ? C.teal_accent : C.amber_accent;

      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: 0.72, w: 2.44, h: 0.44,
        rectRadius: 0.06,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? C.stripe : C.card_bd), width: isSpotlight ? 1.8 : 1.0 }
      });
      slide.addShape(this.getShapeType("rect"), {
        x: x, y: 0.72, w: 0.04, h: 0.44,
        fill: { color: this.h(accent) },
        line: { width: 0 }
      });
      slide.addText(`0${idx+1}`, {
        x: x + 0.10, y: 0.76, w: 0.34, h: 0.26,
        fontSize: 9.5, bold: true, color: this.h(accent), align: "center", fontFace: "Calibri", margin: 0
      });
      slide.addText(p.title || "", {
        x: x + 0.48, y: 0.74, w: 1.55, h: 0.20,
        fontSize: 10, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      slide.addText(p.sub || "", {
        x: x + 0.48, y: 0.92, w: 1.55, h: 0.18,
        fontSize: 7.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
      });
      if (idx < 4) {
        this.addArrowRight(slide, x + 2.45, 0.94, x + 2.52 - 0.01, this.h(C.blue_accent));
      }
    });

    // 2. Cross-Functional Workstreams (Always Rendered)
    const workstreams = (data.workstreams && data.workstreams.length) ? data.workstreams : [
      {
        lane: "PEOPLE & CULTURE",
        initiatives: [
          { title: "Leadership Alignment & Townhalls", owner: "HR Lead", desc: "Executive cascade sessions and interactive change forums across 48 operating entities." },
          { title: "Superuser Champion Network", owner: "Change CoE", desc: "64 active superusers providing peer coaching, live triage support, and adoption feedback." }
        ]
      },
      {
        lane: "PROCESS & GOVERNANCE",
        initiatives: [
          { title: "Standard Operating Procedures (SOPs)", owner: "Process Lead", desc: "100% refreshed end-to-end runbooks covering sub-ledger, settlement, and exception handling." },
          { title: "SLA Gateway Realignment", owner: "Controllership", desc: "Enforced 4-hour critical exception notification and automated 24h/48h executive escalation." }
        ]
      },
      {
        lane: "TECHNOLOGY & ENABLEMENT",
        initiatives: [
          { title: "SAP S/4HANA & AI Bot Cutover", owner: "IT Program", desc: "Autonomous matching engine integration with real-time telemetry and HMAC audit logging." },
          { title: "Learning Academy & Role Certifications", owner: "Training CoE", desc: "1,420 staff certified with interactive hands-on scenario walkthroughs." }
        ]
      }
    ];

    workstreams.forEach((ws, wIdx) => {
      const y = 1.26 + wIdx * 1.58;
      // Workstream Lane Header Card
      slide.addShape(this.getShapeType("roundRect"), {
        x: 0.40, y: y, w: 2.60, h: 1.42,
        rectRadius: 0.08,
        fill: { color: this.h(C.hdr_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(this.getShapeType("rect"), {
        x: 0.40, y: y, w: 0.06, h: 1.42,
        fill: { color: this.h(C.stripe) },
        line: { width: 0 }
      });
      slide.addText(ws.lane || "", {
        x: 0.58, y: y + 0.20, w: 2.20, h: 0.32,
        fontSize: 11, bold: true, color: this.h(C.canvas_bg), fontFace: "Calibri", margin: 0
      });
      slide.addText("CROSS-FUNCTIONAL WORKSTREAM\nAdoption & Governance Lead", {
        x: 0.58, y: y + 0.65, w: 2.20, h: 0.50,
        fontSize: 8.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
      });

      this.addArrowRight(slide, 3.00, y + 0.71, 3.20, this.h(C.stripe));

      (ws.initiatives || []).forEach((init, iIdx) => {
        const ix = 3.20 + iIdx * 4.80;
        slide.addShape(this.getShapeType("roundRect"), {
          x: ix, y: y, w: 4.60, h: 1.42,
          rectRadius: 0.08,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 1.0 }
        });
        slide.addShape(this.getShapeType("rect"), {
          x: ix, y: y, w: 0.05, h: 1.42,
          fill: { color: this.h(C.stripe) },
          line: { width: 0 }
        });
        slide.addText(init.title || "", {
          x: ix + 0.18, y: y + 0.18, w: 3.20, h: 0.30,
          fontSize: 11, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
        });
        slide.addShape(this.getShapeType("roundRect"), {
          x: ix + 3.40, y: y + 0.14, w: 1.04, h: 0.24,
          rectRadius: 0.04,
          fill: { color: this.h(C.blue_bg) },
          line: { width: 0 }
        });
        slide.addText(init.owner || "", {
          x: ix + 3.40, y: y + 0.14, w: 1.04, h: 0.24,
          fontSize: 8, bold: true, color: this.h(C.text_secondary), align: "center", fontFace: "Calibri", margin: 0
        });
        slide.addText(init.desc || "", {
          x: ix + 0.18, y: y + 0.54, w: 4.24, h: 0.75,
          fontSize: 9, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
        });
      });
    });

    // 3. Bottom Governance Metrics Bar (Always Rendered)
    const gov = data.governance || {
      readiness_score: "88.4%",
      trained_staff: "1,420 / 1,600",
      superusers_active: "64 Leads",
      sentiment_index: "+74 NPS"
    };
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 6.16, w: 12.53, h: 0.98,
      rectRadius: 0.08,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.0 }
    });
    slide.addShape(this.getShapeType("rect"), {
      x: 0.40, y: 6.16, w: 0.06, h: 0.98,
      fill: { color: this.h(C.teal_accent) },
      line: { width: 0 }
    });

    const govMetrics = [
      { label: "READINESS INDEX", val: gov.readiness_score || "88.4%", sub: "Target: > 85%", color: C.teal_accent },
      { label: "STAFF CERTIFIED", val: gov.trained_staff || "1,420 / 1,600", sub: "88.8% Coverage", color: C.text_primary },
      { label: "ACTIVE SUPERUSERS", val: gov.superusers_active || "64 Leads", sub: "Deployed Across 48 Entities", color: C.amber_accent },
      { label: "USER SENTIMENT", val: gov.sentiment_index || "+74 NPS", sub: "Top Decile Adoption", color: C.text_primary }
    ];
    govMetrics.forEach((m, idx) => {
      const gx = 0.70 + idx * 3.10;
      slide.addText(m.label, { x: gx, y: 6.26, w: 2.80, h: 0.20, fontSize: 8.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addText(m.val, { x: gx, y: 6.46, w: 2.80, h: 0.38, fontSize: 20, bold: true, color: this.h(m.color), fontFace: "Calibri", margin: 0 });
      slide.addText(m.sub, { x: gx, y: 6.84, w: 2.80, h: 0.20, fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 12: STRATEGIC SWOT MATRIX
  // ══════════════════════════════════════════════════════════════════════════
  static buildSwotAnalysis(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const quads = data.quadrants || {};
    const quadConfigs = [
      { d: quads.strengths || { title: "INTERNAL STRENGTHS", tag: "DIFFERENTIATOR", items: [{ code: "S-01", title: "Proprietary AI Matching Engine", impact: "HIGH", desc: "96.4% auto-reconciliation rate with zero manual touches across 48 codes." }, { code: "S-02", title: "Global Centralized Delivery Model", impact: "STRATEGIC", desc: "Unified operational visibility across Amsterdam, Panama, and Chennai hubs." }] }, x: 0.40, y: 0.72, color: "#10B981", stage: 1 },
      { d: quads.weaknesses || { title: "INTERNAL WEAKNESSES", tag: "VULNERABILITY", items: [{ code: "W-01", title: "Legacy Paper Ingestion Overhead", impact: "MEDIUM", desc: "3.6% non-standard PDF/paper invoice drops require manual OCR validation." }, { code: "W-02", title: "Cross-Entity Timezone Lag", impact: "LOW", desc: "APAC to Americas bilateral sign-off SLA delay during fiscal month-end." }] }, x: 6.76, y: 0.72, color: "#F59E0B", stage: 2 },
      { d: quads.opportunities || { title: "MARKET OPPORTUNITIES", tag: "VALUE DRIVER", items: [{ code: "O-01", title: "Autonomous Agentic Remediation", impact: "HIGH", desc: "Self-healing reconciliation bots resolving unallocated items in real-time." }, { code: "O-02", title: "Predictive Cash Flow Forecasting", impact: "HIGH", desc: "AI ledger telemetry forecasting intercompany liquidity 30 days ahead." }] }, x: 0.40, y: 3.86, color: "#E8734A", stage: 3 },
      { d: quads.threats || { title: "EXTERNAL THREATS", tag: "MACRO RISK", items: [{ code: "T-01", title: "Global Tax & E-Invoicing Mandates", impact: "CRITICAL", desc: "Emerging real-time VAT reporting requirements across EU and Latin America." }, { code: "T-02", title: "FX & Cross-Border Volatility", impact: "MEDIUM", desc: "Macro currency fluctuations requiring dynamic automated balance hedging." }] }, x: 6.76, y: 3.86, color: "#EF4444", stage: 4 }
    ];

    // Always Render All 4 Quadrants
    quadConfigs.forEach(qc => {
      const isSpotlight = (stageLimit === qc.stage);
      slide.addShape(this.getShapeType("roundRect"), {
        x: qc.x, y: qc.y, w: 6.16, h: 3.00,
        rectRadius: 0.08,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.blue_bg) },
        line: { color: this.h(isSpotlight ? qc.color : C.card_bd), width: isSpotlight ? 2.0 : 1.0 }
      });
      slide.addShape(this.getShapeType("roundRect"), {
        x: qc.x, y: qc.y, w: 6.16, h: 0.42,
        rectRadius: 0.06,
        fill: { color: this.h(C.hdr_bg) },
        line: { width: 0 }
      });
      slide.addShape(this.getShapeType("rect"), {
        x: qc.x, y: qc.y + 0.38, w: 6.16, h: 0.04,
        fill: { color: this.h(qc.color) },
        line: { width: 0 }
      });
      slide.addText(qc.d.title || "", {
        x: qc.x + 0.20, y: qc.y + 0.08, w: 4.50, h: 0.26,
        fontSize: 11, bold: true, color: this.h(C.canvas_bg), fontFace: "Calibri", margin: 0
      });
      slide.addShape(this.getShapeType("roundRect"), {
        x: qc.x + 4.80, y: qc.y + 0.08, w: 1.15, h: 0.24,
        rectRadius: 0.04,
        fill: { color: this.h(qc.color) },
        line: { width: 0 }
      });
      slide.addText(qc.d.tag || "", {
        x: qc.x + 4.80, y: qc.y + 0.08, w: 1.15, h: 0.24,
        fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });

      (qc.d.items || []).forEach((item, idx) => {
        const iy = qc.y + 0.56 + idx * 0.78;
        slide.addShape(this.getShapeType("roundRect"), {
          x: qc.x + 0.14, y: iy, w: 5.88, h: 0.68,
          rectRadius: 0.06,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 1.0 }
        });
        slide.addShape(this.getShapeType("rect"), {
          x: qc.x + 0.14, y: iy, w: 0.04, h: 0.68,
          fill: { color: this.h(qc.color) },
          line: { width: 0 }
        });
        slide.addText(item.code || "", {
          x: qc.x + 0.26, y: iy + 0.10, w: 0.40, h: 0.20,
          fontSize: 8.5, bold: true, color: this.h(qc.color), fontFace: "Calibri", margin: 0
        });
        slide.addText(item.title || "", {
          x: qc.x + 0.70, y: iy + 0.10, w: 4.10, h: 0.24,
          fontSize: 9.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
        });
        slide.addShape(this.getShapeType("roundRect"), {
          x: qc.x + 4.90, y: iy + 0.08, w: 0.95, h: 0.22,
          rectRadius: 0.04,
          fill: { color: this.h(C.blue_bg) },
          line: { width: 0 }
        });
        slide.addText(item.impact || "", {
          x: qc.x + 4.90, y: iy + 0.08, w: 0.95, h: 0.22,
          fontSize: 7.5, bold: true, color: this.h(C.text_secondary), align: "center", fontFace: "Calibri", margin: 0
        });
        slide.addText(item.desc || "", {
          x: qc.x + 0.26, y: iy + 0.34, w: 5.60, h: 0.30,
          fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
        });
      });
    });

    // Bottom Strategic Summary Bar (Always Rendered)
    const sum = data.strategic_summary || {
      core_verdict: "Accelerate AI agent autonomous cutover to neutralize regulatory tax mandates.",
      priority_focus: "STRATEGIC PRIORITY: ZERO MANUAL INTERCOMPANY TOUCHES"
    };
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 6.96, w: 12.52, h: 0.44,
      rectRadius: 0.06,
      fill: { color: this.h(C.hdr_bg) },
      line: { width: 0 }
    });
    slide.addText(`EXECUTIVE STRATEGIC VERDICT:  ${sum.core_verdict || ""}`, {
      x: 0.60, y: 7.02, w: 8.50, h: 0.32,
      fontSize: 9, color: this.h(C.canvas_bg), fontFace: "Calibri", margin: 0
    });
    slide.addText(sum.priority_focus || "", {
      x: 9.20, y: 7.02, w: 3.50, h: 0.32,
      fontSize: 9, bold: true, color: this.h(C.teal_accent), align: "right", fontFace: "Calibri", margin: 0
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 13: PROJECT GANTT TIMELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildProjectTimeline(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    // 1. Quarters Header Ribbon (Always Rendered Across Full Width)
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: 0.72, w: 2.68, h: 0.48,
      rectRadius: 0.06,
      fill: { color: this.h(C.hdr_bg) },
      line: { width: 0 }
    });
    slide.addText("EXECUTION WORKSTREAM", {
      x: 0.54, y: 0.84, w: 2.40, h: 0.24,
      fontSize: 11, bold: true, color: this.h(C.canvas_bg), fontFace: "Calibri", margin: 0
    });

    const quarters = (data.quarters && data.quarters.length) ? data.quarters : [
      { qtr: "Q1", months: "Jan - Mar 2026", status: "COMPLETE" },
      { qtr: "Q2", months: "Apr - Jun 2026", status: "COMPLETE" },
      { qtr: "Q3", months: "Jul - Sep 2026", status: "IN PROGRESS", highlight: true },
      { qtr: "Q4", months: "Oct - Dec 2026", status: "PLANNED" }
    ];

    quarters.forEach((q, idx) => {
      const isSpotlight = (stageLimit === idx + 1);
      const x = 3.20 + idx * 2.40;
      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: 0.72, w: 2.34, h: 0.48,
        rectRadius: 0.06,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : (q.highlight ? C.blue_bg : C.card_bg)) },
        line: { color: this.h(isSpotlight ? C.stripe : (q.highlight ? C.stripe : C.card_bd)), width: isSpotlight ? 1.8 : 1.0 }
      });
      slide.addText(`${q.qtr} (${q.months})`, {
        x: x + 0.14, y: 0.82, w: 1.50, h: 0.24,
        fontSize: 9.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      slide.addShape(this.getShapeType("roundRect"), {
        x: x + 1.54, y: 0.82, w: 0.70, h: 0.24,
        rectRadius: 0.04,
        fill: { color: this.h(q.status === 'COMPLETE' ? C.teal_accent : (q.status === 'IN PROGRESS' ? C.stripe : C.text_muted)) },
        line: { width: 0 }
      });
      slide.addText(q.status, {
        x: x + 1.54, y: 0.82, w: 0.70, h: 0.24,
        fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
      });
    });

    // 2. Gantt Delivery Lanes (Always Rendered)
    const lanes = (data.lanes && data.lanes.length) ? data.lanes : [
      { name: "Architecture & Foundation", bars: [{ start: 0.0, span: 0.35, title: "S/4HANA Ledger Scoping", status: "DONE", color: C.teal_accent }] },
      { name: "Core Engine Build", bars: [{ start: 0.25, span: 0.45, title: "AI Bilateral Matching Engine", status: "DONE", color: C.teal_accent }] },
      { name: "Pilot Validation", bars: [{ start: 0.55, span: 0.30, title: "Benelux & Nordics Dry Run", status: "LIVE", color: C.stripe }] },
      { name: "Global Enterprise Cutover", bars: [{ start: 0.75, span: 0.25, title: "48 Operating Entity Rollout", status: "NEXT", color: C.amber_accent }] }
    ];

    lanes.forEach((lane, lIdx) => {
      const y = 1.32 + lIdx * 1.18;
      slide.addShape(this.getShapeType("roundRect"), {
        x: 0.40, y: y, w: 2.68, h: 1.06,
        rectRadius: 0.08,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(this.getShapeType("rect"), {
        x: 0.40, y: y, w: 0.05, h: 1.06,
        fill: { color: this.h(C.stripe) },
        line: { width: 0 }
      });
      slide.addText(lane.name || "", {
        x: 0.58, y: y + 0.22, w: 2.40, h: 0.38,
        fontSize: 10, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      slide.addText("Delivery Stream Phase", {
        x: 0.58, y: y + 0.60, w: 2.40, h: 0.26,
        fontSize: 8, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
      });

      // Background Gantt track grid
      slide.addShape(this.getShapeType("roundRect"), {
        x: 3.20, y: y, w: 9.60, h: 1.06,
        rectRadius: 0.08,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0, dashType: "dash" }
      });

      (lane.bars || []).forEach((bar, bIdx) => {
        const bx = 3.20 + (bar.start || 0) * 9.60;
        const bw = (bar.span || 0.3) * 9.60;
        const by = y + 0.16 + bIdx * 0.46;
        slide.addShape(this.getShapeType("roundRect"), {
          x: bx, y: by, w: bw, h: 0.38,
          rectRadius: 0.06,
          fill: { color: this.h(bar.color || C.stripe) },
          line: { width: 0 }
        });
        slide.addText(`${bar.title} [${bar.status}]`, {
          x: bx + 0.14, y: by + 0.06, w: bw - 0.28, h: 0.26,
          fontSize: 8.5, bold: true, color: "FFFFFF", fontFace: "Calibri", margin: 0
        });
      });
    });

    // 3. Bottom Milestone Diamonds & Cards (Always Rendered)
    const milestones = (data.milestones && data.milestones.length) ? data.milestones : [
      { pos: 0.10, title: "Architecture Certified", date: "Feb 2026", rag: "green" },
      { pos: 0.45, title: "Core Engine Go-Live", date: "May 2026", rag: "green" },
      { pos: 0.70, title: "Pilot Hub Validation", date: "Aug 2026", rag: "amber" },
      { pos: 0.95, title: "Full Global Rollout", date: "Dec 2026", rag: "amber" }
    ];

    milestones.forEach(m => {
      const mx = 3.60 + (m.pos || 0.1) * 9.00;
      slide.addShape(this.getShapeType("diamond"), {
        x: mx - 0.14, y: 6.20, w: 0.28, h: 0.28,
        fill: { color: this.h(m.rag === 'green' ? C.teal_accent : C.amber_accent) },
        line: { width: 0 }
      });
      slide.addShape(this.getShapeType("roundRect"), {
        x: mx - 0.70, y: 6.54, w: 1.40, h: 0.48,
        rectRadius: 0.06,
        fill: { color: this.h(C.hdr_bg) },
        line: { width: 0 }
      });
      slide.addText(`${m.title}\n${m.date}`, {
        x: mx - 0.70, y: 6.58, w: 1.40, h: 0.40,
        fontSize: 7.5, bold: true, color: this.h(C.canvas_bg), align: "center", fontFace: "Calibri", margin: 0
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 14: EXECUTIVE ORGANIZATION HIERARCHY
  // ══════════════════════════════════════════════════════════════════════════
  static buildOrgChart(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const leader = data.leader || {
      role: "Executive Vice President & Global Head of GBS",
      name: "Executive Operating Board",
      mandate: "Global finance controllership, shared services delivery, and enterprise automation.",
      hc: "1,600+ FTE"
    };

    // 1. Leader Card
    slide.addShape(this.getShapeType("roundRect"), {
      x: 4.66, y: 0.76, w: 4.00, h: 0.92,
      rectRadius: 0.08,
      fill: { color: this.h(C.hdr_bg) },
      line: { color: this.h(C.card_bd), width: 1.0 }
    });
    slide.addShape(this.getShapeType("rect"), {
      x: 4.66, y: 0.76, w: 0.06, h: 0.92,
      fill: { color: this.h(C.stripe) },
      line: { width: 0 }
    });
    slide.addText(leader.role || "", {
      x: 4.90, y: 0.84, w: 3.60, h: 0.26,
      fontSize: 11, bold: true, color: this.h(C.canvas_bg), fontFace: "Calibri", margin: 0
    });
    slide.addText(leader.name || "", {
      x: 4.90, y: 1.10, w: 3.60, h: 0.22,
      fontSize: 9.5, bold: true, color: this.h(C.stripe), fontFace: "Calibri", margin: 0
    });
    slide.addText(leader.mandate || "", {
      x: 4.90, y: 1.30, w: 3.60, h: 0.28,
      fontSize: 7.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0
    });

    // 2. Organizational Connectors (Always Rendered)
    this.addArrowDown(slide, 6.66, 1.68, 2.00, this.h(C.stripe));
    slide.addShape(this.getShapeType("line"), {
      x: 2.40, y: 2.00, w: 8.52, h: 0,
      line: { color: this.h(C.stripe), width: 2.0 }
    });
    this.addArrowDown(slide, 2.40, 2.00, 2.20, this.h(C.stripe));
    this.addArrowDown(slide, 6.66, 2.00, 2.20, this.h(C.stripe));
    this.addArrowDown(slide, 10.92, 2.00, 2.20, this.h(C.stripe));

    // 3. Functional Divisions (Always Rendered)
    const divisions = (data.divisions && data.divisions.length) ? data.divisions : [
      {
        title: "Digital Finance & Controllership",
        owner: "VP Global Controllership",
        mandate: "Direct oversight of sub-ledger freeze, statutory reporting, and SOX 404 audit compliance.",
        color: C.blue_accent,
        teams: [
          { name: "Accounting Policy & Standards", lead: "Global Lead", hc: "45 FTE" },
          { name: "Intercompany Reconciliation Runbook", lead: "Principal Lead", hc: "85 FTE" }
        ]
      },
      {
        title: "Shared Services Global Delivery",
        owner: "VP GBS Operations",
        mandate: "24/7 operational execution across regional hubs (Amsterdam, Panama, Chennai).",
        color: C.amber_accent,
        teams: [
          { name: "Bilateral Netting & Settlement", lead: "Regional Ops Lead", hc: "220 FTE" },
          { name: "Discrepancy Triage & Exception Desk", lead: "Operations Manager", hc: "340 FTE" }
        ]
      },
      {
        title: "Enterprise Automation & AI CoE",
        owner: "VP Intelligent Automation",
        mandate: "Build, deploy, and maintain autonomous agents, OCR pipelines, and real-time CDC telemetry.",
        color: C.teal_accent,
        teams: [
          { name: "Autonomous Agent Engineering", lead: "Chief AI Architect", hc: "38 FTE" },
          { name: "SAP S/4HANA Integration Gateway", lead: "Principal ERP Lead", hc: "52 FTE" }
        ]
      }
    ];

    divisions.forEach((div, idx) => {
      const isSpotlight = (stageLimit === idx + 2);
      const dx = 0.40 + idx * 4.26;

      // Division Card
      slide.addShape(this.getShapeType("roundRect"), {
        x: dx, y: 2.20, w: 4.00, h: 1.10,
        rectRadius: 0.08,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? C.stripe : C.card_bd), width: isSpotlight ? 1.8 : 1.0 }
      });
      slide.addShape(this.getShapeType("rect"), {
        x: dx, y: 2.20, w: 0.05, h: 1.10,
        fill: { color: this.h(div.color || C.stripe) },
        line: { width: 0 }
      });
      slide.addText(div.title || "", {
        x: dx + 0.20, y: 2.32, w: 2.70, h: 0.26,
        fontSize: 10.5, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
      });
      slide.addText(div.owner || "", {
        x: dx + 0.20, y: 2.56, w: 2.70, h: 0.20,
        fontSize: 8.5, bold: true, color: this.h(div.color || C.stripe), fontFace: "Calibri", margin: 0
      });
      slide.addText(div.mandate || "", {
        x: dx + 0.16, y: 2.80, w: 3.68, h: 0.40,
        fontSize: 7.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
      });

      this.addArrowDown(slide, dx + 2.00, 3.30, 3.70, this.h(div.color || C.stripe));

      // Team Cards
      (div.teams || []).forEach((tm, tIdx) => {
        const ty = 3.70 + tIdx * 1.02;
        slide.addShape(this.getShapeType("roundRect"), {
          x: dx, y: ty, w: 4.00, h: 0.88,
          rectRadius: 0.06,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 1.0 }
        });
        slide.addShape(this.getShapeType("rect"), {
          x: dx, y: ty, w: 0.04, h: 0.88,
          fill: { color: this.h(div.color || C.stripe) },
          line: { width: 0 }
        });
        slide.addText(tm.name || "", {
          x: dx + 0.20, y: ty + 0.18, w: 2.70, h: 0.24,
          fontSize: 10, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0
        });
        slide.addText(tm.lead || "", {
          x: dx + 0.20, y: ty + 0.44, w: 2.70, h: 0.22,
          fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0
        });
        slide.addShape(this.getShapeType("roundRect"), {
          x: dx + 2.90, y: ty + 0.18, w: 0.94, h: 0.22,
          rectRadius: 0.04,
          fill: { color: this.h(C.blue_bg) },
          line: { width: 0 }
        });
        slide.addText(tm.hc || "", {
          x: dx + 2.90, y: ty + 0.18, w: 0.94, h: 0.22,
          fontSize: 7.5, bold: true, color: this.h(C.text_secondary), align: "center", fontFace: "Calibri", margin: 0
        });
      });
    });

    // 4. Bottom Summary KPIs Ribbon (Always Rendered)
    const kpis = (data.summary_kpis && data.summary_kpis.length) ? data.summary_kpis : [
      { label: "TOTAL GLOBAL HEADCOUNT", val: "1,600 FTE", sub: "3 Regional Hubs" },
      { label: "GLOBAL DELIVERY SLA", val: "99.2%", sub: "Bilateral Timeliness" },
      { label: "SOX AUDIT SIGN-OFF", val: "100%", sub: "Zero Deficiencies" }
    ];

    kpis.forEach((k, idx) => {
      const kx = 0.40 + idx * 4.26;
      slide.addShape(this.getShapeType("roundRect"), {
        x: kx, y: 5.96, w: 4.00, h: 0.90,
        rectRadius: 0.08,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addText(k.label || "", { x: kx + 0.20, y: 6.06, w: 3.60, h: 0.20, fontSize: 8.5, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addText(k.val || "", { x: kx + 0.20, y: 6.28, w: 1.80, h: 0.40, fontSize: 20, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(k.sub || "", { x: kx + 2.00, y: 6.32, w: 1.80, h: 0.30, fontSize: 8.5, color: this.h(C.teal_accent), fontFace: "Calibri", margin: 0 });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 15: FINANCIAL BUDGET WATERFALL
  // ══════════════════════════════════════════════════════════════════════════
  static buildBudgetWaterfall(pptx, data, C, stageLimit = 5) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const base = data.baseline || { title: "FY25 BASELINE", amount: "€42.8M", val: 42.8 };
    const drivers = (data.drivers && data.drivers.length) ? data.drivers : [
      { title: "AI Automation Dividend", amount: "-€4.2M", val: -4.2, desc: "Autonomous matching reduces BPO contractor headcount." },
      { title: "Legacy Tool Consolidation", amount: "-€2.8M", val: -2.8, desc: "Sunset 14 regional reconciliation licenses for SAP." },
      { title: "Global Hub Restructuring", amount: "-€3.5M", val: -3.5, desc: "Panama and Chennai shared services optimization." },
      { title: "Cloud Infrastructure Capex", amount: "+€1.2M", val: 1.2, desc: "HealthSuite cloud scaling and CDC pipeline." },
      { title: "Regulatory & Tax Compliance", amount: "-€1.5M", val: -1.5, desc: "Automated VAT reconciliation reduces audit penalties." }
    ];
    const target = data.target || { title: "FY26 TARGET", amount: "€32.0M", val: 32.0, sub: "Net Savings" };
    const scorecards = (data.scorecards && data.scorecards.length) ? data.scorecards : [
      { label: "NET OPEX REDUCTION", val: "-€10.8M", sub: "-25.2% Cost Takeout" },
      { label: "FTE REALLOCATION", val: "+45 FTE", sub: "Shifted to Value Analytics" },
      { label: "AUTOMATION DIVIDEND", val: "4.2x ROI", sub: "Payback in 8 Months" }
    ];

    const colW = 1.62;
    const colGap = 0.16;
    const chartBottomY = 5.40;
    const scale = 3.60 / 50; // Executive scale from 0 to 50M: 0.072 in/M

    // Horizontal Baseline Axis Line
    slide.addShape(this.getShapeType("line"), {
      x: 0.40, y: chartBottomY, w: 12.53, h: 0,
      line: { color: this.h(C.card_bd), width: 1.5 }
    });

    let runningVal = base.val || 42.8;
    const baseH = runningVal * scale;
    const baseY = chartBottomY - baseH;

    // Baseline Bar (Always Rendered)
    slide.addShape(this.getShapeType("roundRect"), {
      x: 0.40, y: baseY, w: colW, h: baseH,
      rectRadius: 0.06,
      fill: { color: this.h(C.hdr_bg) },
      line: { width: 0 }
    });
    slide.addText(base.amount || "", {
      x: 0.40, y: baseY - 0.28, w: colW, h: 0.26,
      fontSize: 13, bold: true, color: this.h(C.text_primary), align: "center", fontFace: "Calibri", margin: 0
    });
    slide.addText("FY25 BASELINE\nPrior Year Base", {
      x: 0.40, y: baseY + 0.20, w: colW, h: 0.40,
      fontSize: 8.5, bold: true, color: this.h(C.canvas_bg), align: "center", fontFace: "Calibri", margin: 0
    });

    // 5 Waterfall Bridge Drivers (Always Rendered Across Full Width)
    drivers.forEach((drv, idx) => {
      const isSpotlight = (stageLimit === idx + 2);
      const x = 0.40 + (idx + 1) * (colW + colGap);
      const isIncrease = drv.val > 0;
      const prevVal = runningVal;
      runningVal += drv.val;

      const topVal = Math.max(prevVal, runningVal);
      const botVal = Math.min(prevVal, runningVal);
      const barY = chartBottomY - topVal * scale;
      const barH = Math.max(0.24, (topVal - botVal) * scale);
      const prevY = chartBottomY - prevVal * scale;

      // Dashed connector line from previous bar
      slide.addShape(this.getShapeType("line"), {
        x: x - colGap, y: prevY, w: colGap, h: 0,
        line: { color: this.h(C.dashed_border), width: 1.0, dashType: "dash" }
      });

      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: barY, w: colW, h: barH,
        rectRadius: 0.06,
        fill: { color: this.h(drv.color || (isIncrease ? C.rose_accent : C.teal_accent)) },
        line: isSpotlight ? { color: this.h(C.stripe), width: 2.0 } : { width: 0 }
      });
      slide.addText(drv.amount || "", {
        x: x, y: barY - 0.24, w: colW, h: 0.22,
        fontSize: 10.5, bold: true, color: this.h(isIncrease ? C.rose_accent : C.teal_accent), align: "center", fontFace: "Calibri", margin: 0
      });

      // Label below chart axis
      slide.addShape(this.getShapeType("roundRect"), {
        x: x, y: chartBottomY + 0.12, w: colW, h: 0.86,
        rectRadius: 0.06,
        fill: { color: this.h(isSpotlight ? (C.blue_bg || C.card_bg) : C.card_bg) },
        line: { color: this.h(isSpotlight ? C.stripe : C.card_bd), width: 1.0 }
      });
      slide.addText(drv.title || "", {
        x: x + 0.05, y: chartBottomY + 0.16, w: colW - 0.10, h: 0.28,
        fontSize: 8, bold: true, color: this.h(C.text_primary), align: "center", fontFace: "Calibri", margin: 0
      });
      slide.addText(drv.desc || "", {
        x: x + 0.05, y: chartBottomY + 0.44, w: colW - 0.10, h: 0.48,
        fontSize: 7, color: this.h(C.text_secondary), align: "center", fontFace: "Calibri", margin: 0
      });
    });

    // Target Bar (Always Rendered)
    const targetX = 0.40 + 6 * (colW + colGap);
    const targetH = (target.val || 32.0) * scale;
    const targetY = chartBottomY - targetH;
    const isTargetSpotlight = (stageLimit === 5);

    slide.addShape(this.getShapeType("line"), {
      x: targetX - colGap, y: targetY, w: colGap, h: 0,
      line: { color: this.h(C.dashed_border), width: 1.0, dashType: "dash" }
    });

    slide.addShape(this.getShapeType("roundRect"), {
      x: targetX, y: targetY, w: colW, h: targetH,
      rectRadius: 0.06,
      fill: { color: this.h(C.stripe) },
      line: isTargetSpotlight ? { color: this.h(C.amber_accent), width: 2.0 } : { width: 0 }
    });
    slide.addText(target.amount || "", {
      x: targetX, y: targetY - 0.28, w: colW, h: 0.26,
      fontSize: 13, bold: true, color: this.h(C.stripe), align: "center", fontFace: "Calibri", margin: 0
    });
    slide.addText("FY26 TARGET\nNet Savings", {
      x: targetX, y: targetY + 0.20, w: colW, h: 0.40,
      fontSize: 8.5, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0
    });

    // Bottom Summary Scorecards (Always Rendered)
    scorecards.forEach((sc, idx) => {
      const scX = 0.40 + idx * 4.26;
      slide.addShape(this.getShapeType("roundRect"), {
        x: scX, y: 6.70, w: 4.00, h: 0.58,
        rectRadius: 0.06,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(this.getShapeType("rect"), {
        x: scX, y: 6.70, w: 0.04, h: 0.58,
        fill: { color: this.h(C.teal_accent) },
        line: { width: 0 }
      });
      slide.addText(sc.label || "", { x: scX + 0.20, y: 6.74, w: 2.00, h: 0.18, fontSize: 8, bold: true, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addText(sc.val || "", { x: scX + 0.20, y: 6.94, w: 2.00, h: 0.28, fontSize: 14, bold: true, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(sc.sub || "", { x: scX + 2.10, y: 6.94, w: 1.80, h: 0.24, fontSize: 8.5, color: this.h(C.teal_accent), fontFace: "Calibri", margin: 0 });
    });
  }
}

if (typeof window !== "undefined") {
  window.ClientPptxGenerator = ClientPptxGenerator;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = ClientPptxGenerator;
}
