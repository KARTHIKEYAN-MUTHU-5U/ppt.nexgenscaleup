/**
 * Client-side Presentation Generator using PptxGenJS
 * Compiles exact 16:9 Philips Executive Master Blueprints into native .pptx
 * Supports all 10 executive presentation templates with 2.0 pt DrawingML connectors.
 * Dynamically resolves warm palettes — ABSOLUTELY ZERO hardcoded blue AI slop!
 */

class ClientPptxGenerator {
  static async generate(data) {
    if (typeof PptxGenJS === "undefined") {
      throw new Error("PptxGenJS library is not loaded");
    }

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9"; // 13.333 x 7.50 inches

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
    let filename = "Philips_Executive_Presentation.pptx";

    switch (templateId) {
      case "strategic_roadmap":
        filename = "Philips_Strategic_Transformation_Roadmap.pptx";
        this.buildStrategicRoadmap(pptx, data, C);
        break;
      case "operating_model":
        filename = "Philips_Target_Operating_Model_TOM.pptx";
        this.buildOperatingModel(pptx, data, C);
        break;
      case "data_pipeline":
        filename = "Philips_HealthSuite_AI_Data_Pipeline.pptx";
        this.buildDataPipeline(pptx, data, C);
        break;
      case "kpi_scorecard":
        filename = "Royal_Philips_Executive_KPI_Scorecard.pptx";
        this.buildKpiScorecard(pptx, data, C);
        break;
      case "financial_close":
        filename = "Philips_Month_End_Financial_Close.pptx";
        this.buildFinancialClose(pptx, data, C);
        break;
      case "vendor_p2p":
        filename = "Philips_Procure_To_Pay_P2P.pptx";
        this.buildVendorP2P(pptx, data, C);
        break;
      case "it_service":
        filename = "Philips_ITIL_Service_Architecture.pptx";
        this.buildITService(pptx, data, C);
        break;
      case "risk_compliance":
        filename = "Philips_Enterprise_Risk_Compliance_5x5.pptx";
        this.buildRiskCompliance(pptx, data, C);
        break;
      case "customer_journey":
        filename = "Philips_Clinical_Customer_Journey.pptx";
        this.buildCustomerJourney(pptx, data, C);
        break;
      case "change_mgmt":
        filename = "Philips_Change_Management_ADKAR.pptx";
        this.buildChangeMgmt(pptx, data, C);
        break;
      case "swot_analysis":
        filename = "Philips_Executive_SWOT_Matrix.pptx";
        this.buildSwotAnalysis(pptx, data, C);
        break;
      case "project_timeline":
        filename = "Philips_Project_Gantt_Timeline.pptx";
        this.buildProjectTimeline(pptx, data, C);
        break;
      case "org_chart":
        filename = "Philips_Executive_Org_Hierarchy.pptx";
        this.buildOrgChart(pptx, data, C);
        break;
      case "budget_waterfall":
        filename = "Philips_Financial_Budget_Waterfall.pptx";
        this.buildBudgetWaterfall(pptx, data, C);
        break;
      case "process_flow":
      default:
        filename = "Philips_ICA_Executive_Blueprint.pptx";
        this.buildProcessFlow(pptx, data, C);
        break;
    }

    return pptx.writeFile({ fileName: filename });
  }

  // Generate 5-Slide Progressive Morph Deck
  static async generateProgressiveDeck(data) {
    if (typeof PptxGenJS === "undefined") {
      throw new Error("PptxGenJS library is not loaded");
    }

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";

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

    const stageNames = [
      "Stage 1: Ingestion & Scope Validation",
      "Stage 2: Open-Item Delta & Filter",
      "Stage 3: 3-Track Root Cause Taxonomy",
      "Stage 4: Action & Remediation Execution",
      "Stage 5: Closed-Loop Governance Gate & SLA"
    ];

    for (let s = 1; s <= 5; s++) {
      const slideData = JSON.parse(JSON.stringify(data));
      slideData.header = slideData.header || {};
      slideData.header.subtitle = `PHILIPS EXECUTIVE SUITE  •  ${stageNames[s - 1].toUpperCase()}`;
      this.buildProcessFlow(pptx, slideData, C, s);
    }

    return pptx.writeFile({ fileName: "Philips_ICA_Executive_Progressive_Morph_Deck.pptx" });
  }

