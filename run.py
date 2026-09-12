#!/usr/bin/env python3
"""
NexGen Slide Studio - Local Launcher
Starts FastAPI with Uvicorn on http://localhost:8500
"""

import uvicorn

if __name__ == "__main__":
    print("Starting NexGen Slide Studio on http://localhost:8500 ...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8500, reload=True)
