from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

# 1. Router Imports
# This connects our API to the Extraction service we just built
from app.api.v1.extractor import router as extractor_router
from app.core.brain.ingestion.parser import SurgicalParser

# Setup logging to track "Surgical" events in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sync-core")

app = FastAPI(
    title="Sync Intelligence Core",
    description="Neuro-Symbolic Legal Drafting Engine",
    version="2.0.0"
)

# --- THE HANDSHAKE (CORS) ---
# Mandatory to allow your React frontend (port 5173) 
# to securely communicate with this backend (port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. REGISTER ROUTERS
# This makes the /api/v1/extract endpoint accessible to the frontend
app.include_router(extractor_router, prefix="/api/v1", tags=["Extraction"])

# Initialize the Scalpel for intake
parser = SurgicalParser()

@app.get("/")
async def health_check():
    """Confirms the Surgical Engine is operational."""
    return {
        "status": "online",
        "engine": "Surgical_v2",
        "message": "Sync Intelligence Core is ready for surgery."
    }

@app.post("/api/v1/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """
    PHASE 4, STAGE 1: INTELLIGENT INTAKE
    Receives a document, dissects it into the Symbolic DSD XML,
    and returns the structured object to the Frontend.
    Used for general ingestion (Pillar C).
    """
    logger.info(f"Ingestion triggered for: {file.filename}")
    
    # Pillar C: We only operate on structured .docx for general ingestion
    if not file.filename.lower().endswith('.docx'):
        raise HTTPException(
            status_code=400,
            detail="Error: Only .docx files are supported for surgical intake."
        )

    try:
        content = await file.read()
        
        # Executes the DSD Schema Mapping logic
        dsd_xml = parser.parse_docx_to_dsd(content)
        
        logger.info("Successfully generated Symbolic DSD Schema.")
        
        return {
            "filename": file.filename,
            "schema_type": "DSD_XML",
            "dsd": dsd_xml,
            "status": "SUCCESS"
        }
    except Exception as e:
        logger.error(f"Intake Failure: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Surgical Error during parsing: {str(e)}"
        )

if __name__ == "__main__":
    # Start the engine on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)