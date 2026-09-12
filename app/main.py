#!/usr/bin/env python3
"""
FastAPI Server for Executive Presentation Studio & Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provides REST API for template inspection, live emote catalog,
and native OpenXML PPTX generation and PNG rendering.
"""

import os, sys, uuid, json, subprocess
from fastapi import FastAPI, HTTPException, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# Add parent directory to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
OUTPUTS_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUTS_DIR, exist_ok=True)

from .engine.templates import TEMPLATES
from .engine.generator_core import PALETTES

app = FastAPI(title="Executive PPT Studio API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Executive PPT Studio"}

@app.get("/api/templates")
def get_templates():
    out = []
    for tid, info in TEMPLATES.items():
        out.append({
            "id": tid,
            "name": info["name"],
            "category": info["category"],
            "description": info["description"]
        })
    return {"templates": out}

@app.get("/api/palettes")
def get_palettes():
    out = {}
    for pid, pdata in PALETTES.items():
        out[pid] = {
            "name": pdata["name"],
            "hdr_bg": f"#{pdata['hdr_bg']:06X}",
            "accent": f"#{pdata['accent']:06X}",
            "stripe": f"#{pdata['stripe']:06X}"
        }
    return {"palettes": out}

@app.get("/api/emotes")
def get_emotes():
    emotes_dir = os.path.join(STATIC_DIR, "emotes")
    emotes = []
    if os.path.exists(emotes_dir):
        for f in sorted(os.listdir(emotes_dir)):
            if f.endswith(".gif"):
                key = f.replace(".gif", "")
                emotes.append({
                    "id": key,
                    "filename": f,
                    "url": f"/emotes/{f}"
                })
    return {"emotes": emotes}

@app.get("/api/logos")
def get_logos():
    logos_dir = os.path.join(STATIC_DIR, "logos")
    logos = []
    if os.path.exists(logos_dir):
        for f in sorted(os.listdir(logos_dir)):
            if f.endswith(".png") or f.endswith(".jpg"):
                logos.append({
                    "id": f.replace(".png", "").replace(".jpg", ""),
                    "filename": f,
                    "url": f"/logos/{f}"
                })
    return {"logos": logos}

@app.post("/api/upload-logo")
async def upload_logo(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail="Only PNG and JPEG images are supported")
    fname = f"custom_{uuid.uuid4().hex[:8]}{ext}"
    dest = os.path.join(STATIC_DIR, "logos", fname)
    with open(dest, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"status": "ok", "filename": fname, "url": f"/logos/{fname}"}

@app.post("/api/generate")
def generate_pptx(payload: dict = Body(...)):
    tid = payload.get("template_id", "process_flow")
    if tid not in TEMPLATES:
        raise HTTPException(status_code=400, detail=f"Unknown template ID: {tid}")
    
    file_id = uuid.uuid4().hex[:8]
    company = payload.get("branding", {}).get("company_name", "Presentation").replace(" ", "_")
    out_filename = f"{company}_{tid}_{file_id}.pptx"
    out_path = os.path.join(OUTPUTS_DIR, out_filename)

    builder = TEMPLATES[tid]["builder"]
    try:
        builder(payload, STATIC_DIR, out_path)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating PPTX: {str(e)}")

    return FileResponse(
        out_path,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename=out_filename
    )

@app.post("/api/export-png")
def export_png(payload: dict = Body(...)):
    tid = payload.get("template_id", "process_flow")
    if tid not in TEMPLATES:
        raise HTTPException(status_code=400, detail=f"Unknown template ID: {tid}")

    file_id = uuid.uuid4().hex[:8]
    pptx_path = os.path.join(OUTPUTS_DIR, f"temp_{file_id}.pptx")
    png_path = os.path.join(OUTPUTS_DIR, f"render_{file_id}.png")

    builder = TEMPLATES[tid]["builder"]
    try:
        builder(payload, STATIC_DIR, pptx_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PPTX Build Error: {str(e)}")

    # Headless PowerPoint COM export
    ps_cmd = f"""
    Get-Process POWERPNT -ErrorAction SilentlyContinue | Stop-Process -Force
    $ppt = New-Object -ComObject PowerPoint.Application
    $pres = $ppt.Presentations.Open('{pptx_path}', 0, 0, 0)
    $pres.Slides(1).Export('{png_path}', 'PNG', 1920, 1080)
    $pres.Close()
    $ppt.Quit()
    """
    try:
        subprocess.run(["powershell", "-Command", ps_cmd], check=True, timeout=15)
        if os.path.exists(png_path):
            return FileResponse(png_path, media_type="image/png", filename=f"slide_{file_id}.png")
    except Exception as e:
        pass

    raise HTTPException(status_code=500, detail="PowerPoint COM PNG export unavailable")

# Mount static frontend
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
