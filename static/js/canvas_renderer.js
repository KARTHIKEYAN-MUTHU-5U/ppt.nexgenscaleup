/**
 * Executive Slide Studio - Exact Mathematical SVG Canvas Renderer
 * Maps Inches * 100 directly into a 1333 x 750 16:9 Vector ViewBox.
 * Matches ICA_Executive_Blueprint.pptx with exact DrawingML 2.0 pt fidelity.
 */

class SlideCanvasRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isAnimating = false;
    this.selectedNodeId = null;
    this.onNodeClickCallback = null;
  }

  setNodeClickListener(cb) {
    this.onNodeClickCallback = cb;
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    if (!this.container) return;
    this.container.querySelectorAll(".interactive-card").forEach(el => {
      if (el.getAttribute("data-node-id") === nodeId) {
        el.classList.add("card-selected");
      } else {
        el.classList.remove("card-selected");
      }
    });
  }

  render(data) {
    if (!this.container || !data) return;

    const templateId = data.template_id || "process_flow";
    let svgContent = "";

    switch (templateId) {
      case "strategic_roadmap":
        svgContent = this.renderStrategicRoadmap(data);
        break;
      case "operating_model":
        svgContent = this.renderOperatingModel(data);
        break;
      case "data_pipeline":
        svgContent = this.renderDataPipeline(data);
        break;
      case "kpi_scorecard":
        svgContent = this.renderKpiScorecard(data);
        break;
      case "process_flow":
      default:
        svgContent = this.renderProcessFlow(data);
        break;
    }

    this.container.innerHTML = svgContent;

    // Attach interactive node click handlers
    this.container.querySelectorAll(".interactive-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const nodeId = card.getAttribute("data-node-id");
        if (nodeId && this.onNodeClickCallback) {
          this.selectNode(nodeId);
          this.onNodeClickCallback(nodeId);
        }
      });
    });

    if (this.selectedNodeId) {
      this.selectNode(this.selectedNodeId);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 1: PHILIPS ICA AS-IS WORKFLOW BLUEPRINT (FLAGSHIP)
  // ══════════════════════════════════════════════════════════════════════════
  renderProcessFlow(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const ing = data.ingestion_track || [];
    const df = data.decision_fork || {};
    const gov = data.governance_column || {};
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    const logoSrc = `logos/${b.logo_key || "philips"}.png`;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-card" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.08"/>
          </filter>
          <filter id="shadow-halo" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#000000" flood-opacity="0.1"/>
          </filter>

          <!-- Standardized 2.0 pt Arrowheads (DrawingML triangle geometry) -->
          <marker id="arr-blu" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.blue_accent}" />
          </marker>
          <marker id="arr-pur" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.purple_accent}" />
          </marker>
          <marker id="arr-tea" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.teal_accent}" />
          </marker>
          <marker id="arr-amb" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.amber_accent}" />
          </marker>
          <marker id="arr-ros" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.rose_accent}" />
          </marker>
          <marker id="arr-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.red_accent}" />
          </marker>
          <marker id="arr-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0.5, 5 3, 0 5.5" fill="${C.text_muted}" />
          </marker>
        </defs>

        <!-- Canvas Background -->
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />

        <!-- ═══ 1. HEADER (Y: 0 to 62) ═══ -->
        <g class="anim-grp anim-p1">
          <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
          <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
          
          <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escape(h.title || "ICA Reconciliation  |  AS-IS WORKFLOW BLUEPRINT")}</text>
          <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" font-weight="normal" fill="${paletteKey === 'obsidian_dark' ? '#94A3B8' : '#9AB0C6'}">${this.escape(h.subtitle || "PHILIPS  •  INTERCOMPANY ACCOUNTING PROCESS FLOW & GOVERNANCE")}</text>

          <!-- Corporate Logo Badge (X: 1135, Y: 10, W: 160, H: 42) -->
          <rect x="1135" y="10" width="160" height="42" rx="4" fill="#FFFFFF" filter="url(#shadow-card)" />
          <image href="${logoSrc}" x="1145" y="15" width="140" height="32" preserveAspectRatio="xMidYMid meet" />
        </g>

        <!-- ═══ 2. PIPELINE RIBBON (Y: 71 to 107) ═══ -->
        <g class="anim-grp anim-p1">
          <!-- Ribbon 01 -->
          <rect x="40" y="71" width="270" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="48" y="75" width="38" height="28" rx="3" fill="${C.blue_accent}" />
          <text x="67" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">01</text>
          <text x="94" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">INGESTION & SCOPE</text>
          <text x="94" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">Qlik Sense Extract & Filtering</text>
          <line x1="316" y1="89" x2="334" y2="89" stroke="${C.text_muted}" stroke-width="2.78" marker-end="url(#arr-gray)" />

          <!-- Ribbon 02 -->
          <rect x="340" y="71" width="340" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="348" y="75" width="38" height="28" rx="3" fill="${C.amber_accent}" />
          <text x="367" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">02</text>
          <text x="394" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">CLASSIFY & TRIAGE</text>
          <text x="394" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">3-Track Operational Taxonomy</text>
          <line x1="686" y1="89" x2="704" y2="89" stroke="${C.text_muted}" stroke-width="2.78" marker-end="url(#arr-gray)" />

          <!-- Ribbon 03 -->
          <rect x="710" y="71" width="270" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="718" y="75" width="38" height="28" rx="3" fill="${C.teal_accent}" />
          <text x="737" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">03</text>
          <text x="764" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">RESOLVE BY CAUSE</text>
          <text x="764" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">HWI, OCR, Forensic & Counterparty</text>
          <line x1="986" y1="89" x2="1004" y2="89" stroke="${C.text_muted}" stroke-width="2.78" marker-end="url(#arr-gray)" />

          <!-- Ribbon 04 -->
          <rect x="1010" y="71" width="283" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="1018" y="75" width="38" height="28" rx="3" fill="${C.rose_accent}" />
          <text x="1037" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">04</text>
          <text x="1064" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">CLOSE THE LOOP</text>
          <text x="1064" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">Escalation Matrix & Governance</text>
        </g>

        <!-- ═══ 3. MAIN DASHED CONTAINER (Y: 118 to 732) ═══ -->
        <g class="anim-grp anim-p2">
          <rect x="40" y="118" width="1253" height="614" rx="10" fill="${C.card_bg}" stroke="${C.dashed_border}" stroke-width="1.8" stroke-dasharray="10 6" filter="url(#shadow-card)" />
          <rect x="52" y="108" width="200" height="24" rx="5" fill="#F59E0B" />
          <text x="152" y="124" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(data.container_label || "PHILIPS AS-IS FLOW")}</text>
        </g>

        <!-- ═══ 4. COLUMN 1: INGESTION PIPELINE (X: 68, W: 200) ═══ -->
        <g class="anim-grp anim-p2">
          <!-- Card 1: Accounting Specialist (Y: 152, H: 70) -->
          <g class="interactive-card" data-node-id="ingestion.0">
            <rect x="68" y="152" width="200" height="70" rx="5" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
            <text x="80" y="176" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.3" font-weight="bold" fill="${C.text_primary}">${this.escape(ing[0]?.title || "Accounting Specialist")}</text>
            <text x="80" y="196" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.3" fill="${C.text_muted}">${this.escape(ing[0]?.sub || "Philips Accounting Lead")}</text>
            <circle cx="236" cy="187" r="23" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[0]?.emote || 'spec'}.gif" x="214" y="165" width="44" height="44" />
          </g>

          <!-- Arrow ↓ (222 to 258) -->
          <line x1="168" y1="222" x2="168" y2="258" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- Card 2: Extract Open-Item Report (Y: 258, H: 126) -->
          <g class="interactive-card" data-node-id="ingestion.1">
            <rect x="68" y="258" width="200" height="126" rx="6" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="68" y="266" width="4.5" height="110" fill="${C.blue_accent}" />
            <text x="80" y="286" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">Extract Open-Item Report</text>
            <text x="80" y="310" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">Qlik Sense extract | Exclude</text>
            <text x="80" y="326" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">reciprocal matched items.</text>
            <circle cx="234" cy="321" r="25" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[1]?.emote || 'qlik'}.gif" x="210" y="297" width="48" height="48" />
          </g>

          <!-- Arrow ↓ (384 to 422) -->
          <line x1="168" y1="384" x2="168" y2="422" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- Card 3: Filter by Company Code (Y: 422, H: 64) -->
          <g class="interactive-card" data-node-id="ingestion.2">
            <rect x="68" y="422" width="200" height="64" rx="5" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <text x="80" y="445" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.2" font-weight="bold" fill="${C.blue_accent}">Filter by Company Code</text>
            <text x="80" y="465" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" fill="${C.text_muted}">Scope validation by entity code</text>
            <circle cx="239" cy="454" r="20" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[2]?.emote || 'filter'}.gif" x="220" y="435" width="38" height="38" />
          </g>

          <!-- Arrow ↓ (486 to 524) -->
          <line x1="168" y1="486" x2="168" y2="524" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- Card 4: List of open items with classification (Y: 524, H: 182) -->
          <g class="interactive-card" data-node-id="ingestion.3">
            <rect x="68" y="524" width="200" height="182" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="68" y="532" width="4.5" height="166" fill="${C.blue_accent}" />
            <text x="80" y="552" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">List of open items</text>
            <text x="80" y="570" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">with classification</text>
            <text x="80" y="600" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">Consolidated open delta</text>
            <text x="80" y="618" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">ready for triage taxonomy.</text>
            <text x="80" y="642" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">Maps unreconciled line items</text>
            <text x="80" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">into operational resolution tracks.</text>
            <circle cx="233" cy="615" r="26" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[3]?.emote || 'list'}.gif" x="208" y="590" width="50" height="50" />
          </g>
        </g>

        <!-- ═══ 5. DECISION FORK & CONNECTORS ═══ -->
        <g class="anim-grp anim-p3">
          <!-- Stem from Card 4 (X: 268 to 288, Y: 540) -->
          <line x1="268" y1="540" x2="288" y2="540" stroke="${C.purple_accent}" stroke-width="2.78" />
          <!-- Vertical Spine across all 3 tracks (Y: 275 to 654) -->
          <line x1="288" y1="275" x2="288" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <!-- 3 Branch Arrows into Track roots -->
          <line x1="288" y1="275" x2="308" y2="275" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="288" y1="500" x2="308" y2="500" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="288" y1="654" x2="308" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />

          <!-- Root: Posting not found (X: 308, Y: 220, W: 178, H: 110) -->
          <g class="interactive-card" data-node-id="decision.root">
            <rect x="308" y="220" width="178" height="110" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="308" y="228" width="4.5" height="94" fill="${C.blue_accent}" />
            <text x="322" y="254" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">${this.escape(df.root?.title || "Posting not found")}</text>
            <text x="322" y="278" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">${this.escape(df.root?.sub || "Kernel out of scope line")}</text>
            <circle cx="454" cy="275" r="23" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.root?.emote || 'pnf'}.gif" x="432" y="253" width="44" height="44" />
          </g>
        </g>

        <!-- ═══ 6. SUB-BRANCHES 1A, 1B, TRACK 2, TRACK 3 ═══ -->
        <g class="anim-grp anim-p4">
          <!-- Symmetrical sub-fork lines from Posting Not Found -->
          <line x1="486" y1="275" x2="502" y2="275" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="502" y1="203" x2="502" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="502" y1="203" x2="518" y2="203" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="502" y1="347" x2="518" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />

          <!-- 1A: IDoc / OCR Issue (X: 518, Y: 152, W: 148, H: 102) -->
          <g class="interactive-card" data-node-id="decision.sub_1a_cause">
            <rect x="518" y="152" width="148" height="102" rx="5" fill="${C.card_bg}" stroke="${C.teal_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <text x="528" y="180" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.8" font-weight="bold" fill="${C.text_primary}">IDoc / OCR Issue</text>
            <text x="528" y="210" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">Interface syntax</text>
            <text x="528" y="226" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">failure</text>
            <circle cx="635" cy="203" r="22" fill="${C.teal_border}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1a?.cause?.emote || 'idoc'}.gif" x="614" y="182" width="42" height="42" />
          </g>

          <!-- Arrow 1A → Troubleshoot (666 to 692) -->
          <line x1="666" y1="203" x2="692" y2="203" stroke="${C.teal_accent}" stroke-width="2.78" marker-end="url(#arr-tea)" />

          <!-- 1A Action: Troubleshoot IDoc Using HWI (X: 692, Y: 152, W: 190, H: 102) -->
          <g class="interactive-card" data-node-id="decision.sub_1a_action">
            <rect x="692" y="152" width="190" height="102" rx="5" fill="${C.card_bg}" stroke="${C.teal_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <circle cx="706" cy="203" r="11" fill="${C.teal_accent}" />
            <text x="706" y="208" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">›</text>
            <text x="722" y="180" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">Troubleshoot IDoc</text>
            <text x="722" y="198" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">Using HWI</text>
            <text x="722" y="220" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">Execute SAP Hand Work</text>
            <text x="722" y="236" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">Instructions</text>
            <circle cx="851" cy="203" r="22" fill="${C.teal_border}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1a?.action?.emote || 'hwi'}.gif" x="830" y="182" width="42" height="42" />
          </g>

          <!-- 1B: No EDI / Non-SAP (X: 518, Y: 296, W: 148, H: 102) -->
          <g class="interactive-card" data-node-id="decision.sub_1b_cause">
            <rect x="518" y="296" width="148" height="102" rx="5" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <text x="528" y="324" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.8" font-weight="bold" fill="${C.text_primary}">No EDI / Non-SAP</text>
            <text x="528" y="352" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">Paper drop / legacy</text>
            <text x="528" y="368" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">format</text>
            <circle cx="635" cy="347" r="22" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1b?.cause?.emote || 'no_edi'}.gif" x="614" y="326" width="42" height="42" />
          </g>

          <!-- Arrow 1B → Request Invoice (666 to 692) -->
          <line x1="666" y1="347" x2="692" y2="347" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- 1B Action: Request / Retrieve Invoice Copy (X: 692, Y: 296, W: 190, H: 102) -->
          <g class="interactive-card" data-node-id="decision.sub_1b_action">
            <rect x="692" y="296" width="190" height="102" rx="5" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <circle cx="706" cy="347" r="11" fill="${C.blue_accent}" />
            <text x="706" y="352" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">›</text>
            <text x="722" y="324" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">Request / Retrieve</text>
            <text x="722" y="342" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">Invoice Copy</text>
            <text x="722" y="364" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">Auto-fetch PDF via OCR</text>
            <text x="722" y="380" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.0" fill="${C.text_muted}">matching</text>
            <circle cx="851" cy="347" r="22" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1b?.action?.emote || 'inv'}.gif" x="830" y="326" width="42" height="42" />
          </g>

          <!-- Track 2: Investigate AP-AR sign issue (X: 308, Y: 446, W: 194, H: 108) -->
          <g class="interactive-card" data-node-id="decision.track_2_cause">
            <rect x="308" y="446" width="194" height="108" rx="6" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="308" y="454" width="4.5" height="92" fill="${C.amber_accent}" />
            <text x="322" y="474" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">Investigate AP-AR</text>
            <text x="322" y="492" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">sign issue</text>
            <text x="322" y="520" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">AR cleared, AP remains open</text>
            <text x="322" y="536" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">(+/−)</text>
            <circle cx="470" cy="500" r="23" fill="${C.amber_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_2?.cause?.emote || 'ap_ar'}.gif" x="448" y="478" width="44" height="44" />
          </g>

          <!-- Arrow Track 2 → Review (502 to 538) -->
          <line x1="502" y1="500" x2="538" y2="500" stroke="${C.amber_accent}" stroke-width="2.78" marker-end="url(#arr-amb)" />

          <!-- Track 2 Action: Review & Analyze Issue (X: 538, Y: 446, W: 248, H: 108) -->
          <g class="interactive-card" data-node-id="decision.track_2_action">
            <rect x="538" y="446" width="248" height="108" rx="5" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <circle cx="552" cy="500" r="11" fill="${C.amber_accent}" />
            <text x="552" y="505" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">›</text>
            <text x="568" y="474" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.3" font-weight="bold" fill="${C.text_primary}">Review & Analyze Issue</text>
            <text x="568" y="500" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.3" fill="${C.text_muted}">Investigate discrepancy; post clearing</text>
            <text x="568" y="516" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.3" fill="${C.text_muted}">journal</text>
            <circle cx="754" cy="500" r="23" fill="${C.amber_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_2?.action?.emote || 'review'}.gif" x="732" y="478" width="44" height="44" />
          </g>

          <!-- Track 3: Cash to allocated / AP paid (X: 308, Y: 600, W: 194, H: 108) -->
          <g class="interactive-card" data-node-id="decision.track_3_cause">
            <rect x="308" y="600" width="194" height="108" rx="6" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="308" y="608" width="4.5" height="92" fill="${C.rose_accent}" />
            <text x="322" y="628" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">Cash to allocated /</text>
            <text x="322" y="646" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.9" font-weight="bold" fill="${C.text_primary}">AP paid</text>
            <text x="322" y="674" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">AR unapplied in reciprocal</text>
            <text x="322" y="690" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.4" fill="${C.text_muted}">ERP</text>
            <circle cx="470" cy="654" r="23" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_3?.cause?.emote || 'cash'}.gif" x="448" y="632" width="44" height="44" />
          </g>

          <!-- Arrow Track 3 → Waiting (502 to 538) -->
          <line x1="502" y1="654" x2="538" y2="654" stroke="${C.rose_accent}" stroke-width="2.78" marker-end="url(#arr-ros)" />

          <!-- Track 3 Action: Waiting for Counterparty Action (X: 538, Y: 600, W: 248, H: 108) -->
          <g class="interactive-card" data-node-id="decision.track_3_action">
            <rect x="538" y="600" width="248" height="108" rx="5" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <circle cx="552" cy="654" r="11" fill="${C.rose_accent}" />
            <text x="552" y="659" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">›</text>
            <text x="568" y="628" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.3" font-weight="bold" fill="${C.text_primary}">Waiting for Counterparty</text>
            <text x="568" y="646" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13.3" font-weight="bold" fill="${C.text_primary}">Action (Clearing)</text>
            <text x="568" y="674" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.3" fill="${C.text_muted}">Pending reciprocal entity ledger</text>
            <text x="568" y="690" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.3" fill="${C.text_muted}">clearing</text>
            <circle cx="754" cy="654" r="23" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_3?.action?.emote || 'waiting'}.gif" x="732" y="632" width="44" height="44" />
          </g>
        </g>

        <!-- ═══ 7. CONVERGENCE BUS TO GOVERNANCE ═══ -->
        <g class="anim-grp anim-p5">
          <line x1="882" y1="203" x2="902" y2="203" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="882" y1="347" x2="902" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="786" y1="500" x2="902" y2="500" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="786" y1="654" x2="902" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="902" y1="203" x2="902" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="902" y1="212" x2="928" y2="212" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />

          <!-- ═══ 8. COLUMN 3: GOVERNANCE & ESCALATION (X: 928, W: 345) ═══ -->
          <!-- Card 1: Reconciliation Discrepancy (Y: 152, H: 120) -->
          <g class="interactive-card" data-node-id="governance.gap">
            <rect x="928" y="152" width="345" height="120" rx="6" fill="${C.rose_bg}" stroke="${C.rose_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="942" y="164" width="96" height="22" rx="3" fill="${C.rose_accent}" />
            <text x="990" y="179" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" font-weight="bold" fill="#FFFFFF" text-anchor="middle">GAP DETECTED</text>
            <text x="942" y="210" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15.0" font-weight="bold" fill="${C.text_primary}">${this.escape(gov.gap_card?.title || "Reconciliation Discrepancy")}</text>
            <text x="942" y="232" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" fill="${C.text_muted}">Open-item delta isolated between reciprocal Philips</text>
            <text x="942" y="248" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" fill="${C.text_muted}">entities.</text>
            <circle cx="1238" cy="212" r="27" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${gov.gap_card?.emote || 'gap'}.gif" x="1213" y="187" width="50" height="50" />
          </g>

          <!-- Arrow ↓ (272 to 316) -->
          <line x1="1100" y1="272" x2="1100" y2="316" stroke="${C.rose_accent}" stroke-width="2.78" marker-end="url(#arr-ros)" />

          <!-- Card 2: Send Action Notification (Y: 316, H: 120) -->
          <g class="interactive-card" data-node-id="governance.notif">
            <rect x="928" y="316" width="345" height="120" rx="6" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="942" y="328" width="140" height="22" rx="3" fill="${C.rose_accent}" />
            <text x="1012" y="343" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" font-weight="bold" fill="#FFFFFF" text-anchor="middle">ACTION NOTIFICATION</text>
            <text x="942" y="374" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15.0" font-weight="bold" fill="${C.text_primary}">${this.escape(gov.notif_card?.title || "Send Action Notification (Email)")}</text>
            <text x="942" y="398" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" fill="${C.text_muted}">Structured notice sent to counterparty accounting lead.</text>
            <circle cx="1238" cy="376" r="27" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${gov.notif_card?.emote || 'notif'}.gif" x="1213" y="351" width="50" height="50" />
          </g>

          <!-- Arrow ↓ (436 to 480) -->
          <line x1="1100" y1="436" x2="1100" y2="480" stroke="${C.red_accent}" stroke-width="2.78" marker-end="url(#arr-red)" />

          <!-- Card 3: Multi-Tier Escalation Matrix (Y: 480, H: 228) -->
          <g class="interactive-card" data-node-id="governance.escalation">
            <rect x="928" y="480" width="345" height="228" rx="6" fill="${C.red_bg}" stroke="${C.red_border}" stroke-width="0.75" filter="url(#shadow-card)" />
            <rect x="942" y="494" width="144" height="22" rx="3" fill="${C.red_accent}" />
            <text x="1014" y="509" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MULTI-TIER ESCALATION</text>
            <text x="942" y="536" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="14.2" font-weight="bold" fill="${C.red_accent}">No Response → Initiate Escalation (Matrix)</text>

            <g transform="translate(942, 552)">
              <text x="0" y="10" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" font-weight="bold" fill="${C.red_accent}">L1 (48h Inaction):</text>
              <text x="110" y="10" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" font-weight="bold" fill="${C.text_secondary}">Accounting Lead / Processor</text>
              <text x="16" y="25" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" fill="${C.text_muted}">Initial SLA alert; re-verify unmatched ledger delta.</text>

              <text x="0" y="48" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" font-weight="bold" fill="${C.red_accent}">L2 (96h Inaction):</text>
              <text x="110" y="48" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" font-weight="bold" fill="${C.text_secondary}">FSS Shared Services Manager</text>
              <text x="16" y="63" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" fill="${C.text_muted}">Shared services escalation; bilateral review call.</text>

              <text x="0" y="86" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" font-weight="bold" fill="${C.red_accent}">L3 (>5d / Close):</text>
              <text x="110" y="86" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.8" font-weight="bold" fill="${C.text_secondary}">Entity Finance Director</text>
              <text x="16" y="101" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.7" fill="${C.text_muted}">Executive sign-off; post un-cleared accrual & audit note.</text>
            </g>

            <circle cx="1237" cy="594" r="28" fill="${C.red_border}" filter="url(#shadow-halo)" />
            <image href="emotes/${gov.escalation_card?.emote || 'esc'}.gif" x="1211" y="568" width="52" height="52" />
          </g>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 2: STRATEGIC TRANSFORMATION ROADMAP (3 HORIZONS)
  // ══════════════════════════════════════════════════════════════════════════
  renderStrategicRoadmap(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const horizons = data.horizons || [];
    const workstreams = data.workstreams || [];
    const metrics = data.metrics || [];
    const paletteKey = data.palette || "obsidian_dark";
    const C = PALETTES[paletteKey] || PALETTES.obsidian_dark;
    const logoSrc = `logos/${b.logo_key || "microsoft"}.png`;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />

        <!-- Header -->
        <g class="anim-grp anim-p1">
          <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
          <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
          <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escape(h.title || "STRATEGIC TRANSFORMATION ROADMAP")}</text>
          <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" fill="${C.text_muted}">${this.escape(h.subtitle || "3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION")}</text>
          <rect x="1135" y="10" width="160" height="42" rx="4" fill="#FFFFFF" />
          <image href="${logoSrc}" x="1145" y="15" width="140" height="32" preserveAspectRatio="xMidYMid meet" />
        </g>

        <!-- 3 Horizon Headers -->
        <g class="anim-grp anim-p2">
          ${horizons.map((hz, i) => {
            const x = 320 + i * 324;
            return `
              <rect x="${x}" y="78" width="310" height="46" rx="6" fill="${C.card_bg}" stroke="${hz.color}" stroke-width="1.5" />
              <text x="${x + 14}" y="98" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${hz.color}">${this.escape(hz.title)}</text>
              <text x="${x + 14}" y="114" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">${this.escape(hz.sub)}</text>
            `;
          }).join("")}
        </g>

        <!-- 4 Workstream Lanes -->
        <g class="anim-grp anim-p3">
          ${workstreams.map((ws, i) => {
            const y = 138 + i * 118;
            return `
              <!-- Workstream Category Card -->
              <rect x="40" y="${y}" width="260" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" />
              <text x="54" y="${y + 36}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="15" font-weight="bold" fill="${C.text_primary}">${this.escape(ws.name)}</text>
              <circle cx="260" cy="${y + 53}" r="22" fill="${C.blue_bg}" />
              <image href="emotes/${ws.emote || 'tb_robot'}.gif" x="240" y="${y + 33}" width="40" height="40" />

              <!-- Horizon 1 Box -->
              <rect x="320" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
              <text x="334" y="${y + 42}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_secondary}">${this.escape(ws.h1)}</text>

              <!-- Horizon 2 Box -->
              <rect x="644" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
              <text x="658" y="${y + 42}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_secondary}">${this.escape(ws.h2)}</text>

              <!-- Horizon 3 Box -->
              <rect x="968" y="${y}" width="325" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
              <text x="982" y="${y + 42}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_secondary}">${this.escape(ws.h3)}</text>
            `;
          }).join("")}
        </g>

        <!-- Bottom Strategic Metrics -->
        <g class="anim-grp anim-p4">
          <rect x="40" y="626" width="1253" height="90" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" />
          ${metrics.map((m, i) => {
            const x = 120 + i * 400;
            return `
              <text x="${x}" y="658" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">${this.escape(m.label)}</text>
              <text x="${x}" y="694" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="32" font-weight="bold" fill="${C.blue_accent}">${this.escape(m.value)}</text>
              <text x="${x + 130}" y="690" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_secondary}">${this.escape(m.sub)}</text>
            `;
          }).join("")}
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 3: TARGET OPERATING MODEL (TOM)
  // ══════════════════════════════════════════════════════════════════════════
  renderOperatingModel(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const tiers = data.tiers || [];
    const raci = data.raci || [];
    const paletteKey = data.palette || "royal_indigo";
    const C = PALETTES[paletteKey] || PALETTES.royal_indigo;
    const logoSrc = `logos/${b.logo_key || "siemens"}.png`;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />

        <g class="anim-grp anim-p1">
          <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
          <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
          <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escape(h.title || "TARGET OPERATING MODEL (TOM) ARCHITECTURE")}</text>
          <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" fill="${C.text_muted}">${this.escape(h.subtitle || "3-TIER SERVICE DELIVERY & RACI ACCOUNTABILITY")}</text>
          <rect x="1135" y="10" width="160" height="42" rx="4" fill="#FFFFFF" />
          <image href="${logoSrc}" x="1145" y="15" width="140" height="32" preserveAspectRatio="xMidYMid meet" />
        </g>

        <!-- 3 Functional Tiers (Left Side) -->
        <g class="anim-grp anim-p2">
          ${tiers.map((t, i) => {
            const y = 84 + i * 200;
            return `
              <rect x="40" y="${y}" width="750" height="186" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="56" y="${y + 16}" width="220" height="26" rx="4" fill="${C.purple_accent}" />
              <text x="66" y="${y + 34}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">${this.escape(t.level)}</text>
              <text x="56" y="${y + 70}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="17" font-weight="bold" fill="${C.text_primary}">${this.escape(t.title)}</text>
              <text x="56" y="${y + 96}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.blue_accent}">Leadership: ${this.escape(t.owner)}</text>
              <text x="56" y="${y + 128}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.5" fill="${C.text_secondary}">${this.escape(t.mandate)}</text>
              <circle cx="730" cy="${y + 90}" r="28" fill="${C.blue_bg}" />
              <image href="emotes/${t.emote || 'spec'}.gif" x="702" y="${y + 62}" width="56" height="56" />
            `;
          }).join("")}
        </g>

        <!-- Right Side RACI Matrix -->
        <g class="anim-grp anim-p3">
          <rect x="820" y="84" width="473" height="586" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <rect x="840" y="104" width="200" height="28" rx="4" fill="${C.blue_accent}" />
          <text x="852" y="123" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">GOVERNANCE RACI MATRIX</text>
          
          <g transform="translate(840, 160)">
            <text x="0" y="0" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">Process Activity</text>
            <text x="260" y="0" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">Tier 1</text>
            <text x="320" y="0" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">Tier 2</text>
            <text x="380" y="0" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">Tier 3</text>
            <line x1="0" y1="12" x2="433" y2="12" stroke="${C.card_bd}" stroke-width="1" />
            
            ${raci.map((r, idx) => {
              const ry = 40 + idx * 70;
              return `
                <text x="0" y="${ry}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">${this.escape(r.activity)}</text>
                <text x="268" y="${ry}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.purple_accent}">${this.escape(r.s)}</text>
                <text x="328" y="${ry}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.blue_accent}">${this.escape(r.c)}</text>
                <text x="388" y="${ry}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.teal_accent}">${this.escape(r.h)}</text>
                <line x1="0" y1="${ry + 18}" x2="433" y2="${ry + 18}" stroke="${C.card_bd}" stroke-width="0.75" />
              `;
            }).join("")}
          </g>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 4: DATA & AI ARCHITECTURE PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  renderDataPipeline(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const stages = data.stages || [];
    const guardrails = data.guardrails || [];
    const paletteKey = data.palette || "obsidian_dark";
    const C = PALETTES[paletteKey] || PALETTES.obsidian_dark;
    const logoSrc = `logos/${b.logo_key || "google"}.png`;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />

        <g class="anim-grp anim-p1">
          <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
          <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
          <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escape(h.title || "ENTERPRISE DATA & AGENTIC AI PIPELINE")}</text>
          <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" fill="${C.text_muted}">${this.escape(h.subtitle || "HIGH-THROUGHPUT RECONCILIATION ARCHITECTURE")}</text>
          <rect x="1135" y="10" width="160" height="42" rx="4" fill="#FFFFFF" />
          <image href="${logoSrc}" x="1145" y="15" width="140" height="32" preserveAspectRatio="xMidYMid meet" />
        </g>

        <!-- 4 Pipeline Stages (Left to Right) -->
        <g class="anim-grp anim-p2">
          ${stages.map((st, i) => {
            const x = 40 + i * 316;
            return `
              <rect x="${x}" y="90" width="292" height="420" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="${x + 20}" y="112" width="48" height="32" rx="4" fill="${C.blue_accent}" />
              <text x="${x + 44}" y="133" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(st.num)}</text>
              <text x="${x + 20}" y="180" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="17" font-weight="bold" fill="${C.text_primary}">${this.escape(st.name)}</text>
              <text x="${x + 20}" y="215" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" fill="${C.text_muted}">${this.escape(st.tech)}</text>
              <circle cx="${x + 146}" cy="310" r="48" fill="${C.blue_bg}" />
              <image href="emotes/${st.emote || 'tb_robot'}.gif" x="${x + 106}" y="270" width="80" height="80" />
              <rect x="${x + 20}" y="430" width="252" height="42" rx="6" fill="${C.blue_bg}" />
              <text x="${x + 146}" y="456" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.blue_accent}" text-anchor="middle">${this.escape(st.sla)}</text>
            `;
          }).join("")}
        </g>

        <!-- Bottom Security Guardrails -->
        <g class="anim-grp anim-p3">
          <rect x="40" y="534" width="1253" height="176" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="566" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="14" font-weight="bold" fill="${C.blue_accent}">ENTERPRISE GOVERNANCE & COMPLIANCE GUARDRAILS</text>
          ${guardrails.map((g, i) => {
            const gx = 64 + i * 400;
            return `
              <g transform="translate(${gx}, 590)">
                <circle cx="24" cy="24" r="22" fill="${C.blue_bg}" />
                <image href="emotes/${g.emote || 'tb_audit'}.gif" x="6" y="6" width="36" height="36" />
                <text x="60" y="18" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(g.title)}</text>
                <text x="60" y="36" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_muted}">${this.escape(g.detail)}</text>
              </g>
            `;
          }).join("")}
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 5: EXECUTIVE BOARD KPI SCORECARD
  // ══════════════════════════════════════════════════════════════════════════
  renderKpiScorecard(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const kpis = data.kpis || [];
    const pillars = data.pillars || [];
    const paletteKey = data.palette || "emerald_fintech";
    const C = PALETTES[paletteKey] || PALETTES.emerald_fintech;
    const logoSrc = `logos/${b.logo_key || "apple"}.png`;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />

        <g class="anim-grp anim-p1">
          <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
          <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
          <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escape(h.title || "EXECUTIVE PERFORMANCE & KPI SCORECARD")}</text>
          <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" fill="${C.text_muted}">${this.escape(h.subtitle || "BOARD OF DIRECTORS REVIEW")}</text>
          <rect x="1135" y="10" width="160" height="42" rx="4" fill="#FFFFFF" />
          <image href="${logoSrc}" x="1145" y="15" width="140" height="32" preserveAspectRatio="xMidYMid meet" />
        </g>

        <!-- Top 4 KPI Tiles -->
        <g class="anim-grp anim-p2">
          ${kpis.map((k, i) => {
            const x = 40 + i * 316;
            const ragColor = k.rag === "green" ? "#10B981" : (k.rag === "amber" ? "#F59E0B" : "#EF4444");
            return `
              <rect x="${x}" y="86" width="292" height="190" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="${x}" y="86" width="6" height="190" fill="${ragColor}" />
              <text x="${x + 20}" y="118" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">${this.escape(k.label)}</text>
              <text x="${x + 20}" y="166" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="36" font-weight="bold" fill="${C.text_primary}">${this.escape(k.value)}</text>
              <rect x="${x + 20}" y="186" width="90" height="24" rx="4" fill="${ragColor}20" />
              <text x="${x + 65}" y="202" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${ragColor}" text-anchor="middle">${this.escape(k.delta)}</text>
              <text x="${x + 20}" y="244" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_muted}">${this.escape(k.note)}</text>
              <circle cx="${x + 242}" cy="130" r="26" fill="${C.blue_bg}" />
              <image href="emotes/${k.emote || 'tb_robot'}.gif" x="${x + 218}" y="106" width="48" height="48" />
            `;
          }).join("")}
        </g>

        <!-- Bottom 3 Strategic Pillars -->
        <g class="anim-grp anim-p3">
          ${pillars.map((p, i) => {
            const y = 300 + i * 134;
            return `
              <rect x="40" y="${y}" width="1253" height="114" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <text x="64" y="${y + 40}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.text_primary}">${this.escape(p.name)}</text>
              <text x="64" y="${y + 76}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" fill="${C.text_muted}">${this.escape(p.detail)}</text>
              <rect x="1100" y="${y + 36}" width="150" height="44" rx="6" fill="${C.blue_bg}" />
              <text x="1175" y="${y + 65}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="20" font-weight="bold" fill="${C.blue_accent}" text-anchor="middle">${this.escape(p.score)}</text>
            `;
          }).join("")}
        </g>
      </svg>
    `;
  }

  simulateAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const phases = [".anim-p1", ".anim-p2", ".anim-p3", ".anim-p4", ".anim-p5"];
    phases.forEach(selector => {
      this.container.querySelectorAll(selector).forEach(el => {
        el.style.opacity = "0";
        el.style.transition = "none";
        el.style.transform = "translateY(8px)";
      });
    });

    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < phases.length) {
        const els = this.container.querySelectorAll(phases[currentPhase]);
        els.forEach(el => {
          el.style.transition = "opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
        currentPhase++;
      } else {
        clearInterval(interval);
        this.isAnimating = false;
      }
    }, 600);
  }

  resetAnimation() {
    this.isAnimating = false;
    const phases = [".anim-p1", ".anim-p2", ".anim-p3", ".anim-p4", ".anim-p5"];
    phases.forEach(selector => {
      this.container.querySelectorAll(selector).forEach(el => {
        el.style.opacity = "1";
        el.style.transition = "none";
        el.style.transform = "translateY(0)";
      });
    });
  }

  escape(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}
