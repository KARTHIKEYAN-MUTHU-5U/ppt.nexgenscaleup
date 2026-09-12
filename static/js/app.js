/**
 * Executive Slide Studio - Main Application Controller
 * Orchestrates multi-template switching, two-way visual canvas data binding,
 * 24-emote catalog picker, OpenXML animation simulator, and PowerPoint export.
 */

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
              <img src="emotes/${node.emote}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.root?.emote || 'pnf'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.sub_branch_1a?.cause?.emote || 'idoc'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.sub_branch_1a?.action?.emote || 'hwi'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.sub_branch_1b?.cause?.emote || 'no_edi'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.sub_branch_1b?.action?.emote || 'inv'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.track_2?.cause?.emote || 'ap_ar'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.track_2?.action?.emote || 'review'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.track_3?.cause?.emote || 'cash'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${df.track_3?.action?.emote || 'waiting'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${gov.gap_card?.emote || 'gap'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${gov.notif_card?.emote || 'notif'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${gov.escalation_card?.emote || 'esc'}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${ws.emote}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${t.emote}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${st.emote}.gif" width="16" height="16" alt=""> Change Emote
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
              <img src="emotes/${k.emote}.gif" width="16" height="16" alt=""> Change Emote
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
  function buildEmoteGrid(container, filter = "", onSelect = null) {
    container.innerHTML = "";
    const cleanFilter = filter.toLowerCase().trim();

    EMOTES_CATALOG.forEach(em => {
      if (cleanFilter && !em.name.toLowerCase().includes(cleanFilter) && !em.category.toLowerCase().includes(cleanFilter) && !em.id.toLowerCase().includes(cleanFilter)) {
        return;
      }

      const card = document.createElement("div");
      card.className = "emote-pick-card";
      card.innerHTML = `
        <img src="emotes/${em.filename}" alt="${em.name}" class="emote-pick-img">
        <span class="emote-pick-name">${em.name}</span>
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
