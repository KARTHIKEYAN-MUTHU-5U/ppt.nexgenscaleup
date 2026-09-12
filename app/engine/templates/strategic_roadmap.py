#!/usr/bin/env python3
"""
Template 2: Strategic Transformation Roadmap & Horizon Timeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3-Horizon Architecture (H1 Now, H2 Next, H3 Future), 4 Workstream Lanes,
Quarterly milestones, animated emotes, and Strategic ROI summary cards.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from ..generator_core import (
    PALETTES, LW, bx, fl, ci, tx, tp, shadow, dash_bd,
    conn_arrow, conn_line, ad, ar, ln, emote_r, AnimationEngine
)

def build_strategic_roadmap(data, static_dir, out_path):
    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.50)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    eng = AnimationEngine()
    P1, P2, P3, P4, P5 = [], [], [], [], []

    branding = data.get("branding", {})
    palette_key = branding.get("palette", "obsidian_sapphire")
    C = PALETTES.get(palette_key, PALETTES["obsidian_sapphire"])

    def get_emote(name):
        p = os.path.join(static_dir, "emotes", f"{name}.gif")
        if not os.path.exists(p):
            p = os.path.join(static_dir, "emotes", "tb_robot.gif")
        return p

    logo_file = branding.get("logo_file", "philips.png")
    logo_path = os.path.join(static_dir, "logos", logo_file)

    canvas = fl(slide, 0, 0, 13.33, 7.50, C["canvas_bg"])

    # ─── 1. HEADER (Y: 0.00 to 0.62) ──────────────────────────────────
    hdr = fl(slide, 0, 0, 13.33, 0.62, C["hdr_bg"]); P1.append((hdr.shape_id, 0, 'fade'))
    stripe = fl(slide, 0, 0.62, 13.33, 0.025, C["stripe"]); P1.append((stripe.shape_id, 150, 'wr'))

    title_text = branding.get("title", "STRATEGIC TRANSFORMATION ROADMAP")
    sub_text = branding.get("subtitle", f"{branding.get('company_name', 'ENTERPRISE')}  •  3-YEAR DIGITAL ACCELERATION & AI MODERNIZATION")

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
        tp(pbadge.text_frame, branding.get("company_name", "PHILIPS"), sz=12, b=True, c=C["accent"], a=PP_ALIGN.CENTER)
        P1.append((pbadge.shape_id, 350, 'fade'))

    # ─── 2. HORIZON BANNERS (Y: 0.71 to 1.07) ─────────────────────────
    # 3 Horizons across X: 0.40 to 9.80, plus Strategic ROI dock on right (10.00 to 12.93)
    hz_data = [
        {"code": "H1: FOUNDATION", "time": "Month 0 – 12 | Stabilize & Standardize", "c": C["blue"], "x": 0.40, "w": 3.00},
        {"code": "H2: ACCELERATION", "time": "Month 12 – 24 | Scale & Automate", "c": C["amber"], "x": 3.60, "w": 3.00},
        {"code": "H3: COGNITIVE AI", "time": "Month 24 – 36 | Autonomous Ecosystem", "c": C["teal"], "x": 6.80, "w": 3.00},
    ]

    for i, h in enumerate(hz_data):
        hb = bx(slide, h["x"], 0.71, h["w"], 0.36, C["card_bg"], C["card_bd"], r=4000); shadow(hb, 10000, 5000, 7000)
        hbp = bx(slide, h["x"] + 0.08, 0.75, 1.20, 0.28, h["c"], None, r=3000)
        hbp.text_frame.margin_left = hbp.text_frame.margin_right = 0
        tp(hbp.text_frame, h["code"], sz=7.8, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)
        hbt = tx(slide, h["x"] + 1.35, 0.73, h["w"] - 1.40, 0.32)
        tp(hbt.text_frame, h["time"], sz=7.2, c=C["t3"])
        d = 500 + i * 150
        P1 += [(hb.shape_id, d, 'fade'), (hbp.shape_id, d + 30, 'zm'), (hbt.shape_id, d + 50, 'fade')]
        if i < 2:
            a = ar(slide, h["x"] + h["w"] + 0.04, 0.89, h["x"] + h["w"] + 0.16, C["t3"], w=LW); P1.append((a.shape_id, d + 90, 'wr'))

    # Top Right Strategic Target Header
    st_hdr = bx(slide, 10.00, 0.71, 2.93, 0.36, C["rose"], None, r=4000); shadow(st_hdr, 10000, 5000, 7000)
    tp(st_hdr.text_frame, "STRATEGIC VALUE TARGETS", sz=9.0, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)
    P1.append((st_hdr.shape_id, 950, 'fade'))

    # ─── 3. WORKSTREAM ROADMAP GRID (Y: 1.18 to 7.08) ─────────────────
    lanes = data.get("lanes", [
        {
            "name": "1. Operating Model & Governance",
            "h1": {"q": "Q1-Q2", "title": "Global Process Harmonization", "sub": "Establish unified ERP taxonomy & baseline KPIs.", "emote": "list"},
            "h2": {"q": "Q3-Q4", "title": "CoE Operating Hubs", "sub": "Transition to shared triage centers & SLA governance.", "emote": "spec"},
            "h3": {"q": "Q7-Q8", "title": "Continuous Touchless Governance", "sub": "Fully automated zero-exception policy enforcement.", "emote": "tb_audit"}
        },
        {
            "name": "2. Core Cloud & Enterprise Platforms",
            "h1": {"q": "Q1-Q3", "title": "Legacy ERP Connector Rollout", "sub": "Consolidate SAP & non-SAP interface pipelines.", "emote": "idoc"},
            "h2": {"q": "Q4-Q6", "title": "Cloud Integration Fabric", "sub": "Automated document OCR & real-time webhook sync.", "emote": "hwi"},
            "h3": {"q": "Q7-Q10", "title": "Self-Healing API Grid", "sub": "Autonomous synthetic interface reconciliation.", "emote": "no_edi"}
        },
        {
            "name": "3. Intelligent Automation & Agentic AI",
            "h1": {"q": "Q2-Q4", "title": "Rule-Based Auto-Triage", "sub": "Direct routing of common posting delta mismatches.", "emote": "filter"},
            "h2": {"q": "Q5-Q7", "title": "Predictive Matching Copilot", "sub": "AI agent drafts clearing journals & counterparty emails.", "emote": "review"},
            "h3": {"q": "Q8-Q12", "title": "Autonomous Ledger Resolution", "sub": "End-to-end self-clearing bot ecosystem.", "emote": "tb_robot"}
        },
        {
            "name": "4. Cash & Working Capital Optimization",
            "h1": {"q": "Q1-Q2", "title": "Cash Aging Triage Diagnostic", "sub": "Identify reciprocal unapplied cash bottlenecks.", "emote": "cash"},
            "h2": {"q": "Q3-Q6", "title": "Automated Counterparty Chasing", "sub": "Multi-tier SLA notification matrices triggered.", "emote": "notif"},
            "h3": {"q": "Q7-Q12", "title": "Dynamic Liquidity Balancing", "sub": "Real-time automated intercompany debt netting.", "emote": "ap_ar"}
        }
    ])

    lane_ys = [1.22, 2.70, 4.18, 5.66]
    lane_h = 1.34

    for l_idx, lane in enumerate(lanes[:4]):
        ly = lane_ys[l_idx]
        
        # Lane Tag Ribbon
        ltag = bx(slide, 0.40, ly, 2.50, 0.22, C["hdr_bg"], None, r=3000)
        tp(ltag.text_frame, lane["name"].upper(), sz=7.0, b=True, c=C["card_bg"])
        P2.append((ltag.shape_id, 100 + l_idx * 100, 'fade'))

        # Cards for H1, H2, H3
        h_keys = ["h1", "h2", "h3"]
        for h_idx, hk in enumerate(h_keys):
            card_info = lane.get(hk, {})
            cx = hz_data[h_idx]["x"]
            cw = hz_data[h_idx]["w"]
            card_y = ly + 0.26
            ch = lane_h - 0.26

            c_box = bx(slide, cx, card_y, cw, ch, C["card_bg"], C["card_bd"], r=4000)
            shadow(c_box, 8000, 4000, 6000)

            # Target Quarter Badge
            qp = bx(slide, cx + 0.10, card_y + 0.08, 0.68, 0.20, hz_data[h_idx]["c"], None, r=2000)
            tp(qp.text_frame, card_info.get("q", "Q1"), sz=6.8, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)

            # Emote with soft glow
            eg, ee = emote_r(slide, get_emote(card_info.get("emote", "spec")), cx, card_y, cw, ch, C["accent_g"], 0.44)

            # Text
            ctx = tx(slide, cx + 0.10, card_y + 0.32, cw - 0.68, ch - 0.36)
            tp(ctx.text_frame, card_info.get("title", "Milestone Title"), sz=9.2, b=True, c=C["t1"])
            tp(ctx.text_frame, card_info.get("sub", ""), sz=7.2, c=C["t3"], sb=2.0)

            d_val = 200 + l_idx * 120 + h_idx * 60
            P3 += [(c_box.shape_id, d_val, 'fade'), (qp.shape_id, d_val + 20, 'zm'),
                   (eg.shape_id, d_val + 30, 'fade'), (ee.shape_id, d_val + 40, 'ep'), (ctx.shape_id, d_val + 50, 'fade')]

            # Connectors between H1 -> H2 -> H3
            if h_idx < 2:
                arrow_y = card_y + ch / 2
                conn_a = ar(slide, cx + cw, arrow_y, hz_data[h_idx + 1]["x"], hz_data[h_idx]["c"], w=LW)
                P3.append((conn_a.shape_id, d_val + 70, 'wr'))

    # ─── 4. STRATEGIC VALUE & ROI DOCK (Right Column: X: 10.00, W: 2.93) 
    roi_cards = data.get("roi_metrics", [
        {"metric": "$18.5M", "label": "Net Run-Rate Operational Savings", "sub": "Direct FTE redeployment & cost takeout", "c": C["blue"]},
        {"metric": "85%", "label": "Straight-Through Touchless Processing", "sub": "Auto-reconciled intercompany items", "c": C["teal"]},
        {"metric": "–70%", "label": "Dispute Resolution Cycle Time", "sub": "Reduced from 14 days to under 72h", "c": C["amber"]},
        {"metric": "100%", "label": "Continuous SOX Audit Readiness", "sub": "Complete immutable digital trail", "c": C["rose"]}
    ])

    for r_idx, rc in enumerate(roi_cards[:4]):
        ry = lane_ys[r_idx] + 0.12
        rw = 2.93
        rh = lane_h - 0.12

        r_box = bx(slide, 10.00, ry, rw, rh, C["card_bg"], C["card_bd"], r=5000)
        shadow(r_box, 10000, 5000, 7000)
        r_bar = fl(slide, 10.00, ry + 0.08, 0.045, rh - 0.16, rc["c"])

        rtx = tx(slide, 10.16, ry + 0.10, rw - 0.28, rh - 0.20)
        p_m = tp(rtx.text_frame, rc["metric"], sz=15, b=True, c=rc["c"])
        p_l = tp(rtx.text_frame, rc["label"], sz=8.6, b=True, c=C["t1"], sb=1.5)
        p_s = tp(rtx.text_frame, rc["sub"], sz=7.0, c=C["t3"], sb=1.5)

        d_r = 600 + r_idx * 100
        P4 += [(r_box.shape_id, d_r, 'fade'), (r_bar.shape_id, d_r + 20, 'fade'), (rtx.shape_id, d_r + 40, 'fade')]

    # ─── 5. COMPILE & SAVE ─────────────────────────────────────────────
    eng.add(P1); eng.add(P2); eng.add(P3); eng.add(P4)
    eng.build(slide)
    prs.save(out_path)
    return out_path
