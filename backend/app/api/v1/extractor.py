from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.brain.extractor import ExtractionService

# Create the router for version 1 of the API
router = APIRouter()

# Instantiate the Surgical Intelligence Service
extractor_service = ExtractionService()

@router.post("/extract")
async def extract_contract_mandates(file: UploadFile = File(...)):
    """
    Receives a master contract (.docx or .pdf) from the Frontend.
    Calls the Gemini Surgical Extraction service to identify Logic and Boilerplate nodes.
    """
    
    # 1. Preliminary extension validation
    if not file.filename.lower().endswith(('.docx', '.pdf')):
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file format. Please upload a .docx or .pdf file."
        )
    
    try:
        # 2. Read the file into memory as bytes
        # This is passed to the extraction service to avoid saving temp files
        file_content = await file.read()
        
        # 3. Trigger the Brain logic you just updated in core/brain/extractor.py
        mandates = await extractor_service.extract_playbook(file_content, file.filename)
        
        # 4. Return the standard payload expected by the Frontend review HUD
        return {
            "filename": file.filename,
            "mandates": mandates,
            "status": "SUCCESS"
        }
        
    except Exception as e:
        # Log the error for backend debugging
        print(f"Surgical API Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI extraction service failed: {str(e)}"
        )