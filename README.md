Project Sync: Intelligence Core

This repository contains the source code for the Surgical Legal Engine. This platform is designed to transform messy, unstructured legal documents into precise, actionable data structures.



Architecture Overview

Project Sync operates on a Neuro-Symbolic architecture. Unlike standard legal AI, we do not process text as mere strings; we treat documents as Symbolic Trees (DSD XML) and Relational Graphs (Neo4j).



The Stack by Role

AI Engineers: LangGraph for agentic loops, OpenAI/Gemini for reasoning, and Neo4j for Structural GraphRAG.

Frontend Developers: React (Vite) with Tailwind CSS v4, focusing on a high-fidelity "Apple-style" light aesthetic for the workspace.

Backend Developers: FastAPI (Python) using lxml and python-docx for lossless structural dissection.



Folder Structure

/backend: FastAPI server and AI Logic.

/app/core/brain/ingestion: The Surgical Parser (DOCX -> DSD XML).

/app/core/brain/reasoning: Agentic logic and PAKTON loops.

/sync-app: React (Vite) Frontend.

/src/features: Vertical Slice organization (Reception, Draft, etc.).




Setup Guide

1. General Setup

Clone the Repo: git clone <repo-url>

Environment: Copy .env.example to .env. Each developer must provide their own API keys for local testing.

2. Backend & AI Engineers

cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
export PYTHONPATH=$PYTHONPATH:.
python3 -m app.main


3. Frontend Developers

cd sync-app
npm install
npm run dev





Role-Specific Milestones

Frontend (UI/UX)

[ ] The HUD: Build the real-time collaborative highlighting system.
[ ] Contextual HUD: Create the "Surgical Menu" that appears when text is selected.


AI & Data Engineering

[ ] GraphRAG: Integrate Neo4j to track cross-references between clauses.
[ ] The Interrogator: Implement the Veto loop to check AI drafts against firm playbooks.


Backend & Infrastructure

[ ] Lossless Handoff: Ensure the DSD XML can be converted back to .docx without losing a single pixel of formatting.


Security & Standards

CyberSec Rule: NEVER commit the .env file. It is ignored by Git by default.
Pillar C (Lossless): Never use libraries that strip XML metadata. Formatting is legal data.
Vertical Slices: When adding a new feature, keep the UI, logic, and state within that feature's folder.


Project Sync is the transition from "Managing Documents" to "Operating on Intelligence."



