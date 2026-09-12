/**
 * Executive Slide Studio - Exact Mathematical SVG Canvas Renderer
 * Maps Inches * 100 directly into a 1333 x 750 16:9 Vector ViewBox.
 * Matches ICA_Executive_Blueprint.pptx with exact DrawingML 2.0 pt fidelity.
 * Supports all 10 Philips Executive Enterprise Templates.
 * ZERO Blue Color — Pure Executive Remotion Warm Palette.
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
      case "financial_close":
        svgContent = this.renderFinancialClose(data);
        break;
      case "vendor_p2p":
        svgContent = this.renderVendorP2P(data);
        break;
      case "it_service":
        svgContent = this.renderITService(data);
        break;
      case "risk_compliance":
        svgContent = this.renderRiskCompliance(data);
        break;
      case "customer_journey":
        svgContent = this.renderCustomerJourney(data);
        break;
      case "process_flow":
      default:
        svgContent = this.renderProcessFlow(data);
        break;
    }

    this.container.innerHTML = svgContent;

    // Attach interactive node click handlers
    this.container.querySelectorAll(".interactive-card").forEach(card => {
      card.addEventListener("click", () => {
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

  // Common SVG Markers and Defs
  getStandardDefs(C) {
    return `
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
    `;
  }

  // Common Header Bar
  renderHeader(h, b, C, paletteKey) {
    const logoSrc = `logos/${b.logo_key || "philips"}.png`;
    return `
      <g class="anim-grp anim-p1">
        <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
        <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
        <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escape(h.title || "EXECUTIVE ARCHITECTURE BLUEPRINT")}</text>
        <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" font-weight="normal" fill="${paletteKey === 'obsidian_dark' ? '#A3A3A3' : '#B0AFAF'}">${this.escape(h.subtitle || "PHILIPS  •  EXECUTIVE OPERATIONS")}</text>
        <rect x="1135" y="10" width="160" height="42" rx="4" fill="#FFFFFF" filter="url(#shadow-card)" />
        <image href="${logoSrc}" x="1145" y="15" width="140" height="32" preserveAspectRatio="xMidYMid meet" />
      </g>
    `;
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

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- 2. PIPELINE RIBBON (Y: 71 to 107) -->
        <g class="anim-grp anim-p1">
          <!-- Ribbon 01 -->
          <rect x="40" y="71" width="270" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="48" y="75" width="38" height="28" rx="3" fill="${C.blue_accent}" />
          <text x="67" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">01</text>
          <text x="94" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">INGESTION &amp; SCOPE</text>
          <text x="94" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">Qlik Sense Extract &amp; Filtering</text>
          <line x1="316" y1="89" x2="334" y2="89" stroke="${C.text_muted}" stroke-width="2.78" marker-end="url(#arr-gray)" />

          <!-- Ribbon 02 -->
          <rect x="340" y="71" width="340" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="348" y="75" width="38" height="28" rx="3" fill="${C.amber_accent}" />
          <text x="367" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">02</text>
          <text x="394" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">CLASSIFY &amp; TRIAGE</text>
          <text x="394" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">3-Track Operational Taxonomy</text>
          <line x1="686" y1="89" x2="704" y2="89" stroke="${C.text_muted}" stroke-width="2.78" marker-end="url(#arr-gray)" />

          <!-- Ribbon 03 -->
          <rect x="710" y="71" width="270" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="718" y="75" width="38" height="28" rx="3" fill="${C.teal_accent}" />
          <text x="737" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">03</text>
          <text x="764" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">RESOLVE BY CAUSE</text>
          <text x="764" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">HWI, OCR, Forensic &amp; Counterparty</text>
          <line x1="986" y1="89" x2="1004" y2="89" stroke="${C.text_muted}" stroke-width="2.78" marker-end="url(#arr-gray)" />

          <!-- Ribbon 04 -->
          <rect x="1010" y="71" width="283" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
          <rect x="1018" y="75" width="38" height="28" rx="3" fill="${C.rose_accent}" />
          <text x="1037" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">04</text>
          <text x="1064" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="${C.text_primary}">CLOSE THE LOOP</text>
          <text x="1064" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">Escalation Matrix &amp; Governance</text>
        </g>

        <!-- 3. MAIN DASHED CONTAINER (Y: 118 to 732) -->
        <g class="anim-grp anim-p2">
          <rect x="40" y="118" width="1253" height="614" rx="10" fill="${C.card_bg}" stroke="${C.dashed_border}" stroke-width="1.8" stroke-dasharray="10 6" filter="url(#shadow-card)" />
          <rect x="52" y="108" width="200" height="24" rx="5" fill="${C.amber_accent}" />
          <text x="152" y="124" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(data.container_label || "PHILIPS AS-IS FLOW")}</text>
        </g>

        <!-- 4. COLUMN 1: INGESTION PIPELINE (X: 68, W: 200) -->
        <g class="anim-grp anim-p2">
          <!-- Card 1: Accounting Specialist -->
          <g class="interactive-card" data-node-id="node_spec" cursor="pointer">
            <rect x="68" y="152" width="200" height="70" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="80" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">${this.escape(ing[0]?.title || "Accounting Specialist")}</text>
            <text x="80" y="190" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(ing[0]?.sub || "Philips Accounting Lead")}</text>
            <circle cx="236" cy="187" r="22" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[0]?.emote || 'spec'}.gif" x="214" y="165" width="44" height="44" />
          </g>
          <line x1="168" y1="222" x2="168" y2="252" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- Card 2: Extract Open-Item Report -->
          <g class="interactive-card" data-node-id="node_qlik" cursor="pointer">
            <rect x="68" y="258" width="200" height="126" rx="8" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
            <rect x="68" y="258" width="6" height="126" fill="${C.blue_accent}" />
            <text x="80" y="280" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.blue_accent}">${this.escape(ing[1]?.title || "Extract Open-Item Report")}</text>
            <text x="80" y="296" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_secondary}">Qlik Sense extract</text>
            <text x="80" y="310" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_secondary}">Exclude reciprocal matched items.</text>
            <circle cx="234" cy="321" r="24" fill="${C.card_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[1]?.emote || 'qlik'}.gif" x="210" y="297" width="48" height="48" />
          </g>
          <line x1="168" y1="384" x2="168" y2="416" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- Card 3: Filter by Company Code -->
          <g class="interactive-card" data-node-id="node_filter" cursor="pointer">
            <rect x="68" y="422" width="200" height="64" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="80" y="444" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">${this.escape(ing[2]?.title || "Filter by Company Code")}</text>
            <text x="80" y="460" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(ing[2]?.sub || "Scope validation by entity code")}</text>
            <circle cx="239" cy="454" r="19" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[2]?.emote || 'filter'}.gif" x="220" y="435" width="38" height="38" />
          </g>
          <line x1="168" y1="486" x2="168" y2="518" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <!-- Card 4: List of open items with classification -->
          <g class="interactive-card" data-node-id="node_list" cursor="pointer">
            <rect x="68" y="524" width="200" height="182" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="80" y="546" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">List of open items</text>
            <text x="80" y="560" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.blue_accent}">with classification</text>
            <text x="80" y="578" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Consolidated open delta ready</text>
            <text x="80" y="590" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">for triage taxonomy.</text>
            <circle cx="233" cy="615" r="25" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${ing[3]?.emote || 'list'}.gif" x="208" y="590" width="50" height="50" />
          </g>
        </g>

        <!-- 5. DECISION FORK CONNECTORS (2.0 pt DrawingML Precision) -->
        <g class="anim-grp anim-p3">
          <line x1="268" y1="540" x2="288" y2="540" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="288" y1="275" x2="288" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="288" y1="275" x2="302" y2="275" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="288" y1="500" x2="302" y2="500" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="288" y1="654" x2="302" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
        </g>

        <!-- 6. TRACK 1: Posting not found (X: 308, Y: 220, W: 178) -->
        <g class="anim-grp anim-p3">
          <g class="interactive-card" data-node-id="node_pnf" cursor="pointer">
            <rect x="308" y="220" width="178" height="110" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="320" y="244" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">${this.escape(df.root?.title || "Posting not found")}</text>
            <text x="320" y="260" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(df.root?.sub || "Kernel out of scope line")}</text>
            <circle cx="454" cy="275" r="22" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.root?.emote || 'pnf'}.gif" x="432" y="253" width="44" height="44" />
          </g>

          <!-- Sub-fork to 1A and 1B -->
          <line x1="486" y1="275" x2="502" y2="275" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="502" y1="203" x2="502" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="502" y1="203" x2="512" y2="203" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="502" y1="347" x2="512" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />

          <!-- 1A: IDoc / OCR Issue -> Troubleshoot HWI -->
          <g class="interactive-card" data-node-id="node_idoc" cursor="pointer">
            <rect x="518" y="152" width="148" height="102" rx="8" fill="${C.card_bg}" stroke="${C.teal_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="528" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">${this.escape(df.sub_branch_1a?.cause?.title || "IDoc / OCR Issue")}</text>
            <text x="528" y="190" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(df.sub_branch_1a?.cause?.sub || "Interface syntax failure")}</text>
            <circle cx="635" cy="203" r="21" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1a?.cause?.emote || 'idoc'}.gif" x="614" y="182" width="42" height="42" />
          </g>
          <line x1="666" y1="203" x2="686" y2="203" stroke="${C.teal_accent}" stroke-width="2.78" marker-end="url(#arr-tea)" />

          <g class="interactive-card" data-node-id="node_hwi" cursor="pointer">
            <rect x="692" y="152" width="190" height="102" rx="8" fill="${C.card_bg}" stroke="${C.teal_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="702" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.teal_accent}">${this.escape(df.sub_branch_1a?.action?.title || "Troubleshoot IDoc Using HWI")}</text>
            <text x="702" y="190" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(df.sub_branch_1a?.action?.sub || "Execute SAP Hand Work Instructions")}</text>
            <circle cx="851" cy="203" r="21" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1a?.action?.emote || 'hwi'}.gif" x="830" y="182" width="42" height="42" />
          </g>

          <!-- 1B: No EDI -> Request Invoice Copy -->
          <g class="interactive-card" data-node-id="node_no_edi" cursor="pointer">
            <rect x="518" y="296" width="148" height="102" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="528" y="318" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">${this.escape(df.sub_branch_1b?.cause?.title || "No EDI / Non-SAP")}</text>
            <text x="528" y="334" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(df.sub_branch_1b?.cause?.sub || "Paper drop / legacy format")}</text>
            <circle cx="635" cy="347" r="21" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1b?.cause?.emote || 'no_edi'}.gif" x="614" y="326" width="42" height="42" />
          </g>
          <line x1="666" y1="347" x2="686" y2="347" stroke="${C.blue_accent}" stroke-width="2.78" marker-end="url(#arr-blu)" />

          <g class="interactive-card" data-node-id="node_inv" cursor="pointer">
            <rect x="692" y="296" width="190" height="102" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="702" y="318" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.blue_accent}">${this.escape(df.sub_branch_1b?.action?.title || "Request / Retrieve Invoice Copy")}</text>
            <text x="702" y="334" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(df.sub_branch_1b?.action?.sub || "Auto-fetch PDF via OCR matching")}</text>
            <circle cx="851" cy="347" r="21" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.sub_branch_1b?.action?.emote || 'inv'}.gif" x="830" y="326" width="42" height="42" />
          </g>
        </g>

        <!-- 7. TRACK 2: AP-AR Sign Issue -> Review (Y: 446) -->
        <g class="anim-grp anim-p4">
          <g class="interactive-card" data-node-id="node_ap_ar" cursor="pointer">
            <rect x="308" y="446" width="194" height="108" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="320" y="468" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.amber_accent}">Investigate AP-AR sign issue</text>
            <text x="320" y="484" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">AR cleared, AP remains open (+/−)</text>
            <circle cx="470" cy="500" r="22" fill="${C.amber_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_2?.cause?.emote || 'ap_ar'}.gif" x="448" y="478" width="44" height="44" />
          </g>
          <line x1="502" y1="500" x2="532" y2="500" stroke="${C.amber_accent}" stroke-width="2.78" marker-end="url(#arr-amb)" />

          <g class="interactive-card" data-node-id="node_review" cursor="pointer">
            <rect x="538" y="446" width="248" height="108" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="550" y="468" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.amber_accent}">Review &amp; Analyze Issue</text>
            <text x="550" y="484" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Investigate discrepancy; post clearing journal</text>
            <circle cx="754" cy="500" r="22" fill="${C.amber_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_2?.action?.emote || 'review'}.gif" x="732" y="478" width="44" height="44" />
          </g>
        </g>

        <!-- 8. TRACK 3: Cash to allocated -> Waiting (Y: 600) -->
        <g class="anim-grp anim-p4">
          <g class="interactive-card" data-node-id="node_cash" cursor="pointer">
            <rect x="308" y="600" width="194" height="108" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="320" y="622" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.rose_accent}">Cash to allocated / AP paid</text>
            <text x="320" y="638" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">AR unapplied in reciprocal ERP</text>
            <circle cx="470" cy="654" r="22" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_3?.cause?.emote || 'cash'}.gif" x="448" y="632" width="44" height="44" />
          </g>
          <line x1="502" y1="654" x2="532" y2="654" stroke="${C.rose_accent}" stroke-width="2.78" marker-end="url(#arr-ros)" />

          <g class="interactive-card" data-node-id="node_waiting" cursor="pointer">
            <rect x="538" y="600" width="248" height="108" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="550" y="622" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.rose_accent}">Waiting for Counterparty Action</text>
            <text x="550" y="638" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Pending reciprocal entity ledger clearing</text>
            <circle cx="754" cy="654" r="22" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_3?.action?.emote || 'waiting'}.gif" x="732" y="632" width="44" height="44" />
          </g>
        </g>

        <!-- 9. CONVERGENCE BUS TO GOVERNANCE (X: 902, Y: 203 to 654) -->
        <g class="anim-grp anim-p4">
          <line x1="882" y1="203" x2="902" y2="203" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="882" y1="347" x2="902" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="786" y1="500" x2="902" y2="500" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="786" y1="654" x2="902" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="902" y1="203" x2="902" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="902" y1="212" x2="922" y2="212" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
        </g>

        <!-- 10. COLUMN 3: GOVERNANCE & ESCALATION (X: 928, W: 345) -->
        <g class="anim-grp anim-p5">
          <!-- Card 1: Reconciliation Discrepancy -->
          <g class="interactive-card" data-node-id="node_gap" cursor="pointer">
            <rect x="928" y="152" width="345" height="120" rx="8" fill="${C.rose_bg}" stroke="${C.rose_border}" stroke-width="1" filter="url(#shadow-card)" />
            <rect x="942" y="164" width="112" height="20" rx="4" fill="${C.rose_accent}" />
            <text x="998" y="178" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" font-weight="bold" fill="#FFFFFF" text-anchor="middle">GAP DETECTED</text>
            <text x="942" y="202" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.rose_accent}">${this.escape(gov.gap_card?.title || "Reconciliation Discrepancy")}</text>
            <text x="942" y="222" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_secondary}">Open-item delta isolated between</text>
            <text x="942" y="234" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_secondary}">reciprocal Philips entities.</text>
            <circle cx="1238" cy="212" r="25" fill="${C.card_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${gov.gap_card?.emote || 'gap'}.gif" x="1213" y="187" width="50" height="50" />
          </g>
          <line x1="1100" y1="272" x2="1100" y2="310" stroke="${C.rose_accent}" stroke-width="2.78" marker-end="url(#arr-ros)" />

          <!-- Card 2: Action Notification (Email) -->
          <g class="interactive-card" data-node-id="node_notif" cursor="pointer">
            <rect x="928" y="316" width="345" height="120" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1" filter="url(#shadow-card)" />
            <rect x="942" y="328" width="144" height="20" rx="4" fill="${C.rose_accent}" />
            <text x="1014" y="342" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" font-weight="bold" fill="#FFFFFF" text-anchor="middle">ACTION NOTIFICATION</text>
            <text x="942" y="366" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">${this.escape(gov.notif_card?.title || "Send Action Notification (Email)")}</text>
            <text x="942" y="386" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_secondary}">Structured notice sent to counterparty</text>
            <text x="942" y="398" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_secondary}">accounting lead.</text>
            <circle cx="1238" cy="376" r="25" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${gov.notif_card?.emote || 'notif'}.gif" x="1213" y="351" width="50" height="50" />
          </g>
          <line x1="1100" y1="436" x2="1100" y2="474" stroke="${C.red_accent}" stroke-width="2.78" marker-end="url(#arr-red)" />

          <!-- Card 3: Multi-Tier Escalation Matrix -->
          <g class="interactive-card" data-node-id="node_esc" cursor="pointer">
            <rect x="928" y="480" width="345" height="228" rx="8" fill="${C.red_bg}" stroke="${C.red_border}" stroke-width="1" filter="url(#shadow-card)" />
            <rect x="942" y="494" width="144" height="22" rx="4" fill="${C.red_accent}" />
            <text x="1014" y="509" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MULTI-TIER ESCALATION</text>
            <text x="942" y="534" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.red_accent}">No Response → Initiate Escalation (Matrix)</text>

            <circle cx="1237" cy="594" r="26" fill="${C.card_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${gov.escalation_card?.emote || 'esc'}.gif" x="1211" y="568" width="52" height="52" />

            <!-- Tier 1 -->
            <text x="942" y="562" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.red_accent}">L1 (48h Inaction):</text>
            <text x="1030" y="562" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.text_primary}">Accounting Lead</text>
            <text x="942" y="576" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Initial SLA alert; re-verify unmatched ledger delta.</text>

            <!-- Tier 2 -->
            <text x="942" y="608" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.red_accent}">L2 (96h Inaction):</text>
            <text x="1030" y="608" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.text_primary}">FSS Shared Services Manager</text>
            <text x="942" y="622" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Shared services escalation; bilateral review call.</text>

            <!-- Tier 3 -->
            <text x="942" y="654" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.red_accent}">L3 (&gt;5d / Close):</text>
            <text x="1030" y="654" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.text_primary}">Entity Finance Director</text>
            <text x="942" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Executive sign-off; post un-cleared accrual &amp; note.</text>
          </g>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 2: STRATEGIC ROADMAP (3 HORIZONS)
  // ══════════════════════════════════════════════════════════════════════════
  renderStrategicRoadmap(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const horizons = data.horizons || [];
    const workstreams = data.workstreams || [];
    const metrics = data.metrics || [];
    const paletteKey = data.palette || "obsidian_dark";
    const C = PALETTES[paletteKey] || PALETTES.obsidian_dark;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- Horizon Column Headers (Top) -->
        <g class="anim-grp anim-p1">
          <rect x="40" y="78" width="260" height="46" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" />
          <text x="54" y="106" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">TRANSFORMATION LANES</text>

          ${horizons.map((hz, i) => {
            const x = 320 + i * 324;
            return `
              <rect x="${x}" y="78" width="310" height="46" rx="6" fill="${C.card_bg}" stroke="${hz.color}" stroke-width="1.5" />
              <text x="${x + 14}" y="98" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${hz.color}">${this.escape(hz.title)}</text>
              <text x="${x + 14}" y="114" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">${this.escape(hz.sub)}</text>
            `;
          }).join("")}
        </g>

        <!-- 4 Workstream Rows -->
        <g class="anim-grp anim-p2">
          ${workstreams.map((ws, i) => {
            const y = 138 + i * 118;
            return `
              <!-- Workstream Title Box -->
              <rect x="40" y="${y}" width="260" height="106" rx="6" fill="${C.card_bg}" stroke="${C.blue_accent}" stroke-width="0.75" />
              <text x="54" y="${y + 36}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(ws.name)}</text>
              <circle cx="260" cy="${y + 53}" r="22" fill="${C.blue_bg}" />
              <image href="emotes/${ws.emote || 'tb_robot'}.gif" x="240" y="${y + 33}" width="40" height="40" />

              <!-- Horizon 1 Milestone -->
              <rect x="320" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
              <text x="334" y="${y + 30}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(ws.h1)}</text>

              <!-- Horizon 2 Milestone -->
              <rect x="644" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
              <text x="658" y="${y + 30}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(ws.h2)}</text>

              <!-- Horizon 3 Milestone -->
              <rect x="968" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
              <text x="982" y="${y + 30}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(ws.h3)}</text>
            `;
          }).join("")}
        </g>

        <!-- Strategic ROI Metrics Bar (Bottom) -->
        <g class="anim-grp anim-p3">
          <rect x="40" y="626" width="1253" height="90" rx="8" fill="${C.card_bg}" stroke="${C.blue_accent}" stroke-width="1" />
          ${metrics.map((m, i) => {
            const x = 120 + i * 400;
            return `
              <text x="${x}" y="654" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="${C.text_muted}">${this.escape(m.label)}</text>
              <text x="${x}" y="694" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.blue_accent}">${this.escape(m.value)}</text>
              <text x="${x + 120}" y="688" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(m.sub)}</text>
            `;
          }).join("")}
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 3: TARGET OPERATING MODEL (TOM 3-TIER ARCHITECTURE)
  // ══════════════════════════════════════════════════════════════════════════
  renderOperatingModel(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const tiers = data.tiers || [];
    const raci = data.raci || [];
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- Left: 3 Tiers Architecture -->
        <g class="anim-grp anim-p2">
          ${tiers.map((t, i) => {
            const y = 84 + i * 200;
            return `
              <rect x="40" y="${y}" width="750" height="186" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="56" y="${y + 16}" width="220" height="26" rx="4" fill="${C.blue_accent}" />
              <text x="66" y="${y + 33}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF">${this.escape(t.level)}</text>
              <text x="56" y="${y + 70}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.text_primary}">${this.escape(t.title)}</text>
              <text x="56" y="${y + 95}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.5" font-weight="bold" fill="${C.amber_accent}">Leadership: ${this.escape(t.owner)}</text>
              <text x="56" y="${y + 122}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(t.mandate)}</text>
              <circle cx="730" cy="${y + 90}" r="32" fill="${C.blue_bg}" />
              <image href="emotes/${t.emote || 'spec'}.gif" x="702" y="${y + 62}" width="56" height="56" />
            `;
          }).join("")}
        </g>

        <!-- Right: Governance RACI Dock -->
        <g class="anim-grp anim-p3">
          <rect x="820" y="84" width="473" height="586" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <rect x="840" y="104" width="220" height="28" rx="4" fill="${C.blue_accent}" />
          <text x="850" y="123" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF">GOVERNANCE RACI MATRIX</text>
          ${raci.map((r, idx) => {
            const ry = 160 + idx * 70;
            return `
              <rect x="840" y="${ry}" width="433" height="55" rx="6" fill="${C.blue_bg}" stroke="${C.card_bd}" stroke-width="0.5" />
              <text x="854" y="${ry + 22}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">${this.escape(r.activity)}</text>
              <text x="854" y="${ry + 42}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.amber_accent}">Tier 1: ${r.s}   •   Tier 2: ${r.c}   •   Tier 3: ${r.h}</text>
            `;
          }).join("")}
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 4: HEALTHSUITE DATA & AGENTIC AI PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  renderDataPipeline(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const stages = data.stages || [];
    const guardrails = data.guardrails || [];
    const paletteKey = data.palette || "obsidian_dark";
    const C = PALETTES[paletteKey] || PALETTES.obsidian_dark;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

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
          <text x="64" y="566" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="14" font-weight="bold" fill="${C.blue_accent}">ENTERPRISE GOVERNANCE &amp; COMPLIANCE GUARDRAILS</text>
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

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

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

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 6: FINANCIAL CLOSE & SETTLEMENT PIPELINE (PHILIPS GLOBAL FINANCE)
  // ══════════════════════════════════════════════════════════════════════════
  renderFinancialClose(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const phases = data.phases || [];
    const nodes = data.nodes || [];
    const gw = data.gateways || {};
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- Top 4 Close Phases Ribbon -->
        <g class="anim-grp anim-p1">
          ${phases.map((p, i) => {
            const x = 40 + i * 316;
            return `
              <rect x="${x}" y="76" width="292" height="60" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" />
              <rect x="${x + 10}" y="84" width="75" height="20" rx="3" fill="${C.blue_accent}" />
              <text x="${x + 47}" y="98" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(p.phase)}</text>
              <text x="${x + 95}" y="98" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="${C.amber_accent}">${this.escape(p.days)}</text>
              <text x="${x + 10}" y="124" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">${this.escape(p.title)}</text>
              <circle cx="${x + 260}" cy="106" r="18" fill="${C.blue_bg}" />
              <image href="emotes/${p.emote || 'calc'}.gif" x="${x + 244}" y="90" width="32" height="32" />
              ${i < 3 ? `<line x1="${x + 292}" y1="106" x2="${x + 316}" y2="106" stroke="${C.blue_accent}" stroke-width="2" marker-end="url(#arr-blu)" />` : ''}
            `;
          }).join("")}
        </g>

        <!-- Main Middle Canvas: Dual Execution Tracks with Decision Branch -->
        <g class="anim-grp anim-p2">
          <rect x="40" y="152" width="870" height="440" rx="10" fill="${C.card_bg}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="8 5" />
          <rect x="56" y="142" width="240" height="22" rx="4" fill="${C.blue_accent}" />
          <text x="176" y="157" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SUB-LEDGER SETTLEMENT RUNBOOK</text>

          <!-- Nodes Row 1 -->
          ${nodes.slice(0, 3).map((n, idx) => {
            const x = 70 + idx * 260;
            return `
              <g class="interactive-card" data-node-id="${n.id}" cursor="pointer">
                <rect x="${x}" y="190" width="220" height="110" rx="8" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" />
                <rect x="${x + 12}" y="202" width="60" height="18" rx="3" fill="${C.amber_accent}" />
                <text x="${x + 42}" y="215" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(n.badge)}</text>
                <text x="${x + 12}" y="242" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">${this.escape(n.title)}</text>
                <text x="${x + 12}" y="262" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">${this.escape(n.desc)}</text>
                <circle cx="${x + 188}" cy="245" r="20" fill="${C.card_bg}" />
                <image href="emotes/${n.emote || 'calc'}.gif" x="${x + 168}" y="225" width="40" height="40" />
              </g>
              ${idx < 2 ? `<line x1="${x + 220}" y1="245" x2="${x + 260}" y2="245" stroke="${C.blue_accent}" stroke-width="2.5" marker-end="url(#arr-blu)" />` : ''}
            `;
          }).join("")}

          <!-- Connector Spine to Lower Row -->
          <line x1="720" y1="300" x2="720" y2="360" stroke="${C.purple_accent}" stroke-width="2.5" />
          <line x1="720" y1="360" x2="180" y2="360" stroke="${C.purple_accent}" stroke-width="2.5" />
          <line x1="180" y1="360" x2="180" y2="390" stroke="${C.purple_accent}" stroke-width="2.5" marker-end="url(#arr-pur)" />

          <!-- Nodes Row 2 -->
          ${nodes.slice(3, 6).map((n, idx) => {
            const x = 70 + idx * 260;
            return `
              <g class="interactive-card" data-node-id="${n.id}" cursor="pointer">
                <rect x="${x}" y="400" width="220" height="110" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <rect x="${x + 12}" y="412" width="75" height="18" rx="3" fill="${C.teal_accent}" />
                <text x="${x + 49}" y="425" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(n.badge)}</text>
                <text x="${x + 12}" y="452" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">${this.escape(n.title)}</text>
                <text x="${x + 12}" y="472" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">${this.escape(n.desc)}</text>
                <circle cx="${x + 188}" cy="455" r="20" fill="${C.blue_bg}" />
                <image href="emotes/${n.emote || 'ledger'}.gif" x="${x + 168}" y="435" width="40" height="40" />
              </g>
              ${idx < 2 ? `<line x1="${x + 220}" y1="455" x2="${x + 260}" y2="455" stroke="${C.teal_accent}" stroke-width="2.5" marker-end="url(#arr-tea)" />` : ''}
            `;
          }).join("")}

          <rect x="70" y="530" width="810" height="42" rx="6" fill="${C.blue_bg}" />
          <text x="90" y="556" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.blue_accent}">AUTO-RECONCILIATION SPEED: 94.8% Same-Day Bilateral Settlement • Zero Manual Journal Overrides</text>
        </g>

        <!-- Right Side: Close Governance & Materiality Dock -->
        <g class="anim-grp anim-p3">
          <rect x="930" y="152" width="363" height="440" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <rect x="950" y="172" width="160" height="24" rx="4" fill="${C.rose_accent}" />
          <text x="1030" y="188" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">GOVERNANCE GATEWAYS</text>

          <g transform="translate(950, 216)">
            <rect x="0" y="0" width="323" height="85" rx="6" fill="${C.rose_bg}" stroke="${C.rose_border}" stroke-width="1" />
            <circle cx="28" cy="42" r="20" fill="${C.card_bg}" />
            <image href="emotes/stamp.gif" x="12" y="26" width="32" height="32" />
            <text x="60" y="28" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.5" font-weight="bold" fill="${C.rose_accent}">Materiality Threshold</text>
            <text x="60" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="${C.text_primary}">${this.escape(gw.threshold || "€25,000 Materiality Delta Limit")}</text>
            <text x="60" y="66" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">Variances below €25K auto-expensed</text>
          </g>

          <g transform="translate(950, 318)">
            <rect x="0" y="0" width="323" height="85" rx="6" fill="${C.amber_bg}" stroke="${C.amber_border}" stroke-width="1" />
            <circle cx="28" cy="42" r="20" fill="${C.card_bg}" />
            <image href="emotes/tb_ageing.gif" x="12" y="26" width="32" height="32" />
            <text x="60" y="28" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.5" font-weight="bold" fill="${C.amber_accent}">Escalation SLA</text>
            <text x="60" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="${C.text_primary}">${this.escape(gw.sla || "4-Hour Critical Variance Escalation")}</text>
            <text x="60" y="66" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">Immediate Slack &amp; SAP Notification</text>
          </g>

          <g transform="translate(950, 420)">
            <rect x="0" y="0" width="323" height="85" rx="6" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" />
            <circle cx="28" cy="42" r="20" fill="${C.card_bg}" />
            <image href="emotes/tb_rbac.gif" x="12" y="26" width="32" height="32" />
            <text x="60" y="28" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.5" font-weight="bold" fill="${C.blue_accent}">Authorized Sign-Off</text>
            <text x="60" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="${C.text_primary}">${this.escape(gw.approver || "VP Group Accounting &amp; Reporting")}</text>
            <text x="60" y="66" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">Two-person cryptographic certification</text>
          </g>
        </g>

        <!-- Bottom Summary Ribbon -->
        <g class="anim-grp anim-p4">
          <rect x="40" y="612" width="1253" height="100" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="642" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}">PHILIPS GLOBAL BUSINESS SERVICES  •  FINANCE CLOSE VELOCITY</text>
          <text x="64" y="682" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.blue_accent}">1.8 DAYS</text>
          <text x="210" y="675" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.teal_accent}">Global Close Cycle (down from 4.2d)</text>
          <text x="500" y="682" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.amber_accent}">99.8%</text>
          <text x="610" y="675" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">First-Pass Journal Integrity</text>
          <text x="880" y="682" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.rose_accent}">€0.00</text>
          <text x="980" y="675" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Unallocated Material Balances</text>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 7: PROCURE-TO-PAY (P2P) & VENDOR LOGISTICS
  // ══════════════════════════════════════════════════════════════════════════
  renderVendorP2P(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const steps = data.steps || [];
    const ef = data.exception_flow || {};
    const sc = data.vendor_scorecard || {};
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- Top 5 P2P Sequential Steps -->
        <g class="anim-grp anim-p2">
          ${steps.map((st, i) => {
            const x = 40 + i * 253;
            return `
              <rect x="${x}" y="80" width="235" height="150" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="${x + 14}" y="94" width="36" height="26" rx="4" fill="${C.blue_accent}" />
              <text x="${x + 32}" y="112" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(st.num)}</text>
              <circle cx="${x + 195}" cy="115" r="22" fill="${C.blue_bg}" />
              <image href="emotes/${st.emote || 'po_doc'}.gif" x="${x + 175}" y="95" width="40" height="40" />
              <text x="${x + 14}" y="152" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(st.title)}</text>
              <text x="${x + 14}" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">${this.escape(st.sub)}</text>
              ${i < 4 ? `<line x1="${x + 235}" y1="155" x2="${x + 253}" y2="155" stroke="${C.blue_accent}" stroke-width="2.5" marker-end="url(#arr-blu)" />` : ''}
            `;
          }).join("")}
        </g>

        <!-- Middle: 3-Way Match Core Engine & Exception Flow -->
        <g class="anim-grp anim-p3">
          <rect x="40" y="250" width="790" height="340" rx="10" fill="${C.card_bg}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="8 5" />
          <rect x="56" y="240" width="220" height="22" rx="4" fill="${C.amber_accent}" />
          <text x="166" y="255" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SAP 3-WAY MATCHING PIPELINE</text>

          <!-- 3 Inbound Match Pillars -->
          <g transform="translate(68, 280)">
            <rect x="0" y="0" width="220" height="100" rx="6" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" />
            <text x="14" y="26" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.blue_accent}">Purchase Order (PO)</text>
            <text x="14" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">Contract terms, unit pricing,</text>
            <text x="14" y="60" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">delivery schedules &amp; entity code.</text>
          </g>
          <g transform="translate(325, 280)">
            <rect x="0" y="0" width="220" height="100" rx="6" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" />
            <text x="14" y="26" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.teal_accent}">Goods Receipt (GR)</text>
            <text x="14" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">Physical barcode scan,</text>
            <text x="14" y="60" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">accepted quantity &amp; warehouse stamp.</text>
          </g>
          <g transform="translate(582, 280)">
            <rect x="0" y="0" width="220" height="100" rx="6" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" />
            <text x="14" y="26" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.rose_accent}">Vendor Invoice (IR)</text>
            <text x="14" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">OCR extracted tax, currency,</text>
            <text x="14" y="60" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">IBAN bank details &amp; line items.</text>
          </g>

          <!-- Arrows converging into Match Decision -->
          <line x1="178" y1="380" x2="435" y2="420" stroke="${C.blue_accent}" stroke-width="2" />
          <line x1="435" y1="380" x2="435" y2="420" stroke="${C.teal_accent}" stroke-width="2" />
          <line x1="692" y1="380" x2="435" y2="420" stroke="${C.rose_accent}" stroke-width="2" />

          <!-- Decision Diamond / Card -->
          <g transform="translate(240, 420)">
            <rect x="0" y="0" width="390" height="70" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1.5" />
            <circle cx="36" cy="35" r="20" fill="${C.amber_bg}" />
            <image href="emotes/gear.gif" x="20" y="19" width="32" height="32" />
            <text x="70" y="28" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.amber_accent}">3-Way Matching Algorithm</text>
            <text x="70" y="48" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_secondary}">Automated line tolerance tolerance check within +/- 1.5% delta.</text>
          </g>

          <g transform="translate(68, 510)">
            <rect x="0" y="0" width="734" height="60" rx="6" fill="${C.rose_bg}" stroke="${C.rose_border}" stroke-width="1" />
            <text x="20" y="26" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.rose_accent}">EXCEPTION TRACK: ${this.escape(ef.title)}</text>
            <text x="20" y="46" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_secondary}">Trigger: ${this.escape(ef.trigger)} • Resolution: ${this.escape(ef.resolution)}</text>
          </g>
        </g>

        <!-- Right Side: Vendor Scorecard -->
        <g class="anim-grp anim-p4">
          <rect x="850" y="250" width="443" height="340" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <rect x="870" y="270" width="180" height="24" rx="4" fill="${C.teal_accent}" />
          <text x="960" y="286" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">VENDOR RISK SCORECARD</text>

          <g transform="translate(870, 316)">
            <text x="0" y="20" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">On-Time Delivery Rate</text>
            <text x="360" y="20" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.teal_accent}" text-anchor="end">${this.escape(sc.on_time_delivery || '98.2%')}</text>
            <rect x="0" y="32" width="360" height="8" rx="4" fill="${C.blue_bg}" />
            <rect x="0" y="32" width="350" height="8" rx="4" fill="${C.teal_accent}" />
          </g>

          <g transform="translate(870, 396)">
            <text x="0" y="20" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">Invoice 3-Way Match Accuracy</text>
            <text x="360" y="20" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.blue_accent}" text-anchor="end">${this.escape(sc.match_accuracy || '99.1%')}</text>
            <rect x="0" y="32" width="360" height="8" rx="4" fill="${C.blue_bg}" />
            <rect x="0" y="32" width="354" height="8" rx="4" fill="${C.blue_accent}" />
          </g>

          <g transform="translate(870, 476)">
            <text x="0" y="20" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">Touchless Straight-Through Settlement</text>
            <text x="360" y="20" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.amber_accent}" text-anchor="end">${this.escape(sc.touchless_rate || '91.4%')}</text>
            <rect x="0" y="32" width="360" height="8" rx="4" fill="${C.blue_bg}" />
            <rect x="0" y="32" width="329" height="8" rx="4" fill="${C.amber_accent}" />
          </g>
        </g>

        <!-- Bottom Banner -->
        <g class="anim-grp anim-p4">
          <rect x="40" y="610" width="1253" height="105" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="640" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}">GLOBAL SUPPLY CHAIN PROCUREMENT KPI BENCHMARKS</text>
          <text x="64" y="682" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.teal_accent}">€1.2B+</text>
          <text x="180" y="675" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Annual Spend Processed</text>
          <text x="500" y="682" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.blue_accent}">100%</text>
          <text x="590" y="675" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Electronic Invoicing Compliance</text>
          <text x="890" y="682" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.amber_accent}">-4.5d</text>
          <text x="980" y="675" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Faster Vendor Payment Velocity</text>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 8: ITIL SERVICE MANAGEMENT & INCIDENT RESOLUTION
  // ══════════════════════════════════════════════════════════════════════════
  renderITService(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const tiers = data.tiers || [];
    const mim = data.major_incident || {};
    const slas = data.slas || [];
    const paletteKey = data.palette || "obsidian_dark";
    const C = PALETTES[paletteKey] || PALETTES.obsidian_dark;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- 4 ITIL Tier Columns (Left) -->
        <g class="anim-grp anim-p2">
          ${tiers.map((t, i) => {
            const x = 40 + i * 215;
            return `
              <rect x="${x}" y="80" width="200" height="490" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="${x + 14}" y="95" width="45" height="26" rx="4" fill="${C.blue_accent}" />
              <text x="${x + 36}" y="113" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(t.level)}</text>
              <circle cx="${x + 155}" cy="115" r="22" fill="${C.blue_bg}" />
              <image href="emotes/${t.emote || 'ticket'}.gif" x="${x + 135}" y="95" width="40" height="40" />

              <text x="${x + 14}" y="160" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(t.name)}</text>
              <text x="${x + 14}" y="185" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">${this.escape(t.desc)}</text>

              <rect x="${x + 14}" y="490" width="172" height="45" rx="6" fill="${C.blue_bg}" />
              <text x="${x + 100}" y="518" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.blue_accent}" text-anchor="middle">SLA: ${this.escape(t.sla)}</text>
            `;
          }).join("")}
        </g>

        <!-- Right Side: Major Incident Management & SLA Table -->
        <g class="anim-grp anim-p3">
          <!-- Major Incident Card -->
          <g transform="translate(915, 80)">
            <rect x="0" y="0" width="378" height="230" rx="8" fill="${C.card_bg}" stroke="${C.red_border}" stroke-width="1.5" />
            <rect x="16" y="16" width="170" height="24" rx="4" fill="${C.red_accent}" />
            <text x="101" y="32" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MAJOR INCIDENT MGMT</text>
            <circle cx="330" cy="35" r="20" fill="${C.red_bg}" />
            <image href="emotes/warning.gif" x="314" y="19" width="32" height="32" />

            <text x="16" y="68" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="14" font-weight="bold" fill="${C.red_accent}">${this.escape(mim.title)}</text>
            <text x="16" y="92" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="${C.text_primary}">Trigger: ${this.escape(mim.trigger)}</text>
            <text x="16" y="116" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">${this.escape(mim.actions)}</text>

            <rect x="16" y="160" width="346" height="45" rx="6" fill="${C.red_bg}" />
            <text x="189" y="188" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.red_accent}" text-anchor="middle">Executive Escalation: VP Global IT within 30 Minutes</text>
          </g>

          <!-- SLA Matrix Table -->
          <g transform="translate(915, 330)">
            <rect x="0" y="0" width="378" height="240" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
            <text x="16" y="32" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">SERVICE LEVEL AGREEMENTS (SLA)</text>

            ${slas.map((s, idx) => {
              const sy = 55 + idx * 56;
              return `
                <rect x="16" y="${sy}" width="346" height="46" rx="6" fill="${C.blue_bg}" />
                <text x="30" y="${sy + 22}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.blue_accent}">${this.escape(s.prio)}</text>
                <text x="30" y="${sy + 38}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">Response: ${this.escape(s.resp)}  •  Resolve: ${this.escape(s.res)}</text>
                <text x="345" y="${sy + 28}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="14" font-weight="bold" fill="${C.teal_accent}" text-anchor="end">${this.escape(s.uptime)}</text>
              `;
            }).join("")}
          </g>
        </g>

        <!-- Bottom Telemetry Banner -->
        <g class="anim-grp anim-p4">
          <rect x="40" y="590" width="1253" height="120" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="620" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}">PHILIPS HEALTHSUITE CLOUD TELEMETRY &amp; OPERATIONAL METRICS</text>
          <text x="64" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.teal_accent}">99.99%</text>
          <text x="195" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Platform Availability</text>
          <text x="490" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.blue_accent}">1.2 SEC</text>
          <text x="610" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Mean API Gateway Latency</text>
          <text x="890" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.amber_accent}">0 DEFECTS</text>
          <text x="1040" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Clinical Audit Security Breaches</text>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 9: 5x5 ENTERPRISE RISK & COMPLIANCE HEAT MAP
  // ══════════════════════════════════════════════════════════════════════════
  renderRiskCompliance(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const vectors = data.risk_vectors || [];
    const pillars = data.control_pillars || [];
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- Left 5x5 Matrix (Y: 80 to 570) -->
        <g class="anim-grp anim-p2">
          <rect x="40" y="80" width="700" height="490" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="60" y="112" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="14" font-weight="bold" fill="${C.text_primary}">5x5 ENTERPRISE RISK MATRIX (LIKELIHOOD x IMPACT)</text>

          <!-- Y-axis Label -->
          <text x="25" y="340" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}" transform="rotate(-90 25,340)" text-anchor="middle">LIKELIHOOD (1 TO 5)</text>

          <!-- 5x5 Grid Cells -->
          ${Array.from({ length: 5 }).map((_, r) => {
            return Array.from({ length: 5 }).map((__, c) => {
              const gx = 100 + c * 115;
              const gy = 130 + (4 - r) * 75;
              // Risk score warmth color: Green -> Amber -> Dark Coral -> Ruby (NO BLUE!)
              const score = (r + 1) * (c + 1);
              let cellColor = "#34D39918";
              if (score >= 15) cellColor = "#C42B2B28";
              else if (score >= 10) cellColor = "#E8734A25";
              else if (score >= 6) cellColor = "#E0A03020";

              return `
                <rect x="${gx}" y="${gy}" width="108" height="68" rx="4" fill="${cellColor}" stroke="${C.card_bd}" stroke-width="0.75" />
                <text x="${gx + 8}" y="${gy + 18}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">L${r+1}-I${c+1}</text>
              `;
            }).join("");
          }).join("")}

          <!-- X-axis Label -->
          <text x="390" y="545" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}" text-anchor="middle">IMPACT SEVERITY (1 TO 5)</text>

          <!-- Plotted Risk Vectors -->
          ${vectors.map(rv => {
            const vx = 100 + (rv.x - 1) * 115 + 40;
            const vy = 130 + (5 - rv.y) * 75 + 25;
            return `
              <g transform="translate(${vx}, ${vy})" cursor="pointer">
                <circle cx="16" cy="16" r="16" fill="${C.red_accent}" />
                <text x="16" y="21" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${rv.id}</text>
                <circle cx="36" cy="4" r="12" fill="${C.card_bg}" />
                <image href="emotes/${rv.emote || 'shield'}.gif" x="26" y="-6" width="20" height="20" />
              </g>
            `;
          }).join("")}
        </g>

        <!-- Right Side: SOX Control Pillars & KRI Status -->
        <g class="anim-grp anim-p3">
          <rect x="760" y="80" width="533" height="490" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <rect x="780" y="100" width="200" height="24" rx="4" fill="${C.blue_accent}" />
          <text x="880" y="116" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SOX CONTROL FRAMEWORK</text>

          ${pillars.map((cp, idx) => {
            const py = 145 + idx * 105;
            return `
              <g transform="translate(780, ${py})">
                <rect x="0" y="0" width="493" height="90" rx="6" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" />
                <circle cx="30" cy="45" r="22" fill="${C.card_bg}" />
                <image href="emotes/${cp.emote || 'shield'}.gif" x="12" y="27" width="36" height="36" />
                <text x="64" y="32" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(cp.name)}</text>
                <text x="64" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">${this.escape(cp.desc)}</text>
                <rect x="400" y="25" width="75" height="26" rx="4" fill="${C.teal_accent}" />
                <text x="437" y="42" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(cp.pass)} PASS</text>
              </g>
            `;
          }).join("")}

          <rect x="780" y="475" width="493" height="75" rx="6" fill="${C.amber_bg}" stroke="${C.amber_border}" stroke-width="1" />
          <text x="800" y="505" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.5" font-weight="bold" fill="${C.amber_accent}">Continuous Key Risk Indicator (KRI) Monitoring</text>
          <text x="800" y="525" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_secondary}">All 5 critical risk vectors reviewed bi-weekly with Group Audit Committee.</text>
        </g>

        <!-- Bottom Banner -->
        <g class="anim-grp anim-p4">
          <rect x="40" y="590" width="1253" height="120" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="620" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}">REGULATORY &amp; COMPLIANCE CERTIFICATION HEALTH</text>
          <text x="64" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.teal_accent}">100%</text>
          <text x="160" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">SOX 404 Testing Pass Rate</text>
          <text x="450" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.blue_accent}">0 MATERIAL</text>
          <text x="630" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Weaknesses Reported (FY26)</text>
          <text x="880" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.amber_accent}">48 ENTITIES</text>
          <text x="1060" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Global Bilateral Compliance</text>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 10: CUSTOMER & CLINICAL JOURNEY MAP
  // ══════════════════════════════════════════════════════════════════════════
  renderCustomerJourney(data) {
    const b = data.branding || {};
    const h = data.header || {};
    const stages = data.stages || [];
    const kpis = data.kpis || [];
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- 6 Journey Columns (Left to Right) -->
        <g class="anim-grp anim-p2">
          ${stages.map((st, i) => {
            const x = 40 + i * 210;
            return `
              <rect x="${x}" y="80" width="198" height="480" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
              <rect x="${x + 12}" y="95" width="100" height="22" rx="4" fill="${C.blue_accent}" />
              <text x="${x + 62}" y="110" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(st.phase)}</text>
              <circle cx="${x + 160}" cy="115" r="20" fill="${C.blue_bg}" />
              <image href="emotes/${st.emote || 'user'}.gif" x="${x + 142}" y="97" width="36" height="36" />

              <text x="${x + 12}" y="152" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(st.title)}</text>
              <text x="${x + 12}" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">${this.escape(st.action)}</text>

              <rect x="${x + 12}" y="495" width="174" height="45" rx="6" fill="${C.blue_bg}" />
              <text x="${x + 99}" y="522" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.teal_accent}" text-anchor="middle">${this.escape(st.score)}</text>
            `;
          }).join("")}
        </g>

        <!-- NPS Emotion Flow Curve Overlay spanning across columns -->
        <g class="anim-grp anim-p3">
          <path d="M 140 380 Q 350 330, 560 360 T 980 300 T 1200 280" fill="none" stroke="${C.amber_accent}" stroke-width="4" />
          ${stages.map((st, i) => {
            const cx = 140 + i * 210;
            const cy = 380 - (i * 18) + (i % 2 === 0 ? 10 : -10);
            return `
              <circle cx="${cx}" cy="${cy}" r="9" fill="${C.amber_accent}" stroke="#FFFFFF" stroke-width="2" />
            `;
          }).join("")}
        </g>

        <!-- Bottom KPI Banner -->
        <g class="anim-grp anim-p4">
          <rect x="40" y="580" width="1253" height="130" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="612" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}">CLINICAL SATISFACTION &amp; LIFECYCLE VALUE METRICS</text>
          ${kpis.map((k, idx) => {
            const kx = 64 + idx * 400;
            return `
              <text x="${kx}" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="32" font-weight="bold" fill="${C.blue_accent}">${this.escape(k.val)}</text>
              <text x="${kx + 140}" y="650" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">${this.escape(k.label)}</text>
              <text x="${kx + 140}" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_muted}">${this.escape(k.sub)}</text>
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
