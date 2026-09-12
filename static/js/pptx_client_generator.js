/**
 * Client-side Presentation Generator using PptxGenJS
 * Compiles the exact Philips ICA Reconciliation Blueprint with 2.0 pt connectors into .pptx
 * Supports all 5 executive presentation templates.
 */

class ClientPptxGenerator {
  static async generate(data) {
    if (typeof PptxGenJS === "undefined") {
      throw new Error("PptxGenJS library is not loaded");
    }

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9"; // 13.333 x 7.50 inches

    const templateId = data.template_id || "process_flow";
    let filename = "Presentation.pptx";

    switch (templateId) {
      case "strategic_roadmap":
        filename = "Strategic_Transformation_Roadmap.pptx";
        this.buildStrategicRoadmap(pptx, data);
        break;
      case "operating_model":
        filename = "Target_Operating_Model_TOM.pptx";
        this.buildOperatingModel(pptx, data);
        break;
      case "data_pipeline":
        filename = "Enterprise_AI_Data_Pipeline.pptx";
        this.buildDataPipeline(pptx, data);
        break;
      case "kpi_scorecard":
        filename = "Executive_KPI_Scorecard.pptx";
        this.buildKpiScorecard(pptx, data);
        break;
      case "process_flow":
      default:
        filename = "ICA_Executive_Blueprint.pptx";
        this.buildProcessFlow(pptx, data);
        break;
    }

    return pptx.writeFile({ fileName: filename });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 1: PHILIPS ICA RECONCILIATION AS-IS BLUEPRINT
  // ══════════════════════════════════════════════════════════════════════════
  static buildProcessFlow(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: "F4F6F9" };

    const b = data.branding || {};
    const h = data.header || {};
    const ing = data.ingestion_track || [];
    const df = data.decision_fork || {};
    const gov = data.governance_column || {};

    // 1. Header Bar (Navy #13233D)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.62,
      fill: { color: "13233D" },
      line: { color: "13233D", width: 0 }
    });

    // Emerald Stripe (#00A884)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0.62,
      w: 13.333,
      h: 0.025,
      fill: { color: "00A884" },
      line: { color: "00A884", width: 0 }
    });

    // Header Title & Subtitle
    slide.addText(
      [
        { text: (h.title || "ICA Reconciliation  |  AS-IS WORKFLOW BLUEPRINT") + "\n", options: { bold: true, fontSize: 16, color: "FFFFFF" } },
        { text: (h.subtitle || "PHILIPS  •  INTERCOMPANY ACCOUNTING PROCESS FLOW & GOVERNANCE"), options: { fontSize: 8.5, color: "9AB0C6" } }
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

    // Corporate Logo Badge (White rounded box on top right)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 11.35,
      y: 0.10,
      w: 1.60,
      h: 0.42,
      rectRadius: 0.06,
      fill: { color: "FFFFFF" },
      line: { color: "FFFFFF", width: 0 }
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

    // 2. Top 4-Stage Ribbon (Y: 0.71, H: 0.36)
    const ribbon = data.ribbon || [];
    const rx = [0.40, 3.40, 7.10, 10.10];
    const rw = [2.70, 3.40, 2.70, 2.83];
    ribbon.forEach((r, idx) => {
      const x = rx[idx];
      const w = rw[idx];

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x,
        y: 0.71,
        w: w,
        h: 0.36,
        rectRadius: 0.06,
        fill: { color: "FFFFFF" },
        line: { color: "D8E2EC", width: 0.75 }
      });

      // Number badge
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.08,
        y: 0.75,
        w: 0.38,
        h: 0.28,
        rectRadius: 0.04,
        fill: { color: (r.badge_color || "#0B5CAD").replace("#", "") },
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
          { text: r.title + "\n", options: { bold: true, fontSize: 8.5, color: "101D30" } },
          { text: r.sub, options: { fontSize: 6.8, color: "5E7794" } }
        ],
        {
          x: x + 0.52,
          y: 0.72,
          w: w - 0.56,
          h: 0.34,
          fontFace: "Calibri",
          margin: 0
        }
      );

      // Ribbon arrow to next
      if (idx < 3) {
        slide.addShape(pptx.ShapeType.rightArrow, {
          x: x + w + 0.06,
          y: 0.82,
          w: 0.18,
          h: 0.14,
          fill: { color: "5E7794" },
          line: { width: 0 }
        });
      }
    });

    // 3. Main Outer Dashed Container (Y: 1.18 to 7.32)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.40,
      y: 1.18,
      w: 12.53,
      h: 6.14,
      rectRadius: 0.12,
      fill: { color: "FFFFFF" },
      line: { color: "BFE3E6", width: 1.8, dashType: "dash" }
    });

    // Floating Orange Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.52,
      y: 1.08,
      w: 2.00,
      h: 0.24,
      rectRadius: 0.06,
      fill: { color: "F59E0B" },
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

    // 4. Column 1: Ingestion Pipeline (X: 0.68, W: 2.00)
    const sx = 0.68, sw = 2.00;

    // Node 1: Accounting Specialist (Y: 1.52, H: 0.70)
    this.addBpCard(slide, sx, 1.52, sw, 0.70, ing[0]?.title || "Accounting Specialist", ing[0]?.sub || "Philips Accounting Lead", ing[0]?.emote || "spec", "FFFFFF", "D8E2EC");
    this.addArrowDown(slide, sx + sw/2, 2.22, 2.58, "0B5CAD");

    // Node 2: Extract Open-Item Report (Y: 2.58, H: 1.26)
    this.addBpCard(slide, sx, 2.58, sw, 1.26, ing[1]?.title || "Extract Open-Item Report", ing[1]?.sub || "Qlik Sense extract | Exclude reciprocal matched items.", ing[1]?.emote || "qlik", "EEF5FC", "B8D5F2", "0B5CAD");
    this.addArrowDown(slide, sx + sw/2, 3.84, 4.22, "0B5CAD");

    // Node 3: Filter by Company Code (Y: 4.22, H: 0.64)
    this.addBpCard(slide, sx, 4.22, sw, 0.64, ing[2]?.title || "Filter by Company Code", ing[2]?.sub || "Scope validation by entity code", ing[2]?.emote || "filter", "FFFFFF", "B8D5F2");
    this.addArrowDown(slide, sx + sw/2, 4.86, 5.24, "0B5CAD");

    // Node 4: List of open items (Y: 5.24, H: 1.82)
    this.addBpCard(slide, sx, 5.24, sw, 1.82, ing[3]?.title || "List of open items with classification", ing[3]?.sub || "Consolidated open delta ready for triage taxonomy.\nMaps unreconciled line items into operational resolution tracks.", ing[3]?.emote || "list", "FFFFFF", "D8E2EC", "0B5CAD");

    // 5. Decision Fork Connectors (Purple #6366F1, 2.0 pt)
    const fxm = 2.88, fx2 = 3.08;
    this.addLine(slide, sx + sw, 5.40, fxm, 5.40, "6366F1"); // stem departs Card 4 right edge
    this.addLine(slide, fxm, 2.75, fxm, 6.54, "6366F1");     // vertical spine
    this.addArrowRight(slide, fxm, 2.75, fx2, "6366F1");      // branch 1
    this.addArrowRight(slide, fxm, 5.00, fx2, "6366F1");      // branch 2
    this.addArrowRight(slide, fxm, 6.54, fx2, "6366F1");      // branch 3

    // 6. Track 1: Posting not found (X: 3.08, Y: 2.20, W: 1.78, H: 1.10)
    const tw1 = 1.78;
    this.addBpCard(slide, fx2, 2.20, tw1, 1.10, df.root?.title || "Posting not found", df.root?.sub || "Kernel out of scope line", df.root?.emote || "pnf", "FFFFFF", "D8E2EC", "0B5CAD");

    // Sub-fork to 1A and 1B
    const sfxm = 5.02, sfx2 = 5.18;
    this.addLine(slide, fx2 + tw1, 2.75, sfxm, 2.75, "6366F1");
    this.addLine(slide, sfxm, 2.03, sfxm, 3.47, "6366F1");
    this.addArrowRight(slide, sfxm, 2.03, sfx2, "6366F1");
    this.addArrowRight(slide, sfxm, 3.47, sfx2, "6366F1");

    // 1A: IDoc/OCR -> Troubleshoot HWI (Y: 1.52, H: 1.02)
    const iaw = 1.48, hx = 6.92, hw = 1.90;
    this.addBpCard(slide, sfx2, 1.52, iaw, 1.02, df.sub_branch_1a?.cause?.title || "IDoc / OCR Issue", df.sub_branch_1a?.cause?.sub || "Interface syntax failure", df.sub_branch_1a?.cause?.emote || "idoc", "FFFFFF", "A3E0E3");
    this.addArrowRight(slide, sfx2 + iaw, 2.03, hx, "008C95");
    this.addBpCard(slide, hx, 1.52, hw, 1.02, df.sub_branch_1a?.action?.title || "Troubleshoot IDoc Using HWI", df.sub_branch_1a?.action?.sub || "Execute SAP Hand Work Instructions", df.sub_branch_1a?.action?.emote || "hwi", "FFFFFF", "A3E0E3", null, "008C95");

    // 1B: No EDI -> Request Invoice (Y: 2.96, H: 1.02)
    this.addBpCard(slide, sfx2, 2.96, iaw, 1.02, df.sub_branch_1b?.cause?.title || "No EDI / Non-SAP", df.sub_branch_1b?.cause?.sub || "Paper drop / legacy format", df.sub_branch_1b?.cause?.emote || "no_edi", "FFFFFF", "B8D5F2");
    this.addArrowRight(slide, sfx2 + iaw, 3.47, hx, "0B5CAD");
    this.addBpCard(slide, hx, 2.96, hw, 1.02, df.sub_branch_1b?.action?.title || "Request / Retrieve Invoice Copy", df.sub_branch_1b?.action?.sub || "Auto-fetch PDF via OCR matching", df.sub_branch_1b?.action?.emote || "inv", "FFFFFF", "B8D5F2", null, "0B5CAD");

    // 7. Track 2: Investigate AP-AR -> Review (Y: 4.46, H: 1.08)
    const t2w = 1.94, a2x = 5.38, a2w = 2.48;
    this.addBpCard(slide, fx2, 4.46, t2w, 1.08, df.track_2?.cause?.title || "Investigate AP-AR sign issue", df.track_2?.cause?.sub || "AR cleared, AP remains open (+/−)", df.track_2?.cause?.emote || "ap_ar", "FFFFFF", "FCDF88", "D97706");
    this.addArrowRight(slide, fx2 + t2w, 5.00, a2x, "D97706");
    this.addBpCard(slide, a2x, 4.46, a2w, 1.08, df.track_2?.action?.title || "Review & Analyze Issue", df.track_2?.action?.sub || "Investigate discrepancy; post clearing journal", df.track_2?.action?.emote || "review", "FFFFFF", "FCDF88", null, "D97706");

    // 8. Track 3: Cash to allocated -> Waiting (Y: 6.00, H: 1.08)
    this.addBpCard(slide, fx2, 6.00, t2w, 1.08, df.track_3?.cause?.title || "Cash to allocated / AP paid", df.track_3?.cause?.sub || "AR unapplied in reciprocal ERP", df.track_3?.cause?.emote || "cash", "FFFFFF", "F7B6D7", "D9468D");
    this.addArrowRight(slide, fx2 + t2w, 6.54, a2x, "D9468D");
    this.addBpCard(slide, a2x, 6.00, a2w, 1.08, df.track_3?.action?.title || "Waiting for Counterparty Action (Clearing)", df.track_3?.action?.sub || "Pending reciprocal entity ledger clearing", df.track_3?.action?.emote || "waiting", "FFFFFF", "F7B6D7", null, "D9468D");

    // 9. Convergence Bus to Governance (Purple #6366F1)
    const cvx2 = 9.02, gx = 9.28;
    this.addLine(slide, hx + hw, 2.03, cvx2, 2.03, "6366F1");
    this.addLine(slide, hx + hw, 3.47, cvx2, 3.47, "6366F1");
    this.addLine(slide, a2x + a2w, 5.00, cvx2, 5.00, "6366F1");
    this.addLine(slide, a2x + a2w, 6.54, cvx2, 6.54, "6366F1");
    this.addLine(slide, cvx2, 2.03, cvx2, 6.54, "6366F1"); // convergence spine
    this.addArrowRight(slide, cvx2, 2.12, gx, "6366F1");   // entry arrow

    // 10. Column 3: Governance & Escalation (X: 9.28, W: 3.45)
    const gw = 3.45;

    // Card 1: Reconciliation Discrepancy (Y: 1.52, H: 1.20)
    this.addBpCard(slide, gx, 1.52, gw, 1.20, gov.gap_card?.title || "Reconciliation Discrepancy", gov.gap_card?.sub || "Open-item delta isolated between reciprocal Philips entities.", gov.gap_card?.emote || "gap", "FDF2F7", "F7B6D7", null, null, "GAP DETECTED", "D9468D");
    this.addArrowDown(slide, gx + gw/2, 2.72, 3.16, "D9468D");

    // Card 2: Action Notification (Y: 3.16, H: 1.20)
    this.addBpCard(slide, gx, 3.16, gw, 1.20, gov.notif_card?.title || "Send Action Notification (Email)", gov.notif_card?.sub || "Structured notice sent to counterparty accounting lead.", gov.notif_card?.emote || "notif", "FFFFFF", "F7B6D7", null, null, "ACTION NOTIFICATION", "D9468D");
    this.addArrowDown(slide, gx + gw/2, 4.36, 4.80, "DC2626");

    // Card 3: Multi-Tier Escalation Matrix (Y: 4.80, H: 2.28)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: gx,
      y: 4.80,
      w: gw,
      h: 2.28,
      rectRadius: 0.08,
      fill: { color: "FEF2F2" },
      line: { color: "FEC8C8", width: 1 }
    });

    // Badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: gx + 0.14,
      y: 4.94,
      w: 1.44,
      h: 0.22,
      rectRadius: 0.04,
      fill: { color: "DC2626" },
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
      color: "DC2626",
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
      tierParas.push({ text: `${t.code} (${t.hrs}): `, options: { bold: true, fontSize: 8, color: "DC2626" } });
      tierParas.push({ text: `${t.owner}\n`, options: { bold: true, fontSize: 8, color: "101D30" } });
      tierParas.push({ text: `    ${t.detail}\n\n`, options: { fontSize: 7, color: "5E7794" } });
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
        y: 4.80 + 0.20,
        w: 0.48,
        h: 0.48
      });
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 2: STRATEGIC ROADMAP
  // ══════════════════════════════════════════════════════════════════════════
  static buildStrategicRoadmap(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: "070B19" };

    const b = data.branding || {};
    const h = data.header || {};
    const horizons = data.horizons || [];
    const workstreams = data.workstreams || [];
    const metrics = data.metrics || [];

    // Header
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.62, fill: { color: "0D152D" }, line: { width: 0 } });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.62, w: 13.333, h: 0.025, fill: { color: "38BDF8" }, line: { width: 0 } });
    slide.addText(
      [
        { text: (h.title || "STRATEGIC TRANSFORMATION ROADMAP") + "\n", options: { bold: true, fontSize: 16, color: "FFFFFF" } },
        { text: (h.subtitle || "3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION"), options: { fontSize: 8.5, color: "94A3B8" } }
      ],
      { x: 0.40, y: 0.06, w: 9.50, h: 0.52, fontFace: "Calibri", margin: 0 }
    );

    // Horizon Headers
    horizons.forEach((hz, i) => {
      const x = 3.20 + i * 3.24;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.78, w: 3.10, h: 0.46, fill: { color: "0F1A38" }, line: { color: hz.color.replace("#",""), width: 1.5 } });
      slide.addText(
        [
          { text: hz.title + "\n", options: { bold: true, fontSize: 9.5, color: hz.color.replace("#","") } },
          { text: hz.sub, options: { fontSize: 7, color: "94A3B8" } }
        ],
        { x: x + 0.14, y: 0.82, w: 2.80, h: 0.38, fontFace: "Calibri", margin: 0 }
      );
    });

    // Workstream rows
    workstreams.forEach((ws, i) => {
      const y = 1.38 + i * 1.18;
      // Name card
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: y, w: 2.60, h: 1.06, fill: { color: "0F1A38" }, line: { color: "38BDF8", width: 0.75 } });
      slide.addText(ws.name, { x: 0.54, y: y + 0.36, w: 2.20, h: 0.34, bold: true, fontSize: 11, color: "FFFFFF", fontFace: "Calibri", margin: 0 });
      
      // H1, H2, H3
      [ws.h1, ws.h2, ws.h3].forEach((htxt, hidx) => {
        const x = 3.20 + hidx * 3.24;
        slide.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: 3.10, h: 1.06, fill: { color: "0F1A38" }, line: { color: "253144", width: 0.75 } });
        slide.addText(htxt, { x: x + 0.14, y: y + 0.20, w: 2.80, h: 0.66, fontSize: 8.5, color: "E2E8F0", fontFace: "Calibri", margin: 0 });
      });
    });

    // Metrics bottom
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: 6.26, w: 12.53, h: 0.90, fill: { color: "0F1A38" }, line: { color: "38BDF8", width: 1 } });
    metrics.forEach((m, i) => {
      const x = 1.20 + i * 4.00;
      slide.addText(
        [
          { text: m.label + "\n", options: { bold: true, fontSize: 9, color: "94A3B8" } },
          { text: m.value + "  ", options: { bold: true, fontSize: 24, color: "38BDF8" } },
          { text: m.sub, options: { fontSize: 8.5, color: "E2E8F0" } }
        ],
        { x: x, y: 6.36, w: 3.50, h: 0.70, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 3: TARGET OPERATING MODEL (TOM)
  // ══════════════════════════════════════════════════════════════════════════
  static buildOperatingModel(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: "F5F6FA" };

    const h = data.header || {};
    const tiers = data.tiers || [];
    const raci = data.raci || [];

    // Header
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.62, fill: { color: "181938" }, line: { width: 0 } });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.62, w: 13.333, h: 0.025, fill: { color: "6366F1" }, line: { width: 0 } });
    slide.addText(
      [
        { text: (h.title || "TARGET OPERATING MODEL (TOM) ARCHITECTURE") + "\n", options: { bold: true, fontSize: 16, color: "FFFFFF" } },
        { text: (h.subtitle || "3-TIER SERVICE DELIVERY & RACI ACCOUNTABILITY"), options: { fontSize: 8.5, color: "94A3B8" } }
      ],
      { x: 0.40, y: 0.06, w: 9.50, h: 0.52, fontFace: "Calibri", margin: 0 }
    );

    // 3 Tiers Left
    tiers.forEach((t, i) => {
      const y = 0.84 + i * 2.00;
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: y, w: 7.50, h: 1.86, fill: { color: "FFFFFF" }, line: { color: "DCE0EB", width: 1.2 } });
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.56, y: y + 0.16, w: 2.20, h: 0.26, fill: { color: "6366F1" }, line: { width: 0 } });
      slide.addText(t.level, { x: 0.56, y: y + 0.16, w: 2.20, h: 0.26, bold: true, fontSize: 8, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });
      slide.addText(t.title, { x: 0.56, y: y + 0.50, w: 5.50, h: 0.35, bold: true, fontSize: 13, color: "14162B", fontFace: "Calibri", margin: 0 });
      slide.addText("Leadership: " + t.owner, { x: 0.56, y: y + 0.85, w: 5.50, h: 0.25, bold: true, fontSize: 9, color: "3B82F6", fontFace: "Calibri", margin: 0 });
      slide.addText(t.mandate, { x: 0.56, y: y + 1.15, w: 5.50, h: 0.55, fontSize: 8.5, color: "2E3354", fontFace: "Calibri", margin: 0 });
    });

    // RACI Matrix Right
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.20, y: 0.84, w: 4.73, h: 5.86, fill: { color: "FFFFFF" }, line: { color: "DCE0EB", width: 1.2 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.40, y: 1.04, w: 2.20, h: 0.28, fill: { color: "3B82F6" }, line: { width: 0 } });
    slide.addText("GOVERNANCE RACI MATRIX", { x: 8.40, y: 1.04, w: 2.20, h: 0.28, bold: true, fontSize: 8.5, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });

    raci.forEach((r, idx) => {
      const ry = 1.60 + idx * 0.70;
      slide.addText(
        [
          { text: r.activity + "\n", options: { bold: true, fontSize: 9.5, color: "14162B" } },
          { text: `Tier 1: ${r.s}   •   Tier 2: ${r.c}   •   Tier 3: ${r.h}`, options: { bold: true, fontSize: 8.5, color: "6366F1" } }
        ],
        { x: 8.40, y: ry, w: 4.33, h: 0.55, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 4: DATA PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  static buildDataPipeline(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: "070B19" };

    const h = data.header || {};
    const stages = data.stages || [];
    const guardrails = data.guardrails || [];

    // Header
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.62, fill: { color: "0D152D" }, line: { width: 0 } });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.62, w: 13.333, h: 0.025, fill: { color: "38BDF8" }, line: { width: 0 } });
    slide.addText(
      [
        { text: (h.title || "ENTERPRISE DATA & AGENTIC AI PIPELINE") + "\n", options: { bold: true, fontSize: 16, color: "FFFFFF" } },
        { text: (h.subtitle || "HIGH-THROUGHPUT RECONCILIATION ARCHITECTURE"), options: { fontSize: 8.5, color: "94A3B8" } }
      ],
      { x: 0.40, y: 0.06, w: 9.50, h: 0.52, fontFace: "Calibri", margin: 0 }
    );

    stages.forEach((st, i) => {
      const x = 0.40 + i * 3.16;
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.90, w: 2.92, h: 4.20, fill: { color: "0F1A38" }, line: { color: "38BDF8", width: 1.2 } });
      slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.20, y: 1.12, w: 0.48, h: 0.32, fill: { color: "38BDF8" }, line: { width: 0 } });
      slide.addText(st.num, { x: x + 0.20, y: 1.12, w: 0.48, h: 0.32, bold: true, fontSize: 9, color: "FFFFFF", align: "center", fontFace: "Calibri", margin: 0 });
      slide.addText(st.name, { x: x + 0.20, y: 1.70, w: 2.52, h: 0.35, bold: true, fontSize: 12, color: "FFFFFF", fontFace: "Calibri", margin: 0 });
      slide.addText(st.tech, { x: x + 0.20, y: 2.10, w: 2.52, h: 0.50, fontSize: 9, color: "94A3B8", fontFace: "Calibri", margin: 0 });
      slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.20, y: 4.30, w: 2.52, h: 0.42, fill: { color: "13233D" }, line: { width: 0 } });
      slide.addText(st.sla, { x: x + 0.20, y: 4.30, w: 2.52, h: 0.42, bold: true, fontSize: 9, color: "38BDF8", align: "center", fontFace: "Calibri", margin: 0 });
    });

    slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: 5.34, w: 12.53, h: 1.76, fill: { color: "0F1A38" }, line: { color: "38BDF8", width: 1.2 } });
    slide.addText("ENTERPRISE GOVERNANCE & COMPLIANCE GUARDRAILS", { x: 0.64, y: 5.50, w: 10.00, h: 0.30, bold: true, fontSize: 10, color: "38BDF8", fontFace: "Calibri", margin: 0 });
    guardrails.forEach((g, i) => {
      const gx = 0.64 + i * 4.00;
      slide.addText(
        [
          { text: g.title + "\n", options: { bold: true, fontSize: 9.5, color: "FFFFFF" } },
          { text: g.detail, options: { fontSize: 8, color: "94A3B8" } }
        ],
        { x: gx, y: 5.90, w: 3.60, h: 0.80, fontFace: "Calibri", margin: 0 }
      );
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 5: KPI SCORECARD
  // ══════════════════════════════════════════════════════════════════════════
  static buildKpiScorecard(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: "F3F7F5" };

    const h = data.header || {};
    const kpis = data.kpis || [];
    const pillars = data.pillars || [];

    // Header
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.62, fill: { color: "062A1E" }, line: { width: 0 } });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.62, w: 13.333, h: 0.025, fill: { color: "10B981" }, line: { width: 0 } });
    slide.addText(
      [
        { text: (h.title || "EXECUTIVE PERFORMANCE & KPI SCORECARD") + "\n", options: { bold: true, fontSize: 16, color: "FFFFFF" } },
        { text: (h.subtitle || "BOARD OF DIRECTORS REVIEW"), options: { fontSize: 8.5, color: "94A3B8" } }
      ],
      { x: 0.40, y: 0.06, w: 9.50, h: 0.52, fontFace: "Calibri", margin: 0 }
    );

    kpis.forEach((k, i) => {
      const x = 0.40 + i * 3.16;
      const ragColor = k.rag === "green" ? "10B981" : (k.rag === "amber" ? "F59E0B" : "EF4444");
      slide.addShape(pptx.ShapeType.roundRect, { x: x, y: 0.86, w: 2.92, h: 1.90, fill: { color: "FFFFFF" }, line: { color: "D1E3DC", width: 1.2 } });
      slide.addShape(pptx.ShapeType.rect, { x: x, y: 0.86, w: 0.06, h: 1.90, fill: { color: ragColor }, line: { width: 0 } });
      slide.addText(k.label, { x: x + 0.20, y: 1.05, w: 2.50, h: 0.25, bold: true, fontSize: 9, color: "5B7C71", fontFace: "Calibri", margin: 0 });
      slide.addText(k.value, { x: x + 0.20, y: 1.35, w: 2.50, h: 0.55, bold: true, fontSize: 26, color: "0D211A", fontFace: "Calibri", margin: 0 });
      slide.addText(k.delta + " • " + k.note, { x: x + 0.20, y: 2.05, w: 2.50, h: 0.45, bold: true, fontSize: 8.5, color: ragColor, fontFace: "Calibri", margin: 0 });
    });

    pillars.forEach((p, i) => {
      const y = 3.00 + i * 1.34;
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.40, y: y, w: 12.53, h: 1.14, fill: { color: "FFFFFF" }, line: { color: "D1E3DC", width: 1.2 } });
      slide.addText(p.name, { x: 0.64, y: y + 0.25, w: 10.00, h: 0.35, bold: true, fontSize: 13, color: "0D211A", fontFace: "Calibri", margin: 0 });
      slide.addText(p.detail, { x: 0.64, y: y + 0.60, w: 10.00, h: 0.35, fontSize: 9.5, color: "5B7C71", fontFace: "Calibri", margin: 0 });
      slide.addShape(pptx.ShapeType.roundRect, { x: 11.00, y: y + 0.36, w: 1.50, h: 0.44, fill: { color: "EBF5F6" }, line: { width: 0 } });
      slide.addText(p.score, { x: 11.00, y: y + 0.36, w: 1.50, h: 0.44, bold: true, fontSize: 15, color: "008C95", align: "center", fontFace: "Calibri", margin: 0 });
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
        y: y + 0.08,
        w: 0.045,
        h: h - 0.16,
        fill: { color: stripColor },
        line: { width: 0 }
      });
    }

    if (badgeText) {
      slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.roundRect : "roundRect", {
        x: x + 0.14,
        y: y + 0.12,
        w: 1.20,
        h: 0.20,
        rectRadius: 0.04,
        fill: { color: badgeColor || "D9468D" },
        line: { width: 0 }
      });
      slide.addText(badgeText, {
        x: x + 0.14,
        y: y + 0.12,
        w: 1.20,
        h: 0.20,
        fontSize: 7,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Calibri",
        margin: 0
      });
    }

    if (chevronColor) {
      slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.oval : "oval", {
        x: x + 0.12,
        y: y + h/2 - 0.11,
        w: 0.22,
        h: 0.22,
        fill: { color: chevronColor },
        line: { width: 0 }
      });
      slide.addText("›", {
        x: x + 0.12,
        y: y + h/2 - 0.14,
        w: 0.22,
        h: 0.22,
        fontSize: 12,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Calibri",
        margin: 0
      });
    }

    const txLeft = chevronColor ? x + 0.40 : (stripColor ? x + 0.14 : x + 0.12);
    const txTop = badgeText ? y + 0.38 : y + 0.14;
    slide.addText(
      [
        { text: title + "\n", options: { bold: true, fontSize: 9.5, color: "101D30" } },
        { text: sub, options: { fontSize: 7.2, color: "5E7794" } }
      ],
      {
        x: txLeft,
        y: txTop,
        w: w - (txLeft - x) - 0.55,
        h: h - (txTop - y) - 0.08,
        fontFace: "Calibri",
        margin: 0
      }
    );

    if (emote) {
      try {
        slide.addImage({
          path: `emotes/${emote}.gif`,
          x: x + w - 0.50,
          y: y + (h - 0.44) / 2,
          w: 0.44,
          h: 0.44
        });
      } catch (e) {}
    }
  }

  static addLine(slide, x1, y1, x2, y2, color) {
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.line : "line", {
      x: x1,
      y: y1,
      w: x2 - x1,
      h: y2 - y1,
      line: { color: color, width: 2 }
    });
  }

  static addArrowRight(slide, x1, y, x2, color) {
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.rightArrow : "rightArrow", {
      x: x2 - 0.16,
      y: y - 0.06,
      w: 0.16,
      h: 0.12,
      fill: { color: color },
      line: { width: 0 }
    });
    this.addLine(slide, x1, y, x2 - 0.14, y, color);
  }

  static addArrowDown(slide, x, y1, y2, color) {
    slide.addShape(window.PptxGenJS.ShapeType ? window.PptxGenJS.ShapeType.downArrow : "downArrow", {
      x: x - 0.06,
      y: y2 - 0.16,
      w: 0.12,
      h: 0.16,
      fill: { color: color },
      line: { width: 0 }
    });
    this.addLine(slide, x, y1, x, y2 - 0.14, color);
  }
}