  static h(colorStr) {
    if (!colorStr) return "FFFFFF";
    return String(colorStr).replace("#", "").trim();
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
  static buildStrategicRoadmap(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const horizons = data.horizons || [];
    const workstreams = data.workstreams || [];
    const metrics = data.metrics || [];

    this.addHeader(slide, pptx, h, b, C);

    // Horizon Headers
    horizons.forEach((hz, i) => {
      const x = 3.20 + i * 3.24;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x,
        y: 0.78,
        w: 3.10,
        h: 0.46,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(hz.color), width: 1.5 }
      });
      slide.addText(
        [
          { text: hz.title + "\n", options: { bold: true, fontSize: 9.5, color: this.h(hz.color) } },
          { text: hz.sub, options: { fontSize: 7, color: this.h(C.text_muted) } }
        ],
        { x: x + 0.14, y: 0.82, w: 2.80, h: 0.38, fontFace: "Calibri", margin: 0 }
      );
    });

    // Workstreams
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
        const x = 3.20 + hidx * 3.24;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: x,
          y: y,
          w: 3.10,
          h: 1.06,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 0.75 }
        });
        slide.addText(htxt, { x: x + 0.14, y: y + 0.20, w: 2.80, h: 0.66, fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
      });
    });

    // Metrics
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40,
      y: 6.26,
      w: 12.53,
      h: 0.90,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.blue_accent), width: 1 }
    });
    metrics.forEach((m, i) => {
      const x = 1.20 + i * 4.00;
      slide.addText(
        [
          { text: m.label + "\n", options: { bold: true, fontSize: 9, color: this.h(C.text_muted) } },
          { text: m.value + "  ", options: { bold: true, fontSize: 24, color: this.h(C.blue_accent) } },
          { text: m.sub, options: { fontSize: 8.5, color: this.h(C.text_secondary) } }
        ],
        { x: x, y: 6.36, w: 3.50, h: 0.70, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 3: TARGET OPERATING MODEL (TOM)
  // ══════════════════════════════════════════════════════════════════════════
  static buildOperatingModel(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const tiers = data.tiers || [];
    const raci = data.raci || [];

    this.addHeader(slide, pptx, h, b, C);

    tiers.forEach((t, i) => {
      const y = 0.84 + i * 2.00;
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: y, w: 7.50, h: 1.86, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.56, y: y + 0.16, w: 2.20, h: 0.26, fill: { color: this.h(C.blue_accent) }, line: { width: 0 } });
      slide.addText(t.level, { x: 0.56, y: y + 0.16, w: 2.20, h: 0.26, bold: true, fontSize: 8, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });
      slide.addText(t.title, { x: 0.56, y: y + 0.50, w: 5.50, h: 0.35, bold: true, fontSize: 13, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText("Leadership: " + t.owner, { x: 0.56, y: y + 0.85, w: 5.50, h: 0.25, bold: true, fontSize: 9, color: this.h(C.amber_accent), fontFace: "Calibri", margin: 0 });
      slide.addText(t.mandate, { x: 0.56, y: y + 1.15, w: 5.50, h: 0.55, fontSize: 8.5, color: this.h(C.text_secondary), fontFace: "Calibri", margin: 0 });
    });

    slide.addShape(pptx.ShapeType.roundRect, { x: 8.20, y: 0.84, w: 4.73, h: 5.86, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.40, y: 1.04, w: 2.20, h: 0.28, fill: { color: this.h(C.blue_accent) }, line: { width: 0 } });
    slide.addText("GOVERNANCE RACI MATRIX", { x: 8.40, y: 1.04, w: 2.20, h: 0.28, bold: true, fontSize: 8.5, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    raci.forEach((r, idx) => {
      const ry = 1.60 + idx * 0.70;
      slide.addText(
        [
          { text: r.activity + "\n", options: { bold: true, fontSize: 9.5, color: this.h(C.text_primary) } },
          { text: `Tier 1: ${r.s}   •   Tier 2: ${r.c}   •   Tier 3: ${r.h}`, options: { bold: true, fontSize: 8.5, color: this.h(C.amber_accent) } }
        ],
        { x: 8.40, y: ry, w: 4.33, h: 0.55, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 4: DATA PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildDataPipeline(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const stages = data.stages || [];
    const guardrails = data.guardrails || [];

    this.addHeader(slide, pptx, h, b, C);

    stages.forEach((st, i) => {
      const x = 0.40 + i * 3.16;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.90, w: 2.92, h: 4.20, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
      slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.20, y: 1.12, w: 0.48, h: 0.32, fill: { color: this.h(C.blue_accent) }, line: { width: 0 } });
      slide.addText(st.num, { x: x + 0.20, y: 1.12, w: 0.48, h: 0.32, bold: true, fontSize: 9, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });
      slide.addText(st.name, { x: x + 0.20, y: 1.70, w: 2.52, h: 0.35, bold: true, fontSize: 12, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(st.tech, { x: x + 0.20, y: 2.10, w: 2.52, h: 0.50, fontSize: 9, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.20, y: 4.30, w: 2.52, h: 0.42, fill: { color: this.h(C.blue_bg) }, line: { width: 0 } });
      slide.addText(st.sla, { x: x + 0.20, y: 4.30, w: 2.52, h: 0.42, bold: true, fontSize: 9, color: this.h(C.blue_accent), align: "center", fontFace: "Calibri", margin: 0 });
    });

    slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: 5.34, w: 12.53, h: 1.76, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
    slide.addText("ENTERPRISE GOVERNANCE & COMPLIANCE GUARDRAILS", { x: 0.64, y: 5.50, w: 10.00, h: 0.30, bold: true, fontSize: 10, color: this.h(C.blue_accent), fontFace: "Calibri", margin: 0 });
    guardrails.forEach((g, i) => {
      const gx = 0.64 + i * 4.00;
      slide.addText(
        [
          { text: g.title + "\n", options: { bold: true, fontSize: 9.5, color: this.h(C.text_primary) } },
          { text: g.detail, options: { fontSize: 8, color: this.h(C.text_muted) } }
        ],
        { x: gx, y: 5.90, w: 3.60, h: 0.80, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 5: KPI SCORECARD
  // ══════════════════════════════════════════════════════════════════════════
  static buildKpiScorecard(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };

    const b = data.branding || {};
    const h = data.header || {};
    const kpis = data.kpis || [];
    const pillars = data.pillars || [];

    this.addHeader(slide, pptx, h, b, C);

    kpis.forEach((k, i) => {
      const x = 0.40 + i * 3.16;
      const ragColor = k.rag === "green" ? "10B981" : (k.rag === "amber" ? "F59E0B" : "EF4444");
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.86, w: 2.92, h: 1.90, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
      slide.addShape(pptx.ShapeType.rect, { x: x, y: 0.86, w: 0.06, h: 1.90, fill: { color: ragColor }, line: { width: 0 } });
      slide.addText(k.label, { x: x + 0.20, y: 1.05, w: 2.50, h: 0.25, bold: true, fontSize: 9, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addText(k.value, { x: x + 0.20, y: 1.35, w: 2.50, h: 0.55, bold: true, fontSize: 26, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(k.delta + " • " + k.note, { x: x + 0.20, y: 2.05, w: 2.50, h: 0.45, bold: true, fontSize: 8.5, color: ragColor, fontFace: "Calibri", margin: 0 });
    });

    pillars.forEach((p, i) => {
      const y = 3.00 + i * 1.34;
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: y, w: 12.53, h: 1.14, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
      slide.addText(p.name, { x: 0.64, y: y + 0.25, w: 10.00, h: 0.35, bold: true, fontSize: 13, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
      slide.addText(p.detail, { x: 0.64, y: y + 0.60, w: 10.00, h: 0.35, fontSize: 9.5, color: this.h(C.text_muted), fontFace: "Calibri", margin: 0 });
      slide.addShape(pptx.ShapeType.roundRect, { x: 11.00, y: y + 0.36, w: 1.50, h: 0.44, fill: { color: this.h(C.blue_bg) }, line: { width: 0 } });
      slide.addText(p.score, { x: 11.00, y: y + 0.36, w: 1.50, h: 0.44, bold: true, fontSize: 15, color: this.h(C.blue_accent), align: "center", fontFace: "Calibri", margin: 0 });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 6: FINANCIAL CLOSE PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildFinancialClose(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const phases = data.phases || [];
    phases.forEach((p, i) => {
      const x = 0.40 + i * 3.16;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.76, w: 2.92, h: 0.60, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1 } });
      slide.addText(`${p.phase} • ${p.days}\n${p.title}`, { x: x + 0.10, y: 0.82, w: 2.70, h: 0.48, bold: true, fontSize: 9, color: this.h(C.text_primary), fontFace: "Calibri", margin: 0 });
    });

    slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: 1.52, w: 8.70, h: 4.40, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.dashed_border), width: 1.5, dashType: "dash" } });
    slide.addText("SUB-LEDGER SETTLEMENT RUNBOOK", { x: 0.56, y: 1.60, w: 3.50, h: 0.25, bold: true, fontSize: 10, color: this.h(C.blue_accent), fontFace: "Calibri" });

    (data.nodes || []).forEach((n, idx) => {
      const row = idx < 3 ? 0 : 1;
      const col = idx % 3;
      const x = 0.70 + col * 2.60;
      const y = row === 0 ? 2.00 : 3.80;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: 2.30, h: 1.20, fill: { color: this.h(C.blue_bg) }, line: { color: this.h(C.blue_border), width: 1 } });
      slide.addText(`[${n.badge}] ${n.title}\n${n.desc}`, { x: x + 0.12, y: y + 0.12, w: 2.06, h: 0.96, fontSize: 8.5, color: this.h(C.text_primary), fontFace: "Calibri" });
    });

    // Governance Right Box
    slide.addShape(pptx.ShapeType.roundRect, { x: 9.30, y: 1.52, w: 3.63, h: 4.40, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
    slide.addText("GOVERNANCE GATEWAYS & MATERIALITY", { x: 9.50, y: 1.70, w: 3.20, h: 0.30, bold: true, fontSize: 11, color: this.h(C.rose_accent), fontFace: "Calibri" });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 7: PROCURE-TO-PAY (P2P)
  // ══════════════════════════════════════════════════════════════════════════
  static buildVendorP2P(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    (data.steps || []).forEach((st, i) => {
      const x = 0.40 + i * 2.53;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.80, w: 2.35, h: 1.50, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1 } });
      slide.addText(`${st.num}. ${st.title}\n${st.sub}`, { x: x + 0.14, y: 0.94, w: 2.07, h: 1.20, bold: true, fontSize: 9.5, color: this.h(C.text_primary), fontFace: "Calibri" });
    });

    slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: 2.50, w: 7.90, h: 3.40, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.dashed_border), width: 1.5, dashType: "dash" } });
    slide.addText("SAP 3-WAY MATCHING PIPELINE (PO vs GR vs IR)", { x: 0.60, y: 2.70, w: 5.00, h: 0.30, bold: true, fontSize: 11, color: this.h(C.amber_accent), fontFace: "Calibri" });

    slide.addShape(pptx.ShapeType.roundRect, { x: 8.50, y: 2.50, w: 4.43, h: 3.40, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
    slide.addText("VENDOR PERFORMANCE & RISK SCORECARD", { x: 8.70, y: 2.70, w: 4.00, h: 0.30, bold: true, fontSize: 11, color: this.h(C.teal_accent), fontFace: "Calibri" });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 8: IT SERVICE DELIVERY ARCHITECTURE
  // ══════════════════════════════════════════════════════════════════════════
  static buildITService(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    (data.tiers || []).forEach((t, i) => {
      const x = 0.40 + i * 2.15;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.80, w: 2.00, h: 4.90, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
      slide.addText(`${t.level}: ${t.name}\n\n${t.desc}\n\nSLA: ${t.sla}`, { x: x + 0.14, y: 0.95, w: 1.72, h: 4.60, fontSize: 9.5, color: this.h(C.text_primary), fontFace: "Calibri" });
    });

    slide.addShape(pptx.ShapeType.roundRect, { x: 9.15, y: 0.80, w: 3.78, h: 2.30, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.red_border), width: 1.5 } });
    slide.addText("MAJOR INCIDENT MANAGEMENT (MIM)\nP1 Critical HealthSuite Cloud Outage Bridge", { x: 9.30, y: 0.95, w: 3.48, h: 1.00, bold: true, fontSize: 11, color: this.h(C.red_accent), fontFace: "Calibri" });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 9: RISK & COMPLIANCE 5x5 MATRIX
  // ══════════════════════════════════════════════════════════════════════════
  static buildRiskCompliance(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: 0.80, w: 7.00, h: 4.90, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
    slide.addText("5x5 ENTERPRISE RISK HEAT MAP (Likelihood x Impact)", { x: 0.60, y: 1.00, w: 6.50, h: 0.30, bold: true, fontSize: 11, color: this.h(C.text_primary), fontFace: "Calibri" });

    slide.addShape(pptx.ShapeType.roundRect, { x: 7.60, y: 0.80, w: 5.33, h: 4.90, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
    slide.addText("SOX CONTROL TESTING FRAMEWORK", { x: 7.80, y: 1.00, w: 4.80, h: 0.30, bold: true, fontSize: 11, color: this.h(C.blue_accent), fontFace: "Calibri" });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 10: CUSTOMER & CLINICAL JOURNEY
  // ══════════════════════════════════════════════════════════════════════════
  static buildCustomerJourney(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    (data.stages || []).forEach((st, i) => {
      const x = 0.40 + i * 2.10;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.80, w: 1.98, h: 4.80, fill: { color: this.h(C.card_bg) }, line: { color: this.h(C.card_bd), width: 1.2 } });
      slide.addText(`${st.phase}\n${st.title}\n\n${st.action}\n\nScore: ${st.score}`, { x: x + 0.12, y: 0.95, w: 1.74, h: 4.50, fontSize: 9.5, color: this.h(C.text_primary), fontFace: "Calibri" });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HELPER DRAWING METHODS
  // ══════════════════════════════════════════════════════════════════════════
  static addBpCard(slide, x, y, w, h, title, sub, emote, bg, border, stripColor = null, chevronColor = null, badgeText = null, badgeColor = null) {
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.roundRect : "roundRect", {
      x: x,
      y: y,
      w: w,
      h: h,
      rectRadius: 0.08,
      fill: { color: bg },
      line: { color: border, width: 1 }
    });

    if (stripColor) {
      slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.rect : "rect", {
        x: x,
        y: y,
        w: 0.06,
        h: h,
        fill: { color: stripColor },
        line: { width: 0 }
      });
    }

    if (badgeText && badgeColor) {
      slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.roundRect : "roundRect", {
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
        const emoteFilename = window.getEmoteInfo ? window.getEmoteInfo(emote).filename : (emote.includes(".") ? emote : (emote.startsWith("m_") || emote.startsWith("icon_") ? `${emote}.png` : `${emote}.gif`));
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
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.line : "line", {
      x: x1,
      y: y,
      w: x2 - x1,
      h: 0,
      line: { color: color, width: 2.0, endArrowType: "triangle" }
    });
  }

  static addArrowDown(slide, x, y1, y2, color) {
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.line : "line", {
      x: x,
      y: y1,
      w: 0,
      h: y2 - y1,
      line: { color: color, width: 2.0, endArrowType: "triangle" }
    });
  }

  static addLine(slide, x1, y1, x2, y2, color) {
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.line : "line", {
      x: x1,
      y: y1,
      w: x2 - x1,
      h: y2 - y1,
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
  static buildChangeMgmt(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const phases = data.phases || [];
    phases.forEach((p, idx) => {
      const x = 0.40 + idx * 2.52;
      const isComplete = p.status === "COMPLETE";
      const accent = isComplete ? C.teal_accent : C.amber_accent;

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: 0.72, w: 2.44, h: 0.42,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: x, y: 0.72, w: 0.04, h: 0.42,
        fill: { color: this.h(accent) }
      });
      slide.addText(`0${idx+1}`, {
        x: x + 0.10, y: 0.76, w: 0.34, h: 0.26,
        fontSize: 10, bold: true, color: this.h(accent), align: "center"
      });
      slide.addText(p.title || "", {
        x: x + 0.50, y: 0.74, w: 1.50, h: 0.20,
        fontSize: 10, bold: true, color: this.h(C.text_primary)
      });
      slide.addText(p.sub || "", {
        x: x + 0.50, y: 0.90, w: 1.50, h: 0.18,
        fontSize: 8, color: this.h(C.text_muted)
      });
      if (p.emote) {
        try {
          slide.addImage({ path: this.getEmotePath(p.emote), x: x + 2.08, y: 0.80, w: 0.24, h: 0.24 });
        } catch(e) {}
      }
    });

    const workstreams = data.workstreams || [];
    workstreams.forEach((ws, wIdx) => {
      const y = 1.26 + wIdx * 1.58;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.40, y: y, w: 2.60, h: 1.42,
        fill: { color: this.h(C.hdr_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.40, y: y, w: 0.06, h: 1.42,
        fill: { color: this.h(C.stripe) }
      });
      if (ws.emote) {
        try {
          slide.addImage({ path: this.getEmotePath(ws.emote), x: 0.58, y: y + 0.16, w: 0.34, h: 0.34 });
        } catch(e) {}
      }
      slide.addText(ws.lane || "", {
        x: 1.00, y: y + 0.20, w: 1.85, h: 0.30,
        fontSize: 11, bold: true, color: this.h(C.canvas_bg)
      });
      slide.addText("CROSS-FUNCTIONAL WORKSTREAM\nAdoption & Governance Lead", {
        x: 0.58, y: y + 0.65, w: 2.20, h: 0.50,
        fontSize: 9, color: this.h(C.text_muted)
      });

      (ws.initiatives || []).forEach((init, iIdx) => {
        const ix = 3.20 + iIdx * 4.80;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: ix, y: y, w: 4.60, h: 1.42,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 1.0 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: ix, y: y, w: 0.05, h: 1.42,
          fill: { color: this.h(C.stripe) }
        });
        slide.addText(init.title || "", {
          x: ix + 0.18, y: y + 0.18, w: 3.20, h: 0.30,
          fontSize: 12, bold: true, color: this.h(C.text_primary)
        });
        slide.addText(init.owner || "", {
          x: ix + 3.40, y: y + 0.14, w: 1.04, h: 0.24,
          fontSize: 9, bold: true, color: this.h(C.text_secondary), align: "center",
          fill: { color: this.h(C.blue_bg) }
        });
        slide.addText(init.desc || "", {
          x: ix + 0.18, y: y + 0.52, w: 4.24, h: 0.75,
          fontSize: 10, color: this.h(C.text_secondary)
        });
      });
    });

    const gov = data.governance || {};
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: 6.16, w: 12.53, h: 0.98,
      fill: { color: this.h(C.card_bg) },
      line: { color: this.h(C.card_bd), width: 1.0 }
    });
    const govMetrics = [
      { label: "READINESS INDEX", val: gov.readiness_score || "88.4%", sub: "Target: > 85%", color: C.teal_accent },
      { label: "STAFF CERTIFIED", val: gov.trained_staff || "1,420 / 1,600", sub: "88.8% Coverage", color: C.text_primary },
      { label: "ACTIVE SUPERUSERS", val: gov.superusers_active || "64 Leads", sub: "Deployed Across 48 Entities", color: C.amber_accent },
      { label: "USER SENTIMENT", val: gov.sentiment_index || "+74 NPS", sub: "Top Decile Adoption", color: C.text_primary }
    ];
    govMetrics.forEach((m, idx) => {
      const gx = 0.70 + idx * 3.10;
      slide.addText(m.label, { x: gx, y: 6.26, w: 2.80, h: 0.20, fontSize: 9, bold: true, color: this.h(C.text_muted) });
      slide.addText(m.val, { x: gx, y: 6.48, w: 2.80, h: 0.36, fontSize: 20, bold: true, color: this.h(m.color) });
      slide.addText(m.sub, { x: gx, y: 6.84, w: 2.80, h: 0.20, fontSize: 9, color: this.h(C.text_secondary) });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 12: STRATEGIC SWOT MATRIX
  // ══════════════════════════════════════════════════════════════════════════
  static buildSwotAnalysis(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const quads = data.quadrants || {};
    const quadConfigs = [
      { d: quads.strengths || {}, x: 0.40, y: 0.72, color: "#10B981" },
      { d: quads.weaknesses || {}, x: 6.76, y: 0.72, color: "#F59E0B" },
      { d: quads.opportunities || {}, x: 0.40, y: 3.86, color: "#E8734A" },
      { d: quads.threats || {}, x: 6.76, y: 3.86, color: "#EF4444" }
    ];

    quadConfigs.forEach(qc => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: qc.x, y: qc.y, w: 6.16, h: 3.00,
        fill: { color: this.h(C.blue_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: qc.x, y: qc.y, w: 6.16, h: 0.42,
        fill: { color: this.h(C.hdr_bg) }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: qc.x, y: qc.y + 0.38, w: 6.16, h: 0.04,
        fill: { color: this.h(qc.color) }
      });
      slide.addText(qc.d.title || "", {
        x: qc.x + 0.20, y: qc.y + 0.08, w: 4.50, h: 0.26,
        fontSize: 11, bold: true, color: this.h(C.canvas_bg)
      });
      slide.addText(qc.d.tag || "", {
        x: qc.x + 4.90, y: qc.y + 0.08, w: 0.80, h: 0.24,
        fontSize: 9, bold: true, color: "FFFFFF", align: "center",
        fill: { color: this.h(qc.color) }
      });
      if (qc.d.emote) {
        try {
          slide.addImage({ path: this.getEmotePath(qc.d.emote), x: qc.x + 5.80, y: qc.y + 0.08, w: 0.24, h: 0.24 });
        } catch(e) {}
      }

      (qc.d.items || []).forEach((item, idx) => {
        const iy = qc.y + 0.56 + idx * 0.78;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: qc.x + 0.14, y: iy, w: 5.88, h: 0.68,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 1.0 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: qc.x + 0.14, y: iy, w: 0.04, h: 0.68,
          fill: { color: this.h(qc.color) }
        });
        slide.addText(item.code || "", {
          x: qc.x + 0.26, y: iy + 0.10, w: 0.30, h: 0.20,
          fontSize: 9, bold: true, color: this.h(qc.color)
        });
        slide.addText(item.title || "", {
          x: qc.x + 0.60, y: iy + 0.10, w: 4.40, h: 0.24,
          fontSize: 10, bold: true, color: this.h(C.text_primary)
        });
        slide.addText(item.impact || "", {
          x: qc.x + 5.10, y: iy + 0.08, w: 0.60, h: 0.20,
          fontSize: 8, bold: true, color: this.h(C.text_secondary), align: "center",
          fill: { color: this.h(C.blue_bg) }
        });
        slide.addText(item.desc || "", {
          x: qc.x + 0.26, y: iy + 0.34, w: 5.60, h: 0.30,
          fontSize: 9, color: this.h(C.text_secondary)
        });
      });
    });

    const sum = data.strategic_summary || {};
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: 6.98, w: 12.52, h: 0.42,
      fill: { color: this.h(C.hdr_bg) }
    });
    slide.addText(`EXECUTIVE STRATEGIC VERDICT:  ${sum.core_verdict || ""}`, {
      x: 0.60, y: 7.04, w: 9.50, h: 0.30,
      fontSize: 9, color: this.h(C.canvas_bg)
    });
    slide.addText(sum.priority_focus || "", {
      x: 10.20, y: 7.04, w: 2.50, h: 0.30,
      fontSize: 9, bold: true, color: this.h(C.teal_accent), align: "right"
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 13: PROJECT GANTT TIMELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildProjectTimeline(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: 0.72, w: 2.68, h: 0.48,
      fill: { color: this.h(C.hdr_bg) }
    });
    slide.addText("EXECUTION WORKSTREAM", {
      x: 0.54, y: 0.84, w: 2.40, h: 0.24,
      fontSize: 11, bold: true, color: this.h(C.canvas_bg)
    });

    const quarters = data.quarters || [];
    quarters.forEach((q, idx) => {
      const x = 3.20 + idx * 2.40;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: 0.72, w: 2.34, h: 0.48,
        fill: { color: this.h(q.highlight ? C.blue_bg : C.card_bg) },
        line: { color: this.h(q.highlight ? C.stripe : C.card_bd), width: 1.0 }
      });
      slide.addText(`${q.qtr} (${q.months})`, {
        x: x + 0.14, y: 0.82, w: 1.50, h: 0.24,
        fontSize: 10, bold: true, color: this.h(C.text_primary)
      });
      slide.addText(q.status, {
        x: x + 1.54, y: 0.82, w: 0.70, h: 0.24,
        fontSize: 8, bold: true, color: "FFFFFF", align: "center",
        fill: { color: this.h(q.status === 'COMPLETE' ? C.teal_accent : C.stripe) }
      });
    });

    const lanes = data.lanes || [];
    lanes.forEach((lane, lIdx) => {
      const y = 1.32 + lIdx * 1.18;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.40, y: y, w: 2.68, h: 1.06,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.40, y: y, w: 0.05, h: 1.06,
        fill: { color: this.h(C.stripe) }
      });
      if (lane.emote) {
        try {
          slide.addImage({ path: this.getEmotePath(lane.emote), x: 0.56, y: y + 0.16, w: 0.30, h: 0.30 });
        } catch(e) {}
      }
      slide.addText(lane.name || "", {
        x: 0.94, y: y + 0.20, w: 2.05, h: 0.40,
        fontSize: 10, bold: true, color: this.h(C.text_primary)
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 3.20, y: y, w: 9.60, h: 1.06,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0, dashType: "dash" }
      });

      (lane.bars || []).forEach((bar, bIdx) => {
        const bx = 3.20 + bar.start * 9.60;
        const bw = bar.span * 9.60;
        const by = y + 0.16 + bIdx * 0.46;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: bx, y: by, w: bw, h: 0.38,
          fill: { color: this.h(bar.color || C.stripe) }
        });
        slide.addText(`${bar.title} [${bar.status}]`, {
          x: bx + 0.14, y: by + 0.06, w: bw - 0.28, h: 0.26,
          fontSize: 9, bold: true, color: "FFFFFF"
        });
      });
    });

    const milestones = data.milestones || [];
    milestones.forEach(m => {
      const mx = 3.60 + m.pos * 9.00;
      slide.addShape(pptx.ShapeType.diamond, {
        x: mx - 0.14, y: 6.20, w: 0.28, h: 0.28,
        fill: { color: this.h(m.rag === 'green' ? C.teal_accent : C.amber_accent) }
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: mx - 0.70, y: 6.54, w: 1.40, h: 0.48,
        fill: { color: this.h(C.hdr_bg) }
      });
      slide.addText(`${m.title}\n${m.date}`, {
        x: mx - 0.70, y: 6.58, w: 1.40, h: 0.40,
        fontSize: 8, bold: true, color: this.h(C.canvas_bg), align: "center"
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 14: EXECUTIVE ORGANIZATION HIERARCHY
  // ══════════════════════════════════════════════════════════════════════════
  static buildOrgChart(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const leader = data.leader || {};
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4.66, y: 0.76, w: 4.00, h: 0.92,
      fill: { color: this.h(C.hdr_bg) },
      line: { color: this.h(C.card_bd), width: 1.0 }
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 4.66, y: 0.76, w: 0.06, h: 0.92,
      fill: { color: this.h(C.stripe) }
    });
    if (leader.emote) {
      try {
        slide.addImage({ path: this.getEmotePath(leader.emote), x: 4.86, y: 0.94, w: 0.44, h: 0.44 });
      } catch(e) {}
    }
    slide.addText(leader.role || "", {
      x: 5.42, y: 0.86, w: 3.10, h: 0.26,
      fontSize: 12, bold: true, color: this.h(C.canvas_bg)
    });
    slide.addText(leader.name || "", {
      x: 5.42, y: 1.10, w: 3.10, h: 0.22,
      fontSize: 10, bold: true, color: this.h(C.stripe)
    });
    slide.addText(leader.mandate || "", {
      x: 5.42, y: 1.30, w: 3.10, h: 0.28,
      fontSize: 8, color: this.h(C.text_muted)
    });

    this.addArrowDown(slide, 6.66, 1.68, 2.00, this.h(C.stripe));
    slide.addShape(pptx.ShapeType.line, {
      x: 2.40, y: 2.00, w: 8.52, h: 0,
      line: { color: this.h(C.stripe), width: 2.0 }
    });
    this.addArrowDown(slide, 2.40, 2.00, 2.20, this.h(C.stripe));
    this.addArrowDown(slide, 6.66, 2.00, 2.20, this.h(C.stripe));
    this.addArrowDown(slide, 10.92, 2.00, 2.20, this.h(C.stripe));

    const divisions = data.divisions || [];
    divisions.forEach((div, idx) => {
      const dx = 0.40 + idx * 4.26;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: dx, y: 2.20, w: 4.00, h: 1.10,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: dx, y: 2.20, w: 0.05, h: 1.10,
        fill: { color: this.h(div.color || C.stripe) }
      });
      if (div.emote) {
        try {
          slide.addImage({ path: this.getEmotePath(div.emote), x: dx + 0.16, y: 2.36, w: 0.36, h: 0.36 });
        } catch(e) {}
      }
      slide.addText(div.title || "", {
        x: dx + 0.60, y: 2.32, w: 2.30, h: 0.26,
        fontSize: 11, bold: true, color: this.h(C.text_primary)
      });
      slide.addText(div.owner || "", {
        x: dx + 0.60, y: 2.54, w: 2.30, h: 0.20,
        fontSize: 9, bold: true, color: this.h(div.color || C.stripe)
      });
      slide.addText(div.mandate || "", {
        x: dx + 0.16, y: 2.80, w: 3.68, h: 0.40,
        fontSize: 8, color: this.h(C.text_secondary)
      });
      slide.addText(div.hc || "", {
        x: dx + 2.90, y: 2.34, w: 0.94, h: 0.20,
        fontSize: 8, bold: true, color: this.h(C.canvas_bg), align: "center",
        fill: { color: this.h(C.hdr_bg) }
      });

      this.addArrowDown(slide, dx + 2.00, 3.30, 3.70, this.h(div.color || C.stripe));

      (div.teams || []).forEach((tm, tIdx) => {
        const ty = 3.70 + tIdx * 1.02;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: dx, y: ty, w: 4.00, h: 0.88,
          fill: { color: this.h(C.card_bg) },
          line: { color: this.h(C.card_bd), width: 1.0 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: dx, y: ty, w: 0.04, h: 0.88,
          fill: { color: this.h(div.color || C.stripe) }
        });
        if (tm.emote) {
          try {
            slide.addImage({ path: this.getEmotePath(tm.emote), x: dx + 0.16, y: ty + 0.16, w: 0.32, h: 0.32 });
          } catch(e) {}
        }
        slide.addText(tm.name || "", {
          x: dx + 0.58, y: ty + 0.18, w: 2.30, h: 0.24,
          fontSize: 11, bold: true, color: this.h(C.text_primary)
        });
        slide.addText(tm.lead || "", {
          x: dx + 0.58, y: ty + 0.42, w: 2.30, h: 0.22,
          fontSize: 9, color: this.h(C.text_secondary)
        });
        slide.addText(tm.hc || "", {
          x: dx + 2.90, y: ty + 0.18, w: 0.94, h: 0.20,
          fontSize: 8, bold: true, color: this.h(C.text_secondary), align: "center",
          fill: { color: this.h(C.blue_bg) }
        });
      });
    });

    const kpis = data.summary_kpis || [];
    kpis.forEach((k, idx) => {
      const kx = 0.40 + idx * 4.26;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: kx, y: 5.96, w: 4.00, h: 0.68,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addText(k.label, { x: kx + 0.20, y: 6.04, w: 3.60, h: 0.20, fontSize: 9, bold: true, color: this.h(C.text_muted) });
      slide.addText(k.val, { x: kx + 0.20, y: 6.26, w: 1.80, h: 0.30, fontSize: 18, bold: true, color: this.h(C.text_primary) });
      slide.addText(k.sub, { x: kx + 2.00, y: 6.28, w: 1.80, h: 0.24, fontSize: 9, color: this.h(C.teal_accent) });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 15: FINANCIAL BUDGET WATERFALL
  // ══════════════════════════════════════════════════════════════════════════
  static buildBudgetWaterfall(pptx, data, C) {
    const slide = pptx.addSlide();
    slide.background = { color: this.h(C.canvas_bg) };
    this.addHeader(slide, pptx, data.header || {}, data.branding || {}, C);

    const base = data.baseline || {};
    const drivers = data.drivers || [];
    const target = data.target || {};
    const scorecards = data.scorecards || [];

    const colW = 1.62;
    const colGap = 0.16;
    const chartBottomY = 5.60;
    const chartTopY = 1.60;
    const chartH = chartBottomY - chartTopY;
    const scale = chartH / 12;

    let runningVal = base.val || 42.8;
    const baseY = chartBottomY - (runningVal - 35) * scale;
    const baseH = chartBottomY - baseY;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40, y: baseY, w: colW, h: baseH,
      fill: { color: this.h(C.hdr_bg) }
    });
    slide.addText(base.amount || "", {
      x: 0.40, y: baseY - 0.28, w: colW, h: 0.26,
      fontSize: 14, bold: true, color: this.h(C.text_primary), align: "center"
    });
    slide.addText("FY25 BASELINE\nPrior Year Base", {
      x: 0.40, y: baseY + 0.20, w: colW, h: 0.40,
      fontSize: 9, bold: true, color: this.h(C.canvas_bg), align: "center"
    });

    drivers.forEach((drv, idx) => {
      const x = 0.40 + (idx + 1) * (colW + colGap);
      const isIncrease = drv.val > 0;
      const prevVal = runningVal;
      runningVal += drv.val;

      const topVal = Math.max(prevVal, runningVal);
      const botVal = Math.min(prevVal, runningVal);
      const barY = chartBottomY - (topVal - 35) * scale;
      const barH = Math.max(0.20, (topVal - botVal) * scale);

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: barY, w: colW, h: barH,
        fill: { color: this.h(drv.color || (isIncrease ? C.rose_accent : C.teal_accent)) }
      });
      slide.addText(drv.amount || "", {
        x: x, y: barY - 0.24, w: colW, h: 0.22,
        fontSize: 11, bold: true, color: this.h(isIncrease ? C.rose_accent : C.teal_accent), align: "center"
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: chartBottomY + 0.14, w: colW, h: 0.76,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addText(drv.title || "", {
        x: x + 0.05, y: chartBottomY + 0.20, w: colW - 0.10, h: 0.28,
        fontSize: 8, bold: true, color: this.h(C.text_primary), align: "center"
      });
      slide.addText(drv.desc || "", {
        x: x + 0.05, y: chartBottomY + 0.44, w: colW - 0.10, h: 0.40,
        fontSize: 7, color: this.h(C.text_secondary), align: "center"
      });
    });

    const targetX = 0.40 + 6 * (colW + colGap);
    const targetY = chartBottomY - (target.val - 35) * scale;
    const targetH = chartBottomY - targetY;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: targetX, y: targetY, w: colW, h: targetH,
      fill: { color: this.h(C.stripe) }
    });
    slide.addText(target.amount || "", {
      x: targetX, y: targetY - 0.28, w: colW, h: 0.26,
      fontSize: 14, bold: true, color: this.h(C.stripe), align: "center"
    });
    slide.addText("FY26 TARGET\nNet Savings", {
      x: targetX, y: targetY + 0.20, w: colW, h: 0.40,
      fontSize: 9, bold: true, color: "FFFFFF", align: "center"
    });

    scorecards.forEach((sc, idx) => {
      const scX = 0.40 + idx * 4.26;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: scX, y: 6.70, w: 4.00, h: 0.56,
        fill: { color: this.h(C.card_bg) },
        line: { color: this.h(C.card_bd), width: 1.0 }
      });
      slide.addText(sc.label, { x: scX + 0.20, y: 6.74, w: 2.00, h: 0.18, fontSize: 8, bold: true, color: this.h(C.text_muted) });
      slide.addText(sc.val, { x: scX + 0.20, y: 6.92, w: 2.00, h: 0.28, fontSize: 15, bold: true, color: this.h(C.text_primary) });
      slide.addText(sc.sub, { x: scX + 2.10, y: 6.94, w: 1.80, h: 0.22, fontSize: 9, color: this.h(C.teal_accent) });
    });
  }
}
