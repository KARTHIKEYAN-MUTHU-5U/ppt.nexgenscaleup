from .process_flow import build_process_flow
from .strategic_roadmap import build_strategic_roadmap
from .operating_model import build_operating_model
from .data_pipeline import build_data_pipeline
from .kpi_scorecard import build_kpi_scorecard

TEMPLATES = {
    "process_flow": {
        "id": "process_flow",
        "name": "Process Flow & Decision Tree",
        "category": "Operations & Finance",
        "description": "Multi-track triage blueprint with symmetrical decision tree, convergence bus, and multi-tier SLA escalation matrix.",
        "builder": build_process_flow
    },
    "strategic_roadmap": {
        "id": "strategic_roadmap",
        "name": "Strategic Transformation Roadmap",
        "category": "Strategy & Executive",
        "description": "3-Horizon acceleration timeline (Now, Next, Future) across 4 workstream lanes with quarterly milestones and strategic ROI metrics.",
        "builder": build_strategic_roadmap
    },
    "operating_model": {
        "id": "operating_model",
        "name": "Target Operating Model (TOM)",
        "category": "Organization & Governance",
        "description": "3-tier functional architecture (Steering, CoE, Shared Hubs) with role ownership and an end-to-end RACI governance matrix.",
        "builder": build_operating_model
    },
    "data_pipeline": {
        "id": "data_pipeline",
        "name": "Enterprise AI & Data Pipeline",
        "category": "Technology & AI",
        "description": "4-stage pipeline (Ingestion, Lakehouse, Agentic AI, Consumption) with latency SLAs and a security/compliance guardrail sidebar.",
        "builder": build_data_pipeline
    },
    "kpi_scorecard": {
        "id": "kpi_scorecard",
        "name": "Executive KPI Scorecard",
        "category": "Executive & Board",
        "description": "4 top KPI summary cards with RAG health bars, strategic pillar deep-dives, and an accountability action plan.",
        "builder": build_kpi_scorecard
    }
}
