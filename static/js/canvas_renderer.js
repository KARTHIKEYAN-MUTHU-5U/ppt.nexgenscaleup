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

  resolveEmote(emoteId) {
    if (window.getEmoteUrl) return window.getEmoteUrl(emoteId);
    if (!emoteId) return "emotes/spec.gif";
    if (emoteId.includes(".")) return `emotes/${emoteId}`;
    if (emoteId.startsWith("m_") || emoteId.startsWith("icon_") || emoteId.startsWith("badge_")) return `emotes/${emoteId}.png`;
    return `emotes/${emoteId}.gif`;
  }

  resolvePalette(paletteKey) {
    if (typeof PALETTES !== "undefined" && PALETTES[paletteKey]) {
      return PALETTES[paletteKey];
    }
    return (typeof PALETTES !== "undefined" && PALETTES.executive_blueprint) ? PALETTES.executive_blueprint : {
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
      case "change_mgmt":
        svgContent = this.renderChangeMgmt(data);
        break;
      case "swot_analysis":
        svgContent = this.renderSwotAnalysis(data);
        break;
      case "project_timeline":
        svgContent = this.renderProjectTimeline(data);
        break;
      case "org_chart":
        svgContent = this.renderOrgChart(data);
        break;
      case "budget_waterfall":
        svgContent = this.renderBudgetWaterfall(data);
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
    // Support flexible signature: renderHeader(data, C) or renderHeader(h, b, C, paletteKey)
    if (h && (h.header || h.branding || h.template_id)) {
      const dataObj = h;
      h = dataObj.header || {};
      b = dataObj.branding || {};
      if (!C) C = this.resolvePalette(dataObj.palette);
      if (!paletteKey) paletteKey = dataObj.palette;
    }
    h = h || {};
    b = b || {};
    C = C || this.resolvePalette(paletteKey);
    const logoSrc = `logos/${b.logo_key || "philips"}.png`;
    return `
      <g class="anim-grp anim-p1">
        <rect x="0" y="0" width="1333" height="62" fill="${C.hdr_bg}" />
        <rect x="0" y="62" width="1333" height="3" fill="${C.stripe}" />
        <text x="40" y="34" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="25" font-weight="bold" fill="#FFFFFF">${this.escapeXml(h.title || "EXECUTIVE ARCHITECTURE BLUEPRINT")}</text>
        <text x="40" y="52" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.8" font-weight="normal" fill="${paletteKey === 'obsidian_dark' ? '#A3A3A3' : '#B0AFAF'}">${this.escapeXml(h.subtitle || "PHILIPS  •  EXECUTIVE OPERATIONS")}</text>
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

  escapeXml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  escape(str) {
    return this.escapeXml(str);
  }

  wrapText(text, maxChars = 40) {
    if (!text) return [""];
    const words = String(text).split(/\s+/);
    const lines = [];
    let currentLine = "";
    words.forEach(w => {
      if ((currentLine + " " + w).trim().length <= maxChars) {
        currentLine = (currentLine + " " + w).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = w;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : [""];
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 11: CHANGE MANAGEMENT & ADKAR TRANSFORMATION
  // ══════════════════════════════════════════════════════════════════════════
  renderChangeMgmt(data) {
    const C = this.resolvePalette(data.palette);
    const phases = data.phases || [];
    const workstreams = data.workstreams || [];
    const gov = data.governance || {};

    let phasesHtml = "";
    phases.forEach((p, idx) => {
      const x = 40 + idx * 252;
      const isComplete = p.status === "COMPLETE";
      const badgeBg = isComplete ? C.teal_accent : C.amber_accent;
      phasesHtml += `
        <g class="anim-node anim-p1 interactive-card" data-node-id="phases.${idx}" transform="translate(${x}, 72)">
          <rect width="244" height="42" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="4" height="42" rx="2" fill="${badgeBg}"/>
          <rect x="10" y="8" width="34" height="26" rx="4" fill="${badgeBg}" fill-opacity="0.15"/>
          <text x="27" y="24" text-anchor="middle" fill="${badgeBg}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">0${idx+1}</text>
          <text x="52" y="21" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">${this.escapeXml(p.title)}</text>
          <text x="52" y="33" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9">${this.escapeXml(p.sub)}</text>
          <image href="${this.resolveEmote(p.emote)}" x="208" y="10" width="22" height="22"/>
          ${idx < 4 ? `<path d="M 248 21 L 252 21" stroke="${C.dashed_border}" stroke-width="2"/>` : ""}
        </g>
      `;
    });

    let wsHtml = "";
    workstreams.forEach((ws, wIdx) => {
      const y = 126 + wIdx * 158;
      let initsHtml = "";
      (ws.initiatives || []).forEach((init, iIdx) => {
        const ix = 320 + iIdx * 480;
        initsHtml += `
          <g class="interactive-card" data-node-id="workstreams.${wIdx}.initiatives.${iIdx}" transform="translate(${ix}, ${y})">
            <rect width="460" height="142" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
            <rect width="5" height="142" rx="2" fill="${C.stripe}"/>
            <text x="18" y="26" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700">${this.escapeXml(init.title)}</text>
            <rect x="340" y="12" width="104" height="20" rx="4" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1"/>
            <text x="392" y="26" text-anchor="middle" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="9" font-weight="600">${this.escapeXml(init.owner)}</text>
            <text x="18" y="52" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="11" width="424">
              ${this.wrapText(init.desc, 58).map((line, lIdx) => `<tspan x="18" dy="${lIdx === 0 ? 0 : 16}">${this.escapeXml(line)}</tspan>`).join("")}
            </text>
          </g>
        `;
      });

      wsHtml += `
        <g class="anim-node anim-p2" transform="translate(40, ${y})">
          <rect width="260" height="142" rx="8" fill="${C.hdr_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="6" height="142" rx="2" fill="${C.stripe}"/>
          <image href="${this.resolveEmote(ws.emote)}" x="18" y="16" width="34" height="34"/>
          <text x="60" y="32" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">${this.escapeXml(ws.lane)}</text>
          <text x="18" y="72" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10">CROSS-FUNCTIONAL WORKSTREAM</text>
          <text x="18" y="92" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="10">Adoption & Governance Lead</text>
          <path d="M 300 71 L 320 71" stroke="${C.stripe}" stroke-width="2" marker-end="url(#arrow-head)"/>
        </g>
        ${initsHtml}
      `;
    });

    return `
      <svg viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect width="1333" height="750" fill="${C.canvas_bg}"/>
        ${this.renderHeader(data, C)}
        ${phasesHtml}
        ${wsHtml}
        <!-- Bottom Governance Metrics Bar -->
        <g class="anim-node anim-p5" transform="translate(40, 616)">
          <rect width="1253" height="98" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="6" height="98" rx="2" fill="${C.teal_accent}"/>
          
          <g transform="translate(30, 20)">
            <text x="0" y="14" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">READINESS INDEX</text>
            <text x="0" y="44" fill="${C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="800">${this.escapeXml(gov.readiness_score || "88.4%")}</text>
            <text x="0" y="62" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="10">Target: > 85%</text>
          </g>
          <line x1="280" y1="16" x2="280" y2="82" stroke="${C.dashed_border}" stroke-width="1"/>
          <g transform="translate(320, 20)">
            <text x="0" y="14" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">STAFF CERTIFIED</text>
            <text x="0" y="44" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="800">${this.escapeXml(gov.trained_staff || "1,420 / 1,600")}</text>
            <text x="0" y="62" fill="${C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="10">88.8% Coverage</text>
          </g>
          <line x1="600" y1="16" x2="600" y2="82" stroke="${C.dashed_border}" stroke-width="1"/>
          <g transform="translate(640, 20)">
            <text x="0" y="14" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">ACTIVE SUPERUSERS</text>
            <text x="0" y="44" fill="${C.amber_accent}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="800">${this.escapeXml(gov.superusers_active || "64 Leads")}</text>
            <text x="0" y="62" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="10">Deployed Across 48 Entities</text>
          </g>
          <line x1="920" y1="16" x2="920" y2="82" stroke="${C.dashed_border}" stroke-width="1"/>
          <g transform="translate(960, 20)">
            <text x="0" y="14" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">USER SENTIMENT</text>
            <text x="0" y="44" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="800">${this.escapeXml(gov.sentiment_index || "+74 NPS")}</text>
            <text x="0" y="62" fill="${C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="10">Top Decile Adoption</text>
          </g>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 12: STRATEGIC SWOT MATRIX & CAPABILITY GRID
  // ══════════════════════════════════════════════════════════════════════════
  renderSwotAnalysis(data) {
    const C = this.resolvePalette(data.palette);
    const quads = data.quadrants || {};
    const sum = data.strategic_summary || {};

    const renderQuadrant = (qData, x, y, accentColor) => {
      let itemsHtml = "";
      (qData.items || []).forEach((item, idx) => {
        const iy = 56 + idx * 78;
        itemsHtml += `
          <g class="interactive-card" data-node-id="quadrant.item.${item.code}" transform="translate(14, ${iy})">
            <rect width="588" height="68" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
            <rect width="4" height="68" rx="2" fill="${accentColor}"/>
            <rect x="14" y="12" width="28" height="18" rx="4" fill="${accentColor}" fill-opacity="0.15"/>
            <text x="28" y="25" text-anchor="middle" fill="${accentColor}" font-family="Segoe UI, sans-serif" font-size="9" font-weight="700">${this.escapeXml(item.code)}</text>
            <text x="50" y="24" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">${this.escapeXml(item.title)}</text>
            <rect x="520" y="10" width="54" height="18" rx="4" fill="${item.impact === 'HIGH' || item.impact === 'CRITICAL' ? C.rose_bg : C.blue_bg}"/>
            <text x="547" y="22" text-anchor="middle" fill="${item.impact === 'HIGH' || item.impact === 'CRITICAL' ? C.rose_accent : C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="8" font-weight="700">${this.escapeXml(item.impact)}</text>
            <text x="14" y="48" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="10">${this.escapeXml(item.desc)}</text>
          </g>
        `;
      });

      return `
        <g transform="translate(${x}, ${y})">
          <rect width="616" height="300" rx="8" fill="${C.blue_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="616" height="42" rx="8" fill="${C.hdr_bg}"/>
          <rect y="38" width="616" height="4" fill="${accentColor}"/>
          <text x="20" y="26" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700">${this.escapeXml(qData.title || "")}</text>
          <rect x="490" y="10" width="80" height="22" rx="4" fill="${accentColor}"/>
          <text x="530" y="25" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="9" font-weight="700">${this.escapeXml(qData.tag || "")}</text>
          <image href="${this.resolveEmote(qData.emote)}" x="580" y="10" width="22" height="22"/>
          ${itemsHtml}
        </g>
      `;
    };

    return `
      <svg viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect width="1333" height="750" fill="${C.canvas_bg}"/>
        ${this.renderHeader(data, C)}
        <!-- 2x2 SWOT Matrix -->
        <g class="anim-node anim-p1">
          ${renderQuadrant(quads.strengths || {}, 40, 72, "#10B981")}
          ${renderQuadrant(quads.weaknesses || {}, 676, 72, "#F59E0B")}
          ${renderQuadrant(quads.opportunities || {}, 40, 386, "#E8734A")}
          ${renderQuadrant(quads.threats || {}, 676, 386, "#EF4444")}
        </g>
        <!-- Bottom Strategic Summary Bar -->
        <g class="anim-node anim-p5" transform="translate(40, 698)">
          <rect width="1252" height="42" rx="6" fill="${C.hdr_bg}" stroke="${C.card_bd}" stroke-width="1"/>
          <text x="20" y="26" fill="${C.stripe}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">EXECUTIVE STRATEGIC VERDICT:</text>
          <text x="220" y="26" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="10">${this.escapeXml(sum.core_verdict || "")}</text>
          <text x="1100" y="26" text-anchor="end" fill="${C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">${this.escapeXml(sum.priority_focus || "")}</text>
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 13: PROJECT GANTT TIMELINE & DELIVERY MILESTONES
  // ══════════════════════════════════════════════════════════════════════════
  renderProjectTimeline(data) {
    const C = this.resolvePalette(data.palette);
    const quarters = data.quarters || [];
    const lanes = data.lanes || [];
    const milestones = data.milestones || [];

    // Header quarters
    let qHtml = "";
    quarters.forEach((q, idx) => {
      const x = 320 + idx * 240;
      qHtml += `
        <g transform="translate(${x}, 72)">
          <rect width="234" height="48" rx="6" fill="${q.highlight ? C.blue_bg : C.card_bg}" stroke="${q.highlight ? C.stripe : C.card_bd}" stroke-width="${q.highlight ? 1.5 : 1}" filter="url(#shadow-card)"/>
          <text x="18" y="22" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700">${this.escapeXml(q.qtr)}</text>
          <text x="18" y="38" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10">${this.escapeXml(q.months)}</text>
          <rect x="154" y="14" width="70" height="20" rx="4" fill="${q.status === 'COMPLETE' ? C.teal_accent : (q.status === 'IN PROGRESS' ? C.stripe : C.card_bd)}"/>
          <text x="189" y="28" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="8" font-weight="700">${this.escapeXml(q.status)}</text>
        </g>
      `;
    });

    // Gantt Lanes
    let lanesHtml = "";
    lanes.forEach((lane, lIdx) => {
      const y = 132 + lIdx * 118;
      let barsHtml = "";
      (lane.bars || []).forEach((bar, bIdx) => {
        const bx = 320 + bar.start * 960;
        const bw = bar.span * 960;
        const by = 16 + bIdx * 46;
        barsHtml += `
          <g class="interactive-card" data-node-id="lanes.${lIdx}.bars.${bIdx}" transform="translate(${bx}, ${by})">
            <rect width="${bw}" height="38" rx="6" fill="${bar.color || C.stripe}" filter="url(#shadow-card)"/>
            <text x="14" y="23" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">${this.escapeXml(bar.title)}</text>
            <rect x="${bw - 54}" y="9" width="44" height="20" rx="4" fill="rgba(0,0,0,0.25)"/>
            <text x="${bw - 32}" y="23" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="9" font-weight="600">${this.escapeXml(bar.status)}</text>
          </g>
        `;
      });

      lanesHtml += `
        <g class="anim-node anim-p2" transform="translate(40, ${y})">
          <rect width="268" height="106" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="5" height="106" rx="2" fill="${C.stripe}"/>
          <image href="${this.resolveEmote(lane.emote)}" x="16" y="16" width="30" height="30"/>
          <text x="54" y="32" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">${this.escapeXml(lane.name)}</text>
          <text x="54" y="48" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9">Delivery Stream Phase</text>
          
          <!-- Background Gantt grid line -->
          <rect x="280" y="0" width="960" height="106" rx="8" fill="${C.card_bg}" fill-opacity="0.5" stroke="${C.card_bd}" stroke-width="1" stroke-dasharray="4 4"/>
          ${barsHtml}
        </g>
      `;
    });

    // Milestone Diamonds
    let mHtml = "";
    milestones.forEach((m, idx) => {
      const mx = 360 + m.pos * 900;
      mHtml += `
        <g class="anim-node anim-p4 interactive-card" data-node-id="milestones.${idx}" transform="translate(${mx}, 620)">
          <path d="M 0 0 L 14 14 L 0 28 L -14 14 Z" fill="${m.rag === 'green' ? C.teal_accent : C.amber_accent}" filter="url(#shadow-card)"/>
          <line x1="0" y1="-480" x2="0" y2="0" stroke="${m.rag === 'green' ? C.teal_accent : C.amber_accent}" stroke-width="1.5" stroke-dasharray="3 3"/>
          <rect x="-70" y="34" width="140" height="48" rx="6" fill="${C.hdr_bg}" filter="url(#shadow-card)"/>
          <text x="0" y="52" text-anchor="middle" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">${this.escapeXml(m.title)}</text>
          <text x="0" y="68" text-anchor="middle" fill="${C.stripe}" font-family="Segoe UI, sans-serif" font-size="9">${this.escapeXml(m.date)}</text>
        </g>
      `;
    });

    return `
      <svg viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect width="1333" height="750" fill="${C.canvas_bg}"/>
        ${this.renderHeader(data, C)}
        <!-- Timeline Lane 1 Header -->
        <g class="anim-node anim-p1">
          <rect x="40" y="72" width="268" height="48" rx="6" fill="${C.hdr_bg}" filter="url(#shadow-card)"/>
          <text x="24" y="100" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700">EXECUTION WORKSTREAM</text>
          ${qHtml}
        </g>
        ${lanesHtml}
        ${mHtml}
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 14: EXECUTIVE ORGANIZATION HIERARCHY
  // ══════════════════════════════════════════════════════════════════════════
  renderOrgChart(data) {
    const C = this.resolvePalette(data.palette);
    const leader = data.leader || {};
    const divisions = data.divisions || [];
    const kpis = data.summary_kpis || [];

    // Leader Box
    const leaderHtml = `
      <g class="anim-node anim-p1 interactive-card" data-node-id="leader" transform="translate(466, 76)">
        <rect width="400" height="92" rx="8" fill="${C.hdr_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
        <rect width="6" height="92" rx="2" fill="${C.stripe}"/>
        <image href="${this.resolveEmote(leader.emote)}" x="20" y="18" width="44" height="44"/>
        <text x="76" y="32" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="800">${this.escapeXml(leader.role)}</text>
        <text x="76" y="50" fill="${C.stripe}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="600">${this.escapeXml(leader.name)}</text>
        <text x="76" y="68" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9">${this.escapeXml(leader.mandate)}</text>
      </g>
      <!-- Trunk Line Down -->
      <line x1="666" y1="168" x2="666" y2="200" stroke="${C.stripe}" stroke-width="2"/>
      <!-- Cross Bar Across 3 Divisions -->
      <line x1="240" y1="200" x2="1092" y2="200" stroke="${C.stripe}" stroke-width="2"/>
      <line x1="240" y1="200" x2="240" y2="220" stroke="${C.stripe}" stroke-width="2"/>
      <line x1="666" y1="200" x2="666" y2="220" stroke="${C.stripe}" stroke-width="2"/>
      <line x1="1092" y1="200" x2="1092" y2="220" stroke="${C.stripe}" stroke-width="2"/>
    `;

    // 3 VP Divisions
    let divHtml = "";
    divisions.forEach((div, idx) => {
      const dx = 40 + idx * 426;
      let teamsHtml = "";
      (div.teams || []).forEach((tm, tIdx) => {
        const ty = 370 + tIdx * 102;
        teamsHtml += `
          <g class="interactive-card" data-node-id="divisions.${idx}.teams.${tIdx}" transform="translate(${dx}, ${ty})">
            <line x1="200" y1="-20" x2="200" y2="0" stroke="${div.color || C.stripe}" stroke-width="1.5"/>
            <rect width="400" height="88" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
            <rect width="4" height="88" rx="2" fill="${div.color || C.stripe}"/>
            <image href="${this.resolveEmote(tm.emote)}" x="16" y="16" width="32" height="32"/>
            <text x="58" y="32" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700">${this.escapeXml(tm.name)}</text>
            <text x="58" y="50" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="10">${this.escapeXml(tm.lead)}</text>
            <rect x="290" y="14" width="94" height="20" rx="4" fill="${C.blue_bg}"/>
            <text x="337" y="28" text-anchor="middle" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="9" font-weight="600">${this.escapeXml(tm.hc)}</text>
          </g>
        `;
      });

      divHtml += `
        <g class="anim-node anim-p2" transform="translate(${dx}, 220)">
          <rect width="400" height="110" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="5" height="110" rx="2" fill="${div.color || C.stripe}"/>
          <image href="${this.resolveEmote(div.emote)}" x="16" y="16" width="36" height="36"/>
          <text x="60" y="32" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="12" font-weight="800">${this.escapeXml(div.title)}</text>
          <text x="60" y="50" fill="${div.color || C.stripe}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="600">${this.escapeXml(div.owner)}</text>
          <text x="16" y="76" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="9" width="368">
            ${this.wrapText(div.mandate, 54).map((line, lIdx) => `<tspan x="16" dy="${lIdx === 0 ? 0 : 13}">${this.escapeXml(line)}</tspan>`).join("")}
          </text>
          <rect x="290" y="14" width="94" height="20" rx="4" fill="${C.hdr_bg}"/>
          <text x="337" y="28" text-anchor="middle" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="9" font-weight="700">${this.escapeXml(div.hc)}</text>
          <!-- Line to Subteams -->
          <line x1="200" y1="110" x2="200" y2="150" stroke="${div.color || C.stripe}" stroke-width="1.5"/>
        </g>
        ${teamsHtml}
      `;
    });

    // Bottom KPIs
    let kpiHtml = "";
    kpis.forEach((k, idx) => {
      const kx = 40 + idx * 426;
      kpiHtml += `
        <g transform="translate(${kx}, 596)">
          <rect width="400" height="68" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="4" height="68" rx="2" fill="${C.teal_accent}"/>
          <text x="20" y="26" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">${this.escapeXml(k.label)}</text>
          <text x="20" y="52" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="20" font-weight="800">${this.escapeXml(k.val)}</text>
          <text x="200" y="52" fill="${C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="600">${this.escapeXml(k.sub)}</text>
        </g>
      `;
    });

    return `
      <svg viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect width="1333" height="750" fill="${C.canvas_bg}"/>
        ${this.renderHeader(data, C)}
        ${leaderHtml}
        ${divHtml}
        <g class="anim-node anim-p5">
          ${kpiHtml}
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE 15: FINANCIAL BUDGET WATERFALL & COST VARIANCE
  // ══════════════════════════════════════════════════════════════════════════
  renderBudgetWaterfall(data) {
    const C = this.resolvePalette(data.palette);
    const base = data.baseline || {};
    const drivers = data.drivers || [];
    const target = data.target || {};
    const scorecards = data.scorecards || [];

    // Waterfall columns calculation
    // Total 7 columns across 1253px: width 165px, gap 16px
    const colW = 162;
    const colGap = 16;
    const chartBottomY = 560;
    const chartTopY = 160;
    const chartH = chartBottomY - chartTopY; // 400px height for range 35M to 45M
    const scale = chartH / 12; // 1M = ~33.3px

    let runningVal = base.val || 42.8;
    const baseY = chartBottomY - (runningVal - 35) * scale;
    const baseH = chartBottomY - baseY;

    let barsHtml = `
      <!-- Base Bar -->
      <g class="anim-node anim-p1 interactive-card" data-node-id="baseline" transform="translate(40, ${baseY})">
        <rect width="${colW}" height="${baseH}" rx="6" fill="${C.hdr_bg}" filter="url(#shadow-card)"/>
        <text x="${colW/2}" y="-16" text-anchor="middle" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="800">${this.escapeXml(base.amount)}</text>
        <image href="${this.resolveEmote(base.emote)}" x="${colW/2 - 16}" y="16" width="32" height="32"/>
        <text x="${colW/2}" y="70" text-anchor="middle" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">FY25 BASELINE</text>
        <text x="${colW/2}" y="88" text-anchor="middle" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9">Prior Year Base</text>
      </g>
    `;

    drivers.forEach((drv, idx) => {
      const x = 40 + (idx + 1) * (colW + colGap);
      const isIncrease = drv.val > 0;
      const prevVal = runningVal;
      runningVal += drv.val;

      const topVal = Math.max(prevVal, runningVal);
      const botVal = Math.min(prevVal, runningVal);
      const barY = chartBottomY - (topVal - 35) * scale;
      const barH = Math.max(16, (topVal - botVal) * scale);
      const prevY = chartBottomY - (prevVal - 35) * scale;

      barsHtml += `
        <!-- Dashed connector from prev -->
        <line x1="${x - colGap}" y1="${prevY}" x2="${x}" y2="${prevY}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Driver Bar -->
        <g class="anim-node anim-p2 interactive-card" data-node-id="drivers.${idx}" transform="translate(${x}, ${barY})">
          <rect width="${colW}" height="${barH}" rx="6" fill="${drv.color || (isIncrease ? C.rose_accent : C.teal_accent)}" filter="url(#shadow-card)"/>
          <text x="${colW/2}" y="-12" text-anchor="middle" fill="${isIncrease ? C.rose_accent : C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="800">${this.escapeXml(drv.amount)}</text>
          <image href="${this.resolveEmote(drv.emote)}" x="${colW/2 - 12}" y="${Math.max(6, barH/2 - 12)}" width="24" height="24"/>
          <!-- Label below chart axis -->
          <g transform="translate(0, ${chartBottomY - barY + 14})">
            <rect width="${colW}" height="76" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
            <text x="${colW/2}" y="20" text-anchor="middle" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">${this.escapeXml(drv.title)}</text>
            <text x="${colW/2}" y="36" text-anchor="middle" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="8" width="${colW - 16}">
              ${this.wrapText(drv.desc, 24).slice(0, 2).map((line, lIdx) => `<tspan x="${colW/2}" dy="${lIdx === 0 ? 0 : 12}">${this.escapeXml(line)}</tspan>`).join("")}
            </text>
          </g>
        </g>
      `;
    });

    // Target Bar
    const targetX = 40 + 6 * (colW + colGap);
    const targetY = chartBottomY - (target.val - 35) * scale;
    const targetH = chartBottomY - targetY;
    barsHtml += `
      <line x1="${targetX - colGap}" y1="${targetY}" x2="${targetX}" y2="${targetY}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="3 3"/>
      <g class="anim-node anim-p3 interactive-card" data-node-id="target" transform="translate(${targetX}, ${targetY})">
        <rect width="${colW}" height="${targetH}" rx="6" fill="${C.stripe}" filter="url(#shadow-card)"/>
        <text x="${colW/2}" y="-16" text-anchor="middle" fill="${C.stripe}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="800">${this.escapeXml(target.amount)}</text>
        <image href="${this.resolveEmote(target.emote)}" x="${colW/2 - 16}" y="16" width="32" height="32"/>
        <text x="${colW/2}" y="70" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">FY26 TARGET</text>
        <text x="${colW/2}" y="88" text-anchor="middle" fill="#FFFFFF" fill-opacity="0.8" font-family="Segoe UI, sans-serif" font-size="9">${this.escapeXml(target.sub)}</text>
      </g>
    `;

    // Bottom Summary Scorecards
    let scHtml = "";
    scorecards.forEach((sc, idx) => {
      const scX = 40 + idx * 426;
      scHtml += `
        <g transform="translate(${scX}, 670)">
          <rect width="400" height="56" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="4" height="56" rx="2" fill="${C.teal_accent}"/>
          <image href="${this.resolveEmote(sc.emote)}" x="16" y="14" width="28" height="28"/>
          <text x="56" y="24" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9" font-weight="700">${this.escapeXml(sc.label)}</text>
          <text x="56" y="44" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="800">${this.escapeXml(sc.val)}</text>
          <text x="200" y="44" fill="${C.teal_accent}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="600">${this.escapeXml(sc.sub)}</text>
        </g>
      `;
    });

    return `
      <svg viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect width="1333" height="750" fill="${C.canvas_bg}"/>
        ${this.renderHeader(data, C)}
        <!-- Axis Line -->
        <line x1="40" y1="${chartBottomY}" x2="1292" y2="${chartBottomY}" stroke="${C.card_bd}" stroke-width="2"/>
        ${barsHtml}
        <g class="anim-node anim-p5">
          ${scHtml}
        </g>
      </svg>
    `;
  }
}
