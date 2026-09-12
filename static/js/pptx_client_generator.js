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
      case "process_flow":
      default:
        filename = "Philips_ICA_Executive_Blueprint.pptx";
        this.buildProcessFlow(pptx, data, C);
        break;
    }

    return pptx.writeFile({ fileName: filename });
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
  static buildProcessFlow(pptx, data, C) {
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
        margin: 0
      });

      slide.addText(
        [
          { text: r.title + "\n", options: { bold: true, fontSize: 8.5, color: this.h(C.text_primary) } },
          { text: r.sub, options: { fontSize: 7, color: this.h(C.text_muted) } }
        ],
        { x: x + 0.52, y: 0.75, w: w - 0.58, h: 0.28, fontFace: "Calibri", margin: 0 }
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
      margin: 0
    });

    // 4. Ingestion Pipeline Column 1
    const sx = 0.68, sw = 2.00;
    this.addBpCard(slide, sx, 1.52, sw, 0.70, ing[0]?.title || "Accounting Specialist", ing[0]?.sub || "Philips Accounting Lead", ing[0]?.emote || "spec", this.h(C.card_bg), this.h(C.card_bd));
    this.addArrowDown(slide, sx + sw/2, 2.22, 2.58, this.h(C.blue_accent));

    this.addBpCard(slide, sx, 2.58, sw, 1.26, ing[1]?.title || "Extract Open-Item Report", ing[1]?.sub || "Qlik Sense extract | Exclude reciprocal matched items.", ing[1]?.emote || "qlik", this.h(C.blue_bg), this.h(C.blue_border), this.h(C.blue_accent));
    this.addArrowDown(slide, sx + sw/2, 3.84, 4.22, this.h(C.blue_accent));

    this.addBpCard(slide, sx, 4.22, sw, 0.64, ing[2]?.title || "Filter by Company Code", ing[2]?.sub || "Scope validation by entity code", ing[2]?.emote || "filter", this.h(C.card_bg), this.h(C.blue_border));
    this.addArrowDown(slide, sx + sw/2, 4.86, 5.24, this.h(C.blue_accent));

    this.addBpCard(slide, sx, 5.24, sw, 1.82, ing[3]?.title || "List of open items with classification", ing[3]?.sub || "Consolidated open delta ready for triage taxonomy.\nMaps unreconciled line items into operational resolution tracks.", ing[3]?.emote || "list", this.h(C.card_bg), this.h(C.card_bd), this.h(C.blue_accent));

    // 5. Decision Fork Connectors
    const fxm = 2.88, fx2 = 3.08;
    this.addLine(slide, sx + sw, 5.40, fxm, 5.40, this.h(C.purple_accent));
    this.addLine(slide, fxm, 2.75, fxm, 6.54, this.h(C.purple_accent));
    this.addArrowRight(slide, fxm, 2.75, fx2, this.h(C.purple_accent));
    this.addArrowRight(slide, fxm, 5.00, fx2, this.h(C.purple_accent));
    this.addArrowRight(slide, fxm, 6.54, fx2, this.h(C.purple_accent));

    // 6. Track 1: Posting Not Found
    const tw1 = 1.78;
    this.addBpCard(slide, fx2, 2.20, tw1, 1.10, df.root?.title || "Posting not found", df.root?.sub || "Kernel out of scope line", df.root?.emote || "pnf", this.h(C.card_bg), this.h(C.card_bd), this.h(C.blue_accent));

    const sfxm = 5.02, sfx2 = 5.18;
    this.addLine(slide, fx2 + tw1, 2.75, sfxm, 2.75, this.h(C.purple_accent));
    this.addLine(slide, sfxm, 2.03, sfxm, 3.47, this.h(C.purple_accent));
    this.addArrowRight(slide, sfxm, 2.03, sfx2, this.h(C.purple_accent));
    this.addArrowRight(slide, sfxm, 3.47, sfx2, this.h(C.purple_accent));

    // 1A: IDoc
    const iaw = 1.48, hx = 6.92, hw = 1.90;
    this.addBpCard(slide, sfx2, 1.52, iaw, 1.02, df.sub_branch_1a?.cause?.title || "IDoc / OCR Issue", df.sub_branch_1a?.cause?.sub || "Interface syntax failure", df.sub_branch_1a?.cause?.emote || "idoc", this.h(C.card_bg), this.h(C.teal_border));
    this.addArrowRight(slide, sfx2 + iaw, 2.03, hx, this.h(C.teal_accent));
    this.addBpCard(slide, hx, 1.52, hw, 1.02, df.sub_branch_1a?.action?.title || "Troubleshoot IDoc Using HWI", df.sub_branch_1a?.action?.sub || "Execute SAP Hand Work Instructions", df.sub_branch_1a?.action?.emote || "hwi", this.h(C.card_bg), this.h(C.teal_border), null, this.h(C.teal_accent));

    // 1B: No EDI
    this.addBpCard(slide, sfx2, 2.96, iaw, 1.02, df.sub_branch_1b?.cause?.title || "No EDI / Non-SAP", df.sub_branch_1b?.cause?.sub || "Paper drop / legacy format", df.sub_branch_1b?.cause?.emote || "no_edi", this.h(C.card_bg), this.h(C.blue_border));
    this.addArrowRight(slide, sfx2 + iaw, 3.47, hx, this.h(C.blue_accent));
    this.addBpCard(slide, hx, 2.96, hw, 1.02, df.sub_branch_1b?.action?.title || "Request / Retrieve Invoice Copy", df.sub_branch_1b?.action?.sub || "Auto-fetch PDF via OCR matching", df.sub_branch_1b?.action?.emote || "inv", this.h(C.card_bg), this.h(C.blue_border), null, this.h(C.blue_accent));

    // Track 2: AP-AR
    const t2w = 1.94, a2x = 5.38, a2w = 2.48;
    this.addBpCard(slide, fx2, 4.46, t2w, 1.08, df.track_2?.cause?.title || "Investigate AP-AR sign issue", df.track_2?.cause?.sub || "AR cleared, AP remains open (+/−)", df.track_2?.cause?.emote || "ap_ar", this.h(C.card_bg), this.h(C.amber_border), this.h(C.amber_accent));
    this.addArrowRight(slide, fx2 + t2w, 5.00, a2x, this.h(C.amber_accent));
    this.addBpCard(slide, a2x, 4.46, a2w, 1.08, df.track_2?.action?.title || "Review & Analyze Issue", df.track_2?.action?.sub || "Investigate discrepancy; post clearing journal", df.track_2?.action?.emote || "review", this.h(C.card_bg), this.h(C.amber_border), null, this.h(C.amber_accent));

    // Track 3: Cash to allocated
    this.addBpCard(slide, fx2, 6.00, t2w, 1.08, df.track_3?.cause?.title || "Cash to allocated / AP paid", df.track_3?.cause?.sub || "AR unapplied in reciprocal ERP", df.track_3?.cause?.emote || "cash", this.h(C.card_bg), this.h(C.rose_border), this.h(C.rose_accent));
    this.addArrowRight(slide, fx2 + t2w, 6.54, a2x, this.h(C.rose_accent));
    this.addBpCard(slide, a2x, 6.00, a2w, 1.08, df.track_3?.action?.title || "Waiting for Counterparty Action (Clearing)", df.track_3?.action?.sub || "Pending reciprocal entity ledger clearing", df.track_3?.action?.emote || "waiting", this.h(C.card_bg), this.h(C.rose_border), null, this.h(C.rose_accent));

    // Convergence to Governance
    const cvx2 = 9.02, gx = 9.28;
    this.addLine(slide, hx + hw, 2.03, cvx2, 2.03, this.h(C.purple_accent));
    this.addLine(slide, hx + hw, 3.47, cvx2, 3.47, this.h(C.purple_accent));
    this.addLine(slide, a2x + a2w, 5.00, cvx2, 5.00, this.h(C.purple_accent));
    this.addLine(slide, a2x + a2w, 6.54, cvx2, 6.54, this.h(C.purple_accent));
    this.addLine(slide, cvx2, 2.03, cvx2, 6.54, this.h(C.purple_accent));
    this.addArrowRight(slide, cvx2, 2.12, gx, this.h(C.purple_accent));

    // Column 3: Governance
    const gw = 3.45;
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
      margin: 0
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
      margin: 0
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
      margin: 0
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
        margin: 0
      });
    }

    const titleY = (badgeText && badgeColor) ? y + 0.38 : y + 0.12;
    const titleColor = stripColor || (bg === "FFFFFF" ? "1A1A2E" : "1A1A2E");

    slide.addText(title, {
      x: x + 0.12,
      y: titleY,
      w: w - 0.60,
      h: 0.32,
      fontSize: 9.5,
      bold: true,
      color: titleColor,
      fontFace: "Calibri",
      margin: 0
    });

    if (sub) {
      slide.addText(sub, {
        x: x + 0.12,
        y: titleY + 0.28,
        w: w - 0.60,
        h: h - (titleY - y) - 0.32,
        fontSize: 7.5,
        color: "6B6B7B",
        fontFace: "Calibri",
        margin: 0
      });
    }

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
        margin: 0
      });
    }

    if (emote) {
      try {
        slide.addImage({
          path: `emotes/${emote}.gif`,
          x: x + w - 0.50,
          y: y + h/2 - 0.22,
          w: 0.44,
          h: 0.44
        });
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
}
