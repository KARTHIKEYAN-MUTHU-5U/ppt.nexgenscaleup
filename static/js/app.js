/**
 * Executive Slide Studio - Main Application Controller
 * Orchestrates multi-template switching, two-way visual canvas data binding,
 * 24-emote catalog picker, OpenXML animation simulator, and PowerPoint export.
 */

// Global Emote URL resolver helper
const eUrl = (id) => (window.getEmoteUrl ? window.getEmoteUrl(id) : 'emotes/' + (id || 'spec') + '.gif');
window.eUrl = eUrl;

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    activeTemplateId: "process_flow",
    currentData: JSON.parse(JSON.stringify(TEMPLATES_CONFIG.process_flow.defaultData)),
    activeTab: "tab-editor",
    editingEmoteTarget: null,
    isLocalBackendAvailable: false,
    currentAnimationPhase: 0,
    isAnimationPlaying: false
  };

  const renderer = new SlideCanvasRenderer("slideCanvas");

  // DOM Elements
  const templateSelect = document.getElementById("templateSelect");
  const paletteSelect = document.getElementById("paletteSelect");
  const logoSelect = document.getElementById("logoSelect");
  const companyInput = document.getElementById("companyInput");
  const titleInput = document.getElementById("titleInput");
  const subtitleInput = document.getElementById("subtitleInput");
  const activeTemplateBadge = document.getElementById("activeTemplateBadge");

  // Project Dropdown
  const btnProjectOptions = document.getElementById("btnProjectOptions");
  const projectDropdown = document.getElementById("projectDropdown");
  const btnExportJson = document.getElementById("btnExportJson");
  const btnImportJsonTrigger = document.getElementById("btnImportJsonTrigger");
  const importJsonInput = document.getElementById("importJsonInput");
  const btnResetDefault = document.getElementById("btnResetDefault");

  // Simulator & Actions
  const btnSimulate = document.getElementById("btnSimulate");
  const btnStepAnim = document.getElementById("btnStepAnim");
  const btnResetAnim = document.getElementById("btnResetAnim");
  const animPhaseIndicator = document.getElementById("animPhaseIndicator");
  const btnDownloadPptx = document.getElementById("btnDownloadPptx");
  const btnDownloadPng = document.getElementById("btnDownloadPng");
  const btnFullscreen = document.getElementById("btnFullscreen");

  // Containers
  const dynamicFormContainer = document.getElementById("dynamicFormContainer");
  const emoteModal = document.getElementById("emoteModal");
  const emoteGrid = document.getElementById("emoteGrid");
  const emoteSearchInput = document.getElementById("emoteSearchInput");
  const closeEmoteModal = document.getElementById("closeEmoteModal");
  const sidebarEmoteGrid = document.getElementById("sidebarEmoteGrid");
  const connectionStatus = document.getElementById("connectionStatus");

  // Check Backend
  async function checkBackend() {
    try {
      const res = await fetch("/api/health", { method: "GET", signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        state.isLocalBackendAvailable = true;
        connectionStatus.innerHTML = '<span class="status-indicator online"></span> Native Engine (DrawingML + OpenXML COM)';
        connectionStatus.className = "conn-badge online";
        return;
      }
    } catch (e) {}
    state.isLocalBackendAvailable = false;
    connectionStatus.innerHTML = '<span class="status-indicator cloud"></span> Standalone Engine (Client PptxGenJS Engine)';
    connectionStatus.className = "conn-badge cloud";
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE SWITCHING & STATE
  // ══════════════════════════════════════════════════════════════════════════
  function switchTemplate(templateId) {
    if (!TEMPLATES_CONFIG[templateId]) return;
    state.activeTemplateId = templateId;
    state.currentData = JSON.parse(JSON.stringify(TEMPLATES_CONFIG[templateId].defaultData));

    const cfg = TEMPLATES_CONFIG[templateId];
    if (activeTemplateBadge) {
      activeTemplateBadge.textContent = cfg.name.split("|")[0].trim();
    }

    syncInputsFromData();
    buildDynamicForm();
    renderer.render(state.currentData);
    saveToLocalStorage();
    showNotification(`Switched to: ${cfg.name}`);
  }

  function syncInputsFromData() {
    const d = state.currentData;
    const b = d.branding || {};
    const h = d.header || {};

    if (paletteSelect) paletteSelect.value = d.palette || "executive_blueprint";
    if (logoSelect) logoSelect.value = b.logo_key || "philips";
    if (companyInput) companyInput.value = b.company_name || "PHILIPS";
    if (titleInput) titleInput.value = h.title || "";
    if (subtitleInput) subtitleInput.value = h.subtitle || "";
  }

  function syncDataFromInputs() {
    if (!state.currentData.branding) state.currentData.branding = {};
    if (!state.currentData.header) state.currentData.header = {};

    state.currentData.palette = paletteSelect ? paletteSelect.value : "executive_blueprint";
    state.currentData.branding.logo_key = logoSelect ? logoSelect.value : "philips";
    state.currentData.branding.company_name = companyInput ? companyInput.value : "PHILIPS";
    state.currentData.header.title = titleInput ? titleInput.value : "";
    state.currentData.header.subtitle = subtitleInput ? subtitleInput.value : "";

    renderer.render(state.currentData);
    saveToLocalStorage();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TWO-WAY BINDING: CANVAS CLICK -> FORM SCROLL
  // ══════════════════════════════════════════════════════════════════════════
  renderer.setNodeClickListener(nodeId => {
    // Switch to tab-editor if not active
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    const editorTabBtn = document.querySelector('[data-tab="tab-editor"]');
    const editorTabContent = document.getElementById("tab-editor");
    if (editorTabBtn && editorTabContent) {
      editorTabBtn.classList.add("active");
      editorTabContent.classList.add("active");
    }

    // Find corresponding form card
    const targetCard = document.getElementById(`form-card-${nodeId}`);
    if (targetCard) {
      document.querySelectorAll(".node-edit-card").forEach(c => c.classList.remove("highlighted"));
      targetCard.classList.add("highlighted");
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });

      const firstInput = targetCard.querySelector("input, textarea");
      if (firstInput) {
        firstInput.focus();
      }
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // DYNAMIC FORM BUILDER
  // ══════════════════════════════════════════════════════════════════════════
  function buildDynamicForm() {
    dynamicFormContainer.innerHTML = "";
    const tid = state.activeTemplateId;
    const d = state.currentData;

    if (tid === "process_flow") {
      buildProcessFlowForm(d);
    } else if (tid === "strategic_roadmap") {
      buildStrategicRoadmapForm(d);
    } else if (tid === "operating_model") {
      buildOperatingModelForm(d);
    } else if (tid === "data_pipeline") {
      buildDataPipelineForm(d);
    } else if (tid === "kpi_scorecard") {
      buildKpiScorecardForm(d);
    } else if (tid === "financial_close") {
      buildFinancialCloseForm(d);
    } else if (tid === "vendor_p2p") {
      buildVendorP2PForm(d);
    } else if (tid === "it_service") {
      buildITServiceForm(d);
    } else if (tid === "risk_compliance") {
      buildRiskComplianceForm(d);
    } else if (tid === "customer_journey") {
      buildCustomerJourneyForm(d);
    } else if (tid === "change_mgmt") {
      buildChangeMgmtForm(d);
    } else if (tid === "swot_analysis") {
      buildSwotAnalysisForm(d);
    } else if (tid === "project_timeline") {
      buildProjectTimelineForm(d);
    } else if (tid === "org_chart") {
      buildOrgChartForm(d);
    } else if (tid === "budget_waterfall") {
      buildBudgetWaterfallForm(d);
    }
  }

  // Form for Process Flow
  function buildProcessFlowForm(d) {
    const ing = d.ingestion_track || [];
    const df = d.decision_fork || {};
    const gov = d.governance_column || {};

    let html = `
      <div class="form-group-block">
        <div class="form-group-title">COLUMN 1: INGESTION PIPELINE</div>
    `;

    ing.forEach((node, idx) => {
      html += `
        <div id="form-card-ingestion.${idx}" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Node ${idx + 1}: ${escapeHtml(node.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="ingestion_track.${idx}.emote">
              <img src="${eUrl(node.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Card Title</label>
            <input type="text" class="input-dark node-field" data-path="ingestion_track.${idx}.title" value="${escapeHtml(node.title)}">
          </div>
          <div class="input-group">
            <label>Subtext</label>
            <input type="text" class="input-dark node-field" data-path="ingestion_track.${idx}.sub" value="${escapeHtml(node.sub)}">
          </div>
        </div>
      `;
    });

    html += `
      </div>
      <div class="form-group-block">
        <div class="form-group-title">COLUMN 2: DECISION TREE & TRIAGE</div>

        <!-- Root Node -->
        <div id="form-card-decision.root" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Decision Root (Track 1): ${escapeHtml(df.root?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.root.emote">
              <img src="${eUrl(df.root?.emote || 'pnf')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Root Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.root.title" value="${escapeHtml(df.root?.title || '')}">
          </div>
          <div class="input-group">
            <label>Subtext</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.root.sub" value="${escapeHtml(df.root?.sub || '')}">
          </div>
        </div>

        <!-- 1A Sub-Branch -->
        <div id="form-card-decision.sub_1a_cause" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Track 1A: ${escapeHtml(df.sub_branch_1a?.cause?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.sub_branch_1a.cause.emote">
              <img src="${eUrl(df.sub_branch_1a?.cause?.emote || 'idoc')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Cause Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.sub_branch_1a.cause.title" value="${escapeHtml(df.sub_branch_1a?.cause?.title || '')}">
          </div>
        </div>

        <div id="form-card-decision.sub_1a_action" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">1A Action: ${escapeHtml(df.sub_branch_1a?.action?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.sub_branch_1a.action.emote">
              <img src="${eUrl(df.sub_branch_1a?.action?.emote || 'hwi')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Action Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.sub_branch_1a.action.title" value="${escapeHtml(df.sub_branch_1a?.action?.title || '')}">
          </div>
        </div>

        <!-- 1B Sub-Branch -->
        <div id="form-card-decision.sub_1b_cause" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Track 1B: ${escapeHtml(df.sub_branch_1b?.cause?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.sub_branch_1b.cause.emote">
              <img src="${eUrl(df.sub_branch_1b?.cause?.emote || 'no_edi')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Cause Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.sub_branch_1b.cause.title" value="${escapeHtml(df.sub_branch_1b?.cause?.title || '')}">
          </div>
        </div>

        <div id="form-card-decision.sub_1b_action" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">1B Action: ${escapeHtml(df.sub_branch_1b?.action?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.sub_branch_1b.action.emote">
              <img src="${eUrl(df.sub_branch_1b?.action?.emote || 'inv')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Action Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.sub_branch_1b.action.title" value="${escapeHtml(df.sub_branch_1b?.action?.title || '')}">
          </div>
        </div>

        <!-- Track 2 -->
        <div id="form-card-decision.track_2_cause" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Track 2: ${escapeHtml(df.track_2?.cause?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.track_2.cause.emote">
              <img src="${eUrl(df.track_2?.cause?.emote || 'ap_ar')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Cause Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.track_2.cause.title" value="${escapeHtml(df.track_2?.cause?.title || '')}">
          </div>
        </div>

        <div id="form-card-decision.track_2_action" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Track 2 Action: ${escapeHtml(df.track_2?.action?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.track_2.action.emote">
              <img src="${eUrl(df.track_2?.action?.emote || 'review')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Action Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.track_2.action.title" value="${escapeHtml(df.track_2?.action?.title || '')}">
          </div>
        </div>

        <!-- Track 3 -->
        <div id="form-card-decision.track_3_cause" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Track 3: ${escapeHtml(df.track_3?.cause?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.track_3.cause.emote">
              <img src="${eUrl(df.track_3?.cause?.emote || 'cash')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Cause Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.track_3.cause.title" value="${escapeHtml(df.track_3?.cause?.title || '')}">
          </div>
        </div>

        <div id="form-card-decision.track_3_action" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Track 3 Action: ${escapeHtml(df.track_3?.action?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="decision_fork.track_3.action.emote">
              <img src="${eUrl(df.track_3?.action?.emote || 'waiting')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Action Title</label>
            <input type="text" class="input-dark node-field" data-path="decision_fork.track_3.action.title" value="${escapeHtml(df.track_3?.action?.title || '')}">
          </div>
        </div>
      </div>

      <div class="form-group-block">
        <div class="form-group-title">COLUMN 3: GOVERNANCE & ESCALATION MATRIX</div>

        <!-- Gap Card -->
        <div id="form-card-governance.gap" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Gap Card: ${escapeHtml(gov.gap_card?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="governance_column.gap_card.emote">
              <img src="${eUrl(gov.gap_card?.emote || 'gap')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Title</label>
            <input type="text" class="input-dark node-field" data-path="governance_column.gap_card.title" value="${escapeHtml(gov.gap_card?.title || '')}">
          </div>
        </div>

        <!-- Notification Card -->
        <div id="form-card-governance.notif" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Notification Card: ${escapeHtml(gov.notif_card?.title || '')}</span>
            <button type="button" class="btn-emote-trigger" data-target="governance_column.notif_card.emote">
              <img src="${eUrl(gov.notif_card?.emote || 'notif')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Title</label>
            <input type="text" class="input-dark node-field" data-path="governance_column.notif_card.title" value="${escapeHtml(gov.notif_card?.title || '')}">
          </div>
        </div>

        <!-- Multi-Tier Escalation Matrix -->
        <div id="form-card-governance.escalation" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Escalation Matrix</span>
            <button type="button" class="btn-emote-trigger" data-target="governance_column.escalation_card.emote">
              <img src="${eUrl(gov.escalation_card?.emote || 'esc')}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Matrix Header</label>
            <input type="text" class="input-dark node-field" data-path="governance_column.escalation_card.title" value="${escapeHtml(gov.escalation_card?.title || '')}">
          </div>
        </div>
      </div>
    `;

    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  // Simplified form builder for other templates
  function buildStrategicRoadmapForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">ROADMAP WORKSTREAMS</div>`;
    (d.workstreams || []).forEach((ws, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(ws.name)}</span>
            <button type="button" class="btn-emote-trigger" data-target="workstreams.${idx}.emote">
              <img src="${eUrl(ws.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Workstream Name</label>
            <input type="text" class="input-dark node-field" data-path="workstreams.${idx}.name" value="${escapeHtml(ws.name)}">
          </div>
          <div class="input-group">
            <label>Horizon 1 (Now)</label>
            <input type="text" class="input-dark node-field" data-path="workstreams.${idx}.h1" value="${escapeHtml(ws.h1)}">
          </div>
          <div class="input-group">
            <label>Horizon 2 (Next)</label>
            <input type="text" class="input-dark node-field" data-path="workstreams.${idx}.h2" value="${escapeHtml(ws.h2)}">
          </div>
          <div class="input-group">
            <label>Horizon 3 (Future)</label>
            <input type="text" class="input-dark node-field" data-path="workstreams.${idx}.h3" value="${escapeHtml(ws.h3)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildOperatingModelForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">ORGANIZATIONAL TIERS</div>`;
    (d.tiers || []).forEach((t, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(t.level)}</span>
            <button type="button" class="btn-emote-trigger" data-target="tiers.${idx}.emote">
              <img src="${eUrl(t.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Title</label>
            <input type="text" class="input-dark node-field" data-path="tiers.${idx}.title" value="${escapeHtml(t.title)}">
          </div>
          <div class="input-group">
            <label>Leadership</label>
            <input type="text" class="input-dark node-field" data-path="tiers.${idx}.owner" value="${escapeHtml(t.owner)}">
          </div>
          <div class="input-group">
            <label>Operational Mandate</label>
            <input type="text" class="input-dark node-field" data-path="tiers.${idx}.mandate" value="${escapeHtml(t.mandate)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildDataPipelineForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">DATA PIPELINE STAGES</div>`;
    (d.stages || []).forEach((st, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Stage ${st.num}: ${escapeHtml(st.name)}</span>
            <button type="button" class="btn-emote-trigger" data-target="stages.${idx}.emote">
              <img src="${eUrl(st.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Stage Name</label>
            <input type="text" class="input-dark node-field" data-path="stages.${idx}.name" value="${escapeHtml(st.name)}">
          </div>
          <div class="input-group">
            <label>Technologies / Stacks</label>
            <input type="text" class="input-dark node-field" data-path="stages.${idx}.tech" value="${escapeHtml(st.tech)}">
          </div>
          <div class="input-group">
            <label>Latency SLA</label>
            <input type="text" class="input-dark node-field" data-path="stages.${idx}.sla" value="${escapeHtml(st.sla)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildKpiScorecardForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">BOARD KPI TILES</div>`;
    (d.kpis || []).forEach((k, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(k.label)}</span>
            <button type="button" class="btn-emote-trigger" data-target="kpis.${idx}.emote">
              <img src="${eUrl(k.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Metric Label</label>
            <input type="text" class="input-dark node-field" data-path="kpis.${idx}.label" value="${escapeHtml(k.label)}">
          </div>
          <div class="input-group">
            <label>Current Value</label>
            <input type="text" class="input-dark node-field" data-path="kpis.${idx}.value" value="${escapeHtml(k.value)}">
          </div>
          <div class="input-group">
            <label>Variance / Delta</label>
            <input type="text" class="input-dark node-field" data-path="kpis.${idx}.delta" value="${escapeHtml(k.delta)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildFinancialCloseForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">FINANCIAL CLOSE RUNBOOK NODES</div>`;
    (d.nodes || []).forEach((n, idx) => {
      html += `
        <div id="form-card-${n.id}" class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(n.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="nodes.${idx}.emote">
              <img src="${eUrl(n.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Node Title</label>
            <input type="text" class="input-dark node-field" data-path="nodes.${idx}.title" value="${escapeHtml(n.title)}">
          </div>
          <div class="input-group">
            <label>Operational Task</label>
            <input type="text" class="input-dark node-field" data-path="nodes.${idx}.desc" value="${escapeHtml(n.desc)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildVendorP2PForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">PROCURE-TO-PAY (P2P) STAGES</div>`;
    (d.steps || []).forEach((st, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">Step ${st.num}: ${escapeHtml(st.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="steps.${idx}.emote">
              <img src="${eUrl(st.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Step Title</label>
            <input type="text" class="input-dark node-field" data-path="steps.${idx}.title" value="${escapeHtml(st.title)}">
          </div>
          <div class="input-group">
            <label>Subtext</label>
            <input type="text" class="input-dark node-field" data-path="steps.${idx}.sub" value="${escapeHtml(st.sub)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildITServiceForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">ITIL SUPPORT TIERS</div>`;
    (d.tiers || []).forEach((t, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(t.level)}: ${escapeHtml(t.name)}</span>
            <button type="button" class="btn-emote-trigger" data-target="tiers.${idx}.emote">
              <img src="${eUrl(t.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Name</label>
            <input type="text" class="input-dark node-field" data-path="tiers.${idx}.name" value="${escapeHtml(t.name)}">
          </div>
          <div class="input-group">
            <label>Service Scope</label>
            <input type="text" class="input-dark node-field" data-path="tiers.${idx}.desc" value="${escapeHtml(t.desc)}">
          </div>
          <div class="input-group">
            <label>SLA</label>
            <input type="text" class="input-dark node-field" data-path="tiers.${idx}.sla" value="${escapeHtml(t.sla)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildRiskComplianceForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">ENTERPRISE RISK VECTORS</div>`;
    (d.risk_vectors || []).forEach((rv, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${rv.id}: ${escapeHtml(rv.name)}</span>
            <button type="button" class="btn-emote-trigger" data-target="risk_vectors.${idx}.emote">
              <img src="${eUrl(rv.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Risk Name</label>
            <input type="text" class="input-dark node-field" data-path="risk_vectors.${idx}.name" value="${escapeHtml(rv.name)}">
          </div>
          <div class="input-group">
            <label>Owner</label>
            <input type="text" class="input-dark node-field" data-path="risk_vectors.${idx}.owner" value="${escapeHtml(rv.owner)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function buildCustomerJourneyForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">CUSTOMER JOURNEY STAGES</div>`;
    (d.stages || []).forEach((st, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(st.phase)}: ${escapeHtml(st.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="stages.${idx}.emote">
              <img src="${eUrl(st.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Stage Title</label>
            <input type="text" class="input-dark node-field" data-path="stages.${idx}.title" value="${escapeHtml(st.title)}">
          </div>
          <div class="input-group">
            <label>Customer Action</label>
            <input type="text" class="input-dark node-field" data-path="stages.${idx}.action" value="${escapeHtml(st.action)}">
          </div>
          <div class="input-group">
            <label>Experience Score</label>
            <input type="text" class="input-dark node-field" data-path="stages.${idx}.score" value="${escapeHtml(st.score)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;
    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function attachFieldListeners() {
    dynamicFormContainer.querySelectorAll(".node-field").forEach(input => {
      input.addEventListener("input", e => {
        const path = e.target.getAttribute("data-path");
        const val = e.target.value;
        setDeepValue(state.currentData, path, val);
        renderer.render(state.currentData);
        saveToLocalStorage();
      });
    });

    dynamicFormContainer.querySelectorAll(".btn-emote-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetPath = btn.getAttribute("data-target");
        openEmotePicker(targetPath);
      });
    });
  }


  // Form 11: Change Management & ADKAR
  function buildChangeMgmtForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">ADKAR TRANSFORMATION PHASES</div>`;
    (d.phases || []).forEach((p, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(p.phase)}: ${escapeHtml(p.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="phases.${idx}.emote">
              <img src="${eUrl(p.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Phase Title</label>
            <input type="text" class="input-dark node-field" data-path="phases.${idx}.title" value="${escapeHtml(p.title)}">
          </div>
          <div class="input-group">
            <label>Strategic Intent</label>
            <input type="text" class="input-dark node-field" data-path="phases.${idx}.sub" value="${escapeHtml(p.sub)}">
          </div>
          <div class="input-group">
            <label>Status</label>
            <input type="text" class="input-dark node-field" data-path="phases.${idx}.status" value="${escapeHtml(p.status)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;

    html += `<div class="form-group-block"><div class="form-group-title">READINESS & GOVERNANCE METRICS</div>`;
    const gov = d.governance || {};
    html += `
      <div class="node-edit-card">
        <div class="input-group">
          <label>Readiness Score</label>
          <input type="text" class="input-dark node-field" data-path="governance.readiness_score" value="${escapeHtml(gov.readiness_score || '')}">
        </div>
        <div class="input-group">
          <label>Staff Certified</label>
          <input type="text" class="input-dark node-field" data-path="governance.trained_staff" value="${escapeHtml(gov.trained_staff || '')}">
        </div>
        <div class="input-group">
          <label>Active Superusers</label>
          <input type="text" class="input-dark node-field" data-path="governance.superusers_active" value="${escapeHtml(gov.superusers_active || '')}">
        </div>
        <div class="input-group">
          <label>User Sentiment</label>
          <input type="text" class="input-dark node-field" data-path="governance.sentiment_index" value="${escapeHtml(gov.sentiment_index || '')}">
        </div>
      </div>
    </div>`;

    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  // Form 12: Strategic SWOT Analysis
  function buildSwotAnalysisForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">SWOT QUADRANTS & CAPABILITIES</div>`;
    const quads = d.quadrants || {};
    ["strengths", "weaknesses", "opportunities", "threats"].forEach(qKey => {
      const q = quads[qKey] || {};
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(q.title || qKey.toUpperCase())}</span>
            <button type="button" class="btn-emote-trigger" data-target="quadrants.${qKey}.emote">
              <img src="${eUrl(q.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Quadrant Title</label>
            <input type="text" class="input-dark node-field" data-path="quadrants.${qKey}.title" value="${escapeHtml(q.title || '')}">
          </div>
          <div class="input-group">
            <label>Strategic Action Tag</label>
            <input type="text" class="input-dark node-field" data-path="quadrants.${qKey}.tag" value="${escapeHtml(q.tag || '')}">
          </div>
        </div>
      `;
      (q.items || []).forEach((item, idx) => {
        html += `
          <div class="node-edit-card" style="margin-left: 14px; border-left: 3px solid ${q.color || '#E8734A'};">
            <div class="node-card-head">
              <span class="node-card-title">${escapeHtml(item.code)}: ${escapeHtml(item.title)}</span>
            </div>
            <div class="input-group">
              <label>Item Title</label>
              <input type="text" class="input-dark node-field" data-path="quadrants.${qKey}.items.${idx}.title" value="${escapeHtml(item.title)}">
            </div>
            <div class="input-group">
              <label>Impact Level (HIGH / MED / CRITICAL)</label>
              <input type="text" class="input-dark node-field" data-path="quadrants.${qKey}.items.${idx}.impact" value="${escapeHtml(item.impact)}">
            </div>
            <div class="input-group">
              <label>Description</label>
              <input type="text" class="input-dark node-field" data-path="quadrants.${qKey}.items.${idx}.desc" value="${escapeHtml(item.desc)}">
            </div>
          </div>
        `;
      });
    });
    html += `</div>`;

    const sum = d.strategic_summary || {};
    html += `
      <div class="form-group-block"><div class="form-group-title">STRATEGIC SYNTHESIS</div>
        <div class="node-edit-card">
          <div class="input-group">
            <label>Executive Strategic Verdict</label>
            <textarea class="input-dark node-field" data-path="strategic_summary.core_verdict" rows="2">${escapeHtml(sum.core_verdict || '')}</textarea>
          </div>
          <div class="input-group">
            <label>Priority Focus</label>
            <input type="text" class="input-dark node-field" data-path="strategic_summary.priority_focus" value="${escapeHtml(sum.priority_focus || '')}">
          </div>
        </div>
      </div>
    `;

    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  // Form 13: Project Gantt Timeline
  function buildProjectTimelineForm(d) {
    let html = `<div class="form-group-block"><div class="form-group-title">DELIVERY WORKSTREAMS & LANES</div>`;
    (d.lanes || []).forEach((lane, lIdx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(lane.name)}</span>
            <button type="button" class="btn-emote-trigger" data-target="lanes.${lIdx}.emote">
              <img src="${eUrl(lane.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Lane Name</label>
            <input type="text" class="input-dark node-field" data-path="lanes.${lIdx}.name" value="${escapeHtml(lane.name)}">
          </div>
        </div>
      `;
      (lane.bars || []).forEach((bar, bIdx) => {
        html += `
          <div class="node-edit-card" style="margin-left: 14px;">
            <div class="input-group">
              <label>Sprint / Bar Title</label>
              <input type="text" class="input-dark node-field" data-path="lanes.${lIdx}.bars.${bIdx}.title" value="${escapeHtml(bar.title)}">
            </div>
            <div class="input-group">
              <label>Status</label>
              <input type="text" class="input-dark node-field" data-path="lanes.${lIdx}.bars.${bIdx}.status" value="${escapeHtml(bar.status)}">
            </div>
          </div>
        `;
      });
    });
    html += `</div>`;

    html += `<div class="form-group-block"><div class="form-group-title">CRITICAL MILESTONES</div>`;
    (d.milestones || []).forEach((m, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(m.title)} (${escapeHtml(m.date)})</span>
            <button type="button" class="btn-emote-trigger" data-target="milestones.${idx}.emote">
              <img src="${eUrl(m.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Milestone Title</label>
            <input type="text" class="input-dark node-field" data-path="milestones.${idx}.title" value="${escapeHtml(m.title)}">
          </div>
          <div class="input-group">
            <label>Target Date</label>
            <input type="text" class="input-dark node-field" data-path="milestones.${idx}.date" value="${escapeHtml(m.date)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;

    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  // Form 14: Executive Org Chart
  function buildOrgChartForm(d) {
    const leader = d.leader || {};
    let html = `
      <div class="form-group-block"><div class="form-group-title">EXECUTIVE STEERING & LEADERSHIP</div>
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(leader.role)}</span>
            <button type="button" class="btn-emote-trigger" data-target="leader.emote">
              <img src="${eUrl(leader.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Executive Role</label>
            <input type="text" class="input-dark node-field" data-path="leader.role" value="${escapeHtml(leader.role)}">
          </div>
          <div class="input-group">
            <label>Name / Body</label>
            <input type="text" class="input-dark node-field" data-path="leader.name" value="${escapeHtml(leader.name)}">
          </div>
          <div class="input-group">
            <label>Executive Mandate</label>
            <input type="text" class="input-dark node-field" data-path="leader.mandate" value="${escapeHtml(leader.mandate)}">
          </div>
        </div>
      </div>
    `;

    html += `<div class="form-group-block"><div class="form-group-title">FUNCTIONAL VP DIVISIONS</div>`;
    (d.divisions || []).forEach((div, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(div.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="divisions.${idx}.emote">
              <img src="${eUrl(div.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Division Title</label>
            <input type="text" class="input-dark node-field" data-path="divisions.${idx}.title" value="${escapeHtml(div.title)}">
          </div>
          <div class="input-group">
            <label>Leader / VP</label>
            <input type="text" class="input-dark node-field" data-path="divisions.${idx}.owner" value="${escapeHtml(div.owner)}">
          </div>
          <div class="input-group">
            <label>Headcount</label>
            <input type="text" class="input-dark node-field" data-path="divisions.${idx}.hc" value="${escapeHtml(div.hc)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;

    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  // Form 15: Financial Budget Waterfall
  function buildBudgetWaterfallForm(d) {
    const base = d.baseline || {};
    const target = d.target || {};
    let html = `
      <div class="form-group-block"><div class="form-group-title">WATERFALL BASELINE & TARGET</div>
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(base.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="baseline.emote">
              <img src="${eUrl(base.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Baseline Amount</label>
            <input type="text" class="input-dark node-field" data-path="baseline.amount" value="${escapeHtml(base.amount)}">
          </div>
        </div>
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(target.title)}</span>
            <button type="button" class="btn-emote-trigger" data-target="target.emote">
              <img src="${eUrl(target.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Target Amount</label>
            <input type="text" class="input-dark node-field" data-path="target.amount" value="${escapeHtml(target.amount)}">
          </div>
          <div class="input-group">
            <label>Net Reduction Subtext</label>
            <input type="text" class="input-dark node-field" data-path="target.sub" value="${escapeHtml(target.sub)}">
          </div>
        </div>
      </div>
    `;

    html += `<div class="form-group-block"><div class="form-group-title">COST & SAVINGS DRIVERS</div>`;
    (d.drivers || []).forEach((drv, idx) => {
      html += `
        <div class="node-edit-card">
          <div class="node-card-head">
            <span class="node-card-title">${escapeHtml(drv.title)} (${escapeHtml(drv.amount)})</span>
            <button type="button" class="btn-emote-trigger" data-target="drivers.${idx}.emote">
              <img src="${eUrl(drv.emote)}" width="16" height="16" alt=""> Change Emote
            </button>
          </div>
          <div class="input-group">
            <label>Driver Title</label>
            <input type="text" class="input-dark node-field" data-path="drivers.${idx}.title" value="${escapeHtml(drv.title)}">
          </div>
          <div class="input-group">
            <label>Delta Amount (e.g. +€2.2M or -€4.4M)</label>
            <input type="text" class="input-dark node-field" data-path="drivers.${idx}.amount" value="${escapeHtml(drv.amount)}">
          </div>
          <div class="input-group">
            <label>Operational Rationale</label>
            <input type="text" class="input-dark node-field" data-path="drivers.${idx}.desc" value="${escapeHtml(drv.desc)}">
          </div>
        </div>
      `;
    });
    html += `</div>`;

    dynamicFormContainer.innerHTML = html;
    attachFieldListeners();
  }

  function setDeepValue(obj, path, value) {
    const parts = path.split(".");
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EMOTE PICKER & SIDEBAR CATALOG
  // ══════════════════════════════════════════════════════════════════════════
  let activeEmoteCategory = "all";

  function buildEmoteGrid(container, filter = "", onSelect = null, catFilter = null) {
    container.innerHTML = "";
    const cleanFilter = filter.toLowerCase().trim();
    const effectiveCat = catFilter !== null ? catFilter : activeEmoteCategory;

    (window.EMOTES_CATALOG || []).forEach(em => {
      if (effectiveCat && effectiveCat !== "all") {
        if (effectiveCat === "animated" && em.type !== "animated") return;
        if (effectiveCat === "static" && em.type !== "static") return;
        if (effectiveCat === "vector" && em.type !== "vector") return;
        if (!["animated", "static", "vector"].includes(effectiveCat) && em.category.toLowerCase() !== effectiveCat.toLowerCase()) return;
      }

      if (cleanFilter && !em.name.toLowerCase().includes(cleanFilter) && !em.category.toLowerCase().includes(cleanFilter) && !em.id.toLowerCase().includes(cleanFilter)) {
        return;
      }

      const card = document.createElement("div");
      card.className = "emote-pick-card";
      const typeBadge = em.type === "animated" ? "GIF" : (em.type === "vector" ? "SVG" : "PNG");
      card.innerHTML = `
        <div class="emote-pick-type-pill ${em.type}">${typeBadge}</div>
        <img src="emotes/${em.filename}" alt="${escapeHtml(em.name)}" class="emote-pick-img">
        <span class="emote-pick-name">${escapeHtml(em.name)}</span>
        <span class="emote-pick-cat">${escapeHtml(em.category)}</span>
      `;

      if (onSelect) {
        card.addEventListener("click", () => onSelect(em.id));
      }

      container.appendChild(card);
    });
  }

  function openEmotePicker(targetPath) {
    state.editingEmoteTarget = targetPath;
    emoteModal.classList.add("open");
    emoteSearchInput.value = "";
    buildEmoteGrid(emoteGrid, "", applySelectedEmote);
    emoteSearchInput.focus();
  }

  function closeEmotePicker() {
    emoteModal.classList.remove("open");
    state.editingEmoteTarget = null;
  }

  function applySelectedEmote(emoteId) {
    if (!state.editingEmoteTarget) return;
    setDeepValue(state.currentData, state.editingEmoteTarget, emoteId);
    closeEmotePicker();
    buildDynamicForm();
    renderer.render(state.currentData);
    saveToLocalStorage();
    showNotification("Assigned animated emote cleanly!");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SIMULATION & ANIMATIONS
  // ══════════════════════════════════════════════════════════════════════════
  function playSimulation() {
    renderer.simulateAnimation();
    state.isAnimationPlaying = true;
    if (animPhaseIndicator) animPhaseIndicator.textContent = "Simulating OpenXML Build...";
    setTimeout(() => {
      state.isAnimationPlaying = false;
      if (animPhaseIndicator) animPhaseIndicator.textContent = "Phase: 5 / 5 (Complete)";
    }, 3200);
  }

  function stepSimulation() {
    const phases = [".anim-p1", ".anim-p2", ".anim-p3", ".anim-p4", ".anim-p5"];
    if (state.currentAnimationPhase === 0) {
      // Hide all first
      phases.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.opacity = "0";
          el.style.transition = "none";
        });
      });
    }

    if (state.currentAnimationPhase < phases.length) {
      const activeSelector = phases[state.currentAnimationPhase];
      document.querySelectorAll(activeSelector).forEach(el => {
        el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      state.currentAnimationPhase++;
      if (animPhaseIndicator) animPhaseIndicator.textContent = `Phase: ${state.currentAnimationPhase} / 5`;
    } else {
      resetSimulation();
    }
  }

  function resetSimulation() {
    renderer.resetAnimation();
    state.currentAnimationPhase = 0;
    state.isAnimationPlaying = false;
    if (animPhaseIndicator) animPhaseIndicator.textContent = "Phase: All Visible";
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PROJECT SAVE, LOAD & LOCALSTORAGE
  // ══════════════════════════════════════════════════════════════════════════
  function saveToLocalStorage() {
    try {
      localStorage.setItem("nexgen_studio_active_template", state.activeTemplateId);
      localStorage.setItem(`nexgen_studio_data_${state.activeTemplateId}`, JSON.stringify(state.currentData));
    } catch (e) {}
  }

  function loadFromLocalStorage() {
    try {
      const savedTid = localStorage.getItem("nexgen_studio_active_template");
      if (savedTid && TEMPLATES_CONFIG[savedTid]) {
        state.activeTemplateId = savedTid;
        if (templateSelect) templateSelect.value = savedTid;
      }
      const savedData = localStorage.getItem(`nexgen_studio_data_${state.activeTemplateId}`);
      if (savedData) {
        state.currentData = JSON.parse(savedData);
      }
    } catch (e) {}
  }

  function exportProjectJson() {
    const jsonStr = JSON.stringify(state.currentData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.activeTemplateId}_blueprint.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showNotification("Blueprint JSON exported successfully!");
  }

  function importProjectJson(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.template_id && TEMPLATES_CONFIG[parsed.template_id]) {
          state.activeTemplateId = parsed.template_id;
          if (templateSelect) templateSelect.value = parsed.template_id;
        }
        state.currentData = parsed;
        syncInputsFromData();
        buildDynamicForm();
        renderer.render(state.currentData);
        saveToLocalStorage();
        showNotification("Blueprint loaded cleanly!");
      } catch (err) {
        alert("Invalid project file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PPTX & PNG EXPORT ENGINES
  // ══════════════════════════════════════════════════════════════════════════
  async function downloadPresentation() {
    const originalText = btnDownloadPptx.innerHTML;
    btnDownloadPptx.disabled = true;
    btnDownloadPptx.innerHTML = `
      <span class="spinner"></span>
      <span>Compiling DrawingML .PPTX...</span>
    `;

    try {
      if (state.isLocalBackendAvailable) {
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(state.currentData)
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${state.currentData.template_id || 'presentation'}.pptx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showNotification("Compiled native DrawingML 2.0 pt presentation!");
            return;
          }
        } catch (e) {}
      }

      // Standalone client generation via PptxGenJS
      await ClientPptxGenerator.generate(state.currentData);
      showNotification("Presentation compiled directly in browser via client engine!");
    } catch (err) {
      alert("Error compiling presentation: " + err.message);
    } finally {
      btnDownloadPptx.disabled = false;
      btnDownloadPptx.innerHTML = originalText;
    }
  }

  async function exportSlidePng() {
    const originalText = btnDownloadPng.innerHTML;
    btnDownloadPng.disabled = true;
    btnDownloadPng.innerHTML = `
      <span class="spinner"></span>
      <span>Rendering 1080p...</span>
    `;

    try {
      const canvasEl = document.getElementById("slideCanvas");
      if (typeof html2canvas !== "undefined") {
        const canvas = await html2canvas(canvasEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: null
        });
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `${state.currentData.template_id || 'slide'}_1080p.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showNotification("High-resolution 1080p presentation blueprint exported cleanly!");
      }
    } catch (e) {
      alert("Could not export PNG: " + e.message);
    } finally {
      btnDownloadPng.disabled = false;
      btnDownloadPng.innerHTML = originalText;
    }
  }

  function showNotification(msg) {
    const notif = document.createElement("div");
    notif.className = "toast-notification";
    notif.innerHTML = `
      <span class="toast-icon">✓</span>
      <span>${msg}</span>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add("show"), 50);
    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => notif.remove(), 400);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT LISTENERS INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════
  if (templateSelect) {
    templateSelect.addEventListener("change", e => switchTemplate(e.target.value));
  }

  [paletteSelect, logoSelect, companyInput, titleInput, subtitleInput].forEach(el => {
    if (el) el.addEventListener("input", syncDataFromInputs);
  });

  // Project Dropdown
  if (btnProjectOptions) {
    btnProjectOptions.addEventListener("click", (e) => {
      e.stopPropagation();
      projectDropdown.classList.toggle("show");
    });
    document.addEventListener("click", () => projectDropdown.classList.remove("show"));
  }

  if (btnExportJson) btnExportJson.addEventListener("click", exportProjectJson);
  if (btnImportJsonTrigger) btnImportJsonTrigger.addEventListener("click", () => importJsonInput.click());
  if (importJsonInput) {
    importJsonInput.addEventListener("change", e => {
      if (e.target.files && e.target.files[0]) {
        importProjectJson(e.target.files[0]);
      }
    });
  }

  if (btnResetDefault) {
    btnResetDefault.addEventListener("click", () => {
      if (confirm("Reset current slide to the master benchmark blueprint?")) {
        state.currentData = JSON.parse(JSON.stringify(TEMPLATES_CONFIG[state.activeTemplateId].defaultData));
        syncInputsFromData();
        buildDynamicForm();
        renderer.render(state.currentData);
        saveToLocalStorage();
        showNotification("Reset to benchmark defaults!");
      }
    });
  }

  // Simulator controls
  if (btnSimulate) btnSimulate.addEventListener("click", playSimulation);
  if (btnStepAnim) btnStepAnim.addEventListener("click", stepSimulation);
  if (btnResetAnim) btnResetAnim.addEventListener("click", resetSimulation);
  if (btnDownloadPptx) btnDownloadPptx.addEventListener("click", downloadPresentation);
  if (btnDownloadPng) btnDownloadPng.addEventListener("click", exportSlidePng);

  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      const canvasStage = document.getElementById("canvasStage");
      if (!document.fullscreenElement) {
        canvasStage.requestFullscreen?.() || canvasStage.webkitRequestFullscreen?.();
      } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      }
    });
  }

  // Emote modal
  if (closeEmoteModal) closeEmoteModal.addEventListener("click", closeEmotePicker);
  if (emoteModal) {
    emoteModal.addEventListener("click", e => {
      if (e.target === emoteModal) closeEmotePicker();
    });
  }
  if (emoteSearchInput) {
    emoteSearchInput.addEventListener("input", e => buildEmoteGrid(emoteGrid, e.target.value, applySelectedEmote));
  }

  // Palette Swatches Renderer
  function updatePaletteSwatches(paletteKey) {
    const swatchesContainer = document.getElementById("paletteSwatches");
    if (!swatchesContainer) return;
    const p = window.PALETTES && window.PALETTES[paletteKey];
    if (!p) return;
    swatchesContainer.innerHTML = `
      <span class="swatch-dot" style="background:${p.canvas_bg}; border: 1px solid ${p.card_bd};" title="Canvas: ${p.canvas_bg}"></span>
      <span class="swatch-dot" style="background:${p.hdr_bg};" title="Header: ${p.hdr_bg}"></span>
      <span class="swatch-dot" style="background:${p.stripe};" title="Accent: ${p.stripe}"></span>
      <span class="swatch-dot" style="background:${p.teal_accent || '#10B981'};" title="Secondary: ${p.teal_accent}"></span>
    `;
  }

  // Sidebar Emote Category Chips
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-cat");
      const searchVal = document.getElementById("sidebarEmoteSearch")?.value || "";
      buildEmoteGrid(sidebarEmoteGrid, searchVal, null, cat);
    });
  });

  // Sidebar Emote Search Input
  const sidebarEmoteSearch = document.getElementById("sidebarEmoteSearch");
  if (sidebarEmoteSearch) {
    sidebarEmoteSearch.addEventListener("input", e => {
      const activeChip = document.querySelector(".filter-chip.active");
      const cat = activeChip ? activeChip.getAttribute("data-cat") : "all";
      buildEmoteGrid(sidebarEmoteGrid, e.target.value, null, cat);
    });
  }

  // Modal Category Tabs
  let modalTypeFilter = "all";
  document.querySelectorAll(".modal-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".modal-tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      modalTypeFilter = tab.getAttribute("data-type") || "all";
      const q = emoteSearchInput?.value || "";
      buildEmoteGrid(emoteGrid, q, applySelectedEmote, modalTypeFilter);
    });
  });

  // Sidebar Tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      const content = document.getElementById(tabId);
      if (content) content.classList.add("active");

      if (tabId === "tab-emotes" && sidebarEmoteGrid) {
        buildEmoteGrid(sidebarEmoteGrid, "");
      }
    });
  });

  // Initialize
  checkBackend();
  loadFromLocalStorage();
  syncInputsFromData();
  buildDynamicForm();
  renderer.render(state.currentData);
  if (sidebarEmoteGrid) buildEmoteGrid(sidebarEmoteGrid, "");
});
