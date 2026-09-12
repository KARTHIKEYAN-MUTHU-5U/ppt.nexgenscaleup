#!/usr/bin/env python3
"""
Template 3: Target Operating Model (TOM) & Capability Grid
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3-tier functional layers (Steering, CoE/Operations, Shared Hubs),
capability cards with animated emotes, and an end-to-end RACI governance dock.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from ..generator_core import (
    PALETTES, LW, bx, fl, ci, tx, tp, shadow, dash_bd,
    conn_arrow, conn_line, ad, ar, ln, emote_r, AnimationEngine
)

def build_operating_model(data, static_dir, out_path):
    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.50)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    eng = AnimationEngine()
    P1, P2, P3, P4 = [], [], [], []

    branding = data.get("branding", {})
    palette_key = branding.get("palette", "slate_emerald")
    C = PALETTES.get(palette_key, PALETTES["slate_emerald"])

    def get_emote(name):
        p = os.path.join(static_dir, "emotes", f"{name}.gif")
        if not os.path.exists(p):
            p = os.path.join(static_dir, "emotes", "tb_rbac.gif")
        return p

    logo_file = branding.get("logo_file", "philips.png")
    logo_path = os.path.join(static_dir, "logos", logo_file)

    canvas = fl(slide, 0, 0, 13.33, 7.50, C["canvas_bg"])

    # ─── 1. HEADER (Y: 0.00 to 0.62) ──────────────────────────────────
    hdr = fl(slide, 0, 0, 13.33, 0.62, C["hdr_bg"]); P1.append((hdr.shape_id, 0, 'fade'))
    stripe = fl(slide, 0, 0.62, 13.33, 0.025, C["stripe"]); P1.append((stripe.shape_id, 150, 'wr'))

    title_text = branding.get("title", "TARGET OPERATING MODEL & CAPABILITY GRID")
    sub_text = branding.get("subtitle", f"{branding.get('company_name', 'GLOBAL SHARED SERVICES')}  •  MULTI-TIER FUNCTIONAL ARCHITECTURE & GOVERNANCE")

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

    # ─── 2. 3 FUNCTIONAL TIERS (Y: 0.74 to 5.75) ──────────────────────
    tiers = data.get("tiers", [
        {
            "tier_name": "TIER 1: STRATEGY & GLOBAL GOVERNANCE",
            "tier_sub": "Executive Steering, Audit Policy, Capitalnet Netting & Escalation Sign-Off",
            "color": C["blue"],
            "capabilities": [
                {"title": "Global Accounting Steering", "role": "Entity Finance Director", "desc": "Executive policy mandate & GAAP compliance.", "emote": "spec"},
                {"title": "Bilateral Dispute Board", "role": "FSS Shared Services VP", "desc": "Executive escalation arbitration & resolution.", "emote": "esc"},
                {"title": "Statutory SOX Compliance", "role": "Chief Audit Officer", "desc": "Quarterly balance sheet substantiation.", "emote": "tb_audit"},
                {"title": "Liquidity & Netting Desk", "role": "Treasury Director", "desc": "Multi-currency settlement clearing.", "emote": "cash"}
            ]
        },
        {
            "tier_name": "TIER 2: CENTERS OF EXCELLENCE (CoE) & TRIAGE",
            "tier_sub": "Exception Forensics, SAP Hand Work Instructions (HWI), AI Model Operations",
            "color": C["amber"],
            "capabilities": [
                {"title": "Forensic Ledger Triage", "role": "Senior Accountant", "desc": "Sub-ledger vs General Ledger delta isolation.", "emote": "qlik"},
                {"title": "Interface & HWI Troubleshoot", "role": "SAP Techno-Functional Lead", "desc": "EDI/IDoc syntax exception recovery.", "emote": "hwi"},
                {"title": "Automated Matching Ops", "role": "Intelligent Automation Lead", "desc": "Supervised rules & OCR pipeline tuning.", "emote": "review"},
                {"title": "Counterparty Outreach Hub", "role": "Intercompany Lead", "desc": "Bilateral SLA enforcement & chasing.", "emote": "notif"}
            ]
        },
        {
            "tier_name": "TIER 3: SHARED TRANSACTION SERVICE HUBS",
            "tier_sub": "Scalable Execution, High-Volume Matching, Automated Bot Fleet Operations",
            "color": C["teal"],
            "capabilities": [
                {"title": "Qlik Extract & Cleansing", "role": "RPA Bot Runner", "desc": "Scheduled automated ledger ingestion.", "emote": "list"},
                {"title": "Paper Invoice OCR Intake", "role": "Document Processing Hub", "desc": "Auto-fetch PDF & tax metadata parsing.", "emote": "inv"},
                {"title": "Clearing Journal Posting", "role": "Accounting Processor", "desc": "Standard posting runs for verified pairs.", "emote": "tb_write"},
                {"title": "Unapplied Cash Clearing", "role": "AR Settlement Team", "desc": "Bank payment reciprocal ledger allocation.", "emote": "ap_ar"}
            ]
        }
    ])

    tier_ys = [0.74, 2.42, 4.10]
    tier_h = 1.56
    cap_w = 2.92
    cap_gap = 0.20
    cap_xs = [0.40, 0.40 + cap_w + cap_gap, 0.40 + (cap_w + cap_gap) * 2, 0.40 + (cap_w + cap_gap) * 3]

    for t_idx, tier in enumerate(tiers[:3]):
        ty = tier_ys[t_idx]
        
        # Tier Title Strip
        tbar = bx(slide, 0.40, ty, 12.53, 0.28, C["card_bg"], C["card_bd"], r=3000)
        shadow(tbar, 6000, 3000, 5000)
        t_pill = bx(slide, 0.48, ty + 0.04, 2.60, 0.20, tier["color"], None, r=2000)
        tp(t_pill.text_frame, tier["tier_name"], sz=7.2, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)
        ttx = tx(slide, 3.20, ty + 0.04, 9.60, 0.20)
        tp(ttx.text_frame, tier["tier_sub"], sz=7.0, c=C["t3"])
        
        P2 += [(tbar.shape_id, 100 + t_idx * 150, 'fade'), (t_pill.shape_id, 120 + t_idx * 150, 'zm'), (ttx.shape_id, 140 + t_idx * 150, 'fade')]

        # 4 Capability Cards in this tier
        for c_idx, cap in enumerate(tier.get("capabilities", [])[:4]):
            cx = cap_xs[c_idx]
            card_y = ty + 0.32
            ch = tier_h - 0.36

            c_box = bx(slide, cx, card_y, cap_w, ch, C["card_bg"], C["card_bd"], r=4000)
            shadow(c_box, 8000, 4000, 6000)
            c_accent = fl(slide, cx, card_y + 0.08, 0.04, ch - 0.16, tier["color"])

            eg, ee = emote_r(slide, get_emote(cap.get("emote", "spec")), cx, card_y, cap_w, ch, C["accent_g"], 0.44)

            ctx = tx(slide, cx + 0.12, card_y + 0.10, cap_w - 0.68, ch - 0.20)
            tp(ctx.text_frame, cap.get("title", "Capability"), sz=9.2, b=True, c=C["t1"])
            tp(ctx.text_frame, cap.get("role", "Owner Role"), sz=7.4, b=True, c=tier["color"], sb=2.0)
            tp(ctx.text_frame, cap.get("desc", ""), sz=6.8, c=C["t3"], sb=2.0)

            d_val = 200 + t_idx * 150 + c_idx * 50
            P2 += [(c_box.shape_id, d_val, 'fade'), (c_accent.shape_id, d_val + 10, 'fade'),
                   (eg.shape_id, d_val + 20, 'fade'), (ee.shape_id, d_val + 30, 'ep'), (ctx.shape_id, d_val + 40, 'fade')]

    # ─── 3. RACI GOVERNANCE DOCK (Bottom: Y: 5.86 to 7.18, H: 1.32) ───
    raci_box = bx(slide, 0.40, 5.86, 12.53, 1.32, C["card_bg"], C["card_bd"], r=5000)
    shadow(raci_box, 12000, 6000, 8000)
    dash_bd(raci_box, C["ctn_bd"], 1.5, 'lgDash')

    raci_pill = bx(slide, 0.54, 5.76, 2.40, 0.22, C["hdr_bg"], None, r=3000)
    tp(raci_pill.text_frame, "END-TO-END RACI GOVERNANCE MATRIX", sz=7.0, b=True, c=C["card_bg"], a=PP_ALIGN.CENTER)
    P3 += [(raci_box.shape_id, 650, 'fade'), (raci_pill.shape_id, 680, 'zm')]

    raci_cols = [
        {"role": "Responsible (R)", "owner": "Shared Services Processor", "items": "• Execute daily ledger extraction\n• Document OCR invoice matching\n• Submit clearing requests in SAP", "c": C["blue"]},
        {"role": "Accountable (A)", "owner": "CoE Accounting Lead", "items": "• Verify delta root-cause taxonomy\n• Supervise HWI exception work\n• Authorize post-triage journals", "c": C["amber"]},
        {"role": "Consulted (C)", "owner": "Reciprocal Entity Lead", "items": "• Confirm unmatched billing details\n• Validate tax code and PO notes\n• Provide credit memo authorization", "c": C["teal"]},
        {"role": "Informed (I)", "owner": "Entity Finance Director & Audit", "items": "• Receive SLA breach escalation notices\n• Review month-end open delta totals\n• Sign off un-cleared reserves note", "c": C["rose"]}
    ]

    for rc_idx, rc in enumerate(raci_cols):
        rx = cap_xs[rc_idx]
        ry = 6.06
        rw = cap_w
        rh = 1.02

        rc_card = bx(slide, rx, ry, rw, rh, C["accent_l"], C["card_bd"], r=3000)
        rc_tag = fl(slide, rx, ry + 0.06, 0.04, rh - 0.12, rc["c"])

        rtx = tx(slide, rx + 0.10, ry + 0.06, rw - 0.16, rh - 0.12)
        tp(rtx.text_frame, rc["role"], sz=8.2, b=True, c=rc["c"])
        tp(rtx.text_frame, rc["owner"], sz=7.2, b=True, c=C["t1"], sb=1.0)
        tp(rtx.text_frame, rc["items"], sz=6.6, c=C["t3"], sb=2.0)

        d_raci = 720 + rc_idx * 60
        P3 += [(rc_card.shape_id, d_raci, 'fade'), (rc_tag.shape_id, d_raci + 10, 'fade'), (rtx.shape_id, d_raci + 20, 'fade')]

    eng.add(P1); eng.add(P2); eng.add(P3)
    eng.build(slide)
    prs.save(out_path)
    return out_path
