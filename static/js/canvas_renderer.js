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

  escapeXml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  escape(str) {
    return this.escapeXml(str);
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
          <!-- Stage 1 Nodes -->
          <g data-stage="1">
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
          </g>

          <!-- Stage 2 Nodes -->
          <g data-stage="2">
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
        </g>

        <!-- 5. DECISION FORK CONNECTORS & ROOT CAUSES (Stage 3) -->
        <g class="anim-grp anim-p3" data-stage="3">
          <line x1="268" y1="540" x2="288" y2="540" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="288" y1="275" x2="288" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="288" y1="275" x2="302" y2="275" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="288" y1="500" x2="302" y2="500" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />
          <line x1="288" y1="654" x2="302" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />

          <!-- Root 1: Posting not found -->
          <g class="interactive-card" data-node-id="node_pnf" cursor="pointer">
            <rect x="308" y="220" width="178" height="110" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="320" y="244" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.text_primary}">${this.escape(df.root?.title || "Posting not found")}</text>
            <text x="320" y="260" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">${this.escape(df.root?.sub || "Kernel out of scope line")}</text>
            <circle cx="454" cy="275" r="22" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.root?.emote || 'pnf'}.gif" x="432" y="253" width="44" height="44" />
          </g>

          <!-- Root 2: AP-AR Sign Issue -->
          <g class="interactive-card" data-node-id="node_ap_ar" cursor="pointer">
            <rect x="308" y="446" width="194" height="108" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="320" y="468" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.amber_accent}">Investigate AP-AR sign issue</text>
            <text x="320" y="484" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">AR cleared, AP remains open (+/−)</text>
            <circle cx="470" cy="500" r="22" fill="${C.amber_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_2?.cause?.emote || 'ap_ar'}.gif" x="448" y="478" width="44" height="44" />
          </g>

          <!-- Root 3: Cash to allocated -->
          <g class="interactive-card" data-node-id="node_cash" cursor="pointer">
            <rect x="308" y="600" width="194" height="108" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="320" y="622" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.rose_accent}">Cash to allocated / AP paid</text>
            <text x="320" y="638" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">AR unapplied in reciprocal ERP</text>
            <circle cx="470" cy="654" r="22" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_3?.cause?.emote || 'cash'}.gif" x="448" y="632" width="44" height="44" />
          </g>
        </g>

        <!-- 6. TRACK ACTIONS & REMEDIATION (Stage 4) -->
        <g class="anim-grp anim-p4" data-stage="4">
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

          <!-- Track 2 Action: Review & Analyze -->
          <line x1="502" y1="500" x2="532" y2="500" stroke="${C.amber_accent}" stroke-width="2.78" marker-end="url(#arr-amb)" />
          <g class="interactive-card" data-node-id="node_review" cursor="pointer">
            <rect x="538" y="446" width="248" height="108" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="550" y="468" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.amber_accent}">Review &amp; Analyze Issue</text>
            <text x="550" y="484" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Investigate discrepancy; post clearing journal</text>
            <circle cx="754" cy="500" r="22" fill="${C.amber_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_2?.action?.emote || 'review'}.gif" x="732" y="478" width="44" height="44" />
          </g>

          <!-- Track 3 Action: Waiting for Counterparty -->
          <line x1="502" y1="654" x2="532" y2="654" stroke="${C.rose_accent}" stroke-width="2.78" marker-end="url(#arr-ros)" />
          <g class="interactive-card" data-node-id="node_waiting" cursor="pointer">
            <rect x="538" y="600" width="248" height="108" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="550" y="622" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11.1" font-weight="bold" fill="${C.rose_accent}">Waiting for Counterparty Action</text>
            <text x="550" y="638" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.3" fill="${C.text_muted}">Pending reciprocal entity ledger clearing</text>
            <circle cx="754" cy="654" r="22" fill="${C.rose_bg}" filter="url(#shadow-halo)" />
            <image href="emotes/${df.track_3?.action?.emote || 'waiting'}.gif" x="732" y="632" width="44" height="44" />
          </g>
        </g>

        <!-- 7. CONVERGENCE BUS & GOVERNANCE SLA (Stage 5) -->
        <g class="anim-grp anim-p5" data-stage="5">
          <!-- Convergence Bus lines -->
          <line x1="882" y1="203" x2="902" y2="203" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="882" y1="347" x2="902" y2="347" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="786" y1="500" x2="902" y2="500" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="786" y1="654" x2="902" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="902" y1="203" x2="902" y2="654" stroke="${C.purple_accent}" stroke-width="2.78" />
          <line x1="902" y1="212" x2="922" y2="212" stroke="${C.purple_accent}" stroke-width="2.78" marker-end="url(#arr-pur)" />

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

        <!-- ANIMATED FLOW TRACERS (DrawingML Pulsing Information Highway) -->
        <g class="flow-tracers-layer" pointer-events="none">
          <!-- Ingestion Column Vertical Flow -->
          <line x1="168" y1="187" x2="168" y2="615" class="flow-tracer-line" />
          <!-- Fork to Spine -->
          <path d="M 268 540 L 288 540 L 288 275 L 308 275" fill="none" class="flow-tracer-line" />
          <line x1="288" y1="500" x2="308" y2="500" class="flow-tracer-line" />
          <line x1="288" y1="654" x2="308" y2="654" class="flow-tracer-line" />
          <!-- Track 1 Sub-branches -->
          <path d="M 486 275 L 502 275 L 502 203 L 518 203" fill="none" class="flow-tracer-line" />
          <path d="M 502 275 L 502 347 L 518 347" fill="none" class="flow-tracer-line" />
          <line x1="666" y1="203" x2="692" y2="203" class="flow-tracer-line" />
          <line x1="666" y1="347" x2="692" y2="347" class="flow-tracer-line" />
          <!-- Track 2 & 3 -->
          <line x1="502" y1="500" x2="538" y2="500" class="flow-tracer-line" />
          <line x1="502" y1="654" x2="538" y2="654" class="flow-tracer-line" />
          <!-- Convergence to Governance -->
          <path d="M 882 203 L 902 203 L 902 212 L 928 212" fill="none" class="flow-tracer-line" />
          <path d="M 882 347 L 902 347 L 902 212" fill="none" class="flow-tracer-line" />
          <path d="M 786 500 L 902 500 L 902 212" fill="none" class="flow-tracer-line" />
          <path d="M 786 654 L 902 654 L 902 212" fill="none" class="flow-tracer-line" />
          <!-- Governance Vertical SLA Flow -->
          <line x1="1100" y1="212" x2="1100" y2="480" class="flow-tracer-line" />
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
            const stageId = i + 1;
            return `
              <g data-stage="${stageId}">
                <rect x="${x}" y="78" width="310" height="46" rx="6" fill="${C.card_bg}" stroke="${hz.color}" stroke-width="1.5" />
                <text x="${x + 14}" y="98" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${hz.color}">${this.escape(hz.title)}</text>
                <text x="${x + 14}" y="114" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">${this.escape(hz.sub)}</text>
              </g>
            `;
          }).join("")}
        </g>

        <!-- 4 Workstream Rows -->
        <g class="anim-grp anim-p2">
          ${workstreams.map((ws, i) => {
            const y = 138 + i * 118;
            return `
              <!-- Workstream Title Box -->
              <g data-stage="4">
                <rect x="40" y="${y}" width="260" height="106" rx="6" fill="${C.card_bg}" stroke="${C.blue_accent}" stroke-width="0.75" />
                <text x="54" y="${y + 36}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(ws.name)}</text>
                <circle cx="260" cy="${y + 53}" r="22" fill="${C.blue_bg}" />
                <image href="emotes/${ws.emote || 'tb_robot'}.gif" x="240" y="${y + 33}" width="40" height="40" />
              </g>

              <!-- Horizon 1 Milestone -->
              <g data-stage="1">
                <rect x="320" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
                <text x="334" y="${y + 30}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(ws.h1)}</text>
              </g>

              <!-- Horizon 2 Milestone -->
              <g data-stage="2">
                <rect x="644" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
                <text x="658" y="${y + 30}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(ws.h2)}</text>
              </g>

              <!-- Horizon 3 Milestone -->
              <g data-stage="3">
                <rect x="968" y="${y}" width="310" height="106" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" />
                <text x="982" y="${y + 30}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(ws.h3)}</text>
              </g>
            `;
          }).join("")}
        </g>

        <!-- Strategic ROI Metrics Bar (Bottom) -->
        <g class="anim-grp anim-p3" data-stage="5">
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

        <!-- Flow Tracer Connectors Across Horizons -->
        <g class="flow-tracers-layer" pointer-events="none">
          <line x1="630" y1="190" x2="644" y2="190" stroke="${C.blue_accent}" stroke-width="2" class="flow-tracer-line" />
          <line x1="954" y1="190" x2="968" y2="190" stroke="${C.purple_accent}" stroke-width="2" class="flow-tracer-line" />
          <line x1="630" y1="308" x2="644" y2="308" stroke="${C.blue_accent}" stroke-width="2" class="flow-tracer-line" />
          <line x1="954" y1="308" x2="968" y2="308" stroke="${C.purple_accent}" stroke-width="2" class="flow-tracer-line" />
          <line x1="630" y1="426" x2="644" y2="426" stroke="${C.blue_accent}" stroke-width="2" class="flow-tracer-line" />
          <line x1="954" y1="426" x2="968" y2="426" stroke="${C.purple_accent}" stroke-width="2" class="flow-tracer-line" />
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
            const stageId = i + 1;
            return `
              <g data-stage="${stageId}">
                <rect x="40" y="${y}" width="750" height="186" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <rect x="56" y="${y + 16}" width="220" height="26" rx="4" fill="${C.blue_accent}" />
                <text x="66" y="${y + 33}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF">${this.escape(t.level)}</text>
                <text x="56" y="${y + 70}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.text_primary}">${this.escape(t.title)}</text>
                <text x="56" y="${y + 95}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.5" font-weight="bold" fill="${C.amber_accent}">Leadership: ${this.escape(t.owner)}</text>
                <text x="56" y="${y + 122}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" fill="${C.text_secondary}">${this.escape(t.mandate)}</text>
                <circle cx="730" cy="${y + 90}" r="32" fill="${C.blue_bg}" />
                <image href="emotes/${t.emote || 'spec'}.gif" x="702" y="${y + 62}" width="56" height="56" />
              </g>
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
            const stageId = idx < 2 ? 4 : 5;
            return `
              <g data-stage="${stageId}">
                <rect x="840" y="${ry}" width="433" height="55" rx="6" fill="${C.blue_bg}" stroke="${C.card_bd}" stroke-width="0.5" />
                <text x="854" y="${ry + 22}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">${this.escape(r.activity)}</text>
                <text x="854" y="${ry + 42}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.amber_accent}">Tier 1: ${r.s}   •   Tier 2: ${r.c}   •   Tier 3: ${r.h}</text>
              </g>
            `;
          }).join("")}
        </g>

        <!-- Flow Tracer Connectors Between Tiers & RACI -->
        <g class="flow-tracers-layer" pointer-events="none">
          <line x1="415" y1="270" x2="415" y2="284" stroke="${C.blue_accent}" stroke-width="2.5" class="flow-tracer-line" />
          <line x1="415" y1="470" x2="415" y2="484" stroke="${C.teal_accent}" stroke-width="2.5" class="flow-tracer-line" />
          <line x1="790" y1="377" x2="820" y2="377" stroke="${C.amber_accent}" stroke-width="2" class="flow-tracer-line" />
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
            const stageId = i + 1;
            return `
              <g data-stage="${stageId}">
                <rect x="${x}" y="90" width="292" height="420" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <rect x="${x + 20}" y="112" width="48" height="32" rx="4" fill="${C.blue_accent}" />
                <text x="${x + 44}" y="133" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(st.num)}</text>
                <text x="${x + 20}" y="180" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="17" font-weight="bold" fill="${C.text_primary}">${this.escape(st.name)}</text>
                <text x="${x + 20}" y="215" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" fill="${C.text_muted}">${this.escape(st.tech)}</text>
                <circle cx="${x + 146}" cy="310" r="48" fill="${C.blue_bg}" />
                <image href="emotes/${st.emote || 'tb_robot'}.gif" x="${x + 106}" y="270" width="80" height="80" />
                <rect x="${x + 20}" y="430" width="252" height="42" rx="6" fill="${C.blue_bg}" />
                <text x="${x + 146}" y="456" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.blue_accent}" text-anchor="middle">${this.escape(st.sla)}</text>
              </g>
            `;
          }).join("")}
        </g>

        <!-- Bottom Security Guardrails -->
        <g class="anim-grp anim-p3" data-stage="5">
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

        <!-- Flow Tracer Connectors Across Stages -->
        <g class="flow-tracers-layer" pointer-events="none">
          <line x1="332" y1="300" x2="356" y2="300" stroke="${C.blue_accent}" stroke-width="2.5" class="flow-tracer-line" />
          <line x1="648" y1="300" x2="672" y2="300" stroke="${C.teal_accent}" stroke-width="2.5" class="flow-tracer-line" />
          <line x1="964" y1="300" x2="988" y2="300" stroke="${C.purple_accent}" stroke-width="2.5" class="flow-tracer-line" />
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
            const stageId = i < 2 ? 1 : 2;
            const ragColor = k.rag === "green" ? "#10B981" : (k.rag === "amber" ? "#F59E0B" : "#EF4444");
            return `
              <g data-stage="${stageId}">
                <rect x="${x}" y="86" width="292" height="190" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <rect x="${x}" y="86" width="6" height="190" fill="${ragColor}" />
                <text x="${x + 20}" y="118" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_muted}">${this.escape(k.label)}</text>
                <text x="${x + 20}" y="166" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="36" font-weight="bold" fill="${C.text_primary}">${this.escape(k.value)}</text>
                <rect x="${x + 20}" y="186" width="90" height="24" rx="4" fill="${ragColor}20" />
                <text x="${x + 65}" y="202" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${ragColor}" text-anchor="middle">${this.escape(k.delta)}</text>
                <text x="${x + 20}" y="244" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" fill="${C.text_muted}">${this.escape(k.note)}</text>
                <circle cx="${x + 242}" cy="130" r="26" fill="${C.blue_bg}" />
                <image href="emotes/${k.emote || 'tb_robot'}.gif" x="${x + 218}" y="106" width="48" height="48" />
              </g>
            `;
          }).join("")}
        </g>

        <!-- Bottom 3 Strategic Pillars -->
        <g class="anim-grp anim-p3">
          ${pillars.map((p, i) => {
            const y = 300 + i * 134;
            const stageId = 3 + i;
            return `
              <g data-stage="${stageId}">
                <rect x="40" y="${y}" width="1253" height="114" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <text x="64" y="${y + 40}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="${C.text_primary}">${this.escape(p.name)}</text>
                <text x="64" y="${y + 76}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" fill="${C.text_muted}">${this.escape(p.detail)}</text>
                <rect x="1100" y="${y + 36}" width="150" height="44" rx="6" fill="${C.blue_bg}" />
                <text x="1175" y="${y + 65}" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="20" font-weight="bold" fill="${C.blue_accent}" text-anchor="middle">${this.escape(p.score)}</text>
              </g>
            `;
          }).join("")}
        </g>

        <g class="flow-tracers-layer" pointer-events="none">
          <line x1="40" y1="288" x2="1293" y2="288" stroke="${C.blue_accent}" stroke-width="2" class="flow-tracer-line" />
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
    const paletteKey = data.palette || "executive_blueprint";
    const C = PALETTES[paletteKey] || PALETTES.executive_blueprint;

    const phases = data.phases || [
      { num: "01", title: "SUB-LEDGER CUTOFF", sub: "WD -2 to WD 0: Sub-Ledger Close & Freeze", emote: "calc", badge_color: C.blue_accent },
      { num: "02", title: "BILATERAL MATCHING", sub: "WD +1 to WD +2: Rule-Based Pairing Engine", emote: "currency", badge_color: C.amber_accent },
      { num: "03", title: "CONSOLIDATION & ELIMS", sub: "WD +3 to WD +4: Group Elimination Postings", emote: "ledger", badge_color: C.teal_accent },
      { num: "04", title: "CLOSE THE LOOP", sub: "WD +5 Close: CFO Sign-Off & Release", emote: "stamp", badge_color: C.rose_accent }
    ];

    const rx = [40, 340, 710, 1010];
    const rw = [270, 340, 270, 283];
    const rColors = [C.blue_accent, C.amber_accent, C.teal_accent, C.rose_accent];

    return `
      <svg class="master-blueprint-svg" viewBox="0 0 1333 750" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        ${this.getStandardDefs(C)}
        <rect x="0" y="0" width="1333" height="750" fill="${C.canvas_bg}" />
        ${this.renderHeader(h, b, C, paletteKey)}

        <!-- 1. Top 4 Close Phases Ribbon (Exact 1333 Widescreen Proportions) -->
        <g class="anim-grp anim-p1" data-stage="1">
          ${phases.map((p, idx) => {
            const x = rx[idx];
            const w = rw[idx];
            const bColor = p.badge_color || rColors[idx];
            return `
              <rect x="${x}" y="71" width="${w}" height="36" rx="4" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="0.75" filter="url(#shadow-card)" />
              <rect x="${x + 8}" y="75" width="38" height="28" rx="3" fill="${bColor}" />
              <text x="${x + 27}" y="93" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${p.num || ('0' + (idx + 1))}</text>
              <text x="${x + 52}" y="85" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">${this.escapeXml(p.title || '')}</text>
              <text x="${x + 52}" y="97" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">${this.escapeXml(p.sub || '')}</text>
              ${idx < 3 ? `<line x1="${x + w + 6}" y1="89" x2="${rx[idx + 1] - 6}" y2="89" stroke="${C.text_muted}" stroke-width="2" marker-end="url(#arr-gray)" />` : ''}
            `;
          }).join('')}
        </g>

        <!-- 2. Main Outer Dashed Container (Exact Benchmark Proportions: y: 118 to 732, h: 614) -->
        <g class="anim-grp anim-p2">
          <rect x="40" y="118" width="1253" height="614" rx="10" fill="${C.card_bg}" stroke="${C.dashed_border}" stroke-width="1.8" stroke-dasharray="10 6" filter="url(#shadow-card)" />
          <rect x="52" y="108" width="280" height="24" rx="5" fill="${C.blue_accent}" />
          <text x="192" y="124" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escapeXml(data.container_label || "PHILIPS FINANCIAL CLOSE RUNBOOK")}</text>
        </g>

        <!-- 3. Lane 1: Sub-Ledger Transactional Ingestion & Freeze Pipeline (x: 68, w: 200) -->
        <g class="anim-grp anim-p2">
          <!-- Stage 1 Nodes -->
          <g data-stage="1">
            <g class="interactive-card" data-node-id="fc_spec" cursor="pointer">
              <rect x="68" y="152" width="200" height="70" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)" />
              <text x="80" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Accounting Specialist</text>
              <text x="80" y="190" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Sub-Ledger Processing Lead</text>
              <circle cx="236" cy="187" r="22" fill="${C.blue_bg}" filter="url(#shadow-halo)" />
              <image href="emotes/calc.gif" x="214" y="165" width="44" height="44" />
            </g>
            <line x1="168" y1="222" x2="168" y2="258" stroke="${C.blue_accent}" stroke-width="2.5" marker-end="url(#arr-blu)" />

            <g class="interactive-card" data-node-id="fc_extract" cursor="pointer">
              <rect x="68" y="258" width="200" height="126" rx="8" fill="${C.blue_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
              <rect x="68" y="258" width="6" height="126" fill="${C.blue_accent}" />
              <text x="80" y="280" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.blue_accent}">Extract Sub-Ledgers</text>
              <text x="80" y="298" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">SAP ECC &amp; S/4HANA lock across 48 company codes.</text>
              <circle cx="236" cy="321" r="22" fill="${C.card_bg}" filter="url(#shadow-halo)" />
              <image href="emotes/ledger.gif" x="214" y="299" width="44" height="44" />
            </g>
            <line x1="168" y1="384" x2="168" y2="422" stroke="${C.blue_accent}" stroke-width="2.5" marker-end="url(#arr-blu)" />
          </g>

          <!-- Stage 2 Nodes -->
          <g data-stage="2">
            <g class="interactive-card" data-node-id="fc_accruals" cursor="pointer">
              <rect x="68" y="422" width="200" height="64" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
              <text x="80" y="444" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Accruals &amp; Prepayments</text>
              <text x="80" y="460" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Automate recurring standard journal post</text>
              <circle cx="236" cy="454" r="20" fill="${C.blue_bg}" />
              <image href="emotes/currency.gif" x="216" y="434" width="40" height="40" />
            </g>
            <line x1="168" y1="486" x2="168" y2="524" stroke="${C.blue_accent}" stroke-width="2.5" marker-end="url(#arr-blu)" />

            <g class="interactive-card" data-node-id="fc_tb" cursor="pointer">
              <rect x="68" y="524" width="200" height="120" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)" />
              <text x="80" y="546" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Locked Trial Balance</text>
              <text x="80" y="562" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Consolidated sub-ledger delta extract ready for bilateral pairing.</text>
              <text x="80" y="586" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="7.5" fill="${C.text_muted}">• Transactional cutoff certified across all units.</text>
              <text x="80" y="602" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="7.5" fill="${C.text_muted}">• Accrual reconciliation variance: €0.00.</text>
              <circle cx="236" cy="610" r="20" fill="${C.blue_bg}" />
              <image href="emotes/chart_up.gif" x="216" y="590" width="40" height="40" />
            </g>
          </g>
        </g>

        <!-- 4. Lanes 2 & 3: Symmetrical Bilateral Settlement & Triage Taxonomy (Stage 3) -->
        <g class="anim-grp anim-p3" data-stage="3">
          <!-- Main Spine from Lane 1 to Symmetrical 3-Track Tree -->
          <line x1="268" y1="584" x2="304" y2="584" stroke="${C.purple_accent}" stroke-width="2.5" />
          <line x1="304" y1="258" x2="304" y2="600" stroke="${C.purple_accent}" stroke-width="2.5" />

          <!-- Track 1 (Top): Automated Bilateral Invoicing & Match -->
          <line x1="304" y1="258" x2="324" y2="258" stroke="${C.purple_accent}" stroke-width="2.5" marker-end="url(#arr-pur)" />
          <g class="interactive-card" data-node-id="fc_pairing" cursor="pointer">
            <rect x="324" y="214" width="180" height="88" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="336" y="238" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Automated Pairing Engine</text>
            <text x="336" y="254" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Bilateral invoice match</text>
            <circle cx="474" cy="258" r="20" fill="${C.blue_bg}" />
            <image href="emotes/currency.gif" x="454" y="238" width="40" height="40" />
          </g>

          <line x1="504" y1="258" x2="520" y2="258" stroke="${C.blue_accent}" stroke-width="2" />
          <line x1="520" y1="202" x2="520" y2="314" stroke="${C.blue_accent}" stroke-width="2" />

          <line x1="520" y1="202" x2="536" y2="202" stroke="${C.blue_accent}" stroke-width="2" marker-end="url(#arr-blu)" />
          <g class="interactive-card" data-node-id="fc_sameday" cursor="pointer">
            <rect x="536" y="158" width="150" height="88" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="548" y="182" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.5" font-weight="bold" fill="${C.text_primary}">Same-Day Invoicing</text>
            <text x="548" y="198" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Direct SAP clearance</text>
            <circle cx="656" cy="202" r="18" fill="${C.card_bg}" />
            <image href="emotes/calc.gif" x="638" y="184" width="36" height="36" />
          </g>

          <line x1="520" y1="314" x2="536" y2="314" stroke="${C.blue_accent}" stroke-width="2" marker-end="url(#arr-blu)" />
          <g class="interactive-card" data-node-id="fc_fx" cursor="pointer">
            <rect x="536" y="270" width="150" height="88" rx="8" fill="${C.card_bg}" stroke="${C.blue_border}" stroke-width="1" filter="url(#shadow-card)" />
            <text x="548" y="294" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.5" font-weight="bold" fill="${C.text_primary}">FX &amp; Currency Match</text>
            <text x="548" y="310" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Auto-hedging validation</text>
            <circle cx="656" cy="314" r="18" fill="${C.card_bg}" />
            <image href="emotes/ap_ar.gif" x="638" y="296" width="36" height="36" />
          </g>

          <!-- Step 2 Action Cards -->
          <circle cx="704" cy="202" r="14" fill="${C.teal_accent}" />
          <text x="704" y="206" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">&gt;</text>
          <g class="interactive-card" data-node-id="fc_clearing" cursor="pointer">
            <rect x="718" y="158" width="182" height="88" rx="8" fill="${C.card_bg}" stroke="${C.teal_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="730" y="182" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.5" font-weight="bold" fill="${C.text_primary}">Auto-Clearing (94.8%)</text>
            <text x="730" y="198" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Execute bilateral clearance</text>
            <circle cx="870" cy="202" r="18" fill="${C.card_bg}" />
            <image href="emotes/stamp.gif" x="852" y="184" width="36" height="36" />
          </g>

          <circle cx="704" cy="314" r="14" fill="${C.teal_accent}" />
          <text x="704" y="318" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">&gt;</text>
          <g class="interactive-card" data-node-id="fc_run" cursor="pointer">
            <rect x="718" y="270" width="182" height="88" rx="8" fill="${C.card_bg}" stroke="${C.teal_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="730" y="294" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10.5" font-weight="bold" fill="${C.text_primary}">Execute Bilateral Run</text>
            <text x="730" y="310" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Bilateral netting journal</text>
            <circle cx="870" cy="314" r="18" fill="${C.card_bg}" />
            <image href="emotes/handshake.gif" x="852" y="296" width="36" height="36" />
          </g>

          <!-- Track 2 (Middle): Discrepancy Triage & Exception Routing -->
          <line x1="304" y1="440" x2="324" y2="440" stroke="${C.purple_accent}" stroke-width="2.5" marker-end="url(#arr-pur)" />
          <g class="interactive-card" data-node-id="fc_triage" cursor="pointer">
            <rect x="324" y="396" width="200" height="88" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="336" y="420" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Variance Delta Triage</text>
            <text x="336" y="436" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Route unallocated items</text>
            <circle cx="494" cy="440" r="20" fill="${C.card_bg}" />
            <image href="emotes/gap.gif" x="474" y="420" width="40" height="40" />
          </g>

          <circle cx="544" cy="440" r="14" fill="${C.amber_accent}" />
          <text x="544" y="444" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">&gt;</text>
          <g class="interactive-card" data-node-id="fc_fasttrack" cursor="pointer">
            <rect x="558" y="396" width="248" height="88" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="570" y="420" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Fast-Track Investigation</text>
            <text x="570" y="436" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Investigate discrepancy &lt; €25K; post clearing journal</text>
            <circle cx="776" cy="440" r="20" fill="${C.card_bg}" />
            <image href="emotes/tb_ageing.gif" x="756" y="420" width="40" height="40" />
          </g>

          <!-- Track 3 (Bottom): Group Consolidation & Elimination -->
          <line x1="304" y1="600" x2="324" y2="600" stroke="${C.purple_accent}" stroke-width="2.5" marker-end="url(#arr-pur)" />
          <g class="interactive-card" data-node-id="fc_elims" cursor="pointer">
            <rect x="324" y="556" width="200" height="88" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="336" y="580" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Group Eliminations Run</text>
            <text x="336" y="596" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Reciprocal account offset</text>
            <circle cx="494" cy="600" r="20" fill="${C.card_bg}" />
            <image href="emotes/tb_rules.gif" x="474" y="580" width="40" height="40" />
          </g>

          <circle cx="544" cy="600" r="14" fill="${C.rose_accent}" />
          <text x="544" y="604" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">&gt;</text>
          <g class="interactive-card" data-node-id="fc_rollup" cursor="pointer">
            <rect x="558" y="556" width="248" height="88" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <text x="570" y="580" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_primary}">Trial Balance Rollup</text>
            <text x="570" y="596" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" fill="${C.text_muted}">Automated group currency rollup; CFO audit certification</text>
            <circle cx="776" cy="600" r="20" fill="${C.card_bg}" />
            <image href="emotes/stamp.gif" x="756" y="580" width="40" height="40" />
          </g>
        </g>

        <!-- 5. Lane 4: Governance Gateways & Multi-Tier Escalation Matrix (Stage 4 & 5) -->
        <g class="anim-grp anim-p4" data-stage="4">
          <!-- Connectors from Track ends to Governance column -->
          <line x1="900" y1="202" x2="925" y2="202" stroke="${C.purple_accent}" stroke-width="2" />
          <line x1="900" y1="314" x2="925" y2="314" stroke="${C.purple_accent}" stroke-width="2" />
          <line x1="806" y1="440" x2="925" y2="440" stroke="${C.purple_accent}" stroke-width="2" />
          <line x1="806" y1="600" x2="925" y2="600" stroke="${C.purple_accent}" stroke-width="2" />

          <!-- Governance Card 1: Materiality Threshold -->
          <g class="interactive-card" data-node-id="fc_gw_mat" cursor="pointer">
            <rect x="925" y="152" width="345" height="114" rx="8" fill="${C.card_bg}" stroke="${C.rose_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <rect x="939" y="162" width="165" height="20" rx="3" fill="${C.rose_accent}" />
            <text x="1021" y="176" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MATERIALITY LIMIT (€25K)</text>
            <text x="939" y="202" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">Materiality Threshold Gate</text>
            <text x="939" y="222" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Variances below €25K auto-expensed with audit certification note.</text>
            <circle cx="1235" cy="209" r="22" fill="${C.rose_bg}" />
            <image href="emotes/stamp.gif" x="1213" y="187" width="44" height="44" />
          </g>
          <line x1="1097" y1="266" x2="1097" y2="316" stroke="${C.rose_accent}" stroke-width="2.5" marker-end="url(#arr-ros)" />

          <!-- Governance Card 2: Escalation SLA -->
          <g class="interactive-card" data-node-id="fc_gw_sla" cursor="pointer">
            <rect x="925" y="316" width="345" height="120" rx="8" fill="${C.card_bg}" stroke="${C.amber_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <rect x="939" y="326" width="145" height="20" rx="3" fill="${C.amber_accent}" />
            <text x="1011" y="340" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle">CRITICAL SLA (4-HOUR)</text>
            <text x="939" y="366" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.text_primary}">Escalation SLA Notification</text>
            <text x="939" y="386" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" fill="${C.text_muted}">Structured alert sent to counterparty finance lead via Slack &amp; SAP.</text>
            <circle cx="1235" cy="376" r="22" fill="${C.amber_bg}" />
            <image href="emotes/tb_ageing.gif" x="1213" y="354" width="44" height="44" />
          </g>
          <line x1="1097" y1="436" x2="1097" y2="480" stroke="${C.red_accent}" stroke-width="2.5" marker-end="url(#arr-red)" />

          <!-- Governance Card 3: Multi-Tier Escalation Matrix (Stage 5) -->
          <g class="interactive-card" data-node-id="fc_gw_esc" cursor="pointer" data-stage="5">
            <rect x="925" y="480" width="345" height="228" rx="8" fill="${C.red_bg}" stroke="${C.red_border}" stroke-width="1.2" filter="url(#shadow-card)" />
            <rect x="939" y="494" width="144" height="22" rx="4" fill="${C.red_accent}" />
            <text x="1011" y="509" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="7.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MULTI-TIER ESCALATION</text>
            <text x="939" y="534" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.red_accent}">Inaction → Automated Executive Escalation</text>

            <text x="939" y="562" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="${C.red_accent}">L1 (24h SLA): <tspan fill="${C.text_primary}">Sub-Ledger Accounting Lead</tspan></text>
            <text x="955" y="578" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="7.5" fill="${C.text_muted}">Initial SLA alert; re-verify unmatched ledger delta.</text>

            <text x="939" y="606" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="${C.red_accent}">L2 (48h SLA): <tspan fill="${C.text_primary}">FSS Shared Services Controller</tspan></text>
            <text x="955" y="622" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="7.5" fill="${C.text_muted}">Shared services escalation; bilateral review conference.</text>

            <text x="939" y="650" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="${C.red_accent}">L3 (Close Day): <tspan fill="${C.text_primary}">CFO &amp; Group Finance Director</tspan></text>
            <text x="955" y="666" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="7.5" fill="${C.text_muted}">Executive sign-off; post un-cleared accrual &amp; board release.</text>

            <circle cx="1235" cy="520" r="24" fill="${C.card_bg}" />
            <image href="emotes/tb_rbac.gif" x="1211" y="496" width="48" height="48" />
          </g>
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
        <g class="anim-grp anim-p2" data-stage="1">
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
              ${i < 4 ? `<line x1="${x + 235}" y1="155" x2="${x + 253}" y2="155" stroke="${C.blue_accent}" stroke-width="2.5" marker-end="url(#arr-blu)" class="flow-tracer-line" />` : ''}
            `;
          }).join("")}
        </g>

        <!-- Middle: 3-Way Match Core Engine & Exception Flow -->
        <g class="anim-grp anim-p3">
          <rect x="40" y="250" width="790" height="340" rx="10" fill="${C.card_bg}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="8 5" />
          <rect x="56" y="240" width="220" height="22" rx="4" fill="${C.amber_accent}" />
          <text x="166" y="255" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SAP 3-WAY MATCHING PIPELINE</text>

          <!-- 3 Inbound Match Pillars -->
          <g data-stage="2">
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
            <line x1="178" y1="380" x2="435" y2="420" stroke="${C.blue_accent}" stroke-width="2" class="flow-tracer-line" />
            <line x1="435" y1="380" x2="435" y2="420" stroke="${C.teal_accent}" stroke-width="2" class="flow-tracer-line" />
            <line x1="692" y1="380" x2="435" y2="420" stroke="${C.rose_accent}" stroke-width="2" class="flow-tracer-line" />
          </g>

          <!-- Decision Diamond / Card & Exception Track -->
          <g data-stage="3">
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
        </g>

        <!-- Right Side: Vendor Scorecard -->
        <g class="anim-grp anim-p4" data-stage="4">
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
        <g class="anim-grp anim-p4" data-stage="5">
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
            const stageId = i < 2 ? 1 : (i === 2 ? 2 : 3);
            return `
              <g data-stage="${stageId}">
                <rect x="${x}" y="80" width="200" height="490" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <rect x="${x + 14}" y="95" width="45" height="26" rx="4" fill="${C.blue_accent}" />
                <text x="${x + 36}" y="113" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(t.level)}</text>
                <circle cx="${x + 155}" cy="115" r="22" fill="${C.blue_bg}" />
                <image href="emotes/${t.emote || 'ticket'}.gif" x="${x + 135}" y="95" width="40" height="40" />

                <text x="${x + 14}" y="160" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(t.name)}</text>
                <text x="${x + 14}" y="185" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" fill="${C.text_muted}">${this.escape(t.desc)}</text>

                <rect x="${x + 14}" y="490" width="172" height="45" rx="6" fill="${C.blue_bg}" />
                <text x="${x + 100}" y="518" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.blue_accent}" text-anchor="middle">SLA: ${this.escape(t.sla)}</text>
              </g>
            `;
          }).join("")}
        </g>

        <!-- Right Side: Major Incident Management & SLA Table -->
        <g class="anim-grp anim-p3">
          <!-- Major Incident Card -->
          <g data-stage="5" transform="translate(915, 80)">
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
          <g data-stage="4" transform="translate(915, 330)">
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
        <g class="anim-grp anim-p4" data-stage="5">
          <rect x="40" y="590" width="1253" height="120" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
          <text x="64" y="620" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}">PHILIPS HEALTHSUITE CLOUD TELEMETRY &amp; OPERATIONAL METRICS</text>
          <text x="64" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.teal_accent}">99.99%</text>
          <text x="195" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Platform Availability</text>
          <text x="490" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.blue_accent}">1.2 SEC</text>
          <text x="610" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Mean API Gateway Latency</text>
          <text x="890" y="668" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="28" font-weight="bold" fill="${C.amber_accent}">0 DEFECTS</text>
          <text x="1040" y="660" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_secondary}">Clinical Audit Security Breaches</text>
        </g>

        <g class="flow-tracers-layer" pointer-events="none">
          <line x1="240" y1="325" x2="885" y2="325" stroke="${C.blue_accent}" stroke-width="2" class="flow-tracer-line" />
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
          <g data-stage="3">
            ${Array.from({ length: 5 }).map((_, r) => {
              return Array.from({ length: 5 }).map((__, c) => {
                const gx = 100 + c * 115;
                const gy = 130 + (4 - r) * 75;
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
          </g>

          <!-- X-axis Label -->
          <text x="390" y="545" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="${C.text_muted}" text-anchor="middle">IMPACT SEVERITY (1 TO 5)</text>

          <!-- Plotted Risk Vectors -->
          ${vectors.map((rv, idx) => {
            const vx = 100 + (rv.x - 1) * 115 + 40;
            const vy = 130 + (5 - rv.y) * 75 + 25;
            const stageId = idx < 2 ? 1 : 2;
            return `
              <g data-stage="${stageId}" transform="translate(${vx}, ${vy})" cursor="pointer">
                <circle cx="16" cy="16" r="16" fill="${C.red_accent}" />
                <text x="16" y="21" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${rv.id}</text>
                <circle cx="36" cy="4" r="12" fill="${C.card_bg}" />
                <image href="emotes/${rv.emote || 'shield'}.gif" x="26" y="-6" width="20" height="20" />
              </g>
            `;
          }).join("")}
        </g>

        <!-- Right Side: SOX Control Pillars & KRI Status -->
        <g class="anim-grp anim-p3" data-stage="4">
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
        <g class="anim-grp anim-p4" data-stage="5">
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
            const stageId = i < 2 ? 1 : (i === 2 ? 2 : (i === 3 ? 3 : 4));
            return `
              <g data-stage="${stageId}">
                <rect x="${x}" y="80" width="198" height="480" rx="8" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1.2" />
                <rect x="${x + 12}" y="95" width="100" height="22" rx="4" fill="${C.blue_accent}" />
                <text x="${x + 62}" y="110" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="8.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${this.escape(st.phase)}</text>
                <circle cx="${x + 160}" cy="115" r="20" fill="${C.blue_bg}" />
                <image href="emotes/${st.emote || 'user'}.gif" x="${x + 142}" y="97" width="36" height="36" />

                <text x="${x + 12}" y="152" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="${C.text_primary}">${this.escape(st.title)}</text>
                <text x="${x + 12}" y="174" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="9" fill="${C.text_muted}">${this.escape(st.action)}</text>

                <rect x="${x + 12}" y="495" width="174" height="45" rx="6" fill="${C.blue_bg}" />
                <text x="${x + 99}" y="522" font-family="'Aptos', 'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="${C.teal_accent}" text-anchor="middle">${this.escape(st.score)}</text>
              </g>
            `;
          }).join("")}
        </g>

        <!-- NPS Emotion Flow Curve Overlay spanning across columns -->
        <g class="anim-grp anim-p3">
          <path d="M 140 380 Q 350 330, 560 360 T 980 300 T 1200 280" fill="none" stroke="${C.amber_accent}" stroke-width="4" class="flow-tracer-line" />
          ${stages.map((st, i) => {
            const cx = 140 + i * 210;
            const cy = 380 - (i * 18) + (i % 2 === 0 ? 10 : -10);
            return `
              <circle cx="${cx}" cy="${cy}" r="9" fill="${C.amber_accent}" stroke="#FFFFFF" stroke-width="2" />
            `;
          }).join("")}
        </g>

        <!-- Bottom KPI Banner -->
        <g class="anim-grp anim-p4" data-stage="5">
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
      const stageId = idx < 2 ? 1 : (idx < 4 ? 2 : 3);
      phasesHtml += `
        <g class="anim-node anim-p1 interactive-card" data-stage="${stageId}" data-node-id="phases.${idx}" transform="translate(${x}, 72)">
          <rect width="244" height="42" rx="6" fill="${C.card_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="4" height="42" rx="2" fill="${badgeBg}"/>
          <rect x="10" y="8" width="34" height="26" rx="4" fill="${badgeBg}" fill-opacity="0.15"/>
          <text x="27" y="24" text-anchor="middle" fill="${badgeBg}" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">0${idx+1}</text>
          <text x="52" y="21" fill="${C.text_primary}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">${this.escapeXml(p.title)}</text>
          <text x="52" y="33" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9">${this.escapeXml(p.sub)}</text>
          <image href="${this.resolveEmote(p.emote)}" x="208" y="10" width="22" height="22"/>
          ${idx < 4 ? `<path d="M 248 21 L 252 21" stroke="${C.dashed_border}" stroke-width="2" class="flow-tracer-line"/>` : ""}
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
          <g class="interactive-card" data-stage="4" data-node-id="workstreams.${wIdx}.initiatives.${iIdx}" transform="translate(${ix}, ${y})">
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
        <g class="anim-node anim-p2" data-stage="4" transform="translate(40, ${y})">
          <rect width="260" height="142" rx="8" fill="${C.hdr_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
          <rect width="6" height="142" rx="2" fill="${C.stripe}"/>
          <image href="${this.resolveEmote(ws.emote)}" x="18" y="16" width="34" height="34"/>
          <text x="60" y="32" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700">${this.escapeXml(ws.lane)}</text>
          <text x="18" y="72" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="10">CROSS-FUNCTIONAL WORKSTREAM</text>
          <text x="18" y="92" fill="${C.text_secondary}" font-family="Segoe UI, sans-serif" font-size="10">Adoption & Governance Lead</text>
          <path d="M 300 71 L 320 71" stroke="${C.stripe}" stroke-width="2" marker-end="url(#arrow-head)" class="flow-tracer-line"/>
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
        <g class="anim-node anim-p5" data-stage="5" transform="translate(40, 616)">
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

    const renderQuadrant = (qData, x, y, accentColor, stageId) => {
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
        <g data-stage="${stageId}" transform="translate(${x}, ${y})">
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
          ${renderQuadrant(quads.strengths || {}, 40, 72, "#10B981", 1)}
          ${renderQuadrant(quads.weaknesses || {}, 676, 72, "#F59E0B", 2)}
          ${renderQuadrant(quads.opportunities || {}, 40, 386, "#E8734A", 3)}
          ${renderQuadrant(quads.threats || {}, 676, 386, "#EF4444", 4)}
        </g>
        <!-- Bottom Strategic Summary Bar -->
        <g class="anim-node anim-p5" data-stage="5" transform="translate(40, 698)">
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
      const stageId = idx + 1;
      qHtml += `
        <g data-stage="${stageId}" transform="translate(${x}, 72)">
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
      const laneStage = lIdx + 1;
      let barsHtml = "";
      (lane.bars || []).forEach((bar, bIdx) => {
        const bx = 320 + bar.start * 960;
        const bw = bar.span * 960;
        const by = 16 + bIdx * 46;
        barsHtml += `
          <g class="interactive-card" data-stage="${laneStage}" data-node-id="lanes.${lIdx}.bars.${bIdx}" transform="translate(${bx}, ${by})">
            <rect width="${bw}" height="38" rx="6" fill="${bar.color || C.stripe}" filter="url(#shadow-card)"/>
            <text x="14" y="23" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700">${this.escapeXml(bar.title)}</text>
            <rect x="${bw - 54}" y="9" width="44" height="20" rx="4" fill="rgba(0,0,0,0.25)"/>
            <text x="${bw - 32}" y="23" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, sans-serif" font-size="9" font-weight="600">${this.escapeXml(bar.status)}</text>
          </g>
        `;
      });

      lanesHtml += `
        <g class="anim-node anim-p2" data-stage="${laneStage}" transform="translate(40, ${y})">
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
        <g class="anim-node anim-p4 interactive-card" data-stage="5" data-node-id="milestones.${idx}" transform="translate(${mx}, 620)">
          <path d="M 0 0 L 14 14 L 0 28 L -14 14 Z" fill="${m.rag === 'green' ? C.teal_accent : C.amber_accent}" filter="url(#shadow-card)"/>
          <line x1="0" y1="-480" x2="0" y2="0" stroke="${m.rag === 'green' ? C.teal_accent : C.amber_accent}" stroke-width="1.5" stroke-dasharray="3 3" class="flow-tracer-line"/>
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
        <g class="anim-node anim-p1" data-stage="1">
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
      <g class="anim-node anim-p1 interactive-card" data-stage="1" data-node-id="leader" transform="translate(466, 76)">
        <rect width="400" height="92" rx="8" fill="${C.hdr_bg}" stroke="${C.card_bd}" stroke-width="1" filter="url(#shadow-card)"/>
        <rect width="6" height="92" rx="2" fill="${C.stripe}"/>
        <image href="${this.resolveEmote(leader.emote)}" x="20" y="18" width="44" height="44"/>
        <text x="76" y="32" fill="${C.canvas_bg}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="800">${this.escapeXml(leader.role)}</text>
        <text x="76" y="50" fill="${C.stripe}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="600">${this.escapeXml(leader.name)}</text>
        <text x="76" y="68" fill="${C.text_muted}" font-family="Segoe UI, sans-serif" font-size="9">${this.escapeXml(leader.mandate)}</text>
      </g>
      <!-- Trunk Line Down -->
      <line x1="666" y1="168" x2="666" y2="200" stroke="${C.stripe}" stroke-width="2" class="flow-tracer-line"/>
      <!-- Cross Bar Across 3 Divisions -->
      <line x1="240" y1="200" x2="1092" y2="200" stroke="${C.stripe}" stroke-width="2" class="flow-tracer-line"/>
      <line x1="240" y1="200" x2="240" y2="220" stroke="${C.stripe}" stroke-width="2" class="flow-tracer-line"/>
      <line x1="666" y1="200" x2="666" y2="220" stroke="${C.stripe}" stroke-width="2" class="flow-tracer-line"/>
      <line x1="1092" y1="200" x2="1092" y2="220" stroke="${C.stripe}" stroke-width="2" class="flow-tracer-line"/>
    `;

    // 3 VP Divisions
    let divHtml = "";
    divisions.forEach((div, idx) => {
      const dx = 40 + idx * 426;
      const stageId = idx + 2; // Divisions 1, 2, 3 map to stages 2, 3, 4
      let teamsHtml = "";
      (div.teams || []).forEach((tm, tIdx) => {
        const ty = 370 + tIdx * 102;
        teamsHtml += `
          <g class="interactive-card" data-stage="${stageId}" data-node-id="divisions.${idx}.teams.${tIdx}" transform="translate(${dx}, ${ty})">
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
        <g class="anim-node anim-p2" data-stage="${stageId}" transform="translate(${dx}, 220)">
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
        <g class="anim-node anim-p5" data-stage="5">
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
      <g class="anim-node anim-p1 interactive-card" data-stage="1" data-node-id="baseline" transform="translate(40, ${baseY})">
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
      const stageId = idx < 2 ? 2 : 3;

      const topVal = Math.max(prevVal, runningVal);
      const botVal = Math.min(prevVal, runningVal);
      const barY = chartBottomY - (topVal - 35) * scale;
      const barH = Math.max(16, (topVal - botVal) * scale);
      const prevY = chartBottomY - (prevVal - 35) * scale;

      barsHtml += `
        <!-- Dashed connector from prev -->
        <line x1="${x - colGap}" y1="${prevY}" x2="${x}" y2="${prevY}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="3 3" class="flow-tracer-line"/>
        <!-- Driver Bar -->
        <g class="anim-node anim-p2 interactive-card" data-stage="${stageId}" data-node-id="drivers.${idx}" transform="translate(${x}, ${barY})">
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
      <line x1="${targetX - colGap}" y1="${targetY}" x2="${targetX}" y2="${targetY}" stroke="${C.dashed_border}" stroke-width="1.5" stroke-dasharray="3 3" class="flow-tracer-line"/>
      <g class="anim-node anim-p3 interactive-card" data-stage="4" data-node-id="target" transform="translate(${targetX}, ${targetY})">
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
        <g class="anim-node anim-p5" data-stage="5">
          ${scHtml}
        </g>
      </svg>
    `;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FLOW ANIMATION & MULTI-STAGE PROGRESSION CONTROLLERS
  // ══════════════════════════════════════════════════════════════════════════
  setStage(stageNum) {
    this.currentStage = stageNum;
    const stageContainer = document.getElementById("slideCanvas") || this.container;
    if (!stageContainer) return;

    for (let i = 1; i <= 5; i++) {
      stageContainer.classList.remove(`focus-stage-${i}`);
    }

    if (stageNum >= 1 && stageNum <= 5) {
      stageContainer.classList.add(`focus-stage-${stageNum}`);
    }
  }

  setAnimationSpeed(multiplier) {
    this.speedMultiplier = multiplier || 1.0;
  }

  simulateAnimation(onPhaseChange, onComplete) {
    this.resetAnimation();
    this.isAnimating = true;
    let stage = 1;
    const speed = this.speedMultiplier || 1.0;
    const intervalMs = Math.round(1400 / speed);

    this.setStage(1);
    if (onPhaseChange) onPhaseChange(1);

    this.animTimer = setInterval(() => {
      stage++;
      if (stage <= 5) {
        this.setStage(stage);
        if (onPhaseChange) onPhaseChange(stage);
      } else {
        this.setStage(0);
        if (onPhaseChange) onPhaseChange(0);
        this.isAnimating = false;
        clearInterval(this.animTimer);
        this.animTimer = null;
        if (onComplete) onComplete();
      }
    }, intervalMs);
  }

  resetAnimation() {
    if (this.animTimer) {
      clearInterval(this.animTimer);
      this.animTimer = null;
    }
    this.isAnimating = false;
    this.setStage(0);
  }
}

