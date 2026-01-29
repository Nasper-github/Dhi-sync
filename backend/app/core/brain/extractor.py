import os
import json
import re
from typing import List
import google.generativeai as genai
from docx import Document
import io
from dotenv import load_dotenv

load_dotenv()

class ExtractionService:
    """
    Surgical Template & Intelligence Service
    Deconstructs a Master Contract into a High-Fidelity 'Symbolic Skeleton' (60-100 nodes).
    Optimized for independent, lossless automated drafting.
    """
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("🚨 ERROR: ExtractionService initialized without GOOGLE_API_KEY.")
        else:
            print("🧠 Surgical Brain: Key detected. Entering High-Fidelity Mode.")
            
        genai.configure(api_key=api_key)
        # Using Gemini 2.5 Flash for speed and high token output capacity
        self.model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')

    def _clean_json_response(self, text: str) -> str:
        """
        Cleans the AI response to handle markdown blocks and invalid control characters.
        """
        # 1. Remove markdown code blocks if present
        text = re.sub(r'```json\s*|\s*```', '', text).strip()
        
        # 2. Handle invalid control characters (newlines/tabs inside strings)
        # This replaces literal control characters that break json.loads
        # but preserves intended escaped sequences like \n
        text = re.sub(r'[\x00-\x1F\x7F]', '', text)
        
        return text

    async def extract_playbook(self, file_content: bytes, filename: str) -> List[dict]:
        """
        Deconstructs a Master Contract into an exhaustive sequence of atomized nodes.
        """
        print(f"📥 Received file for high-fidelity deconstruction: {filename}")
        
        text = ""
        try:
            if filename.lower().endswith('.docx'):
                doc = Document(io.BytesIO(file_content))
                paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
                text = "\n".join(paragraphs)
            else:
                text = file_content.decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"❌ File Parsing Failure: {str(e)}")
            text = f"File Parsing Error: {str(e)}"

        # Guardrail for extremely large files to prevent 400 error
        char_limit = 400000 
        if len(text) > char_limit:
            text = text[:char_limit] + "... [TRUNCATED]"

        print(f"📊 Sending {len(text)} characters for Recursive Atomization...")

        system_prompt = """
        You are a Senior Legal Systems Architect. Your mission is to deconstruct this Master Contract into a HIGH-FIDELITY 'Symbolic Skeleton' (60-100 nodes).
        This skeleton must be so granular that it can be used to mathematically reconstruct the original document.

        CRITICAL ARCHITECTURAL RULES:
        1. RECURSIVE ATOMIZATION: Map the document sequentially. Break EVERY sub-clause into its own node.
        2. NO CHUNKING: One node = one specific thought or rule. 
        3. DYNAMIC PARAMETERIZATION: Replace every variable (dates, currency, names) with {{VARIABLE_NAME}}.
        4. CATEGORIZATION: STRUCTURE (Headings), LOGIC (Variables/Conditions), BOILERPLATE (Fixed text).
        5. JSON INTEGRITY: Ensure the output is valid JSON. Escape all double quotes within strings and do not include raw control characters.

        OUTPUT FORMAT:
        Return a valid JSON array of objects. Each object MUST have:
        - "type": "STRUCTURE", "LOGIC", or "BOILERPLATE".
        - "title": A precise, uppercase section code.
        - "content": The exact text (with {{PLACEHOLDERS}}).
        - "reasoning": The legal significance of this specific atom.

        GRANULARITY GOAL: 60 to 100 nodes.
        """
        
        try:
            # Absolute precision mode
            response = await self.model.generate_content_async(
                f"{system_prompt}\n\nCONTRACT CONTENT:\n{text}",
                generation_config={
                    "response_mime_type": "application/json", 
                    "temperature": 0.1 
                }
            )
            
            # Clean the response before attempting to parse
            cleaned_text = self._clean_json_response(response.text)
            raw_nodes = json.loads(cleaned_text)
            
            print(f"✨ Successfully deconstructed into {len(raw_nodes)} High-Fidelity nodes.")
            
            return [{
                "id": f"node_{i}_{filename.split('.')[0]}",
                "type": item.get("type", "BOILERPLATE").upper(),
                "title": item.get("title", "Unnamed Node").replace("_", " ").title(),
                "content": item.get("content", ""),
                "reasoning": item.get("reasoning", "Essential drafting component."),
                "approved": False
            } for i, item in enumerate(raw_nodes)]

        except Exception as e:
            print(f"💥 High-Fidelity Deconstruction failed: {str(e)}")
            # Log the raw text for debugging in the terminal if parsing fails
            if 'response' in locals():
                print(f"--- RAW RESPONSE START ---\n{response.text[:500]}...\n--- RAW RESPONSE END ---")
                
            return [{
                "id": "err_decon_fail",
                "type": "STRUCTURE",
                "title": "Atomization Engine Error",
                "content": "The engine failed to achieve high-fidelity mapping due to a formatting error.",
                "reasoning": f"JSON Parsing Error: {str(e)}",
                "isError": True
            }]