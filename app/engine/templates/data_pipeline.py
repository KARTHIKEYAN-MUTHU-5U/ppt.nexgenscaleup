#!/usr/bin/env python3
"""
Template 4: Enterprise AI & Data Pipeline Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4-Stage Architecture (Ingestion, Lakehouse/ETL, AI/Agentic Models, Consumption),
data governance checkpoints, latency SLAs, and animated emotes.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from ..generator_core import (
    PALETTES, LW, bx, fl, ci, tx, tp, shadow, dash_bd,
    conn_arrow, conn_line, ad, ar, ln, emote_r, AnimationEngine
)

def build_data_pipeline(data, static_dir, out_path):
    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.50)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    eng = AnimationEngine()
    P1, P2, P3, P4 = [], [], [], []

    branding = data.get("branding", {})
    palette_key = branding.get("palette", "obsidian_sapphire")
    C = PALETTES.get(palette_key, PALETTES["obsidian_sapphire"])

    def get_emote(name):
        p = os.path.join(static_dir, "emotes", f"{name}.gif")
        if not os.path.exists(p):
            p = os.path.join(static_dir, "emotes", "tb_dash.gif")
        return p

    logo_file = branding.get("logo_file", "philips.png")
    logo_path = os.path.join(static_dir, "logos", logo_file)

    canvas = fl(slide, 0, 0, 13.33, 7.50, C["canvas_bg"])

    # ─── 1. HEADER (Y: 0.00 to 0.62) ──────────────────────────────────
    hdr = fl(slide, 0, 0, 13.33, 0.62, C["hdr_bg"]); P1.append((hdr.shape_id, 0, 'fade'))
    stripe = fl(slide, 0, 0.62, 13.33, 0.025, C["stripe"]); P1.append((stripe.shape_id, 150, 'wr'))

    title_text = branding.get("title", "ENTERPRISE DATA PIPELINE & AGENTIC AI ARCHITECTURE")
    sub_text = branding.get("subtitle", f"{branding.get('company_name', 'ENTERPRISE AI')}  •  EVENT-DRIVEN STREAMING, LAKEHOUSE & COGNITIVE DECISIONING")

    ht = tx(slide, 0.40, 0.07, 9.00, 0.50)
    tp(ht.text_frame, title_text, sz=18, b=True, c=C["card_bg"])
    tp(ht.text_frame, sub_text, sz=8.5, c=C["t4"], sb=2)
    P1.append((ht.shape_id, 250, 'fade'))

    pbadge = bx(slide, 11.35, 0.10, 1.60, 0.42, C["card_bg"], None, r=4000)
    shadow(pbadge, 8000, 4000, 7000)
    if os.path.exists(logo_path):
        plogo = slide.shapes.add_picture(logo_path, Inches(11.45), Inches(0.15), Inches(1.40), Inches(0.32))
        P1 += [(pbadge.shape_id, 350, 'fade'), (plogo.shape_id, 400, 'fade')]
    else:
        tp(pbadge.text_frame, branding.get("company_name", "AI PLATFORM"), sz=12, b=True, c=C["accent"], a=PP_ALIGN.CENTER)
        P1.append((pbadge.shape_id, 350, 'fade'))

    # ─── 2. PIPELINE STAGES (4 Columns: X: 0.40 to 9.80, Sidebar: 10.00 to 12.93)
    stages = data.get("stages", [
        {
            "num": "01",
            "name": "SOURCE INGESTION",
            "sla": "Real-time & Batch (<5m)",
            "color": C["blue"],
            "blocks": [
                {"title": "SAP ECC & S/4HANA", "sub": "IDoc / RFC change-data-capture stream.", "emote": "idoc"},
                {"title": "Paper & EDI Invoices", "sub": "Incoming PDF OCR & EDIFACT intake.", "emote": "inv"},
                {"title": "Banking & Treasury Feeds", "sub": "MT940/CAMT.053 settlement files.", "emote": "cash"}
            ]
        },
        {
            "num": "02",
            "name": "LAKEHOUSE & ETL",
            "sla": "Cleanse & Dedupe (<15m)",
            "color": C["amber"],
            "blocks": [
                {"title": "Bronze Raw Delta Lake", "sub": "Immutable audit storage & schema validation.", "emote": "qlik"},
                {"title": "Silver Normalized Ledger", "sub": "Entity code & currency harmonization.", "emote": "filter"},
                {"title": "Gold Triage Mart", "sub": "Classified reciprocal delta repository.", "emote": "list"}
            ]
        },
        {
            "num": "03",
            "name": "AGENTIC AI ENGINE",
            "sla": "Model Inference (<30s)",
            "color": C["teal"],
            "blocks": [
                {"title": "Predictive Matching Copilot", "sub": "Semantic NLP matching on invoice text.", "emote": "review"},
                {"title": "Syntax Anomaly Detector", "sub": "IDoc header error auto-diagnosis.", "emote": "pnf"},
                {"title": "Autonomous Clearing Bot", "sub": "Self-healing journal voucher generator.", "emote": "tb_robot"}
            ]
        },
        {
            "num": "04",
            "name": "EXECUTIVE CONSUMPTION",
            "sla": "Continuous Live Feed",
            "color": C["rose"],
            "blocks": [
                {"title": "Qlik Sense Analytics", "sub": "Executive CFO intercompany dashboard.", "emote": "tb_dash"},
                {"title": "Automated Email Chaser", "sub": "Counterparty SLA escalation dispatch.", "emote": "notif"},
                {"title": "ERP Writeback Bridge", "sub": "BAPI journal posting & audit log sign-off.", "emote": "tb_write"}
            ]
        }
    ])

    stage_w = 2.20
    stage_gap = 0.28
    stage_xs = [0.40, 0.40 + (stage_w + stage_gap), 0.40 + (stage_w + stage_gap) * 2, 0.40 + (stage_w + stage_gap) * 3]

    for s_idx, st in enumerate(stages[:4]):
        sx = stage_xs[s_idx]
        
        # Stage Header Box
        shb = bx(slide, sx, 0.74, stage_w, 0.50, C["card_bg"], C["card_bd"], r=4000)
        shadow(shb, 8000, 4000, 6000)
        snum = bx(slide, sx + 0.08, 0.78, 0.36, 0.22, st["color"], None, r=2000)
        tp(snum.text_frame, st["num"], sz=8.0, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)
        stx = tx(slide, sx + 0.48, 0.76, stage_w - 0.52, 0.44)
        tp(stx.text_frame, st["name"], sz=8.5, b=True, c=C["t1"])
        tp(stx.text_frame, st["sla"], sz=6.6, c=st["color"], sb=1.0)
        
        d_st = 400 + s_idx * 150
        P1 += [(shb.shape_id, d_st, 'fade'), (snum.shape_id, d_st + 20, 'zm'), (stx.shape_id, d_st + 30, 'fade')]

        # Arrow to next stage
        if s_idx < 3:
            arr = ar(slide, sx + stage_w + 0.04, 0.99, sx + stage_w + stage_gap - 0.04, C["t3"], w=LW)
            P1.append((arr.shape_id, d_st + 60, 'wr'))

        # 3 Blocks per stage (Y: 1.34 to 7.08)
        block_ys = [1.34, 3.28, 5.22]
        block_h = 1.74

        for b_idx, blk in enumerate(st.get("blocks", [])[:3]):
            by = block_ys[b_idx]
            b_card = bx(slide, sx, by, stage_w, block_h, C["card_bg"], C["card_bd"], r=4000)
            shadow(b_card, 10000, 5000, 7000)
            b_accent = fl(slide, sx, by + 0.10, 0.04, block_h - 0.20, st["color"])

            eg, ee = emote_r(slide, get_emote(blk.get("emote", "spec")), sx, by, stage_w, block_h, C["accent_g"], 0.46)

            btx = tx(slide, sx + 0.12, by + 0.12, stage_w - 0.68, block_h - 0.24)
            tp(btx.text_frame, blk.get("title", "Service Node"), sz=9.4, b=True, c=C["t1"])
            tp(btx.text_frame, blk.get("sub", ""), sz=7.4, c=C["t3"], sb=3.0)

            d_blk = 500 + s_idx * 120 + b_idx * 40
            P2 += [(b_card.shape_id, d_blk, 'fade'), (b_accent.shape_id, d_blk + 10, 'fade'),
                   (eg.shape_id, d_blk + 20, 'fade'), (ee.shape_id, d_blk + 30, 'ep'), (btx.shape_id, d_blk + 40, 'fade')]

            # Inter-block downward flow connector
            if b_idx < 2:
                d_arr = ad(slide, sx + stage_w / 2, by + block_h, block_ys[b_idx + 1], st["color"], w=LW)
                P2.append((d_arr.shape_id, d_blk + 50, 'wd'))

    # ─── 3. GOVERNANCE & SECURITY SIDEBAR (X: 10.08, W: 2.85, Y: 0.74 to 7.08)
    sb_box = bx(slide, 10.08, 0.74, 2.85, 6.34, C["card_bg"], C["card_bd"], r=5000)
    shadow(sb_box, 14000, 7000, 9000)
    dash_bd(sb_box, C["ctn_bd"], 1.5, 'lgDash')

    sb_pill = bx(slide, 10.20, 0.64, 2.60, 0.24, C["hdr_bg"], None, r=3000)
    tp(sb_pill.text_frame, "SECURITY & COMPLIANCE GUARDRAILS", sz=7.0, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)
    P3 += [(sb_box.shape_id, 700, 'fade'), (sb_pill.shape_id, 730, 'zm')]

    guardrails = data.get("guardrails", [
        {"tag": "ACCESS CONTROL", "title": "Role-Based Access (RBAC)", "desc": "Strict granular entity-code tenant separation & OAuth 2.0 token scope.", "c": C["blue"], "emote": "tb_rbac"},
        {"tag": "AUDIT INTEGRITY", "title": "SOX & GAAP Provenance", "desc": "WORM (Write Once Read Many) immutable ledger delta logging.", "c": C["teal"], "emote": "tb_audit"},
        {"tag": "ENCRYPTION", "title": "Zero-Trust Encryption", "desc": "AES-256 at rest, TLS 1.3 in transit with mutual mTLS certificate auth.", "c": C["purple"], "emote": "tb_rules"},
        {"tag": "OBSERVABILITY", "title": "Telemetry & SLA Monitoring", "desc": "Sub-minute alerting on pipeline dropouts and un-cleared queues.", "c": C["red"], "emote": "esc"}
    ])

    sb_y = 1.04
    card_h = 1.38
    for g_idx, g in enumerate(guardrails[:4]):
        cy = sb_y + g_idx * (card_h + 0.12)
        gc = bx(slide, 10.22, cy, 2.57, card_h, C["accent_l"], C["card_bd"], r=3000)
        gtag = fl(slide, 10.22, cy + 0.08, 0.04, card_h - 0.16, g["c"])

        eg, ee = emote_r(slide, get_emote(g.get("emote", "tb_rbac")), 10.22, cy, 2.57, card_h, C["accent_g"], 0.44)

        gtx = tx(slide, 10.34, cy + 0.08, 2.57 - 0.60, card_h - 0.16)
        tp(gtx.text_frame, g["tag"], sz=6.6, b=True, c=g["c"])
        tp(gtx.text_frame, g["title"], sz=8.8, b=True, c=C["t1"], sb=1.0)
        tp(gtx.text_frame, g["desc"], sz=6.8, c=C["t3"], sb=2.0)

        d_g = 800 + g_idx * 60
        P3 += [(gc.shape_id, d_g, 'fade'), (gtag.shape_id, d_g + 10, 'fade'),
               (eg.shape_id, d_g + 20, 'fade'), (ee.shape_id, d_g + 30, 'ep'), (gtx.shape_id, d_g + 40, 'fade')]

    eng.add(P1); eng.add(P2); eng.add(P3)
    eng.build(slide)
    prs.save(out_path)
    return out_path
